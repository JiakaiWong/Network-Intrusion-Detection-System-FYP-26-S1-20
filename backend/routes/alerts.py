from datetime import datetime
from typing import Optional, Dict, Any
import os

from fastapi import APIRouter, HTTPException, Security
import httpx
from core.security import get_current_user

from pydantic import BaseModel

from services.alert_service import get_collection, SEVERITY_LABELS, ALLOWED_STATUS
from services.user_service import get_users_with_telegram_id, get_user_by_email
from services.geolocation_service import get_location_from_ip

router = APIRouter(prefix="/api", tags=["Alerts"])

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")


async def send_telegram_message(chat_id: str, text: str):
    if not BOT_TOKEN or not chat_id or not text:
        return None
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    async with httpx.AsyncClient() as client:
        res = await client.post(url, json={"chat_id": chat_id, "text": text})
    return res


SEVERITY_THRESHOLD = 2


class AlertIn(BaseModel):
    timestamp: str
    src_ip: str
    dest_ip: str
    signature: str
    severity: int
    src_port: Optional[int] = None
    dest_port: Optional[int] = None
    proto: Optional[str] = None
    category: Optional[str] = None
    sid: Optional[int] = None


class StatusUpdate(BaseModel):
    status: str


class NoteIn(BaseModel):
    text: str


class AlertUpdate(BaseModel):
    dest_ip: Optional[str] = None
    src_ip: Optional[str] = None
    signature: Optional[str] = None
    severity: Optional[int] = None


@router.get("/")
def home():
    return {"ok": True, "message": "IDS backend is running"}


@router.get("/health")
def health():
    collection = get_collection()
    return {"ok": True, "mongo_connected": collection is not None}


@router.post("/ingest/alerts", status_code=201)
async def ingest_alert(alert: AlertIn):
    collection = get_collection()
    if collection is None:
        raise HTTPException(status_code=500, detail="MongoDB not connected")

    doc = alert.model_dump()
    doc["severity_label"] = SEVERITY_LABELS.get(doc["severity"], "unknown")
    doc["status"] = "new"
    doc["notes"] = []
    doc["created_at"] = datetime.utcnow().isoformat()
    
    # Add geolocation data for destination IP
    dest_location = get_location_from_ip(doc["dest_ip"])
    if dest_location:
        doc["dest_location"] = dest_location
    
    # Optionally add geolocation for source IP (internal network usually won't resolve)
    src_location = get_location_from_ip(doc["src_ip"])
    if src_location:
        doc["src_location"] = src_location

    result = collection.insert_one(doc)
    alert_id = str(result.inserted_id)
    collection.update_one({"_id": result.inserted_id}, {"$set": {"id": alert_id}})

    if doc["severity"] <= SEVERITY_THRESHOLD:
        location_info = ""
        if dest_location:
            location_info = f" ({dest_location.get('city', 'Unknown')}, {dest_location.get('country', 'Unknown')})"
        text = f"🚨 Alert: {doc['signature']} from {doc['src_ip']} to {doc['dest_ip']}{location_info}, severity {doc['severity_label']}"
        users = await get_users_with_telegram_id()
        for user in users:
            await send_telegram_message(user["telegram_id"], text)

    return {"ok": True, "id": alert_id}


@router.get("/alerts")
def get_alerts(
    severity: Optional[int] = None,
    src_ip: Optional[str] = None,
    dest_ip: Optional[str] = None,
    proto: Optional[str] = None,
    status: Optional[str] = None,
):
    collection = get_collection()
    if collection is None:
        raise HTTPException(status_code=500, detail="MongoDB not connected")

    query = {}
    if severity is not None:
        query["severity"] = severity
    if src_ip:
        query["src_ip"] = src_ip
    if dest_ip:
        query["dest_ip"] = dest_ip
    if proto:
        query["proto"] = proto
    if status:
        query["status"] = status.lower().strip()

    alerts = list(collection.find(query, {"_id": 0}).sort("created_at", -1))
    return {"ok": True, "items": alerts}


@router.get("/alerts/{alert_id}")
def get_alert(alert_id: str):
    collection = get_collection()
    if collection is None:
        raise HTTPException(status_code=500, detail="MongoDB not connected")

    alert = collection.find_one({"id": alert_id}, {"_id": 0})
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    return {"ok": True, "item": alert}


