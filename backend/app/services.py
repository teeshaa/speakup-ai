import base64
import os
import random
from io import BytesIO
from typing import Dict, List
import random
import pandas as pd
import assemblyai as aai
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import UploadFile
from gtts import gTTS
from langchain.prompts import PromptTemplate

load_dotenv()

aai.settings.api_key = os.getenv("ASSEMBLY_API_KEY")

TRANSCRIPT_FILE = "transcripts/user_transcript.txt"
STATIC_TEXT_FILE = "static/user_text.txt"
AUDIO_OUTPUT_PATH = "audios/output.wav"

os.makedirs(os.path.dirname(TRANSCRIPT_FILE), exist_ok=True)
os.makedirs(os.path.dirname(STATIC_TEXT_FILE), exist_ok=True)
os.makedirs(os.path.dirname(AUDIO_OUTPUT_PATH), exist_ok=True)

class QuestionManager:
    def __init__(self):
        self.current_sessions: Dict[int, List[str]] = {}
        self.current_topic: str = ""
        self.current_guidelines: str = ""
        self.selected_row = None
        try:
            self.part1_df = pd.read_csv(
                "/data/ielts_speaking_part1_questions.csv"
            )
            self.part23_df = pd.read_csv(
                "/data/ielts_speaking_part2_and_part3_questions.csv"
            )
        except FileNotFoundError:
            raise Exception("CSV files not found. Please check the file paths.")

    def initialize_part1_session(self) :
        random_row = random.choice(self.part1_df["Questions"].tolist())
        questions = [q.strip() for q in random_row.strip('"').split(",")]
        self.current_sessions[1] = questions
        return questions[0] if questions else ""

    def initialize_part2_session(self) -> Dict[str, str]:
        random_row_idx = random.randint(0, len(self.part23_df) - 1)
        self.selected_row = self.part23_df.iloc[random_row_idx]

        self.current_topic = self.selected_row["Topic"]
        self.current_guidelines = self.selected_row["Guidelines"]

        formatted_question = f"Topic: {self.current_topic}\n\nGuidelines:\n{self.current_guidelines}"

        return {
            "question": formatted_question, 
            "topic": self.current_topic,
            "guidelines": self.current_guidelines,
        }

    def initialize_part3_session(self) -> str:
        if self.selected_row is not None:
            part3_questions = [
                q.strip()
                for q in self.selected_row["Part 3 Questions"]
                .strip('"')
                .split(",")
            ]
            self.current_sessions[3] = part3_questions
            return part3_questions[0] if part3_questions else ""
        return ""

    def get_next_question(self, part: int, question_number: int) -> Dict[str, any]:
        if part == 1:
            if part not in self.current_sessions or question_number == 0:
                return {
                    "question": self.initialize_part1_session(),
                    "topic": "",
                    "guidelines": "",
                    "is_part2": False,
                }
            if question_number < len(self.current_sessions[1]):
                return {
                    "question": self.current_sessions[1][question_number],
                    "topic": "",
                    "guidelines": "",
                    "is_part2": False,
                }

        elif part == 2:
            if question_number == 0:
                part2_data = self.initialize_part2_session()
                return {
                    "question": part2_data["question"],  
                    "topic": part2_data["topic"],
                    "guidelines": part2_data["guidelines"],
                    "is_part2": True,
                }
            return {
                "question": "",
                "topic": "",
                "guidelines": "",
                "is_part2": True,
            }

        elif part == 3:
            if part not in self.current_sessions or question_number == 0:
                return {
                    "question": self.initialize_part3_session(),
                    "topic": self.current_topic,
                    "guidelines": "",
                    "is_part2": False,
                }
            if question_number < len(self.current_sessions[3]):
                return {
                    "question": self.current_sessions[3][question_number],
                    "topic": self.current_topic,
                    "guidelines": "",
                    "is_part2": False,
                }

        return {
            "question": "",
            "topic": "",
            "guidelines": "",
            "is_part2": False,
        }


question_manager = QuestionManager()


