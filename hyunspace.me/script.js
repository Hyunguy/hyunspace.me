// ==========================
// GSAP Plugin Registration
// ==========================
if (window.gsap && window.InertiaPlugin) {
  gsap.registerPlugin(InertiaPlugin);
} else {
  console.warn("GSAP or InertiaPlugin failed to load (dot grid inertia disabled).");
}

// ==========================
// configuration
// ==========================
const CONFIG = {
  REVEAL_TEXT: {
    SPIN_DURATION_MS: 420,
    REVEAL_DURATION_MS: 620,
    FRAME_RATE_MS: 48,
    ALPHABET: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:,.?/|"
  },
  DOT_GRID: {
    DOT_SIZE: 4,
    GAP: 18,
    BASE_COLOR: "#1e223a",
    ACTIVE_COLOR: "#60a5fa",
    PROXIMITY: 130,
    SPEED_TRIGGER: 900,
    SHOCK_RADIUS: 260,
    SHOCK_STRENGTH: 4.5,
    MAX_SPEED: 5000,
    RESISTANCE: 850,
    RETURN_DURATION: 1.4
  },
  CARD_SWAP: {
    VERTICAL_DISTANCE: 70,
    ROTATION_DELAY: 5200
  },
  INTERSECTION_OBSERVER: { THRESHOLD: 0.5 }
};

const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
// co-op glow effect disabled - was interfering with typewriter animation
// ==========================
// utility
// ==========================
const throttle = (func, limit) => {
  let lastCall = 0;
  return function (...args) {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};

function hexToRgb(hex) {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16)
  };
}

function getRandomCharacter() {
  const { ALPHABET } = CONFIG.REVEAL_TEXT;
  return ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
}

// ==========================
// reveal / glitch Text Effect
// ==========================
class RevealTextEffect {
  constructor(element) {
    this.element = element;
    this.originalText = element.textContent;

    const rect = element.getBoundingClientRect();
    element.style.minWidth = rect.width + "px";
    element.style.display = "inline-block";

    this.chars = this.originalText.split('');
    this.spinMs = 500;
    this.revealMs = 500;
    this.frameMs = 40;
    this.isAnimating = false;
  }

  animate() {
    if (this.isAnimating) return Promise.resolve();
    if (prefersReducedMotion) {
      this.element.textContent = this.originalText;
      this.element.dataset.glitchDone = "true";
      return Promise.resolve();
    }

    this.isAnimating = true;

    if (this.element.querySelector?.("span[data-letter='1']")) {
      this.isAnimating = false;
      this.element.dataset.glitchDone = "true";
      this.element.dataset.revealed = "true";
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const startTime = performance.now();
      const totalDuration = this.spinMs + this.revealMs;

      const animateFrame = () => {
        const elapsed = performance.now() - startTime;

        if (elapsed < this.spinMs) {
          const randomText = this.chars.map(() => getRandomCharacter()).join("");
          this.element.textContent = randomText;
          setTimeout(animateFrame, this.frameMs);
          return;
        }

        if (elapsed < totalDuration) {
          const revealProgress = elapsed - this.spinMs;
          const revealIndex = Math.floor((revealProgress / this.revealMs) * this.chars.length);

          const revealedText = this.chars
            .map((char, i) => (i < revealIndex ? char : getRandomCharacter()))
            .join("");

          this.element.textContent = revealedText;
          setTimeout(animateFrame, this.frameMs);
          return;
        }

        this.element.textContent = this.originalText;
        this.element.dataset.glitchDone = "true";
        this.element.dataset.revealed = "true";
        this.isAnimating = false;
        resolve();
      };

      animateFrame();
    });
  }
}

