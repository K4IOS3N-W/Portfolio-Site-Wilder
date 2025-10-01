// Portfolio Carousel and Modal Functionality
class PortfolioCarousel {
    constructor() {
        this.carousels = document.querySelectorAll('.portfolio-carousel');
        this.modal = document.getElementById('projectModal');
        this.modalClose = document.getElementById('modalClose');
        this.autoScrollIntervals = new Map();
        this.currentPositions = new Map(); // Track current position of each carousel

        this.projectData = {
            1: {
                title: "Space Adventure RPG",
                description: "An epic space exploration game featuring RPG elements, dynamic combat system, and procedurally generated worlds. Players embark on interstellar journeys, build their crew, and uncover the mysteries of the galaxy.",
                video: "assets/videos/project-1-demo.mp4",
                poster: "assets/img/portfolio/game-1.jpg",
                technologies: ["Unity", "C#", "Photon Network", "ProBuilder"],
                features: [
                    "Real-time multiplayer combat system",
                    "Procedurally generated star systems",
                    "Character progression and skill trees",
                    "Ship customization and upgrades",
                    "Dynamic quest system",
                    "Cross-platform compatibility"
                ],
                role: "Lead Developer",
                status: "Completed",
                platform: "PC/Mobile",
                duration: "6 months",
                teamSize: "Solo Project",
                screenshots: [
                    "assets/img/screenshots/space-1.jpg",
                    "assets/img/screenshots/space-2.jpg",
                    "assets/img/screenshots/space-3.jpg"
                ],
                liveUrl: "https://your-game.com",
                githubUrl: "https://github.com/yourusername/space-adventure",
                downloadUrl: "https://itch.io/your-game"
            },
            2: {
                title: "Mind Bender Puzzles",
                description: "A challenging puzzle platformer that bends reality. Players manipulate gravity, time, and space to solve intricate puzzles across multiple dimensions.",
                video: "assets/videos/project-2-demo.mp4",
                poster: "assets/img/portfolio/game-2.jpg",
                technologies: ["Unreal Engine", "Blueprint", "Niagara FX"],
                features: [
                    "Reality-bending puzzle mechanics",
                    "Multi-dimensional level design",
                    "Physics-based puzzle solving",
                    "Stunning visual effects",
                    "Intuitive control system",
                    "Progressive difficulty curve"
                ],
                role: "Game Designer & Developer",
                status: "Completed",
                platform: "PC",
                duration: "4 months",
                teamSize: "2 Developers",
                screenshots: [
                    "assets/img/screenshots/puzzle-1.jpg",
                    "assets/img/screenshots/puzzle-2.jpg"
                ],
                liveUrl: "https://your-puzzle-game.com",
                githubUrl: "https://github.com/yourusername/mind-bender",
                downloadUrl: "https://store.steampowered.com/your-game"
            },
            3: {
                title: "Neon Speed Racing",
                description: "High-octane arcade racing game with cyberpunk aesthetics. Experience lightning-fast speeds through neon-lit cityscapes with advanced AI opponents.",
                video: "assets/videos/project-3-demo.mp4",
                poster: "assets/img/portfolio/game-3.jpg",
                technologies: ["Unity", "C#", "Universal RP", "Cinemachine"],
                features: [
                    "Arcade-style racing mechanics",
                    "Cyberpunk visual design",
                    "Advanced AI racing opponents",
                    "Dynamic weather system",
                    "Vehicle customization",
                    "Leaderboard system"
                ],
                role: "Gameplay Programmer",
                status: "Completed",
                platform: "PC/Console",
                duration: "3 months",
                teamSize: "3 Developers",
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
                title: "Kingdom Builder",
                description: "Strategic city-building game where players construct and manage their medieval kingdom. Balance resources, defend against threats, and expand your territory.",
                video: "assets/videos/project-4-demo.mp4",
                poster: "assets/img/portfolio/game-4.jpg",
                technologies: ["Godot", "GDScript", "SQLite", "HTTP Client"],
                features: [
                    "Real-time strategy mechanics",
                    "Resource management system",
                    "Kingdom expansion gameplay",
                    "Diplomacy and trade systems",
                    "Siege warfare mechanics",
                    "Save system with cloud sync"
                ],
                role: "Systems Programmer",
                status: "In Progress",
                platform: "PC/Mobile",
                duration: "8 months",
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
        this.setupMediaTabs();
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

    setupMediaTabs() {
        const mediaTabs = document.querySelectorAll('.media-tab');
        mediaTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and content
                document.querySelectorAll('.media-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.media-content').forEach(c => c.classList.remove('active'));

                // Add active class to clicked tab
                tab.classList.add('active');

                // Show corresponding content
                const tabType = tab.dataset.tab;
                const content = document.getElementById(`${tabType}-content`);
                if (content) {
                    content.classList.add('active');
                }
            });
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
            video.src = project.video;
            video.poster = project.poster;
        }

        // Update features
        const featuresContainer = document.getElementById('projectFeatures');
        if (featuresContainer && project.features) {
            featuresContainer.innerHTML = project.features
                .map(feature => `<li><i class="bi bi-check-circle"></i>${feature}</li>`)
                .join('');
        }

        // Update technologies - show all in one section for simplicity
        const engineContainer = document.getElementById('projectEngine');
        if (project.technologies && engineContainer) {
            const techTags = project.technologies
                .map(tech => `<span class="tech-tag">${tech}</span>`)
                .join('');
            engineContainer.innerHTML = techTags;
        }

        // Update role and project stats
        const roleContainer = document.getElementById('projectRole');
        if (roleContainer && project.role) {
            roleContainer.innerHTML = `
                <span class="role-badge">${project.role}</span>
                <div class="project-stats">
                    <span><i class="bi bi-clock"></i> ${project.duration || 'N/A'}</span>
                    <span><i class="bi bi-people"></i> ${project.teamSize || 'Solo'}</span>
                </div>
            `;
        }

        // Update screenshots gallery
        const screenshotGallery = document.getElementById('screenshotGallery');
        if (screenshotGallery && project.screenshots) {
            screenshotGallery.innerHTML = project.screenshots
                .map(screenshot => `
                    <div class="screenshot-item">
                        <img src="${screenshot}" alt="Project Screenshot" />
                    </div>
                `)
                .join('');
        }

        // Update project links
        const liveLink = document.getElementById('projectLive');
        const githubLink = document.getElementById('projectGithub');
        const downloadLink = document.getElementById('projectDownload');

        if (liveLink) liveLink.href = project.liveUrl || '#';
        if (githubLink) githubLink.href = project.githubUrl || '#';
        if (downloadLink) downloadLink.href = project.downloadUrl || '#';
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
