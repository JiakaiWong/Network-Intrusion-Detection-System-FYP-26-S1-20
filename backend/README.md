# Backend – Network‑Intrusion‑Detection‑System

This directory contains the Python/FastAPI server that powers the IDS
dashboard.  It exposes a small JSON REST API that the frontend can talk
to when running locally (or once deployed).

At the moment the only public endpoint is **user registration** – the
frontend team can use it to submit new accounts while the administrator
workflow is still being built.  All of the code is covered by the
existing test suite.

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
```

3. **Run the API**

```bash
uvicorn app:app --reload
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

5.**IDS Alerts testing**

Simulating Suricata alerts locally,
Run ingestion script :
```bash
cd backend
python eve_ingestor.py
#if there's error "no module named 'requests', run this script : 'pip3 install requests'
```
This script will reads IDS events from eve.json and sends them to the backend API.

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
│   └── user_service.py   # validation & create_user()
├── tests/                # pytest async tests
│   ├── conftest.py       # fixtures (mongodb_client, etc.)
│   └── test_auth.py      # registration/password/full‑name tests
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
