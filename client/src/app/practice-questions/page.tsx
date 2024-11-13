'use client'

import React, { useState } from 'react'
import Dashboard from '../dashboard/page'

const questions = [
  "Describe your favorite place to relax.",
  "What's your opinion on social media?",
  "Discuss a challenge you've overcome recently.",
  "Explain the importance of learning a foreign language.",
  "Describe your ideal job and why it appeals to you."
]

export default function PracticeQuestions() {
  const [currentQuestion, setCurrentQuestion] = useState('')

  const getRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questions.length)
    setCurrentQuestion(questions[randomIndex])
  }

  return (
    <Dashboard>
      <div className="p-8">  {/* Added padding all around */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Practice Questions</h1>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Random Question Generator</h2>
          <p className="text-gray-600 mb-4">
            Click the button below to get a random practice question. Try to speak for 1-2 minutes on the given topic.
          </p>
          <button
            onClick={getRandomQuestion}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate Question
          </button>
          {currentQuestion && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Your Question:</h3>
              <p className="text-gray-600 p-4 bg-gray-100 rounded-lg">{currentQuestion}</p>
            </div>
          )}
        </div>
      </div>
    </Dashboard>
  )
}