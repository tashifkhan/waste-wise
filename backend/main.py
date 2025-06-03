from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import (
    img_processing,
    generate_recycle,
    generate_disposal,
    chat,
    youtube_search,
)

app = FastAPI(
    title="WasteWise API",
    description="AI-driven waste management and recycling advisor",
)


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(
    img_processing.router,
    prefix="/img_processing",
    tags=["image"],
)
app.include_router(
    generate_recycle.router,
    prefix="/generate_recycle",
    tags=["recycle"],
)
app.include_router(
    generate_disposal.router,
    prefix="/generate_disposal",
    tags=["disposal"],
)
app.include_router(
    chat.router,
    prefix="/chat",
    tags=["chat"],
)
app.include_router(
    youtube_search.router,
    prefix="/youtube_search",
    tags=["youtube"],
)

# start the FastAPI app
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=5000,
        reload=True,
    )
