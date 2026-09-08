(function () {
  "use strict";

  function buildStarfield() {
    const container = document.getElementById("stars");
    if (!container) return;
    const count = window.innerWidth < 720 ? 60 : 120;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const star = document.createElement("span");
      star.style.top = Math.random() * 100 + "%";
      star.style.left = Math.random() * 100 + "%";
      star.style.animationDelay = (Math.random() * 4).toFixed(2) + "s";
      const size = (Math.random() * 1.8 + 0.6).toFixed(2);
      star.style.width = size + "px";
      star.style.height = size + "px";
      frag.appendChild(star);
    }
    container.appendChild(frag);
  }

  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  navToggle.addEventListener("click", () => mainNav.classList.toggle("open"));

  document.getElementById("year").textContent = new Date().getFullYear();
  buildStarfield();
})();
