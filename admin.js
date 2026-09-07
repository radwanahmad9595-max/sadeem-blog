(function () {
  "use strict";

  const KEY_STORAGE = "sadeem_admin_secret";
  let adminKey = localStorage.getItem(KEY_STORAGE) || "";
  let posts = [];

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
    showToast._t = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  function promptForKey() {
    const val = window.prompt("أدخل رمز الدخول الخاص بلوحة التوثيق:");
    if (val && val.trim()) {
      adminKey = val.trim();
      localStorage.setItem(KEY_STORAGE, adminKey);
    }
    return adminKey;
  }

  function handleUnauthorized() {
    localStorage.removeItem(KEY_STORAGE);
    adminKey = "";
    showToast("رمز الدخول غير صحيح أو غير مُدخل، حاول مجدداً.");
  }

  /* ---------------- API ---------------- */

  async function apiList() {
    const res = await fetch("/api/posts");
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "تعذر تحميل النصوص.");
      return [];
    }
    return data.posts || [];
  }

  async function apiAdd(payload) {
    if (!adminKey) promptForKey();
    if (!adminKey) return null;
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Admin-Key": adminKey },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status === 401) {
      handleUnauthorized();
      return null;
    }
    if (!res.ok) {
      showToast(data.error || "تعذر نشر النص.");
      return null;
    }
    return data.post;
  }

  async function apiDelete(id) {
    if (!adminKey) promptForKey();
    if (!adminKey) return false;
    const res = await fetch("/api/posts?id=" + encodeURIComponent(id), {
      method: "DELETE",
      headers: { "X-Admin-Key": adminKey }
    });
    if (res.status === 401) {
      handleUnauthorized();
      return false;
    }
    return res.ok;
  }

  /* ---------------- rendering ---------------- */

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
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-del");
        const post = posts.find((p) => p.id === id);
        if (!post) return;
        if (!confirm(`هل تريد حذف النص "${post.title || "بلا عنوان"}" (${id})؟`)) return;
        const ok = await apiDelete(id);
        if (!ok) return;
        posts = posts.filter((p) => p.id !== id);
        renderList();
        showToast("تم حذف النص.");
      });
    });
  }

  document.getElementById("adminForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const author = document.getElementById("authorInput").value.trim();
    const title = document.getElementById("titleInput").value.trim();
    const body = document.getElementById("bodyInput").value.trim();
    if (!author || !body) return;

    const newPost = await apiAdd({ author, title, body });
    if (!newPost) return;

    posts.unshift(newPost);
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

  async function init() {
    buildStarfield();
    posts = await apiList();
    renderList();
  }

  init();
})();
