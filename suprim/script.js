/* ===================================================================
   ISHAN RAUT - INTERACTIVE SCRIPTS & ANIMATIONS ENGINE
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initParticleBackground();
  initCursorGlow();
  initTypewriter();
  initNavbar();
  initStatsCounter();
  initPortfolioFilters();
  initVideoCarousel();
  initPhotoCarousel();
  initComparisonSlider();
  initScrollAnimations();

  // Escape key closes modals & AI Chat
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const chatWindow = document.getElementById('aiChatWindow');
      if (chatWindow && chatWindow.classList.contains('active')) {
        chatWindow.classList.remove('active');
      }
      closeVideoModal();
      closeImageModal();
    }
  });
});

/* -------------------------------------------------------------------
   1. Dynamic Interactive Particle Network Canvas
   ------------------------------------------------------------------- */
function initParticleBackground() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = window.innerWidth < 768 ? 35 : 75;

  const mouse = {
    x: null,
    y: null,
    radius: 120
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.speedY = (Math.random() - 0.5) * 0.8;
      this.color = Math.random() > 0.4 ? 'rgba(0, 242, 254,' : 'rgba(157, 78, 221,';
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;

      // Mouse interaction
      if (mouse.x != null && mouse.y != null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = (dx / distance) * force * 2;
          const directionY = (dy / distance) * force * 2;
          this.x -= directionX;
          this.y -= directionY;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color} ${this.opacity})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color === 'rgba(0, 242, 254,' ? '#00f2fe' : '#9d4edd';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    const maxDist = 120;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = 1 - dist / maxDist;
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha * 0.15})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animate);
  }

  animate();
}

/* -------------------------------------------------------------------
   2. Glowing Cursor Aura (Desktop)
   ------------------------------------------------------------------- */
function initCursorGlow() {
  const cursorGlow = document.getElementById('cursorGlow');
  if (!cursorGlow || window.innerWidth < 1024) {
    if (cursorGlow) cursorGlow.style.display = 'none';
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderCursor() {
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;
    cursorGlow.style.left = `${currentX}px`;
    cursorGlow.style.top = `${currentY}px`;
    requestAnimationFrame(renderCursor);
  }

  renderCursor();
}

/* -------------------------------------------------------------------
   3. Dynamic Typewriter Effect
   ------------------------------------------------------------------- */
function initTypewriter() {
  const typedTextEl = document.getElementById('typedText');
  if (!typedTextEl) return;

  const roles = [
    'Website Developer',
    'Video & Reel Editor',
    'Photo Manipulation Artist',
    'Concept Developer',
    'Class 9 Creative Mind'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 100;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typedTextEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 50;
    } else {
      typedTextEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 110;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingDelay = 1800; // Pause at full word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingDelay = 400; // Pause before typing new word
    }

    setTimeout(type, typingDelay);
  }

  type();
}

/* -------------------------------------------------------------------
   4. Navbar Scroll Effect & Mobile Menu Toggle
   ------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active Section Tracking
    const sections = document.querySelectorAll('section, header');
    let currentId = '';
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    links.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-active');
      const icon = menuToggle.querySelector('i');
      if (navLinks.classList.contains('mobile-active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    // Close menu when clicking link
    links.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-active');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      });
    });
  }
}

/* -------------------------------------------------------------------
   5. Number Counter Animation for Stats
   ------------------------------------------------------------------- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-num');
  let hasCounted = false;

  function countUp() {
    statNumbers.forEach((stat) => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      let count = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        count += step;
        if (count >= target) {
          stat.textContent = target;
          clearInterval(timer);
        } else {
          stat.textContent = count;
        }
      }, 35);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasCounted) {
        hasCounted = true;
        countUp();
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) observer.observe(statsSection);
}

/* -------------------------------------------------------------------
   6. Portfolio Filter Tabs
   ------------------------------------------------------------------- */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* -------------------------------------------------------------------
   7. Auto-Sliding Video & Photo Carousels Engine ("Aafai Slide Hunchha")
   ------------------------------------------------------------------- */
