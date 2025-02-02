document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelectorAll('#slot-grid .row');
    const statusSpan = document.getElementById('status');
    const payoutSpan = document.getElementById('payout');
    const playBtn = document.getElementById('play-btn');
    const quoteSpan = document.getElementById('quote');
    const betButtons = document.querySelectorAll('.bet-btn');
    const selectedBetDisplay = document.getElementById('selected-bet');

    let selectedBet = 0;

    // Handle Bet Selection
    betButtons.forEach(button => {
        button.addEventListener('click', () => {
            betButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            selectedBet = parseInt(button.getAttribute('data-amount'));
            selectedBetDisplay.textContent = `Selected Bet: $${selectedBet}`;
        });
    });

    function getRandomQuote() {
        const quotes = [
            "Don't give up. Great things take time. ⏳",
            "Failure is just another step towards success. 💪",
            "Keep going, your luck might change next time! 🍀",
            "Every setback is a setup for a comeback. 🔄",
            "You miss 100% of the shots you don’t take. 🎯",
            "Believe in yourself, and you’re halfway there. 🌟",
            "When one door closes, another opens. 🚪✨",
            "The best way to predict the future is to create it. 🛠️",
            "Difficult roads often lead to beautiful destinations. 🛤️🌄",
            "Your only limit is you. Break your boundaries. 💥"
        ];
        return quotes[Math.floor(Math.random() * quotes.length)];
    }

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

    async function playGame() {
        if (selectedBet === 0) {
            alert("Please select a bet amount before playing!");
            return;
        }

        playBtn.disabled = true;

        try {
            const response = await fetch('http://localhost:3000/spin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bet: selectedBet })
            });

            const data = await response.json();
            animateGrid(data.matrix);

            setTimeout(() => {
                if (data.result.pattern === 'LOSE') {
                    statusSpan.textContent = 'You Lose! 😢';
                    payoutSpan.textContent = `$0`;
                    quoteSpan.textContent = getRandomQuote();
                } else {
                    statusSpan.textContent = 'You Win! 🎉';
                    payoutSpan.textContent = `$' + data.payout.toFixed(2)`;

                    data.result.pattern.forEach((row, rowIndex) => {
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

        setTimeout(() => {
            playBtn.disabled = false;
        }, 1600);
    }

    playBtn.addEventListener('click', playGame);
});
