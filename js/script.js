document.addEventListener('DOMContentLoaded', function() {

    // Smooth scrolling for navigation links
    const navLinksForScroll = document.querySelectorAll('.nav-links a[href^="#"]');
    const headerElement = document.querySelector('header');

    navLinksForScroll.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            let targetId = this.getAttribute('href');
            let targetElement = document.querySelector(targetId);

            if (targetElement) {
                let headerOffset = headerElement ? headerElement.offsetHeight : 70; // Fallback si el header no se encuentra
                let elementPosition = targetElement.getBoundingClientRect().top;
                let offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
            // Cerrar menú móvil si está activo (manejado por el listener general de navUL más abajo)
        });
    });

    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navUL = document.querySelector('.nav-links'); // Usado para el toggle y para cerrar al hacer clic

    if (mobileMenu && navUL) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navUL.classList.toggle('active');
        });

        // Cerrar menú móvil al hacer clic en un enlace dentro de él
        navUL.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navUL.classList.contains('active')) { // Solo si el menú está activo
                    mobileMenu.classList.remove('active');
                    navUL.classList.remove('active');
                }
            });
        });
    }

    // Current Year for Footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Scroll Animations
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
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
    }

    // Active nav link highlighting on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinksForHighlight = document.querySelectorAll('.nav-links a'); // Todos los enlaces de nav para highlight

    function navHighlighter() {
        let scrollY = window.pageYOffset;
        let currentSectionId = '';

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            // Ajusta el offsetTop según sea necesario, la altura del header es una buena referencia
            const sectionTop = current.offsetTop - (headerElement ? headerElement.offsetHeight : 70) - 50; 
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                currentSectionId = current.getAttribute('id');
            }
        });

        navLinksForHighlight.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
         // Caso especial para cuando estás muy arriba y no hay sección activa, pero "Inicio" podría serlo
        if (currentSectionId === '' && scrollY < sections[0].offsetTop / 2) {
            const homeLink = document.querySelector('.nav-links a[href="#hero"]');
            if (homeLink) homeLink.classList.add('active');
        }
    }
    
    if (sections.length > 0 && navLinksForHighlight.length > 0) {
        window.addEventListener('scroll', navHighlighter);
        navHighlighter(); // Initial call para establecer el estado activo al cargar
    }


    // --- INICIO: NUEVA FUNCIONALIDAD PARA EL LIGHTBOX DE IMÁGENES ---
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeLightboxButton = document.querySelector('.lightbox-close');
    const galleryImages = document.querySelectorAll('.dashboard-gallery img');

    if (lightboxModal && lightboxImage && lightboxCaption && closeLightboxButton && galleryImages.length > 0) {
        galleryImages.forEach(image => {
            image.addEventListener('click', function() {
                lightboxModal.style.display = 'block';
                lightboxImage.src = this.src;
                lightboxImage.alt = this.alt;

                // Lógica para el caption (pie de foto)
                // Intenta obtener el título del h3 dentro de .dashboard-info que es hermano de .dashboard-gallery
                const dashboardCard = this.closest('.dashboard-card'); // Sube hasta el contenedor de la tarjeta del dashboard
                if (dashboardCard) {
                    const titleElement = dashboardCard.querySelector('.dashboard-info h3');
                    if (titleElement) {
                        lightboxCaption.textContent = titleElement.textContent;
                    } else {
                        lightboxCaption.textContent = this.alt; // Fallback al alt de la imagen si no hay h3
                    }
                } else {
                    lightboxCaption.textContent = this.alt; // Fallback si no se encuentra .dashboard-card
                }
                
                document.body.style.overflow = 'hidden'; // Evita el scroll del fondo
            });
        });

        function closeLightbox() {
            lightboxModal.style.display = 'none';
            lightboxImage.src = ''; // Limpia el src para evitar que se vea brevemente la imagen anterior al reabrir
            lightboxCaption.textContent = ''; // Limpia el caption
            document.body.style.overflow = 'auto'; // Restaura el scroll del fondo
        }

        // Cerrar al hacer clic en el botón (X)
        closeLightboxButton.addEventListener('click', closeLightbox);

        // Cerrar al hacer clic fuera de la imagen (en el fondo del modal)
        lightboxModal.addEventListener('click', function(event) {
            // Asegurarse que el clic fue en el overlay y no en la imagen o caption
            if (event.target === lightboxModal) { 
                closeLightbox();
            }
        });

        // Cerrar al presionar la tecla Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && lightboxModal.style.display === 'block') {
                closeLightbox();
            }
        });
    }
    // --- FIN: NUEVA FUNCIONALIDAD PARA EL LIGHTBOX DE IMÁGENES ---

});