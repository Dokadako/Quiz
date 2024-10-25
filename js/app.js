// script.js
const quizQuestions = [
  { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], correctAnswer: 2 },
  { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], correctAnswer: 1 },
  { question: "What is the largest mammal?", options: ["Elephant", "Blue Whale", "Giraffe", "Shark"], correctAnswer: 1 },
  { question: "Which is the fastest land animal?", options: ["Cheetah", "Leopard", "Tiger", "Lion"], correctAnswer: 0 },
  { question: "What is the smallest country?", options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"], correctAnswer: 1 }
];
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 30;

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const scoreEl = document.getElementById('score');
const timerEl = document.createElement('p');
document.getElementById('quiz-screen').prepend(timerEl);

startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', loadNextQuestion);
restartBtn.addEventListener('click', restartQuiz);

function startQuiz() {
  document.getElementById('start-screen').classList.remove('active');
  document.getElementById('quiz-screen').classList.add('active');
  loadQuestion();
}

function loadQuestion() {
  // Start with a fade-out effect for the current question (if it's not the first question)
  if (currentQuestion > 0) {
    questionEl.classList.add('fade-out');
    optionsEl.classList.add('fade-out');

    // Wait for the fade-out animation to complete before loading the next question
    setTimeout(() => {
      updateQuestionContent(); // Load the next question
      questionEl.classList.remove('fade-out');
      optionsEl.classList.remove('fade-out');
      questionEl.classList.add('fade-in');
      optionsEl.classList.add('fade-in');

      // Remove the fade-in class after the animation ends to reset
      setTimeout(() => {
        questionEl.classList.remove('fade-in');
        optionsEl.classList.remove('fade-in');
      }, 500); // Match the duration of fade-in animation
    }, 500); // Match the duration of fade-out animation
  } else {
    updateQuestionContent(); // For the first question, load without fade-out
  }
}

// Separate function to update the question content
function updateQuestionContent() {
  nextBtn.disabled = true;
  questionEl.textContent = quizQuestions[currentQuestion].question;
  optionsEl.innerHTML = '';

  startTimer();

  quizQuestions[currentQuestion].options.forEach((option, index) => {
    const optionEl = document.createElement('div');
    optionEl.classList.add('option');
    optionEl.textContent = option;
    optionEl.addEventListener('click', () => selectAnswer(index));
    optionsEl.appendChild(optionEl);
  });
}


function startTimer() {
  clearInterval(timer);
  timeLeft = 30;
  timerEl.textContent = `Time left: ${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      loadNextQuestion();
    }
  }, 1000);
}

function loadNextQuestion() {
  currentQuestion++;
  if (currentQuestion < quizQuestions.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  // Hide the quiz screen and show the result screen
  document.getElementById('quiz-screen').classList.remove('active');
  document.getElementById('result-screen').classList.add('active');

  // Display total score
  const totalScoreEl = document.getElementById('total-score');
  totalScoreEl.textContent = `You scored ${score} out of ${quizQuestions.length}`;

  // Display correct/incorrect answers for each question
  const reviewEl = document.getElementById('review');
  reviewEl.innerHTML = ''; // Clear previous content if any

  quizQuestions.forEach((question, index) => {
    const questionReview = document.createElement('div');
    questionReview.classList.add('review-item');

    const userAnswer = selectedAnswers[index];
    const isCorrect = userAnswer === question.correctAnswer;

    questionReview.innerHTML = `
            <p><strong>Question ${index + 1}:</strong> ${question.question}</p>
            <p>Your answer: ${question.options[userAnswer] || 'No answer'}</p>
            <p>Correct answer: ${question.options[question.correctAnswer]}</p>
        `;

    questionReview.classList.add(isCorrect ? 'correct' : 'incorrect');
    reviewEl.appendChild(questionReview);
  });
}

// Store user answers in a global array during the quiz
let selectedAnswers = [];

function selectAnswer(index) {
  selectedAnswers[currentQuestion] = index; // Store user's answer for this question
  const selectedOption = optionsEl.children[index];
  const correctIndex = quizQuestions[currentQuestion].correctAnswer;

  // Highlight selected answer
  selectedOption.classList.add(index === correctIndex ? 'correct' : 'wrong');

  // Update score if answer is correct
  if (index === correctIndex) score++;

  // Disable other options after selection
  Array.from(optionsEl.children).forEach(option => option.classList.add('disabled'));

  // Enable "Next" button and stop the timer
  nextBtn.disabled = false;
  clearInterval(timer);
}


function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  document.getElementById('result-screen').classList.remove('active');
  document.getElementById('start-screen').classList.add('active');
}
