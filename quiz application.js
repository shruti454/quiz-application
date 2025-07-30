// Quiz data for different categories
const quizCategories = {
  general: {
    title: "General Knowledge Quiz",
    questions: [
      {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2,
        explanation: "Paris is the capital and largest city of France."
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1,
        explanation: "Mars is called the Red Planet due to its reddish appearance from iron oxide on its surface."
      },
      {
        question: "What is the largest mammal in the world?",
        options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
        correct: 1,
        explanation: "The Blue Whale is the largest mammal and the largest animal ever known to have lived on Earth."
      },
      {
        question: "In which year did World War II end?",
        options: ["1944", "1945", "1946", "1947"],
        correct: 1,
        explanation: "World War II ended in 1945 with the surrender of Japan in September."
      },
      {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correct: 2,
        explanation: "Au is the chemical symbol for gold, derived from the Latin word 'aurum'."
      }
    ]
  },

  science: {
    title: "Science & Nature Quiz",
    questions: [
      {
        question: "What is the hardest natural substance on Earth?",
        options: ["Gold", "Iron", "Diamond", "Platinum"],
        correct: 2,
        explanation: "Diamond is the hardest natural substance, rating 10 on the Mohs hardness scale."
      },
      {
        question: "How many chambers does a human heart have?",
        options: ["Two", "Three", "Four", "Five"],
        correct: 2,
        explanation: "The human heart has four chambers: two atria and two ventricles."
      },
      {
        question: "What gas do plants absorb from the atmosphere during photosynthesis?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
        correct: 1,
        explanation: "Plants absorb carbon dioxide from the atmosphere and convert it to oxygen during photosynthesis."
      },
      {
        question: "What is the speed of light in a vacuum?",
        options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
        correct: 0,
        explanation: "The speed of light in a vacuum is approximately 300,000 kilometers per second."
      },
      {
        question: "Which organ in the human body produces insulin?",
        options: ["Liver", "Kidney", "Pancreas", "Heart"],
        correct: 2,
          explanation: "The pancreas produces insulin, which regulates blood sugar levels."
      }
    ]
  },

  history: {
    title: "History & Culture Quiz",
    questions: [
      {
        question: "Who was the first person to walk on the moon?",
        options: ["Buzz Aldrin", "Neil Armstrong", "John Glenn", "Alan Shepard"],
        correct: 1,
        explanation: "Neil Armstrong was the first person to walk on the moon on July 20, 1969."
      },
      {
        question: "In which year did the Berlin Wall fall?",
        options: ["1987", "1988", "1989", "1990"],
        correct: 2,
        explanation: "The Berlin Wall fell on November 9, 1989, marking the end of the Cold War era."
      },
      {
        question: "Which ancient wonder of the world was located in Alexandria?",
        options: ["Hanging Gardens", "Lighthouse", "Colossus", "Mausoleum"],
        correct: 1,
        explanation: "The Lighthouse of Alexandria was one of the Seven Wonders of the Ancient World."
      },
      {
        question: "Who painted the ceiling of the Sistine Chapel?",
        options: ["Leonardo da Vinci", "Raphael", "Michelangelo", "Donatello"],
        correct: 2,
        explanation: "Michelangelo painted the famous ceiling of the Sistine Chapel between 1508 and 1512."
      },
      {
        question: "Which empire was ruled by Julius Caesar?",
        options: ["Greek Empire", "Roman Empire", "Persian Empire", "Egyptian Empire"],
        correct: 1,
        explanation: "Julius Caesar was a Roman general and statesman who played a critical role in the Roman Empire."
      }
    ]
   }
};

// Application state
let currentUser = null;
let currentCategory = 'general';
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let answered = false;
let quizStartTime = null;
let timerInterval = null;
let timeRemaining = 150; // 2:30 in seconds
let currentStreak = 0;
let bestStreak = 0;

// Page navigation
function showPage(pageId) {
// Hide all pages
document.querySelectorAll('.page').forEach(page => {
  page.classList.remove('active');
});
            
// Show selected page
  document.getElementById(pageId).classList.add('active');
}

// Handle login
function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
            
  if (username && password) {
    currentUser = username;
    document.getElementById('username-display').textContent = username;
    showPage('dashboard-page');
  }
}

// Start quiz
function startQuiz(category) {
  currentCategory = category;
  currentQuestion = 0;
  score = 0;
  selectedAnswer = null;
  answered = false;
  quizStartTime = new Date();
  timeRemaining = 150;
  currentStreak = 0;
  bestStreak = 0;
            
  document.getElementById('quiz-category-title').textContent = quizCategories[category].title;
  document.getElementById('current-score').textContent = 'Score: 0';
            
  showPage('quiz-page');
  loadQuestion();
  startTimer();
}

// Timer functionality
function startTimer() {
  timerInterval = setInterval(() => {
    timeRemaining--;
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('timer').textContent = `⏱️ ${minutes}:${seconds.toString().padStart(2, '0')}`;
                
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      showResults();
    }
  }, 1000);
}

