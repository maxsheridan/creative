document.addEventListener('DOMContentLoaded', function () {
    // Function to load the content dynamically and apply the correct stylesheet
    function loadContent(page) {
        fetch(`/${page}.html`)
            .then(response => response.text())
            .then(data => {
                document.getElementById('dynamic-content').innerHTML = data;

                // Remove any existing page-specific stylesheet
                const existingStyle = document.getElementById('page-style');
                if (existingStyle) {
                    existingStyle.remove();
                }

                // Load the correct stylesheet for the current page
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = `/css/${page}.css`;
                link.id = 'page-style';
                document.head.appendChild(link);

                // Wait for the CSS and content to fully load before reinitializing scroll
                setTimeout(() => {
                    currentPos = 0;
                    init(); // Reinitialize scroll logic after the content is fully loaded
                }, 100); // Slight delay to ensure layout is ready
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