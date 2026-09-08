(function () {
  "use strict";

  const SCORE_KEY = "sadeem_game_score_v1";
  const SOLVED_KEY = "sadeem_game_solved_v1";
  const POINTS_PER_VERSE = 3;

  const VERSES = [
    { text: "على قدرِ أهل العزم تأتي العزائم .. وتأتي على قدر الكرام ______", answer: "المكارم", poet: "المتنبي" },
    { text: "إذا غامرتَ في شرفٍ مَرومٍ .. فلا تقنع بما دون ______", answer: "النجوم", poet: "المتنبي" },
    { text: "أعزُّ مكانٍ في الدنى سرجُ سابحٍ .. وخيرُ جليسٍ في الزمان ______", answer: "كتاب", poet: "المتنبي" },
    { text: "قم للمعلم وفِّه التبجيلا .. كاد المعلم أن يكون ______", answer: "رسولا", poet: "أحمد شوقي" },
    { text: "دقّاتُ قلب المرء قائلةٌ له .. إن الحياة دقائقٌ و ______", answer: "ثواني", poet: "أحمد شوقي" },
    { text: "وطني لو شُغلتُ بالخُلد عنه .. نازعتني إليه في الخلد ______", answer: "نفسي", poet: "أحمد شوقي" },
    { text: "دع الأيامَ تفعل ما تشاء .. وطِبْ نفساً إذا حكم ______", answer: "القضاء", poet: "الإمام الشافعي" },
    { text: "العلمُ يرفع بيتاً لا عماد له .. والجهلُ يهدم بيت العزّ و ______", answer: "الكرم", poet: "الإمام الشافعي" },
    { text: "ومن لم يذُق مُرَّ التعلمِ ساعةً .. تجرّعَ ذلّ الجهل طولَ ______", answer: "حياته", poet: "الإمام الشافعي" },
    { text: "إذا الشعبُ يوماً أراد الحياة .. فلا بدّ أن يستجيب ______", answer: "القدر", poet: "أبو القاسم الشابي" },
    { text: "ولا بدّ لليلِ أن ينجلي .. ولا بدّ للقيدِ أن ______", answer: "ينكسر", poet: "أبو القاسم الشابي" },
    { text: "وإني وإن كنتُ الأخير زمانه .. لآتٍ بما لم تستطعه ______", answer: "الأوائل", poet: "أبو العلاء المعري" },
    { text: "قفا نبكِ من ذكرى حبيبٍ ومنزلِ .. بسِقطِ اللوى بين الدخول فـ ______", answer: "حومل", poet: "امرؤ القيس" },
    { text: "ولقد ذكرتُكِ والرماحُ نواهلٌ .. مني وبيضُ الهند تقطر من ______", answer: "دمي", poet: "عنترة بن شداد" },
    { text: "ستُبدي لك الأيامُ ما كنتَ جاهلاً .. ويأتيك بالأخبار من لم ______", answer: "تزوّد", poet: "طرفة بن العبد" },
    { text: "السيفُ أصدقُ أنباءً من الكتبِ .. في حدّه الحدُّ بين الجدّ و ______", answer: "اللعب", poet: "أبو تمام" },
    { text: "أيها الشاكي وما بك داءٌ .. كن جميلاً تر الوجود ______", answer: "جميلا", poet: "إيليا أبو ماضي" },
    { text: "أنا البحرُ في أحشائه الدرُّ كامنٌ .. فهل سألوا الغوّاص عن ______", answer: "صدفاتي", poet: "حافظ إبراهيم" },
    { text: "رُبَّ أخٍ لك لم تلده ______", answer: "أمك", poet: "مثل شعري مشهور" },
    { text: "بانت سعادُ فقلبي اليوم متبولُ .. متيّمٌ إثرها لم يُفدَ ______", answer: "مكبول", poet: "كعب بن زهير" }
  ];

  function normalize(s) {
    return (s || "")
      .replace(/[ً-ْٰـ]/g, "") // تشكيل وتطويل
      .replace(/[إأآا]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ة/g, "ه")
      .replace(/\s+/g, "")
      .trim();
  }

  function loadSolved() {
    try {
      return new Set(JSON.parse(localStorage.getItem(SOLVED_KEY) || "[]"));
    } catch (e) {
      return new Set();
    }
  }

  function saveSolved(set) {
    localStorage.setItem(SOLVED_KEY, JSON.stringify(Array.from(set)));
  }

  function loadScore() {
    return parseInt(localStorage.getItem(SCORE_KEY) || "0", 10);
  }

  function saveScore(score) {
    localStorage.setItem(SCORE_KEY, String(score));
  }

  let solved = loadSolved();
  let score = loadScore();

  const scoreValueEl = document.getElementById("scoreValue");
  const scoreProgressEl = document.getElementById("scoreProgress");

  function updateScoreUI() {
    scoreValueEl.textContent = score;
    scoreProgressEl.textContent = `${solved.size} / ${VERSES.length}`;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  const grid = document.getElementById("versesGrid");

  function renderVerses() {
    grid.innerHTML = VERSES.map((v, i) => {
      const [before, after] = v.text.split("______");
      const isSolved = solved.has(i);
      return `
        <article class="verse-card${isSolved ? " is-correct" : ""}" data-index="${i}">
          <span class="verse-index">${String(i + 1).padStart(2, "0")} / ${VERSES.length}</span>
          <p class="verse-text">${escapeHtml(before)}<span class="blank">${isSolved ? escapeHtml(v.answer) : "......"}</span>${escapeHtml(after || "")}</p>
          <span class="verse-poet">— ${escapeHtml(v.poet)}</span>
          <div class="verse-controls">
            <input type="text" class="verse-input" placeholder="اكتب الكلمة الناقصة"
              ${isSolved ? "disabled" : ""} value="${isSolved ? escapeHtml(v.answer) : ""}">
            <button type="button" class="btn-check">${isSolved ? "✓ تم" : "تحقق"}</button>
            <button type="button" class="btn-clear"${isSolved ? " disabled" : ""}>مسح</button>
          </div>
          <div class="verse-feedback">${isSolved ? "✓ إجابة صحيحة، +" + POINTS_PER_VERSE + " نقاط" : ""}</div>
        </article>`;
    }).join("");

    grid.querySelectorAll(".verse-card").forEach((card) => {
      const i = parseInt(card.getAttribute("data-index"), 10);
      const input = card.querySelector(".verse-input");
      const checkBtn = card.querySelector(".btn-check");
      const clearBtn = card.querySelector(".btn-clear");
      const feedback = card.querySelector(".verse-feedback");

      checkBtn.addEventListener("click", () => {
        if (solved.has(i)) return;
        const val = input.value.trim();
        if (!val) {
          feedback.textContent = "اكتب إجابة أولاً.";
          card.classList.remove("is-correct", "is-wrong");
          return;
        }
        if (normalize(val) === normalize(VERSES[i].answer)) {
          solved.add(i);
          score += POINTS_PER_VERSE;
          saveSolved(solved);
          saveScore(score);
          updateScoreUI();
          card.classList.remove("is-wrong");
          card.classList.add("is-correct");
          input.disabled = true;
          clearBtn.disabled = true;
          checkBtn.textContent = "✓ تم";
          feedback.textContent = `✓ إجابة صحيحة، +${POINTS_PER_VERSE} نقاط`;
          card.querySelector(".blank").textContent = VERSES[i].answer;
        } else {
          card.classList.remove("is-correct");
          card.classList.add("is-wrong");
          feedback.textContent = "✗ إجابة غير صحيحة، حاول مجدداً.";
        }
      });

      clearBtn.addEventListener("click", () => {
        if (solved.has(i)) return;
        input.value = "";
        card.classList.remove("is-correct", "is-wrong");
        feedback.textContent = "";
        input.focus();
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          checkBtn.click();
        }
      });
    });
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

  document.getElementById("resetGame").addEventListener("click", () => {
    if (!confirm("هل تريد مسح كل إجاباتك ونقاطك والبدء من جديد؟")) return;
    solved = new Set();
    score = 0;
    localStorage.removeItem(SOLVED_KEY);
    localStorage.removeItem(SCORE_KEY);
    updateScoreUI();
    renderVerses();
  });

  document.getElementById("year").textContent = new Date().getFullYear();
  buildStarfield();
  updateScoreUI();
  renderVerses();
})();
