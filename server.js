const http = require('http');

const symbols = ['🃏', '7️⃣', '🍀', '🍒'];
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

// Generate Random Grid
function rand_spin() {
    const matrix = Array.from({ length: 3 }, () => Array(5).fill(0));

    for (let j = 0; j < 5; j++) {
        for (let i = 0; i < 3; i++) {
            let is_unique;
            do {
                is_unique = true;
                matrix[i][j] = symbols[Math.floor(Math.random() * symbols.length)];
                for (let k = 0; k < i; k++) {
                    if (matrix[i][j] === matrix[k][j]) {
                        is_unique = false;
                        break;
                    }
                }
            } while (!is_unique);
        }
    }
    return matrix;
}

// Check Winning Patterns
function check_patterns(matrix) {
    const [u1, u2, u3, u4, u5] = matrix[0];
    const [m1, m2, m3, m4, m5] = matrix[1];
    const [d1, d2, d3, d4, d5] = matrix[2];

    function markWinningCells(matrix, win) {
        return matrix.map(row => row.map(cell => (cell === win ? '$' : cell)));
    }

    if (m1 === m2 && m1 === d3 && m1 === m4 && m1 === m5) return { pattern: markWinningCells(matrix, m1), pay: 25 };
    if (m1 === m2 && m1 === u3 && m1 === m4 && m1 === m5) return { pattern: markWinningCells(matrix, m1), pay: 25 };
    if (m1 === d2 && m1 === m3 && m1 === d4 && m1 === m5) return { pattern: markWinningCells(matrix, m1), pay: 12.5 };
    if (m1 === u2 && m1 === m3 && m1 === u4 && m1 === m5) return { pattern: markWinningCells(matrix, m1), pay: 12.5 };

    return { pattern: 'LOSE', pay: 0 };
}

// Create HTTP Server
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/spin') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const { bet } = JSON.parse(body);
            const matrix = rand_spin();
            const result = check_patterns(matrix);

            const response = {
                matrix,
                status: result.pattern === 'LOSE' ? 'LOSE' : 'WIN',
                payout: (bet * result.pay).toFixed(2),
                quote: result.pattern === 'LOSE' ? quotes[Math.floor(Math.random() * quotes.length)] : '',
                pattern: result.pattern
            };

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Start Server
server.listen(3000, () => console.log('Server running on http://localhost:3000'));
