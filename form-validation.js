// ===================================================================
// FORM VALIDATION - Enhanced version for portfolio
// ===================================================================

// Get form elements
const contactForm = document.querySelector('.contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageTextarea = document.getElementById('message');

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

// Validation functions
const validators = {
    name: (value) => value.length >= 2 && namePattern.test(value),
    email: (value) => emailPattern.test(value),
    message: (value) => value.length >= 10
};

// Real-time validation on blur
if (nameInput) {
    nameInput.addEventListener('blur', () => {
        if (nameInput.value.trim()) {
            validateField(
                nameInput,
                validators.name,
                'Le nom doit contenir au moins 2 caractères valides.'
            );
        }
    });
}

if (emailInput) {
    emailInput.addEventListener('blur', () => {
        if (emailInput.value.trim()) {
            validateField(
                emailInput,
                validators.email,
                'Veuillez entrer une adresse e-mail valide. (ex: exemple@domaine.com)'
            );
        }
    });
}

if (messageTextarea) {
    messageTextarea.addEventListener('blur', () => {
        if (messageTextarea.value.trim()) {
            validateField(
                messageTextarea,
                validators.message,
                'Le message doit contenir au moins 10 caractères.'
            );
        }
    });
}

// Clear error on input
[nameInput, emailInput, messageTextarea].forEach(input => {
    if (input) {
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                removeError(input);
            }
        });
    }
});

// Form submission
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all fields
        const isNameValid = validateField(
            nameInput,
            validators.name,
            'Le nom doit contenir au moins 2 caractères valides.'
        );
        const isEmailValid = validateField(
            emailInput,
            validators.email,
            'Veuillez entrer une adresse e-mail valide. (ex: exemple@domaine.com)'
        );
        const isMessageValid = validateField(
            messageTextarea,
            validators.message,
            'Le message doit contenir au moins 10 caractères.'
        );

        // If all valid, submit
        if (isNameValid && isEmailValid && isMessageValid) {
            // Show loading state
            const submitButton = contactForm.querySelector('.contact-button');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Envoi en cours...';
            submitButton.disabled = true;

            try {
                // Submit form to Formspree
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success message
                    showMessage('✓ Message envoyé avec succès ! Je vous répondrai bientôt.', 'success');
                    contactForm.reset();
                    // Remove any remaining errors
                    [nameInput, emailInput, messageTextarea].forEach(input => {
                        if (input) removeError(input);
                    });
                } else {
                    // HTTP errors (4xx, 5xx)
                    const errorData = await response.json().catch(() => ({}));
                    console.error('HTTP error:', response.status, errorData);
                    throw new Error(`Erreur HTTP ${response.status}`);
                }
            } catch (error) {
                // Network + HTTP errors
                if (error.name === 'TypeError') {
                    // Network error (e.g., CORS, connectivity)
                    showMessage('✗ Problème de connexion. Veuillez vérifier votre réseau et réessayer.', 'error');
                } else {
                    // Other errors (e.g., HTTP errors, etc.)
                    showMessage('✗ Une erreur est survenue. Veuillez réessayer ou m\'envoyer un email directement.', 'error');
                }
                console.error('Form submission error:', error);
            } finally {
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        } else {
            // Scroll to first error
            const firstError = contactForm.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    });
}

// Show success/error message
function showMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message--${type}`;
    messageDiv.textContent = message;
    messageDiv.setAttribute('role', type === 'success' ? 'status' : 'alert');
    messageDiv.setAttribute('aria-live', 'polite');

    // Insert after form
    contactForm.parentElement.insertBefore(messageDiv, contactForm.nextSibling);

    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}