// Load current question
function loadQuestion() {
  const questions = quizCategories[currentCategory].questions;
  const question = questions[currentQuestion];
            
  // Update question text
  document.getElementById('question-text').textContent = question.question;
            
  // Update question counter
  document.getElementById('question-counter').textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
            
  // Update progress bar
  const progress = ((currentQuestion) / questions.length) * 100;
  document.getElementById('progress-fill').style.width = progress + '%';
            
  // Clear previous state
  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';
  const feedback = document.getElementById('feedback');
  feedback.classList.remove('show', 'correct', 'incorrect');
  const nextBtn = document.getElementById('next-btn');
  nextBtn.classList.remove('show');
  selectedAnswer = null;
  answered = false;
            
  // Create option buttons
  question.options.forEach((option, index) => {
    const optionBtn = document.createElement('button');
    optionBtn.className = 'option-btn';
    optionBtn.textContent = option;
    optionBtn.onclick = () => selectAnswer(index);
    optionsContainer.appendChild(optionBtn);
  });
}

// Handle answer selection
function selectAnswer(answerIndex) {
  if (answered) return;
            
  selectedAnswer = answerIndex;
  answered = true;
            
  const questions = quizCategories[currentCategory].questions;
  const question = questions[currentQuestion];
  const options = document.querySelectorAll('.option-btn');
            
  // Disable all options
  options.forEach(option => {
    option.classList.add('disabled');
  });
            
  // Mark selected answer
  options[answerIndex].classList.add('selected');
            
  // Show correct answer
  options[question.correct].classList.add('correct');
            
  // Mark incorrect answer if wrong
  if (answerIndex !== question.correct) {
    options[answerIndex].classList.add('incorrect');
    currentStreak = 0;
  } 
  else {
    currentStreak++;
    if (currentStreak > bestStreak) {
      bestStreak = currentStreak;
    }
  }
            
  // Update score
  if (answerIndex === question.correct) {
    score++;
    document.getElementById('current-score').textContent = `Score: ${score}`;
    showFeedback(true, question.explanation);
  } 
  else {
    showFeedback(false, question.explanation);
  }
            
  // Show next button
  setTimeout(() => {
    document.getElementById('next-btn').classList.add('show');
  }, 500);
}

// Show feedback
function showFeedback(isCorrect, explanation) {
  const feedback = document.getElementById('feedback');
  feedback.textContent = isCorrect ? 
  `✅ Correct! ${explanation}` : 
  `❌ Incorrect. ${explanation}`;
            
  feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
            
  setTimeout(() => {
    feedback.classList.add('show');
  }, 300);
}

// Move to next question
function nextQuestion() {
  currentQuestion++;
            
  const questions = quizCategories[currentCategory].questions;
  if (currentQuestion < questions.length) {
    loadQuestion();
  } 
  else {
    clearInterval(timerInterval);
    showResults();
  }
}

// Show final results
function showResults() {
  const questions = quizCategories[currentCategory].questions;
  const timeTaken = quizStartTime ? Math.floor((new Date() - quizStartTime) / 1000) : 0;
  const accuracy = Math.round((score / questions.length) * 100);
            
  document.getElementById('final-score').textContent = score;
  document.getElementById('accuracy').textContent = accuracy + '%';
            
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;
  document.getElementById('time-taken').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  document.getElementById('streak').textContent = bestStreak;
            
  // Performance message
  let message = '';
  if (accuracy === 100) {
    message = "🏆 Perfect score! You're a quiz master!";
  } 
  else if (accuracy >= 80) {
    message = "🌟 Excellent work! You really know your stuff!";
  } 
  else if (accuracy >= 60) {
    message = "👍 Good job! You got most of them right!";
  } 
  else if (accuracy >= 40) {
    message = "📚 Not bad! Keep studying and try again!";
  } 
  else {
    message = "💪 Don't give up! Practice makes perfect!";
  }
            
  document.getElementById('performance-message').textContent = message;
  showPage('results-page');
}

// Restart quiz
function restartQuiz() {
  startQuiz(currentCategory);
}

// Initialize app
window.onload = function() {
  showPage('welcome-page');
};

(function(){
  function c(){
    var b=a.contentDocument||a.contentWindow.document;
    if(b){
      var d=b.createElement('script');
      d.innerHTML="window.__CF$cv$params={r:'9674aa50f18391ca',t:'MTc1Mzg3NjUwOC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
      b.getElementsByTagName('head')[0].appendChild(d)
    }
  }
  if(document.body){
    var a=document.createElement('iframe');
    a.height=1;
    a.width=1;
    a.style.position='absolute';
    a.style.top=0;
    a.style.left=0;
    a.style.border='none';
    a.style.visibility='hidden';
    document.body.appendChild(a);
    if('loading'!==document.readyState)c();
    else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);
    else{
      var e=document.onreadystatechange||function(){};
      document.onreadystatechange=function(b){
        e(b);
        'loading'!==document.readyState&&(document.onreadystatechange=e,c())
      }
    }
  }
})();