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
        prompt=request.json.get('prompt')
        response = model.generate_content(prompt, generation_config = genai.types.GenerationConfig(temperature=0.1))
        return jsonify({'response': response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

''' # Chunched 
response = model.generate_content("what is alpha", stream=True)
for chunk in response:
    print(chunk.text)
'''

def chat(message):
    chat_history = [
        {"role": "system", "parts": "Hello"},
        {"role": "user", "parts": "Hello"},
        {"role": "model", "parts": "Hey Green Panther!\nWhat brings you here?"},
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

def interpret_command_with_gpt(command):
    
    genai.configure(api_key="Your api key")
    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 8192,
    }

    safety_settings = [
        {
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
    ]

    model = genai.GenerativeModel(model_name="gemini-1.5-flash",
                                  generation_config=generation_config,
                                  safety_settings=safety_settings)
    
    img = PIL.Image.open('tshirt.JPG')

    prompt_parts = f"""
        
        Interpret the following command and provide the output in JSON format, dont explain anything:
        
        input: Hello how are you?
        output: {{
        "action": "general_chat",
        "parameters": {{
            "response": "I'm great, thank you! How can I assist you today?",
        }}
        }}

        input: What is this platform for?
        output: {{
        "action": "general_chat",
        "parameters": {{
            "response": "This is an innovative platform that bridges the gap between designers and manufacturers. 
        Designers can post their creations for manufacturers to purchase, and there's also a marketplace 
        where customers can buy directly from designers and manufacturers. Additionally, the platform helps 
        designers connect with manufacturers to produce their designs, fostering a collaborative and efficient ecosystem for 
        creative ideas and production solutions.",
        }}
        }}

        input: what all can you do?
        output: {{
        "action": "general_chat",
        "parameters": {{
            "response": "I can answer any questions that you might have about our platform, and I can even give you feedback on your designs! If you want feedback on a design, just say \"I want design feedback\".",
        }}
        }}

        
        input: Who are you?
        
        output: {{
        "action": "general_chat",
        "parameters": {{
            "response": "I'm your FashionTech Assistant, here to help you navigate our platform and connect with designers and manufacturers.",
        }}
        }}


        input: I want design feedback
        output: {{
        "action": "judge_image",
        "parameters": {{
            "response": "please upload an image for me to judge"
        }}
        }}

        input: Please rate my design
        output: {{
        "action": "judge_image",
        "parameters": {{
            "response": "please upload an image for me to judge"
        }}
        }}
        
        input: {img}
        output: {{
        "action": "image_input",
        "parameters": {{
            "response": "The design is clean and professional, with a strong emphasis on the consultant role. The use of bold typography and contrasting colors creates a visually striking impact. The upward-facing graph and lines add a dynamic element, suggesting growth and progress. However, consider exploring different layouts or graphic elements to further enhance the design's uniqueness and appeal. "
        }}
        }}

                        
        input: {command}
        output:
        """

    

    response = model.generate_content(prompt_parts)
    
    print(response.text.strip().strip('`'))
    # print(response.text)
    return response.text.strip().strip('`')


if __name__ == '__main__':
    app.run(debug=True, port=5000)