function setupAutoCarousel(options) {
  const {
    trackId,
    slidesSelector,
    dotsSelector,
    prevBtnId,
    nextBtnId,
    toggleBtnId,
    progressFillId,
    viewportId,
    intervalMs = 4200
  } = options;

  const track = document.getElementById(trackId);
  const slides = document.querySelectorAll(slidesSelector);
  const dots = document.querySelectorAll(dotsSelector);
  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);
  const toggleBtn = document.getElementById(toggleBtnId);
  const progressFill = document.getElementById(progressFillId);
  const viewport = document.getElementById(viewportId);

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let isAutoplayActive = true;
  let isHovered = false;
  let progress = 0;
  let progressInterval = null;
  const updateTick = 40; // ms per tick

  function getStep() {
    if (slides.length === 0) return 0;
    const cardRect = slides[0].getBoundingClientRect();
    const computedGap = parseFloat(window.getComputedStyle(track).gap) || 24;
    return cardRect.width + computedGap;
  }

  function updateSlide(newIndex) {
    currentIndex = (newIndex + totalSlides) % totalSlides;
    
    // Multi-card step translation
    const step = getStep();
    const maxScroll = Math.max(0, track.scrollWidth - viewport.clientWidth);
    const targetOffset = currentIndex * step;
    const finalOffset = Math.min(targetOffset, maxScroll);

    track.style.transform = `translateX(-${finalOffset}px)`;

    slides.forEach((slide, idx) => {
      slide.classList.toggle('active-slide', idx === currentIndex);
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });

    resetProgress();
  }

  function resetProgress() {
    progress = 0;
    if (progressFill) progressFill.style.width = '0%';
  }

  function startProgress() {
    clearInterval(progressInterval);
    progressInterval = setInterval(() => {
      if (isAutoplayActive && !isHovered) {
        progress += (updateTick / intervalMs) * 100;
        if (progressFill) progressFill.style.width = `${Math.min(progress, 100)}%`;

        if (progress >= 100) {
          updateSlide(currentIndex + 1);
        }
      }
    }, updateTick);
  }

  // Next / Prev button triggers
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateSlide(currentIndex + 1);
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateSlide(currentIndex - 1);
    });
  }

  // Dots navigation
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      updateSlide(idx);
    });
  });

  // Toggle button (Pause / Play auto-slide)
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isAutoplayActive = !isAutoplayActive;
      const icon = toggleBtn.querySelector('i');
      const text = toggleBtn.querySelector('.auto-txt');

      if (isAutoplayActive) {
        toggleBtn.classList.remove('paused');
        if (icon) icon.className = 'fa-solid fa-pause';
        if (text) text.textContent = 'Auto-Slide';
      } else {
        toggleBtn.classList.add('paused');
        if (icon) icon.className = 'fa-solid fa-play';
        if (text) text.textContent = 'Paused';
        resetProgress();
      }
    });
  }

  // Hover & Touch Pause
  if (viewport) {
    viewport.addEventListener('mouseenter', () => { isHovered = true; });
    viewport.addEventListener('mouseleave', () => { isHovered = false; });
    viewport.addEventListener('touchstart', () => { isHovered = true; }, { passive: true });
    viewport.addEventListener('touchend', () => {
      setTimeout(() => { isHovered = false; }, 800);
    }, { passive: true });
  }

  // Resize listener to re-align sideways cards
  window.addEventListener('resize', () => {
    updateSlide(currentIndex);
  });

  updateSlide(0);
  startProgress();
}

function initVideoCarousel() {
  setupAutoCarousel({
    trackId: 'videoCarouselTrack',
    slidesSelector: '#videoCarouselTrack .sideways-card',
    dotsSelector: '#videoSliderDots .slider-dot',
    prevBtnId: 'videoPrevBtn',
    nextBtnId: 'videoNextBtn',
    toggleBtnId: 'videoAutoplayToggle',
    progressFillId: 'videoProgressFill',
    viewportId: 'videoCarouselViewport',
    intervalMs: 4500
  });
}

function initPhotoCarousel() {
  setupAutoCarousel({
    trackId: 'photoCarouselTrack',
    slidesSelector: '#photoCarouselTrack .sideways-card',
    dotsSelector: '#photoSliderDots .slider-dot',
    prevBtnId: 'photoPrevBtn',
    nextBtnId: 'photoNextBtn',
    toggleBtnId: 'photoAutoplayToggle',
    progressFillId: 'photoProgressFill',
    viewportId: 'photoCarouselViewport',
    intervalMs: 4000
  });
}

/* -------------------------------------------------------------------
   8. Interactive Before & After Comparison Slider (With Auto-Scan)
   ------------------------------------------------------------------- */
let autoScanActive = true;
let autoScanPosition = 50;
let autoScanDirection = 1;
let autoScanRaf = null;

