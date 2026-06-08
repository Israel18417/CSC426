// State Variables
let expression = '';
let history = [];

// DOM Elements
const expressionDisplay = document.getElementById('expressionDisplay');
const resultDisplay = document.getElementById('resultDisplay');
const keypad = document.querySelector('.calculator-keypad');
const historyPanel = document.getElementById('historyPanel');
const historyToggleBtn = document.getElementById('historyToggleBtn');
const closeHistoryBtn = document.getElementById('closeHistoryBtn');
const historyContent = document.getElementById('historyContent');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadHistoryFromStorage();
    setupEventListeners();
    updateDisplay();
});

// Event Listeners Setup
function setupEventListeners() {
    // Keypad Click Event
    keypad.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn');
        if (!btn) return;

        // Visual click feedback
        animateButtonPress(btn);

        if (btn.dataset.num !== undefined) {
            appendNumber(btn.dataset.num);
        } else if (btn.dataset.op !== undefined) {
            appendOperator(btn.dataset.op);
        } else if (btn.id === 'key-clear') {
            clearAll();
        } else if (btn.id === 'key-backspace') {
            handleBackspace();
        } else if (btn.id === 'key-equals') {
            handleEquals();
        }
    });

    // History Panel Toggle
    historyToggleBtn.addEventListener('click', () => {
        historyPanel.classList.add('open');
    });

    closeHistoryBtn.addEventListener('click', () => {
        historyPanel.classList.remove('open');
    });

    // Clear History Button
    clearHistoryBtn.addEventListener('click', () => {
        history = [];
        saveHistoryToStorage();
        renderHistory();
    });

    // Keyboard Support
    document.addEventListener('keydown', (e) => {
        // Ignore keydown if control keys are pressed
        if (e.ctrlKey || e.altKey || e.metaKey) return;

        const key = e.key;

        // Numbers & Decimals
        if (/[0-9.]/.test(key)) {
            e.preventDefault();
            appendNumber(key);
            highlightButton(key);
        }
        // Operators
        else if (['+', '-', '*', '/', '%', '^', '\\'].includes(key)) {
            e.preventDefault();
            appendOperator(key);
            highlightButton(key);
        }
        else if (key.toLowerCase() === 'x') {
            e.preventDefault();
            appendOperator('*');
            highlightButton('*');
        }
        // Enter / Equals
        else if (key === 'Enter' || key === '=') {
            e.preventDefault();
            handleEquals();
            highlightButton('=');
        }
        // Backspace
        else if (key === 'Backspace') {
            e.preventDefault();
            handleBackspace();
            highlightButton('backspace');
        }
        // Clear (Escape / 'c')
        else if (key === 'Escape' || key.toLowerCase() === 'c') {
            e.preventDefault();
            clearAll();
            highlightButton('c');
        }
    });
}

// Micro-animations for buttons
function animateButtonPress(btn) {
    btn.style.transform = 'translateY(2px) scale(0.95)';
    setTimeout(() => {
        btn.style.transform = '';
    }, 100);
}

// Visual feedback for keyboard inputs
function highlightButton(key) {
    let btn;
    if (/[0-9.]/.test(key)) {
        btn = document.querySelector(`.btn-num[data-num="${key}"]`);
    } else if (['+', '-', '*', '/', '%', '^', '\\'].includes(key)) {
        btn = document.querySelector(`.btn-op[data-op="${key}"]`);
    } else if (key === '=') {
        btn = document.getElementById('key-equals');
    } else if (key === 'backspace') {
        btn = document.getElementById('key-backspace');
    } else if (key === 'c') {
        btn = document.getElementById('key-clear');
    }

    if (btn) {
        btn.classList.add('hover', 'active');
        animateButtonPress(btn);
        setTimeout(() => {
            btn.classList.remove('hover', 'active');
        }, 150);
    }
}

// Display & Appending logic
function appendNumber(num) {
    // Prevent multiple decimals in a single number token
    if (num === '.') {
        const tokens = expression.split(' ');
        const lastToken = tokens[tokens.length - 1];
        if (lastToken.includes('.')) return;
        if (lastToken === '' || lastToken === '-') {
            expression += '0';
        }
    }
    
    // Prevent leading zeros
    if (num === '0') {
        const tokens = expression.split(' ');
        const lastToken = tokens[tokens.length - 1];
        if (lastToken === '0') return;
    }

    expression += num;
    updateDisplay();
}