// ==========================
// variable Proximity
// ==========================
function parseFontVariationSettings(settingsStr) {
  const map = new Map();
  settingsStr
    .split(",")
    .map(s => s.trim())
    .forEach(part => {
      const [name, value] = part.split(/\s+/);
      const axis = name.replace(/['"]/g, "");
      const num = Number(value);
      if (!Number.isNaN(num)) map.set(axis, num);
    });
  return map;
}

function enableVariableProximity(targetEl, options) {
  if (!targetEl || targetEl.dataset.proximityEnabled === "true") return;

  const label = targetEl.dataset.originalText ?? targetEl.textContent;
  targetEl.dataset.originalText = label;

  const container = options.containerEl ?? targetEl.parentElement ?? document.body;
  const radius = options.radius ?? 120;
  const falloff = options.falloff ?? "linear";

  const fromStr = options.fromSettings;
  const toStr = options.toSettings;

  const fromMap = parseFontVariationSettings(fromStr);
  const toMap = parseFontVariationSettings(toStr);

  const axes = Array.from(fromMap.entries()).map(([axis, fromValue]) => ({
    axis,
    fromValue,
    toValue: toMap.get(axis) ?? fromValue
  }));

  targetEl.textContent = "";
  targetEl.classList.add("variable-proximity");
  targetEl.style.display = "inline";
  targetEl.setAttribute("aria-label", label);

  const sr = document.createElement("span");
  sr.className = "sr-only";
  sr.textContent = label;

  const letterSpans = [];
  const words = label.split(" ");

  words.forEach((word, wi) => {
    const wordSpan = document.createElement("span");
    wordSpan.style.display = "inline-block";
    wordSpan.style.whiteSpace = "nowrap";

    for (const ch of word.split("")) {
      const s = document.createElement("span");
      s.dataset.letter = "1";
      s.style.display = "inline-block";
      s.style.fontVariationSettings = fromStr;
      s.textContent = ch;
      wordSpan.appendChild(s);
      letterSpans.push(s);
    }

    targetEl.appendChild(wordSpan);

    if (wi < words.length - 1) {
      const space = document.createElement("span");
      space.style.display = "inline-block";
      space.innerHTML = "&nbsp;";
      targetEl.appendChild(space);
    }
  });

  targetEl.appendChild(sr);
  targetEl.dataset.proximityEnabled = "true";

  const mouse = { x: 0, y: 0 };
  let lastX = null;
  let lastY = null;

  const onMove = (ev) => {
    const rect = container.getBoundingClientRect();
    mouse.x = ev.clientX - rect.left;
    mouse.y = ev.clientY - rect.top;
  };

  window.addEventListener("mousemove", onMove, { passive: true });

  const calcFalloff = (distance) => {
    const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
    switch (falloff) {
      case "exponential": return norm ** 2;
      case "gaussian": return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
      case "linear":
      default: return norm;
    }
  };

  const raf = () => {
    if (lastX === mouse.x && lastY === mouse.y) {
      requestAnimationFrame(raf);
      return;
    }
    lastX = mouse.x;
    lastY = mouse.y;

    const containerRect = container.getBoundingClientRect();

    for (const letter of letterSpans) {
      const r = letter.getBoundingClientRect();
      const cx = r.left + r.width / 2 - containerRect.left;
      const cy = r.top + r.height / 2 - containerRect.top;

      const dx = cx - mouse.x;
      const dy = cy - mouse.y;
      const d = Math.sqrt(dx * dx + dy * dy);

      if (d >= radius) {
        letter.style.fontVariationSettings = fromStr;
        continue;
      }

      const f = calcFalloff(d);
      const settings = axes
        .map(({ axis, fromValue, toValue }) => {
          const v = fromValue + (toValue - fromValue) * f;
          return `'${axis}' ${v}`;
        })
        .join(", ");

      letter.style.fontVariationSettings = settings;
    }

    requestAnimationFrame(raf);
  };

  if (!prefersReducedMotion) requestAnimationFrame(raf);

  targetEl._proximityCleanup = () => {
    window.removeEventListener("mousemove", onMove);
  };
}

// ==========================
// Enhanced Dot Grid Component
// ==========================
class DotGrid {
  constructor(container, options = {}) {
    this.container = container;
    this.options = { 
      ...CONFIG.DOT_GRID, 
      GLOW_EFFECT: true,
      PULSE_ON_HOVER: true,
      TRAIL_EFFECT: true,
      MOUSE_GRAVITY: true,
      GRAVITY_STRENGTH: 0.15,
      ...options 
    };

    this.canvas = document.createElement("canvas");
    this.canvas.className = "dot-grid__canvas";
    this.container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d", { alpha: true });
    this.dots = [];
    this.trailPositions = [];
    this.frameCount = 0;
    this.pointer = {
      x: 0, y: 0,
      vx: 0, vy: 0,
      speed: 0,
      lastTime: 0,
      lastX: 0, lastY: 0,
      isMoving: false
    };

    this.baseRgb = hexToRgb(this.options.BASE_COLOR);
    this.activeRgb = hexToRgb(this.options.ACTIVE_COLOR);

    this.init();
  }

  init() {
    this.buildGrid();
    this.startAnimation();
    this.setupEventListeners();

    const ro = new ResizeObserver(() => this.buildGrid());
    ro.observe(this.container);
  }

  buildGrid() {
    const rect = this.container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);

    const { DOT_SIZE, GAP } = this.options;
    const cell = DOT_SIZE + GAP;
    const cols = Math.floor((rect.width + GAP) / cell);
    const rows = Math.floor((rect.height + GAP) / cell);

    const gridWidth = cell * cols - GAP;
    const gridHeight = cell * rows - GAP;
    const startX = (rect.width - gridWidth) / 2 + DOT_SIZE / 2;
    const startY = (rect.height - gridHeight) / 2 + DOT_SIZE / 2;

    this.dots = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cx = startX + x * cell;
        const cy = startY + y * cell;
        this.dots.push({ 
          cx, 
          cy, 
          xOffset: 0, 
          yOffset: 0, 
          inertiaApplied: false,
          pulsePhase: Math.random() * Math.PI * 2,
          baseSize: DOT_SIZE
        });
      }
    }
  }

  startAnimation() {
    const draw = () => {
      const rect = this.container.getBoundingClientRect();
      this.ctx.clearRect(0, 0, rect.width, rect.height);

      const { x: px, y: py, isMoving } = this.pointer;
      const prox2 = this.options.PROXIMITY ** 2;
      this.frameCount++;

      if (this.options.TRAIL_EFFECT && this.trailPositions.length > 1) {
        this.ctx.globalAlpha = 0.15;
        for (let i = 1; i < this.trailPositions.length; i++) {
          const prev = this.trailPositions[i - 1];
          const curr = this.trailPositions[i];
          const alpha = (1 - i / this.trailPositions.length) * 0.4;
          
          this.ctx.strokeStyle = `rgba(${this.activeRgb.r},${this.activeRgb.g},${this.activeRgb.b},${alpha})`;
          this.ctx.lineWidth = 2;
          this.ctx.beginPath();
          this.ctx.moveTo(prev.x, prev.y);
          this.ctx.lineTo(curr.x, curr.y);
          this.ctx.stroke();
        }
        this.ctx.globalAlpha = 1;
      }

      for (const dot of this.dots) {
        const ox = dot.cx + dot.xOffset;
        const oy = dot.cy + dot.yOffset;

        const dx = dot.cx - px;
        const dy = dot.cy - py;
        const d2 = dx * dx + dy * dy;
        const dist = Math.sqrt(d2);

        let color = this.options.BASE_COLOR;
        let size = dot.baseSize;

        if (d2 <= prox2) {
          const t = 1 - dist / this.options.PROXIMITY;
          const r = Math.round(this.baseRgb.r + (this.activeRgb.r - this.baseRgb.r) * t);
          const g = Math.round(this.baseRgb.g + (this.activeRgb.g - this.baseRgb.g) * t);
          const b = Math.round(this.baseRgb.b + (this.activeRgb.b - this.baseRgb.b) * t);
          color = `rgb(${r},${g},${b})`;

          if (this.options.PULSE_ON_HOVER && isMoving) {
            const pulseAmount = Math.sin(this.frameCount * 0.08 + dot.pulsePhase) * 0.3 + 0.7;
            size = dot.baseSize * (1 + t * 0.4 * pulseAmount);
          }

          if (this.options.GLOW_EFFECT && t > 0.3) {
            this.ctx.shadowBlur = 15 * t;
            this.ctx.shadowColor = color;
          }
        }

        if (this.options.MOUSE_GRAVITY && dist < this.options.PROXIMITY * 1.5 && !dot.inertiaApplied) {
          const gravityForce = (1 - dist / (this.options.PROXIMITY * 1.5)) * this.options.GRAVITY_STRENGTH;
          dot.xOffset += (px - dot.cx) * gravityForce * 0.5;
          dot.yOffset += (py - dot.cy) * gravityForce * 0.5;
          
          dot.xOffset *= 0.92;
          dot.yOffset *= 0.92;
        } else if (!dot.inertiaApplied) {
          const returnSpeed = 0.15;
          dot.xOffset *= (1 - returnSpeed);
          dot.yOffset *= (1 - returnSpeed);
          
          if (Math.abs(dot.xOffset) < 0.01) dot.xOffset = 0;
          if (Math.abs(dot.yOffset) < 0.01) dot.yOffset = 0;
        }

        this.ctx.save();
        this.ctx.translate(ox, oy);
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        this.ctx.restore();
      }

      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);
  }

  setupEventListeners() {
    let movementTimeout;
    const trailLength = 8;

    const onMove = throttle((e) => {
      const now = performance.now();
      const dt = this.pointer.lastTime ? now - this.pointer.lastTime : 16;

      const dx = e.clientX - this.pointer.lastX;
      const dy = e.clientY - this.pointer.lastY;

      let vx = (dx / dt) * 1000;
      let vy = (dy / dt) * 1000;
      let speed = Math.hypot(vx, vy);

      if (speed > this.options.MAX_SPEED) {
        const s = this.options.MAX_SPEED / speed;
        vx *= s; vy *= s; speed = this.options.MAX_SPEED;
      }

      this.pointer.lastTime = now;
      this.pointer.lastX = e.clientX;
      this.pointer.lastY = e.clientY;
      this.pointer.vx = vx;
      this.pointer.vy = vy;
      this.pointer.speed = speed;
      this.pointer.isMoving = true;

      const rect = this.canvas.getBoundingClientRect();
      this.pointer.x = e.clientX - rect.left;
      this.pointer.y = e.clientY - rect.top;

      if (this.options.TRAIL_EFFECT) {
        this.trailPositions.unshift({ x: this.pointer.x, y: this.pointer.y });
        if (this.trailPositions.length > trailLength) {
          this.trailPositions.pop();
        }
      }

      clearTimeout(movementTimeout);
      movementTimeout = setTimeout(() => {
        this.pointer.isMoving = false;
        this.trailPositions = [];
      }, 100);

      if (!prefersReducedMotion) this.applyInertiaToNearbyDots();
    }, 16);

    const onClick = (e) => {
      if (prefersReducedMotion) return;
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.applyShockwave(x, y);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick);
  }

  applyInertiaToNearbyDots() {
    if (!(window.gsap && window.InertiaPlugin)) return;

    const { speed, vx, vy, x, y } = this.pointer;

    for (const dot of this.dots) {
      const dist = Math.hypot(dot.cx - x, dot.cy - y);

      if (speed > this.options.SPEED_TRIGGER && dist < this.options.PROXIMITY && !dot.inertiaApplied) {
        dot.inertiaApplied = true;
        gsap.killTweensOf(dot);

        const pushX = dot.cx - x + vx * 0.005;
        const pushY = dot.cy - y + vy * 0.005;

        gsap.to(dot, {
          inertia: { xOffset: pushX, yOffset: pushY, resistance: this.options.RESISTANCE },
          onComplete: () => {
            gsap.to(dot, {
              xOffset: 0,
              yOffset: 0,
              duration: this.options.RETURN_DURATION,
              ease: "elastic.out(1,0.75)",
              onComplete: () => {
                dot.inertiaApplied = false;
              }
            });
          }
        });
      }
    }
  }

  applyShockwave(clickX, clickY) {
    if (!(window.gsap && window.InertiaPlugin)) return;

    for (const dot of this.dots) {
      const dist = Math.hypot(dot.cx - clickX, dot.cy - clickY);

      if (dist < this.options.SHOCK_RADIUS && !dot.inertiaApplied) {
        dot.inertiaApplied = true;
        gsap.killTweensOf(dot);

        const falloff = Math.max(0, 1 - dist / this.options.SHOCK_RADIUS);
        const angle = Math.atan2(dot.cy - clickY, dot.cx - clickX);
        const pushX = Math.cos(angle) * this.options.SHOCK_STRENGTH * falloff * (50 + Math.random() * 30);
        const pushY = Math.sin(angle) * this.options.SHOCK_STRENGTH * falloff * (50 + Math.random() * 30);

        gsap.to(dot, {
          inertia: { xOffset: pushX, yOffset: pushY, resistance: this.options.RESISTANCE * 1.2 },
          onComplete: () => {
            gsap.to(dot, {
              xOffset: 0,
              yOffset: 0,
              duration: this.options.RETURN_DURATION * 1.2,
              ease: "elastic.out(1,0.65)",
              onComplete: () => {
                dot.inertiaApplied = false;
              }
            });
          }
        });
      }
    }
  }
}

