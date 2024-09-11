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
@app.route('/generate/entire', methods=['POST'])
def generate_entire_text():
    try:
        prompt=request.json.get('prompt')
        response = model.generate_content(prompt)
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
        {"role": "user", "parts": "Hello"},
        {"role": "model", "parts": "Great to meet you. What would you like to know?"},
    ]
    chat_session = model.start_chat(history=chat_history)
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)