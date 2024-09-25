document.addEventListener('DOMContentLoaded', function () {
    // Function to load the content dynamically
    function loadContent(page) {
        fetch(`/${page}.html`)
            .then(response => response.text())
            .then(data => {
                document.getElementById('dynamic-content').innerHTML = data;

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
                init(); // Always reinitialize scroll logic after loading new content
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