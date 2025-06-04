console.log("ATharva")

// Initial variables
let i = 0;
let isPlaying = true;
let playlist;
let audio = new Audio();
let songData;
let songName;
let Artist;
let SongMood;

async function main() {
    // Load songs from JSON
    let response = await fetch("song.json");
    let songs = await response.json();

    // Function to play music based on index
    function playMusic(x) {
        let music = songs[0][playlist];  // Get current playlist
        console.log(music);
        audio.src = music[x].url;
        audio.play();
        // Add this line to ensure pause icon shows when new song starts
        play.innerHTML = '<i class="fas fa-pause text-white fs-4"></i>';
        isPlaying = true;
        songName = music[x].title;
        Artist = music[x].artist;
        SongMood = music[x].mood;
        console.log(mood);  // This line may throw error if mood is not defined globally
        return { name, artist, mood };  // Variables `name`, `artist`, `mood` are undefined!
    }

    // Add this function to update song list in menu
    function updateSongsList(playlistName) {
        const songsList = document.querySelector('.songs-list');
        songsList.innerHTML = ''; // Clear existing list
        
        const music = songs[0][playlistName];
        if (!music) return;

        music.forEach((song, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <div class="song-title">${song.title}</div>
                        <small class="text-muted">${song.artist}</small>
                    </div>
                    <div class="song-mood ${song.mood.toLowerCase()}">${song.mood}</div>
                </div>
            `;
            
            // Add click handler for song selection
            li.addEventListener('click', () => {
                i = index; // Update current song index
                songData = playMusic(i);
                document.querySelector('.songs-menu').classList.remove('active');
            });
            
            songsList.appendChild(li);
        });
    }

    // English playlist button
    let btnEng = document.querySelector(".English");
    btnEng.addEventListener("click", () => {
        playlist = "english";
        updateSongsList(playlist);
        console.log("english");
        songData = playMusic(i);
        songName = songData.name;
        SongMood = songData.mood;
        console.log(SongMood);
        Artist = songData.artist;
        isPlaying = true;
    });

    // Indie playlist button
    let btnInd = document.querySelector(".indie");
    btnInd.addEventListener("click", () => {
        playlist = "indie";
        updateSongsList(playlist);
        console.log("indie");
        songData = playMusic(i);
        songName = songData.name;
        Artist = songData.artist;
        SongMood = songData.mood;
        console.log(SongMood);
        isPlaying = true;
    });

    // Bollywood playlist button
    let btnBolly = document.querySelector(".bollywood");
    btnBolly.addEventListener("click", () => {
        playlist = "bollywood";
        updateSongsList(playlist);
        console.log("bollywood");
        songData = playMusic(i);
        songName = songData.name;
        Artist = songData.artist;
        SongMood = songData.mood;
        console.log(SongMood);
        isPlaying = true;
    });

    // Toggle Play/Pause button
    let play = document.querySelector(".play");
    play.addEventListener("click", () => {
        if (isPlaying == true) {
            audio.pause();
            console.log("Audio Paused");
            isPlaying = false;
            // Add this line to change to play icon
            play.innerHTML = '<i class="fas fa-play text-white fs-4"></i>';
        } else if (isPlaying == false) {
            audio.play();
            console.log("Audio Playing");
            isPlaying = true;
            // Add this line to change to pause icon
            play.innerHTML = '<i class="fas fa-pause text-white fs-4"></i>';
        }
    });

    // Previous button
    let prev = document.querySelector(".prev");
    prev.addEventListener("click", () => {
        if (i <= 0) {
            alert("Already at first Song");
        } else {
            i--;
            songData = playMusic(i);
            songName = songData.name;
            Artist = songData.artist;
            console.log(i);
        }
    });

    // Next button
    let next = document.querySelector(".next");
    next.addEventListener("click", () => {
        if (i >= songs[0][playlist].length - 1) {
            alert("Already at last Song");
        } else {
            i++;
            songData = playMusic(i);
            songName = songData.name;
            Artist = songData.artist;
            console.log(i);
        }
    });

    // When metadata is loaded (to update duration and UI)
    audio.addEventListener("loadedmetadata", () => {
        const duration = audio.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        
        // Update duration display
        const durationDisplay = document.querySelector('.progress-wrapper .text-white-50:last-child');
        durationDisplay.innerHTML = `<i class="fas fa-hourglass-end"></i>${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        let div = document.querySelector(".info");
        if (!div) {
            console.error("Error: .info div not found!");
            return;
        }

        // Update mood color class
        console.log("Before resetting class: ", div.className);
        div.className = `info`;
        div.classList.add(SongMood);
        console.log("Final class on div: ", div.className);

        // Update song info UI
        div.innerHTML = `
      <h2> Currently playing : <span class="deco ${SongMood.toLowerCase()}"><u>${songName}</u></span></h2><br>
      <h2> Song By : <span class="deco ${SongMood.toLowerCase()}"><u>${Artist}</u></span></h2><br>
      <h2> Duration : <span class="deco ${SongMood.toLowerCase()}"><u>${minutes} minutes ${seconds} seconds</u></span></h2>
     <h2>Song mood : <span class="deco ${SongMood.toLowerCase()}">${SongMood}</span></h2>`;
    });

    // Dark mode toggle
    let isDarkmode = false;
    let toggle = document.querySelector(".toggle");
    toggle.addEventListener("click", () => {
        let link = document.querySelector(".tp");
        if (isDarkmode == false) {
            link.innerHTML = `<link rel="stylesheet" href="darkmode.css">`;
            document.querySelector(".head").prepend(link);
            isDarkmode = true;
        } else {
            link.innerHTML = `<link rel="stylesheet" href="style.css">`;
            document.querySelector(".head").prepend(link);
            isDarkmode = false;
        }
    });

    // Update progress bar in real time
    let progressBar = document.querySelector(".progress-bar");
    audio.addEventListener("timeupdate", () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;

        // Update current time display with proper formatting
        const minute = Math.floor(audio.currentTime / 60);
        const seconds = Math.floor(audio.currentTime % 60);
        const currTime = document.querySelector(".currTime");
        currTime.innerHTML = `<i class="fas fa-clock"></i>${String(minute).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    });

    // Seek bar interaction
    progressBar.addEventListener("input", () => {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
    });

    // Auto-play next song when current ends
    audio.addEventListener("ended", () => {
        if (i >= songs[0][playlist].length - 1) {
            console.log("ayoo");
        } else {
            next.click();
        }
    });

    // Volume control
    let volume = document.querySelector(".volumeBar");
    volume.addEventListener("input", () => {
        audio.volume = volume.value / 100;
    });

    // Keyboard shortcuts: Space = play/pause, Arrows = next/prev
    document.addEventListener("keydown", (e) => {
        if (e.code == "Space") {
            e.preventDefault();
            if (isPlaying == true) {
                audio.pause();
                isPlaying = false;
            } else if (isPlaying == false) {
                audio.play();
                isPlaying = true;
            }
        } else if (e.code == "ArrowRight") {
            next.click();
        } else if (e.code == "ArrowLeft") {
            prev.click();
        }
    });

    // Update card functionality
    document.querySelector('.update').addEventListener('click', () => {
        document.querySelector('.update-card').classList.add('show');
    });

    document.querySelector('.update-card .close-btn').addEventListener('click', () => {
        document.querySelector('.update-card').classList.remove('show');
    });

    // Close card when clicking outside
    document.addEventListener('click', (e) => {
        const updateCard = document.querySelector('.update-card');
        const versionElement = document.querySelector('.update');
        if (!updateCard.contains(e.target) && e.target !== versionElement) {
            updateCard.classList.remove('show');
        }
    });

    // Ripple Effect
    document.querySelectorAll('.control-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${e.offsetX}px`;
            ripple.style.top = `${e.offsetY}px`;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Audio Visualizer
    function createVisualizer() {
        const container = document.createElement('div');
        container.className = 'visualizer-container';
        
        for(let i = 0; i < 64; i++) {
            const bar = document.createElement('div');
            bar.className = 'visualizer-bar';
            bar.style.left = `${i * (100/64)}%`;
            container.appendChild(bar);
        }
        
        document.querySelector('.album-art').appendChild(container);
    }

    function updateVisualizer(audioData) {
        const bars = document.querySelectorAll('.visualizer-bar');
        for(let i = 0; i < bars.length; i++) {
            const height = audioData[i] / 255 * 100;
            bars[i].style.transform = `scaleY(${height}%)`;
        }
    }

    // Queue Viewer
    document.querySelector('.queue-toggle').addEventListener('click', () => {
        document.querySelector('.queue-viewer').classList.toggle('active');
    });

    // Mini Player Toggle
    document.querySelector('.mini-toggle').addEventListener('click', () => {
        document.querySelector('.player-card').classList.toggle('mini');
    });

    // Add hamburger menu handlers
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const songsMenu = document.querySelector('.songs-menu');
    const closeMenu = document.querySelector('.close-menu');

    hamburgerBtn.addEventListener('click', () => {
        songsMenu.classList.add('active');
        if (playlist) {
            updateSongsList(playlist);
        }
    });

    closeMenu.addEventListener('click', () => {
        songsMenu.classList.remove('active');
    });

    // Initialize visualizer
    createVisualizer();
}

// Start the app
main();
