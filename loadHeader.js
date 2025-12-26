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
    <header></header> <-- Innehållet från header.html kommer att laddas här -->

    <main>  </main>

    <script src="headerBehavior.js"></script>
    <script src="loadHeader.js"></script> <-- Placera detta i slutet av body -->
*/
