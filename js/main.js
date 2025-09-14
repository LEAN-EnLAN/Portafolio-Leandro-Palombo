// Scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// Animar skills cuando entran en vista
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const progressBars = entry.target.querySelectorAll('.progress');
      progressBars.forEach(bar => {
        const value = bar.getAttribute('data-value');
        bar.style.width = value + "%";
      });
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.skills').forEach(sec => observer.observe(sec));

// Fade-in secciones
const fadeSections = document.querySelectorAll('.fade-in');
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.2 });

fadeSections.forEach(sec => fadeObs.observe(sec));
