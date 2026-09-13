const header = document.querySelector('[data-header]');
const steps = [...document.querySelectorAll('.route-step')];
const navLinks = [...document.querySelectorAll('.nav a')];

window.addEventListener('scroll', () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 16);
}, { passive: true });

document.querySelector('[data-expand]')?.addEventListener('click', () => {
  steps.forEach(step => { step.open = true; });
});

document.querySelector('[data-collapse]')?.addEventListener('click', () => {
  steps.forEach(step => { step.open = false; });
});

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
  });
}, { rootMargin: '-30% 0px -62%', threshold: 0 });

['why', 'work', 'route', 'results', 'format'].forEach(id => {
  const section = document.getElementById(id);
  if (section) sectionObserver.observe(section);
});
