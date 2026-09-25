const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const menu = document.querySelector('[data-menu]');
const routeSteps = [...document.querySelectorAll('.route-step')];
const navLinks = [...document.querySelectorAll('.site-nav a')];

const closeMenu = () => {
  if (!menuButton || !menu) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menu.classList.remove('is-open');
  document.body.classList.remove('menu-open');
};

menuButton?.addEventListener('click', () => {
  const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(willOpen));
  menu?.classList.toggle('is-open', willOpen);
  document.body.classList.toggle('menu-open', willOpen);
});

navLinks.forEach(link => link.addEventListener('click', closeMenu));

window.addEventListener('resize', () => {
  if (window.innerWidth > 820) closeMenu();
}, { passive: true });

const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 8);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

document.querySelector('[data-expand]')?.addEventListener('click', () => {
  routeSteps.forEach(step => {
    step.open = true;
  });
});

document.querySelector('[data-collapse]')?.addEventListener('click', () => {
  routeSteps.forEach(step => {
    step.open = false;
  });
});

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const activeId = entry.target.id;
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
    });
  });
}, {
  rootMargin: '-34% 0px -58% 0px',
  threshold: 0
});

navLinks.forEach(link => {
  const target = document.querySelector(link.getAttribute('href'));
  if (target) sectionObserver.observe(target);
});

const routeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-current');
  });
}, {
  rootMargin: '-20% 0px -55% 0px',
  threshold: 0.1
});

routeSteps.forEach(step => routeObserver.observe(step));
