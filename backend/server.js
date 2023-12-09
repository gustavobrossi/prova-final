const express = require('express');
const cors = require('cors');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const app = express();
const port = 3001;

// Enable CORS for client-side cross-origin requests
app.use(cors());

// Setup LowDB with file-based storage
const adapter = new FileSync('db.json'); // Adjust the path if your db.json is located elsewhere
const db = low(adapter);

// Enable Express to parse JSON bodies in requests
app.use(express.json());

/**
 * Endpoint to get exam questions.
 * Sends a set of questions with their options but without the correct answers or explanations.
 */
app.get('/api/exam', (req, res) => {
  const examData = db.get('exam').value();
  const questionsNumber = 8; // Number of questions to be selected for the exam

  // Log the total number of questions available
  console.log(`Total number of questions in the database: ${examData.length}`);

  // Define the weights for question selection from each domain
  const domainWeights = {
    "Calculus: Derivatives": 0.25,
    "Calculus: Integrals": 0.25,
    "Calculus: Limits": 0.25,
    "Calculus: Exponential and Logarithmic Functions": 0.25
  };

  // Initialize structures to group questions by domain
  const groupedByDomain = {
    "Calculus: Derivatives": [],
    "Calculus: Integrals": [],
    "Calculus: Limits": [],
    "Calculus: Exponential and Logarithmic Functions": []
  };

  // Group questions by their respective domains
  examData.forEach(question => {
    groupedByDomain[question.domain].push(question);
  });

  // Select questions from each domain based on the defined weights
  let selectedQuestions = [];
  Object.keys(groupedByDomain).forEach(domain => {
    const count = Math.ceil(questionsNumber * domainWeights[domain]);
    const randomQuestions = groupedByDomain[domain].sort(() => 0.5 - Math.random()).slice(0, count);
    selectedQuestions = selectedQuestions.concat(randomQuestions);
  });

  // Ensure the total selected questions do not exceed the specified number
  selectedQuestions = selectedQuestions.slice(0, questionsNumber);

  // Send questions without correct answers
  const questionsToSend = selectedQuestions.map(({ question, domain, options }) => ({ question, domain, options }));
  res.json({ exam: questionsToSend });
});

/**
 * Endpoint to submit answers and receive results.
 * Receives user answers, evaluates them, and sends back whether each is correct or not, 
 * along with the correct answers and explanations.
 */
app.post('/api/submit', (req, res) => {
  const userSubmissions = req.body.submissions;
  const results = userSubmissions.map(submission => {
    const questionData = db.get('exam').find({ question: submission.question }).value();
    const isCorrect = JSON.stringify(submission.answers.sort()) === JSON.stringify(questionData.correctAnswers.sort());
    return {
      isCorrect,
      correctAnswers: questionData.correctAnswers,
      explanation: questionData.explanation
    };
  });

  res.json({ results });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
