const $ = (selector) => document.querySelector(selector);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let introFinished = false;
let interacted = false;

function vibrate(ms = 25) {
  if ("vibrate" in navigator) navigator.vibrate(ms);
}

function createPetals() {
  const layer = $("#petalLayer");
  if (layer.children.length) return;

  for (let i = 0; i < 30; i += 1) {
    const petal = document.createElement("i");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.top = `${-10 - Math.random() * 100}vh`;
    petal.style.animationDuration = `${5 + Math.random() * 5}s`;
    petal.style.animationDelay = `${Math.random() * 5}s`;
    petal.style.setProperty("--drift", `${-75 + Math.random() * 150}px`);
    layer.appendChild(petal);
  }
}

function createHearts() {
  const garden = $("#gardenScene");

  for (let i = 0; i < 16; i += 1) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = i % 3 === 0 ? "💖" : "💕";
    heart.style.left = `${20 + Math.random() * 60}%`;
    heart.style.bottom = `${18 + Math.random() * 24}%`;
    heart.style.animationDelay = `${Math.random() * 0.4}s`;
    garden.appendChild(heart);
    setTimeout(() => heart.remove(), 2000);
  }
}

function showTitle() {
  if (introFinished) return;
  introFinished = true;

  $("#touchHint").classList.remove("is-on");
  $("#cherry").classList.remove("is-happy");
  $("#cherry").classList.add("is-spinning");

  createHearts();
  vibrate(55);

  setTimeout(() => {
    $("#titleScreen").classList.add("is-on");
  }, 1450);
}

async function runIntro() {
  const paws = [...document.querySelectorAll(".paw")];

  $("#stepText").classList.add("is-on");

  for (const paw of paws) {
    await sleep(620);
    paw.classList.add("is-on");
    vibrate(12);
  }

  await sleep(520);

  $("#darkScene").classList.remove("is-active");
  $("#gardenScene").classList.add("is-active");
  createPetals();

  await sleep(950);

  $("#cherry").classList.add("is-walking");

  await sleep(5650);

  $("#barkBubble").classList.add("is-on");
  $("#cherry").classList.add("is-happy");
  vibrate(40);

  await sleep(1450);

  $("#touchHint").classList.add("is-on");
}

$("#gardenScene").addEventListener("pointerdown", () => {
  if ($("#touchHint").classList.contains("is-on") && !interacted) {
    interacted = true;
    showTitle();
  }
});

$("#touchHint").addEventListener("click", (event) => {
  event.stopPropagation();
  if (!interacted) {
    interacted = true;
    showTitle();
  }
});

$("#skipBtn").addEventListener("click", () => {
  $("#darkScene").classList.remove("is-active");
  $("#gardenScene").classList.add("is-active");
  createPetals();

  const cherry = $("#cherry");
  cherry.classList.add("is-walking");
  cherry.style.transition = "none";
  cherry.style.transform = "translateX(-50%) scale(1)";
  cherry.style.opacity = "1";

  $("#titleScreen").classList.add("is-on");
  introFinished = true;
});

$("#startBtn").addEventListener("click", (event) => {
  event.stopPropagation();

  const toast = $("#toast");
  toast.classList.remove("is-on");
  void toast.offsetWidth;
  toast.classList.add("is-on");
  vibrate(35);
});

runIntro();
