const html = document.querySelector('html');
const adminProfile = document.querySelector('.admin-profile-logo');
const menu = document.querySelector('.menu');

const btnAdd = document.getElementById('btn-add');
const btnUpdate = document.getElementById('btn-update');
const btnDeleteAllTrucks = document.getElementById('btn-delete-all');
const btnSearch = document.getElementById('search');
const searchInput = document.getElementById('input');
const selectedOption = document.getElementById('options');
const modalMusic = document.querySelector('.modal-music');
const modalUpdate = document.querySelector('.modal-update');
const overlay = document.querySelector('.overlay');
const addMusic = document.getElementById('btn-add');
const updateMusic = document.getElementById('btn-update');
const btnMusicCancel = document.querySelector('.btn-music-cancel');
const btnUpdateCancel = document.querySelector('.btn-update-cancel');
// const btnMusicSubmit = document.querySelector('.btn-music-submit');
// const btnMusicUpdate = document.querySelector('.btn-update-submit');
const btnSearchToUpdate = document.querySelector('.btn-search-to-update');
const searchInputToUpdate = document.querySelector('.search-input-to-update');

// player elements
const playerContainer = document.querySelector('.player-container');
const x = document.querySelector('.fa-x');
const btnBackward = document.querySelector('.fa-backward');
const btnForward = document.querySelector('.fa-forward');
const playerController = document.querySelector('.playerController');
const progressTimer = document.querySelector('.progress-timer');
const endTimer = document.querySelector('.end-timer');

const audioFileInput = document.getElementById('audioFile');

/****************************************/
let currentPlayingAudio = null;
let currentPlayingAudioIcon = null;
/****************************************/

// ************************************************************ //
// FUNCTIONS
// ************************************************************ //
let currentAudio = null;

const handleSearch = () => {
  const searchObj = {};

  if (searchInput.value !== '') {
    searchObj[selectedOption.value] = searchInput.value;
  }

  // SEND THE REQUEST TO BACKEND HERE
  console.log(searchObj);
};

// Time formater
const formatTime = (seconds) => {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

const playAudio = (audio, iconOnCover) => {
  if (currentPlayingAudio && currentPlayingAudio !== audio) {
    resetMusic(currentPlayingAudio, currentPlayingAudioIcon);
  }

  currentPlayingAudio = audio;
  currentPlayingAudioIcon = iconOnCover;
  audio.play();

  const duration = audio.duration;
  progressTimer.textContent = '0:00';
  endTimer.textContent = formatTime(duration);

  playerContainer.style.display = 'flex';

  iconOnCover.classList.remove('fa-play');
  iconOnCover.classList.add('fa-pause');

  playerController.classList.remove('fa-play');
  playerController.classList.add('fa-pause');
};

const pauseAudio = (audio, iconOnCover) => {
  audio.pause();
  iconOnCover.classList.remove('fa-pause');
  iconOnCover.classList.add('fa-play');

  playerController.classList.remove('fa-pause');
  playerController.classList.add('fa-play');
};

const resetMusic = (currentPlayingAudio, currentPlayingAudioIcon) => {
  pauseAudio(currentPlayingAudio, currentPlayingAudioIcon);
  currentPlayingAudio.currentTime = 0;
};

const confirmAndDeleteSong = (songId) => {
  const isConfirmed = confirm(
    'Are you sure you want to delete this music? This action is irreversible.'
  );

  // If confirmed delete the song
  if (isConfirmed) {
    console.log(`Song with ID: ${songId} is deleted.`);
  } else {
    console.log('Song deletion canceled.');
  }
};

const confirmAndDeleteAllSongs = () => {
  const isConfirmed = confirm(
    'Are you sure you want to delete all musics? This action is irreversible\
   and cannot be undone. This is a more dangerous action.'
  );

  // If confirmed delete the song
  if (isConfirmed) {
    console.log('Confirmed to delete all songs.');
  }
};

const openModal = function (modal) {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  document.querySelector('body').style.overflowY = 'hidden';
};

const closeModal = function (modal) {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
  document.querySelector('body').style.overflowY = 'auto';
};
// ************************************************************ //
// EVENT LISTNER FOR FORM SUBMISSSION
// ************************************************************ //

// Admin profile
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

// Search button
btnSearch.addEventListener('click', (e) => {
  e.preventDefault();
  handleSearch();
});

// Triggering search icon
searchInput.addEventListener('keypress', (e) => {
  e.preventDefault();
  if (e.key === 'Enter') {
    handleSearch();
  }
});

// Exiting the player
x.addEventListener('click', (e) => {
  e.preventDefault();

  playerContainer.style.display = 'none';
});

// ************************************************************ //
// #74b357  PLAYER CONTROLLER: With event delegation
// ************************************************************ //

document.addEventListener('click', (e) => {
  // Check if the doc has the fa-play class
  const faPlay = e.target.classList.contains('fa-play');
  const fapause = e.target.classList.contains('fa-pause');
  if (faPlay || fapause) {
    // Find the closest music-details class
    musicDetails = e.target.closest('.music-details');

    if (musicDetails) {
      const audio = musicDetails.querySelector('.audio');
      const iconOnCover = musicDetails.querySelector('.audioController');

      // console.log(Array.from(e.target.parentNode.parentNode.children).indexOf(e.target.parentNode.parentNode))

      playPause(audio, iconOnCover);
    }
  }
});

const playPause = (audio, iconOnCover) => {
  // Update audio progress
  audio.addEventListener('timeupdate', (e) => {
    e.preventDefault();
    const currentTime = audio.currentTime;
    progressTimer.textContent = formatTime(currentTime);

    // Toggle to play while song ends
    if (audio.duration === currentTime) {
      audio.currentTime = 0;
      pauseAudio(audio, iconOnCover);
    }
  });

  // Control audio: play and pause
  if (iconOnCover.classList.contains('fa-play')) {
    playAudio(audio, iconOnCover);
  } else if (iconOnCover.classList.contains('fa-pause')) {
    pauseAudio(audio, iconOnCover);
  }
};

playerController.addEventListener('click', (e) => {
  e.preventDefault();
  if (currentPlayingAudioIcon.classList.contains('fa-play')) {
    playAudio(currentPlayingAudio, currentPlayingAudioIcon);
  } else if (currentPlayingAudioIcon.classList.contains('fa-pause')) {
    pauseAudio(currentPlayingAudio, currentPlayingAudioIcon);
  }
});

btnBackward.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('previous');
});