function initComparisonSlider() {
  const slider = document.getElementById('comparisonSlider');
  const afterLayer = document.getElementById('afterLayer');
  const divider = document.getElementById('sliderDivider');

  if (!slider || !afterLayer || !divider) return;

  let isDragging = false;

  function moveSlider(clientX) {
    const rect = slider.getBoundingClientRect();
    let position = ((clientX - rect.left) / rect.width) * 100;

    if (position < 0) position = 0;
    if (position > 100) position = 100;

    afterLayer.style.width = `${position}%`;
    divider.style.left = `${position}%`;
  }

  // Auto-Scan Loop (Ping-Pong from 18% to 82%)
  function runAutoScan() {
    if (autoScanActive && !isDragging) {
      autoScanPosition += 0.28 * autoScanDirection;
      if (autoScanPosition >= 82) {
        autoScanPosition = 82;
        autoScanDirection = -1;
      } else if (autoScanPosition <= 18) {
        autoScanPosition = 18;
        autoScanDirection = 1;
      }
      afterLayer.style.width = `${autoScanPosition}%`;
      divider.style.left = `${autoScanPosition}%`;
    }
    autoScanRaf = requestAnimationFrame(runAutoScan);
  }

  runAutoScan();

  // Mouse drag events
  divider.addEventListener('mousedown', () => {
    isDragging = true;
    pauseAutoScanTemporary();
  });
  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    pauseAutoScanTemporary();
    moveSlider(e.clientX);
  });

  window.addEventListener('mouseup', () => (isDragging = false));
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    moveSlider(e.clientX);
  });

  // Touch drag events for mobile
  slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    pauseAutoScanTemporary();
    moveSlider(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => (isDragging = false));
  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    moveSlider(e.touches[0].clientX);
  }, { passive: true });
}

function pauseAutoScanTemporary() {
  autoScanActive = false;
  updateAutoScanButtonUI(false);
}

function toggleBeforeAfterAutoScan() {
  autoScanActive = !autoScanActive;
  updateAutoScanButtonUI(autoScanActive);
}

function updateAutoScanButtonUI(isActive) {
  const btn = document.getElementById('autoScanToggle');
  if (!btn) return;

  if (isActive) {
    btn.classList.add('active');
    btn.innerHTML = '<i class="fa-solid fa-play"></i> <span id="autoScanText">Auto-Slide: ON</span>';
  } else {
    btn.classList.remove('active');
    btn.innerHTML = '<i class="fa-solid fa-pause"></i> <span id="autoScanText">Auto-Slide: PAUSED</span>';
  }
}

/* -------------------------------------------------------------------
   8. Simulated Video Modal & Animated Canvas Player
   ------------------------------------------------------------------- */
let videoAnimationId = null;
let isSimulatedPlaying = true;
let videoProgress = 0.5;

function openVideoModal(type) {
  const modal = document.getElementById('videoModal');
  const title = document.getElementById('modalVideoTitle');
  const desc = document.getElementById('modalVideoDesc');
  const canvas = document.getElementById('videoCanvas');

  if (type === 'skater') {
    title.textContent = 'Urban Skater Velocity & Speed Ramp (60fps)';
    desc.textContent = 'Human skater tricks with speed ramp velocity mapping, bass-drop camera shakes, motion blur optical flow, and warm street grading.';
  } else if (type === 'dancer') {
    title.textContent = 'Cyberpunk Rain Dancer Beat-Sync Velocity';
    desc.textContent = 'Human dancer in rain with cyan/magenta neon reflections, beat-matched water splash sound design, and impact glitch transitions.';
  } else if (type === 'athlete') {
    title.textContent = 'Rooftop Athlete Sunset Sprint & Lens Flare';
    desc.textContent = 'Human athlete sprinting into sunset with dynamic zoom punches, warm golden hour flares, and motivational acoustic pacing.';
  } else if (type === 'fashion') {
    title.textContent = 'Studio Fashion Model Neon Lighting Edit';
    desc.textContent = 'High-fashion model posing with RGB chromatic aberration splits, rim glow masks, and smooth modern reel transitions.';
  } else if (type === 'gaming') {
    title.textContent = 'Competitive Gaming Velocity Montage (60fps)';
    desc.textContent = 'Sniper reload Foley timing, heavy bass drop syncs, 3D text tracking, and viral Shorts/TikTok pacing.';
  } else {
    title.textContent = 'Cinematic Human Velocity Edit (60fps)';
    desc.textContent = 'Hand-crafted velocity pacing, sound effects, and color grading edited by Ishan Raut.';
  }

  modal.classList.add('active');
  startVideoSimulation(type);
}

