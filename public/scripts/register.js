// const validator = require('validator');

const form = document.querySelector('.registration-form');
const signUpButton = document.querySelector('.sign-up');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const password2Input = document.getElementById('confirmPassword');
const registrationMsg = document.querySelector('.registration-successful');

const inputEmail = document.querySelector('.input-email');
const inputPasswd = document.querySelector('.input-passwd');
const inputPasswdCfm = document.querySelector('.input-passwd-cfm');

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

// CHECK IF THE EMAIL IS VALID
const isValidEmail = (email) => {
  const regexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  const validated = regexp.test(email);

  const errorMessage = document.createElement('p');
  if (!validated) {
    displayErrorMessage(
      'Please enter a valid email address!',
      inputEmail,
      'error-message'
    );
  } else {
    removeErrorMessage('.error-message');
  }

  return validated;
};

//SET ERROR MESSAGE
const setError = (input) => {
  input.style.boxShadow = 'none';
  input.classList.add('error');
};

// SET SUCCESS MESSAGE
const setSuccess = (input) => {
  input.classList.remove('error');
};

// VALIDATE PASSWORD
const isPasswdValid = (password1) => {
  const upperCaseRegex = /[A-Z]/;
  const lowerCaseRegex = /[a-z]/;
  const symbolRegex = /[^a-zA-Z0-9]/;
  const numberRegex = /[0-9]/;

  // check the password for including Uppercase, Lowercase, Symbol, and Number
  const hasUpperCase = upperCaseRegex.test(password1);
  const hasLowerCase = lowerCaseRegex.test(password1);
  const hasSymbol = symbolRegex.test(password1);
  const hasNumber = numberRegex.test(password1);

  const validated = hasUpperCase && hasLowerCase && hasSymbol && hasNumber;

  if (password1.length < 8) {
    displayErrorMessage(
      'Password should be at lease 8 characters!',
      inputPasswd,
      'passwd-error-msg'
    );
  } else if (!validated) {
    displayErrorMessage(
      'Use uppercase, lowercase, number, and symbol!',
      inputPasswd,
      'passwd-error-msg'
    );
  } else {
    removeErrorMessage('.passwd-error-msg');
  }

  return validated;
};

// CONFIRM PASSWORD
const confirmPasswd = (password1, password2) => {
  if (password1 !== '' && password2 !== '' && password1 !== password2) {
    displayErrorMessage(
      'Passwords do not match!',
      inputPasswdCfm,
      'cfm-passwd-error-msg'
    );
  } else {
    removeErrorMessage('.cfm-passwd-error-msg');
    return true;
  }
};

// ************************************************************ //
// VALIDATE USER INPUTS
// ************************************************************ //

const validateInput = () => {
  let isValid = true;

  const firstNameValue = firstNameInput.value.trim();
  const lastNameValue = lastNameInput.value.trim();
  const emailValue = emailInput.value.trim();
  const passwordValue = passwordInput.value.trim();
  const Password2Value = password2Input.value.trim();

  // VALIDATE FIRST NAME
  if (firstNameValue === '') {
    setError(firstNameInput);
    isValid = false;
  } else {
    setSuccess(firstNameInput);
  }

  // VALIDATE LAST NAME
  if (lastNameValue === '') {
    setError(lastNameInput);
    isValid = false;
  } else {
    setSuccess(lastNameInput);
  }

  // VALIDATE EMAIL
  if (emailValue === '' || !isValidEmail(emailValue)) {
    setError(emailInput);
    isValid = false;
  } else {
    setSuccess(emailInput);
  }

  // VALIDATE PASSWORD
  if (passwordValue === '' || !isPasswdValid(passwordValue)) {
    setError(passwordInput);
    isValid = false;
  } else {
    setSuccess(passwordInput);
  }

  //
  if (Password2Value === '' || !confirmPasswd(passwordValue, Password2Value)) {
    setError(password2Input);
    isValid = false;
  } else {
    setSuccess(password2Input);
  }

  return isValid;
};

// ************************************************************ //
// EVENT LISTNER FOR FORM SUBMISSSION
// ************************************************************ //

// Toggle eye icon
form.addEventListener('click', (e) => {
  if (e.target.classList.contains('password-toggle-icon')) {
    const inputId = e.target.getAttribute('data-target');
    const inputField = document.getElementById(inputId);
    const type =
      inputField.getAttribute('type') === 'password' ? 'text' : 'password';
    inputField.setAttribute('type', type);

    e.target.classList.toggle('fa-eye');
  }
});

signUpButton.addEventListener('click', (e) => {
  e.preventDefault();

  if (validateInput()) {
    const formData = new FormData(form);
    let userData = {};

    for (const [key, value] of formData) {
      userData[key] = value;
    }

    // SEND DATA TO BACKEND
    fetch('/signup', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    }).then((res) => {
      if (res.ok) {
        registrationMsg.style.visibility = 'visible';
        setTimeout(() => {
          form.reset();
          window.location.href = '/signin';
          registrationMsg.style.visibility = 'hidden';
        }, 2000);
      } else if (res.status === 400) {
        res.json().then((data) => {
          setError(emailInput);
          displayErrorMessage(data.message, inputEmail, 'error-message');
        });
      } else if (res.status === 500 && error.keyPattern.email) {
        console.log('Got it');
      }
    });
  }
});
