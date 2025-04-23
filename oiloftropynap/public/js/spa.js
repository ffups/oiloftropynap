document.addEventListener('DOMContentLoaded', function() {
  document.body.addEventListener('click', function(e) {
    // Only handle internal links
    if (e.target.tagName === 'A' && e.target.origin === window.location.origin) {
      e.preventDefault();
      fetchPage(e.target.href);
      window.history.pushState({}, '', e.target.href);
    }
  });

  window.addEventListener('popstate', function() {
    fetchPage(window.location.href);
  });

  function fetchPage(url) {
    fetch(url)
      .then(response => response.text())
      .then(html => {
        // Extract the main content (adjust selector as needed)
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newContent = doc.querySelector('main');
        document.querySelector('main').innerHTML = newContent.innerHTML;
      });
  }
});