function closeVideoModal() {
  const modal = document.getElementById('videoModal');
  modal.classList.remove('active');
  if (videoAnimationId) cancelAnimationFrame(videoAnimationId);
}

function closeModalOnOverlay(e, modalId) {
  if (e.target.id === modalId) {
    if (modalId === 'videoModal') closeVideoModal();
    if (modalId === 'imageModal') closeImageModal();
  }
}

function startVideoSimulation(type) {
  const canvas = document.getElementById('videoCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let frame = 0;
  isSimulatedPlaying = true;
  document.getElementById('playPauseBtn').innerHTML = '<i class="fa-solid fa-pause"></i>';

  function renderVideoFrame() {
    if (!isSimulatedPlaying) return;

    frame++;
    ctx.fillStyle = '#06070c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dynamic grid or visualizer bars
    if (type === 'cyberpunk') {
      // Cyber Neon Waves
      ctx.lineWidth = 3;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(0, 242, 254, 0.8)' : 'rgba(255, 42, 133, 0.8)';
        ctx.shadowBlur = 15;
        ctx.shadowColor = i % 2 === 0 ? '#00f2fe' : '#ff2a85';
        for (let x = 0; x < canvas.width; x += 8) {
          const y = canvas.height / 2 + Math.sin((x + frame * 4 + i * 40) * 0.02) * (30 + i * 10);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Center Beat Pulse
      const pulseSize = 40 + Math.sin(frame * 0.1) * 15;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 42, 133, 0.2)';
      ctx.fill();
      ctx.strokeStyle = '#ff2a85';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Text watermark
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px "Space Grotesk", sans-serif';
      ctx.fillText('EDITED BY ISHAN RAUT // BEAT-SYNC VELOCITY', 25, 40);
      ctx.fillStyle = '#00f2fe';
      ctx.font = '12px "Space Grotesk", sans-serif';
      ctx.fillText('REC ● 60 FPS UHD // @mr.leofc', 25, 62);
    } else {
      // Cinematic Warm Sunset Wave
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#ff7e5f');
      grad.addColorStop(0.6, '#feb47b');
      grad.addColorStop(1, '#0b0c10');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sun
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height * 0.45, 60, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.shadowBlur = 50;
      ctx.shadowColor = '#ffe259';
      ctx.fill();

      // Birds / cinematic silhouettes
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#111';
      ctx.font = 'bold 16px "Space Grotesk", sans-serif';
      ctx.fillText('CINEMATIC COLOR GRADE // ISHAN RAUT', 25, 40);
    }

    // Update simulated timeline
    videoProgress = ((frame % 300) / 300) * 100;
    const timelineFill = document.getElementById('timelineFill');
    if (timelineFill) timelineFill.style.width = `${videoProgress}%`;

    const sec = Math.floor((videoProgress / 100) * 15);
    const timeDisplay = document.getElementById('timeDisplay');
    if (timeDisplay) timeDisplay.textContent = `00:${sec < 10 ? '0' + sec : sec} / 00:15`;

    videoAnimationId = requestAnimationFrame(renderVideoFrame);
  }

  renderVideoFrame();
}

function toggleSimulatedPlay() {
  isSimulatedPlaying = !isSimulatedPlaying;
  const btn = document.getElementById('playPauseBtn');
  if (isSimulatedPlaying) {
    btn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    const title = document.getElementById('modalVideoTitle').textContent;
    startVideoSimulation(title.includes('Cyberpunk') ? 'cyberpunk' : 'nature');
  } else {
    btn.innerHTML = '<i class="fa-solid fa-play"></i>';
    if (videoAnimationId) cancelAnimationFrame(videoAnimationId);
  }
}

/* -------------------------------------------------------------------
   9. Photo Artwork Inspector Modal
   ------------------------------------------------------------------- */
function openImageModal(type) {
  const modal = document.getElementById('imageModal');
  const title = document.getElementById('modalImageTitle');
  const desc = document.getElementById('modalImageDesc');
  const canvas = document.getElementById('lightboxImgCanvas');

  if (type === 'ak-graphics') {
    title.textContent = 'AK Graphics - Dark Apocalyptic Gate & Chair Manipulation';
    desc.textContent = 'High-end composite manipulation by Ishan Raut featuring an apocalyptic fiery atmosphere, burning gate, gothic gargoyles, skull gatekeeper, and 3D metallic typography.';
    canvas.innerHTML = `
      <img src="file:///C:/Users/ISWORRAUT/.gemini/antigravity/brain/d60eb69d-12ce-4cc9-b6f7-212d9fab784c/.user_uploaded/media_1792144205824_19fe6353.jpg" 
           onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=95';"
           style="width: 100%; height: 100%; object-fit: contain; border-radius: 12px; background: #070913;" 
           alt="Dark Apocalyptic Gate Manipulation by Ishan Raut" />
    `;
  } else if (type === 'birthday-stencil') {
    title.textContent = 'Happy Birthday Brother - Fiery Stencil Poster Graphic';
    desc.textContent = 'Distressed stencil typography with flying fire sparks, dynamic lens flares, dramatic red-orange haze, and cinematic poster aesthetics designed by Ishan Raut.';
    canvas.innerHTML = `
      <img src="file:///C:/Users/ISWORRAUT/.gemini/antigravity/brain/d60eb69d-12ce-4cc9-b6f7-212d9fab784c/.user_uploaded/media_1792144240049_fd11d1d0.jpg" 
           onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=95';"
           style="width: 100%; height: 100%; object-fit: contain; border-radius: 12px; background: #070913;" 
           alt="Fiery Stencil Birthday Poster by Ishan Raut" />
    `;
  } else if (type === 'cyber-samurai' || type === 'human-cyberpunk') {
    title.textContent = 'Cyberpunk Neon Street Character Art';
    desc.textContent = 'Dual-tone magenta and cyan rim light synthesis, wet ground reflections, atmospheric smoke grading, and moody cinematic portrait isolation.';
    canvas.innerHTML = `
      <img src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=95" 
           style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px; filter: contrast(1.15) saturate(1.3);" 
           alt="Cyberpunk Character Art by Ishan Raut" />
    `;
  } else if (type === 'thumb-viral' || type === 'human-reaction') {
    title.textContent = 'High-CTR 3D Extruded Gaming Banner';
    desc.textContent = 'Engineered for viral clickability with 3D extruded metallic typography, high contrast, and directional lighting flares.';
    canvas.innerHTML = `
      <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=95" 
           style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px; filter: contrast(1.2) saturate(1.35);" 
           alt="High-CTR Gaming Banner by Ishan Raut" />
    `;
  } else if (type === 'fantasy-island' || type === 'landscape-art') {
    title.textContent = 'Surreal Floating Island & Sky Composite';
    desc.textContent = 'Multi-layered mountain rock blending, mystical waterfall gravity effects, cloud depth, and fantasy atmospheric lighting.';
    canvas.innerHTML = `
      <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=95" 
           style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px; filter: contrast(1.1) saturate(1.2);" 
           alt="Surreal Floating Island by Ishan Raut" />
    `;
  } else {
    title.textContent = 'Studio Human Portrait Frequency Separation';
    desc.textContent = 'High-end portrait retouching preserving natural skin pores, contour dodge & burn, catchlight eye reflection enhancement, and clean tonal grade.';
    canvas.innerHTML = `
      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=95" 
           style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;" 
           alt="Artwork by Ishan Raut" />
    `;
  }

  modal.classList.add('active');
}

function closeImageModal() {
  const modal = document.getElementById('imageModal');
  modal.classList.remove('active');
}

/* -------------------------------------------------------------------
   10. Form Submission & Direct Action Handler
   ------------------------------------------------------------------- */
function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const service = document.getElementById('service').value;
  const message = document.getElementById('message').value;
  const status = document.getElementById('formStatus');
  const btn = document.getElementById('submitBtn');

  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Message...';
  btn.disabled = true;

  setTimeout(() => {
    status.className = 'form-status success';
    status.innerHTML = `
      <strong>Message Prepared!</strong> Thank you ${name}. Opening your email client to send to <strong>rsuprim18@gmail.com</strong>...
      <br><small style="color: #cbd5e1; margin-top: 4px; display: inline-block;">Or chat directly with Ishan on WhatsApp: <strong>9807341822</strong></small>
    `;

    // Construct mailto
    const mailtoUrl = `mailto:rsuprim18@gmail.com?subject=${encodeURIComponent('Project Inquiry: ' + service)}&body=${encodeURIComponent('Hello Ishan,\n\nName: ' + name + '\nContact: ' + email + '\nService: ' + service + '\n\nMessage:\n' + message)}`;
    window.location.href = mailtoUrl;

    btn.innerHTML = '<span>Message Sent!</span> <i class="fa-solid fa-check"></i>';
    btn.disabled = false;
  }, 1000);
}

