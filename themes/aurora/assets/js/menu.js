// Unified navigation menu interactions
(() => {
  const container = document.querySelector('.container');
  const nav = document.querySelector('.navigation-menu');
  if (!container || !nav) return;

  const HOVER_OPEN_MS = 120;
  const HOVER_CLOSE_MS = 150;
  const menus = Array.from(nav.querySelectorAll('.menu'));
  const openTimers = new WeakMap();
  const closeTimers = new WeakMap();

  const clearTimers = m => {
    clearTimeout(openTimers.get(m));
    clearTimeout(closeTimers.get(m));
  };

  const setExpanded = (m, expanded) => {
    const btn = m.querySelector('.menu__caret-btn');
    if (btn) btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  };

  const closeMenu = m => {
    m.classList.remove('open');
    setExpanded(m, false);
  };

  const openMenu = m => {
    menus.forEach(x => { if (x !== m) closeMenu(x); });
    m.classList.add('open');
    setExpanded(m, true);

    const dropdown = m.querySelector('.menu__dropdown');
    if (dropdown && dropdown.getBoundingClientRect().right > container.getBoundingClientRect().right) {
      dropdown.style.left = 'auto';
      dropdown.style.right = 0;
    }
  };

  const scheduleOpen = m => {
    clearTimers(m);
    openTimers.set(m, setTimeout(() => openMenu(m), HOVER_OPEN_MS));
  };

  const scheduleClose = m => {
    clearTimers(m);
    closeTimers.set(m, setTimeout(() => closeMenu(m), HOVER_CLOSE_MS));
  };

  menus.forEach(menu => {
    const trigger = menu.querySelector('.menu__trigger');
    const dropdown = menu.querySelector('.menu__dropdown');
    if (!trigger || !dropdown) return;

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      menu.classList.contains('open') ? closeMenu(menu) : openMenu(menu);
    });

    dropdown.addEventListener('click', e => e.stopPropagation());

    ['pointerenter', 'mouseenter', 'focusin'].forEach(evt => {
      trigger.addEventListener(evt, () => scheduleOpen(menu));
      dropdown.addEventListener(evt, () => scheduleOpen(menu));
    });

    ['pointerleave', 'mouseleave', 'focusout'].forEach(evt => {
      trigger.addEventListener(evt, () => scheduleClose(menu));
      dropdown.addEventListener(evt, () => scheduleClose(menu));
    });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.navigation-menu')) menus.forEach(closeMenu);
  });

  window.addEventListener('resize', () => menus.forEach(closeMenu));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') menus.forEach(closeMenu);
  });
})();

