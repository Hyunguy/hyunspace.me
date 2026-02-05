// Project Cards Data
const projectsData = [
    {
    title: "Portfolio Site: HYUNSPACE",
    subtitle: "Personal site built from scratch",
    description: "Modern portfolio website with interactive elements and smooth animations.",
    fullDescription: "My fully custom portfolio website built from scratch featuring interactive 3D elements, smooth GSAP animations, and a unique design system. Includes a 3D circular gallery, animated project cards with manual controls, and a comprehensive tech stack showcase.",
    link: "https://github.com/Hyunguy",
    demo: "",
    image: "assets/thesite.png",
    technologies: ["HTML", "CSS", "JavaScript", "React", "GSAP", "OGL"],
    role: "Frontend Developer & Designer",
    duration: "Ongoing. It's a living site!",
    highlights: [
      "Custom 3D animations and interactions",
      "Fully responsive design",
      "Optimized performance"
    ]
  },
  {
    title: "Amazon Fulfillment Center Operations",
    subtitle: "Intern",
    description: "2-month-long remote Operations Internship involving ML models in SageMaker, strategizing in reducing worker Attritions.",
    fullDescription: "Analyzed employee attrition patterns using advanced data science techniques and machine learning models to identify key factors contributing to employee turnover at Amazon. Developed predictive models and created interactive dashboards for stakeholder presentations.",
    link: "",
    demo: "",
    image: "assets/amazoncert.png",
    technologies: ["Python", "Pandas", "Scikit-learn"],
    role: "Data Analyst Extern",
    duration: "3 months",
    highlights: [
      "Trained a model by analyzing 2,600+ employee record & data sets, reduced process time from a min to 8 seconds.",
      "Enhanced models using Scikit by analoguing common keywords from recently hired AFS workers.",
      "Interviewed Amazon Fulfillment center workers in Colorado, using transcripts and turning data into actionable solutions, reaching metrics of overall 7% lowered attritions in the month of January."
    ]
  },
  {
    title: "Arcadia: Takedown Protocol",
    subtitle: "Fighting Game [Work in Progress]",
    description: "2D fighting game with custom character mechanics and multiplayer support.",
    fullDescription: "A 2D fighting game built from the ground up with custom character mechanics, combo systems, and networked multiplayer functionality. Features input detection, dynamic hitbox system, and planned rollback netcode for smooth online play.",
    link: "https://github.com/Arcadia-Collective-Games",
    demo: "",
    image: "assets/arcadiaprotocol.png",
    technologies: ["C#", "Unity", "Networking", "Game Physics"],
    role: "Game Developer",
    duration: "Ongoing",
    highlights: [
      "Custom physics and collision system",
      "Rollback netcode for online multiplayer",
      "4 unique characters with distinct movesets"
    ]
  },
    {
    title: "Gif to AVIF converter",
    subtitle: "A on-browser convenient converter from GIF to AVIF.",
    description: "A gif to avif converter built in a week, reduces byte size of GIFs by ~95%.",
    fullDescription: "A 2D fighting game built from the ground up with custom character mechanics, combo systems, and networked multiplayer functionality. Features input detection, dynamic hitbox system, and planned rollback netcode for smooth online play.",
    link: "https://github.com/Hyunguy/GIF-to-avif-converter",
    demo: "",
    image: "assets/gif_to_avif.png",
    technologies: ["Node.js#", "Python", "Javascript", "Game Physics"],
    role: "N/A",
    duration: "Complete",
    highlights: [
      "Encodes and checks for alpha color channels in the GIF file",
      "Reduces byte size by 95%",
      "Optimizes resolution and improves bitrate & 16 bit alpha color channels, usable anywhere"
    ]
  },
  {
    title: "Gel-Coat Project for Microprocessors",
    subtitle: "Summer 2025 Research Internship",
    description: "Project: Microhydrogel PAA/PS Coating",
    fullDescription: "Developed a Monte Carlo simulation tool to model process variability and improve experimental repeatability. Supported microhydrogel synthesis using microfluidic systems, contributing to equipment calibration and root-cause investigations. Presented findings during peer reviews and to Army engineers at Picatinny Arsenal, receiving positive feedback.",
    link: "",
    demo: "",
    image: "assets/stevensresearch.png",
    technologies: ["SEM (Scanning Electron Microscope)", "Undergraduate Research"],
    role: "Laboratory Intern",
    duration: "Summer 2025",
    highlights: [
      "Operated the Scanning Electron Microscope to precisely optimize dosage levels in PAA and PS",
      "Modified CASINO module to provide additional confirmation for experimentally proved electron penetrations",
      "Presented to Picatinny Arsenal engineers, where I received insights and positive feedback from senior researchers"
    ]
  },
  {
    title: "LIDAR-Based Autonomous Boat",
    subtitle: "Navigation System",
    description: "Built a real-time navigation system using LIDAR and GIS flow modeling, improving route reliability by 26%.",
    fullDescription: "Engineered an autonomous navigation system for marine vessels using LIDAR sensors and GIS flow modeling. The system processes real-time environmental data to calculate optimal routes while avoiding obstacles, resulting in a 26% improvement in route reliability and safety.",
    link: "",
    demo: "",
    image: "assets/engr112.png",
    technologies: ["C++", "MQTT", "LIDAR", "Circuits", "MQTT"],
    role: "Project Contributor",
    duration: "6 months",
    highlights: [
      "26% improvement in route reliability",
      "Real-time obstacle detection and avoidance",
      "Integration with GIS mapping systems"
    ]
  },
  {
    title: "IOT-Based Smart-Water Planter",
    subtitle: "Arduino Irrigation System",
    description: "Engineered an Arduino-based irrigation system with feedback loops, doubling soil moisture consistency.",
    fullDescription: "Designed and built an intelligent irrigation system using Arduino microcontrollers, soil moisture sensors, and automated water pumps. The system uses feedback control loops to maintain optimal soil moisture levels, resulting in 2x improvement in consistency and 40% water savings.",
    link: "",
    demo: "",
    image: "assets/111.png",
    technologies: ["Arduino", "C++", "IoT Sensors", "Circuits", "MQTT"],
    role: "Project Contributor",
    duration: "5 months",
    highlights: [
      "Increased soil moisture consistency through systematic testing",
      "40% reduction in water usage",
      "Remote monitoring via an MQTT Network, tracking data for analytics"
    ]
  }

];

