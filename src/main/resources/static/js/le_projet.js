const $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)];
/* mosaïque du hero (mêmes images que la photothèque) */
const IM = ["piste", "pdzp", "matam", "papic", "copil", "PNDL0"].map(
  (n) => "img/PNDL/" + n + (n === "PNDL0" ? ".jpeg" : ".png"),
);
$("#mosaic").innerHTML = [0, 1, 2, 3, 4]
  .map(
    (c) =>
      '<div class="hero-col">' +
      [0, 1, 2, 3]
        .map((r) => `<div style="background-image:url('${IM[(c * 2 + r) % IM.length]}')"></div>`)
        .join("") +
      "</div>",
  )
  .join("");
/* reveal */
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    }),
  { threshold: 0.2 },
);
$$(".reveal").forEach((el) => io.observe(el));
/* compteurs */
function count(el) {
  const t = +el.dataset.target,
    s = performance.now();
  (function f(n) {
    const p = Math.min((n - s) / 1100, 1);
    el.textContent = Math.round(t * (1 - Math.pow(1 - p, 3))).toLocaleString("fr-FR");
    if (p < 1) requestAnimationFrame(f);
  })(s);
}
const co = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) {
        count(e.target);
        co.unobserve(e.target);
      }
    }),
  { threshold: 0.6 },
);
$$(".counter").forEach((c) => co.observe(c));
/* barre de sections : section active + progression */
const chips = $$(".chip");
const so = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) {
        const k = +e.target.dataset.k;
        chips.forEach((c, j) => c.classList.toggle("active", j === k));
        chips[k].scrollIntoView({ block: "nearest", inline: "center" });
      }
    }),
  { rootMargin: "-45% 0px -50% 0px" },
);
$$("[data-k]").forEach((s) => so.observe(s));
addEventListener(
  "scroll",
  () => {
    const h = document.documentElement;
    $("#prog").style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
  },
  { passive: true },
);
