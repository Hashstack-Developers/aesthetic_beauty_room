/**
 * Aesthetic Beauty Room By H — Site interactions
 * Mobile menu, smooth scroll, scroll animations, gallery lightbox, form validation
 */

(function () {
  "use strict";

  /* ---------- Mobile navigation ---------- */
  const menuToggle = document.querySelector(".menu-toggle");
  const navMobile = document.querySelector(".nav--mobile");
  const menuOverlay = document.querySelector(".menu-overlay");
  const body = document.body;

  function closeMenu() {
    if (!menuToggle || !navMobile) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    navMobile.classList.remove("is-open");
    navMobile.setAttribute("aria-hidden", "true");
    if (menuOverlay) menuOverlay.classList.remove("is-visible");
    body.classList.remove("menu-open");
  }

  function openMenu() {
    if (!menuToggle || !navMobile) return;
    menuToggle.setAttribute("aria-expanded", "true");
    navMobile.classList.add("is-open");
    navMobile.setAttribute("aria-hidden", "false");
    if (menuOverlay) menuOverlay.classList.add("is-visible");
    body.classList.add("menu-open");
  }

  function toggleMenu() {
    if (!menuToggle || !navMobile) return;
    const isOpen = navMobile.classList.contains("is-open");
    if (isOpen) closeMenu();
    else openMenu();
    const nowOpen = navMobile.classList.contains("is-open");
    menuToggle.setAttribute("aria-label", nowOpen ? "Close menu" : "Open menu");
  }

  if (menuToggle && navMobile) {
    menuToggle.addEventListener("click", toggleMenu);
    if (menuOverlay) {
      menuOverlay.addEventListener("click", closeMenu);
    }
    navMobile.querySelectorAll("a.nav__link").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    navMobile.querySelectorAll(".nav__dropdown-link").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 992) {
        closeMenu();
        closeAllServiceDropdowns();
      }
    });
  }

  /* ---------- Services nav dropdown ---------- */
  function closeAllServiceDropdowns() {
    document.querySelectorAll(".nav__item--dropdown.is-open").forEach(function (item) {
      const btn = item.querySelector(".nav__link--dropdown");
      const panel = item.querySelector(".nav__dropdown");
      if (btn) btn.setAttribute("aria-expanded", "false");
      if (panel) panel.setAttribute("hidden", "");
      item.classList.remove("is-open");
    });
  }

  function initServicesDropdowns() {
    document.querySelectorAll(".nav__item--dropdown").forEach(function (item) {
      const btn = item.querySelector(".nav__link--dropdown");
      const panel = item.querySelector(".nav__dropdown");
      if (!btn || !panel) return;

      function setOpen(open) {
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) panel.removeAttribute("hidden");
        else panel.setAttribute("hidden", "");
        item.classList.toggle("is-open", open);
      }

      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = btn.getAttribute("aria-expanded") === "true";
        document.querySelectorAll(".nav__item--dropdown").forEach(function (other) {
          if (other !== item && other.classList.contains("is-open")) {
            const ob = other.querySelector(".nav__link--dropdown");
            const op = other.querySelector(".nav__dropdown");
            if (ob) ob.setAttribute("aria-expanded", "false");
            if (op) op.setAttribute("hidden", "");
            other.classList.remove("is-open");
          }
        });
        setOpen(!isOpen);
      });

      panel.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          setOpen(false);
        });
      });
    });

    document.addEventListener("click", function () {
      closeAllServiceDropdowns();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAllServiceDropdowns();
    });
  }

  initServicesDropdowns();

  /* ---------- Smooth scroll for same-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        closeMenu();
      }
    });
  });

  /* ---------- Scroll-triggered animations ---------- */
  const animated = document.querySelectorAll("[data-animate]");
  if (animated.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );
    animated.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    animated.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Gallery lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.querySelector(".lightbox__close");

  function openLightbox(src, alt, caption) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    if (lightboxCaption) {
      lightboxCaption.textContent = caption || alt || "";
    }
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-lightbox]").forEach(function (item) {
    item.addEventListener("click", function () {
      const img = item.querySelector("img");
      const cap = item.querySelector(".gallery-item__label");
      if (img) {
        openLightbox(
          img.src,
          img.getAttribute("alt") || "",
          cap ? cap.textContent : ""
        );
      }
    });
    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        item.click();
      }
    });
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  }

  /* ---------- Contact form validation ---------- */
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const successMsg = document.getElementById("form-success");

    function showFieldError(fieldId, message) {
      const group = document.getElementById(fieldId + "-group");
      const err = document.getElementById(fieldId + "-error");
      if (group) group.classList.add("has-error");
      if (err) err.textContent = message;
    }

    function clearFieldError(fieldId) {
      const group = document.getElementById(fieldId + "-group");
      const err = document.getElementById(fieldId + "-error");
      if (group) group.classList.remove("has-error");
      if (err) err.textContent = "";
    }

    function validateEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    }

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (successMsg) successMsg.classList.remove("is-visible");

      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const message = document.getElementById("message");
      let valid = true;

      clearFieldError("name");
      clearFieldError("email");
      clearFieldError("message");

      if (!name || !name.value.trim()) {
        showFieldError("name", "Please enter your name.");
        valid = false;
      } else if (name.value.trim().length < 2) {
        showFieldError("name", "Name must be at least 2 characters.");
        valid = false;
      }

      if (!email || !email.value.trim()) {
        showFieldError("email", "Please enter your email address.");
        valid = false;
      } else if (!validateEmail(email.value)) {
        showFieldError("email", "Please enter a valid email address.");
        valid = false;
      }

      if (!message || !message.value.trim()) {
        showFieldError("message", "Please enter a message.");
        valid = false;
      } else if (message.value.trim().length < 10) {
        showFieldError("message", "Message must be at least 10 characters.");
        valid = false;
      }

      if (valid) {
        if (successMsg) {
          successMsg.classList.add("is-visible");
          successMsg.focus();
        }
        contactForm.reset();
      }
    });

    ["name", "email", "message"].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", function () {
          clearFieldError(id);
        });
      }
    });
  }

  /* ---------- Home: hero slider (auto only, no controls) ---------- */
  function initHeroSlider() {
    const root = document.getElementById("hero-slider");
    if (!root) return;

    const bgs = root.querySelectorAll(".hero__slide-bg");
    const panels = root.querySelectorAll(".hero__panel");
    const n = bgs.length;
    let idx = 0;
    let timer = null;

    function go(nextIdx) {
      idx = (nextIdx + n) % n;
      bgs.forEach(function (el, j) {
        el.classList.toggle("is-active", j === idx);
      });
      panels.forEach(function (el, j) {
        el.classList.toggle("is-active", j === idx);
        el.setAttribute("aria-hidden", j === idx ? "false" : "true");
      });
    }

    panels.forEach(function (el, j) {
      el.setAttribute("aria-hidden", j === 0 ? "false" : "true");
    });

    function tick() {
      go(idx + 1);
    }

    timer = setInterval(tick, 6500);

    root.addEventListener("mouseenter", function () {
      if (timer) clearInterval(timer);
    });
    root.addEventListener("mouseleave", function () {
      if (timer) clearInterval(timer);
      timer = setInterval(tick, 6500);
    });
  }

  /* ---------- Home: testimonial carousel (auto only; swipe optional) ---------- */
  function initTestimonialCarousel() {
    const root = document.querySelector("[data-testimonial-carousel]");
    if (!root) return;

    const track = root.querySelector(".carousel__track");
    const slides = root.querySelectorAll(".carousel__slide");
    const n = slides.length;
    let idx = 0;
    let timer = null;

    function go(nextIdx) {
      idx = (nextIdx + n) % n;
      track.style.transform = "translateX(-" + idx * 100 + "%)";
    }

    function resetTimer() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () {
        go(idx + 1);
      }, 8000);
    }

    let touchStartX = 0;
    track.addEventListener(
      "touchstart",
      function (e) {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );
    track.addEventListener(
      "touchend",
      function (e) {
        const x = e.changedTouches[0].screenX;
        if (x < touchStartX - 45) go(idx + 1);
        if (x > touchStartX + 45) go(idx - 1);
        resetTimer();
      },
      { passive: true }
    );

    root.addEventListener("mouseenter", function () {
      if (timer) clearInterval(timer);
    });
    root.addEventListener("mouseleave", function () {
      resetTimer();
    });

    resetTimer();
  }

  initHeroSlider();
  initTestimonialCarousel();

  /* ---------- Scroll to top (global) ---------- */
  function initScrollToTop() {
    const btn = document.querySelector(".scroll-top");
    if (!btn) return;

    function updateScrollTop() {
      const show = window.scrollY > 280;
      btn.classList.toggle("is-visible", show);
      btn.setAttribute("aria-hidden", show ? "false" : "true");
      btn.tabIndex = show ? 0 : -1;
    }

    btn.addEventListener("click", function () {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });

    window.addEventListener("scroll", updateScrollTop, { passive: true });
    updateScrollTop();
  }

  initScrollToTop();
})();