// ==========================
// bubble Menu Component
// ==========================
class BubbleMenu {
  constructor() {
    this.menuToggle = document.getElementById("menu-toggle");
    this.menuOverlay = document.getElementById("menu-overlay");
    this.menuBtn = this.menuToggle?.querySelector(".menu-btn");
    this.menuLinks = document.querySelectorAll(".pill-link");
    this.isOpen = false;
    this.init();
  }

  init() {
    if (!this.menuToggle || !this.menuOverlay || !this.menuBtn) return;

    this.menuToggle.addEventListener("click", () => this.toggle());

    this.menuLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        this.close();
        this.handleSmoothScroll(e, link);
      });

      link.addEventListener("mouseenter", () => {
        const hoverBg = link.dataset.hoverBg;
        const hoverColor = link.dataset.hoverColor;
        if (hoverBg) link.style.background = hoverBg;
        if (hoverColor) link.style.color = hoverColor;
      });

      link.addEventListener("mouseleave", () => {
        link.style.background = "";
        link.style.color = "";
      });
    });
  }

  handleSmoothScroll(e, link) {
    const href = link.getAttribute("href");
    if (href?.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      target?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    }
  }

  toggle() { this.isOpen ? this.close() : this.open(); }

  open() {
    this.isOpen = true;
    this.menuBtn.classList.add("open");
    this.menuBtn.setAttribute("aria-expanded", "true");
    this.menuOverlay.classList.add("active");
    this.menuOverlay.setAttribute("aria-hidden", "false");
  }

  close() {
    this.isOpen = false;
    this.menuBtn.classList.remove("open");
    this.menuBtn.setAttribute("aria-expanded", "false");
    this.menuOverlay.classList.remove("active");
    this.menuOverlay.setAttribute("aria-hidden", "true");
  }
}

