/* =========================================================
   PDZP-2 — JavaScript commun aux pages du site
   Menu, progression de lecture, retour en haut, animations,
   compteurs et carrousel des partenaires.
========================================================= */

(() => {
  'use strict';

  const onReady = (callback) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  };

  onReady(() => {
    const header = document.getElementById('mainNavbar');
    const progress = document.getElementById('siteProgress');
    const backTop = document.getElementById('backTop');
    const menu = document.getElementById('siteMenu');
    const menuToggle = document.getElementById('siteMenuToggle');

    /* Menu responsive */
    const closeMenu = () => {
      if (!menu || !menuToggle) return;
      menu.classList.remove('is-open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
    };

    if (menu && menuToggle) {
      menuToggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('is-open');
        menuToggle.classList.toggle('is-open', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
      });

      menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
      });

      document.addEventListener('click', (event) => {
        if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
          closeMenu();
        }
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
      });

      window.addEventListener('resize', () => {
        if (window.innerWidth > 991) closeMenu();
      });
    }

    /* Mise en évidence du lien correspondant à la page courante */
    const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
    document.querySelectorAll('.site-nav .site-link').forEach((link) => {
      try {
        const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/+$/, '') || '/';
        if (linkPath === currentPath) {
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'page');
        }
      } catch (error) {
        // Un lien invalide ne doit pas empêcher les autres interactions.
      }
    });

    /* Barre de progression et bouton retour en haut */
    let scrollFrameRequested = false;
    const updateScrollUI = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollableHeight > 0
        ? (window.scrollY / scrollableHeight) * 100
        : 0;

      if (progress) progress.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
      if (backTop) backTop.classList.toggle('show', window.scrollY > 350);
      if (header) header.classList.toggle('is-scrolled', window.scrollY > 10);
      scrollFrameRequested = false;
    };

    window.addEventListener('scroll', () => {
      if (!scrollFrameRequested) {
        window.requestAnimationFrame(updateScrollUI);
        scrollFrameRequested = true;
      }
    }, { passive: true });
    updateScrollUI();

    if (backTop) {
      backTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* Apparition progressive des éléments .reveal */
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      revealElements.forEach((element) => revealObserver.observe(element));
    } else {
      revealElements.forEach((element) => element.classList.add('visible'));
    }

    /* Compteurs des indicateurs */
    const counters = document.querySelectorAll('.counter[data-target]');
    const animateCounter = (element) => {
      if (element.dataset.animated === 'true') return;
      const target = Number(element.dataset.target);
      if (!Number.isFinite(target)) return;

      element.dataset.animated = 'true';
      const duration = 1400;
      const startTime = performance.now();
      const decimals = Number(element.dataset.decimals || 0);

      const tick = (now) => {
        const progressRatio = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progressRatio, 3);
        const value = target * eased;
        element.textContent = decimals > 0
          ? value.toFixed(decimals)
          : String(Math.round(value));

        if (progressRatio < 1) {
          window.requestAnimationFrame(tick);
        } else {
          element.textContent = decimals > 0 ? target.toFixed(decimals) : String(target);
        }
      };

      window.requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.35 });
      counters.forEach((counter) => counterObserver.observe(counter));
    } else {
      counters.forEach(animateCounter);
    }

    /* Carrousel des partenaires (initialisé uniquement sur les pages qui le contiennent) */
    const partnersTrack = document.getElementById('partnersTrack');
    const partnerPrev = document.getElementById('partnerPrev');
    const partnerNext = document.getElementById('partnerNext');

    if (partnersTrack && partnerPrev && partnerNext) {
      const cards = Array.from(partnersTrack.querySelectorAll('.partner-card'));
      let currentIndex = 0;

      const getVisibleCards = () => {
        if (window.matchMedia('(max-width: 575px)').matches) return 1;
        if (window.matchMedia('(max-width: 991px)').matches) return 2;
        return 3;
      };

      const updatePartners = () => {
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(0, cards.length - visibleCards);
        currentIndex = Math.min(Math.max(currentIndex, 0), maxIndex);

        if (cards.length) {
          const trackStyle = window.getComputedStyle(partnersTrack);
          const gap = parseFloat(trackStyle.columnGap || trackStyle.gap) || 0;
          const cardWidth = cards[0].getBoundingClientRect().width;
          partnersTrack.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
        }

        partnerPrev.disabled = currentIndex === 0;
        partnerNext.disabled = currentIndex >= maxIndex;
        partnerPrev.setAttribute('aria-disabled', String(partnerPrev.disabled));
        partnerNext.setAttribute('aria-disabled', String(partnerNext.disabled));
      };

      partnerPrev.addEventListener('click', () => {
        currentIndex -= 1;
        updatePartners();
      });

      partnerNext.addEventListener('click', () => {
        currentIndex += 1;
        updatePartners();
      });

      window.addEventListener('resize', updatePartners);
      updatePartners();
    }
  });
})();