/* -------------------------------------------------------------------
   11. Scroll Reveal Animations
   ------------------------------------------------------------------- */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.skill-category-card, .project-card, .pillar-card, .contact-card').forEach((el) => {
    observer.observe(el);
  });
}

/* -------------------------------------------------------------------
   12. Profile Photo Fallback & Custom Upload Engine
   ------------------------------------------------------------------- */
// Check for persisted custom photo
const savedPhoto = localStorage.getItem('ishan_custom_profile_photo');
if (savedPhoto) {
  const heroImg = document.getElementById('heroProfileImg');
  if (heroImg) heroImg.src = savedPhoto;
}

function loadProfileFallback(img) {
  if (!img.dataset.step) {
    img.dataset.step = '1';
    // First fallback: Direct absolute URI from user workspace
    img.src = 'file:///C:/Users/ISWORRAUT/.gemini/antigravity/brain/d60eb69d-12ce-4cc9-b6f7-212d9fab784c/.user_uploaded/media_1792123007489_c64d3ca3.jpg';
  } else if (img.dataset.step === '1') {
    img.dataset.step = '2';
    // Second fallback: Online high-res creative avatar
    img.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
  } else {
    img.onerror = null;
  }
}

function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const dataUrl = event.target.result;
    const heroImg = document.getElementById('heroProfileImg');
    if (heroImg) {
      heroImg.src = dataUrl;
      localStorage.setItem('ishan_custom_profile_photo', dataUrl);
    }
  };
  reader.readAsDataURL(file);
}

