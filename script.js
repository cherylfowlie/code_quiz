//All quiz questions with answers
var questions = [
    {
        title: "Commonly Used data types DO NOT include:",
        choices: ["stings", "booleans", "alerts", "numbers"],
        answer: "alerts"
    },
    {
        title: "The condition in an if / else statment is enclosed within _____.",
        choices: ["quotes", "curly brackets", "parentheses", "square brackets"],
        answer: "parentheses"
    },
    {
        title: "Arrays in JavaScript can be used to store",
        choices: ["numbers and strings", "other arrays", "booleans", "all of the above"],
        answer: "all of the above"
    },
    {
        title: "A Very useful tool used during development and debugging for printing content to the debugger is:",
        choices: ["javascript", "terminal/bash", "for loops", "console.log"],
        answer: "console.log"
    }
]

//Variables for overall quiz
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

// DOM Vars for buttons and user inputs
//Main Page
var titlePage = document.querySelector("#mainPage");
var quizTimer = document.querySelector("#time");
var startButton = document.querySelector("#startQuiz");

//Quiz Page
var submitButton = document.querySelector("#submit-button");
var quizScreen = document.querySelector("#quizPage");
var quizQuestions = document.querySelector("#question");
var userChoice = document.querySelector("#choices");

//Highscore Page
var highScoreScreen = document.querySelector("#highscore-section");
var highScoreDisplay = document.querySelector("#highscore-display-section");
var initialsInput = document.querySelector("#initials");
var userAnswer = document.querySelector("#feedback");



//create a function to start the game
function startQuiz() {
    //Once start is pressed hide main screen
    titlePage.setAttribute("class", "hide");
    //Once start is pressed show quiz page
    quizScreen.setAttribute("class", "show");
    //Start timer on start quiz click 75 seconds
    timerId = setInterval(timerRun, 1000);
    quizTimer.textContent = time;
    getQuestion();
}

// Run the time per second 
function timerRun() {

    time--;
    quizTimer.textContent = time;


    if (time <= 0) {
        finishQuiz();
    }
}

function getQuestion() {
    // get current question object from array
    var currentQuestion = questions[currentQuestionIndex];

    // update title with current question
    var titleEl = document.getElementById("question-title");
    titleEl.textContent = currentQuestion.title;

    userChoice.innerHTML = "";


    currentQuestion.choices.forEach(function (choice, i) {
        // create button for ever answer in array
        var choiceButton = document.createElement("button");
        //Create bootstrap button
        choiceButton.setAttribute("class", "btn btn-primary btn-sm choice");
        choiceButton.setAttribute("value", choice);

        choiceButton.textContent = i + 1 + ". " + choice;
        choiceButton.onclick = questionClick;

        // display on the page
        userChoice.appendChild(choiceButton);
    });
}

// click on question answer either generate new question or end quiz if final question, and deduct time for answering wrong
function questionClick() {
    // check if user guessed wrong
    if (this.value !== questions[currentQuestionIndex].answer) {
        // penalize time
        time -= 15;

        if (time < 0) {
            time = 0;
        }

        // display new time on page
        quizTimer.textContent = time;


        userAnswer.textContent = "Wrong!";
    } else {

        userAnswer.textContent = "Correct!";
    }

    //Flash the answer correct or wrong
    userAnswer.setAttribute("class", "feedback answerStyle");
    setTimeout(function () {
        userAnswer.setAttribute("class", "feedback hide");
    }, 1000);

    // move to next question
    currentQuestionIndex++;

    // check if we've run out of questions
    if (currentQuestionIndex === questions.length) {
        finishQuiz();
    } else {
        getQuestion();
    }
}

//Save the user score in local storage
function saveScore() {
    //input and trim to max char
    var initials = initialsInput.value.trim();

    //Error check for value
    if (initials !== "") {
        // get saved scores from localstorage, or if not any, set to empty array
        var highscores =
            JSON.parse(window.localStorage.getItem("highscores")) || [];

        // format new score object for current user
        var newScore = {
            score: time,
            initials: initials
        };

        highscores.push(newScore);
        window.localStorage.setItem("highscores", JSON.stringify(highscores));

        //User enters initials and goes to highscore
        window.location.href = "highScore.html";
    }
}


function finishQuiz() {
    //End the quiz timer
    clearInterval(timerId);

    //Unhide the highscore page
    var highscorePage = document.querySelector("#highscore-section");
    highscorePage.setAttribute("class", "show");

    //Bring up the final store
    var finalScoreEl = document.querySelector("#final-score");
    finalScoreEl.textContent = time;

    // Hide quiz section after completion 
    quizScreen.setAttribute("class", "hide");
}

function checkSubmit(click) {
    if (click.key === "Enter") {
        saveScore();
    }
}


submitButton.onclick = saveScore;
startButton.onclick = startQuiz;
initialsInput.onkeyup = checkSubmit;
