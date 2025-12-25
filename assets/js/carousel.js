// Portfolio Carousel and Modal Functionality
class PortfolioCarousel {
    constructor() {
        this.carousels = document.querySelectorAll('.portfolio-carousel');
        this.modal = document.getElementById('projectModal');
        this.modalClose = document.getElementById('modalClose');
        this.autoScrollIntervals = new Map();
        this.currentPositions = new Map(); // Track current position of each carousel
        this.lightbox = null;
        this.currentScreenshots = [];
        this.currentScreenshotIndex = 0;

        this.projectData = {
            1: {
                title: "Side Scroller Teleport Mechanic",
                description: "A unique side-scrolling platformer that introduces innovative teleportation mechanics, allowing players to navigate through challenging levels in creative ways.",
                video: "assets/img/printSite/upside-down/clip1.mkv",
                poster: "assets/img/printSite/upside-down/print1.png",
                technologies: ["Unreal Engine", "C++", "Blueprints"],
                features: [
                    "Innovative teleportation mechanics navigating between the top and bottom side of the level",
                    "Secondary teleport ability that allows the player to teleport behind previously hit enemies",
                    "Side scrolling movement"
                ],
                role: "Gameplay Programmer",
                status: "Completed",
                platform: "PC",
                duration: "6 months",
                teamSize: "2 Developers",
                screenshots: [
                    "assets/img/printSite/upside-down/print1.png",
                    "assets/img/printSite/upside-down/print2.png",
                    "assets/img/printSite/upside-down/print3.png"
                ],
                liveUrl: "https://your-game.com",
                githubUrl: "https://github.com/yourusername/space-adventure",
                downloadUrl: "https://itch.io/your-game"
            },
            2: {
                title: "Visual Novel Framework",
                description: "A versatile framework for creating visual novels with branching narratives and rich character interactions and DND-like mechanics.",
                video: "assets/img/printSite/framework/clip1.mkv",
                poster: "assets/img/printSite/framework/print1.png",
                technologies: ["Unity", "C#", "ink"],
                features: [
                    "Branching narrative system",
                    "multiple endings based on player choices",
                    "DND-inspired character stats and skill checks",
                    "combat system with turn-based mechanics",
                ],
                role: "Game Designer & Developer",
                status: "Completed",
                platform: "PC",
                duration: "4 months",
                teamSize: "1 Developer",
                screenshots: [
                    "assets/img/printSite/framework/print1.png",
                    "assets/img/printSite/framework/print2.png",
                    "assets/img/printSite/framework/print3.png"
                ],
                liveUrl: "https://your-puzzle-game.com",
                githubUrl: "https://github.com/yourusername/mind-bender",
                downloadUrl: "https://store.steampowered.com/your-game"
            },
            3: {
                title: "Doom-like First-Person Shooter",
                description: "Fast-paced first-person shooter inspired by classic Doom gameplay. Battle through hordes of enemies with a variety of weapons.",
                video: "assets/videos/project-3-demo.mp4",
                poster: "assets/img/portfolio/game-3.jpg",
                technologies: ["Unity", "C#", "Universal RP"],
                features: [
                    "Fast-paced combat mechanics",
                    "Retro visual design",
                    "Variety of weapons",
                    "Enemy AI"
                ],
                role: "Gameplay Programmer",
                status: "Completed",
                platform: "PC/Console",
                duration: "2 months",
                teamSize: "5 Developers",
                screenshots: [
                    "assets/img/screenshots/racing-1.jpg",
                    "assets/img/screenshots/racing-2.jpg",
                    "assets/img/screenshots/racing-3.jpg"
                ],
                liveUrl: "https://your-racing-game.com",
                githubUrl: "https://github.com/yourusername/neon-racing",
                downloadUrl: "https://your-game-store.com"
            },
            4: {
                title: "Side Scroller Push-Pull Mechanic",
                description: "A unique side-scrolling game featuring a push-pull mechanic that allows players to manipulate the environment and solve puzzles.",
                video: "assets/videos/project-4-demo.mp4",
                poster: "assets/img/portfolio/game-4.jpg",
                technologies: ["Unreal Engine", "C++", "Blueprint"],
                features: [
                    "Push-pull mechanic for environmental manipulation",
                    "Challenging puzzles and obstacles",
                ],
                    
                
                role: "Gameplay Programmer",
                status: "Completed",
                platform: "PC",
                duration: "3 months",
                teamSize: "4 Developers",
                screenshots: [
                    "assets/img/screenshots/kingdom-1.jpg",
                    "assets/img/screenshots/kingdom-2.jpg",
                    "assets/img/screenshots/kingdom-3.jpg",
                    "assets/img/screenshots/kingdom-4.jpg"
                ],
                liveUrl: "https://kingdom-builder-demo.com",
                githubUrl: "https://github.com/yourusername/kingdom-builder",
                downloadUrl: "https://itch.io/kingdom-builder"
            }
        };

        this.init();
    }

