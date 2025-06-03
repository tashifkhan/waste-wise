from fastapi import APIRouter, HTTPException
from schemas import GenerateRecycleRequest, GenerateRecycleResponse
from core.config import client
from core.config import genai
import json

router = APIRouter()

FORMAT_SPEC = {
    "recycling_method": list,
    "tips": list,
    "diy_solutions": list,
}


def extract_json(text: str) -> str:
    content = text.strip()

    if "```json" in content:
        start = content.find("```json") + len("```json")
        end = content.find("```", start)
        return content[start:end].strip()

    if content.startswith("{") and content.endswith("}"):
        return content

    start = content.find("{")
    end = content.rfind("}")

    if start != -1 and end != -1:
        return content[start : end + 1]

    raise ValueError("Could not extract JSON from response")


@router.post("/", response_model=GenerateRecycleResponse)
async def generate_recycle(req: GenerateRecycleRequest) -> GenerateRecycleResponse:

    name = req.name
    type = req.type
    desc = req.desc

    if not name or not type or not desc:
        raise HTTPException(
            status_code=400,
            detail="Name, type, and description are required fields.",
        )
    if (
        not isinstance(name, str)
        or not isinstance(type, str)
        or not isinstance(desc, str)
    ):
        raise HTTPException(
            status_code=400,
            detail="Name, type, and description must be strings.",
        )
    if len(name) > 100 or len(type) > 100 or len(desc) > 500:
        raise HTTPException(
            status_code=400,
            detail="Name, type, and description must not exceed length limits.",
        )
    if not all(char.isalnum() or char.isspace() for char in name + type + desc):
        raise HTTPException(
            status_code=400,
            detail="Name, type, and description must contain only alphanumeric characters and spaces.",
        )
    if len(name) == 0 or len(type) == 0 or len(desc) == 0:
        raise HTTPException(
            status_code=400,
            detail="Name, type, and description must not be empty.",
        )
    if len(name) < 3:
        raise HTTPException(
            status_code=400,
            detail="Name must be at least 3 characters, type at least 3 characters, and description at least 10 characters long.",
        )
    if len(name) > 100 or len(type) > 100 or len(desc) > 500:
        raise HTTPException(
            status_code=400,
            detail="Name must not exceed 100 characters, type must not exceed 100 characters, and description must not exceed 500 characters.",
        )
    if not name.isascii() or not type.isascii() or not desc.isascii():
        raise HTTPException(
            status_code=400,
            detail="Name, type, and description must contain only ASCII characters.",
        )
    if not name.strip() or not type.strip() or not desc.strip():
        raise HTTPException(
            status_code=400,
            detail="Name, type, and description must not be just whitespace.",
        )
    if not all(char.isprintable() for char in name + type + desc):
        raise HTTPException(
            status_code=400,
            detail="Name, type, and description must contain only printable characters.",
        )
    if not name.isidentifier() or not type.isidentifier():
        raise HTTPException(
            status_code=400,
            detail="Name and type must be valid Python identifiers.",
        )

    prompt = f"""
        We are a team of students working for a hackathon, the topic of the hackathon is AI-Driven Waste Management and Recycling Advisor
        Problem: Improper waste management is contributing to pollution and environmental degradation.
        Solution: An AI-powered waste management tool that educates users on how to reduce waste, and provides real-time suggestions for proper disposal or recycling based on location. It could also predict the environmental impact of consumption patterns and suggest alternatives 
        Impact: This could create immediate environmental and social impact by reducing waste generation and promoting a circular economy in communities.
        Using AI to recycle more waste
        analyze waste processing and recycling facilities to help them recover and recycle more waste material.
        The name of our idea is "Waste wise" We are going to make it as a web app
        We will also include a leaderboard and a feed where people can post their images of their recycled products and those recycling the most will be shown on top of our leaderboard
        We will suggest people on how they can recycle ,we will also help them classify the waste product based of the image that they submit if the item in the image is Municipal Solid Waste (MSW), Industrial Waste, Agricultural Waste, Construction and Demolition (C&D) Waste, Medical Waste, Solid Waste, Liquid Waste, Gaseous Waste, Biodegradable Waste, Non-biodegradable Waste, Hazardous Waste, Non-hazardous Waste
        We will also suggest on how to dispose as well as recycle the material, we are also going to include ways you could use the item by providing DIY videos from youtube.
        We shall also have chatbot that will support you with anything relate to the environment.
        We will be using image detection api for getting information regarding the images 
        we will use api  to input the waste products that have been detected using the previous api to get information about what type/classification of waste it is and how to dispose of it also tell ways to recycle the item as well as reuse it we are also using an youtube api to get links of diy videos regarding reusing the items and how to make sure we us the item to make diy products
        I need you to return me value in form of JSON file and map "recycling_method" as a key to the  array containing (strings) various waste recycling techniques of the previous ,mentioned waste type   and another key as "tips" that contains an array of strings(on specifics of how to recycle that specific type of waste, as mentioned earlier and also detailed description about how to recycle those items to something useful ) and the third key is "diy_solutions" it contains an array of strings (which will return the diy solutions for making useful products using those items)
        We are inputting the waste type and name of the waste item return only the disposal_method and tips ,don't return the waste type and item name as we already have that as input
        Don't include results for different type of waste for example and give output for only the input that you will receive
        Inputs are name:{name} plate, type: {type} & discription: {desc}
        Give only the output JSON and no other information whether it be an explanation of the answer and don't forget to add a key of "error" and its value being "none" in the JSON output
        In "recycling_menthods" just provie the name of the methods
    """

    format_specification = """
        ensure that the json is formatted as follows:
        {
            "recycling_method": # list of strings elaborating the recycling method for the waste item  #["str1", "str2", "str3", ...],
            "tips": # list of strings elaborating the tips for recycling of the waste item  #["str1", "str2", "str3", ...],
            "diy_solutions": # list of strings elaborating the DIY solutions for the waste item  #["str1", "str2", "str3", ...]
        }
    """

    prompt = f"{prompt}\n{format_specification}"

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[prompt],
            config=genai.types.GenerateContentConfig(temperature=0.1),
        )

        raw = response.text
        json_str = extract_json(raw)
        data = json.loads(json_str)

        return GenerateRecycleResponse(
            recycling_method=data.get("recycling_method", []),
            tips=data.get("tips", []),
            diy_solutions=data.get("diy_solutions", []),
            error="none",
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )
