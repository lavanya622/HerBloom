
import os
import time

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise RuntimeError("GEMINI_API_KEY is missing in backend/.env")

client = genai.Client(api_key=api_key)

app = FastAPI(title="HerBloom AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


@app.get("/")
def home():
    return {"message": "HerBloom AI backend is running!"}


@app.post("/chat")
def chat(request: ChatRequest):
    message = request.message.strip()

    if not message:
        raise HTTPException(
            status_code=400,
            detail="Please enter a message."
        )

    prompt = (
        "You are HerBloom, a kind, gentle and supportive "
        "AI companion for girls. Be warm, respectful, "
        "non-judgmental and concise. Do not pretend to be "
        "a human or therapist. If someone may be in immediate "
        "danger, encourage them to contact a trusted person "
        "or local emergency services.\n\n"
        f"User: {message}"
    )

    for attempt in range(3):
        try:
            print(f"Gemini request attempt {attempt + 1}")

            response = client.models.generate_content(
                model="gemini-3.1-flash-lite",
                contents=prompt,
            )

            if not response.text:
                raise HTTPException(
                    status_code=502,
                    detail="Gemini returned an empty response."
                )

            return {"reply": response.text}

        except HTTPException:
            raise

        except Exception as error:
            print("GEMINI ERROR:", repr(error))

            error_text = str(error)

            if "503" in error_text or "UNAVAILABLE" in error_text:
                if attempt < 2:
                    time.sleep(2 ** (attempt + 1))
                    continue

                raise HTTPException(
                    status_code=503,
                    detail="HerBloom AI is temporarily busy. Please try again shortly. ♡"
                )

            raise HTTPException(
                status_code=502,
                detail="Gemini API error. Check the backend terminal."
            )

    raise HTTPException(
        status_code=503,
        detail="HerBloom AI is temporarily unavailable."
    )
