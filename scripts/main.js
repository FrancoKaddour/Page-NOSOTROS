// ========================================
// CLASE PRINCIPAL DEL SITIO WEB
// ========================================
class BakeryWebsite {
    constructor() {
        this.loader = null;
        this.navigation = null;
        this.videoHandler = null;

        this.init();
    }

    init() {
        // Inicializar loader
        if (window.BasicaLoader) {
            this.loader = new window.BasicaLoader();
        }

        // Inicializar navegación
        if (window.NavigationHandler) {
            this.navigation = new window.NavigationHandler();
        }

        // Inicializar manejo de video
        this.videoHandler = new VideoHandler();

        // Nuevas funcionalidades
        this.setupIntersectionObserver();
        this.optimizeVideos();
        this.bindFormEvents();

        // Set up scroll optimization
        window.addEventListener('scroll', this.throttle(() => {
            this.optimizeVideos();
        }, 200));
    }

    setupIntersectionObserver() {
        // Media elements lazy loading and auto-play
        const mediaElements = document.querySelectorAll("img, video");

        if ("IntersectionObserver" in window) {
            const mediaObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const media = entry.target;

                            // Lazy load images
                            if (media.tagName === "IMG" && media.dataset.src) {
                                media.src = media.dataset.src;
                                media.removeAttribute("data-src");
                            }

                            // Auto-play videos
                            if (media.tagName === "VIDEO") {
                                media.play().catch((e) => console.log("Video autoplay failed:", e));
                            }

                            mediaObserver.unobserve(media);
                        }
                    });
                },
                {
                    rootMargin: "50px",
                }
            );

            mediaElements.forEach((media) => mediaObserver.observe(media));
        }

        // Grid items animation
        const gridItems = document.querySelectorAll(".grid-item, .info-item, .map-wrapper");

        if ("IntersectionObserver" in window) {
            const animationObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = "1";
                            entry.target.style.transform = "translateY(0)";
                        }
                    });
                },
                {
                    threshold: 0.1,
                }
            );

            gridItems.forEach((item, index) => {
                item.style.opacity = "0";
                item.style.transform = "translateY(20px)";
                item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
                animationObserver.observe(item);
            });
        }
    }

    optimizeVideos() {
        const videos = document.querySelectorAll("video");

        videos.forEach((video) => {
            const rect = video.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

            // Play/pause based on visibility
            if (isVisible && video.paused) {
                video.play().catch((e) => console.log("Video play failed:", e));
            } else if (!isVisible && !video.paused) {
                video.pause();
            }

            // Handle slow connections
            if ("connection" in navigator) {
                const connection = navigator.connection;
                if (connection.effectiveType === "slow-2g" || connection.effectiveType === "2g") {
                    video.style.display = "none";
                    const poster = video.getAttribute("poster");
                    if (poster) {
                        const img = document.createElement("img");
                        img.src = poster;
                        img.style.width = "100%";
                        img.style.height = "100%";
                        img.style.objectFit = "cover";
                        video.parentNode.insertBefore(img, video);
                    }
                }
            }
        });
    }

    bindFormEvents() {
        // Newsletter form submission
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('.newsletter-input').value;

                if (this.validateEmail(email)) {
                    this.handleNewsletterSubmission(email);
                } else {
                    this.showNotification('Por favor, introduce un email válido.', 'error');
                }
            });
        }

        // Search functionality
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleSearch(searchInput.value);
                }
            });
        }

        // Newsletter input real-time validation
        const newsletterInput = document.querySelector('.newsletter-input');
        if (newsletterInput) {
            newsletterInput.addEventListener('input', (e) => {
                const email = e.target.value;
                const isValid = this.validateEmail(email);

                // Visual feedback
                if (email.length > 0) {
                    e.target.style.borderColor = isValid ? '#4CAF50' : '#f44336';
                } else {
                    e.target.style.borderColor = '';
                }
            });
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    handleNewsletterSubmission(email) {
        // Show loading state
        const submitButton = document.querySelector('.newsletter-button');
        const originalText = submitButton.textContent;

        submitButton.textContent = 'ENVIANDO...';
        submitButton.disabled = true;
        submitButton.style.opacity = '0.7';

        // Simulate API call with delay
        setTimeout(() => {
            // Simulate newsletter subscription
            console.log('Newsletter subscription for:', email);

            // Show success message
            this.showNotification('¡Gracias por suscribirte a nuestro newsletter!', 'success');

            // Clear form
            const form = document.querySelector('.newsletter-form');
            if (form) {
                form.reset();
                // Reset input border
                const input = form.querySelector('.newsletter-input');
                if (input) {
                    input.style.borderColor = '';
                }
            }

            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.style.opacity = '1';

            // Add success animation to button
            submitButton.style.background = '#4CAF50';
            setTimeout(() => {
                submitButton.style.background = '';
            }, 2000);

        }, 1500); // 1.5 second delay to simulate API call
    }

    handleSearch(query) {
        if (query.trim()) {
            console.log('Search query:', query);
            // Implement search functionality here
            this.showNotification(`Buscando: "${query}"`, 'info');

            // You could implement actual search here:
            // this.performSearch(query);
        } else {
            this.showNotification('Introduce un término de búsqueda.', 'warning');
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => {
            if (notif.parentNode) {
                notif.parentNode.removeChild(notif);
            }
        });

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        // Add icon based on type
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        notification.innerHTML = `
            <span class="notification-icon">${icons[type] || icons.info}</span>
            <span class="notification-message">${message}</span>
        `;

        // Style notification
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            backgroundColor: colors[type] || colors.info,
            color: 'white',
            borderRadius: '8px',
            zIndex: '10001',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            transform: 'translateX(400px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Throttle function for performance optimization
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// VideoHandler class (placeholder)
class VideoHandler {
    constructor() {
        // Video handler functionality
    }
}

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la aplicación principal
    new BakeryWebsite();

    console.log('🍰 La Básica Website inicializada correctamente');
});
