import { useState, useRef, useEffect } from "react";

interface Question {
  question: string;
  topic: string;
  guidelines: string;
  is_part2: boolean;
}

const TalkToAIButton = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [currentPart, setCurrentPart] = useState(1);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    question: "",
    topic: "",
    guidelines: "",
    is_part2: false
  });
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    fetchRandomQuestion(currentPart, questionNumber);
  }, [currentPart, questionNumber]);

  const fetchRandomQuestion = async (part: number, questionNumber: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/get-random-question?part=${part}&question_number=${questionNumber}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch question");
      }
      const data = await response.json();
      setCurrentQuestion(data.question);

      // Handle part transitions
      if (!data.question.question && !data.question.topic && !data.question.guidelines) {
        if (part === 1 && questionNumber >= 3) { // Move to Part 2 after 4 questions
          setCurrentPart(2);
          setQuestionNumber(0);
        } else if (part === 2 && questionNumber >= 1) { // Move to Part 3 after Part 2
          setCurrentPart(3);
          setQuestionNumber(0);
        }
      }
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const handleStart = () => {
    setShowWelcome(false);
    setShowGuidelines(true);
  };

  const handleAcceptGuidelines = () => {
    setShowGuidelines(false);
    setCurrentPart(1);
    setQuestionNumber(0);
  };

  const handleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);
        setTranscript("");
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
          const formData = new FormData();
          formData.append("file", audioBlob, "recording.wav");

          const transcribeResponse = await fetch("http://localhost:8000/api/transcribe", {
            method: "POST",
            body: formData,
          });

          if (!transcribeResponse.ok) {
            console.error("Transcription failed");
            return;
          }

          const transcribeData = await transcribeResponse.json();
          setTranscript(transcribeData.transcript);

          const generateResponse = await fetch("http://localhost:8000/api/generate-response", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_text: transcribeData.transcript, part: currentPart, question_number: questionNumber, is_first_question: questionNumber === 0 }),
          });

          if (!generateResponse.ok) {
            console.error("Failed to generate AI response");
            return;
          }

          const generateData = await generateResponse.json();
          setCurrentQuestion(generateData.question);

          const ttsResponse = await fetch("http://localhost:8000/api/text-to-speech", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: generateData.response_text }),
          });

          if (!ttsResponse.ok) {
            console.error("Text-to-Speech conversion failed");
            return;
          }

          const ttsData = await ttsResponse.json();
          const audioBase64 = ttsData.audio_base64;
          const audioUrl = `data:audio/wav;base64,${audioBase64}`;
          const audio = new Audio(audioUrl);
          audio.play();
        };
      } catch (error) {
        console.error("Error starting recording:", error);
      }
    } else {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    }
  };

  // const handleNextQuestion = () => {
  //   setQuestionNumber((prev) => prev + 1);
  //   if (questionNumber >= 5 && currentPart === 1) { // Assuming 5 questions for Part 1
  //     setCurrentPart(2);
  //     setQuestionNumber(0);
  //   } else if (questionNumber >= 3 && currentPart > 1) { // Assuming 3 questions for Parts 2 and 3
  //     setCurrentPart((prev) => prev + 1);
  //     setQuestionNumber(0);
  //   }
  //   fetchRandomQuestion(currentPart);
  //   setTranscript("");
  // };

  const handleNextQuestion = () => {
    const nextQuestionNumber = questionNumber + 1;
    setQuestionNumber(nextQuestionNumber);
    fetchRandomQuestion(currentPart, nextQuestionNumber);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
      {showWelcome ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">Hey, welcome! Team Zephyr welcomes you to your IELTS Buddy platform!</h1>
          <button onClick={handleStart} className="py-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
            Let's Start!
          </button>
        </div>
      ) : showGuidelines ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Guidelines</h2>
          <p className="mb-4">Here are some guidelines on how to use this tool...</p>
          <button onClick={handleAcceptGuidelines} className="py-2 px-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
            Accept and Continue
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">Part {currentPart}</h2>

          {currentPart === 2 ? (
            <div className="mb-4">
              <h3 className="font-bold">Topic: {currentQuestion.topic}</h3>
              <p className="mt-2">Guidelines: {currentQuestion.guidelines}</p>
            </div>
          ) : (
            <>
              {currentQuestion.topic && (
                <p className="mb-2 font-medium">Topic: {currentQuestion.topic}</p>
              )}
              {currentQuestion.question && (
                <p className="mb-4">Question: {currentQuestion.question}</p>
              )}
            </>
          )}

          <button
            onClick={handleRecording}
            className={`w-full py-3 rounded-full text-white transition-colors ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
              }`}
          >
            {isRecording ? "Stop Recording" : "Start"}
          </button>

          <div className="mt-4 w-full p-3 bg-gray-100 rounded-lg h-40 overflow-y-auto">
            <p className="text-gray-800">{transcript}</p>
          </div>

          {(!currentQuestion.is_part2 || questionNumber === 0) && (
            <button
              onClick={handleNextQuestion}
              className="mt-4 py-2 px-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              Next Question
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TalkToAIButton;