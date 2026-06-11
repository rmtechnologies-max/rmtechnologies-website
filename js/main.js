/* ═══════════════════════════════════════
   RM TECHNOLOGIES - MAIN JS
   rmtechnologies.in
═══════════════════════════════════════ */

'use strict';

// ── LOADER ──
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1800);
});

// ── AOS INIT ──
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
    });
  }

  initNavbar();
  initHamburger();
  initBackToTop();
  initCounters();
  initActiveNav();
  initParticles();
  initTypingEffect();
});

// ── NAVBAR SCROLL ──
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// ── HAMBURGER MENU ──
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
    }
  });
}

// ── BACK TO TOP ──
function initBackToTop() {
  const btn = document.getElementById('backTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── ACTIVE NAV LINK ──
function initActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ── COUNTER ANIMATION ──
function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  const prefix = el.getAttribute('data-prefix') || '';
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = prefix + Math.floor(current).toLocaleString('en-IN') + (suffix ? suffix : (target >= 1000 ? '+' : ''));
  }, 16);
}

// ── PARTICLES CANVAS ──
function initParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    opacity: 0.5;
  `;
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;

  function resize() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  function Particle() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '0, 212, 255' : '255, 107, 53';
  }

  Particle.prototype.update = function () {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  };

  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
    ctx.fill();
  };

  function initParticleArray() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 15000);
    for (let i = 0; i < Math.min(count, 80); i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    animFrame = requestAnimationFrame(animate);
  }

  resize();
  initParticleArray();
  animate();

  window.addEventListener('resize', () => {
    resize();
    initParticleArray();
  });
}

// ── TYPING EFFECT ──
function initTypingEffect() {
  const el = document.querySelector('.hero-title .gradient-text');
  if (!el) return;

  const words = ['Data', 'Insights', 'Pipelines', 'Analytics'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let pause = false;

  function type() {
    if (pause) return;

    const word = words[wordIndex];

    if (!isDeleting) {
      el.textContent = word.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === word.length) {
        pause = true;
        setTimeout(() => { pause = false; isDeleting = true; }, 1800);
      }
    } else {
      el.textContent = word.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }

    setTimeout(type, isDeleting ? 60 : 100);
  }

  // Start after loader
  setTimeout(type, 2000);
}

// ── SMOOTH SCROLL for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── PORTFOLIO FILTER (for portfolio.html) ──
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card[data-category]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
          card.style.animation = 'fadeUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ── FORM HANDLER ──
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('[type="submit"]');
    const successMsg = document.getElementById('formSuccess');
    const errorMsg = document.getElementById('formError');

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        if (successMsg) {
          successMsg.classList.add('success');
          successMsg.style.display = 'flex';
        }
        setTimeout(() => {
          if (successMsg) successMsg.style.display = 'none';
        }, 5000);
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      if (errorMsg) {
        errorMsg.classList.add('error');
        errorMsg.style.display = 'flex';
      }
      setTimeout(() => {
        if (errorMsg) errorMsg.style.display = 'none';
      }, 5000);
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    }
  });
}

// ── CAREER FORM ──
function initCareerForm() {
  const form = document.getElementById('careerForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('[type="submit"]');
    const successMsg = document.getElementById('careerSuccess');

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        if (successMsg) {
          successMsg.style.display = 'flex';
          successMsg.classList.add('success');
        }
      } else {
        throw new Error('error');
      }
    } catch {
      alert('Something went wrong. Please email us at careers@rmtechnologies.in');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Application';
    }
  });
}

// ── CARD HOVER GLOW ──
document.querySelectorAll('.service-card, .project-card, .why-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(0,212,255,0.06), var(--card-bg) 60%)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

// ── INIT PAGE SPECIFIC ──
document.addEventListener('DOMContentLoaded', () => {
  initPortfolioFilter();
  initContactForm();
  initCareerForm();
});

// ── SCROLL REVEAL (fallback if AOS not loaded) ──
if (typeof AOS === 'undefined') {
  const revealEls = document.querySelectorAll('[data-aos]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
  });
}

console.log('%c RM Technologies ', 
  'background: linear-gradient(135deg, #00D4FF, #0066FF); color: white; padding: 8px 16px; border-radius: 4px; font-weight: bold; font-size: 14px;'
);
console.log('%c Enterprise Tech Solutions | rmtechnologies.in ', 
  'color: #00D4FF; font-size: 11px;'
);
// Blog Post Click Handler - Coming Soon
document.querySelectorAll('.bp-card, .blog-card').forEach(card => {
  card.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Create popup
    const popup = document.createElement('div');
    popup.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(10,22,40,0.9); backdrop-filter: blur(10px);
      display: flex; align-items: center; justify-content: center;
      z-index: 9999; animation: fadeIn 0.3s ease;
    `;
    
    popup.innerHTML = `
      <div style="
        background: #0D2137; border: 1px solid rgba(0,212,255,0.3);
        border-radius: 16px; padding: 40px; text-align: center;
        max-width: 420px; width: 90%; position: relative;
      ">
        <div style="font-size: 3rem; margin-bottom: 16px;">📝</div>
        <h3 style="font-family: 'Poppins',sans-serif; font-size: 1.3rem; font-weight: 800; margin-bottom: 10px;">
          Article Coming Soon!
        </h3>
        <p style="color: #94A3B8; font-size: 0.9rem; line-height: 1.7; margin-bottom: 24px;">
          Our engineering team is writing this article. Subscribe to our newsletter to get notified when it's published.
        </p>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <a href="contact.html" style="
            display: inline-flex; align-items: center; gap: 8px;
            background: linear-gradient(135deg, #00D4FF, #0066FF);
            color: white; padding: 10px 20px; border-radius: 8px;
            font-weight: 600; font-size: 0.85rem; text-decoration: none;
          ">
            <i class="fa-solid fa-envelope"></i> Contact Us
          </a>
          <button onclick="this.closest('div').closest('div').remove()" style="
            display: inline-flex; align-items: center; gap: 8px;
            background: transparent; color: #94A3B8; padding: 10px 20px;
            border-radius: 8px; font-weight: 600; font-size: 0.85rem;
            border: 1px solid rgba(255,255,255,0.2); cursor: pointer;
          ">
            <i class="fa-solid fa-xmark"></i> Close
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(popup);
    
    // Close on background click
    popup.addEventListener('click', function(ev) {
      if (ev.target === popup) popup.remove();
    });
    
    // Close on Escape
    document.addEventListener('keydown', function handler(ev) {
      if (ev.key === 'Escape') {
        popup.remove();
        document.removeEventListener('keydown', handler);
      }
    });
  });
});

// Featured blog read button
document.querySelectorAll('.bf-content .btn-primary, .blog-featured .btn-primary').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    // Trigger same popup
    document.querySelector('.bp-card')?.click();
  });
});
