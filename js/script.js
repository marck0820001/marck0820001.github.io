document.addEventListener('DOMContentLoaded', function() {

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
          e.preventDefault();
          let targetId = this.getAttribute('href');
          let targetElement = document.querySelector(targetId);

          if (targetElement) {
              // Consider header height if you have a fixed header
              let headerOffset = document.querySelector('header').offsetHeight || 70;
              let elementPosition = targetElement.getBoundingClientRect().top;
              let offsetPosition = elementPosition + window.pageYOffset - headerOffset;

              window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth"
              });
          }
          // Close mobile menu if open
          if(mobileMenu.classList.contains('active')) {
              mobileMenu.classList.remove('active');
              navUL.classList.remove('active');
          }
      });
  });

  // Mobile Menu Toggle
  const mobileMenu = document.getElementById('mobile-menu');
  const navUL = document.querySelector('.nav-links');

  mobileMenu.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      navUL.classList.toggle('active');
  });

  // Current Year for Footer
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
      currentYearSpan.textContent = new Date().getFullYear();
  }

  // Scroll Animations
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
          } else {
              // Optional: Remove class if you want animation to replay on scroll up
              // entry.target.classList.remove('is-visible'); 
          }
      });
  }, {
      rootMargin: '0px',
      threshold: 0.1 // Trigger when 10% of the element is visible
  });

  animatedElements.forEach(el => {
      observer.observe(el);
  });

  // Active nav link highlighting on scroll (optional, can be a bit complex)
  const sections = document.querySelectorAll('section[id]');
  function navHighlighter() {
      let scrollY = window.pageYOffset;
      sections.forEach(current => {
          const sectionHeight = current.offsetHeight;
          const sectionTop = current.offsetTop - 150; // Adjusted offset
          let sectionId = current.getAttribute('id');
          
          let correspondingLink = document.querySelector(".nav-links a[href*=" + sectionId + "]");

          if (correspondingLink) {
               if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
                  document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
                  correspondingLink.classList.add('active');
              } else {
                  correspondingLink.classList.remove('active');
              }
          }
      });
  }
  window.addEventListener('scroll', navHighlighter);
  // Initial call
  navHighlighter();

});