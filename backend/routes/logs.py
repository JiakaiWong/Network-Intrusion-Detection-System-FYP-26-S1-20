from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from bson import ObjectId
from database import db
from routes.auth import get_current_user

router = APIRouter()


class LogIn(BaseModel):
    name: str
    type: str
    logType: str
    status: str = "Active"
    filePath: Optional[str] = None    # stored file path for file-based sources
    syslogHost: Optional[str] = None  # host for syslog sources
    syslogPort: Optional[int] = None  # port for syslog sources


class LogUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    logType: Optional[str] = None


def get_timestamp():
    return datetime.now().strftime("%d-%b-%Y %H:%M")


@router.get("/api/logs")
async def get_logs(user=Depends(get_current_user)):
    logs = await db.log_sources.find().to_list(None)
    for log in logs:
        log["id"] = str(log["_id"])
        del log["_id"]
    return logs


@router.post("/api/logs")
async def create_log(log: LogIn, user=Depends(get_current_user)):
    new_log = log.dict()
    new_log["lastUpdated"] = get_timestamp()
    result = await db.log_sources.insert_one(new_log)
    new_log["id"] = str(result.inserted_id)
    del new_log["_id"]
    return new_log


@router.put("/api/logs/{log_id}")
async def update_log(log_id: str, data: LogUpdate, user=Depends(get_current_user)):
    update = {k: v for k, v in data.dict().items() if v is not None}
    update["lastUpdated"] = get_timestamp()
    result = await db.log_sources.update_one({"_id": ObjectId(log_id)}, {"$set": update})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Log not found")
    updated = await db.log_sources.find_one({"_id": ObjectId(log_id)}) 
    updated["id"] = str(updated["_id"])
    del updated["_id"]
    return updated


@router.put("/api/logs/{log_id}/status")
async def toggle_status(log_id: str, user=Depends(get_current_user)):
    log = await db.log_sources.find_one({"_id": ObjectId(log_id)}) 
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    new_status = "Inactive" if log["status"] == "Active" else "Active"
    await db.log_sources.update_one( 
        {"_id": ObjectId(log_id)},
        {"$set": {"status": new_status, "lastUpdated": get_timestamp()}}
    )
    log["status"] = new_status
    log["id"] = str(log["_id"])
    del log["_id"]
    return log


@router.delete("/api/logs/{log_id}")
async def delete_log(log_id: str, user=Depends(get_current_user)):
    result = await db.log_sources.delete_one({"_id": ObjectId(log_id)}) 
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Log not found")
    return {"deleted": log_id}