    init() {
        this.setupCarousels();
        this.setupModal();
        this.setupProjectCards();
        this.startAutoScroll();
        this.setupScreenshotLightbox();
        this.handleWindowResize();
    }

    setupCarousels() {
        this.carousels.forEach(carousel => {
            const prevBtn = carousel.querySelector('.prev-btn');
            const nextBtn = carousel.querySelector('.next-btn');
            const track = carousel.querySelector('.carousel-track');

            if (track) {
                // Initialize position
                this.currentPositions.set(track, 0);
                
                if (prevBtn && nextBtn) {
                    prevBtn.addEventListener('click', () => this.scrollCarousel(track, 'prev'));
                    nextBtn.addEventListener('click', () => this.scrollCarousel(track, 'next'));
                }

                // Pause auto-scroll on hover
                carousel.addEventListener('mouseenter', () => {
                    this.pauseAutoScroll(track);
                });

                carousel.addEventListener('mouseleave', () => {
                    this.resumeAutoScroll(track);
                });
            }
        });
    }

    scrollCarousel(track, direction) {
        const cards = track.querySelectorAll('.portfolio-card');
        if (cards.length === 0) return;

        // Get card width dynamically including gap
        const firstCard = cards[0];
        const cardStyle = getComputedStyle(firstCard);
        const cardWidth = firstCard.offsetWidth;
        const gap = parseInt(getComputedStyle(track).gap) || 20;
        const scrollAmount = cardWidth + gap;

        // Calculate container width and how many cards fit
        const containerWidth = track.parentElement.offsetWidth;
        const visibleCards = Math.floor(containerWidth / (cardWidth + gap));
        const totalCards = cards.length;
        
        // Don't scroll if all cards are visible
        if (totalCards <= visibleCards) {
            track.style.transform = 'translateX(0px)';
            return;
        }

        let currentPosition = this.currentPositions.get(track) || 0;
        let newPosition;

        if (direction === 'next') {
            newPosition = currentPosition - scrollAmount;
            // Calculate maximum scroll (when last card is visible)
            const maxScroll = -(totalCards - visibleCards) * scrollAmount;
            
            // If we've reached the end, loop back to beginning
            if (newPosition <= maxScroll) {
                newPosition = 0;
            }
        } else {
            newPosition = currentPosition + scrollAmount;
            
            // If we've reached the beginning, loop to end
            if (newPosition > 0) {
                const maxScroll = -(totalCards - visibleCards) * scrollAmount;
                newPosition = maxScroll;
            }
        }

        // Update position
        this.currentPositions.set(track, newPosition);
        track.style.transform = `translateX(${newPosition}px)`;
    }

    startAutoScroll() {
        this.carousels.forEach(carousel => {
            const track = carousel.querySelector('.carousel-track');
            if (track) {
                this.setupAutoScroll(track);
            }
        });
    }

    setupAutoScroll(track) {
        // Clear any existing interval
        this.pauseAutoScroll(track);
        
        const interval = setInterval(() => {
            this.scrollCarousel(track, 'next');
        }, 4000); // Scroll every 4 seconds

        this.autoScrollIntervals.set(track, interval);
    }

    pauseAutoScroll(track) {
        const interval = this.autoScrollIntervals.get(track);
        if (interval) {
            clearInterval(interval);
            this.autoScrollIntervals.delete(track);
        }
    }

    resumeAutoScroll(track) {
        // Only resume if there's no existing interval
        if (!this.autoScrollIntervals.has(track)) {
            this.setupAutoScroll(track);
        }
    }

