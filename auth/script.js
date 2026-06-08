// Browser Compatibility Polyfills
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

// DOM Elements
const container = document.getElementById('container');
const signUpBtn = document.getElementById('signUpBtn');
const signInBtn = document.getElementById('signInBtn');
const mobileToSignUp = document.getElementById('mobileToSignUp');
const mobileToLogin = document.getElementById('mobileToLogin');

// Forms
const signInForm = document.getElementById('signInForm');
const signUpForm = document.getElementById('signUpForm');

// Inputs - Sign In
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');

// Inputs - Sign Up
const signupName = document.getElementById('signupName');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const signupConfirmPassword = document.getElementById('signupConfirmPassword');

// Password Strength
const strengthMeter = document.querySelector('.strength-meter');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

// Alerts
const alertDialog = document.getElementById('alertDialog');
const alertIcon = document.getElementById('alertIcon');
const alertTitle = document.getElementById('alertTitle');
const alertMessage = document.getElementById('alertMessage');
const alertCloseBtn = document.getElementById('alertCloseBtn');

// Initialize events
document.addEventListener('DOMContentLoaded', () => {
    setupPanelSwitching();
    setupPasswordToggles();
    setupRealtimeValidation();
    setupFormSubmissions();
    setupFloatingLabels();
});

// 1. Sliding Panel Switching
function setupPanelSwitching() {
    signUpBtn.addEventListener('click', () => {
        container.classList.add('right-panel-active');
        clearFormErrors();
    });

    signInBtn.addEventListener('click', () => {
        container.classList.remove('right-panel-active');
        clearFormErrors();
    });

    // Mobile specific switching
    mobileToSignUp.addEventListener('click', () => {
        container.classList.add('right-panel-active');
        clearFormErrors();
    });

    mobileToLogin.addEventListener('click', () => {
        container.classList.remove('right-panel-active');
        clearFormErrors();
    });
}

// 2. Password Visibility Toggle
function setupPasswordToggles() {
    const passwordGroups = document.querySelectorAll('.password-group');
    
    passwordGroups.forEach(group => {
        const input = group.querySelector('input');
        const toggleBtn = group.querySelector('.toggle-password');
        const eyeOpen = toggleBtn.querySelector('.eye-open');
        const eyeClosed = toggleBtn.querySelector('.eye-closed');

        toggleBtn.addEventListener('click', () => {
            if (input.type === 'password') {
                input.type = 'text';
                eyeOpen.classList.add('hidden');
                eyeClosed.classList.remove('hidden');
            } else {
                input.type = 'password';
                eyeOpen.classList.remove('hidden');
                eyeClosed.classList.add('hidden');
            }
        });
    });
}

// Helper to check for active content (fixes floating label overlapping on autofill)
function setupFloatingLabels() {
    const inputs = document.querySelectorAll('.input-group input');
    
    const checkInput = (input) => {
        // Safe check for autofill styles or non-empty value
        if (input.value !== '' || input.matches(':-webkit-autofill') || input.matches(':autofill')) {
            input.parentElement.classList.add('has-content');
        } else {
            input.parentElement.classList.remove('has-content');
        }
    };

    inputs.forEach(input => {
        // Initial check
        checkInput(input);

        input.addEventListener('blur', () => checkInput(input));
        input.addEventListener('input', () => checkInput(input));
        input.addEventListener('change', () => checkInput(input));
    });

    // Multiple delayed checks to capture browser auto-fill/auto-complete on page load
    setTimeout(() => {
        inputs.forEach(checkInput);
    }, 100);
    setTimeout(() => {
        inputs.forEach(checkInput);
    }, 500);
}

// 3. Real-time Client-Side Validation
function setupRealtimeValidation() {
    // Email Validation Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Login Email
    loginEmail.addEventListener('input', () => {
        validateField(loginEmail, emailRegex.test(loginEmail.value), 'Please enter a valid email address');
    });

    // Login Password
    loginPassword.addEventListener('input', () => {
        validateField(loginPassword, loginPassword.value.length >= 6, 'Password must be at least 6 characters');
    });

    // Signup Name
    signupName.addEventListener('input', () => {
        validateField(signupName, signupName.value.trim().length >= 3, 'Name must be at least 3 characters');
    });

    // Signup Email
    signupEmail.addEventListener('input', () => {
        validateField(signupEmail, emailRegex.test(signupEmail.value), 'Please enter a valid email address');
    });

    // Signup Password & Strength Meter
    signupPassword.addEventListener('input', () => {
        const val = signupPassword.value;
        
        if (val.length === 0) {
            strengthMeter.style.display = 'none';
            strengthText.style.display = 'none';
            validateField(signupPassword, false, 'Password is required');
            return;
        }

        strengthMeter.style.display = 'block';
        strengthText.style.display = 'block';

        const strength = checkPasswordStrength(val);
        updateStrengthUI(strength);

        validateField(signupPassword, strength.score >= 2, 'Password must be at least 8 characters and include a number & capital letter');

        // Re-validate confirm password if it contains value
        if (signupConfirmPassword.value !== '') {
            validateField(
                signupConfirmPassword, 
                signupConfirmPassword.value === val, 
                'Passwords do not match'
            );
        }
    });

    // Signup Confirm Password
    signupConfirmPassword.addEventListener('input', () => {
        validateField(
            signupConfirmPassword, 
            signupConfirmPassword.value === signupPassword.value, 
            'Passwords do not match'
        );
    });
}

