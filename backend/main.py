from fastapi import FastAPI
from routes import auth  # import the router

app = FastAPI()
app.include_router(auth.router)  # attach all routes from auth.py