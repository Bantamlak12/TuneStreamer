// ************************************************************ //
// SELECT DOM ELEMENTS TO BE USED
// ************************************************************ //
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
// FUNCTIONS
// ************************************************************ //
// set error message
const setError = (input) => {
  input.classList.add('error');
};

// set success message
const setSuccess = (input) => {
  input.classList.remove('error');
};

const isValidEmail = (email) => {
  const regexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  const validated = regexp.test(email);

  return validated;
};

const validateInput = () => {
  let isValid = true;

  const firstNameValue = firstNameInput.value.trim();
  const lastNameValue = lastNameInput.value.trim();
  const emailValue = emailInput.value.trim();

  // validate firstname
  if (firstNameValue === '') {
    setError(firstNameInput);
    isValid = false;
  } else {
    setSuccess(firstNameInput);
  }

  // validate lastname
  if (lastNameValue === '') {
    setError(lastNameInput);
    isValid = false;
  } else {
    setSuccess(lastNameInput);
  }

  // validate email
  if (emailValue === '' || !isValidEmail(emailValue)) {
    setError(emailInput);
    isValid = false;
  } else {
    setSuccess(emailInput);
  }

  return isValid;
};

// ************************************************************ //
// SEARCH A USER BY EMAIL
// ************************************************************ //
const searchUser = () => {
  if (searchEmail.value == '') {
    return;
  }
  const email = searchEmail.value.trim();
  //  Send request to server with email and method 'delete
  fetch(`/admin/users/${email}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((data) => {
      firstNameInput.value = data[0].firstName;
      lastNameInput.value = data[0].lastName;
      emailInput.value = data[0].email;
    })
    .catch((error) => {
      return;
    });
};

searchEmail.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchUser();
  }
});

search.addEventListener('click', (e) => {
  searchUser();
});
// ************************************************************ //
// ADMIN PROFILE
// ************************************************************ //
adminProfile.addEventListener('click', function (e) {
  e.preventDefault();
  e.stopPropagation();

  menu.classList.toggle('open');
});

// Close the menu when clicking the body
html.addEventListener('click', function (e) {
  if (menu.classList.contains('open')) {
    menu.classList.remove('open');
  }
});

// ************************************************************ //
// DELETE A SINGLE USER
// ************************************************************ //
btnDeleteUser.addEventListener('click', (e) => {
  const isConfirmed = confirm(
    'Are you sure you want to delete this user? This action is irreversible and cannot be undone.'
  );

  const email = searchEmail.value.trim();
  if (!email || email === '') return;

  //  Send request to server with email and method 'delete
  if (isConfirmed) {
    fetch(`/admin/users/${email}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (res.ok) {
        userInfoForm.reset();
        alert('User deleted successfully');
      }
    });
  }
});

// ************************************************************ //
// DELETE ALL USERS
// ************************************************************ //
btnDeleteAll.addEventListener('click', (e) => {
  const isConfirmed = confirm(
    'Are you sure you want to delete all users? This action is irreversible and cannot be undone.\
    This is a more dangerous action.'
  );

  // If confirmed delete all users
  if (isConfirmed) {
    //  Send request to server to delete all users
    fetch('/admin/users', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (res.ok) {
        alert('All users deleted successfully');
      }
    });
  }
});

// ************************************************************ //
// UPDATE A USER
// ************************************************************ //
btnUpdateUser.addEventListener('click', (e) => {
  e.preventDefault();

  if (validateInput()) {
    const formDate = new FormData(userInfoForm);
    const updatedInfo = {};

    for (const [key, value] of formDate) {
      updatedInfo[key] = value;
    }

    // Email used to search the user on the database
    const email = searchEmail.value.trim();

    // Send PUT request to update the user info on the server
    fetch(`/admin/users/${email}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedInfo),
    })
      .then((res) => {
        if (res.ok) {
          alert('User updated successfully');
          userInfoForm.reset();
        }
      })
      .catch((error) => {
        return;
      });
  } else {
    return;
  }
});
