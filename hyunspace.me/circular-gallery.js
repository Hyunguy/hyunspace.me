// ==========================
// CSS3D Circular Gallery
// ==========================

class CircularGallery {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) {
      console.error("CircularGallery: Container not found:", containerSelector);
      return;
    }

    console.log("[GALLERY] Gallery initialized");

    // Gallery images - using high-quality stock images
    this.images = [
      {
        url: "assets/korean.png",
        title: "American-born Korean",
        description: "I'm a first-gen Korean Computer Engineer!"
      },
      {
        url: "assets/desktop.jpg",
        title: "PC Build",
        description: "I enjoy experimenting with hardware and building PCs. Ask me anything!"
      },
      {
        url: "assets/prescriptbeeper.gif",
        title: "Prescript Beeper",
        description: "Prescript Beeper made for fun, inspired by Project Moon"
      },
      {
        url: "assets/IMG20251026201213.jpg",
        title: "CPAC Dinner Night!",
        description: "HMU if you'd like to meet up to chat!"
      },
      {
        url: "assets/hobken.jpg",
        title: "Night View of NYC",
        description: "I come from New Jersey, and enjoy the night view from time to time."
      }
    ];

    this.currentRotation = 0;
    this.targetRotation = 0;
    this.isDragging = false;
    this.previousMouseX = 0;
    this.velocity = 0;
    this.autoRotateSpeed = 0.15;
    this.autoRotate = true;
    this.userAutoRotatePreference = true; // Track user's preference from toggle button

    this.init();
  }

  init() {
    // Clears any existing content
    this.container.innerHTML = '';
    
    // set up container styles
    this.container.style.cssText = `
      position: relative;
      width: 100%;
      height: 100%;
      perspective: 2000px;
      perspective-origin: 50% 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
    `;
    
    // create carousel wrapper
    const carousel = document.createElement('div');
    carousel.className = 'carousel-3d';
    carousel.style.cssText = `
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform 0.05s linear;
    `;
    this.carousel = carousel;
    this.container.appendChild(carousel);

    // calculate positions
    const radius = 650; // Distance from center - increased for better spacing
    const angleStep = 360 / this.images.length;

    // create image cards
    this.images.forEach((imageData, i) => {
      const angle = i * angleStep;
      
      const item = document.createElement('div');
      item.className = 'carousel-item';
      item.dataset.index = i;
      item.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        width: 380px;
        height: 280px;
        margin-left: -190px;
        margin-top: -140px;
        transform-style: preserve-3d;
        transform: rotateY(${angle}deg) translateZ(${radius}px);
        backface-visibility: visible;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0,0,0,0.6);
        transition: transform 0.3s ease;
        border: 2px solid rgba(96, 165, 250, 0.2);
      `;

      // Image element
      const img = document.createElement('img');
      img.src = imageData.url;
      img.alt = imageData.title;
      img.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        pointer-events: none;
      `;
      
      // Loading state
      img.style.background = 'rgba(96, 165, 250, 0.1)';
      img.onload = () => {
        console.log(`[GALLERY] Image ${i + 1} loaded: ${imageData.title}`);
      };
      img.onerror = () => {
        console.error(`[GALLERY] Image ${i + 1} failed to load: ${imageData.url}`);
      };

      // overlay with title and description
      const overlay = document.createElement('div');
      overlay.className = 'carousel-overlay';
      overlay.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 24px;
        background: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.7) 60%, transparent);
        color: white;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      `;
      
      const titleEl = document.createElement('div');
      titleEl.style.cssText = `
        font-size: 22px;
        font-weight: 700;
        margin-bottom: 8px;
        color: #60a5fa;
      `;
      titleEl.textContent = imageData.title;
      
      const descEl = document.createElement('div');
      descEl.style.cssText = `
        font-size: 14px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.5;
      `;
      descEl.textContent = imageData.description;
      
      overlay.appendChild(titleEl);
      overlay.appendChild(descEl);

      item.appendChild(img);
      item.appendChild(overlay);
      carousel.appendChild(item);

      // hover effects
      item.addEventListener('mouseenter', () => {
        overlay.style.opacity = '1';
        item.style.transform = `rotateY(${angle}deg) translateZ(${radius + 20}px) scale(1.02)`;
      });
      
      item.addEventListener('mouseleave', () => {
        overlay.style.opacity = '0';
        item.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
      });
    });

    console.log(`[GALLERY] Created ${this.images.length} gallery items`);

    // Nav arrows
    this.createNavigationArrows();
    
    // Create auto-rotate toggle button
    this.createAutoRotateToggle();

    // Set up interaction
    this.setupInteraction();
    
    // Start animation loop
    this.animate();
  }

  createNavigationArrows() {
    // Left arrow
    const leftArrow = document.createElement('button');
    leftArrow.className = 'gallery-nav-arrow gallery-nav-left';
    leftArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
    leftArrow.setAttribute('aria-label', 'Previous image');
    leftArrow.style.cssText = `
      position: absolute;
      left: 40px;
      top: 50%;
      transform: translateY(-50%);
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(96, 165, 250, 0.2);
      border: 2px solid rgba(96, 165, 250, 0.5);
      color: #60a5fa;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      z-index: 10;
      backdrop-filter: blur(10px);
    `;
    
    // Right arrow
    const rightArrow = document.createElement('button');
    rightArrow.className = 'gallery-nav-arrow gallery-nav-right';
    rightArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
    rightArrow.setAttribute('aria-label', 'Next image');
    rightArrow.style.cssText = `
      position: absolute;
      right: 40px;
      top: 50%;
      transform: translateY(-50%);
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(96, 165, 250, 0.2);
      border: 2px solid rgba(96, 165, 250, 0.5);
      color: #60a5fa;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      z-index: 10;
      backdrop-filter: blur(10px);
    `;

    // hover effects
    [leftArrow, rightArrow].forEach(arrow => {
      arrow.addEventListener('mouseenter', () => {
        arrow.style.background = 'rgba(96, 165, 250, 0.4)';
        arrow.style.transform = 'translateY(-50%) scale(1.1)';
        arrow.style.boxShadow = '0 4px 20px rgba(96, 165, 250, 0.4)';
      });
      
      arrow.addEventListener('mouseleave', () => {
        arrow.style.background = 'rgba(96, 165, 250, 0.2)';
        arrow.style.transform = 'translateY(-50%)';
        arrow.style.boxShadow = 'none';
      });
    });

    // click Event handlers
    const rotationStep = 360 / this.images.length;
    
    leftArrow.addEventListener('click', () => {
      this.autoRotate = false; // Temporarily pause
      this.targetRotation -= rotationStep;
      console.log("[GALLERY] Navigated left");
      
      // resume auto-rotate after a delay if user preference is enabled
      if (this.userAutoRotatePreference) {
        if (this.autoRotateResumeTimeout) {
          clearTimeout(this.autoRotateResumeTimeout);
        }
        this.autoRotateResumeTimeout = setTimeout(() => {
          if (this.userAutoRotatePreference && !this.isDragging) {
            this.autoRotate = true;
            console.log("[GALLERY] Auto-rotate resumed after navigation");
          }
        }, 3000);
      }
    });
    
    rightArrow.addEventListener('click', () => {
      this.autoRotate = false; // Temporarily pause
      this.targetRotation += rotationStep;
      console.log("[GALLERY] Navigated right");
      
      // resume auto-rotate after a delay if user preference is enabled
      if (this.userAutoRotatePreference) {
        if (this.autoRotateResumeTimeout) {
          clearTimeout(this.autoRotateResumeTimeout);
        }
        this.autoRotateResumeTimeout = setTimeout(() => {
          if (this.userAutoRotatePreference && !this.isDragging) {
            this.autoRotate = true;
            console.log("[GALLERY] Auto-rotate resumed after navigation");
          }
        }, 3000);
      }
    });

    this.container.appendChild(leftArrow);
    this.container.appendChild(rightArrow);
  }

  createAutoRotateToggle() {
    // create toggle button for auto-rotation
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'gallery-auto-rotate-toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle auto-rotation');
    toggleBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
    toggleBtn.style.cssText = `
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(96, 165, 250, 0.2);
      border: 2px solid rgba(96, 165, 250, 0.5);
      color: #60a5fa;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      z-index: 10;
      backdrop-filter: blur(10px);
    `;

    // update button appearance based on auto-rotate state
    const updateButtonState = () => {
      if (this.autoRotate) {
        toggleBtn.style.background = 'rgba(96, 165, 250, 0.4)';
        toggleBtn.style.borderColor = 'rgba(96, 165, 250, 0.8)';
        toggleBtn.style.boxShadow = '0 4px 20px rgba(96, 165, 250, 0.4)';
        toggleBtn.querySelector('i').style.animation = 'spin 2s linear infinite';
        toggleBtn.setAttribute('aria-label', 'Disable auto-rotation (currently enabled)');
      } else {
        toggleBtn.style.background = 'rgba(96, 165, 250, 0.2)';
        toggleBtn.style.borderColor = 'rgba(96, 165, 250, 0.5)';
        toggleBtn.style.boxShadow = 'none';
        toggleBtn.querySelector('i').style.animation = 'none';
        toggleBtn.setAttribute('aria-label', 'Enable auto-rotation (currently disabled)');
      }
    };

    // initial state
    updateButtonState();

    // hover effects
    toggleBtn.addEventListener('mouseenter', () => {
      toggleBtn.style.transform = 'translateX(-50%) scale(1.1)';
      if (!this.autoRotate) {
        toggleBtn.style.background = 'rgba(96, 165, 250, 0.3)';
        toggleBtn.style.boxShadow = '0 4px 20px rgba(96, 165, 250, 0.3)';
      }
    });
    
    toggleBtn.addEventListener('mouseleave', () => {
      toggleBtn.style.transform = 'translateX(-50%)';
      updateButtonState();
    });

    // click handler - toggle auto-rotate
    toggleBtn.addEventListener('click', () => {
      this.userAutoRotatePreference = !this.userAutoRotatePreference;
      this.autoRotate = this.userAutoRotatePreference;
      
      // clear any pending auto-resume timeouts
      if (this.autoRotateResumeTimeout) {
        clearTimeout(this.autoRotateResumeTimeout);
        this.autoRotateResumeTimeout = null;
      }
      
      updateButtonState();
      
      console.log(`[GALLERY] Auto-rotate ${this.autoRotate ? 'enabled' : 'disabled'} by user`);
      
      // visual feedback
      toggleBtn.style.transform = 'translateX(-50%) scale(0.9)';
      setTimeout(() => {
        toggleBtn.style.transform = 'translateX(-50%) scale(1.1)';
        setTimeout(() => {
          toggleBtn.style.transform = 'translateX(-50%)';
        }, 100);
      }, 100);
    });

    this.container.appendChild(toggleBtn);

    // add spin animation for the icon
    if (!document.getElementById('gallery-spin-animation')) {
      const style = document.createElement('style');
      style.id = 'gallery-spin-animation';
      style.textContent = `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    console.log("[GALLERY] Auto-rotate toggle created");
  }

  setupInteraction() {
    const getX = (e) => {
      return e.touches ? e.touches[0].clientX : e.clientX;
    };

    const onStart = (e) => {
      this.isDragging = true;
      this.autoRotate = false;
      this.previousMouseX = getX(e);
      this.velocity = 0;
      this.container.style.cursor = 'grabbing';
      
      // Prevent text selection during drag
      e.preventDefault();
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      
      console.log("[GALLERY] Started dragging");
    };

    const onMove = (e) => {
      if (!this.isDragging) return;
      
      e.preventDefault();
      
      const currentX = getX(e);
      const deltaX = currentX - this.previousMouseX;
      
      // Higher sensitivity for better control
      this.velocity = deltaX * 0.4;
      this.targetRotation += this.velocity;
      
      this.previousMouseX = currentX;
    };

    const onEnd = () => {
      if (!this.isDragging) return;
      
      this.isDragging = false;
      this.container.style.cursor = 'grab';
      
      // Re-enable text selection
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      
      console.log("[GALLERY] Stopped dragging");
      
      // Resume auto-rotate after 3 seconds only if user preference is enabled
      if (this.userAutoRotatePreference) {
        if (this.autoRotateResumeTimeout) {
          clearTimeout(this.autoRotateResumeTimeout);
        }
        this.autoRotateResumeTimeout = setTimeout(() => {
          if (!this.isDragging && this.userAutoRotatePreference) {
            this.autoRotate = true;
            console.log("[GALLERY] Auto-rotate resumed after dragging");
          }
        }, 3000);
      }
    };

    // Set cursor
    this.container.style.cursor = 'grab';

    // Mouse events
    this.container.addEventListener('mousedown', onStart);
    this.container.addEventListener('mousemove', onMove);
    this.container.addEventListener('mouseup', onEnd);
    this.container.addEventListener('mouseleave', onEnd);

    // Touch events
    this.container.addEventListener('touchstart', onStart, { passive: true });
    this.container.addEventListener('touchmove', onMove, { passive: true });
    this.container.addEventListener('touchend', onEnd);

    console.log("[GALLERY] Interaction handlers set up");
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Auto-rotate when enabled
    if (this.autoRotate && !this.isDragging) {
      this.targetRotation += this.autoRotateSpeed;
    }

    // Apply inertia
    if (!this.isDragging) {
      this.velocity *= 0.95;
      if (Math.abs(this.velocity) > 0.01) {
        this.targetRotation += this.velocity;
      }
    }

    // Smooth interpolation
    const diff = this.targetRotation - this.currentRotation;
    this.currentRotation += diff * 0.1;
    
    // Update carousel rotation
    this.carousel.style.transform = `rotateY(${-this.currentRotation}deg)`;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGallery);
} else {
  // DOM already loaded
  initGallery();
}

function initGallery() {
  console.log("[GALLERY] Initializing gallery...");
  
  const galleryContainer = document.getElementById('circular-gallery');
  
  if (galleryContainer) {
    console.log("[GALLERY] Gallery container found!");
    new CircularGallery('#circular-gallery');
  } else {
    console.error("[GALLERY] Gallery container #circular-gallery not found!");
    console.log("[GALLERY] Available elements:", document.querySelectorAll('[id*="gallery"]'));
  }
}