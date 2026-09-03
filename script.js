const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

const thoughts = [
  "Can a navigation system know when it might be wrong?",
  "What does a satellite signal become after bouncing between skyscrapers?",
  "Can learning and geometry disagree—and both teach us something?",
  "How can uncertainty earn our trust instead of merely looking precise?",
];

const rotatingWords = ["Building", "Learning", "Exploring", "Questioning"];
const rotatingWord = document.querySelector(".rotating-word");
const thoughtText = document.querySelector("#thought-text");
const thoughtButton = document.querySelector("#thought-button");
const progress = document.querySelector(".scroll-progress");
const header = document.querySelector(".site-header");
const cursorGlow = document.querySelector(".cursor-glow");
let wordIndex = 0;
let thoughtIndex = 0;

if (!reducedMotion) {
  window.setInterval(() => {
    rotatingWord.classList.add("word-out");
    window.setTimeout(() => {
      wordIndex = (wordIndex + 1) % rotatingWords.length;
      rotatingWord.textContent = rotatingWords[wordIndex];
      rotatingWord.classList.remove("word-out");
    }, 220);
  }, 2400);
}

thoughtButton.addEventListener("click", () => {
  thoughtIndex = (thoughtIndex + 1) % thoughts.length;
  thoughtText.classList.add("thought-swap");
  window.setTimeout(() => {
    thoughtText.textContent = thoughts[thoughtIndex];
    thoughtText.classList.remove("thought-swap");
  }, reducedMotion ? 0 : 160);
});

const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  }),
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

function updateScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}
window.addEventListener("scroll", updateScroll, { passive: true });
updateScroll();

if (finePointer && !reducedMotion) {
  window.addEventListener("pointermove", (event) => {
    document.documentElement.style.setProperty("--mouse-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--mouse-y", `${event.clientY}px`);
    cursorGlow.style.opacity = "1";

    document.querySelectorAll("[data-float]").forEach((element) => {
      const amount = Number(element.dataset.float);
      const x = (event.clientX / window.innerWidth - 0.5) * amount;
      const y = (event.clientY / window.innerHeight - 0.5) * amount;
      element.style.translate = `${x}px ${y}px`;
    });
  });

  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--rx", `${-y * 5}deg`);
      card.style.setProperty("--ry", `${x * 6}deg`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });

  let lastSparkle = 0;
  window.addEventListener("pointermove", (event) => {
    const now = performance.now();
    if (now - lastSparkle < 85) return;
    lastSparkle = now;
    const sparkle = document.createElement("span");
    sparkle.className = "cursor-sparkle";
    sparkle.textContent = ["✦", "·", "♡"][Math.floor(Math.random() * 3)];
    sparkle.style.left = `${event.clientX}px`;
    sparkle.style.top = `${event.clientY}px`;
    document.body.appendChild(sparkle);
    window.setTimeout(() => sparkle.remove(), 700);
  });
}

document.querySelector("#year").textContent = new Date().getFullYear();
