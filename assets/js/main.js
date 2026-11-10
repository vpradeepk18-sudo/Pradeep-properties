/**
 * PRADEEP HOUSING AND PROPERTIES — SHARED VANILLA JAVASCRIPT
 * Handles:
 *  1. Sticky Header State, Mobile Navigation Drawer & Smooth-Scroll Active Section Spy
 *  2. Horizontal Swipeable Image Galleries with Pagination Indicators
 *  3. Fullscreen Lightbox / Full-View Modal on Tap/Click
 *  4. 3-Field Contact Form Validation & Pre-filled WhatsApp Message
 *  5. Dynamic Copyright Year
 */

(function () {
  'use strict';

  var WHATSAPP_NUMBER = '916369109409';
  var DEFAULT_WHATSAPP_MESSAGE =
    'Hi Sir, I came across your real estate and construction business and viewed your property projects. I am interested in knowing more about them. Could we discuss the details?';

  /* ==========================================================================
     1. STICKY HEADER, MOBILE NAVIGATION MENU & SMOOTH SCROLL ACTIVE LINK SPY
     ========================================================================== */
  function initNavigation() {
    var header = document.querySelector('.site-header');
    var toggleBtn = document.getElementById('mobile-menu-toggle');
    var drawer = document.getElementById('mobile-nav-drawer');

    function closeMenu() {
      if (!toggleBtn || !drawer) return;
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', 'Open navigation menu');
      drawer.classList.remove('is-open');
    }

    function openMenu() {
      if (!toggleBtn || !drawer) return;
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.setAttribute('aria-label', 'Close navigation menu');
      drawer.classList.add('is-open');
    }

    if (toggleBtn && drawer) {
      toggleBtn.addEventListener('click', function () {
        var isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      var mobileLinks = drawer.querySelectorAll('a');
      Array.prototype.forEach.call(mobileLinks, function (link) {
        link.addEventListener('click', function () {
          closeMenu();
        });
      });

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && drawer.classList.contains('is-open')) {
          closeMenu();
          toggleBtn.focus();
        }
      });

      document.addEventListener('click', function (event) {
        if (
          drawer.classList.contains('is-open') &&
          !drawer.contains(event.target) &&
          !toggleBtn.contains(event.target)
        ) {
          closeMenu();
        }
      });
    }

    // Active section tracking & sticky header elevation on scroll
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link[href^="#"], .mobile-nav-link[href^="#"]');
    var allAnchorLinks = document.querySelectorAll('a[href^="#"]');
    var isManualScrolling = false;
    var manualScrollTimeout = null;

    function setActiveLink(currentId) {
      if (!currentId) return;
      Array.prototype.forEach.call(navLinks, function (link) {
        var href = link.getAttribute('href');
        if (href === '#' + currentId) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
      });
    }

    // Handle immediate active state & click feedback on any link pointing to a section
    Array.prototype.forEach.call(allAnchorLinks, function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
          var targetId = href.substring(1);
          var targetSection = document.getElementById(targetId);
          if (targetSection) {
            e.preventDefault();

            // 1. Instant visual active mark in the menu bar
            setActiveLink(targetId);

            // 2. Micro-interaction press animation on the clicked element
            link.classList.add('is-clicked');
            setTimeout(function () {
              link.classList.remove('is-clicked');
            }, 300);

            // 3. Close mobile drawer if open
            if (drawer && drawer.classList.contains('is-open')) {
              closeMenu();
            }

            // 4. Lock active state during smooth scroll (prevents scroll spy from reverting prematurely)
            isManualScrolling = true;
            if (manualScrollTimeout) clearTimeout(manualScrollTimeout);

            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

            manualScrollTimeout = setTimeout(function () {
              isManualScrolling = false;
              onScrollUpdate();
            }, 1000);
          }
        }
      });
    });

    function onScrollUpdate() {
      if (header) {
        if (window.scrollY > 10) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
      }

      if (isManualScrolling) return;

      if (sections.length && navLinks.length) {
        var headerHeight = header ? header.offsetHeight : 72;
        // Trigger threshold: 30% of viewport below header so sections highlight as soon as they enter view
        var triggerOffset = headerHeight + Math.min(220, window.innerHeight * 0.3);
        var scrollPos = window.scrollY + triggerOffset;
        var currentId = sections[0].getAttribute('id');

        Array.prototype.forEach.call(sections, function (sec) {
          var top = sec.offsetTop;
          if (top <= scrollPos) {
            currentId = sec.getAttribute('id');
          }
        });

        // Bottom of page check: highlight the last section (Contact)
        if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60)) {
          var lastSection = sections[sections.length - 1];
          if (lastSection) currentId = lastSection.getAttribute('id');
        }

        setActiveLink(currentId);
      }
    }

    window.addEventListener('scroll', onScrollUpdate, { passive: true });
    onScrollUpdate();
  }

  /* ==========================================================================
     2. HORIZONTAL SWIPEABLE GALLERIES & PAGINATION DOTS
     ========================================================================== */
  function initSwipeGalleries() {
    var galleries = document.querySelectorAll('[data-swipe-gallery]');

    Array.prototype.forEach.call(galleries, function (gallery) {
      var track = gallery.querySelector('.swipe-track');
      var slides = gallery.querySelectorAll('.swipe-slide');
      var dots = gallery.querySelectorAll('.swipe-dot');
      var prevBtn = gallery.querySelector('[data-swipe-prev]');
      var nextBtn = gallery.querySelector('[data-swipe-next]');

      if (!track || !slides.length) return;

      var activeIndex = 0;

      function setActiveDot(index) {
        activeIndex = Math.max(0, Math.min(slides.length - 1, index));
        Array.prototype.forEach.call(dots, function (dot, idx) {
          if (idx === activeIndex) {
            dot.classList.add('active');
            dot.setAttribute('aria-current', 'true');
          } else {
            dot.classList.remove('active');
            dot.removeAttribute('aria-current');
          }
        });
      }

      function scrollToSlide(index) {
        var targetIndex = Math.max(0, Math.min(slides.length - 1, index));
        var slideWidth = track.clientWidth;
        track.scrollTo({
          left: targetIndex * slideWidth,
          behavior: 'smooth'
        });
        setActiveDot(targetIndex);
      }

      track.addEventListener('scroll', function () {
        var slideWidth = track.clientWidth;
        if (slideWidth <= 0) return;
        var newIndex = Math.round(track.scrollLeft / slideWidth);
        setActiveDot(newIndex);
      }, { passive: true });

      Array.prototype.forEach.call(dots, function (dot, idx) {
        dot.addEventListener('click', function () {
          scrollToSlide(idx);
        });
      });

      if (prevBtn) {
        prevBtn.addEventListener('click', function () {
          var nextIdx = activeIndex > 0 ? activeIndex - 1 : slides.length - 1;
          scrollToSlide(nextIdx);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', function () {
          var nextIdx = activeIndex < slides.length - 1 ? activeIndex + 1 : 0;
          scrollToSlide(nextIdx);
        });
      }
    });
  }

  /* ==========================================================================
     3. IMAGE LIGHTBOX / FULL-VIEW MODAL ON CLICK
     ========================================================================== */
  function initImageLightbox() {
    var modal = document.getElementById('image-lightbox-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'image-lightbox-modal';
      modal.className = 'image-lightbox';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', 'Full size image viewer');
      modal.innerHTML =
        '<div class="lightbox-overlay" data-lightbox-close></div>' +
        '<div class="lightbox-dialog">' +
        '  <button type="button" class="lightbox-close-btn" data-lightbox-close aria-label="Close full size view">&times;</button>' +
        '  <div class="lightbox-img-wrapper">' +
        '    <img class="lightbox-img" src="" alt="Full size image view" />' +
        '  </div>' +
        '  <div class="lightbox-caption"></div>' +
        '</div>';
      document.body.appendChild(modal);
    }

    var lightboxImg = modal.querySelector('.lightbox-img');
    var lightboxCaption = modal.querySelector('.lightbox-caption');

    function openLightbox(src, alt) {
      if (!lightboxImg || !src) return;
      lightboxImg.src = src;
      lightboxImg.alt = alt || 'Full size property image';
      if (lightboxCaption) {
        lightboxCaption.textContent = alt || '';
      }
      modal.classList.add('is-open');
      document.body.classList.add('lightbox-open');
    }

    function closeLightbox() {
      modal.classList.remove('is-open');
      document.body.classList.remove('lightbox-open');
      if (lightboxImg) {
        lightboxImg.src = '';
      }
    }

    modal.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-lightbox-close') || e.target.closest('[data-lightbox-close]')) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeLightbox();
      }
    });

    // Attach click listener to all gallery images
    var galleryImgs = document.querySelectorAll('.swipe-slide-media img');
    Array.prototype.forEach.call(galleryImgs, function (img) {
      img.style.cursor = 'zoom-in';
      img.setAttribute('title', 'Click to view full image without cropping');
      img.addEventListener('click', function () {
        openLightbox(img.getAttribute('src'), img.getAttribute('alt'));
      });
    });
  }

  /* ==========================================================================
     4. 3-FIELD CONTACT FORM VALIDATION & WHATSAPP MESSAGE BUILDER
     ========================================================================== */
  function validateContactFields(values) {
    var errors = {};
    var name = (values.name || '').trim();
    var phone = (values.phone || '').trim();
    var message = (values.message || '').trim();

    if (!name || name.length < 2) {
      errors.name = 'Please enter your name.';
    }

    var digitsOnly = phone.replace(/\D/g, '');
    if (!phone || digitsOnly.length < 10 || digitsOnly.length > 13) {
      errors.phone = 'Please enter a valid 10-digit phone number.';
    }

    if (!message || message.length < 3) {
      errors.message = 'Please enter your message.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors: errors
    };
  }

  function buildWhatsAppEnquiryUrl(values) {
    var lines = [
      DEFAULT_WHATSAPP_MESSAGE,
      '',
      'Name: ' + values.name.trim(),
      'Phone: ' + values.phone.trim(),
      'Message: ' + values.message.trim()
    ];
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
  }

  function initWhatsAppDefaultLinks() {
    var defaultUrl =
      'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE);
    var floatingLinks = document.querySelectorAll('.floating-whatsapp');
    Array.prototype.forEach.call(floatingLinks, function (link) {
      link.setAttribute('href', defaultUrl);
    });
  }

  function initContactForm() {
    var form = document.getElementById('whatsapp-contact-form');
    if (!form) return;

    var nameInput = document.getElementById('contact-name');
    var phoneInput = document.getElementById('contact-phone');
    var messageInput = document.getElementById('contact-message');

    var nameError = document.getElementById('error-contact-name');
    var phoneError = document.getElementById('error-contact-phone');
    var messageError = document.getElementById('error-contact-message');

    var statusBox = document.getElementById('contact-form-status');
    var statusLink = document.getElementById('contact-whatsapp-direct-link');

    function setFieldState(inputEl, errorEl, errorMessage) {
      if (!inputEl || !errorEl) return;
      if (errorMessage) {
        inputEl.classList.add('is-invalid');
        inputEl.setAttribute('aria-invalid', 'true');
        errorEl.textContent = errorMessage;
        errorEl.classList.add('is-visible');
      } else {
        inputEl.classList.remove('is-invalid');
        inputEl.setAttribute('aria-invalid', 'false');
        errorEl.textContent = '';
        errorEl.classList.remove('is-visible');
      }
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var values = {
        name: nameInput ? nameInput.value : '',
        phone: phoneInput ? phoneInput.value : '',
        message: messageInput ? messageInput.value : ''
      };

      var result = validateContactFields(values);

      setFieldState(nameInput, nameError, result.errors.name || '');
      setFieldState(phoneInput, phoneError, result.errors.phone || '');
      setFieldState(messageInput, messageError, result.errors.message || '');

      if (!result.isValid) {
        if (statusBox) {
          statusBox.classList.remove('is-visible');
        }
        if (result.errors.name && nameInput) nameInput.focus();
        else if (result.errors.phone && phoneInput) phoneInput.focus();
        else if (result.errors.message && messageInput) messageInput.focus();
        return;
      }

      var whatsappUrl = buildWhatsAppEnquiryUrl(values);

      if (statusLink) {
        statusLink.setAttribute('href', whatsappUrl);
      }
      if (statusBox) {
        statusBox.classList.add('is-visible');
      }

      var tempLink = document.createElement('a');
      tempLink.href = whatsappUrl;
      tempLink.target = '_blank';
      tempLink.rel = 'noopener noreferrer';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    });
  }

  /* ==========================================================================
     5. COPYRIGHT YEAR
     ========================================================================== */
  function initYear() {
    var yearEls = document.querySelectorAll('.js-current-year');
    var year = new Date().getFullYear();
    Array.prototype.forEach.call(yearEls, function (el) {
      el.textContent = String(year);
    });
  }

  /* ==========================================================================
     6. SMOOTH SCROLL REVEAL ANIMATIONS
     ========================================================================== */
  function initScrollReveal() {
    var revealEls = document.querySelectorAll('.reveal-up');
    if (!revealEls.length) return;

    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(revealEls, function (el) {
        el.classList.add('is-revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        Array.prototype.forEach.call(entries, function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.06
      }
    );

    Array.prototype.forEach.call(revealEls, function (el) {
      observer.observe(el);
    });
  }

  // Cleanup any legacy language preference to ensure clean English mode
  try {
    window.localStorage.removeItem('php_site_lang');
  } catch (e) {
    // Ignore storage errors
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initSwipeGalleries();
    initImageLightbox();
    initWhatsAppDefaultLinks();
    initContactForm();
    initYear();
    initScrollReveal();
  });
})();

