// Handle image loading
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.content-image');

    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });

        // If image is already loaded
        if (img.complete) {
            img.classList.add('loaded');
        }
    });
});

// Scroll indicator functionality - Modificado para usar scroll de window
document.addEventListener('DOMContentLoaded', function() {
    const scrollDots = document.querySelectorAll('.scroll-dot');
    const sections = document.querySelectorAll('.fullscreen-section');

    // Update active dot based on scroll position
    function updateActiveDot() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;

        // Calcular en qué sección estamos basándonos en el scroll actual
        let currentSection = 0;
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop - 100; // offset para header
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                currentSection = index;
            }
        });

        scrollDots.forEach((dot, index) => {
            if (index === currentSection) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Smooth scroll to section when clicking dot
    scrollDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (sections[index]) {
                const targetTop = sections[index].offsetTop - 80; // offset para header fijo
                window.scrollTo({
                    top: targetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active dot on scroll
    window.addEventListener('scroll', updateActiveDot);

    // Initial call
    updateActiveDot();
});

// Handle keyboard navigation - Modificado para usar scroll de window
document.addEventListener('keydown', function(e) {
    const sections = document.querySelectorAll('.fullscreen-section');
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Encontrar la sección actual
    let currentSectionIndex = 0;
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
            currentSectionIndex = index;
        }
    });

    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const nextSection = currentSectionIndex + 1;
        if (nextSection < sections.length) {
            const targetTop = sections[nextSection].offsetTop - 80;
            window.scrollTo({
                top: targetTop,
                behavior: 'smooth'
            });
        }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const prevSection = currentSectionIndex - 1;
        if (prevSection >= 0) {
            const targetTop = sections[prevSection].offsetTop - 80;
            window.scrollTo({
                top: targetTop,
                behavior: 'smooth'
            });
        }
    }
});

// Handle responsive behavior
function handleResize() {
    // No necesitamos hacer nada especial aquí ya que usamos scroll normal
    // La función se mantiene por compatibilidad
}

window.addEventListener('resize', handleResize);

// ========================================
// FUNCIONALIDADES ESPECÍFICAS DE NOSOTROS
// ========================================

class NosotrosPage {
    constructor() {
        this.mapContainer = document.querySelector('.map-container');
        this.directionsBtn = document.querySelector('.directions-btn');

        this.init();
    }

    init() {
        this.bindMapEvents();
        this.observeMapSection();
    }

    bindMapEvents() {
        // Manejar clic en botón de direcciones
        if (this.directionsBtn) {
            this.directionsBtn.addEventListener('click', () => {
                this.openDirections();
            });
        }

        // Agregar interacción con info items
        const infoItems = document.querySelectorAll('.info-item');
        infoItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-4px)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0)';
            });
        });
    }

    openDirections() {
        // Abrir direcciones en Google Maps
        const address = "La Básica Pastelería, Saavedra, Capital Federal";
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
        window.open(mapsUrl, '_blank');
    }

    observeMapSection() {
        // Observar cuando la sección del mapa entra en viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateMapSection();
                }
            });
        }, {
            threshold: 0.2
        });

        if (this.mapContainer) {
            observer.observe(this.mapContainer);
        }
    }

    animateMapSection() {
        // Animar elementos del mapa cuando entran en vista
        const infoItems = document.querySelectorAll('.info-item');
        const mapWrapper = document.querySelector('.map-wrapper');

        infoItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                item.style.transition = 'all 0.6s ease';

                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100);
            }, index * 150);
        });

        if (mapWrapper) {
            setTimeout(() => {
                mapWrapper.style.opacity = '0';
                mapWrapper.style.transform = 'scale(0.95)';
                mapWrapper.style.transition = 'all 0.8s ease';

                setTimeout(() => {
                    mapWrapper.style.opacity = '1';
                    mapWrapper.style.transform = 'scale(1)';
                }, 100);
            }, 300);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.map-section')) {
        new NosotrosPage();
        console.log('📍 Nosotros page inicializada');
    }
});

// Exportar para uso externo si es necesario
window.NosotrosPage = NosotrosPage;
