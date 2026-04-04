from datetime import datetime
from typing import Optional
import os

from fastapi import APIRouter, HTTPException, Security
import httpx  # async HTTP client
from core.security import get_current_user 

from pydantic import BaseModel

from services.alert_service import get_collection, SEVERITY_LABELS, ALLOWED_STATUS
from services.user_service import get_users_with_telegram_id

router = APIRouter(tags=["Alerts"])

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

    result = collection.insert_one(doc)
    alert_id = str(result.inserted_id)
    collection.update_one({"_id": result.inserted_id}, {"$set": {"id": alert_id}})

    # Automatic Telegram notification for high/medium severity alerts
    if doc["severity"] <= SEVERITY_THRESHOLD:
        text = f"🚨 Alert: {doc['signature']} from {doc['src_ip']} to {doc['dest_ip']}, severity {doc['severity_label']}"
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
    status: Optional[str] = None
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
            detail="Status must be new, investigating, or resolved"
        )

    result = collection.update_one({"id": alert_id}, {"$set": {"status": new_status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert = collection.find_one({"id": alert_id}, {"_id": 0})
    return {"ok": True, "item": alert}


@router.post("/alerts/{alert_id}/notes")
def add_note(alert_id: str, body: NoteIn):
    collection = get_collection()
    if collection is None:
        raise HTTPException(status_code=500, detail="MongoDB not connected")

    note = {
        "text": body.text,
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

    return {"ok": True, "items": alert.get("notes", [])}


@router.get("/dashboard/summary")
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

    return {
        "ok": True,
        "total": len(alerts),
        "severity_summary": result
    }

@router.post("/api/alerts/send-telegram")
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