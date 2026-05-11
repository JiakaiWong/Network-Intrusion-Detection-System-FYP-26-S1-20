from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from routes import auth
from routes import alerts
from routes import logs
from routes import maintenance

app = FastAPI(title="IDS Backend API")

origins = [
    "http://localhost:5173",
    "https://networkintrusiondetection-system.netlify.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(maintenance.router)
app.include_router(auth.router)
app.include_router(alerts.router)
app.include_router(logs.router)


@app.get("/")
def home():
    return {
        "ok": True,
        "message": "IDS backend is running"
    }


@app.get("/health")
def health():
    return {
        "ok": True,
        "service": "IDS Backend API"
    }


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="IDS Backend API",
        version="1.0.0",
        description="Network Intrusion Detection System API",
        routes=app.routes,
    )

    openapi_schema.setdefault("components", {})
    openapi_schema["components"]["securitySchemes"] = {
        "HTTPBearer": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "JWT token obtained from login endpoint"
        }
    }

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi

print("Loaded FastAPI app with CORS origins:", origins)
