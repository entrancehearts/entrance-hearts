// Smooth scroll for "How it Works" button
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Animate elements when they come into view
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.step, .feature-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// Animate profile cards
const cards = document.querySelectorAll('.profile-card');
let angle = 0;
setInterval(() => {
  angle = angle === 0 ? 3 : 0;
  cards.forEach((card, i) => {
    card.style.transition = 'transform 1s ease';
    card.style.transform = `rotate(${i === 0 ? -angle : angle}deg)`;
  });
}, 2000);
