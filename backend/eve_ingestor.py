import json
import os
import time

import requests
from dotenv import load_dotenv

load_dotenv()

API_URL = os.getenv("API_URL", "http://127.0.0.1:8000/api/ingest/alerts")

EVE_PATH = "/opt/homebrew/var/log/suricata/eve.json"
SEVERITY_THRESHOLD = int(os.getenv("SEVERITY_THRESHOLD", "2"))
SEVERITY_LABELS = {
    1: "high",
    2: "medium",
    3: "low",
}


def build_payload(event: dict) -> dict:
    alert = event.get("alert", {})

    return {
        "timestamp": event.get("timestamp"),
        "src_ip": event.get("src_ip"),
        "src_port": event.get("src_port"),
        "dest_ip": event.get("dest_ip"),
        "dest_port": event.get("dest_port"),
        "proto": event.get("proto"),
        "signature": alert.get("signature"),
        "severity": alert.get("severity"),
        "category": alert.get("category"),
        "sid": alert.get("signature_id"),
    }


def send_alert(payload: dict) -> bool:
    try:
        response = requests.post(API_URL, json=payload, timeout=5)

        if response.status_code in (200, 201):
            return True

        print(f"❌ Failed: {response.status_code} - {response.text}")
        return False

    except requests.RequestException as e:
        print(f"❌ Request error: {e}")
        return False


def process_line(line: str) -> str:
    try:
        event = json.loads(line)
    except json.JSONDecodeError:
        return "skipped"

    if event.get("event_type") != "alert":
        return "skipped"

    payload = build_payload(event)

    if not payload["timestamp"] or payload["severity"] is None:
        return "skipped"

    success = send_alert(payload)

    if not success:
        return "skipped"

    severity_label = SEVERITY_LABELS.get(payload["severity"], "unknown")

    if payload["severity"] <= SEVERITY_THRESHOLD:
        print(
            f"🚨 [TELEGRAM] {payload['signature']} ({severity_label}) | "
            f"{payload['src_ip']} → {payload['dest_ip']}"
        )
        return "telegram"

    print(f"✔ {payload['signature']} ({severity_label})")
    return "sent"


def main():
    sent = 0
    skipped = 0
    telegram_alerts = 0

    print(f"📡 Live ingestion from: {EVE_PATH}")
    print(f"🌐 API endpoint: {API_URL}")
    print(
        f"📱 Telegram threshold ≤ {SEVERITY_THRESHOLD} "
        f"({SEVERITY_LABELS.get(SEVERITY_THRESHOLD, 'unknown')})\n"
    )

    # Ensure file exists
    if not os.path.exists(EVE_PATH):
        print(f"❌ File not found: {EVE_PATH}")
        return

    with open(EVE_PATH, "r", encoding="utf-8") as file:
        # Move to end (live tail)
        file.seek(0, os.SEEK_END)

        while True:
            line = file.readline()

            if not line:
                time.sleep(0.5)
                continue

            result = process_line(line.strip())

            if result == "telegram":
                sent += 1
                telegram_alerts += 1
            elif result == "sent":
                sent += 1
            else:
                skipped += 1

            # Optional: show running stats
            print(
                f"📊 Sent: {sent} | Telegram: {telegram_alerts} | Skipped: {skipped}",
                end="\r",
            )


if __name__ == "__main__":
    main()