/* ===================================================================
   13. INTELLIGENT AI VIRTUAL ASSISTANT ENGINE (ISHAN AI)
   =================================================================== */
function toggleAIChat() {
  const chatWindow = document.getElementById('aiChatWindow');
  if (!chatWindow) return;

  const isActive = chatWindow.classList.toggle('active');
  if (isActive) {
    const input = document.getElementById('aiChatInput');
    if (input) setTimeout(() => input.focus(), 200);
  }
}

function clearAIChat() {
  const messagesContainer = document.getElementById('aiChatMessages');
  if (!messagesContainer) return;

  messagesContainer.innerHTML = `
    <div class="chat-msg ai-msg">
      <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
      <div class="msg-bubble">
        <p>Chat history cleared! ✨ I'm <strong>Ishan's AI Assistant</strong>. Ask me anything about Ishan's video editing, websites, photo retouching, or any general topic you want!</p>
        <span class="msg-time">Just now</span>
      </div>
    </div>
  `;
}

function sendQuickPrompt(promptText) {
  const input = document.getElementById('aiChatInput');
  if (!input) return;
  input.value = promptText;
  handleAIChatSubmit(new Event('submit'));
}

function handleAIChatSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const input = document.getElementById('aiChatInput');
  const messagesContainer = document.getElementById('aiChatMessages');
  const typingIndicator = document.getElementById('aiTypingIndicator');

  if (!input || !messagesContainer) return;
  const userText = input.value.trim();
  if (!userText) return;

  // Add User Message
  appendChatMessage(userText, 'user');
  input.value = '';

  // Show typing indicator
  if (typingIndicator) typingIndicator.style.display = 'flex';
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Simulate intelligent response delay
  const typingDelay = Math.min(800 + userText.length * 8, 1400);

  setTimeout(() => {
    if (typingIndicator) typingIndicator.style.display = 'none';
    const aiReply = generateAIResponse(userText);
    appendChatMessage(aiReply, 'ai');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, typingDelay);
}

