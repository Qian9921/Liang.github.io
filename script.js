const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");
const themeLabel = document.querySelector(".theme-label");
const slider = document.querySelector("#canyon-slider");
const environmentValue = document.querySelector("#environment-value");
const confidenceValue = document.querySelector("#confidence-value");
const errorValue = document.querySelector("#error-value");
const uncertaintyEllipse = document.querySelector(".uncertainty-ellipse");

const savedTheme = localStorage.getItem("liang-theme");
const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

function setTheme(theme) {
  root.dataset.theme = theme;
  themeLabel.textContent = theme === "dark" ? "Light" : "Dark";
  themeButton.setAttribute(
    "aria-label",
    `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
  );
  document.querySelector('meta[name="theme-color"]').content =
    theme === "dark" ? "#07111f" : "#f5f8f5";
}

setTheme(savedTheme || (prefersLight ? "light" : "dark"));

themeButton.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  localStorage.setItem("liang-theme", nextTheme);
});

function updateSignalLab() {
  const density = Number(slider.value);
  const confidence = Math.round(99 - density * 0.54);
  const error = (0.3 + Math.pow(density / 28, 2)).toFixed(1);
  const ellipseWidth = 12 + density * 0.45;
  const ellipseHeight = 8 + density * 0.22;
  const rotation = -12 + density * 0.32;

  let environment = "Open sky";
  if (density >= 70) environment = "Dense canyon";
  else if (density >= 35) environment = "Urban street";

  environmentValue.textContent = environment;
  confidenceValue.textContent = `${confidence}%`;
  errorValue.textContent = `± ${error} m`;
  uncertaintyEllipse.style.width = `${ellipseWidth}%`;
  uncertaintyEllipse.style.height = `${ellipseHeight}%`;
  uncertaintyEllipse.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
}

slider.addEventListener("input", updateSignalLab);
updateSignalLab();
