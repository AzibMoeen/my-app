'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"



export default function Component({data}) {
  const [questions, setQuestions] = useState(data.questionsArray)
  const [userAnswers, setUserAnswers] = useState(Array(questions.length).fill(''))
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !quizCompleted) {
      setQuizCompleted(true)
    }
  }, [timeLeft, quizCompleted])

  const handleAnswerChange = (questionIndex, answer) => {
    const newAnswers = [...userAnswers]
    newAnswers[questionIndex] = answer
    setUserAnswers(newAnswers)
  }

  const handleSubmit = () => {
    if (userAnswers.every(answer => answer !== '')) {
      setQuizCompleted(true)
    } else {
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    }
  }

  const calculateScore = () => {
    return userAnswers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correctAnswer ? 1 : 0)
    }, 0)
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  if (quizCompleted) {
    const score = calculateScore()
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Quiz Completed!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">Your score: {score} out of {questions.length}</p>
          <ul className="space-y-2">
            {questions.map((q, index) => (
              <li key={index} className={userAnswers[index] === q.correctAnswer ? "text-green-600" : "text-red-600"}>
                Q{index + 1}: {userAnswers[index] === q.correctAnswer ? "Correct" : "Incorrect"}
                {userAnswers[index] !== q.correctAnswer && (
                  <span className="ml-2">
                    (Correct answer: {q.correctAnswer})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>MCQ Test - All Questions</CardTitle>
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold">Time Left: {formatTime(timeLeft)}</p>
          <Progress value={(timeLeft / 600) * 100} className="w-1/2" />
        </div>
      </CardHeader>
      <CardContent>
        {showAlert && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Please answer all questions before submitting.
            </AlertDescription>
          </Alert>
        )}
        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="mb-6">
            <p className="text-lg mb-2">
              {questionIndex + 1}. {question.question}
            </p>
            <RadioGroup
              value={userAnswers[questionIndex]}
              onValueChange={(value) => handleAnswerChange(questionIndex, value)}
            >
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value={option} id={`q${questionIndex}-option-${optionIndex}`} />
                  <Label htmlFor={`q${questionIndex}-option-${optionIndex}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmit}>
          Submit Quiz
        </Button>
      </CardFooter>
    </Card>
  )
}