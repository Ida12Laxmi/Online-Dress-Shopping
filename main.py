from fastapi import FastAPI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os,openai
from openai import OpenAI
from pathlib import Path
from groq import Groq
from dotenv import load_dotenv
import base64
from fastapi import FastAPI, File, UploadFile, Form
from typing import Optional

env_path=Path(__file__).resolve().parent/".env"
load_dotenv(dotenv_path=env_path) #Loads OPENAI_API_KEY from .env

#openai.api_key=os.getenv("OPENAI_API_KEY")
app=FastAPI()
#Allow React Frontend to access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class chatRequest(BaseModel):
    message:str
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

#get
@app.get("/")
def root():
     return {"status": "Backend running 👗"}

@app.post("/upload")
async def upload_file(message: str = Form(...), file: Optional[UploadFile] = File(None)):
    try:
        # Provide a default text if the user only sends an image
        content_list = [{"type": "text", "text": message or "Analyze this image for me."}]
        
        if file:
            contents = await file.read()
            base64_image = base64.b64encode(contents).decode("utf-8")
            content_list.append({
                "type": "image_url",
                "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}
            })

        response = client.chat.completions.create(
            # UPDATED: Use the current February 2026 production vision model
            model="meta-llama/llama-4-scout-17b-16e-instruct", 
            messages=[
                {"role": "system", "content": "You are a fashion assistant. Analyze the image if provided."},
                {"role": "user", "content": content_list}
            ]
        )
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        return {"error": str(e)}
#post
"""@app.post("/chat")
def chat(req: chatRequest):
    user_message = req.message
    try:
        # Change 'openai.ChatCompletion.create' to this:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are a fashion assistant helping users pick dresses."},
                {"role": "user", "content": user_message}
            ]
        )
        # Change 'response.choices[0].message.content' remains mostly same, 
        # but the client helps VS Code recognize it.
        ai_reply = response.choices[0].message.content
        return {"reply": ai_reply}
    except Exception as e:
        return {"error": str(e)}
        """

