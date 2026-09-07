(function () {
  "use strict";

  /* ---------------- data layer ---------------- */

  let posts = [];

  async function fetchPosts() {
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "fetch_failed");
      posts = data.posts || [];
    } catch (e) {
      posts = [];
      showToast("تعذر تحميل النصوص من الخادم، تحقق من اتصالك بالإنترنت.");
    }
    renderPosts();
  }

  /* ---------------- helpers ---------------- */

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
  }

  function excerptOf(text, len) {
    const clean = text.trim();
    return clean.length > len ? clean.slice(0, len).trim() + "…" : clean;
  }

  // بصمة بصرية ثابتة لكل نص: زاوية ميل، لون ورق، ونوع تزيين (دبوس/شريط لاصق)
  function hashOf(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }

  function styleFor(id) {
    const h = hashOf(id);
    const rot = (h % 90) / 10 - 4.5; // -4.5deg .. 4.5deg
    const tone = (h % 3) + 1; // 1..3
    const deco = h % 2 === 0 ? "pin" : "ribbon";
    const ty = ((h >> 3) % 41) - 20; // -20px .. 20px, vertical scatter
    const tx = ((h >> 7) % 25) - 12; // -12px .. 12px, horizontal scatter
    const sc = 0.97 + ((h >> 11) % 7) * 0.01; // 0.97 .. 1.03, size variety
    return { rot, tone, deco, ty, tx, sc };
  }

  function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 2400);
  }

  /* ---------------- rendering ---------------- */

  const grid = document.getElementById("postsGrid");
  const emptyState = document.getElementById("emptyState");
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");

  function getFilteredSorted() {
    const q = searchInput.value.trim().toLowerCase();
    let list = posts.filter((p) => {
      if (!q) return true;
      return (
        p.author.toLowerCase().includes(q) ||
        (p.title || "").toLowerCase().includes(q) ||
        p.body.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    });

    const sortBy = sortSelect.value;
    list = list.slice().sort((a, b) => {
      if (sortBy === "oldest") return new Date(a.date) - new Date(b.date);
      if (sortBy === "author") return a.author.localeCompare(b.author, "ar");
      return new Date(b.date) - new Date(a.date); // newest
    });
    return list;
  }

  function renderPosts() {
    const list = getFilteredSorted();
    grid.innerHTML = "";

    if (list.length === 0) {
      emptyState.hidden = false;
    } else {
      emptyState.hidden = true;
    }

    list.forEach((post) => {
      const { rot, tone, deco, ty, tx, sc } = styleFor(post.id);
      const card = document.createElement("article");
      card.className = `post-card reveal tone-${tone}`;
      card.style.setProperty("--rot", rot.toFixed(2) + "deg");
      card.style.setProperty("--ty", ty.toFixed(0) + "px");
      card.style.setProperty("--tx", tx.toFixed(0) + "px");
      card.style.setProperty("--sc", sc.toFixed(2));
      card.setAttribute("data-id", post.id);
      card.innerHTML = `
        <div class="${deco}"></div>
        <div class="paper">
          <div class="stamp"><span class="stamp-id">${escapeHtml(post.id)}</span></div>
          <h3 class="card-title">${escapeHtml(post.title || "بلا عنوان")}</h3>
          <p class="card-excerpt">${escapeHtml(excerptOf(post.body, 150))}</p>
          <button type="button" class="read-more">اقرأ المزيد</button>
          <div class="card-footer">
            <span class="card-author">${escapeHtml(post.author)}</span>
            <span>${formatDate(post.date)}</span>
          </div>
        </div>
        <div class="page-fold"></div>
      `;
      card.addEventListener("click", () => openModal(post.id));
      grid.appendChild(card);
    });

    observeReveals();
    updateStats();
  }

  function updateStats() {
    document.getElementById("statCount").textContent = posts.length;
    const authors = new Set(posts.map((p) => p.author.trim().toLowerCase()));
    document.getElementById("statAuthors").textContent = authors.size;
  }

  /* ---------------- modal ---------------- */

  const overlay = document.getElementById("modalOverlay");
  const modalId = document.getElementById("modalId");
  const modalTitle = document.getElementById("modalTitle");
  const modalAuthor = document.getElementById("modalAuthor");
  const modalDate = document.getElementById("modalDate");
  const modalBody = document.getElementById("modalBody");
  const modalCopyId = document.getElementById("modalCopyId");
  let currentModalPostId = null;

  function openModal(id) {
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    currentModalPostId = post.id;
    modalId.innerHTML = escapeHtml(post.id).split("-").join("<br>");
    modalTitle.textContent = post.title || "بلا عنوان";
    modalAuthor.textContent = post.author;
    modalDate.textContent = formatDate(post.date);
    modalBody.textContent = post.body;
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
    currentModalPostId = null;
  }

  document.getElementById("modalClose").addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  modalCopyId.addEventListener("click", async () => {
    if (!currentModalPostId) return;
    try {
      await navigator.clipboard.writeText(currentModalPostId);
      showToast("تم نسخ رقم التوثيق: " + currentModalPostId);
    } catch (e) {
      showToast("تعذر النسخ التلقائي، الرقم هو: " + currentModalPostId);
    }
  });

  searchInput.addEventListener("input", renderPosts);
  sortSelect.addEventListener("change", renderPosts);

  /* ---------------- reveal on scroll ---------------- */

  let observer;
  function observeReveals() {
    if (!observer) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
    }
    document.querySelectorAll(".reveal:not(.visible)").forEach((el) => observer.observe(el));
  }

  /* ---------------- starfield background ---------------- */

  function buildStarfield() {
    const container = document.getElementById("stars");
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

  /* ---------------- nav toggle ---------------- */

  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  navToggle.addEventListener("click", () => mainNav.classList.toggle("open"));
  mainNav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => mainNav.classList.remove("open"))
  );

  /* ---------------- init ---------------- */

  document.getElementById("year").textContent = new Date().getFullYear();
  buildStarfield();
  fetchPosts();
})();