// ==========================
// card Swap with Navigation Buttons
// ==========================
class CardSwap {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      verticalDistance: options.verticalDistance ?? CONFIG.CARD_SWAP.VERTICAL_DISTANCE,
      delay: options.delay ?? CONFIG.CARD_SWAP.ROTATION_DELAY
    };

    this.currentIndex = 0;
    this.isRotating = true;
    this.rotationInterval = null;
    this.cards = [
      {
        title: "LMSI Research",
        subtitle: "Summer 2025 Research Internship",
        description: "A dynamic web application featuring real-time data visualization, user authentication, and responsive design.",
        link: "https://github.com",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
      },
      {
        title: "Amazon Data Analysis over Attrition Systems",
        subtitle: "Extern",
        description: "Full-stack e-commerce solution with payment integration, inventory management, and seamless user experience.",
        link: "https://github.com",
        image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop"
      },
      {
        title: "LIDAR-Based Autonomous Boat",
        subtitle: "UI/UX & Component Library",
        description: "Built a real-time navigation system using LIDAR and GIS flow modeling, improving route reliability by 26%.",
        link: "https://github.com",
        image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=600&fit=crop"
      },
      {
        title: "IOT-Based Smart-Water Planter",
        subtitle: "UI/UX & Component Library",
        description: "Engineered an Arduino-based irrigation system with feedback loops, doubling soil moisture consistency.",
        link: "https://github.com",
        image: "https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=800&h=600&fit=crop"
      },
      {
        title: "Portfolio Site",
        subtitle: "UI/UX & Component Library [Work in Progress]",
        description: "Modern portfolio website with interactive elements and smooth animations.",
        link: "https://github.com",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop"
      },
      {
        title: "Arcadia Game",
        subtitle: "Fighting Game [Work in Progress]",
        description: "2D fighting game with custom character mechanics and multiplayer support.",
        link: "https://github.com",
        image: "website/assets/arcadiaprotocol.png"
      }
    ];

    this.init();
  }

  init() {
    this.render();
    this.createNavigationButtons();
    // auto-rotation disabled - users control navigation with arrows
    // if (!prefersReducedMotion) this.startRotation();
    this.setupShuffleButton();
  }

  createNavigationButtons() {
    // create navigation container
    const navContainer = document.createElement('div');
    navContainer.className = 'card-nav-buttons';
    
    // previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'card-nav-btn card-nav-prev';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.setAttribute('aria-label', 'Previous project');
    prevBtn.addEventListener('click', () => this.previous());
    
    // next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'card-nav-btn card-nav-next';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.setAttribute('aria-label', 'Next project');
    nextBtn.addEventListener('click', () => this.next());
    
    navContainer.appendChild(prevBtn);
    navContainer.appendChild(nextBtn);
    
    // insert navigation after the container
    this.container.parentElement.appendChild(navContainer);
  }

  render() {
    this.container.innerHTML = "";
    this.cards.forEach((card, index) => {
      const el = this.createCardElement(card);
      this.container.appendChild(el);
      this.updateCardPosition(el, index);
    });
  }

  createCardElement(card) {
    const el = document.createElement("div");
    el.className = "project__wrapper";
    el.innerHTML = `
      <img src="${card.image}" class="project__img" alt="${card.title}" loading="lazy">
      <div class="project__description">
        <h3 class="project__description--title">${card.title}</h3>
        <h4 class="project__description--sub-title">${card.subtitle}</h4>
        <p class="project__description--paragraph">${card.description}</p>
        <div class="project__description--links">
          <a href="${card.link}" target="_blank" rel="noopener noreferrer" class="project__description--link" aria-label="View on GitHub">
            <i class="fab fa-github" aria-hidden="true"></i>
          </a>
          <a href="${card.link}" target="_blank" rel="noopener noreferrer" class="project__description--link" aria-label="View project">
            <i class="fas fa-link" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    `;
    return el;
  }

  updateCardPosition(cardElement, index) {
    const offset = (index - this.currentIndex + this.cards.length) % this.cards.length;
    const zIndex = this.cards.length - offset;
    const translateY = offset * this.options.verticalDistance;
    const scale = 1 - offset * 0.05;
    const opacity = offset === 0 ? 1 : 0.62;

    cardElement.style.zIndex = zIndex;
    cardElement.style.transform = `translate(-50%, calc(-50% + ${translateY}px)) scale(${scale})`;
    cardElement.style.opacity = opacity;
  }

  startRotation() {
    this.isRotating = true;
    this.rotationInterval = setInterval(() => {
      if (this.isRotating) {
        this.next();
      }
    }, this.options.delay);
  }

  stopRotation() {
    this.isRotating = false;
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
      this.rotationInterval = null;
    }
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.cards.length;
    const els = this.container.querySelectorAll(".project__wrapper");
    els.forEach((el, idx) => this.updateCardPosition(el, idx));
  }

  previous() {
    this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
    const els = this.container.querySelectorAll(".project__wrapper");
    els.forEach((el, idx) => this.updateCardPosition(el, idx));
  }

  shuffle() {
    this.next();
  }

  setupShuffleButton() {
    const shuffleBtn = document.getElementById("shuffle-cards");
    if (shuffleBtn) {
      shuffleBtn.addEventListener("click", () => {
        this.shuffle();
      });
    }
  }
}