def get_random_question(part: int, question_number: int = 0) -> Dict[str, any]:
    return question_manager.get_next_question(part, question_number)

class IELTSPromptManager:
    @staticmethod
    def get_part1_prompt() -> str:
        return """
        You are an IELTS speaking test examiner. This will the part 1 of the test which is Introduction and Interview. answer of each questions will be around 1-2 minutes.
        You have to examine the answer given by the candidate below for the question. Analyze the answer and provide suggestions on where the candidate can improve their speaking skills. Suggestions should be constructive and helpful.

        Question: {question}
        Candidate Answer: {answer}

        Here are some examples of Part 1 questions with responses and feedback to guide you:

        Example 1:
        Question: "What is your favorite color?"
        Candidate Answer: "My favorite color is blue because it makes me feel calm and peaceful."
        Feedback: Try to expand on why the color blue has a personal impact. Mention where you usually see it, or if it has a cultural or childhood significance for you.

        Example 2:
        Question: "Do you enjoy reading books?"
        Candidate Answer: "Yes, I love reading books, especially novels because they are very interesting."
        Feedback: Add some details about what types of novels you enjoy (e.g., mystery, romance) and why you find them interesting. This helps convey your personality and specific tastes.

        Example 3:
        Question: "What kind of weather do you prefer?"
        Candidate Answer: "I like sunny weather because it's warm and bright."
        Feedback: Try to add examples of activities you enjoy during sunny weather, such as going to the park or spending time outdoors, to make your answer more engaging.

        Use these examples to analyze the candidate's response and provide helpful suggestions to improve fluency, depth, and detail in their answers.

        give a feedback like you are a tutor and giving an advice to your student to score better in IELTS speaking test (make your feedback shorter of 6-7 lines and also do not add any formating or * in the feedback).
        """

    @staticmethod
    def get_part2_prompt() -> str:
        return """
        You are an IELTS speaking test examiner. Your task is to evaluate the candidate's response to a Part 2 speaking prompt. Encourage the candidate to answer in detail, aiming for an average of 2 minutes. If the answer is too brief, provide feedback on how to expand their response. Focus on fluency, vocabulary, coherence, grammar, and pronunciation, and offer specific, constructive feedback on areas for improvement.

        Topic: {topic}
        Guidelines: {guidelines}
        Candidate's Answer: {answer}

        Here are some examples of feedback for Part 2 responses:
        Example 1:
        Topic: "Describe a memorable holiday."
        Candidate Answer: "I went to Paris last year with my family. It was my dream to see the Eiffel Tower. We visited many places, and I took a lot of pictures."
        Feedback: Good start, but try to add more descriptive details. Aim to speak for about 2 minutes by discussing specific memories or experiences. For example, describe a favorite location or moment, and talk about what made it memorable.

        Example 2:
        Topic: "Describe a skill you learned recently."
        Candidate Answer: "I learned cooking last month. I started by watching videos online. Now I can make pasta."
        Feedback: Great job mentioning how you learned! To reach the 2-minute mark, add more detail on why you chose cooking, any challenges you faced, and how it feels to prepare a full meal. This will help make your response fuller and more engaging.

        Example 3:
        Topic: "Describe a book you recently read."
        Candidate Answer: "I read 'Pride and Prejudice.' It was a bit difficult but very interesting because of the characters."
        Feedback: Well done! Now try to reach the 2-minute target by discussing what aspects of the characters or storyline were interesting. Describe a character you related to or a specific part that left an impression. This level of detail will improve fluency and coherence.

        Use these examples to provide specific, helpful feedback to the candidate, encouraging them to speak for about 2 minutes and enhancing their overall response quality. (make your feedback shorter of 6-7 lines and also do not add any formating or * in the feedback).
        """

    @staticmethod
    def get_part3_prompt() -> str:
        return """
        You are an IELTS speaking test examiner. Your task is to evaluate the candidate's response to a Part 3 speaking prompt, which includes more abstract and discussion-based questions linked to their Part 2 topic. Analyze the response based on depth of analysis, coherence, vocabulary, grammar, and pronunciation. Provide constructive feedback on how the candidate can improve, encouraging thoughtful and detailed responses.

        Question: {question}
        Topic: {topic}
        Candidate's Answer: {answer}

        Here are some examples of feedback for Part 3 responses:
        Example 1:
        Question: "What benefits do you think travel brings to individuals and society?"
        Candidate Answer: "Travel allows people to learn about new cultures. It also brings money to local businesses."
        Feedback: Great start! To make this more detailed, try to expand on the benefits for individuals, such as gaining new perspectives and personal growth. Additionally, consider discussing how travel fosters cross-cultural understanding, which can benefit society as a whole.

        Example 2:
        Question: "Do you think tourism has any negative effects?"
        Candidate Answer: "Yes, tourism can harm the environment, like pollution."
        Feedback: Good observation! To add depth, mention specific ways tourism impacts local areas, such as overuse of natural resources or overcrowding. Discuss potential solutions, like promoting eco-friendly travel, to show critical thinking.

        Example 3:
        Question: "How has technology changed the way people travel?"
        Candidate Answer: "Technology helps people book tickets online and find places."
        Feedback: Good answer! To make it more comprehensive, consider describing how technology has changed travel experiences, like using GPS to explore, reading online reviews, or connecting with locals through social media. Providing examples will show your fluency and understanding.

        Use these examples to guide your feedback, offering specific suggestions that help the candidate develop structured, thoughtful answers in response to Part 3 questions. (make your feedback shorter of 6-7 lines and also do not add any formating or * in the feedback).
        """


