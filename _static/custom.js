document.addEventListener("DOMContentLoaded", function() {
    const titles = document.querySelectorAll('.mono-title-link');
    titles.forEach(title => {
        title.addEventListener('click', function() {
            const url = this.getAttribute('data-url');

            navigator.clipboard.writeText(url);
        });
    });
});
