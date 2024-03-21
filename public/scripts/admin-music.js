const html = document.querySelector('html');
const adminProfile = document.querySelector('.admin-profile-logo');
const menu = document.querySelector('.menu');

const btnAdd = document.getElementById('btn-add');
const btnUpdate = document.getElementById('btn-update');
const btnDeleteAllTrucks = document.getElementById('btn-delete-all');
const btnSearch = document.getElementById('search');
const searchInput = document.getElementById('input');
const modalMusic = document.querySelector('.modal-music');
const modalUpdate = document.querySelector('.modal-update');
const overlay = document.querySelector('.overlay');
const addMusic = document.getElementById('btn-add');
const updateMusic = document.getElementById('btn-update');
const btnMusicCancel = document.querySelector('.btn-music-cancel');
const btnUpdateCancel = document.querySelector('.btn-update-cancel');

const formAddMusic = document.querySelector('.formAddMusic');
const formUpdateMusic = document.querySelector('.modal-form-update');
const btnMusicSubmit = document.querySelector('.btn-music-submit');
const btnMusicUpdate = document.querySelector('.btn-update-submit');
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

/****************************************/
let currentPlayingAudio = null;
let currentPlayingAudioIcon = null;
/****************************************/

// ************************************************************ //
// FUNCTIONS
// ************************************************************ //
let currentAudio = null;

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
        <span id="song-id">${music._id}</span>
        <button class="delete">DELETE</button>
    `;

    musicContainer.appendChild(musicElement);
  });
};

// Fetch all musics when page loads and display
document.addEventListener('DOMContentLoaded', () => {
  fetch('/musics')
    .then((res) => res.json())
    .then((musics) => {
      renderMusics(musics);
    });
});

const handleSearch = () => {
  const searchingWord = searchInput.value;
  // SEND THE REQUEST TO BACKEND HERE
  fetch('/music/search', {
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

const confirmAndDeleteSong = (songId, imageURL, musicURL) => {
  const isConfirmed = confirm(
    'Are you sure you want to delete this music? This action is irreversible.'
  );

  // If confirmed delete the song
  if (isConfirmed) {
    fetch('/admin/musics/music', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ songId, imageURL, musicURL }),
    }).then((res) => {
      if (res.status === 204) {
        const allSpans = document.querySelectorAll('span');
        spanWithId = Array.from(allSpans).find(
          (span) => span.innerText === songId
        );
        const musicDetails = spanWithId.closest('.music-details');

        musicDetails.remove();
      }
    });
  }
};

const confirmAndDeleteAllSongs = () => {
  const isConfirmed = confirm(
    'Are you sure you want to delete all musics? This action is irreversible\
   and cannot be undone. This is a more dangerous action.'
  );

  // If confirmed delete the song
  if (isConfirmed) {
    fetch('/musics', { method: 'DELETE' }).then((res) => {
      if (res.status === 204) {
        const musicContainer = document.querySelector('.music-search-result');
        musicContainer.innerHTML = '';
      }
    });
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
// SET ERROR MESSAGE
const setError = (input) => {
  input.style.boxShadow = 'none';
  input.classList.add('error');
};

// SET SUCCESS MESSAGE
const setSuccess = (input) => {
  input.classList.remove('error');
};

// Validated form data
const validated = (formData) => {
  const audioFile = document.getElementById('audioFile');
  const coverImage = document.getElementById('coverImage');
  const title = document.getElementById('title');
  const artist = document.getElementById('artist');
  const genre = document.getElementById('genre');
  const releaseYear = document.getElementById('releaseYear');
  const language = document.getElementById('language');
  const licence = document.getElementById('licence');

  let isValid = true;

  if (audioFile.value === '') {
    setError(audioFile);
    isValid = false;
  } else {
    setSuccess(audioFile);
  }

  if (coverImage.value === '') {
    setError(coverImage);
    isValid = false;
  } else {
    setSuccess(coverImage);
  }

  if (title.value === '') {
    setError(title);
    isValid = false;
  } else {
    setSuccess(title);
  }

  if (artist.value === '') {
    setError(artist);
    isValid = false;
  } else {
    setSuccess(artist);
  }

  if (genre.value === '') {
    setError(genre);
    isValid = false;
  } else {
    setSuccess(genre);
  }

  if (releaseYear.value === '') {
    setError(releaseYear);
    isValid = false;
  } else {
    setSuccess(releaseYear);
  }

  if (language.value === '') {
    setError(language);
    isValid = false;
  } else {
    setSuccess(language);
  }

  if (licence.value === '') {
    setError(licence);
    isValid = false;
  } else {
    setSuccess(licence);
  }

  return isValid;
};
// ************************************************************ //
// EVENT LISTNER FOR FORM SUBMISSSION
// ************************************************************ //
// Sign out the user
document.querySelector('.link-sign-out').addEventListener('click', (e) => {
  e.preventDefault();

  fetch('/signout', {
    method: 'post',
  }).then((res) => {
    if (res.ok) {
      window.location.href = '/signin';
    }
  });
});

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

// Searching with Enter key
searchInput.addEventListener('keypress', (e) => {
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
    const imageURL = musicDetails
      .querySelector('.music-cover-image')
      .getAttribute('src');
    const musicURL = musicDetails
      .querySelector('.audioFile')
      .getAttribute('src');
    confirmAndDeleteSong(songId, imageURL, musicURL);
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
  formAddMusic.reset();
});
btnMusicSubmit.addEventListener('click', (e) => {
  e.preventDefault();
  const formData = new FormData(formAddMusic);

  const isValid = validated(formData);

  if (isValid) {
    // Send the music details to the backend
    fetch('/admin/musics/music', {
      method: 'POST',
      body: formData,
    }).then(async (res) => {
      if (res.status === 201) {
        const music = await res.json();

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
              <span id="song-id">${music._id}</span>
              <button class="delete">DELETE</button>
          `;

        musicContainer.insertAdjacentElement('beforeend', musicElement);

        closeModal(modalMusic);
        formAddMusic.reset();
        alert('Music uploaded successfully');
      }
    });
  }
});

