import os
import requests
from fastapi import APIRouter, HTTPException
from schemas import YouTubeSearchRequest, YouTubeSearchResponse

router = APIRouter()


@router.post("/", response_model=YouTubeSearchResponse)
async def youtube_search(req: YouTubeSearchRequest) -> YouTubeSearchResponse:
    api_key = os.getenv("YOUTUBE_API_KEY")
    query = f"DIY / Best out of waste / Recycling {req.name}"

    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": 12,
        "key": api_key,
    }

    resp = requests.get(url, params=params)

    if resp.status_code != 200:
        raise HTTPException(
            status_code=resp.status_code,
            detail=f"Error fetching data: {resp.status_code}",
        )

    items = resp.json().get("items", [])

    video_ids = [item["id"]["videoId"] for item in items]

    video_links = [f"https://www.youtube.com/watch?v={vid}" for vid in video_ids]

    return YouTubeSearchResponse(
        video_ids=video_ids, video_links=video_links, error="none"
    )