function appendChatMessage(text, sender) {
  const messagesContainer = document.getElementById('aiChatMessages');
  if (!messagesContainer) return;

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${sender}-msg`;

  if (sender === 'ai') {
    msgDiv.innerHTML = `
      <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
      <div class="msg-bubble">
        ${formatAIMessage(text)}
        <span class="msg-time">${timeStr}</span>
      </div>
    `;
  } else {
    msgDiv.innerHTML = `
      <div class="msg-bubble">
        <p>${escapeHTML(text)}</p>
        <span class="msg-time">${timeStr}</span>
      </div>
    `;
  }

  messagesContainer.appendChild(msgDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function formatAIMessage(text) {
  // Simple markdown converter (bold, links, linebreaks, lists)
  let formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #00f2fe; text-decoration: underline;">$1</a>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n- /g, '<br>• ')
    .replace(/\n/g, '<br>');

  return `<p>${formatted}</p>`;
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

/* ===================================================================
   KNOWLEDGE BASE & GENERAL INTELLIGENCE PROCESSOR
   =================================================================== */
function generateAIResponse(query) {
  const q = query.toLowerCase().trim();

  // 1. Math calculation handler (e.g., 25 * 4, 100 / 2, 50 + 30)
  const mathRegex = /^[\d\s\+\-\*\/\(\)\.\^]+$/;
  if (mathRegex.test(q) && /[+\-*\/^]/.test(q)) {
    try {
      const sanitized = q.replace(/\^/g, '**');
      const result = Function(`'use strict'; return (${sanitized})`)();
      if (!isNaN(result) && isFinite(result)) {
        return `The answer is **${result}** 🧮`;
      }
    } catch (err) {}
  }

  // 2. Who is Ishan Raut? / About Ishan / Nepali queries
  if (q.includes('who is ishan') || q.includes('who are you') || q.includes('about ishan') || q.includes('who is he') || q.includes('tell me about') || q.includes('ishan ko ho') || q.includes('ko ho ishan')) {
    return "Hi! **Ishan Raut** is a passionate young creative and developer studying in **Class 9 at Paradise English Boarding School** in Nepal. 🇳🇵\n\nHis primary creative and technical pillars are:\n- 💻 **Website Development:** Ultra-responsive animated websites with canvas effects & glassmorphism.\n- 🎬 **Video & Reel Editing:** High-energy 60fps velocity speed ramping, beat matching, and sound design.\n- 📸 **Photo Retouching & Composite Manipulation:** Frequency separation skin texture, apocalyptic composites, and high-CTR YouTube banners.\n- 💡 **Concept Development:** Script hooks and engagement framing for digital media.\n\nYou can connect with Ishan on Instagram **[@mr.leofc](https://www.instagram.com/mr.leofc/)** or call/WhatsApp at **9807341822**!";
  }

  // 3. School & Grade / Nepali school queries
  if (q.includes('school') || q.includes('class') || q.includes('grade') || q.includes('study') || q.includes('paradise') || q.includes('kun school') || q.includes('padhcha')) {
    return "Ishan Raut studies in **Class 9** at **Paradise English Boarding School**. He balances his academic curriculum with learning advanced web technologies, video editing, and digital graphics!";
  }

  // 4. Contact / Instagram / Email / Phone / WhatsApp / Nepali contact
  if (q.includes('contact') || q.includes('instagram') || q.includes('insta') || q.includes('phone') || q.includes('email') || q.includes('whatsapp') || q.includes('call') || q.includes('number') || q.includes('samparka') || q.includes('kura garne')) {
    return "Here are Ishan's verified direct contact channels:\n\n- 📸 **Instagram:** [@mr.leofc](https://www.instagram.com/mr.leofc/) *(Direct profile link — click to open!)*\n- ✉️ **Email:** [rsuprim18@gmail.com](mailto:rsuprim18@gmail.com)\n- 📞 **Phone:** [+977 9807341822](tel:9807341822)\n- 💬 **WhatsApp:** [Chat on WhatsApp (9807341822)](https://wa.me/9779807341822)\n\nYou can reach out anytime for collaborations, projects, or questions!";
  }

  // 5. Video Editing Services & Details
  if (q.includes('video') || q.includes('reel') || q.includes('velocity') || q.includes('tiktok') || q.includes('capcut') || q.includes('premiere') || q.includes('editing') || q.includes('video kasari')) {
    return "🎬 **Ishan's Video Editing Mastery:**\n\n- **Velocity & Speed Ramping:** Smooth optical flow curves synced to music drops.\n- **Acoustic Sound Design:** Layered audio with swooshes, impacts, and custom foley.\n- **Human-Crafted Edits:** Real creative touch with speed manipulation, cinematic framing, and rhythm rather than generic auto-templates.\n- **Color Grading:** Custom LUTs, neon cyberpunk hues, and warm sunset tones.\n- **Software:** CapCut Pro, Adobe Premiere Pro, and After Effects.";
  }

  // 6. Photo Editing & Artwork
  if (q.includes('photo') || q.includes('photoshop') || q.includes('thumbnail') || q.includes('retouch') || q.includes('lightroom') || q.includes('skin') || q.includes('poster') || q.includes('art') || q.includes('photo kasari')) {
    return "📸 **Ishan's Photo Manipulation & Retouching:**\n\n- **Composite Artwork:** Like his featured *AK Graphics Apocalyptic Gate* and *Fiery Stencil Poster* artwork shown in the gallery!\n- **Frequency Separation:** Smooth retouching that keeps genuine human skin pores intact.\n- **High-CTR YouTube Graphics:** Bold 3D typography, directional lighting, and vibrant contrasts.\n- **Tools:** Adobe Photoshop, Lightroom, and digital blending techniques.";
  }

  // 7. Web Development & Coding
  if (q.includes('website') || q.includes('web dev') || q.includes('html') || q.includes('css') || q.includes('javascript') || q.includes('coding') || q.includes('developer') || q.includes('site banaune')) {
    return "💻 **Ishan's Web Development Architecture:**\n\n- **Frontend Stack:** Semantic HTML5, CSS3 Grid & Flexbox, JavaScript (ES6+).\n- **Features:** Canvas constellation particle network, sideways auto-sliding multi-card carousels, responsive mobile architecture, and intelligent AI assistance.\n- **Design Language:** Cyber modern glassmorphism with neon accents.";
  }

  // 8. Hiring, Pricing & Rates
  if (q.includes('hire') || q.includes('price') || q.includes('rate') || q.includes('cost') || q.includes('order') || q.includes('how much') || q.includes('project') || q.includes('paiso') || q.includes('kaam gari')) {
    return "💰 **Hire & Collaborate with Ishan:**\n\nIshan is available for freelance projects:\n- **Instagram Reels / Shorts:** Quick turnaround with velocity cuts.\n- **Photo Posters & Thumbnails:** Ultra-high resolution.\n- **Websites:** Custom responsive portfolios and landing pages.\n\nSend a message on Instagram **[@mr.leofc](https://www.instagram.com/mr.leofc/)** or WhatsApp **9807341822** for quick quotes!";
  }

  // 9. Greetings & Conversational Nepali
  if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('namaste') || q.includes('k cha') || q.includes('kasto cha') || q.includes('sanchai') || q.includes('sup')) {
    return "Namaste! 🙏 Welcome to Ishan Raut's portfolio website. Sanchai hunuhunchha? (Hope you are doing great!) How can I help you today? Feel free to ask anything about Ishan's work, tech, editing, or general questions!";
  }

  // 10. General Coding Help
  if (q.includes('center a div') || q.includes('center div')) {
    return "To center a div easily with **Flexbox**:\n```css\n.parent {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n```\nOr with **CSS Grid**:\n```css\n.parent {\n  display: grid;\n  place-items: center;\n}\n```";
  }

  // 11. General Video Advice
  if (q.includes('aspect ratio') || q.includes('resolution')) {
    return "Recommended resolutions:\n- **9:16 (1080 x 1920):** Vertical video for Instagram Reels, YouTube Shorts, TikTok.\n- **16:9 (1920 x 1080 or 3840 x 2160 4K):** Horizontal widescreen for YouTube & films.\n- **1:1 (1080 x 1080):** Square posts for social feeds.";
  }

  // 12. General Knowledge: Nepal Trivia
  if (q.includes('nepal') || q.includes('everest') || q.includes('sagarmatha') || q.includes('capital')) {
    return "Nepal 🇳🇵 is home to **Mount Everest (Sagarmatha)** at 8,848.86m, with **Kathmandu** as its capital. It is also the birthplace of Lord Buddha (Lumbini). Ishan Raut is proud to represent creative young talent from Nepal!";
  }

  // 13. General Knowledge: Technology & AI
  if (q.includes('what is ai') || q.includes('artificial intelligence') || q.includes('machine learning')) {
    return "🤖 **Artificial Intelligence (AI)** refers to computer systems capable of performing tasks that typically require human intelligence — such as visual perception, language understanding, decision making, and problem solving!";
  }

  // 14. Fallback for any general query
  return `That's a great question! I can help you with anything related to **Ishan Raut's** works (Class 9 at Paradise English Boarding School, web developer, video & photo editor), or assist with:

- 🎬 **Video Editing Tips:** Velocity curves, beat sync, and software guidance.
- 📸 **Photo Retouching:** Photoshop manipulation, poster effects, and thumbnail design.
- 💻 **Web Development:** Coding modern websites with HTML, CSS & JavaScript.
- 📱 **Direct Contacts:** Instagram [@mr.leofc](https://www.instagram.com/mr.leofc/) or WhatsApp **9807341822**!

What would you like to explore next?`;
}

