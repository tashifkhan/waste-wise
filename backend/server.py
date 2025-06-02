import json
import os
from io import BytesIO

import PIL.Image
import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from google import genai
from werkzeug.utils import secure_filename

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=api_key)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route("/img_processing", methods=["POST"])
def img_processing():
    UPLOAD_FOLDER = "backend/uploads"
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "heic", "heif"}
    app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    def allowed_file(filename):
        return (
            "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
        )

    def delete_uploaded_file(filepath):
        try:
            os.remove(filepath)
        except FileNotFoundError:
            pass

    if "file" not in request.files:
        return (
            jsonify(
                {"name": "e-1", "type": "e-1", "desc": "e-1", "error": "No file part"}
            ),
            400,
        )

    file = request.files["file"]

    if file.filename == "":
        return (
            jsonify(
                {
                    "name": "e-1",
                    "type": "e-1",
                    "desc": "e-1",
                    "error": "No selected file",
                }
            ),
            400,
        )

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)

        try:
            # Read file into memory
            file_content = file.read()

            # Open image using PIL
            img = PIL.Image.open(BytesIO(file_content))

            # Convert image to RGB if it's not already
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

            # Generate content
            # response = model.generate_content([prompt, img])
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=[img, prompt],
                config=genai.types.GenerateContentConfig(temperature=0.1),
            )

            parsed_response = json.loads(response.text[8:-3])
            print(response.text[8:-3])

            formatted_response = {
                "name": parsed_response.get("name"),
                "desc": parsed_response.get("desc"),
                "type": parsed_response.get("type"),
                "error": "none",
            }

            return jsonify(formatted_response)

        except Exception as e:
            return (
                jsonify(
                    {
                        "name": "e-1",
                        "type": "e-1",
                        "desc": "e-1",
                        "error": f"Error processing image: {str(e)}",
                    }
                ),
                400,
            )

        finally:
            # Clean up: delete the file if it was saved
            delete_uploaded_file(file_path)

    else:
        return (
            jsonify(
                {
                    "name": "e-1",
                    "type": "e-1",
                    "desc": "e-1",
                    "error": "Invalid file type",
                }
            ),
            400,
        )


@app.route("/generate_recycle", methods=["POST"])
def generate_recycle():

    try:
        name = request.json.get("name")
        type = request.json.get("type")
        desc = request.json.get("desc")

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

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[prompt],
            config=genai.types.GenerateContentConfig(temperature=0.1),
        )

        # Parse the response into a JSON object
        print(response.text)

        parsed_response = json.loads(response.text[8:-3])

        return jsonify(parsed_response)

        # # Format the response as desired
        # formatted_response = {
        #     "recycling_method": parsed_response["recycling_method"],
        #     "tips": parsed_response["tips"],
        #     "diy_solutions": parsed_response["diy_solutions"],
        #     "error": "none"
        # }

        # return jsonify(formatted_response)

    except Exception as e:
        return (
            jsonify(
                {
                    "recycling_method": ["e-1"],
                    "tips": ["e-1"],
                    "diy_solutions": ["e-1"],
                    "error": str(e),
                }
            ),
            500,
        )


@app.route("/generate_disposal", methods=["POST"])
def generate_disposal():
    try:
        name = request.json.get("name")
        type = request.json.get("type")
        desc = request.json.get("desc")
        instructions = "hello"
        prompt = f"""
            We are a team of students working for a hackathon, the topic of the hackathon is AI-Driven Waste Management and Recycling Advisor
            Problem: Improper waste management is contributing to pollution and environmental degradation.
            Solution: An AI-powered waste management tool that educates users on how to reduce waste, and provides real-time suggestions for proper disposal or recycling based on location. It could also predict the environmental impact of consumption patterns and suggest alternatives 
            Impact: This could create immediate environmental and social impact by reducing waste generation and promoting a circular economy in communities.
            Using AI to recycle more waste
            analyze waste processing and recycling facilities to help them recover and recycle more waste material.
            The name of our idea is "Waste wise" We are going to make it as a web app
            We will also include a leaderboard and a feed where people can post their images of their recycled products and those recycling the most will be shown on top of our leaderboard
            We will suggest people on how they can recycle ,we will also help them classify the waste product based of the image that they submit if the item in the image is  Municipal Solid Waste (MSW), Industrial Waste, Agricultural Waste, Construction and Demolition (C&D) Waste, Medical Waste, Solid Waste, Liquid Waste, Gaseous Waste, Biodegradable Waste, Non-biodegradable Waste, Hazardous Waste, Non-hazardous Waste
            We will also suggest on how to dispose as well as recycle the material, we are also going to include ways you could use the item by providing DIY videos from youtube.
            We shall also have chatbot that will support you with anything relate to the environment.
            We will be using image detection api for getting information regarding the images 
            we will use api  to input the waste products that have been detected using the previous api to get information about what type/classification of waste it is and how to dispose of it also tell ways to recycle the item as well as reuse it we are also using an youtube api to get links of diy videos regarding reusing the items and how to make sure we us the item to make diy products
            I need you to return me value in form of JSON file and map "disposal_method" as a key to the  array containing (strings) various waste disposal techniques of the previous ,mentioned waste type   and another key as "tips" that contains an array of strings(on specifics of how to dispose that type of waste, as mentioned earlier and also detailed description about how to dispose of those items)
            We are inputting the waste type and name of the waste item return only the disposal_method and tips ,don't return the waste type and item name as we already have that as input
            Don't include results for different type of waste for example and give output for only the input that you will receive
            Inputs are name:{name} plate, type: {type} & discription: {desc}
            Give only the output JSON and no other information whether it be an explanation of the  answer and don't forget to add a key of "error" and its value being "none" in the JSON output.
            In "desposal_menthods" just provie the name of the methods
        """

        format_specification = """
            ensure that the json is formatted as follows:
            {
                "disposal_method": # list of strings elaborating the disposal method for the waste item  #["str1", "str2", "str3", ...],
                "tips": # list of strings elaborating the tips for disposal of the waste item  #["str1", "str2", "str3", ...],
            }
        """

        prompt = f"{prompt}\n{format_specification}"

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[prompt],
            config=genai.types.GenerateContentConfig(
                system_instruction="""
                    You are a Green Panther. Your task is to provide accurate and environmentally responsible waste disposal methods and tips based on the input waste type and name.
                """,
                temperature=0.1,
            ),
        )

        print(response.text)

        parsed_response = json.loads(response.text[8:-3])

        return jsonify(parsed_response)

        # formatted_response = {
        #     "disposal_method": parsed_response["disposal_method"],
        #     "tips": parsed_response["tips"],
        #     "error": "none"
        # }

        # return jsonify(formatted_response)

    except Exception as e:
        return (
            jsonify({"disposal_method": ["e-1"], "tips": ["e-1"], "error": str(e)}),
            500,
        )
    # ''' # Chunched
    # response = model.generate_content("what is alpha", stream=True)
    # for chunk in response:
    #     print(chunk.text)
    # '''


