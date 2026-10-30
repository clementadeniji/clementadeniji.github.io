(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const themeLabel = document.querySelector('.theme-label');
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const setTheme = (theme) => {
    root.dataset.theme = theme;
    try { localStorage.setItem('portfolio-theme', theme); } catch (_) { /* Storage may be disabled. */ }
    if (themeLabel) themeLabel.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    if (themeButton) themeButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    if (themeColorMeta) themeColorMeta.setAttribute('content', theme === 'dark' ? '#07111f' : '#f4f7fb');
  };
  let savedTheme = root.dataset.theme || 'dark';
  try { savedTheme = localStorage.getItem('portfolio-theme') || savedTheme; } catch (_) { /* Keep the page default theme. */ }
  setTheme(savedTheme === 'light' ? 'light' : 'dark');
  themeButton?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('is-open', open);
  });
  const closeMenu = () => {
    nav?.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  };
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav?.classList.contains('is-open')) {
      closeMenu();
      menuButton?.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!nav || !menuButton || !nav.classList.contains('is-open')) return;
    if (!nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 681px)').matches) closeMenu();
  });

  document.querySelectorAll('#copyright-year').forEach((node) => { node.textContent = new Date().getFullYear(); });
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, activeObserver) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); activeObserver.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else revealItems.forEach((item) => item.classList.add('is-visible'));


  // Smooth two-part cursor: the dot tracks the pointer while the ring eases behind it.
  // Difference blending automatically inverts the cursor over light and dark content.
  if (window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
    const ring = document.createElement('div');
    const dot = document.createElement('div');
    ring.className = 'custom-cursor';
    dot.className = 'custom-cursor-dot';
    ring.setAttribute('aria-hidden', 'true');
    dot.setAttribute('aria-hidden', 'true');
    document.body.append(ring, dot);

    let targetX = -100, targetY = -100;
    let ringX = -100, ringY = -100;
    let visible = false;
    const interactiveSelector = 'a, button, input, textarea, [role="button"]';

    document.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        visible = true;
        ring.classList.add('is-visible');
        dot.classList.add('is-visible');
        ringX = targetX;
        ringY = targetY;
      }
      dot.style.transform = 'translate3d(' + targetX + 'px, ' + targetY + 'px, 0) translate(-50%, -50%)';
    }, { passive: true });

    const animateRing = () => {
      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;
      ring.style.transform = 'translate3d(' + ringX + 'px, ' + ringY + 'px, 0) translate(-50%, -50%)';
      window.requestAnimationFrame(animateRing);
    };
    window.requestAnimationFrame(animateRing);

    document.addEventListener('pointerover', (event) => {
      if (event.target.closest(interactiveSelector)) {
        ring.classList.add('is-hovering');
        dot.classList.add('is-hovering');
      }
    });
    document.addEventListener('pointerout', (event) => {
      if (event.target.closest(interactiveSelector) &&
          !event.relatedTarget?.closest(interactiveSelector)) {
        ring.classList.remove('is-hovering');
        dot.classList.remove('is-hovering');
      }
    });
    document.addEventListener('pointerleave', () => {
      visible = false;
      ring.classList.remove('is-visible');
      dot.classList.remove('is-visible');
    });
    document.addEventListener('pointerenter', () => {
      if (visible) return;
      // The next pointermove places both cursor elements at the correct position.
    });
  }

  // Cursor-proximity magnification inspired by the macOS Dock.
  // Keep the effect subtle and disable it for touch and reduced-motion users.
  const motionQuery = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  if (motionQuery.matches) {
    const motionSelector = [
      '.brand-mark', '.main-nav > a', '.theme-toggle',
      '.button', '.personal-interest-grid .interest-card',
      '.personal-project-card', '.simple-skill-grid .about-skill',
      '.tool-shot', '.simple-project', '.contact-detail', '.form-panel',
      '.social-row a', '.footer-links a'
    ].join(',');
    const motionItems = [...document.querySelectorAll(motionSelector)];
    motionItems.forEach((item) => item.classList.add('motion-item'));
    let pointerX = -1000;
    let pointerY = -1000;
    let framePending = false;
    const updateMagnification = () => {
      motionItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.hypot(pointerX - centerX, pointerY - centerY);
        const radius = Math.max(115, Math.min(180, rect.width * 1.5));
        const influence = Math.max(0, 1 - distance / radius);
        item.style.setProperty('--proximity-scale', (1 + influence * 0.085).toFixed(3));
      });
      framePending = false;
    };
    document.addEventListener('pointermove', (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!framePending) {
        framePending = true;
        window.requestAnimationFrame(updateMagnification);
      }
    }, { passive: true });
    document.addEventListener('pointerleave', () => {
      pointerX = -1000;
      pointerY = -1000;
      motionItems.forEach((item) => item.style.setProperty('--proximity-scale', '1'));
    });
  }

  const form = document.querySelector('#contact-form');
  if (!form) return;
  const message = form.querySelector('#message');
  const count = form.querySelector('#message-count');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validators = {
    name: (value) => value.trim().length >= 2 && value.trim().length <= 80 ? '' : 'Enter a name between 2 and 80 characters.',
    email: (value) => value.length <= 254 && emailPattern.test(value.trim()) ? '' : 'Enter a valid email address.',
    subject: (value) => value.trim().length >= 3 && value.trim().length <= 120 ? '' : 'Subject must be between 3 and 120 characters.',
    message: (value) => value.trim().length >= 10 && value.trim().length <= 5000 ? '' : 'Message must be between 10 and 5,000 characters.'
  };
  const validate = (field) => {
    const wrapper = field.closest('.field');
    const errorNode = wrapper?.querySelector('.field-error');
    const error = validators[field.name]?.(field.value) || '';
    wrapper?.classList.toggle('invalid', Boolean(error));
    field.setAttribute('aria-invalid', String(Boolean(error)));
    if (errorNode) errorNode.textContent = error;
    return !error;
  };
  form.querySelectorAll('input:not([type=hidden]), textarea').forEach((field) => {
    field.addEventListener('blur', () => validate(field));
    field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') validate(field); });
  });
  message?.addEventListener('input', () => { if (count) count.textContent = String(message.value.length); });
  form.addEventListener('submit', (event) => {
    const fields = [...form.querySelectorAll('input[name=name], input[name=email], input[name=subject], textarea[name=message]')];
    const valid = fields.map(validate).every(Boolean);
    event.preventDefault();
    if (!valid) { fields.find((field) => field.getAttribute('aria-invalid') === 'true')?.focus(); return; }

    const values = Object.fromEntries(new FormData(form).entries());
    const emailSubject = `Portfolio message: ${values.subject.trim()}`;
    const emailBody = `Name: ${values.name.trim()}\nEmail: ${values.email.trim()}\n\n${values.message.trim()}`;
    window.location.href = `mailto:adenijiclementbamikole@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  });
})();
