function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}

function checkAuth(request, env) {
  if (!env.SADEEM_KV) {
    return json(
      { error: "لم يتم ربط مساحة KV باسم SADEEM_KV من إعدادات Cloudflare Pages." },
      500
    );
  }
  if (!env.ADMIN_KEY) {
    return json(
      { error: "لم يتم ضبط متغيّر البيئة ADMIN_KEY من إعدادات Cloudflare Pages." },
      500
    );
  }
  const auth = request.headers.get("X-Admin-Key") || "";
  if (auth !== env.ADMIN_KEY) {
    return json({ error: "unauthorized" }, 401);
  }
  return null;
}

export async function onRequestGet(context) {
  const { env } = context;
  if (!env.SADEEM_KV) {
    return json(
      { error: "لم يتم ربط مساحة KV باسم SADEEM_KV من إعدادات Cloudflare Pages." },
      500
    );
  }
  const raw = await env.SADEEM_KV.get("posts");
  const posts = raw ? JSON.parse(raw) : [];
  return json({ posts });
}

export async function onRequestPost(context) {
  const { request, env } = context;
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

export async function onRequestDelete(context) {
  const { request, env } = context;
  const authError = checkAuth(request, env);
  if (authError) return authError;

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return json({ error: "missing_id" }, 400);

  const raw = await env.SADEEM_KV.get("posts");
  let posts = raw ? JSON.parse(raw) : [];
  posts = posts.filter((p) => p.id !== id);
  await env.SADEEM_KV.put("posts", JSON.stringify(posts));

  return json({ ok: true });
}
