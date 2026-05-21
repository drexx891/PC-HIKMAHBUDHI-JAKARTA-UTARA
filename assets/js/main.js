/* ============================================================
   PC HIKMAHBUDHI JAKARTA UTARA — Main JavaScript
   Full interaction clone from hikmahbudhi.co.id
   (WOW.js + Owl Carousel + CounterUp + MeanMenu + Beakai main.js)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================
     1. PRELOADER (like Beakai theme)
     ========================================================== */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.classList.add('loaded');
      setTimeout(() => { preloader.style.display = 'none'; }, 600);
    });
    // Fallback: hide after 4s even if load hasn't fired
    setTimeout(() => {
      if (preloader) {
        preloader.classList.add('loaded');
        setTimeout(() => { preloader.style.display = 'none'; }, 600);
      }
    }, 4000);
  }

  /* ==========================================================
     2. STICKY HEADER (Beakai-style: show on scroll up, hide on scroll down)
     ========================================================== */
  const header = document.getElementById('sticky-header');
  let lastScrollY = 0;
  let headerHeight = header ? header.offsetHeight : 80;
  let ticking = false;

  function updateSticky() {
    const scrollY = window.scrollY;

    if (scrollY > headerHeight + 200) {
      header.classList.add('sticky');
      // Hide on scroll down, show on scroll up
      if (scrollY > lastScrollY && scrollY > 400) {
        header.classList.add('header-hide');
      } else {
        header.classList.remove('header-hide');
      }
    } else {
      header.classList.remove('sticky');
      header.classList.remove('header-hide');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateSticky);
      ticking = true;
    }
  }, { passive: true });

  /* ==========================================================
     3. HERO SLIDER (Owl Carousel style)
     ========================================================== */
  const slider = document.querySelector('.hero-slider');
  if (slider) {
    const slides = slider.querySelectorAll('.hero-slide');
    const dotsContainer = slider.querySelector('.slider-dots');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    let currentSlide = 0;
    let slideInterval;
    const SLIDE_DURATION = 6000;

    // Create dots
    if (dotsContainer) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      });
    }

    function goToSlide(index) {
      slides[currentSlide].classList.remove('active');
      slides[currentSlide].classList.add('exit');
      
      const dots = dotsContainer?.querySelectorAll('.slider-dot');
      if (dots) dots[currentSlide]?.classList.remove('active');

      currentSlide = index;
      
      slides[currentSlide].classList.remove('exit');
      slides[currentSlide].classList.add('active');
      if (dots) dots[currentSlide]?.classList.add('active');

      // Re-trigger content animations
      const content = slides[currentSlide].querySelector('.hero-content');
      if (content) {
        content.classList.remove('animate-in');
        void content.offsetWidth; // force reflow
        content.classList.add('animate-in');
      }

      // Clean exit class after transition
      setTimeout(() => {
        slides.forEach(s => s.classList.remove('exit'));
      }, 800);
    }

    function nextSlide() {
      goToSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
      goToSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    function startAutoPlay() {
      slideInterval = setInterval(nextSlide, SLIDE_DURATION);
    }

    function stopAutoPlay() {
      clearInterval(slideInterval);
    }

    if (slides.length > 1) {
      prevBtn?.addEventListener('click', () => { stopAutoPlay(); prevSlide(); startAutoPlay(); });
      nextBtn?.addEventListener('click', () => { stopAutoPlay(); nextSlide(); startAutoPlay(); });
      startAutoPlay();

      // Pause on hover
      slider.addEventListener('mouseenter', stopAutoPlay);
      slider.addEventListener('mouseleave', startAutoPlay);

      // Swipe support for mobile
      let touchStartX = 0;
      let touchEndX = 0;
      slider.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
      slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          stopAutoPlay();
          if (diff > 0) nextSlide(); else prevSlide();
          startAutoPlay();
        }
      }, { passive: true });
    }

    // Initial animation
    const firstContent = slides[0]?.querySelector('.hero-content');
    if (firstContent) {
      setTimeout(() => firstContent.classList.add('animate-in'), 300);
    }
  }

  /* ==========================================================
     4. HERO PARALLAX ON SCROLL
     ========================================================== */
  const heroSection = document.querySelector('.hero-slider, .hero-section');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroH = heroSection.offsetHeight;
      if (scrollY < heroH) {
        const parallaxSpeed = 0.4;
        const overlayImgs = heroSection.querySelectorAll('.hero-slide, .hero-section');
        overlayImgs.forEach(el => {
          el.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
        });
        // Shapes parallax
        heroSection.querySelectorAll('.shape').forEach((shape, i) => {
          const speed = 0.15 + (i * 0.08);
          shape.style.transform = `translateY(${scrollY * speed}px)`;
        });
      }
    }, { passive: true });
  }

  /* ==========================================================
     5. SCROLL TO TOP (jQuery scrollUp style)
     ========================================================== */
  const scrollBtn = document.getElementById('scrollUp');
  
  function handleScrollBtn() {
    if (window.scrollY > 400) {
      scrollBtn?.classList.add('visible');
    } else {
      scrollBtn?.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', handleScrollBtn, { passive: true });

  scrollBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ==========================================================
     6. MOBILE SIDEBAR (MeanMenu + MetisMenu style)
     ========================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileSidebar = document.getElementById('mobile-sidebar');
  const closeBtn = document.getElementById('close-sidebar');
  const overlay = document.getElementById('overlay');

  function openSidebar() {
    mobileSidebar?.classList.add('active');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Stagger-animate menu items
    const items = mobileSidebar?.querySelectorAll('.mobile-menu > li');
    items?.forEach((item, i) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(30px)';
      setTimeout(() => {
        item.style.transition = 'all .3s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      }, 80 + i * 50);
    });
  }

  function closeSidebar() {
    mobileSidebar?.classList.remove('active');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileToggle?.addEventListener('click', openSidebar);
  closeBtn?.addEventListener('click', closeSidebar);
  overlay?.addEventListener('click', closeSidebar);

  // ESC key closes sidebar
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSidebar();
      closeSearch();
    }
  });

  /* Mobile submenu accordion (MetisMenu style) */
  document.querySelectorAll('.toggle-sub').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parent = btn.closest('li');
      const sub = parent.querySelector('.mobile-sub');

      // Close other open submenus (accordion behavior)
      document.querySelectorAll('.mobile-menu > li.open').forEach(li => {
        if (li !== parent) {
          li.classList.remove('open');
          const otherSub = li.querySelector('.mobile-sub');
          if (otherSub) {
            otherSub.style.maxHeight = '0';
          }
        }
      });

      parent.classList.toggle('open');
      if (sub) {
        if (parent.classList.contains('open')) {
          sub.style.maxHeight = sub.scrollHeight + 'px';
        } else {
          sub.style.maxHeight = '0';
        }
      }

      // Rotate icon
      const icon = btn.querySelector('i');
      if (icon) {
        icon.style.transform = parent.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0)';
      }
    });
  });

  /* ==========================================================
     7. SEARCH OVERLAY (Beakai search modal)
     ========================================================== */
  const searchOpen = document.getElementById('search-open');
  const searchWrap = document.getElementById('search-wrap');
  const searchClose = document.getElementById('search-close');
  const searchInput = document.querySelector('.main-search-input');

  function openSearch() {
    searchWrap?.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput?.focus(), 400);
  }

  function closeSearch() {
    searchWrap?.classList.remove('active');
    document.body.style.overflow = '';
  }

  searchOpen?.addEventListener('click', (e) => { e.preventDefault(); openSearch(); });
  searchClose?.addEventListener('click', closeSearch);
  searchWrap?.addEventListener('click', (e) => {
    if (e.target === searchWrap) closeSearch();
  });

  /* ==========================================================
     8. WOW.js-STYLE SCROLL REVEAL ANIMATIONS
     ========================================================== */
  const wowElements = document.querySelectorAll('[data-wow]');
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

  // WOW-style observer
  const wowObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const animation = el.getAttribute('data-wow') || 'fadeInUp';
        const delay = el.getAttribute('data-wow-delay') || '0s';
        const duration = el.getAttribute('data-wow-duration') || '.8s';

        el.style.animationDelay = delay;
        el.style.animationDuration = duration;
        el.classList.add('wow-animated', `animate-${animation}`);
        wowObserver.unobserve(el);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  wowElements.forEach(el => wowObserver.observe(el));

  // Simple reveal observer
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ==========================================================
     9. COUNTER UP ANIMATION (jQuery CounterUp style with easing)
     ========================================================== */
  const counters = document.querySelectorAll('.count[data-target]');
  let counterAnimated = false;

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function animateCounters() {
    if (counterAnimated) return;
    counterAnimated = true;

    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2500;
      let startTime = null;

      function update(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);
        const currentVal = Math.floor(easedProgress * target);

        counter.textContent = currentVal + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target + suffix;
        }
      }
      requestAnimationFrame(update);
    });
  }

  const statsSection = document.getElementById('stats-section');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    statsObserver.observe(statsSection);
  }

  /* ==========================================================
     10. SMOOTH ANCHOR SCROLL (with offset for sticky header)
     ========================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        closeSidebar();
        const offset = header ? header.offsetHeight + 10 : 90;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ==========================================================
     11. ACTIVE NAV LINK HIGHLIGHT ON SCROLL (spy scroll)
     ========================================================== */
  const sections = document.querySelectorAll('section[id]');
  function highlightNav() {
    const scrollY = window.scrollY + 150;
    let activeFound = false;

    // Loop from bottom to top to find the last section in view
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll('.main-menu > li').forEach(li => li.classList.remove('active'));
        const link = document.querySelector(`.main-menu a[href="#${id}"]`);
        link?.closest('li')?.classList.add('active');
        activeFound = true;
        break;
      }
    }

    // If at top, highlight first
    if (!activeFound && window.scrollY < 200) {
      document.querySelectorAll('.main-menu > li').forEach(li => li.classList.remove('active'));
      document.querySelector('.main-menu > li:first-child')?.classList.add('active');
    }
  }
  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ==========================================================
     12. BUTTON RIPPLE EFFECT (like material design)
     ========================================================== */
  document.querySelectorAll('.bt-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('btn-ripple');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* ==========================================================
     13. CARD TILT / HOVER EFFECTS (subtle 3D tilt on service cards)
     ========================================================== */
  document.querySelectorAll('.service-card, .news-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'all .5s cubic-bezier(.4, 0, .2, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });

  /* ==========================================================
     14. IMAGE HOVER OVERLAY (news card image glow)
     ========================================================== */
  document.querySelectorAll('.news-card .card-img').forEach(imgWrap => {
    imgWrap.addEventListener('mousemove', (e) => {
      const rect = imgWrap.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      imgWrap.style.setProperty('--glow-x', x + '%');
      imgWrap.style.setProperty('--glow-y', y + '%');
    });
  });

  /* ==========================================================
     15. FOOTER LINK HOVER ANIMATION (slide-in effect)
     ========================================================== */
  document.querySelectorAll('.footer-links li a, .footer-contact li').forEach(el => {
    el.addEventListener('mouseenter', function() {
      this.style.transition = 'all .3s cubic-bezier(.4, 0, .2, 1)';
    });
  });

  /* ==========================================================
     16. TOP BAR HIDE ON SCROLL (like original)
     ========================================================== */
  const topBar = document.querySelector('.top-bar');
  if (topBar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        topBar.classList.add('top-bar-hidden');
      } else {
        topBar.classList.remove('top-bar-hidden');
      }
    }, { passive: true });
  }

  /* ==========================================================
     17. STAT ITEM ICON BOUNCE ON HOVER
     ========================================================== */
  document.querySelectorAll('.stat-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      const icon = item.querySelector('i');
      if (icon) {
        icon.classList.add('bounce');
        icon.addEventListener('animationend', () => icon.classList.remove('bounce'), { once: true });
      }
    });
  });

  /* ==========================================================
     18. FEATURE LIST ITEM ANIMATIONS (stagger on scroll)
     ========================================================== */
  const featureList = document.querySelector('.feature-list');
  if (featureList) {
    const featureObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('li');
          items.forEach((item, i) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            setTimeout(() => {
              item.style.transition = 'all .4s cubic-bezier(.4, 0, .2, 1)';
              item.style.opacity = '1';
              item.style.transform = 'translateX(0)';
            }, 200 + i * 120);
          });
          featureObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    featureObserver.observe(featureList);
  }

  /* ==========================================================
     19. EXPERIENCE BADGE PULSE ANIMATION
     ========================================================== */
  const expBadge = document.querySelector('.experience-badge');
  if (expBadge) {
    const badgeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          expBadge.classList.add('pulse-in');
          badgeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    badgeObserver.observe(expBadge);
  }

  /* ==========================================================
     20. NAVBAR DROPDOWN KEYBOARD ACCESSIBILITY
     ========================================================== */
  document.querySelectorAll('.main-menu > li.has-dropdown > a').forEach(link => {
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const subMenu = link.nextElementSibling;
        if (subMenu) {
          const isVisible = subMenu.style.opacity === '1';
          subMenu.style.opacity = isVisible ? '0' : '1';
          subMenu.style.visibility = isVisible ? 'hidden' : 'visible';
          subMenu.style.transform = isVisible ? 'translateY(15px)' : 'translateY(0)';
        }
      }
    });
  });

});
