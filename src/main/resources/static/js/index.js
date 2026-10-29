$(document).ready(function () {
  /* Navigation active au défilement */

  const sections = ["accueil", "projet", "priorites", "resultats", "explorer", "actualites"];

  function updateActiveLink() {
    const scrollPosition = $(window).scrollTop() + 150;

    sections.forEach(function (sectionId) {
      const section = $("#" + sectionId);

      if (!section.length) {
        return;
      }

      const top = section.offset().top;
      const bottom = top + section.outerHeight();

      if (scrollPosition >= top && scrollPosition < bottom) {

        $('.site-link[data-section="' + sectionId + '"]');
      }
    });
  }

  /* Animation d'apparition des éléments */

  function revealElements() {
    const windowBottom = $(window).scrollTop() + $(window).height() * 0.9;

    $(".reveal:not(.visible)").each(function () {
      if ($(this).offset().top < windowBottom) {
        $(this).addClass("visible");
      }
    });
  }

  /* Compteurs animés */

  function animateCounter(element) {
    const target = Number($(element).data("target"));
    const duration = 1600;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 4);

      const value = Math.round(target * easedProgress);

      $(element).text(value.toLocaleString("fr-FR"));

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  let countersStarted = false;

  function startCounters() {
    const stats = $("#resultats");

    if (!stats.length || countersStarted) {
      return;
    }

    const triggerPosition = $(window).scrollTop() + $(window).height() * 0.9;

    if (triggerPosition >= stats.offset().top) {
      countersStarted = true;

      $(".counter").each(function () {
        animateCounter(this);
      });
    }
  }

  /* Carrousel des partenaires */

  const $partnersTrack = $("#partnersTrack");

  let partnerIndex = 0;

  function getPartnerStep() {
    const firstCard = $partnersTrack.children().first();

    if (!firstCard.length) {
      return 0;
    }

    return firstCard.outerWidth(true);
  }

  function getVisiblePartners() {
    const step = getPartnerStep();

    if (!step) {
      return 1;
    }

    return Math.max(1, Math.floor($(".partners-window").innerWidth() / step));
  }

  function movePartners(direction) {
    const cardCount = $partnersTrack.children().length;
    const visibleCount = getVisiblePartners();
    const maxIndex = Math.max(0, cardCount - visibleCount);

    partnerIndex = Math.max(0, Math.min(maxIndex, partnerIndex + direction));

    const offset = partnerIndex * getPartnerStep();

    $partnersTrack.css("transform", "translateX(-" + offset + "px)");
  }

  $("#partnerPrev").on("click", function () {
    movePartners(-1);
  });

  $("#partnerNext").on("click", function () {
    movePartners(1);
  });

  $(window).on("resize", function () {
    partnerIndex = 0;

    $partnersTrack.css("transform", "translateX(0)");

    movePartners(0);
  });

  /* Défilement fluide des liens internes */

  $('a[href^="#"]').on("click", function (event) {
    const targetId = $(this).attr("href");

    if (!targetId || targetId === "#" || !$(targetId).length) {
      return;
    }

    event.preventDefault();

    const targetPosition = $(targetId).offset().top - 80;

    $("html, body").animate({ scrollTop: targetPosition }, 500);
  });

  /* Événements de défilement */

  $(window).on("scroll", function () {
    updateActiveLink();
    revealElements();
    startCounters();
  });

  $(window).on("resize", function () {
    revealElements();
    startCounters();
  });

  /* Initialisation */

  updateActiveLink();
  revealElements();
  startCounters();
});


document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("partnersTrack");
  const windowEl = document.querySelector(".partners-window");
  const prevBtn = document.getElementById("partnerPrev");
  const nextBtn = document.getElementById("partnerNext");

  if (!track || !windowEl || !prevBtn || !nextBtn) return;

  const originalCards = Array.from(track.children);
  const total = originalCards.length;

  if (total < 2) return;

  // Duplique les cartes pour créer une boucle.
  originalCards.forEach(card => {
    track.appendChild(card.cloneNode(true));
  });

  let index = 0;
  let timer = null;
  let isTransitioning = false;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  function getStep() {
    const card = track.querySelector(".partner-card");
    if (!card) return 0;

    const gap = parseFloat(
      getComputedStyle(track).columnGap
    ) || 0;

    return card.getBoundingClientRect().width + gap;
  }

  function moveTo(newIndex, animate = true) {
    index = newIndex;

    track.style.transition = animate
      ? "transform .55s cubic-bezier(.22, .61, .36, 1)"
      : "none";

    track.style.transform =
      `translateX(${-index * getStep()}px)`;

    isTransitioning = animate;
  }

  function next() {
    if (isTransitioning) return;

    moveTo(index + 1);
  }

  function prev() {
    if (isTransitioning) return;

    if (index === 0) {
      moveTo(total, false);

      // Applique le repositionnement sans animation.
      void track.offsetWidth;

      moveTo(total - 1);
    } else {
      moveTo(index - 1);
    }
  }

  track.addEventListener("transitionend", event => {
    if (event.propertyName !== "transform") return;

    isTransitioning = false;

    // Retour invisible au début après la dernière carte.
    if (index >= total) {
      moveTo(0, false);
    }
  });

  function stopAuto() {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  }

  function startAuto() {
    stopAuto();

    if (!reducedMotion.matches) {
      timer = setInterval(next, 3500);
    }
  }

  nextBtn.addEventListener("click", () => {
    next();
    startAuto();
  });

  prevBtn.addEventListener("click", () => {
    prev();
    startAuto();
  });

  // Pause quand le visiteur survole le carrousel.
  windowEl.addEventListener("mouseenter", stopAuto);
  windowEl.addEventListener("mouseleave", startAuto);

  // Pause lorsque le visiteur navigue au clavier.
  windowEl.addEventListener("focusin", stopAuto);

  windowEl.addEventListener("focusout", event => {
    if (!windowEl.contains(event.relatedTarget)) {
      startAuto();
    }
  });

  // Repositionnement après un changement de largeur.
  window.addEventListener("resize", () => {
    moveTo(index, false);
  });

  // Respecte les préférences de réduction des animations.
  reducedMotion.addEventListener?.("change", startAuto);

  startAuto();
});
