document.addEventListener("DOMContentLoaded", () => {
    const updatePlayPauseButton = (playPause, isPlaying) => {
        playPause.className = isPlaying ? "play-pause pause" : "play-pause play";
        playPause.innerHTML = isPlaying ? 
            `<svg class="icon" viewBox="0 0 30 30">
                <rect x="10" y="8" width="3" height="14"></rect>
                <rect x="17" y="8" width="3" height="14"></rect>
            </svg>` :
            `<svg class="icon" viewBox="0 0 30 30">
                <polygon points="10,6.9 10,23.1 24,15"></polygon>
            </svg>`;
    };

    const toggleOverlay = (overlay, isVisible) => {
        overlay.style.opacity = isVisible ? 1 : 0;
    };

    const resetVideoPlayers = () => {
        document.querySelectorAll(".video-player").forEach((e) => {
            const video = e.querySelector("video");
            const playPause = e.querySelector(".play-pause");
            const progress = e.querySelector(".progress input");
            const progressFill = e.querySelector(".progress-filled");
            const overlay = e.querySelector(".overlay");

            video.pause();
            video.currentTime = 0;
            updatePlayPauseButton(playPause, false);
            progressFill.style.width = "0%";
            progress.value = 0;
            toggleOverlay(overlay, true);  // Show overlay when reset
        });
    };

    // Initialize video player controls
    document.querySelectorAll(".video-player").forEach(videoPlayer => {
        const video = videoPlayer.querySelector("video");
        const playPause = videoPlayer.querySelector(".play-pause");
        const progress = videoPlayer.querySelector(".progress input");
        const progressFill = videoPlayer.querySelector(".progress-filled");
        const overlay = videoPlayer.querySelector(".overlay");

        // When play/pause button is clicked
        playPause.addEventListener("click", () => {
            if (video.paused) {
                document.querySelectorAll("video").forEach(v => v !== video && v.pause());
                video.play();
                toggleOverlay(overlay, false);  // Hide overlay when playing
            } else {
                video.pause();
                toggleOverlay(overlay, false);  // Hide overlay when paused
            }
        });

        // When video starts playing
        video.addEventListener("play", () => {
            updatePlayPauseButton(playPause, true);
            toggleOverlay(overlay, false);  // Hide overlay when video starts playing
        });

        // When video is paused
        video.addEventListener("pause", () => {
            updatePlayPauseButton(playPause, false);
            toggleOverlay(overlay, false);  // Hide overlay when video is paused
        });

        // Update the progress bar as the video plays
        video.addEventListener("timeupdate", () => {
            const percentage = (video.currentTime / video.duration) * 100 || 0;
            progressFill.style.width = `${percentage}%`;
            progress.value = percentage;
        });

        // Handle progress bar input (jumping to specific time)
        progress.addEventListener("input", () => {
            video.currentTime = (progress.value / 100) * video.duration;
        });
    });

    // Reset videos on page load or when modal is opened
    window.addEventListener("pageshow", resetVideoPlayers);
});