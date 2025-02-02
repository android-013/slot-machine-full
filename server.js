const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors()); // Allow requests from the frontend
app.use(express.json()); // Parse JSON requests

// Generate slot spin
function rand_spin() {
    const symbols = ['🃏', '7️⃣', '🍀', '🍒']; 
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
    const u1 = matrix[0][0], u2 = matrix[0][1], u3 = matrix[0][2], u4 = matrix[0][3], u5 = matrix[0][4];
    const m1 = matrix[1][0], m2 = matrix[1][1], m3 = matrix[1][2], m4 = matrix[1][3], m5 = matrix[1][4];
    const d1 = matrix[2][0], d2 = matrix[2][1], d3 = matrix[2][2], d4 = matrix[2][3], d5 = matrix[2][4];

    function cpy(matrix, win) {
        return matrix.map(row => row.map(cell => (cell === win ? '$' : cell)));
    }

    // Check for a full horizontal row match
    if (m1 === m2 && m1 === m3 && m1 === m4 && m1 === m5) {
        return {pattern: cpy(matrix, m1), pay: 100 };
    }
    
    if (u1 === u2 && u1 === u3 && u1 === u4 && u1 === u5) {
        return { pattern: cpy(matrix, u1), pay: 50 };
    }

    if (d1 === d2 && d1 === d3 && d1 === d4 && d1 === d5) {
        return { pattern: cpy(matrix, d1), pay: 50 };
    }

    if (m1 === m2 && m1 === d3 && m1 === m4 && m1 === m5) {            
        return { pattern: cpy(matrix, m1), pay: 25 };
    }

    if (m1 === m2 && m1 === u3 && m1 === m4 && m1 === m5) {            
        return { pattern: cpy(matrix, m1), pay: 25 };
    }

    if (m1 === d2 && m1 === m3 && m1 === d4 && m1 === m5) {
        return { pattern: cpy(matrix, m1), pay: 12.5 };
    }

    if (m1 === u2 && m1 === m3 && m1 === u4 && m1 === m5) {
        return { pattern: cpy(matrix, m1), pay: 12.5 };
    }

    // Checking "mdmum" pattern
    if (m1 === d2 && m1 === m3 && m1 === u4 && m1 === m5){
        return { pattern: cpy(matrix, m1), pay: 6.200 };
    }

    // "mumdm" pattern
    if (m1 === u2 && m1 === m3 && m1 === d4 && m1 === m5) {
        return { pattern: cpy(matrix, m1), pay: 6.200 };
    }

    // "ummmu" pattern
    if (u1 === m2 && u1 === m3 && u1 === m4 && u1 === u5) {
        return { pattern: cpy(matrix, u1), pay: 3.200 };
    }

    // "dmmmd" pattern
    if (d1 === m2 && d1 === m3 && d1 === m4 && d1 === d5) {
        return { pattern: cpy(matrix, d1), pay: 3.200 };
    }

    // "umumu" pattern
    if (u1 === m2 && u1 === u3 && u1 === m4 && u1 === u5) {
        return { pattern: cpy(matrix, u1), pay: 1.600 };
    }

    // "dmdmd" pattern
    if (d1 === m2 && d1 === d3 && d1 === m4 && d1 === d5) {
        return { pattern: cpy(matrix, d1), pay: 1.600 };
    }

    // "dmumd" pattern
    if (d1 === m2 && m2 === u3 && u3 === m4 && m4 === d5) {
        return { pattern: cpy(matrix, d1), pay: .800 };
    }

    // Checking "umdmu" pattern
    if (u1 === m2 && m2 === d3 && d3 === m4 && m4 === u5) {
        return { pattern: cpy(matrix, u1), pay: .800 };
    }

    // Checking "uumdd" pattern
    if (u1 === u2 && u1 === m3 && u1 === d4 && u1 === d5) {
        return { pattern: cpy(matrix, u1), pay: .400 };
    }

    // Checking "ddmuu" pattern
    if (d1 === d2 && d1 === m3 && d1 === u4 && d1 === u5) {
        return { pattern: cpy(matrix, d1), pay: .400 };
    }

    // Checking "ddudd" pattern
    if (d1 === d2 && d1 === u3 && d1 === d4 && d1 === d5) {
        return { pattern: cpy(matrix, d1), pay: .200 };
    }

    // Checking "uuduu" pattern
    if (u1 === u2 && u1 === d3 && u1 === u4 && u1 === u5) {
        return { pattern: cpy(matrix, u1), pay: .200 };
    }

    // Checking "duuud" pattern
    if (d1 === u2 && d1 === u3 && d1 === u4 && d1 === d5) {
        return { pattern: cpy(matrix, d1), pay: .100 };
    }

    // Checking "udddu" pattern
    if (u1 === d2 && u1 === d3 && u1 === d4 && u1 === u5) {
        return { pattern: cpy(matrix, u1), pay: .100 };
    }

    return { pattern: 'LOSE', pay: 0 };
}

// API endpoint for spin
app.post('/spin', (req, res) => {
    const { bet } = req.body;
    if (!bet || bet <= 0) {
        return res.status(400).json({ error: "Invalid bet amount." });
    }

    const matrix = rand_spin();
    const result = check_patterns(matrix);

    let payout = bet * result.pay;
    res.json({ matrix, result, payout });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