// ==========================
// glitch orchestration
// ==========================
function initGlitchInView() {
  const elements = document.querySelectorAll(".reveal-text[data-glitch='inview']");
  if (!elements.length) return;

  const observer = new IntersectionObserver(async (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;

      const el = entry.target;
      if (el.dataset.revealed === "true") {
        observer.unobserve(el);
        continue;
      }

      const revealer = new RevealTextEffect(el);
      await revealer.animate();

      if (el.dataset.proximity === "true") {
        const from = el.dataset.fromVariation ?? "'wght' 420, 'opsz' 18";
        const to = el.dataset.toVariation ?? "'wght' 950, 'opsz' 52";
        const radius = Number(el.dataset.proximityRadius ?? 120);

        enableVariableProximity(el, {
          containerEl: el.parentElement,
          radius,
          falloff: "linear",
          fromSettings: from,
          toSettings: to
        });
      }

      observer.unobserve(el);
    }
  }, { threshold: CONFIG.INTERSECTION_OBSERVER.THRESHOLD });

  elements.forEach(el => observer.observe(el));
}

async function initGlitchOnLoad() {
  const el = document.querySelector(".reveal-text[data-glitch='onload']");
  if (!el) return;

  if (el.dataset.revealed !== "true") {
    const revealer = new RevealTextEffect(el);
    await revealer.animate();
  }

  if (el.dataset.proximity === "true") {
    const from = el.dataset.fromVariation ?? "'wght' 420, 'opsz' 18";
    const to = el.dataset.toVariation ?? "'wght' 950, 'opsz' 52";
    const radius = Number(el.dataset.proximityRadius ?? 120);

    enableVariableProximity(el, {
      containerEl: document.getElementById("hero-container") ?? el.parentElement,
      radius,
      falloff: "linear",
      fromSettings: from,
      toSettings: to
    });
  }
}

