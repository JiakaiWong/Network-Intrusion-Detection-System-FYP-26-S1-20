import json
import os

import requests
from dotenv import load_dotenv

load_dotenv()

EVE_PATH = os.getenv("EVE_PATH", "./eve.json")
API_URL = os.getenv("API_URL", "http://127.0.0.1:8000/ingest/alerts")


def main():
    sent = 0
    skipped = 0

    with open(EVE_PATH, "r", encoding="utf-8") as file:
        for line in file:
            line = line.strip()
            if not line:
                continue

            try:
                event = json.loads(line)
            except json.JSONDecodeError:
                skipped += 1
                continue

            if event.get("event_type") != "alert":
                continue

            payload = {
                "timestamp": event.get("timestamp"),
                "src_ip": event.get("src_ip"),
                "src_port": event.get("src_port"),
                "dest_ip": event.get("dest_ip"),
                "dest_port": event.get("dest_port"),
                "proto": event.get("proto"),
                "signature": event.get("alert", {}).get("signature"),
                "severity": event.get("alert", {}).get("severity"),
                "category": event.get("alert", {}).get("category"),
                "sid": event.get("alert", {}).get("signature_id"),
            }

            if not payload["timestamp"] or payload["severity"] is None:
                skipped += 1
                continue

            try:
                response = requests.post(API_URL, json=payload, timeout=5)
                if response.status_code in (200, 201):
                    sent += 1
                else:
                    skipped += 1
                    print("Failed:", response.status_code, response.text)
            except requests.RequestException as e:
                skipped += 1
                print("Request error:", e)

    print(f"Done. Sent={sent}, Skipped={skipped}")


if __name__ == "__main__":
    main()