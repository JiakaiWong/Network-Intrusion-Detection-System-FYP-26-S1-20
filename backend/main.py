from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from routes import auth
from routes import alerts
from routes import logs  
from routes import maintenance

app = FastAPI(title="IDS Backend API")
app.include_router(maintenance.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(alerts.router)
app.include_router(logs.router)  

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="IDS Backend API",
        version="1.0.0",
        description="Network Intrusion Detection System API",
        routes=app.routes,
    )

    if "components" not in openapi_schema:
        openapi_schema["components"] = {}

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