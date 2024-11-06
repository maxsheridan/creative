document.addEventListener('DOMContentLoaded', function () {
    // Function to initialize the video player
    function initVideoPlayer() {
        const video = document.getElementById("video");
        const playPauseButton = document.getElementById("play-pause");
        const progressBar = document.getElementById("progress");
        const progressFilled = document.getElementById("progress-filled");

        if (!video || !playPauseButton || !progressBar || !progressFilled) {
            return; // Exit if video elements are not found
        }

        function togglePlayPause() {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
            updatePlayPauseAriaLabel();
        }

        function updatePlayPauseButton() {
            if (video.paused) {
                playPauseButton.classList.remove("pause");
                playPauseButton.classList.add("play");
            } else {
                playPauseButton.classList.remove("play");
                playPauseButton.classList.add("pause");
            }
        }

        function updatePlayPauseAriaLabel() {
            playPauseButton.setAttribute("aria-label", video.paused ? "Play video" : "Pause video");
        }

        function updateProgress() {
            const progress = (video.currentTime / video.duration) * 100;
            progressFilled.style.width = `${progress}%`;
            progressBar.value = progress;
        }

        function seekVideo() {
            const seekTime = (progressBar.value / 100) * video.duration;
            video.currentTime = seekTime;
            updateProgress();
        }

        playPauseButton.addEventListener("click", togglePlayPause);
        video.addEventListener("play", updatePlayPauseButton);
        video.addEventListener("pause", updatePlayPauseButton);
        video.addEventListener("play", updatePlayPauseAriaLabel);
        video.addEventListener("pause", updatePlayPauseAriaLabel);
        video.addEventListener("timeupdate", updateProgress);
        progressBar.addEventListener("input", seekVideo);
        progressBar.addEventListener("change", updateProgress);
        progressBar.addEventListener("touchstart", (e) => {
            const touch = e.touches[0];
            const seekTime = ((touch.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth) * video.duration;
            video.currentTime = seekTime;
            updateProgress();
        });
        progressBar.addEventListener("touchmove", (e) => {
            const touch = e.touches[0];
            const seekTime = ((touch.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth) * video.duration;
            video.currentTime = seekTime;
            updateProgress();
        });
    }

    // Function to load content dynamically and set the document title
    function loadContent(page) {
        fetch(`/${page}.html`)
            .then(response => response.text())
            .then(data => {
                document.getElementById('dynamic-content').innerHTML = data;

                // Update the page title if title information is in the loaded content
                const titleMatch = data.match(/<title>(.*?)<\/title>/);
                if (titleMatch) {
                    document.title = titleMatch[1]; // Set document title directly from loaded content
                }

                // Disable all page-specific stylesheets
                document.querySelectorAll('link[id$="-style"]').forEach(link => {
                    link.disabled = true;
                });

                // Enable the current page's stylesheet
                const activeStyle = document.getElementById(`${page}-style`);
                if (activeStyle) {
                    activeStyle.disabled = false;
                }

                // Reset scroll position and reinitialize scroll behavior
                currentPos = 0;
                init(); // Reinitialize scroll logic after loading new content

                // Initialize video player after content is loaded
                initVideoPlayer();
            })
            .catch(error => console.error('Error loading content:', error));
    }

    // Add event listeners to navigation links
    const links = document.querySelectorAll('.links a');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            loadContent(page);

            // Optionally, update the active class for the clicked link
            links.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Load initial content (default page)
    loadContent('work');
});
