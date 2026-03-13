/* ===================================
   MY LIFE AQUARIUM & PETS — SCRIPTS
   Mobile-First | Lightweight
   =================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------ DOM References ------ */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbClose = document.getElementById('lightboxClose');
  const lbPrev = document.getElementById('lightboxPrev');
  const lbNext = document.getElementById('lightboxNext');


  /* ===================================
     1. Navbar scroll effect
     =================================== */
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 50);
    lastScroll = scrollY;
  }, { passive: true });

  /* ===================================
     2. Mobile menu toggle
     =================================== */
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  /* ===================================
     3. Smooth scroll for anchor links
     =================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  /* ===================================
     4. Active nav link highlighting
     =================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

  function updateActiveLink() {
    const scrollPos = window.scrollY + navbar.offsetHeight + 80;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ===================================
     5. Gallery Lightbox
     =================================== */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const gallerySrcs = [];
  let currentIndex = 0;

  if (galleryItems.length > 0) {
    galleryItems.forEach((item, i) => {
      gallerySrcs.push(item.querySelector('img').src);
      item.addEventListener('click', () => openLightbox(i));
    });

    function openLightbox(index) {
      currentIndex = index;
      lbImg.src = gallerySrcs[currentIndex];
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function nextImage() {
      currentIndex = (currentIndex + 1) % gallerySrcs.length;
      lbImg.src = gallerySrcs[currentIndex];
    }

    function prevImage() {
      currentIndex = (currentIndex - 1 + gallerySrcs.length) % gallerySrcs.length;
      lbImg.src = gallerySrcs[currentIndex];
    }

    lbClose.addEventListener('click', closeLightbox);
    lbNext.addEventListener('click', nextImage);
    lbPrev.addEventListener('click', prevImage);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    });

    // Touch swipe for lightbox
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? prevImage() : nextImage();
      }
    }, { passive: true });
  }



  /* ===================================
     6. Scroll Reveal Animations
     =================================== */
  const reveals = document.querySelectorAll('.reveal');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => revealObserver.observe(el));

  /* ===================================
     7. Contact Form Handler
     =================================== */
  const form = document.getElementById('enquiryForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !phone || !message) {
      showToast('Please fill all fields', 'error');
      return;
    }

    // Build WhatsApp message
    const waMessage = encodeURIComponent(
      `Hi! I'm ${name}.\nPhone: ${phone}\n\n${message}`
    );
    const waUrl = `https://wa.me/919876543210?text=${waMessage}`;

    // Show success toast
    showToast('Redirecting to WhatsApp...', 'success');

    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 600);

    form.reset();
  });

  /* ===================================
     8. Toast Notification
     =================================== */
  function showToast(message, type = 'success') {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      padding: .75rem 1.5rem;
      border-radius: 10px;
      font-size: .9rem;
      font-weight: 600;
      color: #fff;
      z-index: 3000;
      animation: toastIn .4s ease forwards;
      background: ${type === 'success' ? '#25D366' : '#FF4757'};
      box-shadow: 0 4px 20px rgba(0,0,0,.2);
    `;

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(-10px)';
      toast.style.transition = '.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  /* ===================================
     9. Lazy loading / Performance
     =================================== */
  // Native lazy loading is used via HTML attributes.
  // Additional: mark hero image as "eager" for LCP.

  /* ===================================
     10. Counter animation for stats (optional enhancement)
     =================================== */
  // Currently not used but can be added.

});

/* ------ Toast keyframe (injected once) ------ */
const style = document.createElement('style');
style.textContent = `
  @keyframes toastIn {
    from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
`;
document.head.appendChild(style);
