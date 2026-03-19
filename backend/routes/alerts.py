from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.alert_service import get_collection, SEVERITY_LABELS, ALLOWED_STATUS

router = APIRouter(tags=["Alerts"])


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
def ingest_alert(alert: AlertIn):
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