const cells = document.querySelectorAll('.cell');
let isFirstMove = true; // Flag to track the first move
let gameEnded = false; // Flag to track if the game has ended

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
    [0, 4, 8], [2, 4, 6]             // Diagonal
];

function showStrike(winningCombination) {
    const strike = document.createElement('div');
    strike.classList.add('strike');
    strike.style.backgroundColor = 'red'; // Set the background color for visibility

    const [a, b, c] = winningCombination;
    const cellA = cells[a].getBoundingClientRect();
    const cellC = cells[c].getBoundingClientRect();

    const x1 = (cellA.left + cellA.right) / 2;
    const y1 = (cellA.top + cellA.bottom) / 2;
    const x2 = (cellC.left + cellC.right) / 2;
    const y2 = (cellC.top + cellC.bottom) / 2;

    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    const length = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));

    strike.style.width = length + 'px';
    strike.style.transform = `rotate(${angle}deg)`;
    strike.style.top = y1 + 'px';
    strike.style.left = x1 + 'px';

    document.body.appendChild(strike);
}

function handleClick() {
    if (!gameEnded && !this.textContent) {
        if (isFirstMove) {
            this.textContent = 'X';
            isFirstMove = false;
        } else {
            this.textContent = 'O';
            isFirstMove = true;
        }
        
        const winnerAfterMove = checkWin();
        if (winnerAfterMove) {
            gameEnded = true;
            updateCountBoard(winnerAfterMove); // Update count board
            showStrike(winningCombinations.find(combination => {
                const [a, b, c] = combination;
                return cells[a].textContent === winnerAfterMove && cells[b].textContent === winnerAfterMove && cells[c].textContent === winnerAfterMove;
            }));
            showModal(winnerAfterMove);
        } else if ([...cells].every(cell => cell.textContent)) {
            // All cells are filled and no winner, so it's a tie
            gameEnded = true;
            showModal("It's a tie!"); // Show tie message
        }
    }
}

// Add event listeners to cells
cells.forEach(cell => {
    cell.addEventListener('click', handleClick);
});

function checkWin() {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (
            cells[a].textContent &&
            cells[a].textContent === cells[b].textContent &&
            cells[a].textContent === cells[c].textContent
        ) {
            // A player has won
            return cells[a].textContent;
        }
    }
    // No winner yet
    return null;
}

// Function to remove strike lines
function removeStrikeLines() {
    const strikes = document.querySelectorAll('.strike');
    strikes.forEach(strike => {
        strike.parentNode.removeChild(strike);
    });
}

// Reset game function
function resetGame() {
    const modal = document.getElementById('myModal');
    removeStrikeLines(); // Remove strike lines
    cells.forEach(cell => {
        cell.textContent = '';
    });
    isFirstMove = true;
    gameEnded = false;
    modal.style.display = 'none';
}

// Display modal with winner information
function showModal(winner) {
    const modal = document.getElementById('myModal');
    const modalText = document.getElementById('modal-text');
    modalText.textContent = winner;

    modal.style.display = 'block';

    // Close the modal only if the target is not the modal itself
    window.onclick = function (event) {
        if (event.target !== modal) {
            return; // Do nothing if the click is not on the modal
        }

        const closeButton = document.querySelector('.close');
        if (!closeButton.contains(event.target)) {
            modal.style.display = 'none'; // Close the modal only if the click is not on the close button
        }
    }

    // Update the score board if there's a winner
    if (winner.startsWith("Player")) {
        updateCountBoard(winner.charAt(winner.length - 1)); // Extract the winning player (X or O) from the winner message
    }
}

// Add event listener to reset button
document.getElementById('reset-btn').addEventListener('click', resetGame);
let xCount = 0;
let oCount = 0;

// Function to update count board
function updateCountBoard(winner) {
    if (winner === 'X') {
        xCount++;
        document.getElementById('x-count').textContent = xCount;
    } else if (winner === 'O') {
        oCount++;
        document.getElementById('o-count').textContent = oCount;
    }
}


const audio = document.getElementById('background-audio');
const musicOnBtn = document.getElementById('music-off');
const musicOffBtn = document.getElementById('music-on');

let isMusicOn = true; // Set the initial state to true (music is on by default)

// Function to toggle music playback
function toggleMusic() {
    isMusicOn = !isMusicOn; // Toggle the music state

    if (isMusicOn) {
        audio.play(); // Play the audio
        musicOnBtn.style.display = 'none'; // Hide music on button
        musicOffBtn.style.display = 'block'; // Show music off button
    } else {
        audio.pause(); // Pause the audio
        musicOnBtn.style.display = 'block'; // Show music on button
        musicOffBtn.style.display = 'none'; // Hide music off button
    }
}

// Initialize music playback
toggleMusic(); // Initially, music is off

// Event listeners for music toggle buttons
musicOnBtn.addEventListener('click', toggleMusic);
musicOffBtn.addEventListener('click', toggleMusic);