(function () {
  "use strict";

  const CITIES = [
    {
      id: "fes", name: "فاس", country: "المغرب", x: 10, y: 42,
      works: [
        { title: "دفنا الماضي", author: "عبد الكريم غلاب", type: "رواية", note: "من أبرز الروايات المغربية الحديثة التي رصدت تحولات المجتمع المغربي في القرن العشرين." }
      ]
    },
    {
      id: "cordoba", name: "قرطبة", country: "الأندلس (إسبانيا)", x: 14, y: 22,
      works: [
        { title: "ديوان ابن زيدون", author: "ابن زيدون", type: "شعر", note: "من أشهر شعراء الغزل الأندلسي، اشتهر بقصائده التي كتبها في محبوبته ولّادة بنت المستكفي." },
        { title: "شعر ولّادة بنت المستكفي", author: "ولّادة بنت المستكفي", type: "شعر", note: "أميرة أندلسية وشاعرة بارزة، عُرفت بمجلسها الأدبي في قرطبة." }
      ]
    },
    {
      id: "tunis", name: "تونس", country: "تونس", x: 24, y: 38,
      works: [
        { title: "أغاني الحياة", author: "أبو القاسم الشابي", type: "ديوان شعر", note: "الديوان الأشهر للشاعر التونسي، ومنه أبيات باتت جزءاً من الوجدان العربي المعاصر." }
      ]
    },
    {
      id: "alexandria", name: "الإسكندرية", country: "مصر", x: 40, y: 45,
      works: [
        { title: "لا أحد ينام في الإسكندرية", author: "إبراهيم عبد المجيد", type: "رواية", note: "رواية مصرية بارزة تصوّر الحياة في الإسكندرية خلال الحرب العالمية الثانية." },
        { title: "قصائد الإسكندرية", author: "قسطنطين كفافيس", type: "شعر", note: "شاعر يوناني عاش في الإسكندرية وكانت المدينة حاضرة رئيسية في كثير من قصائده." }
      ]
    },
    {
      id: "cairo", name: "القاهرة", country: "مصر", x: 43, y: 53,
      works: [
        { title: "ثلاثية بين القصرين", author: "نجيب محفوظ", type: "رواية", note: "من أعظم الأعمال الروائية العربية، ترصد حياة أسرة قاهرية عبر ثلاثة أجيال في أحياء القاهرة القديمة." },
        { title: "ألف ليلة وليلة", author: "مجهول المؤلف", type: "حكايات شعبية", note: "مجموعة الحكايات الأشهر في التراث العربي، وتدور كثير من فصولها بين القاهرة وبغداد." }
      ]
    },
    {
      id: "damascus", name: "دمشق", country: "سوريا", x: 55, y: 33,
      works: [
        { title: "قصائد دمشقية", author: "نزار قباني", type: "شعر", note: "شاعر سوري وُلد في دمشق وحضرت المدينة بقوة في وجدانه الشعري ونصوصه." }
      ]
    },
    {
      id: "beirut", name: "بيروت", country: "لبنان", x: 51, y: 37,
      works: [
        { title: "بيروت 75", author: "غادة السمان", type: "رواية", note: "من أهم الروايات العربية التي تناولت المجتمع اللبناني قبيل الحرب الأهلية." },
        { title: "أعمال جبران خليل جبران", author: "جبران خليل جبران", type: "أدب المهجر", note: "أديب لبناني ارتبط اسمه بحركة أدب المهجر، ونُشرت أغلب أعماله بين لبنان والمهجر الأمريكي." }
      ]
    },
    {
      id: "jerusalem", name: "القدس", country: "فلسطين", x: 54, y: 43,
      works: [
        { title: "أعمال محمود درويش", author: "محمود درويش", type: "شعر", note: "أبرز شعراء فلسطين المعاصرين، وارتبطت القدس وفلسطين عموماً بمعظم مسيرته الشعرية." }
      ]
    },
    {
      id: "hijaz", name: "مكة والمدينة", country: "السعودية", x: 58, y: 64,
      works: [
        { title: "المعلقات", author: "شعراء الجاهلية", type: "شعر", note: "أشهر القصائد العربية القديمة، وتنسب إلى شعراء الجزيرة العربية قبل الإسلام." },
        { title: "شعر حسّان بن ثابت", author: "حسّان بن ثابت", type: "شعر", note: "شاعر من المدينة المنورة، عُرف بلقب شاعر الرسول صلى الله عليه وسلم." }
      ]
    },
    {
      id: "baghdad", name: "بغداد", country: "العراق", x: 68, y: 38,
      works: [
        { title: "ديوان المتنبي", author: "أبو الطيب المتنبي", type: "شعر", note: "أعظم شعراء العربية على الإطلاق في نظر كثيرين، تنقّل بين بلاطات بغداد وحلب ومصر." },
        { title: "ألف ليلة وليلة", author: "مجهول المؤلف", type: "حكايات شعبية", note: "بغداد في عصر هارون الرشيد هي المسرح الأشهر لكثير من حكايات الليالي." }
      ]
    },
    {
      id: "basra", name: "البصرة والكوفة", country: "العراق", x: 72, y: 52,
      works: [
        { title: "البيان والتبيين", author: "الجاحظ", type: "أدب ونثر", note: "وُلد الجاحظ ونشأ في البصرة، وتُعد كتاباته من أعمدة النثر العربي الكلاسيكي." },
        { title: "ديوان أبي نواس", author: "أبو نواس", type: "شعر", note: "من أبرز شعراء العصر العباسي، ارتبط اسمه بمجالس البصرة والكوفة وبغداد." }
      ]
    },
    {
      id: "yemen", name: "صنعاء", country: "اليمن", x: 63, y: 78,
      works: [
        { title: "الموروث الشعري القديم", author: "شعراء اليمن القدامى", type: "شعر وتراث", note: "يرتبط اليمن بإرث شعري وأسطوري عريق يمتد إلى حضارة سبأ وحمير في الذاكرة العربية." }
      ]
    }
  ];

  const ROUTES = [
    ["fes", "cordoba"], ["cordoba", "tunis"], ["tunis", "alexandria"],
    ["alexandria", "cairo"], ["cairo", "jerusalem"], ["jerusalem", "damascus"],
    ["damascus", "beirut"], ["damascus", "baghdad"], ["baghdad", "basra"],
    ["cairo", "hijaz"], ["hijaz", "yemen"], ["hijaz", "baghdad"]
  ];

  const pinsLayer = document.getElementById("pinsLayer");
  const routesLayer = document.getElementById("routesLayer");
  const panel = document.getElementById("mapPanel");

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function cityById(id) {
    return CITIES.find((c) => c.id === id);
  }

  function renderRoutes() {
    routesLayer.setAttribute("viewBox", "0 0 100 100");
    routesLayer.setAttribute("preserveAspectRatio", "none");
    routesLayer.innerHTML = ROUTES.map(([a, b]) => {
      const ca = cityById(a), cb = cityById(b);
      return `<line class="map-route" x1="${ca.x}" y1="${ca.y}" x2="${cb.x}" y2="${cb.y}"></line>`;
    }).join("");
  }

  function renderPins() {
    pinsLayer.innerHTML = CITIES.map(
      (c) => `
      <div class="city-pin" style="right:${100 - c.x}%; top:${c.y}%;" data-id="${c.id}">
        <span class="pin-label">${escapeHtml(c.name)}</span>
        <span class="pin-dot"></span>
      </div>`
    ).join("");

    pinsLayer.querySelectorAll(".city-pin").forEach((pin) => {
      pin.addEventListener("click", () => selectCity(pin.getAttribute("data-id")));
    });
  }

  function selectCity(id) {
    const city = cityById(id);
    if (!city) return;

    pinsLayer.querySelectorAll(".city-pin").forEach((p) => {
      p.classList.toggle("active", p.getAttribute("data-id") === id);
    });

    panel.innerHTML = `
      <h2 class="panel-city-name">${escapeHtml(city.name)}</h2>
      <p class="panel-country">${escapeHtml(city.country)}</p>
      ${city.works
        .map(
          (w) => `
        <div class="work-card">
          <p class="work-title">${escapeHtml(w.title)}</p>
          <p class="work-meta">${escapeHtml(w.author)} — ${escapeHtml(w.type)}</p>
          <p class="work-note">${escapeHtml(w.note)}</p>
        </div>`
        )
        .join("")}
    `;
  }

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
  renderRoutes();
  renderPins();
})();
