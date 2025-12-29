(function () {
  window.initHeader = function initHeader(header) {
    if (!header) return;

    const dropdown = header.querySelector('.dropdown');
    const dropdownMenu = header.querySelector('.dropdown-menu');
    const hamburgerBtn = header.querySelector('.hamburger-btn');
    const mobileMenu = header.querySelector('#mobile-menu');
    const mobilePanel = header.querySelector('.mobile-menu__panel');
    const mobileCloseBtn = header.querySelector('.mobile-close-btn');
    const mobileDiscoverToggle = header.querySelector('.mobile-discover-toggle');
    const mobileDiscoverList = header.querySelector('#mobile-discover-list');

    setupDesktopDropdown({ dropdown, dropdownMenu, header });
    setupMobileMenu({ hamburgerBtn, mobileMenu, mobilePanel, mobileCloseBtn, mobileDiscoverToggle, mobileDiscoverList });
  };

  function setupDesktopDropdown({ dropdown, dropdownMenu, header }) {
    if (!dropdown || !dropdownMenu || !header) return;
    const desktopQuery = window.matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)');

    const show = () => desktopQuery.matches && dropdownMenu.classList.add('visible');
    const hide = () => dropdownMenu.classList.remove('visible');

    dropdown.addEventListener('mouseenter', show);
    header.addEventListener('mouseleave', hide);
    desktopQuery.addEventListener('change', hide);
  }

  function setupMobileMenu({ hamburgerBtn, mobileMenu, mobilePanel, mobileCloseBtn, mobileDiscoverToggle, mobileDiscoverList }) {
    if (!hamburgerBtn || !mobileMenu) return;
    const mobileQuery = window.matchMedia('(max-width: 900px), (pointer: coarse)');
    const transitionMs = 250;
    const isMobile = () => mobileQuery.matches;

    // keep the list hidden until toggled open
    if (mobileDiscoverList) {
      mobileDiscoverList.hidden = true;
    }

    const toggleList = () => {
      if (!mobileDiscoverToggle || !mobileDiscoverList) return;
      const expanded = mobileDiscoverToggle.getAttribute('aria-expanded') === 'true';
      const next = !expanded;
      mobileDiscoverToggle.setAttribute('aria-expanded', String(next));
      mobileDiscoverToggle.classList.toggle('expanded', next);
      mobileDiscoverList.toggleAttribute('hidden', !next);
    };

    const openMenu = () => {
      if (!isMobile()) return;
      mobileMenu.hidden = false;
      mobileMenu.setAttribute('aria-hidden', 'false');
      mobileMenu.classList.add('open');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      mobilePanel?.focus({ preventScroll: true });
    };

    const closeMenu = () => {
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      mobileDiscoverToggle?.setAttribute('aria-expanded', 'false');
      mobileDiscoverToggle?.classList.remove('expanded');
      mobileDiscoverList?.setAttribute('hidden', '');
      hamburgerBtn.focus({ preventScroll: true });
      setTimeout(() => {
        if (!mobileMenu.classList.contains('open')) {
          mobileMenu.hidden = true;
          document.body.style.overflow = '';
        }
      }, transitionMs);
    };

    hamburgerBtn.addEventListener('click', () => {
      mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
    });

    mobileCloseBtn?.addEventListener('click', closeMenu);

    mobileMenu.addEventListener('click', event => {
      if (event.target === mobileMenu) closeMenu();
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });

    mobileDiscoverToggle?.addEventListener('click', () => {
      if (!isMobile()) return;
      if (!mobileMenu.classList.contains('open')) return;
      toggleList();
    });

    const handleDesktop = () => {
      if (!isMobile()) closeMenu();
    };

    mobileQuery.addEventListener('change', handleDesktop);
    window.addEventListener('resize', handleDesktop);
  }
})();
