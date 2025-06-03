from pydantic import BaseModel
from typing import List, Optional


class ImageResponse(BaseModel):
    name: Optional[str]
    type: Optional[str]
    desc: Optional[str]
    error: str


class GenerateRecycleResponse(BaseModel):
    recycling_method: List[str]
    tips: List[str]
    diy_solutions: List[str]
    error: str


class GenerateDisposalResponse(BaseModel):
    disposal_method: List[str]
    tips: List[str]
    error: str


class ChatResponse(BaseModel):
    message: str


class YouTubeSearchResponse(BaseModel):
    video_ids: List[str]
    video_links: List[str]
    error: str
