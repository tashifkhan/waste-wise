from pydantic import BaseModel
from typing import List, Optional


class GenerateRecycleRequest(BaseModel):
    name: str
    type: str
    desc: str


class GenerateDisposalRequest(BaseModel):
    name: str
    type: str
    desc: str


class ChatRequest(BaseModel):
    message: str


class YouTubeSearchRequest(BaseModel):
    name: str
