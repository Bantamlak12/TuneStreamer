const form = document.querySelector('.signin-form');
const signInButton = document.querySelector('.sign-in');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// ************************************************************ //
// FUNCTIONS
// ************************************************************ //

// DISPLAY ERROR MESSAGE
const displayErrorMessage = (message, parentClassName, childClassName) => {
  let errorMessage = document.querySelector(`.${childClassName}`);
  if (!errorMessage) {
    errorMessage = document.createElement('p');
    errorMessage.classList.add(`${childClassName}`);
    parentClassName.appendChild(errorMessage);
  }
  errorMessage.textContent = message;
  errorMessage.style.visibility = 'visible';
};

// REMOVE ERROR MESSAGE
const removeErrorMessage = (childClassName) => {
  const errorMessage = document.querySelector(childClassName);
  if (errorMessage) {
    errorMessage.remove();
  }
};

// SET ERROR MESSAGE
const setError = (input) => {
  input.style.boxShadow = 'none';
  input.classList.add('error');
};

// SET SUCCESS MESSAGE
const setSuccess = (input) => {
  input.classList.remove('error');
};

// ************************************************************ //
// EVENT LISTNERS
// ************************************************************ //
// Toggle password eye icon
const icon = document.querySelector('.password-toggle-icon');

icon.addEventListener('click', (e) => {
  const type =
    passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);

  icon.classList.toggle('fa-eye');
});

// ************************************************************ //
// VALIDATE USER INPUTS
// ************************************************************ //

const validateInput = (email) => {
  let isValid = true;

  const emailValue = emailInput.value.trim();
  const passwordValue = passwordInput.value.trim();

  // VALIDATE Email
  if (emailValue === '') {
    setError(emailInput);
    isValid = false;
  } else {
    setSuccess(emailInput);
  }

  // VALIDATE password
  if (passwordValue === '') {
    setError(passwordInput);
    isValid = false;
  } else {
    setSuccess(passwordInput);
  }

  return isValid;
};

signInButton.addEventListener('click', (e) => {
  e.preventDefault();

  if (validateInput()) {
    const formData = new FormData(form);
    let userCredentials = {};

    for (const [key, value] of formData) {
      userCredentials[key] = value;
    }

    // SEND DATA TO BACKEND
    fetch('/signin', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userCredentials),
    }).then((res) => {
      if (!res.ok) {
        // Extract error message
        message = 'Email or Password is incorect.';
        parentClass = document.querySelector('.input-passwd');
        childClass = 'error-message';
        displayErrorMessage(message, parentClass, childClass);
      }
      if (res.ok) {
        window.location.href = '/dashboard';
      }
    });
  }
});

emailInput.addEventListener('input', (e) => {
  e.preventDefault();
  setSuccess(emailInput);
});
passwordInput.addEventListener('input', (e) => {
  setSuccess(passwordInput);
  removeErrorMessage('.error-message');
});
