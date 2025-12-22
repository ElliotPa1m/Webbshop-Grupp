fetch('header.html')
  .then(response => response.text())
  .then(data => {
    document.querySelectorAll('header').forEach(header => {
      header.innerHTML = data;
    });
  });
/* Användning:
    <header></header> <-- Innehållet från header.html kommer att laddas här -->

    <main>  </main>

    <script src="loadHeader.js"></script> <-- Placera detta i slutet av body -->
*/

document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('header');
  if (!header) return;

  const observer = new MutationObserver(function () {
    const spel = header.querySelector('.dropdown');
    const dropdownMenu = header.querySelector('.dropdown-menu');
    if (!spel || !dropdownMenu) return;

    spel.addEventListener('mouseenter', function () {
      dropdownMenu.classList.add('visible');
    });
    header.addEventListener('mouseleave', function () {
      dropdownMenu.classList.remove('visible');
    });
    observer.disconnect();
  });
  observer.observe(header, { childList: true, subtree: true });
});
