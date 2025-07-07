// Header and Navigation Functionality
class HeaderManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.hamburgerMobile = document.getElementById('hamburger-mobile');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.body = document.body;
        this.isMobileMenuOpen = false;

        // Agregar debug para verificar elementos
        console.log('Header elements:', {
            navbar: this.navbar,
            hamburger: this.hamburger,
            hamburgerMobile: this.hamburgerMobile,
            mobileMenu: this.mobileMenu
        });

        this.init();
    }

    init() {
        this.makeHeaderAlwaysVisible();
        // Pequeño delay para asegurar que el DOM esté completamente cargado
        setTimeout(() => {
            this.bindEvents();
        }, 100);
    }

    makeHeaderAlwaysVisible() {
        if (this.navbar) {
            this.navbar.classList.add('visible');
        }
    }

    bindEvents() {
        // Mobile menu toggle functionality
        const toggleMobileMenu = (e) => {
            e.preventDefault();
            e.stopPropagation();

            console.log('Toggle mobile menu clicked, current state:', this.isMobileMenuOpen);

            this.isMobileMenuOpen = !this.isMobileMenuOpen;

            // Add debugging logs
            console.log('New state:', this.isMobileMenuOpen);
            console.log('Menu element:', this.mobileMenu);

            if (this.mobileMenu) {
                if (this.isMobileMenuOpen) {
                    this.mobileMenu.classList.add('active');
                    console.log('Added active class to mobile menu');
                } else {
                    this.mobileMenu.classList.remove('active');
                    console.log('Removed active class from mobile menu');
                }
            }

            if (this.hamburger) {
                this.hamburger.classList.toggle('active');
                console.log('Toggled hamburger active class');
            }

            if (this.hamburgerMobile) {
                this.hamburgerMobile.classList.toggle('active');
                console.log('Toggled hamburger mobile active class');
            }

            // Toggle fixed header when mobile menu is open
            if (this.isMobileMenuOpen) {
                if (this.navbar) {
                    this.navbar.classList.add('mobile-menu-open');
                }
                this.body.style.overflow = 'hidden';
                console.log('Menu opened - body overflow hidden');
            } else {
                if (this.navbar) {
                    this.navbar.classList.remove('mobile-menu-open');
                }
                this.body.style.overflow = '';
                console.log('Menu closed - body overflow restored');
            }
        };

        // Add events to both hamburger buttons
        if (this.hamburger) {
            this.hamburger.addEventListener('click', toggleMobileMenu);
            console.log('Hamburger event listener added');
        }

        if (this.hamburgerMobile) {
            this.hamburgerMobile.addEventListener('click', toggleMobileMenu);
            console.log('Hamburger mobile event listener added');
        }

        // Close menu when clicking on links
        const mobileLinks = document.querySelectorAll('.navbar-mobile a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMobileMenuOpen &&
                !this.mobileMenu.contains(e.target) &&
                !this.hamburger.contains(e.target) &&
                (!this.hamburgerMobile || !this.hamburgerMobile.contains(e.target))) {
                this.closeMobileMenu();
            }
        });
    }

    closeMobileMenu() {
        this.isMobileMenuOpen = false;

        if (this.mobileMenu) {
            this.mobileMenu.classList.remove('active');
        }

        if (this.hamburger) {
            this.hamburger.classList.remove('active');
        }

        if (this.hamburgerMobile) {
            this.hamburgerMobile.classList.remove('active');
        }

        if (this.navbar) {
            this.navbar.classList.remove('mobile-menu-open');
        }

        this.body.style.overflow = '';
    }
}

// Initialize header when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing HeaderManager');
    new HeaderManager();
});

// Fallback initialization in case DOMContentLoaded already fired
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new HeaderManager();
    });
} else {
    new HeaderManager();
}
