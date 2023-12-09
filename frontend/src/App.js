import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State to store all questions fetched from the server
  const [allQuestions, setAllQuestions] = useState(null);
  // State to track the current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // State to store selected options for each question
  const [selectedOptions, setSelectedOptions] = useState([]);
  // State to track if the exam has been submitted
  const [submitted, setSubmitted] = useState(false);
  // State to track loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(null);
  const [passed, setPassed] = useState(null);
  const [results, setResults] = useState([])

  // Function to render the explanation for each question
  const renderExplanation = (question) => {
    if (submitted) {
      return (
        <div className="explanation">
          <p><strong>{question.explanation}</strong></p>
        </div>
      );
    }
    return null;
  };

  const getButtonClass = (option) => {
    const isSelected = selectedOptions[currentQuestionIndex].includes(option);
  
    // Check if results are available for the current question
    if (submitted && results[currentQuestionIndex]) {
      const isCorrectOption = results[currentQuestionIndex].correctAnswers.includes(option);
      const isUserSelected = isSelected;
      const isQuestionAnsweredCorrectly = results[currentQuestionIndex].isCorrect;
  
      if (isCorrectOption) {
        return "option-correct"; // Correct option should always be green
      } else if (isUserSelected && !isQuestionAnsweredCorrectly) {
        return "option-wrong"; // User-selected and wrong
      }
    }
  
    return isSelected ? "option-selected" : "";
  };  

  // Function to shuffle options for randomness
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Fetching exam data from the server
  useEffect(() => {
    setIsLoading(true);
    fetch('http://localhost:3001/api/exam')
      .then(response => response.json())
      .then(data => {
        if (data && data.exam && Array.isArray(data.exam)) {
          const shuffledQuestions = data.exam.map(question => ({
            ...question,
            options: shuffleArray([...question.options])
          }));
          setAllQuestions(shuffledQuestions);
          setSelectedOptions(new Array(shuffledQuestions.length).fill([]));
        } else {
          throw new Error('Invalid data structure');
        }
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
        setError(error.toString());
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Early return for loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Early return for error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Ensure allQuestions is loaded
  if (!allQuestions) {
    return null;
  }

  const currentQuestion = allQuestions[currentQuestionIndex];
  const maxSelectableOptions = currentQuestion.correctAnswersCount;

  // Toggle option selection
  const handleOptionToggle = (option) => {
    if (submitted) return;
    setSelectedOptions(prev => {
      const updatedSelections = [...prev];
      let currentSelections = [...updatedSelections[currentQuestionIndex]];

      const optionIndex = currentSelections.indexOf(option);
      if (optionIndex !== -1) {
        currentSelections.splice(optionIndex, 1);
      } else if (currentSelections.length < maxSelectableOptions) {
        currentSelections.push(option);
      } else {
        currentSelections = [option];
      }

      updatedSelections[currentQuestionIndex] = currentSelections;
      return updatedSelections;
    });
  };

  // Handle 'Next' button click
  const handleNext = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Handle 'Back' button click
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const submissions = allQuestions.map((question, index) => ({
      question: question.question,
      answers: selectedOptions[index]
    }));

    fetch('http://localhost:3001/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submissions })
    })
    .then(response => response.json())
    .then(data => {
      setResults(data.results);
      const updatedQuestions = allQuestions.map((question, index) => {
        return {
          ...question,
          correctAnswers: data.results[index].correctAnswers,
          explanation: data.results[index].explanation
        };
      });
      setAllQuestions(updatedQuestions);

      const correctCount = data.results.filter(result => result.isCorrect).length;
      const calculatedScore = (correctCount / allQuestions.length) * 100;
      setScore(calculatedScore);
      setPassed(calculatedScore >= 72);
      setSubmitted(true);
    })
    .catch(error => {
      console.error('Error submitting answers: ', error);
      setError(error.toString());
    });
  };

  const isLastQuestion = currentQuestionIndex === allQuestions.length - 1;

  // Display results at the top if submitted
  const renderResults = () => {
    if (submitted) {
      return (
        <div className="results-container">
          <h1>Your Score: {score.toFixed(2)}%</h1>
          <p>{passed ? 'Congratulations! You have passed.' : 'Sorry, you have failed.'}</p>
          <div className="question-balls">
            {allQuestions.map((_, index) => (
              <button
                key={index}
                className={`question-ball ${results[index] && results[index].isCorrect ? 'correct' : 'incorrect'}`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };  

  return (
    <div className="App">
      {renderResults()}
      <div className="exam-container">
        {/* Displaying the current question number */}
        <h1>Question {currentQuestionIndex + 1}</h1>
        <p>{currentQuestion.question}</p>
        <div className="options-container">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={getButtonClass(option)}
              onClick={() => !submitted && handleOptionToggle(option)}
              aria-label={`Option ${index + 1}`}
              disabled={submitted}
            >
              {option}
            </button>
          ))}
        </div>
        {renderExplanation(currentQuestion)}
        {currentQuestionIndex > 0 && (
          <button className="back-btn" onClick={handleBack}>
            Back
          </button>
        )}
        {currentQuestionIndex < allQuestions.length - 1 && (
          <button className="next-btn" onClick={handleNext}>
            Next
          </button>
        )}
        {isLastQuestion && (
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={!selectedOptions.every(option => option.length > 0)}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