// Update music
btnUpdate.addEventListener('click', (e) => {
  e.preventDefault();
  openModal(modalUpdate);
});
btnUpdateCancel.addEventListener('click', (e) => {
  e.preventDefault();
  closeModal(modalUpdate);
  formUpdateMusic.reset();
});

// Search input
btnSearchToUpdate.addEventListener('click', (e) => {
  e.preventDefault();

  const updatedTitle = document.getElementById('updatedTitle');
  const updatedArtist = document.getElementById('updatedArtist');
  const UpdatedAlbum = document.getElementById('UpdatedAlbum');
  const updatedGenre = document.getElementById('updatedGenre');
  const updatedReleaseYear = document.getElementById('updatedReleaseYear');
  const updatedDuration = document.getElementById('updatedDuration');
  const updatedTrackNumber = document.getElementById('updatedTrackNumber');
  const updatedComposer = document.getElementById('updatedComposer');
  const updatedLanguage = document.getElementById('updatedLanguage');
  const updatedLyric = document.getElementById('updatedLyric');
  const updatedLyricist = document.getElementById('updatedLyricist');
  const updatedFileSize = document.getElementById('updatedFileSize');
  const updatedLicence = document.getElementById('updatedLicence');
  const updatedAdditionalNote = document.getElementById(
    'updatedAdditionalNote'
  );

  const id = searchInputToUpdate.value.trim();
  if (id === '') {
    return;
  }
  searchInputToUpdate.value.trim();
  // SEND A POST REQUEST AND GET ALL INFORMATION AND FILL OUT THE FIELD.
  fetch('/music/id', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        formUpdateMusic.reset();
      }
    })
    .then((data) => {
      updatedTitle.value = data[0].title;
      updatedArtist.value = data[0].artist;
      UpdatedAlbum.value = data[0].album;
      updatedGenre.value = data[0].genre;
      updatedReleaseYear.value = data[0].releaseYear;
      updatedDuration.value = data[0].duration;
      updatedTrackNumber.value = data[0].trackNumber;
      updatedComposer.value = data[0].composers;
      updatedLanguage.value = data[0].language;
      updatedLyric.value = data[0].lyric;
      updatedLyricist.value = data[0].lyricists;
      updatedFileSize.value = data[0].fileSize;
      updatedLicence.value = data[0].licence;
      updatedAdditionalNote.value = data[0].additionalNote;
    })
    .catch((error) => {
      return;
    });
});

btnMusicUpdate.addEventListener('click', (e) => {
  e.preventDefault();
  const formData = new FormData(formUpdateMusic);
  const updatedMusic = {};

  for (const [key, value] of formData) {
    updatedMusic[key] = value;
  }
  const id = searchInputToUpdate.value.trim();
  if (id !== '') {
    updatedMusic['id'] = id;
  }

  fetch('/musics/music/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedMusic),
  }).then((res) => {
    if (res.ok) {
      closeModal(modalUpdate);
      formUpdateMusic.reset();
      alert('Music updated successfully');
    }
  });
});