# chatbot
def chat(message):
    # Chat history setup

    system_prompt = """
        We are a team of students working for a hackathon, the topic of the hackathon is AI-Driven Waste Management and Recycling Advisor
        Problem: Improper waste management is contributing to pollution and environmental degradation.
        Solution: An AI-powered waste management tool that educates users on how to reduce waste, and provides real-time suggestions for proper disposal or recycling based on location. It could also predict the environmental impact of consumption patterns and suggest alternatives 
        Impact: This could create immediate environmental and social impact by reducing waste generation and promoting a circular economy in communities.
        Using AI to recycle more waste
        analyze waste processing and recycling facilities to help them recover and recycle more waste material.
        The name of our idea is "Waste wise" We are going to make it as a web app
        We will also include a leaderboard and a feed where people can post their images of their recycled products and those recycling the most will be shown on top of our leaderboard
        We will suggest people on how they can recycle ,we will also help them classify the waste product based of the image that they submit if the item in the image is  paper, cardboard, biological, metal, plastic, green-glass, brown-glass, white-glass, clothes, shoes, batteries, and trash.
        We will also suggest on how to dispose as well as recycle the material, we are also going to include ways you could use the item by providing DIY videos from youtube.
        We shall also have chatbot that will support you with anything relate to the environment.
        We will be using image detection api for getting information regarding the images 
        we will use api  to input the waste products that have been detected using the previous api to get information about what type/classification of waste it is and how to dispose of it also tell ways to recycle the item as well as reuse it we are also using an youtube api to get links of diy videos regarding reusing the items and how to make sure we us the item to make diy products.

        You are a Green Panther. Always provide accurate and environmentally responsible information.
    """

    chat = client.chats.create(
        model="gemini-2.0-flash",
        config=genai.types.GenerateContentConfig(
            system_instruction=system_prompt,
            temperature=0.7,
        ),
    )

    # Send the message and get the response
    response = chat.send_message(message)
    print(response.text)
    print(chat.get_history())

    # Parse the response to extract JSON-like information
    # try:
    #     parsed_response = json.loads(response.text)

    # except json.JSONDecodeError:
    #     raise Exception("Failed to parse model response")

    # # Format the response into the desired structure
    # formatted_response = {
    #     "recycling_method": parsed_response.get("recycling_method", []),
    #     "tips": parsed_response.get("tips", []),
    #     "diy_solutions": parsed_response.get("diy_solutions", []),
    #     "error": "none",
    # }

    # return jsonify(formatted_response)

    # message respose
    return {
        "message": response.text,
    }


@app.route("/chat", methods=["POST"])
def chat_endpoint():
    message = request.form.get("message")

    # Check if the message is missing or empty
    if not message:
        return jsonify({"responce": "e-1", "error": "Message is required"}), 400

    try:
        formatted_response = chat(message)
        return jsonify(formatted_response)

    except Exception as e:
        return (
            jsonify(
                {
                    "recycling_method": ["e-1"],
                    "tips": ["e-1"],
                    "diy_solutions": ["e-1"],
                    "error": str(e),
                }
            ),
            500,
        )


""" frontend code
async function sendMessage(message) {
    const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message })
    });
    const data = await response.json();
    console.log(data.response);
"""


@app.route("/youtube_search", methods=["POST"])
def youtube_search():
    yt_api_key = os.getenv("YOUTUBE_API_KEY")
    name = request.json.get("name")

    search_query = f"DIY/ Best out of waste/ Recycling {name}"

    search_url = "https://www.googleapis.com/youtube/v3/search"

    params = {
        "part": "snippet",
        "q": search_query,
        "type": "video",
        "maxResults": 12,
        "key": yt_api_key,
    }

    response = requests.get(search_url, params=params)

    if response.status_code == 200:
        search_results = response.json()
        video_links = []
        video_id_links = []

        for item in search_results["items"]:
            video_id = item["id"]["videoId"]
            video_url = f"https://www.youtube.com/watch?v={video_id}"
            video_links.append(video_url)
            video_id_links.append(video_id)

        return jsonify(
            {"video_ids": video_id_links, "video_links": video_links, "error": "none"}
        )

    else:
        return jsonify(
            {
                "video_ids": "e-1",
                "video_links": "e-1",
                "error": f"Error fetching data: {response.status_code}",
            }
        )


if __name__ == "__main__":
    app.run(debug=True, port=5000)
