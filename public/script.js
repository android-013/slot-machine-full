// Select elements
const grid = document.querySelectorAll('#slot-grid .row');
const statusSpan = document.getElementById('status');
const payoutSpan = document.getElementById('payout');
const playBtn = document.getElementById('play-btn');
const quoteSpan = document.getElementById('quote');
const betButtons = document.querySelectorAll('.bet-btn');
const selectedBetDisplay = document.getElementById('selected-bet');

let selectedBet = 0; // Stores the selected bet amount

// Handle Bet Selection
betButtons.forEach(button => {
    button.addEventListener('click', () => {
        betButtons.forEach(btn => btn.classList.remove('selected')); // Remove previous selection
        button.classList.add('selected');
        selectedBet = parseInt(button.getAttribute('data-amount'));
        selectedBetDisplay.textContent = `Selected Bet: $${selectedBet}`;
    });
});

// Add Animation Effect
function animateGrid(matrix) {
    let delay = 100;
    grid.forEach((row, rowIndex) => {
        row.innerHTML = '';
        matrix[rowIndex].forEach((col, colIndex) => {
            setTimeout(() => {
                const cell = document.createElement('div');
                cell.textContent = col;
                cell.classList.add('slot-symbol');
                row.appendChild(cell);
            }, delay * (colIndex + rowIndex * 5));
        });
    });
}

// Main Game Function (Calls Backend)
async function playGame() {
    if (selectedBet === 0) {
        alert("Please select a bet amount before playing!");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/spin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bet: selectedBet })
        });

        const result = await response.json();
        animateGrid(result.matrix);

        setTimeout(() => {
            if (result.status === 'LOSE') {
                statusSpan.textContent = 'You Lose! 😢';
                payoutSpan.textContent = `$0`;
                quoteSpan.textContent = result.quote;
            } else {
                statusSpan.textContent = `You Win! 🎉`;
                payoutSpan.textContent = `$${result.payout}`;

                result.pattern.forEach((row, rowIndex) => {
                    row.forEach((cell, colIndex) => {
                        if (cell === '$') {
                            grid[rowIndex].children[colIndex].classList.add('win-cell');
                        }
                    });
                });
            }
        }, 1500);
    } catch (error) {
        console.error("Error:", error);
    }
}

// Play Button Event Listener
playBtn.addEventListener('click', () => {
    playBtn.disabled = true;
    playGame();
    setTimeout(() => {
        playBtn.disabled = false;
    }, 1600);
});