// ==========================
// text Type Class
// ==========================
class TextType {
  constructor(el) {
    this.el = el;
    
    try {
      this.texts = JSON.parse(el.dataset.texts || "[]");
    } catch (e) {
      console.error("Failed to parse texts:", e);
      this.texts = [];
    }
    
    this.speed = Number(el.dataset.typingSpeed || 14);
    this.pause = Number(el.dataset.pause || 400);
    
    this.textIndex = 0;
    this.charIndex = 0;

    this.wrapper = document.createElement("div");
    this.wrapper.style.cssText = `
      display: block;
      width: 100%;
      text-align: center;
      max-width: 820px;
      margin: 0 auto;
    `;

    this.content = document.createElement("span");
    this.content.style.cssText = `
      display: inline;
      white-space: pre-wrap;
      word-wrap: break-word;
      font-size: inherit;
      color: inherit;
      line-height: 1.7;
    `;

    this.cursor = document.createElement("span");
    this.cursor.textContent = "|";
    this.cursor.style.cssText = `
      display: inline;
      margin-left: 0.2rem;
      animation: blink 0.7s infinite;
      vertical-align: baseline;
    `;

    this.wrapper.appendChild(this.content);
    this.wrapper.appendChild(this.cursor);

    this.el.innerHTML = "";
    this.el.style.display = "block";
    this.el.appendChild(this.wrapper);

    setTimeout(() => this.type(), 100);
  }

