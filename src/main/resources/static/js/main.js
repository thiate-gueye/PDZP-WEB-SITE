(function () {
  "use strict";

  var header = document.getElementById("mainNavbar");
  var toggle = document.getElementById("siteToggle");
  var menu = document.getElementById("siteMenu");
  var backTop = document.getElementById("backTop");
  var progress = document.getElementById("siteProgress");

  /* Les pages avec leur propre barre de sections (#prog) n'ont pas besoin d'un doublon. */
  if (progress && document.getElementById("prog")) {
    progress.remove();
    progress = null;
  }

  /* Année du pied de page */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Menu mobile */
  function setMenu(open) {
    if (!menu || !toggle) return;
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    toggle.innerHTML = open
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(!menu.classList.contains("is-open"));
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 991) setMenu(false);
    });
  }

  /* Ombre de l'en-tête et bouton « retour en haut » */
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 30);
    if (backTop) backTop.classList.toggle("show", window.scrollY > 500);
    if (progress) {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backTop) {
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
