from flask import Flask, request, jsonify
from dotenv import load_dotenv
import google.generativeai as genai
import PIL.Image
import os

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

genai.configure(api_key=api_key)
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

app = Flask(__name__)

# for entire response
@app.route('/generate_disposal', methods=['POST'])
def generate_disposal():
    try:
        name_item=request.json.get('name_item')
        type = request.json.get('type')
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
            I need you to return me value in form of JSON file and map "recycling_method" as a key to the  array containing (strings) various waste recycling techniques of the previous ,mentioned waste type   and another key as "tips" that contains an array of strings(on specifics of how to recycle that specific type of waste, as mentioned earlier and also detailed description about how to recycle those items to something useful ) and the third key is"diy_solutions" it contains an array of strings (which will return the diy solutions for making useful products using those items)
            We are inputting the waste type and name of the waste item return only the disposal_method and tips ,don't return the waste type and item name as we already have that as input
            Don't include results for different type of waste for example and give output for only the input that you will receive
            Inputs are name:{name_item} plate, type: {type}
            Give only the output JSON and no other information whether it be an explanation of the  answer
        ''' 
        response = model.generate_content(prompt, generation_config = genai.types.GenerationConfig(temperature=0.1))
        return jsonify(response.text)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

''' # Chunched 
response = model.generate_content("what is alpha", stream=True)
for chunk in response:
    print(chunk.text)
'''

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
    message = request.json.get('message')
    response = chat(message)
    return jsonify({'response': response})


''' for chatbot frontend
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
}
'''

@app.route('/generate_recycle', methods=['POST'])
def generate_disposal():
    try:
        name_item=request.json.get('name_item')
        type = request.json.get('type')
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
            Inputs are name:{name_item} plate, type: {type}
            Give only the output JSON and no other information whether it be an explanation of the  answer
        ''' 
        response = model.generate_content(prompt, generation_config = genai.types.GenerationConfig(temperature=0.1))
        return jsonify(response.text)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# def interpret_command_with_gpt(command):
    
#     genai.configure(api_key="Your api key")
#     generation_config = {
#         "temperature": 1,
#         "top_p": 0.95,
#         "top_k": 64,
#         "max_output_tokens": 8192,
#     }

#     safety_settings = [
#         {
#             "category": "HARM_CATEGORY_HARASSMENT",
#             "threshold": "BLOCK_MEDIUM_AND_ABOVE"
#         },
#     ]

#     model = genai.GenerativeModel(model_name="gemini-1.5-flash",
#                                   generation_config=generation_config,
#                                   safety_settings=safety_settings)
    
#     img = PIL.Image.open('tshirt.JPG')

#     prompt_parts = f"""
        
#         Interpret the following command and provide the output in JSON format, dont explain anything:
        
#         input: Hello how are you?
#         output: {{
#         "action": "general_chat",
#         "parameters": {{
#             "response": "I'm great, thank you! How can I assist you today?",
#         }}
#         }}

#         input: What is this platform for?
#         output: {{
#         "action": "general_chat",
#         "parameters": {{
#             "response": "This is an innovative platform that bridges the gap between designers and manufacturers. 
#         Designers can post their creations for manufacturers to purchase, and there's also a marketplace 
#         where customers can buy directly from designers and manufacturers. Additionally, the platform helps 
#         designers connect with manufacturers to produce their designs, fostering a collaborative and efficient ecosystem for 
#         creative ideas and production solutions.",
#         }}
#         }}

#         input: what all can you do?
#         output: {{
#         "action": "general_chat",
#         "parameters": {{
#             "response": "I can answer any questions that you might have about our platform, and I can even give you feedback on your designs! If you want feedback on a design, just say \"I want design feedback\".",
#         }}
#         }}

        
#         input: Who are you?
        
#         output: {{
#         "action": "general_chat",
#         "parameters": {{
#             "response": "I'm your FashionTech Assistant, here to help you navigate our platform and connect with designers and manufacturers.",
#         }}
#         }}


#         input: I want design feedback
#         output: {{
#         "action": "judge_image",
#         "parameters": {{
#             "response": "please upload an image for me to judge"
#         }}
#         }}

#         input: Please rate my design
#         output: {{
#         "action": "judge_image",
#         "parameters": {{
#             "response": "please upload an image for me to judge"
#         }}
#         }}
        
#         input: {img}
#         output: {{
#         "action": "image_input",
#         "parameters": {{
#             "response": "The design is clean and professional, with a strong emphasis on the consultant role. The use of bold typography and contrasting colors creates a visually striking impact. The upward-facing graph and lines add a dynamic element, suggesting growth and progress. However, consider exploring different layouts or graphic elements to further enhance the design's uniqueness and appeal. "
#         }}
#         }}

                        
#         input: {command}
#         output:
#         """

    

#     response = model.generate_content(prompt_parts)
    
#     print(response.text.strip().strip('`'))
#     # print(response.text)
#     return response.text.strip().strip('`')


if __name__ == '__main__':
    app.run(debug=True, port=5000)