// timeline animation
const entries = document.querySelectorAll('.tl-entry');
const io = new IntersectionObserver((items) => {
  items.forEach((item) => {
    if (item.isIntersecting) {
      item.target.classList.add('show');
    }
  });
}, { threshold: 0.15 });

entries.forEach((entry) => io.observe(entry));