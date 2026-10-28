(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const themeLabel = document.querySelector('.theme-label');
  const setTheme = (theme) => {
    root.dataset.theme = theme;
    try { localStorage.setItem('portfolio-theme', theme); } catch (_) { /* Storage may be disabled. */ }
    if (themeLabel) themeLabel.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    if (themeButton) themeButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  };
  let savedTheme = 'dark';
  try { savedTheme = localStorage.getItem('portfolio-theme') || 'dark'; } catch (_) { /* Keep the default theme. */ }
  setTheme(savedTheme === 'light' ? 'light' : 'dark');
  themeButton?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('is-open', open);
  });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));

  document.querySelectorAll('#copyright-year').forEach((node) => { node.textContent = new Date().getFullYear(); });
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, activeObserver) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); activeObserver.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else revealItems.forEach((item) => item.classList.add('is-visible'));

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
