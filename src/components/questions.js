import React, { useState, useEffect } from 'react';
import data from '../data/data.json'

export default function App() {

	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [showScore, setShowScore] = useState(false);
	const [score, setScore] = useState(0);
  const [ansArr, setAns] = useState([]);
  const [questions, setQs] = useState(data)
  const [start, setStart] = useState(false)
  const [q, setNextQ] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [ans, setCorrectAns] = useState('')
  const [checked, setChecked] = useState(false)
  const [showQs, setShowQs] = useState(false)
  
  useEffect(() => {
    const getAnswers = () => {
      let arr1 = []
      if (questions[currentQuestion]) {
      arr1.push({answerText: questions[currentQuestion].correct, isCorrect: true})
      for (let i = 0; i < questions[currentQuestion].incorrect.length; i++) {
        arr1.push({answerText: questions[currentQuestion].incorrect[i], isCorrect: false})
      }
      return setAns(shuffle(arr1))
      }
    }
    getAnswers()
  }, [currentQuestion, start, questions])

	const handleAnsOpt = (correct) => {
		if (correct) {
			setScore(score + 1)
		}
		setCurrentQuestion(currentQuestion + 1);
    nextQ()
  }

  const getQs = () => {
    setQs(shuffle(data))
    setQs(questions.slice(0, 10))
    setStart(true)
  }

  const shuffle = (arr) => {
    let counter = arr.length, temp, index;
    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }
    return arr;
  }

  const handleChange = (isCorrect, arr) => {
    setCorrect(isCorrect)
    getCorrectAns(arr)
    setChecked(true)
  }

  const handleClick = (correct) => {
    if (checked) {
      handleAnsOpt(correct)
      setChecked(false)
    } else {
      alert('Please select an answer')
    }
  }

  const getCorrectAns = (arr) => {
    for (let ansOpt of arr) {
      if (ansOpt.isCorrect) {
        setCorrectAns(ansOpt.answerText)
      }
    }
  }

  const nextQ = () => setNextQ(!q)

  const restart = () => {
    setCurrentQuestion(0)
    setShowScore(false)
    setScore(0)
    setAns([])
    setQs(data)
    setStart(false)
    setNextQ()
    setCorrect(false)
    setCorrectAns('')
  }

  const show = () => setShowQs(!showQs)

  const allQs = data.map((e, i) => {
    return <div key={i}>
      {i + 1}: {e.question}
    </div>
  })

	return (
    showQs
    ?
    <div className='questions'>
      <span onClick={() => show()}>X</span>
      {allQs}
    </div>
    :
		<div className='app'>
      { !start
        ?
        <>
        <button onClick={() => getQs()} style={{marginRight: `8px`}}>Click to start the trivia!</button>
        <button onClick={() => show()} style={{marginLeft: `8px`}}>Click to review the questions!</button>
        </>
        :
        showScore
        ?
        (
          <>
          <div className='score-section'>
					  You scored {score} out of {questions.length}
				  </div>
          <button onClick={() => restart()}>Reset</button>
          </>
        )
        :
        q
        ?
        <>
        <div className='score-section'>
        <div>The correct answer is: {ans}</div>
        </div>
        {
          currentQuestion !== 10
          ?
          <button onClick={() => nextQ()}>Next Question</button>
          :
          <button onClick={() => setShowScore(true)}>Show My Score!</button>
        }
        </>
        :
        <>
					<div className='question-section'>
						<div className='question-count'>
							<span>Question {currentQuestion + 1}</span>/{questions.length}
						</div>
						<div className='question-text'>{questions[currentQuestion].question}</div>
					</div>
					<div className='answer-section'>
            {
              ansArr.map((ansOpt) => (
                <div key={ansOpt.answerText} className='answer-option'>
                <input type='radio' name='answers' id={ansOpt.answerText} onChange={() => handleChange(ansOpt.isCorrect, ansArr)}/>
                <label htmlFor={ansOpt.answerText}>{ansOpt.answerText}</label>
                </div>
              )
              )
            }
            <button onClick={() => handleClick(correct)}>Submit</button>
					</div>
				</>
      }
		</div>
	);
}