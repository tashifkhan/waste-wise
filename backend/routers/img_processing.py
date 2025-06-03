import os
from io import BytesIO
from typing import Optional

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import PIL.Image
import json

from schemas import ImageResponse
from core.config import client
from core.config import genai

router = APIRouter()

UPLOAD_FOLDER = os.path.join(
    os.getcwd(),
    "backend",
    "uploads",
)

ALLOWED_EXTENSIONS = {
    "png",
    "jpg",
    "jpeg",
    "webp",
    "heic",
    "heif",
}


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def extract_json(content: str) -> str:
    text = content.strip()

    if "```json" in text:
        start = text.find("```json") + len("```json")
        end = text.find("```", start)
        return text[start:end].strip()

    if text.startswith("{") and text.endswith("}"):
        return text

    start = text.find("{")
    end = text.rfind("}")

    if start != -1 and end != -1:
        return text[start : end + 1]

    raise ValueError("Could not extract JSON from response")


@router.post("/", response_model=ImageResponse)
async def process_image(file: UploadFile = File(...)) -> ImageResponse:
    # ensure upload folder exists
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    if not allowed_file(file.filename):
        raise HTTPException(status_code=400, detail="Invalid file type")

    content = await file.read()
    try:
        img = PIL.Image.open(BytesIO(content))
        if img.mode != "RGB":
            img = img.convert("RGB")

        prompt = """
            Identify the objects in the image and provide the appropriate disposal techniques. 
                Return the response in a JSON format where object's name is mapped to the 'name' key, 
                the 'desc' key gives an accurate and environmentally relevant description of the object 
                as well as the catagorise the image in the key 'type'. 
                Categorize the waste (object in the image) into one of the following categories. 
                    Municipal Solid Waste (MSW), 
                    Industrial Waste, Agricultural Waste, 
                    Construction and Demolition (C&D) Waste, Medical Waste, 
                    Solid Waste, Liquid Waste, 
                    Gaseous Waste, 
                    Biodegradable Waste, 
                    Non-biodegradable Waste, 
                    Hazardous Waste, 
                    Non-hazardous Waste
                Ensure the description and disposal method are accurate and environmentally responsible.
                ensure that the json is formatted as follows:
                {
                    "name": #name of the object / objects in the image (if multiple objects then just format the string as name1, name2, etc),
                    "type": #type of the object / objects in the image (if it has multiple objects then the string should be formatted as object1 - type1, object2 - type2, etc),
                    "desc": #description of the object / objects in the image (if it has multiple objects then the string should be formatted as object1 - type1, object2 - type2, etc),
                }
        """

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[img, prompt],
            config=genai.types.GenerateContentConfig(
                temperature=0.1,
            ),
        )

        raw = response.text
        data = json.loads(extract_json(raw))

        return ImageResponse(
            name=data.get("name"),
            type=data.get("type"),
            desc=data.get("desc"),
            error="none",
        )

    except Exception as e:
        return ImageResponse(
            name="e-1",
            type="e-1",
            desc="e-1",
            error=f"Error processing image: {e}",
        )
