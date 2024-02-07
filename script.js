const soundClick = document.querySelector('#sound-click'),
    gameStart = document.querySelector('.game-start'),
    titleGame = document.querySelector('.title-game'),
    startBtn = document.querySelector('#start-btn'),
    gameBoard = document.querySelector('.game-board'),
    playAgainBtn = document.querySelector('#play-again'),
    currentYearSpan = document.querySelector('.current-year')

gameBoard.style.display = 'none'
playAgainBtn.style.display = 'none'

//To hide gameStart and show gameBoard
startBtn.addEventListener('click', function(){
    playSound()
    gameStart.style.opacity = 0
    gameStart.style.transform = 'scaleY(-25)'
  
    //After a delay of 500 milliseconds, hide the gameStart element.
    window.setTimeout(function(){
        gameStart.style.display = 'none'
    }, 8)
    
    //After a delay of 200 milliseconds, initiate the typeWriter of the gameBoard's title
    setTimeout(() => {  
        typeWriter() 
    }, 100)
  
    gameBoard.style.display = 'flex'
})

//---------------------------------- THE GAME BOARD ----------------------------------
//gameBoard's TITLE
let txt = "LET'S PLAY!";
let e = 0;
let speed = 70;

function typeWriter() { //function for title animation
  if (e < txt.length) {
      document.querySelector('.title').innerHTML += txt.charAt(e);
      e++;
      setTimeout(typeWriter, speed);
  }
}

//the game CONTENT
const choices = ['rock', 'paper', 'scissors']
const images = [
    'images/rock-choice.png',
    'images/paper-choice.png',
    'images/scissors-choice.png'
]

const gameChoices = document.querySelector('.game-choices')

//create the choices buttons
for (let i = 0; i < choices.length; i++) {
    const choiceOption = document.createElement('span')
    choiceOption.className = 'choice-option'
  
    const image = document.createElement('img')
    image.id = choices[i]
    image.className = 'choice-img'
    image.src = images[i]
    image.alt = choices[i]

    const button = document.createElement('button')
    button.id = choices[i]
    button.className = 'choice-btn'
    button.innerHTML = choices[i]
    
    button.addEventListener('click', playSound)

    choiceOption.appendChild(image)
    choiceOption.appendChild(button)
    
    //add all the buttons to game-choices div
    gameChoices.appendChild(choiceOption)
}

const gameContent = document.querySelector('.game-content'),
    playerDisplay = document.querySelector('#player img'),
    computerDisplay = document.querySelector('#computer img'),
    choiceOptions = document.querySelectorAll('.choice-btn'),
    choiceImages = document.querySelectorAll('.choice-img'),
    scoreDisplay = document.querySelector('#score'),
    textResult = document.querySelector('#text-result')

let score = { 
    player: 0, 
    computer: 0 
}

// Loop through each option button element
choiceOptions.forEach((button, index) => {
    button.addEventListener("click", (event) => {
        button.classList.add("active")

        disableChoiceOptions()

        playerDisplay.src = computerDisplay.src = "images/initial-position.png"
        textResult.textContent = "Wait..."

        playerDisplay.classList.remove('choice-clicked')
        computerDisplay.classList.remove('computer-choice')

        // Loop through each option image again
        choiceOptions.forEach((button2, index2) => {
            // If the current index doesn't match the clicked index
            // Remove the "active" class from the other option buttons
            index !== index2 && button2.classList.remove("active")
        })
    
        gameContent.classList.add("start")
    
        // Set a timeout to delay the result calculation
        let time = setTimeout(() => {
            gameContent.classList.remove("start")
            
            // Get the image SOURCE of the clicked option button
            let clickedButton = event.target
            // ('.previousElementSibling' property) Get the sibling img element of the clicked button
            let siblingImg = clickedButton.previousElementSibling
            let imageSrc = siblingImg.src 

            // Set the player image to the image that corresponds of the clicked button 
            playerDisplay.src = imageSrc 
            if (imageSrc !== "images/initial-position.png") {
                playerDisplay.classList.add('choice-clicked')
            }
    
            // Generate a random number between 0 and 2
            let randomNumber = Math.floor(Math.random() * 3)

            // Create an array of computer image options
            let computerImages = [
                'images/rock-choice.png',
                'images/paper-choice.png',
                'images/scissors-choice.png'
            ];
            // Set the computer image to a random option from the array
            computerDisplay.src = computerImages[randomNumber];
            if (computerImages !== "images/initial-position.png") {
                computerDisplay.classList.add('computer-choice')
            }
    
            // Assign a letter value to the computer option (R for rock, P for paper, S for scissors)
            let computerValue = ["R", "P", "S"][randomNumber];
            // Assign a letter value to the clicked option (based on index)
            let playerValue = ["R", "P", "S"][index];
    
            // Create an object with all possible result
            let result = {
                RR: "Draw",
                RP: "Computer",
                RS: "Player",
                PP: "Draw",
                PR: "Player",
                PS: "Computer",
                SS: "Draw",
                SR: "Computer",
                SP: "Player"
            };
            // Look up the result value based on player and computer options
            let resultValue = result[playerValue + computerValue];
    
            // Display the result of the game Round
            if (playerValue === computerValue) {
                textResult.textContent = "It's a Draw!"
                enableChoiceOptions()
            } else if (
                (resultValue === "Player")
            ) {
                score.player += 1
                textResult.textContent = `${resultValue} gets a POINT!`
                enableChoiceOptions()
            } else {
                score.computer += 1
                textResult.textContent = `${resultValue} gets a POINT!`
                enableChoiceOptions()
            }

            getTheWinner()
        }, 2500);
    });
});

// get the winner of the game
const getTheWinner = () => {
    scoreDisplay.textContent = `${score.player} - ${score.computer}`;
    if (score.player === 5) {
        disableChoiceOptions()
        textResult.innerHTML = "You're the winner!"
        playAgainBtn.style.display = 'block'
    } else if (score.computer === 5) {
        disableChoiceOptions()
        textResult.innerHTML = "Computer won!"
        playAgainBtn.style.display = 'block'
    }
}

// Disable option buttons
const disableChoiceOptions = () => {
    choiceOptions.forEach(button => {
        button.disabled = true
    });
}
// Enable option buttons
const enableChoiceOptions = () => {
    choiceOptions.forEach(button => {
        button.disabled = false
    });
}

// Play Again: reset of the game
playAgainBtn.addEventListener('click', () => {
    scoreDisplay.textContent = `0 - 0`
    score.player = 0;
    score.computer = 0;
    textResult.textContent = ''
    
    gameStart.style.removeProperty('opacity')
    gameStart.style.removeProperty('transform')
    gameStart.style.display = 'flex'
    gameBoard.style.display = 'none'

    enableChoiceOptions()
    playerDisplay.src = computerDisplay.src = "images/initial-position.png"
    playerDisplay.classList.remove('choice-clicked')
    computerDisplay.classList.remove('computer-choice')
    playAgainBtn.style.display = 'none'
});

//to play a sound at every click
function playSound() {
    soundClick.play();
}

//To add the current year to the copyright
const currentYear = new Date().getFullYear()
currentYearSpan.textContent = currentYear