// Password Strength Computation
function checkPasswordStrength(pwd) {
    let score = 0;
    let feedback = 'Very Weak';

    if (pwd.length >= 8) {
        score++; // Length meets basic criteria
        if (/[0-9]/.test(pwd)) score++; // Contains numbers
        if (/[A-Z]/.test(pwd)) score++; // Contains capital letter
        if (/[^a-zA-Z0-9]/.test(pwd)) score++; // Contains special char
    }

    if (score === 1) {
        feedback = 'Weak';
    } else if (score === 2 || score === 3) {
        feedback = 'Medium';
    } else if (score === 4) {
        feedback = 'Strong';
    }

    return { score, feedback };
}

// Update strength bar UI
function updateStrengthUI(strength) {
    strengthBar.className = 'strength-bar'; // reset classes
    
    let width = '0%';
    let strengthClass = '';

    switch (strength.score) {
        case 1:
            width = '25%';
            strengthClass = 'weak';
            break;
        case 2:
        case 3:
            width = '60%';
            strengthClass = 'medium';
            break;
        case 4:
            width = '100%';
            strengthClass = 'strong';
            break;
    }

    strengthBar.style.width = width;
    if (strengthClass !== '') {
        strengthBar.classList.add(strengthClass);
    }
    strengthText.textContent = `Strength: ${strength.feedback}`;
}

// Field Validator Helper
function validateField(input, condition, errorMsgText) {
    const errorSpan = document.getElementById(`${input.id}Error`);
    if (!condition) {
        input.style.borderColor = 'var(--neon-pink)';
        if (errorSpan) errorSpan.textContent = errorMsgText;
        return false;
    } else {
        input.style.borderColor = 'var(--border-color)';
        if (errorSpan) errorSpan.textContent = '';
        return true;
    }
}

// Clear all errors on panel switch
function clearFormErrors() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.style.borderColor = 'var(--border-color)';
        const errorSpan = document.getElementById(`${input.id}Error`);
        if (errorSpan) errorSpan.textContent = '';
    });
    strengthMeter.style.display = 'none';
    strengthText.style.display = 'none';
}

// 4. Form Submissions
function setupFormSubmissions() {
    // Email regex for final submit validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Login Form Submit
    signInForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const isEmailValid = validateField(loginEmail, emailRegex.test(loginEmail.value), 'Please enter a valid email address');
        const isPasswordValid = validateField(loginPassword, loginPassword.value.length >= 6, 'Password must be at least 6 characters');

        if (isEmailValid && isPasswordValid) {
            showCustomAlert(
                'success',
                'Login Successful',
                `Welcome back! Access granted to ${loginEmail.value}.`
            );
            signInForm.reset();
            removeFloatingLabelsActiveState();
        } else {
            showCustomAlert(
                'error',
                'Login Failed',
                'Please correct the highlighted errors before submitting.'
            );
        }
    });

    // Signup Form Submit
    signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const isNameValid = validateField(signupName, signupName.value.trim().length >= 3, 'Name must be at least 3 characters');
        const isEmailValid = validateField(signupEmail, emailRegex.test(signupEmail.value), 'Please enter a valid email address');
        
        const strength = checkPasswordStrength(signupPassword.value);
        const isPasswordValid = validateField(signupPassword, strength.score >= 2, 'Password is too weak or too short');
        
        const isConfirmValid = validateField(
            signupConfirmPassword,
            signupConfirmPassword.value === signupPassword.value && signupConfirmPassword.value !== '',
            'Passwords do not match'
        );

        if (isNameValid && isEmailValid && isPasswordValid && isConfirmValid) {
            showCustomAlert(
                'success',
                'Registration Complete',
                `Congratulations ${signupName.value}! Your account has been successfully created.`
            );
            signUpForm.reset();
            removeFloatingLabelsActiveState();
            // Switch back to login form after successful registration
            setTimeout(() => {
                container.classList.remove('right-panel-active');
            }, 1500);
        } else {
            showCustomAlert(
                'error',
                'Registration Failed',
                'Please complete all fields with valid information.'
            );
        }
    });

    // Alert Close trigger
    alertCloseBtn.addEventListener('click', () => {
        alertDialog.classList.remove('show');
    });
}

function removeFloatingLabelsActiveState() {
    const inputGroups = document.querySelectorAll('.input-group');
    inputGroups.forEach(group => {
        group.classList.remove('has-content');
    });
}

// 5. Custom Premium Alert Box Dialog
function showCustomAlert(type, title, message) {
    alertIcon.className = 'alert-icon'; // reset classes
    alertIcon.classList.add(type);
    
    alertTitle.textContent = title;
    alertMessage.textContent = message;
    
    alertDialog.classList.add('show');
}