def ielts_feedback_system(
    user_input: str,
    part: int,
    current_question: Dict[str, any],
    is_first_question: bool,
):
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

    prompt_manager = IELTSPromptManager()

    if part == 1:
        prompt_template = prompt_manager.get_part1_prompt()
        prompt = PromptTemplate(
            template=prompt_template, input_variables=["question", "answer"]
        )
        formatted_prompt = prompt.format(
            question=current_question["question"], answer=user_input
        )

    elif part == 2:
        prompt_template = prompt_manager.get_part2_prompt()
        prompt = PromptTemplate(
            template=prompt_template,
            input_variables=["topic", "guidelines", "answer"],
        )
        formatted_prompt = prompt.format(
            topic=current_question["topic"],
            guidelines=current_question["guidelines"],
            answer=user_input,
        )

    else: 
        prompt_template = prompt_manager.get_part3_prompt()
        prompt = PromptTemplate(
            template=prompt_template,
            input_variables=["question", "topic", "answer"],
        )
        formatted_prompt = prompt.format(
            question=current_question["question"],
            topic=current_question["topic"],
            answer=user_input,
        )

    model = genai.GenerativeModel("gemini-1.0-pro")	
    response = model.generate_content(formatted_prompt)
    print(f"Response: {response.text}")
    return response.text


def generate_response(
    user_text: str, part: int, question_number: int, is_first_question: bool
) :
    current_question = get_random_question(part, question_number)

    response_text = ielts_feedback_system(
        user_text, part, current_question, is_first_question
    )

    return response_text, current_question

def transcribe_audio(file: UploadFile) -> str:
    transcriber = aai.Transcriber()
    audio_content = file.file.read()

    try:
        transcript = transcriber.transcribe(audio_content)
        if transcript.status == aai.TranscriptStatus.error:
            return transcript.error
        with open(TRANSCRIPT_FILE, "w") as f:
            f.write(transcript.text)
        return transcript.text
    except Exception as e:
        print(f"Error during transcription: {e}")
        return "An error occurred during transcription."


def convert_text_to_speech(text: str) -> str:
    tts = gTTS(text=text, lang="en", slow=False)
    audio_fp = BytesIO()
    tts.write_to_fp(audio_fp)
    audio_fp.seek(0)
    audio_bytes = audio_fp.read()
    audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")
    return audio_base64
