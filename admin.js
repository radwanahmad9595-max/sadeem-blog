(function () {
  "use strict";

  const STORAGE_KEY = "sadeem_posts_v1";
  const COUNTER_KEY = "sadeem_id_counter_v1";

  function loadPosts() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.warn("تعذر قراءة النصوص المحفوظة.");
      }
    }
    savePosts(SEED_POSTS);
    return SEED_POSTS.slice();
  }

  function savePosts(posts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }

  function nextId() {
    const year = new Date().getFullYear();
    let counter = parseInt(localStorage.getItem(COUNTER_KEY) || "0", 10);
    counter += 1;
    localStorage.setItem(COUNTER_KEY, String(counter));
    const padded = String(counter).padStart(4, "0");
    return `SDM-${year}-${padded}`;
  }

  function primeCounterFromSeed(posts) {
    if (localStorage.getItem(COUNTER_KEY)) return;
    let max = 0;
    posts.forEach((p) => {
      const match = /(\d+)$/.exec(p.id || "");
      if (match) max = Math.max(max, parseInt(match[1], 10));
    });
    localStorage.setItem(COUNTER_KEY, String(max));
  }

  let posts = loadPosts();
  primeCounterFromSeed(posts);

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
  }

  function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  const listWrap = document.getElementById("listWrap");

  function renderList() {
    const sorted = posts.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sorted.length === 0) {
      listWrap.innerHTML = '<p class="empty-note">لا توجد نصوص بعد.</p>';
      return;
    }
    listWrap.innerHTML = sorted
      .map(
        (p) => `
        <div class="list-row" data-id="${escapeHtml(p.id)}">
          <div class="meta">
            <span class="pid">${escapeHtml(p.id)}</span> —
            <b>${escapeHtml(p.title || "بلا عنوان")}</b> · ${escapeHtml(p.author)} · ${formatDate(p.date)}
          </div>
          <button type="button" class="del-btn" data-del="${escapeHtml(p.id)}">حذف</button>
        </div>`
      )
      .join("");

    listWrap.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-del");
        const post = posts.find((p) => p.id === id);
        if (!post) return;
        if (!confirm(`هل تريد حذف النص "${post.title || "بلا عنوان"}" (${id})؟`)) return;
        posts = posts.filter((p) => p.id !== id);
        savePosts(posts);
        renderList();
        showToast("تم حذف النص.");
      });
    });
  }

  document.getElementById("adminForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const author = document.getElementById("authorInput").value.trim();
    const title = document.getElementById("titleInput").value.trim();
    const body = document.getElementById("bodyInput").value.trim();
    if (!author || !body) return;

    const newPost = {
      id: nextId(),
      author,
      title,
      body,
      date: new Date().toISOString()
    };

    posts.unshift(newPost);
    savePosts(posts);
    renderList();
    e.target.reset();
    showToast("تم النشر والتوثيق برقم: " + newPost.id);
  });

  function buildStarfield() {
    const container = document.getElementById("stars");
    if (!container) return;
    const count = window.innerWidth < 720 ? 50 : 90;
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

  buildStarfield();
  renderList();
})();