function appendOperator(op) {
    // Handle negative numbers (unary minus)
    if (op === '-' && (expression === '' || expression.endsWith(' '))) {
        expression += '-';
        updateDisplay();
        return;
    }

    if (expression === '' || expression === '-') {
        return;
    }

    if (expression.endsWith(' ')) {
        // Replace the last operator
        expression = expression.trimEnd();
        expression = expression.substring(0, expression.length - 1).trimEnd();
        expression += ` ${op} `;
    } else {
        expression += ` ${op} `;
    }
    updateDisplay();
}

function handleBackspace() {
    if (expression.endsWith(' ')) {
        // Delete operator and surrounding spaces
        expression = expression.trimEnd();
        expression = expression.substring(0, expression.length - 1).trimEnd();
    } else {
        expression = expression.substring(0, expression.length - 1);
    }
    updateDisplay();
}

function clearAll() {
    expression = '';
    updateDisplay();
    resultDisplay.textContent = '0';
}

function updateDisplay() {
    // Replace standard math symbols for beautiful UI rendering
    let displayExpr = expression
        .replace(/\*/g, ' × ')
        .replace(/\//g, ' ÷ ')
        .replace(/\\/g, ' \\ ')
        .replace(/\+/g, ' + ')
        .replace(/\-/g, ' − ');
    
    // Cleanup double spaces that might occur from display replaces
    displayExpr = displayExpr.replace(/\s+/g, ' ');

    expressionDisplay.textContent = displayExpr;

    // Live preview evaluation
    if (expression.trim() === '') {
        resultDisplay.textContent = '0';
        return;
    }

    try {
        let evalExpr = expression.trim();
        // Remove trailing operator for safe preview evaluation
        if (evalExpr.endsWith('+') || evalExpr.endsWith('-') || evalExpr.endsWith('*') || evalExpr.endsWith('/') || evalExpr.endsWith('\\') || evalExpr.endsWith('^') || evalExpr.endsWith('%')) {
            evalExpr = evalExpr.substring(0, evalExpr.length - 1).trim();
        }

        if (evalExpr === '' || evalExpr === '-') {
            resultDisplay.textContent = '0';
            return;
        }

        const res = evaluateExpression(evalExpr);
        resultDisplay.textContent = formatResult(res);
    } catch (e) {
        // Ignore parsing errors during typing preview
    }
}

function handleEquals() {
    if (expression.trim() === '') return;

    try {
        const res = evaluateExpression(expression);
        const formattedRes = formatResult(res);

        // Add to history
        addHistoryItem(expression, formattedRes);

        // Update display to final states
        let finalExprDisplay = expression
            .replace(/\*/g, ' × ')
            .replace(/\//g, ' ÷ ')
            .replace(/\\/g, ' \\ ')
            .replace(/\+/g, ' + ')
            .replace(/\-/g, ' − ') + ' =';
        
        expressionDisplay.textContent = finalExprDisplay.replace(/\s+/g, ' ');
        resultDisplay.textContent = formattedRes;

        // Prepare for next calculations
        expression = formattedRes;
    } catch (e) {
        resultDisplay.textContent = 'Error';
        expression = '';
    }
}

// Math Parsing & Evaluation Core
function tokenize(expr) {
    const tokens = [];
    let i = 0;
    while (i < expr.length) {
        let char = expr[i];

        if (/\s/.test(char)) {
            i++;
            continue;
        }

        // Parse numbers (including decimals)
        if (/[0-9.]/.test(char)) {
            let numStr = '';
            while (i < expr.length && /[0-9.]/.test(expr[i])) {
                numStr += expr[i];
                i++;
            }
            tokens.push({ type: 'NUMBER', value: parseFloat(numStr) });
            continue;
        }

        // Parse operators
        if (['+', '-', '*', '/', '\\', '^', '%'].includes(char)) {
            // Unary operator identification:
            // It is unary if it is '+' or '-' and it is either the first token or follows another operator.
            let isUnary = false;
            if (char === '-' || char === '+') {
                const lastToken = tokens[tokens.length - 1];
                if (!lastToken || lastToken.type === 'OPERATOR') {
                    isUnary = true;
                }
            }

            if (isUnary) {
                tokens.push({ type: 'UNARY_OPERATOR', value: char });
            } else {
                tokens.push({ type: 'OPERATOR', value: char });
            }
            i++;
            continue;
        }

        throw new Error(`Invalid character: ${char}`);
    }
    return tokens;
}

function evaluateExpression(expr) {
    const tokens = tokenize(expr);
    const outputQueue = [];
    const operatorStack = [];

    const precedence = {
        '+': 2, '-': 2,
        '*': 3, '/': 3, '\\': 3, '%': 3,
        '^': 4,
        'u+': 5, 'u-': 5
    };

    const associativity = {
        '+': 'L', '-': 'L',
        '*': 'L', '/': 'L', '\\': 'L', '%': 'L',
        '^': 'R',
        'u+': 'R', 'u-': 'R'
    };

    for (const token of tokens) {
        if (token.type === 'NUMBER') {
            outputQueue.push(token);
        } else if (token.type === 'OPERATOR' || token.type === 'UNARY_OPERATOR') {
            const opKey = token.type === 'UNARY_OPERATOR' ? 'u' + token.value : token.value;

            while (operatorStack.length > 0) {
                const topOp = operatorStack[operatorStack.length - 1];
                const topOpKey = topOp.type === 'UNARY_OPERATOR' ? 'u' + topOp.value : topOp.value;

                const p1 = precedence[opKey];
                const p2 = precedence[topOpKey];
                const assoc = associativity[opKey];

                if ((assoc === 'L' && p1 <= p2) || (assoc === 'R' && p1 < p2)) {
                    outputQueue.push(operatorStack.pop());
                } else {
                    break;
                }
            }
            operatorStack.push(token);
        }
    }

    while (operatorStack.length > 0) {
        outputQueue.push(operatorStack.pop());
    }

    // Evaluate RPN
    const stack = [];
    for (const token of outputQueue) {
        if (token.type === 'NUMBER') {
            stack.push(token.value);
        } else if (token.type === 'UNARY_OPERATOR') {
            if (stack.length < 1) throw new Error("Invalid expression");
            const val = stack.pop();
            stack.push(token.value === '-' ? -val : val);
        } else if (token.type === 'OPERATOR') {
            if (stack.length < 2) throw new Error("Invalid expression");
            const b = stack.pop();
            const a = stack.pop();
            let res;
            switch (token.value) {
                case '+': res = a + b; break;
                case '-': res = a - b; break;
                case '*': res = a * b; break;
                case '/': 
                    if (b === 0) throw new Error("Division by zero");
                    res = a / b; 
                    break;
                case '\\': 
                    if (b === 0) throw new Error("Division by zero");
                    res = Math.trunc(a / b); 
                    break;
                case '%': 
                    if (b === 0) throw new Error("Division by zero");
                    res = a % b; 
                    break;
                case '^': res = Math.pow(a, b); break;
                default: throw new Error(`Unknown operator: ${token.value}`);
            }
            stack.push(res);
        }
    }

    if (stack.length !== 1) throw new Error("Invalid expression");
    return stack[0];
}

function formatResult(val) {
    if (typeof val !== 'number' || isNaN(val) || !isFinite(val)) return 'Error';
    
    // Formatting float results to prevent visual overflow
    if (val % 1 !== 0) {
        const str = val.toString();
        if (str.length > 12) {
            if (Math.abs(val) < 1e-6 || Math.abs(val) > 1e12) {
                return val.toExponential(6);
            }
            return parseFloat(val.toFixed(8)).toString();
        }
    }
    return val.toString();
}

// History Management
function addHistoryItem(expr, res) {
    // Avoid repeating the exact last calculation
    if (history.length > 0) {
        const lastItem = history[0];
        if (lastItem.expr === expr && lastItem.res === res) return;
    }

    history.unshift({ expr, res });
    
    // Cap history at 50 items
    if (history.length > 50) {
        history.pop();
    }

    saveHistoryToStorage();
    renderHistory();
}

function renderHistory() {
    if (history.length === 0) {
        historyContent.innerHTML = '<p class="empty-history-msg">No history yet</p>';
        return;
    }

    historyContent.innerHTML = history.map((item, idx) => {
        let displayExpr = item.expr
            .replace(/\*/g, ' × ')
            .replace(/\//g, ' ÷ ')
            .replace(/\\/g, ' \\ ')
            .replace(/\+/g, ' + ')
            .replace(/\-/g, ' − ');
        
        displayExpr = displayExpr.replace(/\s+/g, ' ');

        return `
            <div class="history-item" data-index="${idx}">
                <div class="history-item-expr">${displayExpr}</div>
                <div class="history-item-res">${item.res}</div>
            </div>
        `;
    }).join('');

    // Attach click events to history items
    const items = historyContent.querySelectorAll('.history-item');
    items.forEach(item => {
        item.addEventListener('click', () => {
            const idx = parseInt(item.dataset.index);
            expression = history[idx].expr;
            updateDisplay();
            historyPanel.classList.remove('open');
        });
    });
}

function saveHistoryToStorage() {
    localStorage.setItem('csc426_calc_history', JSON.stringify(history));
}

function loadHistoryFromStorage() {
    const saved = localStorage.getItem('csc426_calc_history');
    if (saved) {
        try {
            history = JSON.parse(saved);
            renderHistory();
        } catch (e) {
            history = [];
        }
    }
}
