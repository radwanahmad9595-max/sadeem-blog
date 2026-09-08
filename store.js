(function () {
  "use strict";

  // TODO: استبدل هذا الرقم برقم واتساب عملك الفعلي بصيغة دولية بدون + أو أصفار (مثال: 9665XXXXXXXX)
  const WHATSAPP_NUMBER = "9665XXXXXXXX";

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

  document.querySelectorAll(".product-order[data-product]").forEach((link) => {
    const product = link.getAttribute("data-product");
    const message = encodeURIComponent(`السلام عليكم، أرغب بطلب: ${product} من متجر السديم.`);
    link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  navToggle.addEventListener("click", () => mainNav.classList.toggle("open"));

  document.getElementById("year").textContent = new Date().getFullYear();
  buildStarfield();
})();
