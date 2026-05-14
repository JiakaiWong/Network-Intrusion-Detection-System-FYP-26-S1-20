# Backend – Network‑Intrusion‑Detection‑System

This directory contains the Python/FastAPI server that powers the IDS
dashboard.  It exposes a small JSON REST API that the frontend can talk
to when running locally (or once deployed).

# Features
- User authentication
- IDS alert ingestion (Suricata EVE JSON)
- Alert validation and processing
- MongoDB storage
- Alert filtering
- Integration with frontend dashboard

## IDS Setup & Local Rules

# Suricata Setup
1. **Install Suricata**
    ```bash
    sudo apt update
    sudo apt install suricata
    ```

2. **Configure the paths**
    ```bash
    /etc/suricata/suricata.yaml
    /var/lib/suricata/rules/local.rules
    ```

3. **Run Suricata**
    ```bash
    sudo suricata -i eth0 -c /etc/suricata/suricata.yaml
    ```

# Snort Setup

# Kismet Setup

# Zeek Setup

---

## Quick start

1. **Install Python deps**

   ```bash
   cd backend
   python -m venv .venv           # optional but recommended
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

   Frontend Team: Skip to step 3 and 4. Step 2 is for testing purposes.



2.  **Start a MongoDB instance**

The API uses MongoDB via motor. You can start a local server using
Docker (preferred) or any existing instance.

# recommended – uses the same compose file used by the test suite

```bash
docker-compose -f docker-compose.test.yml up -d
```

The default connection string is mongodb://localhost:27017. To
override, create a .env file with:
```bash
MONGODB_URL=mongodb://<your‑host>:<port>
DATABASE_NAME=seimless_db
```

3. **Run the API**

```bash
uvicorn main:app --reload
```

The server will listen on http://127.0.0.1:8000 by default.
--reload restarts automatically when you change any file.

Notes for frontend integration
Base URL: when running locally the frontend can make requests to
http://localhost:8000/api/.... CORS is not configured yet; if the
browser blocks cross‑origin calls you may need to allow it or run the
frontend server on the same host/port.

Registration payload: the JSON keys are: 
email, password, full_name and role. 
Registration payload:
```json
{
  "email": "user@example.com",
  "password": "String123!",
  "full_name": "User Name",
  "role": "Security Analyst"
}
```

Only "Security Analyst" and "Administrator"
are currently accepted; the UI may hard‑code "Security Analyst" for
now as the select box is disabled in the React page.

Error handling: the server returns 400 with a detail message when
validation fails (e.g. weak password, email already exists). The
frontend should surface this to the user.

Approval workflow: every new account is created with approved = False. The UI should inform users that an administrator must approve their account; the backend does not yet provide an approval endpoint.


4. **Run the Frontend**
   
In new terminal :
```bash
cd frontend
npm install
npm run dev
```

The frontend will run on : http://localhost:5173

5.**IDS Alerts Ingestion**

Simulating Suricata alerts locally,
```bash
cd backend
python3 eve_ingestor.py
```

Viewing alerts
```bash
curl http://127.0.0.1:8000/alerts
```

Live Monitoring
```bash
tail -f /var/log/suricata/eve.json | grep '"event_type":"alert"'
```


6. **IDS Alert Pipeline**
Current pipeline works like this :
Suricata / IDS -> eve.json (alert log) -> eve_ingestor.py -> FastAPI Backend (app.py) -> MongoDB -> Frontend Dashboard

7.  **Swagger Docs**

Swagger / docs: visit
http://localhost:8000/docs or http://localhost:8000/redoc while
the server is running for interactive API documentation.

Folder Structure

```
backend/
├── database.py           # MongoDB client helper
├── models/               # Pydantic schemas, data models
│   └── user.py           # UserIn / UserOut models
├── routes/               # FastAPI routers
│   └── auth.py           # `/api/auth` endpoints
├── services/             # Business logic / helpers
│   └── alert_service.py  # Alert processing, validation, filtering
│   └── user_service.py   # validation & create_user()
├── tests/                # pytest async tests
│   ├── conftest.py       # fixtures (mongodb_client, etc.)
│   └── test_auth.py      # registration/password/full‑name tests
├── eve_ingestor.py       # reaeds Suricata eve.json, extract alerts
├── main.py               # FastAPI app instance
├── pytest.ini            # test configuration
├── .env                  # local environment override (ignored by git)
├── .env.test             # test DB URL
├── requirements.txt      # Python dependencies
├── docker-compose.test.yml  # launches a temporary MongoDB
└── IMPLEMENTATION_SUMMARY.md / TEST_IMPLEMENTATION_CHECKLIST.md / …
```


# Testing
Run the entire test suite with:

```bash
cd backend
docker-compose -f docker-compose.test.yml up -d  
pytest    
```

#Important note

Running the ingestion script multiple times:

```bash
python3 eve_ingestor.py
```

will insert duplicate alerts into the database.
