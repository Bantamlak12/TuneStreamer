// ************************************************************ //
// SELECT DOM ELEMENTS TO BE USED
// ************************************************************ //
const html = document.querySelector('html');
const adminProfile = document.querySelector('.user-profile-logo');
const btnSearch = document.getElementById('search');
const searchInput = document.getElementById('input');
const menu = document.querySelector('.menu');

// Player Elements
const playerContainer = document.querySelector('.player-container');
const x = document.querySelector('.fa-x');
const btnBackward = document.querySelector('.fa-backward');
const btnForward = document.querySelector('.fa-forward');
const playerController = document.querySelector('.playerController');
const progressTimer = document.querySelector('.progress-timer');
const endTimer = document.querySelector('.end-timer');

// ************************************************************ //
// DYNAMICALLY LOAD ALL MUSICS TO THE PAGE
// ************************************************************ //
const renderMusics = (musics) => {
  musics.forEach((music) => {
    const musicContainer = document.querySelector('.music-search-result');

    const musicElement = document.createElement('div');
    musicElement.classList.add('music-details');
    musicElement.innerHTML = `
          <div class="music-cover-image-container">
            <img
              class="music-cover-image"
              style="height: 130px"
              src="${music.coverImage}"
            />
            <i class="fa-solid fa-play audioController"></i>
            <audio class="audio">
              <source
                class="audioFile"
                src="${music.audioFile}"
                type="audio/mp3"
              />
            </audio>
          </div>
          <p class="artist-name">${music.artist}</p>
          <p class="song-title">${music.title}</p>
      `;

    musicContainer.appendChild(musicElement);
  });
};

// // Fetch all musics when page loads and display
document.addEventListener('DOMContentLoaded', () => {
  fetch('/musics')
    .then((res) => res.json())
    .then((musics) => {
      console.log(musics);
      renderMusics(musics);
    });
});

// ************************************************************ //
// SEARCH A MUSIC
// ************************************************************ //
const handleSearch = () => {
  const searchingWord = searchInput.value;
  // SEND THE REQUEST TO BACKEND HERE
  fetch('/musics/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ searchingWord }),
  })
    .then((res) => res.json())
    .then((musics) => {
      const musicContainer = document.querySelector('.music-search-result');
      musicContainer.innerHTML = '';
      renderMusics(musics);
    });
};

// // Search button
btnSearch.addEventListener('click', (e) => {
  e.preventDefault();
  handleSearch();
});

// Searching with Enter key
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
});

// ************************************************************ //
// OPEN AND CLOSE THE MENU ON THE USER PROFILE
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

// ************************************************************ //
// SIGN OUT A USER
// ************************************************************ //
// Sign out the user
document.querySelector('.link-sign-out').addEventListener('click', (e) => {
  e.preventDefault();

  fetch('/auth/signout', {
    method: 'post',
  }).then((res) => {
    if (res.ok) {
      window.location.href = '/signin';
    }
  });
});

// ************************************************************ //
// CLOSE THE MUSIC CONTROLLER
// ************************************************************ //
// Exiting the player
x.addEventListener('click', (e) => {
  e.preventDefault();

  playerContainer.style.display = 'none';
});

// ************************************************************ //
// PLAYER CONTROL
// ************************************************************ //
let currentPlayingAudio = null;
let currentPlayingAudioIcon = null;
let currentAudio = null;

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
