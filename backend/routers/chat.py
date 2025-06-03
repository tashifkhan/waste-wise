from fastapi import APIRouter, HTTPException
from schemas import ChatRequest, ChatResponse
from core.config import chat_client

router = APIRouter()


@router.post("/", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest) -> ChatResponse:
    if not req.message:
        raise HTTPException(status_code=400, detail="Message is required")
    try:
        response = chat_client.send_message(req.message)
        return ChatResponse(message=response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
