from flask import Flask, request, jsonify
from dotenv import load_dotenv
import google.generativeai as genai
import PIL.Image
from werkzeug.utils import secure_filename
import json
import os

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

genai.configure(api_key=api_key)
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

app = Flask(__name__)

@app.route('/img_processing', methods=['POST'])
def img_processing():
    UPLOAD_FOLDER = 'uploads'
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'heic', 'heif'}
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
    
    def delete_uploaded_file(filepath):
        try:
            os.remove(filepath)
        except FileNotFoundError:
            pass

    if 'file' not in request.files:
        return jsonify(
            {
                "error": "No file part"
            }
        ), 400
    
    file = request.files['file']

    if file.filename == '':
        return jsonify(
            {
                "error": "No selected file"
            }
        ), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        try:
            img = PIL.Image.open(file_path)
            img.verify()  

        except Exception as e:
            delete_uploaded_file(file_path)
            return jsonify(
                {
                    "error": "Invalid image file"
                }
            ), 400
    
    else:
        return jsonify(
            {
                "error": "Invalid file type"
            }
        ), 400

    prompt = '''
        Identify the objects in the image and provide the appropriate disposal techniques. 
        Return the response in a JSON format where object's name is mapped to the 'name' key, 
        the 'desc' key gives an accurate and environmentally relevant description of the object 
        as well as the condition it is in, and the 'disposal' key gives disposal methods 
        (how to effectively dispose of the object/objects in the image). 
        Categorize the waste (object in the image) into one of the following categories. 
        Ensure the description and disposal method are accurate and environmentally responsible.
    '''

    try:
        # Use only the prompt, as image handling may differ in the API
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(temperature=0.4)
        )
        delete_uploaded_file(file_path)

        parsed_response = json.loads(response.text)

        formatted_response = {
            "name": parsed_response.get("name"),
            "desc": parsed_response.get("desc"),
            "disposal": parsed_response.get("disposal"),
            "error": "none"
        }

        return jsonify(formatted_response)
    
    except Exception as e:
        return jsonify(
            {
                "name": "e-1",
                "type": "e-1",
                "desc": "e-1",
                "error": str(e)
            }
        ), 500


@app.route('/generate_recycle', methods=['POST'])
def generate_recycle():

    try:
        name_item=request.form.get('name_item')
        type = request.form.get('type')
        desc = request.form.get('desc')

        if not name_item or not type or not desc:
            return jsonify(
                {
                    "error": "Please provide all required fields: name_item, type, and desc"
                }
            ), 400

        prompt = f'''
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
            we will use api  to input the waste products that have been detected using the previous api to get information about what type/classification of waste it is and how to dispose of it also tell ways to recycle the item as well as reuse it we are also using an youtube api to get links of diy videos regarding reusing the items and how to make sure we us the item to make diy products
            I need you to return me value in form of JSON file and map "recycling_method" as a key to the  array containing (strings) various waste recycling techniques of the previous ,mentioned waste type   and another key as "tips" that contains an array of strings(on specifics of how to recycle that specific type of waste, as mentioned earlier and also detailed description about how to recycle those items to something useful ) and the third key is "diy_solutions" it contains an array of strings (which will return the diy solutions for making useful products using those items)
            We are inputting the waste type and name of the waste item return only the disposal_method and tips ,don't return the waste type and item name as we already have that as input
            Don't include results for different type of waste for example and give output for only the input that you will receive
            Inputs are name:{name_item} plate, type: {type} & discription: {desc}
            Give only the output JSON and no other information whether it be an explanation of the answer and don't forget to add a key of "error" and its value being "none" in the JSON output
        ''' 
        response = model.generate_content(
            prompt,
            generation_config = genai.types.GenerationConfig(temperature=0.1)
        )

        # Parse the response into a JSON object
        parsed_response = json.loads(response.text)

        # Format the response as desired
        formatted_response = {
            "recycling_method": parsed_response["recycling_method"],
            "tips": parsed_response["tips"],
            "diy_solutions": parsed_response["diy_solutions"],
            "error": "none"
        }

        return jsonify(formatted_response)
    
    except Exception as e:
        return jsonify({
            "recycling_method": "e-1",
            "tips": "e-1",
            "error": str(e)
        }), 500
    
    
@app.route('/generate_disposal', methods=['POST'])
def generate_disposal():
    try:
        name_item=request.form.get('name_item')
        type = request.form.get('type')
        desc = request.form.get('desc')
        prompt = f'''
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
            we will use api  to input the waste products that have been detected using the previous api to get information about what type/classification of waste it is and how to dispose of it also tell ways to recycle the item as well as reuse it we are also using an youtube api to get links of diy videos regarding reusing the items and how to make sure we us the item to make diy products
            I need you to return me value in form of JSON file and map "disposal_method" as a key to the  array containing (strings) various waste disposal techniques of the previous ,mentioned waste type   and another key as "tips" that contains an array of strings(on specifics of how to dispose that type of waste, as mentioned earlier and also detailed description about how to dispose of those items)
            We are inputting the waste type and name of the waste item return only the disposal_method and tips ,don't return the waste type and item name as we already have that as input
            Don't include results for different type of waste for example and give output for only the input that you will receive
            Inputs are name:{name_item} plate, type: {type} & discription: {desc}
            Give only the output JSON and no other information whether it be an explanation of the  answer and don't forget to add a key of "error" and its value being "none" in the JSON output
        ''' 
        response = model.generate_content(prompt, generation_config = genai.types.GenerationConfig(temperature=0.1))
  
        parsed_response = json.loads(response.text)

        formatted_response = {
            "disposal_method": parsed_response["disposal_method"],
            "tips": parsed_response["tips"],
            "error": "none"
        }
        return jsonify(response.text)
    
    except Exception as e:
        return jsonify({
            "disposal_method": "e-1",
            "tips": "e-1",
            "error": str(e)
        }), 500
    # ''' # Chunched 
    # response = model.generate_content("what is alpha", stream=True)
    # for chunk in response:
    #     print(chunk.text)
    # '''

# chatbot
def chat(message):
    chat_history = [
        {
            "role": "system", 
            "parts": '''
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
                we will use api  to input the waste products that have been detected using the previous api to get information about what type/classification of waste it is and how to dispose of it also tell ways to recycle the item as well as reuse it we are also using an youtube api to get links of diy videos regarding reusing the items and how to make sure we us the item to make diy products
        '''},
        {
            "role": "user", 
            "parts": "Hello"
        },
        {
            "role": "model", 
            "parts": "Hey Green Panther!\nWhat brings you here?"
        },
    ]
    chat_session = model.start_chat(history = chat_history, temperature=0.7)
    response = chat_session.send_message(message)
    return response.text

@app.route('/chat', methods=['POST'])
def chat_endpoint():
    message = request.form.get('message')
    response = chat(message)
    return jsonify({'response': response})

# frontend code
# async function sendMessage(message) {
#     const response = await fetch('http://localhost:5000/chat', {
#         method: 'POST',
#         headers: {
#             'Content-Type': 'application/json'
#         },
#         body: JSON.stringify({ message: message })
#     });
#     const data = await response.json();
#     console.log(data.response);
# }

if __name__ == '__main__':
    app.run(debug=True, port=5000)