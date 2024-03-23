const toggleIcon = document.querySelector('.toggle-icon');
const navLinks = document.querySelector('.nav-links');
const html = document.querySelector('html');

const form = document.querySelector('form[name="contact-form"]');
const btnFeedback = document.querySelector('.btn-feedback');
const nameInput = document.querySelector('input[name="Name"]');
const emailInput = document.querySelector('input[name="Email"]');
const messageInput = document.querySelector('textarea[name="Message"]');

// SET ERROR MESSAGE
const setError = (input) => {
  input.classList.add('error');
};

// SET SUCCESS MESSAGE
const setSuccess = (input) => {
  input.classList.remove('error');
};

toggleIcon.addEventListener('click', (e) => {
  navLinks.classList.toggle('active');
});

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();

  if (!name) {
    setError(nameInput);
  } else {
    setSuccess(nameInput);
  }

  if (!email) {
    setError(emailInput);
  } else {
    setSuccess(emailInput);
  }

  if (!message) {
    setError(messageInput);
  } else {
    setSuccess(messageInput);
  }

  if (name && email && message) {
    const formData = new FormData(form);
    const URL =
      'https://script.google.com/macros/s/AKfycbxLa_SynubUFu5DtnumgEh0goGURgCPMVmFVBWCUjRUdqg03hZvW6zCZZ9voS1hlucK/exec';

    fetch(URL, {
      method: 'POST',
      body: formData,
    }).then((res) => {
      alert('Your feedback is submitted successfully. Thank you!');
      form.reset();
    });
  }
});
