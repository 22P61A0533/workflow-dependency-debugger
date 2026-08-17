from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import verify_connection
from backend.routes.automations import router as automations_router
from backend.routes.impact import router as impact_router
from backend.routes.dependencies import router as dependencies_router
from backend.routes.fields import router as fields_router

app = FastAPI(
    title="Workflow Dependency Debugger",
    description="Graph-based automation dependency analysis system",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(automations_router)
app.include_router(impact_router)
app.include_router(dependencies_router)
app.include_router(fields_router)


@app.get("/")
def root():
    return {
        "message": "Workflow Dependency Debugger API is running"
    }


@app.get("/health")
def health_check():
    database_connected = verify_connection()

    if database_connected:
        return {
            "status": "healthy",
            "database": "connected"
        }

    return {
        "status": "unhealthy",
        "database": "disconnected"
    }