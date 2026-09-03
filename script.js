const thoughts = [
  "Can a navigation system know when it might be wrong?",
  "What does a satellite signal look like after bouncing between skyscrapers?",
  "Can learning and geometry disagree—and both teach us something?",
  "How can uncertainty earn our trust instead of merely looking precise?",
];

const thoughtText = document.querySelector("#thought-title");
const thoughtButton = document.querySelector("#thought-button");
let thoughtIndex = 0;

thoughtButton.addEventListener("click", () => {
  thoughtIndex = (thoughtIndex + 1) % thoughts.length;
  thoughtText.textContent = thoughts[thoughtIndex];
});

document.querySelector("#year").textContent = new Date().getFullYear();
