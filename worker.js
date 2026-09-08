function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}

function checkAuth(request, env) {
  if (!env.SADEEM_KV) {
    return json(
      { error: "لم يتم ربط مساحة KV باسم SADEEM_KV من إعدادات Cloudflare." },
      500
    );
  }
  if (!env.ADMIN_KEY) {
    return json(
      { error: "لم يتم ضبط متغيّر البيئة ADMIN_KEY من إعدادات Cloudflare." },
      500
    );
  }
  const auth = request.headers.get("X-Admin-Key") || "";
  if (auth !== env.ADMIN_KEY) {
    return json({ error: "unauthorized" }, 401);
  }
  return null;
}

const REACTION_TYPES = ["spark", "moon", "heart"];

async function getPosts(env) {
  if (!env.SADEEM_KV) {
    return json(
      { error: "لم يتم ربط مساحة KV باسم SADEEM_KV من إعدادات Cloudflare." },
      500
    );
  }
  const raw = await env.SADEEM_KV.get("posts");
  const posts = raw ? JSON.parse(raw) : [];

  const rawReactions = await env.SADEEM_KV.get("reactions");
  const reactions = rawReactions ? JSON.parse(rawReactions) : {};
  posts.forEach((p) => {
    p.reactions = reactions[p.id] || { spark: 0, moon: 0, heart: 0 };
  });

  return json({ posts });
}

async function react(request, env) {
  if (!env.SADEEM_KV) {
    return json(
      { error: "لم يتم ربط مساحة KV باسم SADEEM_KV من إعدادات Cloudflare." },
      500
    );
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ error: "invalid_json" }, 400);
  }

  const id = (body.id || "").toString();
  const type = (body.type || "").toString();
  if (!id || !REACTION_TYPES.includes(type)) {
    return json({ error: "invalid_reaction" }, 400);
  }

  const raw = await env.SADEEM_KV.get("posts");
  const posts = raw ? JSON.parse(raw) : [];
  if (!posts.some((p) => p.id === id)) {
    return json({ error: "post_not_found" }, 404);
  }

  const rawReactions = await env.SADEEM_KV.get("reactions");
  const reactions = rawReactions ? JSON.parse(rawReactions) : {};
  if (!reactions[id]) reactions[id] = { spark: 0, moon: 0, heart: 0 };
  reactions[id][type] = (reactions[id][type] || 0) + 1;

  await env.SADEEM_KV.put("reactions", JSON.stringify(reactions));

  return json({ reactions: reactions[id] });
}

async function addPost(request, env) {
  const authError = checkAuth(request, env);
  if (authError) return authError;

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ error: "invalid_json" }, 400);
  }

  const author = (body.author || "").toString().trim().slice(0, 60);
  const title = (body.title || "").toString().trim().slice(0, 80);
  const text = (body.body || "").toString().trim().slice(0, 20000);
  if (!author || !text) {
    return json({ error: "الاسم والنص مطلوبان" }, 400);
  }

  const raw = await env.SADEEM_KV.get("posts");
  const posts = raw ? JSON.parse(raw) : [];

  let counter = parseInt((await env.SADEEM_KV.get("counter")) || "0", 10);
  counter += 1;
  const year = new Date().getFullYear();
  const id = `SDM-${year}-${String(counter).padStart(4, "0")}`;

  const newPost = { id, author, title, body: text, date: new Date().toISOString() };
  posts.unshift(newPost);

  await env.SADEEM_KV.put("posts", JSON.stringify(posts));
  await env.SADEEM_KV.put("counter", String(counter));

  return json({ post: newPost });
}

async function deletePost(request, env, url) {
  const authError = checkAuth(request, env);
  if (authError) return authError;

  const id = url.searchParams.get("id");
  if (!id) return json({ error: "missing_id" }, 400);

  const raw = await env.SADEEM_KV.get("posts");
  let posts = raw ? JSON.parse(raw) : [];
  posts = posts.filter((p) => p.id !== id);
  await env.SADEEM_KV.put("posts", JSON.stringify(posts));

  return json({ ok: true });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/posts") {
      if (request.method === "GET") return getPosts(env);
      if (request.method === "POST") return addPost(request, env);
      if (request.method === "DELETE") return deletePost(request, env, url);
      return json({ error: "method_not_allowed" }, 405);
    }

    if (url.pathname === "/api/react") {
      if (request.method === "POST") return react(request, env);
      return json({ error: "method_not_allowed" }, 405);
    }

    return env.ASSETS.fetch(request);
  }
};
