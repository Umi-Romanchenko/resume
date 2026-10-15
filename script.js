/* ============================================================
   ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ
   Автоопределение при первом визите → запоминание выбора
   ============================================================ */

(function () {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function getCurrentTheme() {
    return root.getAttribute('data-theme') || 'light';
  }

  function applyTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    if (persist) {
      try { localStorage.setItem('theme', theme); } catch (e) { /* noop */ }
    }
  }

  // Клик по кнопке — переключение + сохранение
  if (toggle) {
    toggle.addEventListener('click', function () {
      const next = getCurrentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next, true);
    });
  }

  // Если пользователь ещё НЕ выбирал тему вручную — следим за системой.
  // Если выбирал — уважаем его выбор и больше не трогаем.
  function hasUserChoice() {
    try { return !!localStorage.getItem('theme'); } catch (e) { return false; }
  }

  function handleSystemChange(e) {
    if (!hasUserChoice()) {
      applyTheme(e.matches ? 'dark' : 'light', false);
    }
  }

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleSystemChange);
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(handleSystemChange); // Safari < 14
  }
})();


/* ============================================================
   ПЛАВНОЕ ПОЯВЛЕНИЕ СЕКЦИЙ ПРИ СКРОЛЛЕ
   ============================================================ */

(function () {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  // Если пользователь отключил анимации — сразу показываем всё
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach(el => el.classList.add('visible'));
    return;
  }

  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
})();