// card swap Animation Class
class ProjectCardSwap {
  constructor(container, options = {}) {
    this.container = container;
    this.cards = projectsData;
    this.cardElements = [];
    this.currentIndex = 0;
    
    this.options = {
      width: options.width || 500,
      height: options.height || 400,
      cardDistance: options.cardDistance || 60,
      verticalDistance: options.verticalDistance || 70,
      delay: options.delay || 2000,
      pauseOnHover: options.pauseOnHover || false,
      skewAmount: options.skewAmount || 6,
      easing: options.easing || 'elastic'
    };

    this.config = this.options.easing === 'elastic' ? {
      ease: 'elastic.out(0.6,0.9)',
      durDrop: 1.2,
      durMove: 1.2,
      durReturn: 1.2,
      promoteOverlap: 0.9,
      returnDelay: 0.05
    } : {
      ease: 'power1.inOut',
      durDrop: 0.5,
      durMove: 0.5,
      durReturn: 0.5,
      promoteOverlap: 0.45,
      returnDelay: 0.2
    };

    this.order = [];
    this.timeline = null;
    this.interval = null;

    this.init();
  }

  init() {
    this.container.classList.add('card-swap-container');
    this.container.style.width = this.options.width + 'px';
    this.container.style.height = this.options.height + 'px';

    // cards creatiom
    this.cards.forEach((card, index) => {
      const cardEl = this.createCard(card, index);
      this.container.appendChild(cardEl);
      this.cardElements.push(cardEl);
      this.order.push(index);
    });

    // Position cards
    this.cardElements.forEach((el, i) => {
      const slot = this.makeSlot(i);
      this.placeCard(el, slot);
    });

    // don't auto-start animation - wait for button click
    // this.startAnimation();

    // setup hover pause
    if (this.options.pauseOnHover) {
      this.container.addEventListener('mouseenter', () => this.pause());
      this.container.addEventListener('mouseleave', () => this.resume());
    }

    // setup next project button
    const nextBtn = document.getElementById('next-project-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.swap());
    }

    // add keyboard controls for faster navigation
    document.addEventListener('keydown', (e) => {
      const modal = document.getElementById('project-modal');
      if (!modal || !modal.classList.contains('active')) {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          this.swap();
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.swapReverse();
        }
      }
    });
  }

  createCard(card, index) {
    const cardEl = document.createElement('div');
    cardEl.className = 'project-card';
    cardEl.style.width = this.options.width + 'px';
    cardEl.style.height = this.options.height + 'px';
    cardEl.dataset.index = index;

    // conditionally add View Project link only if there's a valid link
    const viewProjectLink = (card.link && card.link !== "" && card.link !== "#") ? `
      <a href="${card.link}" target="_blank" rel="noopener noreferrer" class="card-link" onclick="event.stopPropagation()">
        View Project →
      </a>
    ` : '';

    cardEl.innerHTML = `
      <div class="card-content" style="background-image: url('${card.image}')">
        <div class="card-overlay">
          <h3 class="card-title">${card.title}</h3>
          <p class="card-subtitle">${card.subtitle}</p>
          <p class="card-description">${card.description}</p>
          ${viewProjectLink}
        </div>
      </div>
    `;

    // add click handler to open modal
    cardEl.addEventListener('click', (e) => {
      e.preventDefault();
      this.openModal(card);
    });

    return cardEl;
  }

  openModal(card) {
    const modal = document.getElementById('project-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalDescription = document.getElementById('modal-description');
    const modalDetails = document.getElementById('modal-details');
    const modalTags = document.getElementById('modal-tags');
    const modalLink = document.getElementById('modal-link');
    const modalDemo = document.getElementById('modal-demo');

    // set content
    modalImage.src = card.image;
    modalImage.alt = card.title;
    modalTitle.textContent = card.title;
    modalSubtitle.textContent = card.subtitle;
    modalDescription.textContent = card.fullDescription || card.description;

    // set details
    modalDetails.innerHTML = `
      <div class="detail-item">
        <div class="detail-label">Role</div>
        <div class="detail-value">${card.role || 'Developer'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Duration</div>
        <div class="detail-value">${card.duration || 'N/A'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Status</div>
        <div class="detail-value">${card.subtitle.includes('Work in Progress') ? 'In Progress' : 'Completed'}</div>
      </div>
    `;

    // Set technologies
    if (card.technologies) {
      modalTags.innerHTML = card.technologies.map(tech => 
        `<span class="tag">${tech}</span>`
      ).join('');
    }

    // Set highlights
    if (card.highlights) {
      const highlightsHTML = `
        <div class="detail-item" style="grid-column: 1 / -1;">
          <div class="detail-label">Key Highlights</div>
          <ul style="margin-top: 0.5rem; padding-left: 1.5rem; color: #e2e8f0;">
            ${card.highlights.map(h => `<li style="margin-bottom: 0.5rem;">${h}</li>`).join('')}
          </ul>
        </div>
      `;
      modalDetails.innerHTML += highlightsHTML;
    }

    // set links - conditionally show/hide based on availability
    if (card.link && card.link !== "" && card.link !== "#") {
      modalLink.href = card.link;
      modalLink.style.display = "inline-flex";
    } else {
      modalLink.style.display = "none";
    }
    
    if (card.demo && card.demo !== "" && card.demo !== "#") {
      modalDemo.href = card.demo;
      modalDemo.style.display = "inline-flex";
    } else {
      modalDemo.style.display = "none";
    }

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  makeSlot(i) {
    const total = this.cards.length;
    return {
      x: i * this.options.cardDistance,
      y: -i * this.options.verticalDistance,
      z: -i * this.options.cardDistance * 1.5,
      zIndex: total - i
    };
  }

  placeCard(el, slot) {
    gsap.set(el, {
      x: slot.x,
      y: slot.y,
      z: slot.z,
      xPercent: -50,
      yPercent: -50,
      skewY: this.options.skewAmount,
      transformOrigin: 'center center',
      zIndex: slot.zIndex,
      force3D: true
    });
  }

  swap() {
    if (this.order.length < 2) return;

    const [front, ...rest] = this.order;
    const elFront = this.cardElements[front];

    const tl = gsap.timeline();
    this.timeline = tl;

    // drop front card
    tl.to(elFront, {
      y: '+=500',
      duration: this.config.durDrop,
      ease: this.config.ease
    });

    // Promote other cards
    tl.addLabel('promote', `-=${this.config.durDrop * this.config.promoteOverlap}`);
    rest.forEach((idx, i) => {
      const el = this.cardElements[idx];
      const slot = this.makeSlot(i);
      
      tl.set(el, { zIndex: slot.zIndex }, 'promote');
      tl.to(el, {
        x: slot.x,
        y: slot.y,
        z: slot.z,
        duration: this.config.durMove,
        ease: this.config.ease
      }, `promote+=${i * 0.15}`);
    });

    // return front card to back
    const backSlot = this.makeSlot(this.cards.length - 1);
    tl.addLabel('return', `promote+=${this.config.durMove * this.config.returnDelay}`);
    
    tl.call(() => {
      gsap.set(elFront, { zIndex: backSlot.zIndex });
    }, undefined, 'return');

    tl.to(elFront, {
      x: backSlot.x,
      y: backSlot.y,
      z: backSlot.z,
      duration: this.config.durReturn,
      ease: this.config.ease
    }, 'return');

    tl.call(() => {
      this.order = [...rest, front];
    });
  }

  startAnimation() {
    this.swap();
    this.interval = setInterval(() => this.swap(), this.options.delay);
  }

  swapReverse() {
    if (this.order.length < 2) return;

    const back = this.order[this.order.length - 1];
    const rest = this.order.slice(0, -1);
    const elBack = this.cardElements[back];

    const tl = gsap.timeline();
    this.timeline = tl;

    // demote other cards
    tl.addLabel('demote');
    rest.forEach((idx, i) => {
      const el = this.cardElements[idx];
      const slot = this.makeSlot(i + 1);
      
      tl.set(el, { zIndex: slot.zIndex }, 'demote');
      tl.to(el, {
        x: slot.x,
        y: slot.y,
        z: slot.z,
        duration: this.config.durMove * 0.8,
        ease: this.config.ease
      }, `demote+=${i * 0.1}`);
    });

    // Bring back card to front
    const frontSlot = this.makeSlot(0);
    tl.addLabel('bringFront', 'demote');
    
    tl.call(() => {
      gsap.set(elBack, { zIndex: frontSlot.zIndex });
    }, undefined, 'bringFront');

    tl.to(elBack, {
      x: frontSlot.x,
      y: frontSlot.y,
      z: frontSlot.z,
      duration: this.config.durReturn * 0.8,
      ease: this.config.ease
    }, 'bringFront');

    tl.call(() => {
      this.order = [back, ...rest];
    });
  }

  pause() {
    if (this.timeline) this.timeline.pause();
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  resume() {
    if (this.timeline) this.timeline.play();
    if (!this.interval) {
      this.interval = setInterval(() => this.swap(), this.options.delay);
    }
  }
}

// Modal close handlers
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');

  // Close on button click
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // close on background click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});