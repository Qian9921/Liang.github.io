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
    sparkle.textContent = ["✦", "·", "+"][Math.floor(Math.random() * 3)];
    sparkle.style.left = `${event.clientX}px`;
    sparkle.style.top = `${event.clientY}px`;
    document.body.appendChild(sparkle);
    window.setTimeout(() => sparkle.remove(), 700);
  });

  document.querySelectorAll(".magnetic").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.16;
      button.style.translate = `${x}px ${y}px`;
    });
    button.addEventListener("pointerleave", () => {
      button.style.translate = "0 0";
    });
  });
}

const canvas = document.querySelector("#signal-field");
const hero = document.querySelector(".hero");
const context = canvas.getContext("2d");
const signalPointer = { x: -1000, y: -1000 };
let signalWidth = 0;
let signalHeight = 0;
let signalNodes = [];

function resizeSignalField() {
  const bounds = canvas.getBoundingClientRect();
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  signalWidth = bounds.width;
  signalHeight = bounds.height;
  canvas.width = Math.round(signalWidth * scale);
  canvas.height = Math.round(signalHeight * scale);
  context.setTransform(scale, 0, 0, scale, 0, 0);

  const count = Math.min(46, Math.max(24, Math.round(signalWidth / 28)));
  signalNodes = Array.from({ length: count }, () => ({
    x: Math.random() * signalWidth,
    y: Math.random() * signalHeight,
    vx: (Math.random() - 0.5) * 0.24,
    vy: (Math.random() - 0.5) * 0.24,
    radius: 1.2 + Math.random() * 1.7,
  }));
}

function drawSignalField() {
  context.clearRect(0, 0, signalWidth, signalHeight);

  signalNodes.forEach((node) => {
    if (!reducedMotion) {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > signalWidth) node.vx *= -1;
      if (node.y < 0 || node.y > signalHeight) node.vy *= -1;

      const pointerDistance = Math.hypot(node.x - signalPointer.x, node.y - signalPointer.y);
      if (pointerDistance < 110 && pointerDistance > 0) {
        node.x += ((node.x - signalPointer.x) / pointerDistance) * 0.55;
        node.y += ((node.y - signalPointer.y) / pointerDistance) * 0.55;
      }
    }
  });

  for (let first = 0; first < signalNodes.length; first += 1) {
    for (let second = first + 1; second < signalNodes.length; second += 1) {
      const a = signalNodes[first];
      const b = signalNodes[second];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance < 135) {
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.strokeStyle = `rgba(54, 92, 245, ${(1 - distance / 135) * 0.2})`;
        context.lineWidth = 1;
        context.stroke();
      }
    }
  }

  signalNodes.forEach((node) => {
    context.beginPath();
    context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    context.fillStyle = "rgba(22, 127, 192, 0.58)";
    context.fill();
  });

  if (!reducedMotion) window.requestAnimationFrame(drawSignalField);
}

hero.addEventListener("pointermove", (event) => {
  const bounds = canvas.getBoundingClientRect();
  signalPointer.x = event.clientX - bounds.left;
  signalPointer.y = event.clientY - bounds.top;
});
hero.addEventListener("pointerleave", () => {
  signalPointer.x = -1000;
  signalPointer.y = -1000;
});
window.addEventListener("resize", resizeSignalField);
resizeSignalField();
drawSignalField();

document.querySelector("#year").textContent = new Date().getFullYear();
