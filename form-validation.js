// ===================================================================
// FORM VALIDATION - Enhanced version for portfolio
// ===================================================================

// Get form elements
const contactForm = document.querySelector('.contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

// Validation patterns
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const namePattern = /^[a-zA-ZÀ-ÿ\s'-]{2,}$/;

// Create error message elements
function createErrorElement(inputElement, message) {
    // Remove existing error if any
    const existingError = inputElement.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Create new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    inputElement.parentElement.insertBefore(errorDiv, inputElement.nextSibling);
    inputElement.classList.add('error');
}

// Remove error styling
function removeError(inputElement) {
    const errorMessage = inputElement.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
    inputElement.classList.remove('error');
}

// Validate individual fields
function validateField(input, validationFn, errorMessage) {
    const value = input.value.trim();

    if (!value) {
        createErrorElement(input, 'Ce champ est requis.');
        return false;
    }

    if (!validationFn(value)) {
        createErrorElement(input, errorMessage);
        return false;
    }

    removeError(input);
    return true;
}

