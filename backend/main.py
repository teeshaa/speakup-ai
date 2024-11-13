from fastapi import FastAPI, File, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app import services
from app.models import (
    GenerateResponseRequest,
    GenerateResponseResponse,
    TextToSpeechRequest,
    TextToSpeechResponse,
    TranscriptionResponse,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/get-random-question")
async def get_random_question(
    part: int = Query(..., description="Part number to fetch a question for"),
    question_number: int = Query(
        0, description="Question number in the current part"
    ),
):
    try:
        question = services.get_random_question(part, question_number)
        return JSONResponse(content={"question": question})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(file: UploadFile = File(...)):
    transcript = services.transcribe_audio(file)
    return TranscriptionResponse(transcript=transcript)


@app.post("/api/generate-response", response_model=GenerateResponseResponse)
async def generate_response(request: GenerateResponseRequest):
    response_text, question = services.generate_response(
        request.user_text,
        request.part,
        request.question_number,
        request.is_first_question,
    )
    return JSONResponse(
        content={"response_text": response_text, "question": question}
    )


@app.post("/api/text-to-speech", response_model=TextToSpeechResponse)
async def text_to_speech(request: TextToSpeechRequest):
    audio_base64 = services.convert_text_to_speech(request.text)
    return JSONResponse(content={"audio_base64": audio_base64})
