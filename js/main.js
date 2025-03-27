// Mobile menu toggle
const mobileMenuButton = document.querySelector('[aria-controls="mobile-menu"]');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
  mobileMenuButton.addEventListener('click', () => {
    const expanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
    mobileMenuButton.setAttribute('aria-expanded', !expanded);
    mobileMenu.classList.toggle('hidden');
  });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Form validation
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', (e) => {
    let isValid = true;
    form.querySelectorAll('[required]').forEach(input => {
      if (!input.value.trim()) {
        input.classList.add('border-red-500');
        isValid = false;
      } else {
        input.classList.remove('border-red-500');
      }
    });
    if (!isValid) e.preventDefault();
  });
});

// Initialize animations when elements are in view
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-fadeIn');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});