(() => {
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeBtn');
  const year = document.getElementById('year');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.getElementById('navlinks');

  year.textContent = new Date().getFullYear();

  // Theme: remember in localStorage
  const saved = localStorage.getItem('theme');
  if (saved === 'light') root.setAttribute('data-theme', 'light');

  themeBtn?.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) {
      root.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });

  // Mobile nav
  navToggle?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  // Close menu on click (mobile)
  navLinks?.addEventListener('click', (e) => {
    const t = e.target;
    if (t && t.tagName === 'A') {
      navLinks.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  // Active section highlight
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navAnchors = Array.from(document.querySelectorAll('.navlinks a[href^="#"]'));
  const byId = new Map(navAnchors.map(a => [a.getAttribute('href')?.slice(1), a]));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach(a => a.classList.remove('active'));
      const id = entry.target.getAttribute('id');
      const link = byId.get(id);
      if (link) link.classList.add('active');
    });
  }, { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 });

  sections.forEach(s => observer.observe(s));

  // Simple reveal animation
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        reveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card, .t-card').forEach(el => {
    el.classList.add('reveal');
    reveal.observe(el);
  });

  // Contact form: open mail client with prefilled subject/body
  window.handleContactSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:omkaraurangabadkar13@gmail.com?subject=${subject}&body=${body}`;
    document.getElementById('formNote').textContent = "Opened your email client with a prefilled message.";
    return false;
  };
})(); 
