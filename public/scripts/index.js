const toggleIcon = document.querySelector('.toggle-icon');
const navLinks = document.querySelector('.nav-links');
const html = document.querySelector('html');
const header = document.querySelector('.header');
const headerContainer = document.querySelector('.header-container');
const headerLinks = document.querySelector('.header-links');

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

const isValidEmail = (email) => {
  const regexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  const validated = regexp.test(email);

  return validated;
};

// Toggle
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

  if (!email || !isValidEmail(email)) {
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
/*************************************************/
/* STICKY NAVIGATION: Intersection observer */
/*************************************************/
const headerHeignt = header.getBoundingClientRect().height;
const callback = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    header.classList.add('sticky');
  } else {
    header.classList.remove('sticky');
  }
};

const observer = new IntersectionObserver(callback, {
  root: null,
  threshold: 0,
  rootMargin: `-${headerHeignt}px`,
});
observer.observe(headerContainer);
/************************************************************/
/* SMOOTH SCROLLING: LOGO and NAVIGATIONS and THE BUTTON */
/***********************************************************/
headerLinks.addEventListener('click', function (e) {
  const target = e.target;

  if (target.classList.contains('signin-link')) {
    return;
  }

  e.preventDefault();

  const id = e.target.getAttribute('href');

  if (e.target.classList.contains('nav-link')) {
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