    setupModal() {
        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => this.closeModal());
        }

        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal.querySelector('.modal-overlay')) {
                    this.closeModal();
                }
            });
        }

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && this.modal.style.display === 'block') {
                this.closeModal();
            }
        });
    }

    setupProjectCards() {
        const cards = document.querySelectorAll('.portfolio-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const projectId = card.dataset.project;
                this.openProjectModal(projectId);
            });
        });
    }

    openProjectModal(projectId) {
        const project = this.projectData[projectId];
        if (!project || !this.modal) return;

        // Make modal near full-screen
        this.modal.style.position = 'fixed';
        this.modal.style.top = '0';
        this.modal.style.left = '0';
        this.modal.style.width = '100vw';
        this.modal.style.height = '100vh';
        this.modal.style.zIndex = '10000';
        this.modal.style.display = 'block';
        this.modal.style.opacity = '0';

        // Set modal content to near full-screen
        const modalContent = this.modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.width = '95vw';
            modalContent.style.height = '95vh';
            modalContent.style.maxWidth = '95vw';
            modalContent.style.maxHeight = '95vh';
            modalContent.style.margin = '2.5vh auto';
            modalContent.style.overflow = 'auto';
        }

        // Update modal content with enhanced data
        this.updateModalContent(project);

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Add smooth fade-in animation
        setTimeout(() => {
            this.modal.style.opacity = '1';
        }, 50);
    }

    updateModalContent(project) {
        // Update basic project info
        const titleElement = document.getElementById('projectTitle');
        const descElement = document.getElementById('projectDescription');

        if (titleElement) titleElement.textContent = project.title;
        if (descElement) descElement.textContent = project.description;

        // Update project status and platform
        const statusElement = document.getElementById('projectStatus');
        const platformElement = document.getElementById('projectPlatform');

        if (statusElement) {
            statusElement.textContent = project.status || 'Completed';
            statusElement.className = `status-badge ${project.status?.toLowerCase().replace(' ', '_') || 'completed'}`;
        }
        if (platformElement) platformElement.textContent = project.platform || 'PC';

        // Update video
        const video = document.getElementById('projectVideo');
        if (video) {
            const source = video.querySelector('source');
            if (source) {
                source.src = project.video;
                video.load();
            }
            video.poster = project.poster;
        }

        // Update features
        const featuresContainer = document.getElementById('projectFeatures');
        if (featuresContainer && project.features) {
            featuresContainer.innerHTML = project.features
                .map(feature => `<li><i class="bi bi-check-circle"></i>${feature}</li>`)
                .join('');
        }

        // Update technologies - priority display with enhanced styling
        const engineContainer = document.getElementById('projectEngine');
        if (project.technologies && engineContainer) {
            const techTags = project.technologies
                .map(tech => `<span class="tech-tag"><i class="bi bi-code-square"></i> ${tech}</span>`)
                .join('');
            engineContainer.innerHTML = techTags;
        }

        // Update development info - structured grid layout
        const roleContainer = document.getElementById('projectRole');
        if (roleContainer && project.role) {
            roleContainer.innerHTML = `
                <div class="dev-info-item">
                    <strong><i class="bi bi-person-badge"></i> Role</strong>
                    <span class="role-badge">${project.role}</span>
                </div>
                <div class="dev-info-item">
                    <strong><i class="bi bi-clock"></i> Duration</strong>
                    <span>${project.duration || 'N/A'}</span>
                </div>
                <div class="dev-info-item">
                    <strong><i class="bi bi-people"></i> Team Size</strong>
                    <span>${project.teamSize || 'Solo'}</span>
                </div>
            `;
        }

        // Update screenshots gallery
        const screenshotGallery = document.getElementById('screenshotGallery');
        if (screenshotGallery && project.screenshots) {
            this.currentScreenshots = project.screenshots;
            screenshotGallery.innerHTML = project.screenshots
                .map((screenshot, index) => `
                    <div class="screenshot-item" data-index="${index}">
                        <img src="${screenshot}" alt="Project Screenshot" />
                    </div>
                `)
                .join('');
            
            // Add click handlers to screenshots
            setTimeout(() => {
                const screenshotItems = screenshotGallery.querySelectorAll('.screenshot-item');
                screenshotItems.forEach(item => {
                    item.addEventListener('click', (e) => {
                        const index = parseInt(item.dataset.index);
                        this.openLightbox(index);
                    });
                });
            }, 100);
        }

        // Update project links
        const liveLink = document.getElementById('projectLive');
        const githubLink = document.getElementById('projectGithub');
        const downloadLink = document.getElementById('projectDownloadLink');

        if (liveLink) liveLink.href = project.liveUrl || '#';
        if (githubLink) githubLink.href = project.githubUrl || '#';
        if (downloadLink) downloadLink.href = project.downloadUrl || '#';
    }

    setupScreenshotLightbox() {
        this.lightbox = document.getElementById('screenshotLightbox');
        const lightboxClose = document.getElementById('lightboxClose');
        const lightboxPrev = document.getElementById('lightboxPrev');
        const lightboxNext = document.getElementById('lightboxNext');

        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => this.closeLightbox());
        }

        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', () => this.navigateLightbox(-1));
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', () => this.navigateLightbox(1));
        }

        // Close on background click
        if (this.lightbox) {
            this.lightbox.addEventListener('click', (e) => {
                if (e.target === this.lightbox) {
                    this.closeLightbox();
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.lightbox && this.lightbox.style.display === 'flex') {
                if (e.key === 'Escape') {
                    this.closeLightbox();
                } else if (e.key === 'ArrowLeft') {
                    this.navigateLightbox(-1);
                } else if (e.key === 'ArrowRight') {
                    this.navigateLightbox(1);
                }
            }
        });
    }

    openLightbox(index) {
        if (!this.lightbox || !this.currentScreenshots.length) return;

        this.currentScreenshotIndex = index;
        const lightboxImage = document.getElementById('lightboxImage');
        
        if (lightboxImage) {
            lightboxImage.src = this.currentScreenshots[index];
        }

        this.lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Add fade-in animation
        setTimeout(() => {
            this.lightbox.style.opacity = '1';
        }, 10);
    }

    closeLightbox() {
        if (!this.lightbox) return;

        this.lightbox.style.opacity = '0';
        setTimeout(() => {
            this.lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }

    navigateLightbox(direction) {
        if (!this.currentScreenshots.length) return;

        this.currentScreenshotIndex += direction;

        // Loop around
        if (this.currentScreenshotIndex < 0) {
            this.currentScreenshotIndex = this.currentScreenshots.length - 1;
        } else if (this.currentScreenshotIndex >= this.currentScreenshots.length) {
            this.currentScreenshotIndex = 0;
        }

        const lightboxImage = document.getElementById('lightboxImage');
        if (lightboxImage) {
            lightboxImage.style.opacity = '0';
            setTimeout(() => {
                lightboxImage.src = this.currentScreenshots[this.currentScreenshotIndex];
                lightboxImage.style.opacity = '1';
            }, 150);
        }
    }

    closeModal() {
        if (!this.modal) return;

        // Add fade-out animation
        this.modal.style.opacity = '0';

        setTimeout(() => {
            // Pause video
            const video = document.getElementById('projectVideo');
            if (video) {
                video.pause();
                video.currentTime = 0;
            }

            // Reset modal styles
            this.modal.style.display = 'none';
            const modalContent = this.modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.width = '';
                modalContent.style.height = '';
                modalContent.style.maxWidth = '';
                modalContent.style.maxHeight = '';
                modalContent.style.margin = '';
            }

            // Restore body scroll
            document.body.style.overflow = 'auto';
        }, 300);
    }

    handleWindowResize() {
        window.addEventListener('resize', () => {
            // Reset carousel positions on resize
            this.carousels.forEach(carousel => {
                const track = carousel.querySelector('.carousel-track');
                if (track) {
                    // Reset to beginning
                    this.currentPositions.set(track, 0);
                    track.style.transform = 'translateX(0px)';
                    
                    // Restart auto-scroll
                    this.pauseAutoScroll(track);
                    setTimeout(() => {
                        this.setupAutoScroll(track);
                    }, 500);
                }
            });
        });
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioCarousel();
});
