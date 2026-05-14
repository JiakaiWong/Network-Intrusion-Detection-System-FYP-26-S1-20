import time
import json
import os
import requests
import random
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

API_URL = os.getenv("API_URL", "https://network-intrusion-detection-system-fyp.onrender.com/api/ingest/alerts")
ZEEK_LOG_FILE = "zeek_notice.log"

SEVERITY_THRESHOLD = int(os.getenv("SEVERITY_THRESHOLD", "2"))
SEVERITY_LABELS = {1: "high", 2: "medium", 3: "low"}

def start_reading():
    print("Ingestor Mode: ZEEK")
    print(f"Watching file: {ZEEK_LOG_FILE}")
    print(f"API endpoint: {API_URL}")
    print("-" * 50)
    
    if not os.path.exists(ZEEK_LOG_FILE):
        open(ZEEK_LOG_FILE, 'w').close()

    f = open(ZEEK_LOG_FILE, "r")
    f.seek(0, os.SEEK_END)

    sent = 0
    skipped = 0
    telegram_alerts = 0

    while True:
        line = f.readline()
        
        if not line:
            time.sleep(0.5)
            continue
            
        try:
            data = json.loads(line.strip())
            
            payload = {
                "timestamp": datetime.now().isoformat(),
                "src_ip": data.get("id.orig_h", "0.0.0.0"),
                "src_port": data.get("id.orig_p", 0),
                "dest_ip": data.get("id.resp_h", "0.0.0.0"),
                "dest_port": data.get("id.resp_p", 0),
                "proto": data.get("proto", "tcp").upper(),
                "signature": "[ZEEK] " + data.get("note", "Unknown"),
                "severity": 2, 
                "category": "Behavioral",
                "sid": random.randint(10000, 99999),
                "source_nids": "ZEEK"
            }

            req = requests.post(API_URL, json=payload, timeout=60)
            
            if req.status_code in (200, 201):
                sev = payload["severity"]
                label = SEVERITY_LABELS.get(sev, "unknown")
                
                if sev <= SEVERITY_THRESHOLD:
                    print(f"\n[ALERT] {payload['signature']} ({label}) | {payload['src_ip']} -> {payload['dest_ip']}")
                    telegram_alerts += 1
                else:
                    print(f"\n✔ {payload['signature']} ({label})")
                
                sent += 1
            else:
                skipped += 1

        except json.JSONDecodeError:
            pass 
        except Exception:
            skipped += 1

        print(f"Total Sent: {sent} | Telegram: {telegram_alerts} | Skipped: {skipped}        ", end="\r")

if __name__ == "__main__":
    start_reading()