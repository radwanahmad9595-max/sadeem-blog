(function () {
  "use strict";

  const QUOTES = [
    { text: "خيرُ جليسٍ في الزمان كتاب.", author: "المتنبي" },
    { text: "العلمُ نورٌ يهدي، والجهلُ ظلامٌ يُردي.", author: "حكمة عربية" },
    { text: "من جدَّ وجد، ومن زرع حصد.", author: "مثل عربي" },
    { text: "الصبرُ مفتاح الفرج.", author: "حكمة عربية" },
    { text: "ربَّ كلمةٍ سببت ندامة، وربَّ سكوتٍ خيرٌ من كلام.", author: "حكمة عربية" },
    { text: "لسانك حصانك، إن صنته صانك، وإن خنته خانك.", author: "مثل عربي" },
    { text: "الوقتُ كالسيف، إن لم تقطعه قطعك.", author: "حكمة عربية" },
    { text: "من طلب العلا سهر الليالي.", author: "أبو الطيب المتنبي" },
    { text: "خيرُ الكلام ما قلَّ ودلَّ.", author: "حكمة عربية" },
    { text: "الحكمةُ ضالّة المؤمن، أنّى وجدها فهو أحقُّ بها.", author: "قول مأثور" },
    { text: "لا يُصلح آخر هذه الأمة إلا ما أصلح أولها.", author: "قول مأثور" },
    { text: "من كثُر كلامه كثُر خطؤه.", author: "حكمة عربية" }
  ];

  const dial = document.getElementById("wheelDial");
  const spinBtn = document.getElementById("spinBtn");
  const reveal = document.getElementById("quoteReveal");
  const quoteText = document.getElementById("quoteText");
  const quoteAuthor = document.getElementById("quoteAuthor");

  if (!dial || !spinBtn) return;

  const segAngle = 360 / QUOTES.length;
  let currentRotation = 0;
  let spinning = false;

  spinBtn.addEventListener("click", () => {
    if (spinning) return;
    spinning = true;
    spinBtn.disabled = true;
    reveal.hidden = true;

    const idx = Math.floor(Math.random() * QUOTES.length);
    const targetMod = (360 - (idx * segAngle + segAngle / 2) + 360) % 360;
    const baseFull = Math.floor(currentRotation / 360) * 360;
    const extraSpins = 360 * 6;
    const newRotation = baseFull + extraSpins + targetMod;

    currentRotation = newRotation;
    dial.style.transform = `rotate(${newRotation}deg)`;

    dial.addEventListener(
      "transitionend",
      () => {
        const q = QUOTES[idx];
        quoteText.textContent = q.text;
        quoteAuthor.textContent = "— " + q.author;
        reveal.hidden = false;
        spinBtn.disabled = false;
        spinning = false;
      },
      { once: true }
    );
  });
})();
