const adminProfile = document.querySelector('.admin-profile-logo');
const menu = document.querySelector('.menu');
const html = document.querySelector('html');
const btnDeleteAll = document.getElementById('btn-delete-all');

const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');

const searchEmail = document.getElementById('search-email');
const search = document.getElementById('search');
const userInfoForm = document.querySelector('.user-info-form');
const btnUpdateUser = document.querySelector('.btn-update-user-info');
const btnDeleteUser = document.querySelector('.btn-delete-user-info');

// ************************************************************ //
// FUNCTION
// ************************************************************ //
//SET ERROR MESSAGE
const setError = (input) => {
  input.classList.add('error');
};

// SET SUCCESS MESSAGE
const setSuccess = (input) => {
  input.classList.remove('error');
};

const isValidEmail = (email) => {
  const regexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validated = regexp.test(email);

  return validated;
};

const validateInput = () => {
  let isValid = true;

  const firstNameValue = firstNameInput.value.trim();
  const lastNameValue = lastNameInput.value.trim();
  const emailValue = emailInput.value.trim();

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

  return isValid;
};

// Search user by email
const searchUser = () => {
  if (searchEmail.value == '') {
    return;
  }
  const email = searchEmail.value.trim();
  //  Send request to server with email and method 'delete
  console.log(email);
};

// ************************************************************ //
// ADMIN PROFILE
// ************************************************************ //
adminProfile.addEventListener('click', function (e) {
  e.preventDefault();
  e.stopPropagation();

  menu.classList.toggle('open');
});

// Close the menu when clicking the html
html.addEventListener('click', function (e) {
  if (menu.classList.contains('open')) {
    menu.classList.remove('open');
  }
});

// Delete all button
btnDeleteAll.addEventListener('click', (e) => {
  const isConfirmed = confirm(
    'Are you sure you want to delete all users? This action is irreversible and cannot be undone. This is a more dangerous action.'
  );

  // If confirmed delete the song
  if (isConfirmed) {
    //  Send request to server with email and method 'delete
    fetch('/users', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (res.ok) {
        console.log('All users deleted successfully');
      } else {
        console.error('Failed to delete users');
      }
    });
  }
});

// Search
searchEmail.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchUser();
  }
});
search.addEventListener('click', (e) => {
  searchUser();
});

// Update user
btnUpdateUser.addEventListener('click', (e) => {
  e.preventDefault();

  if (validateInput()) {
    const formDate = new FormData(userInfoForm);
    const updatedInfo = {};

    for (const [key, value] of formDate) {
      updatedInfo[key] = value;
    }
    console.log(updatedInfo);
  } else {
    return;
  }
});

// Delete a single user
btnDeleteUser.addEventListener('click', (e) => {
  const formDate = new FormData(userInfoForm);
  const email = formDate.get('email');
  if (!email) return;
  //  Send request to server with email and method 'delete
});