@router.patch("/alerts/{alert_id}/status")
def update_status(alert_id: str, body: StatusUpdate):
    collection = get_collection()
    if collection is None:
        raise HTTPException(status_code=500, detail="MongoDB not connected")

    new_status = body.status.lower().strip()
    if new_status not in ALLOWED_STATUS:
        raise HTTPException(
            status_code=400,
            detail="Status must be new, investigating, or resolved",
        )

    result = collection.update_one({"id": alert_id}, {"$set": {"status": new_status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert = collection.find_one({"id": alert_id}, {"_id": 0})
    return {"ok": True, "item": alert}


@router.patch("/alerts/{alert_id}")
def update_alert(alert_id: str, body: AlertUpdate):
    collection = get_collection()
    if collection is None:
        raise HTTPException(status_code=500, detail="MongoDB not connected")

    # Prepare update data
    update_data = {}
    if body.dest_ip is not None:
        update_data["dest_ip"] = body.dest_ip
        # Recalculate destination location
        dest_location = get_location_from_ip(body.dest_ip)
        if dest_location:
            update_data["dest_location"] = dest_location
        else:
            update_data["dest_location"] = None

    if body.src_ip is not None:
        update_data["src_ip"] = body.src_ip
        # Recalculate source location
        src_location = get_location_from_ip(body.src_ip)
        if src_location:
            update_data["src_location"] = src_location
        else:
            update_data["src_location"] = None

    if body.signature is not None:
        update_data["signature"] = body.signature

    if body.severity is not None:
        update_data["severity"] = body.severity
        update_data["severity_label"] = SEVERITY_LABELS.get(body.severity, "unknown")

    if not update_data:
        raise HTTPException(status_code=400, detail="No valid fields to update")

    result = collection.update_one({"id": alert_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert = collection.find_one({"id": alert_id}, {"_id": 0})
    return {"ok": True, "item": alert}


@router.post("/alerts/{alert_id}/refresh-location")
def refresh_alert_location(alert_id: str):
    """Refresh geolocation data for an existing alert based on current IPs"""
    collection = get_collection()
    if collection is None:
        raise HTTPException(status_code=500, detail="MongoDB not connected")

    # Get current alert
    alert = collection.find_one({"id": alert_id}, {"_id": 0})
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    update_data = {}

    # Recalculate destination location if dest_ip exists
    if alert.get("dest_ip"):
        dest_location = get_location_from_ip(alert["dest_ip"])
        update_data["dest_location"] = dest_location if dest_location else None

    # Recalculate source location if src_ip exists
    if alert.get("src_ip"):
        src_location = get_location_from_ip(alert["src_ip"])
        update_data["src_location"] = src_location if src_location else None

    if update_data:
        collection.update_one({"id": alert_id}, {"$set": update_data})

    # Return updated alert
    updated_alert = collection.find_one({"id": alert_id}, {"_id": 0})
    return {"ok": True, "item": updated_alert}


@router.post("/alerts/refresh-all-locations")
def refresh_all_locations():
    """Refresh geolocation data for all alerts in the database"""
    collection = get_collection()
    if collection is None:
        raise HTTPException(status_code=500, detail="MongoDB not connected")

    # Get all alerts
    alerts = list(collection.find({}, {"_id": 0}))
    updated_count = 0

    for alert in alerts:
        update_data = {}

        # Recalculate destination location
        if alert.get("dest_ip"):
            dest_location = get_location_from_ip(alert["dest_ip"])
            update_data["dest_location"] = dest_location if dest_location else None

        # Recalculate source location
        if alert.get("src_ip"):
            src_location = get_location_from_ip(alert["src_ip"])
            update_data["src_location"] = src_location if src_location else None

        if update_data:
            collection.update_one({"id": alert["id"]}, {"$set": update_data})
            updated_count += 1

    return {"ok": True, "message": f"Refreshed locations for {updated_count} alerts"}


@router.post("/alerts/{alert_id}/notes")
async def add_note(alert_id: str, body: NoteIn, current_user: dict = Security(get_current_user)):
    collection = get_collection()
    if collection is None:
        raise HTTPException(status_code=500, detail="MongoDB not connected")

    # Fetch full user data from database
    user_email = current_user.get("sub")
    user_data = await get_user_by_email(user_email)
    
    note = {
        "text": body.text,
        "author": user_data.get("full_name", "Analyst") if user_data else "Analyst",
        "role": current_user.get("role", "Analyst"),
        "time": datetime.utcnow().isoformat()
    }

    result = collection.update_one({"id": alert_id}, {"$push": {"notes": note}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Alert not found")

    return {"ok": True, "note": note}


@router.get("/alerts/{alert_id}/notes")
def get_notes(alert_id: str):
    collection = get_collection()
    if collection is None:
        raise HTTPException(status_code=500, detail="MongoDB not connected")

    alert = collection.find_one({"id": alert_id}, {"_id": 0, "notes": 1})
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    # Normalize notes: handle both string notes (legacy) and object notes (new)
    raw_notes = alert.get("notes", [])
    normalized_notes = []
    for idx, note in enumerate(raw_notes):
        if isinstance(note, str):
            # Legacy: plain string note
            normalized_notes.append({
                "id": idx,
                "text": note,
                "author": "System",
                "role": "System",
                "time": "—"
            })
        elif isinstance(note, dict):
            # New: object note with text and time
            normalized_notes.append({
                "id": idx,
                "text": note.get("text", ""),
                "author": note.get("author", "System"),
                "role": note.get("role", "Analyst"),
                "time": note.get("time", "—")
            })
    
    return {"ok": True, "items": normalized_notes}


@router.get("/alerts/dashboard/summary")
def summary():
    collection = get_collection()
    if collection is None:
        raise HTTPException(status_code=500, detail="MongoDB not connected")

    alerts = list(collection.find({}, {"_id": 0, "severity_label": 1}))
    result = {"high": 0, "medium": 0, "low": 0}

    for alert in alerts:
        label = alert.get("severity_label")
        if label in result:
            result[label] += 1

    return {"ok": True, "total": len(alerts), "severity_summary": result}


@router.post("/alerts/send-telegram")
async def send_telegram(alert: dict, current_user: dict = Security(get_current_user)):
    chat_id = alert.get("chat_id")
    text = alert.get("text")
    if not chat_id or not text:
        raise HTTPException(status_code=400, detail="chat_id and text required")

    res = await send_telegram_message(chat_id, text)
    if res is None:
        raise HTTPException(status_code=500, detail="Telegram bot not configured")

    if res.status_code != 200:
        raise HTTPException(status_code=res.status_code, detail=res.text)

    return {"ok": True, "telegram_response": res.json()}