  type() {
    const text = this.texts[this.textIndex];
    
    if (!text) {
      console.warn("No text found at index", this.textIndex);
      return;
    }

    if (this.charIndex < text.length) {
      this.content.textContent += text[this.charIndex++];
      setTimeout(() => this.type(), this.speed);
      return;
    }

    this.textIndex++;

    if (this.textIndex < this.texts.length) {
      this.content.textContent += "\n";
      this.charIndex = 0;
      setTimeout(() => this.type(), this.pause);
    } else {
      setTimeout(() => {
        if (this.cursor && this.cursor.parentNode) {
          this.cursor.remove();
        }
      }, 400);
    }
  }
}

// ==========================
// application Init
// ==========================
document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM loaded, initializing...");
  
  //  dot grid background
  const dotGridContainer = document.getElementById("dot-grid-bg");
  if (dotGridContainer) {
    console.log("Initializing dot grid");
    new DotGrid(dotGridContainer);
  }

  // Menu
  new BubbleMenu();

  // Projects card swap (manual control via button)
  const cardSwapContainer = document.getElementById("card-swap");
  if (cardSwapContainer) {
    console.log("Initializing project card swap");
    new ProjectCardSwap(cardSwapContainer, {
      width: 500,
      height: 400,
      cardDistance: 60,
      verticalDistance: 70,
      pauseOnHover: false,
      skewAmount: 6,
      easing: 'elastic'
    });
  } else {
    console.warn("Card swap container not found!");
  }

  // glitch on load (hero), then enable proximity on that element
  await initGlitchOnLoad();

  // glitch on view for section titles (once)
  initGlitchInView();

  // smooth scrolling for anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (href && href !== "#" && href.startsWith("#")) {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start"
        });
      }
    });
  });

  // text typing effects
  const typeElements = document.querySelectorAll("[data-text-type]");
  console.log("Found typing elements:", typeElements.length);
  
  typeElements.forEach((el, index) => {
    console.log(`Initializing TextType ${index}:`, el);
    new TextType(el);
  });
});