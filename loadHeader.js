fetch('header.html')
  .then(response => response.text())
  .then(html => {
    document.querySelectorAll('header').forEach(header => {
      header.innerHTML = html;
      if (typeof initHeader === 'function') {
        initHeader(header);
      }
    });
  });
/* Användning:
    <header></header>

    <main>  </main>

    <script src="headerBehavior.js"></script>
    <script src="loadHeader.js"></script> 
*/