btnForward.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('Next');
});

// ************************************************************ //
// #f44336  PLAYER CONTROLLER: With event delegation
// ************************************************************ //

document.addEventListener('click', (e) => {
  const musicDetails = e.target.closest('.music-details');

  if (!e.target.closest('.delete')) {
    return;
  }
  const song = musicDetails.querySelector('#song-id');
  if (song) {
    const songId = song.textContent;
    confirmAndDeleteSong(songId);
  }
});

btnDeleteAllTrucks.addEventListener('click', (e) => {
  e.preventDefault();
  confirmAndDeleteAllSongs();
});
// ************************************************************ //
// #4caf50  Add music and update music
// ************************************************************ //
// Add music
btnAdd.addEventListener('click', (e) => {
  e.preventDefault();
  openModal(modalMusic);
});
btnMusicCancel.addEventListener('click', (e) => {
  e.preventDefault();
  closeModal(modalMusic);
});
// btnMusicSubmit.addEventListener('click', (e) => {
//   e.preventDefault();
//   console.log('Music submited');
// });

// Update music
btnUpdate.addEventListener('click', (e) => {
  e.preventDefault();
  openModal(modalUpdate);
});
btnUpdateCancel.addEventListener('click', (e) => {
  e.preventDefault();
  closeModal(modalUpdate);
});

// Search input
btnSearchToUpdate.addEventListener('click', (e) => {
  e.preventDefault();
  if (searchInputToUpdate.value.trim() === '') {
    return;
  }
  const titleObj = JSON.stringify({ title: searchInputToUpdate.value.trim() });
  // SEND A POST REQUEST AND GET ALL INFORMATION AND FILL IT IN THE FIELD.
});

// btnMusicUpdate.addEventListener('click', (e) => {
//   e.preventDefault();
//   const form = document.querySelector('.modal-form-update');
//   const updateObj = new FormData(form);
//   for (const [key, value] of updateObj) {
//     updateObj[key] = value;
//   }
//   console.log(updateObj);
//   console.log('Music updated');
// });

////////////////////////////////////////
// Adio fille
// audioFileInput.addEventListener('click', (e) => {
//   const file = e.target.file[0];
//   console.log(file);
// });
