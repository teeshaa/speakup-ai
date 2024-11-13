from pydantic import BaseModel


class TranscriptionResponse(BaseModel):
    transcript: str


class GenerateResponseRequest(BaseModel):
    user_text: str
    part: int
    question_number: int
    is_first_question: bool


class GenerateResponseResponse(BaseModel):
    response_text: str


class TextToSpeechRequest(BaseModel):
    text: str


class TextToSpeechResponse(BaseModel):
    audio_url: str
