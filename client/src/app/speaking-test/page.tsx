"use client"

import React, { useState, useRef, useEffect } from "react"
import { Mic, StopCircle, Volume2, Pause, SkipForward, ChevronRight } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Confetti from "react-confetti"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import Dashboard from '../dashboard/page'

interface Question {
  question: string
  topic: string
  guidelines: string
  is_part2: boolean
}

interface FeedbackCriteria {
  criterion: string
  score: number
  feedback: string
}

const SpeakingTestPage = () => {
  const router = useRouter()
  const pathname = usePathname()
  const part = pathname.split("/").pop()
  const partNumber = parseInt(part || "1")

  const [selectedPart, setSelectedPart] = useState<number | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [showResponse, setShowResponse] = useState(false)
  const [isAISpeaking, setIsAISpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [currentPart, setCurrentPart] = useState<number>(partNumber)
  const [questionNumber, setQuestionNumber] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    question: "",
    topic: "",
    guidelines: "",
    is_part2: false,
  })
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackData, setFeedbackData] = useState<FeedbackCriteria[]>([])
  const [showCelebration, setShowCelebration] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const maxQuestions = currentPart === 1 ? 4 : currentPart === 2 ? 1 : 3

  useEffect(() => {
    if (selectedPart !== null) {
      fetchRandomQuestion(selectedPart, questionNumber)
    }
  }, [selectedPart, questionNumber])

  const fetchRandomQuestion = async (part: number, questionNumber: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/get-random-question?part=${part}&question_number=${questionNumber}`
      )
      if (!response.ok) {
        throw new Error("Failed to fetch question")
      }
      const data = await response.json()
      setCurrentQuestion(data.question)

      // Check if we've reached the end of a part
      if (questionNumber >= maxQuestions) {
        setShowCelebration(true)
        setTimeout(() => {
          setShowCelebration(false)
          if (part < 3) {
            setSelectedPart(part + 1)
            setCurrentPart(part + 1)
            setQuestionNumber(0)
          } else {
            // Test completed
            setSelectedPart(null)
          }
        }, 5000)
      }
    } catch (error) {
      console.error("Error fetching question:", error)
    }
  }

  const handlePartSelection = (part: number) => {
    setSelectedPart(part)
    setCurrentPart(part)
    setQuestionNumber(0)
    setShowFeedback(false)
    setTranscript("")
    setIsAISpeaking(false)
  }

  const handleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        mediaRecorder.start()
        setIsRecording(true)
        setTranscript("")
        audioChunksRef.current = []

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data)
          }
        }

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
          const formData = new FormData()
          formData.append("file", audioBlob, "recording.wav")

          const transcribeResponse = await fetch("http://localhost:8000/api/transcribe", {
            method: "POST",
            body: formData,
          })

          if (!transcribeResponse.ok) {
            console.error("Transcription failed")
            return
          }

          const transcribeData = await transcribeResponse.json()
          setTranscript(transcribeData.transcript)

          const generateResponse = await fetch("http://localhost:8000/api/generate-response", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_text: transcribeData.transcript,
              part: currentPart,
              question_number: questionNumber,
              is_first_question: questionNumber === 0,
            }),
          })

          if (!generateResponse.ok) {
            console.error("Failed to generate AI response")
            return
          }

          const generateData = await generateResponse.json()
          setCurrentQuestion(generateData.question)
          setFeedbackData(generateData.feedback)

          const ttsResponse = await fetch("http://localhost:8000/api/text-to-speech", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: generateData.response_text }),
          })

          if (!ttsResponse.ok) {
            console.error("Text-to-Speech conversion failed")
            return
          }

          const ttsData = await ttsResponse.json()
          const audioBase64 = ttsData.audio_base64
          const audioUrl = `data:audio/wav;base64,${audioBase64}`
          audioRef.current = new Audio(audioUrl)
          setIsAISpeaking(true)
          audioRef.current.play()

          audioRef.current.onended = () => {
            setIsAISpeaking(false)
            setShowFeedback(true)
          }
        }
      } catch (error) {
        console.error("Error starting recording:", error)
      }
    } else {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop()
      }
      setIsRecording(false)
    }
  }

  const handleNextQuestion = () => {
    const nextQuestionNumber = questionNumber + 1
    setQuestionNumber(nextQuestionNumber)
    fetchRandomQuestion(currentPart, nextQuestionNumber)
    setTranscript("")
    setShowFeedback(false)
    setShowResponse(false)
  }

  const handleSkipQuestion = () => {
    handleNextQuestion()
  }

  const stopAISpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsAISpeaking(false)
    }
  }

  return (
    <Dashboard>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col justify-center items-center">
        {showCelebration && <Confetti />}
        {!selectedPart ? (
          <div className="max-w-4xl w-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Speaking Test Parts</h1>
            <div className="space-y-8">
              {[1, 2, 3].map((part) => (
                <Card
                  key={part}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handlePartSelection(part)}
                >
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">
                      Part {part} - {part === 1 ? "Introduction & Interview" : part === 2 ? "Long Turn" : "Discussion"}
                    </h2>
                    <p className="text-gray-600">Click to start Part {part} of the speaking test.</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="w-full max-w-3xl bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-2xl font-bold text-center text-gray-800">Part {currentPart}</h2>
              <Progress value={(questionNumber / maxQuestions) * 100} className="w-full" />
              <p className="text-center text-gray-600">
                Question {questionNumber + 1} of {maxQuestions}
              </p>

              {/* AI Question */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-start gap-4 mb-6"
              >
                <Avatar className="w-12 h-12 border-2 border-blue-500">
                  <AvatarImage src="/ai-avatar.png" alt="AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <p className="text-gray-800 mb-2">{currentQuestion.question}</p>
                      {currentQuestion.guidelines && (
                        <p className="text-gray-600 text-sm mt-2">{currentQuestion.guidelines}</p>
                      )}
                      <AnimatePresence>
                        {isAISpeaking && (
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={{
                              hidden: { opacity: 0, height: 0 },
                              visible: { opacity: 1, height: "auto" },
                            }}
                            transition={{ duration: 0.3 }}
                            className="mt-2"
                          >
                            <AIWave />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                  <div className="flex items-center gap-2 mt-2">
                    {isAISpeaking && (
                      <Button size="sm" variant="outline" onClick={stopAISpeaking}>
                        <Pause className="w-4 h-4 mr-2" />
                        Stop
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={handleSkipQuestion}>
                      <SkipForward className="w-4 h-4 mr-2" />
                      Next
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Recording Interface */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <AnimatePresence>
                  {isRecording && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute inset-0 bg-gray-50 rounded-xl overflow-hidden"
                    >
                      <RecordingWave />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex flex-col items-center gap-2">
                  <Button
                    size="lg"
                    variant={isRecording ? "destructive" : "default"}
                    className="rounded-full w-16 h-16 z-10"
                    onClick={handleRecording}
                  >
                    {isRecording ? <StopCircle className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </Button>
                  <span className="text-sm text-gray-600">{isRecording ? "Tap to stop" : "Tap to speak"}</span>
                </div>
              </motion.div>

              {/* User Response */}
              <AnimatePresence>
                {transcript && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-start gap-4 justify-end"
                  >
                    <div className="flex-1">
                      <Card className="bg-gray-100 border-gray-200">
                        <CardContent className="p-4">
                          <p className="text-gray-800">{transcript}</p>
                        </CardContent>
                      </Card>
                    </div>
                    <Avatar className="w-12 h-12 border-2 border-gray-300">
                      <AvatarImage src="/user-avatar.png" alt="User" />
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Speaking Feedback */}
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-4">Speaking Feedback</h3>
                        {feedbackData.map((criteria, index) => (
                          <div key={index} className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{criteria.criterion}</span>
                              <span className="text-sm text-gray-500">{criteria.score}/5</span>
                            </div>
                            <Slider
                              defaultValue={[criteria.score]}
                              max={5}
                              step={1}
                              className="w-full"
                            />
                            <p className="text-sm text-gray-600 mt-1">{criteria.feedback}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Next Question and Skip Buttons */}
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex gap-4"
                  >
                    <Button onClick={handleSkipQuestion} variant="outline" className="flex-1">
                      Skip
                      <SkipForward className="w-4 h-4 ml-2" />
                    </Button>
                    <Button onClick={handleNextQuestion} className="flex-1">
                      Next Question
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        )}
        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Card className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
              <p className="mb-4">You've completed Part {currentPart} of the speaking test.</p>
              {currentPart === 3 && (
                <p className="mb-4 text-lg font-medium">Overall Band: 7</p>
              )}
              {currentPart < 3 ? (
                <Button onClick={() => handlePartSelection(currentPart + 1)}>
                  Continue to Part {currentPart + 1}
                </Button>
              ) : (
                <Button onClick={() => router.push("/")}>Finish Test</Button>
              )}
            </Card>
          </div>
        )}
      </div>
    </Dashboard>
  )
}

const AIWave = () => (
  <div className="flex gap-0.5 h-4 items-end">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="w-1 bg-blue-500 rounded-full"
        animate={{
          height: ["20%", "100%", "20%"],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: i * 0.1,
        }}
      />
    ))}
  </div>
)

const RecordingWave = () => (
  <div className="flex items-center justify-center gap-0.5 h-32 w-full">
    {[...Array(50)].map((_, i) => (
      <motion.div
        key={i}
        className="w-1 bg-blue-400 rounded-full"
        animate={{
          height: [
            `${Math.sin(i * 0.2) * 50 + 50}%`,
            `${Math.sin((i + 1) * 0.2) * 50 + 50}%`,
          ],
        }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
)

export default SpeakingTestPage