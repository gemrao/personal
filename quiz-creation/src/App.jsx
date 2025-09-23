import { useState, useMemo } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Quiz from './Quiz.jsx'
import data from './quiz.json'
import QuizGenerator from './QuizGenerator.jsx'

function App() {
  const [question, setQuestion] = useState(0)
  const [selected, setSelected] = useState(new Map())
  const [showResult, setResult] = useState(false)

  function answerCallback(questionNo, optionNo, ans) {
    const val = new Map(selected)
    val.set(questionNo, optionNo)
    setSelected(val)
  }

  const navigate = () => {
    setQuestion(question + 1)

  }
  const submit = () => {
    setResult(!showResult)

  }

  return (
    <div className="min-h-screen">
      <header className='w-full flex justify-between py-16'>
        <div>Quiz Application</div>
      </header>
      <Quiz data={data[question]} selected={selected.get(data[question].id)} answerCallback={(questionNo, optionNo, ans) => { answerCallback(questionNo, optionNo, ans) }} />
      {question < data.length - 1 && <div className='py-8 flex justify-between'>
        <div className='rounded-xl border-1 p-2' onClick={() => navigate()}>Next</div>
      </div>}
      {question === data.length - 1 && <div className='py-8 flex justify-between'>
        <div className='rounded-xl border-1 p-2' onClick={() => submit()}>Submit</div>
      </div>}

      <QuizGenerator />
    </div >
  )
}

export default App
