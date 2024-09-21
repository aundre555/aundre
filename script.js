const playPauseButton = document.getElementById('playPause');
const backwardButton = document.getElementById('backward');
const forwardButton = document.getElementById('forward');
const audio = document.getElementById('audio');
const audioFile = document.getElementById('audioFile');
const progressBar = document.getElementById('progressBar');
const currentTimeDisplay = document.getElementById('currentTime');
const durationTimeDisplay = document.getElementById('durationTime');
const musicImage = document.getElementById('musicImage');

let isPlaying = false;

// Play/Pause Toggle
playPauseButton.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        playPauseButton.innerHTML = '<i class="fa-solid fa-play"></i>';
    } else {
        audio.play();
        playPauseButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }
    isPlaying = !isPlaying;
});

// Forward Button - 5 seconds forward
forwardButton.addEventListener('click', () => {
    audio.currentTime += 5;
});

// Backward Button - 5 seconds backward
backwardButton.addEventListener('click', () => {
    audio.currentTime -= 5;
});

// Update progress bar and time
audio.addEventListener('timeupdate', () => {
    const currentTime = audio.currentTime;
    const duration = audio.duration;

    progressBar.value = (currentTime / duration) * 100;

    // Update time display
    currentTimeDisplay.textContent = formatTime(currentTime);
    durationTimeDisplay.textContent = formatTime(duration);
});

// Scrub through the audio
progressBar.addEventListener('input', () => {
    const duration = audio.duration;
    const scrubTime = (progressBar.value / 100) * duration;
    audio.currentTime = scrubTime;
});

// Load selected audio file and handle cover art
audioFile.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const fileURL = URL.createObjectURL(file);
        audio.src = fileURL;
        audio.play();
        playPauseButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
        isPlaying = true;

        // Use jsmediatags to read the file and extract cover art
        jsmediatags.read(file, {
            onSuccess: (tag) => {
                const tags = tag.tags;
                if (tags.picture) {
                    const { data, format } = tags.picture;
                    let base64String = "";
                    for (let i = 0; i < data.length; i++) {
                        base64String += String.fromCharCode(data[i]);
                    }
                    const imageUrl = `data:${format};base64,${btoa(base64String)}`;
                    musicImage.src = imageUrl;
                } else {
                    // If no cover art, use the default image
                    musicImage.src = 'music.png';
                }
            },
            onError: (error) => {
                // In case of error or no metadata, use the default image
                console.log(error);
                musicImage.src = 'music.png';
            }
        });
    }
});

// Format time in mm:ss
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
