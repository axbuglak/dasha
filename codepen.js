const model = document.getElementById("model");
const scene = document.getElementById("scene");
const text3d = document.getElementById("text3d");

const sliceCount = 58;
const depth = 176;
const fragment = document.createDocumentFragment();

for (let i = 0; i < sliceCount; i++) {
  const t = i / (sliceCount - 1);
  const centered = t * 2 - 1;
  const z = centered * depth / 2;
  const volume = Math.sqrt(Math.max(0, 1 - centered * centered));

  // Build asymmetry so the lobes and taper feel more organic.
  const scale = 0.76 + volume * 0.36;
  const width = 170 * scale * (1 + centered * 0.08);
  const height = 156 * scale * (1 - centered * 0.045);
  const offsetX = Math.sin(centered * Math.PI * 1.25) * 6 + centered * 2.2;
  const offsetY = Math.abs(centered) * 5 + (centered > 0 ? 2.2 : 0);
  const tilt = centered * 4.2;

  const slice = document.createElement("div");
  slice.className = "slice";
  slice.style.setProperty("--z", `${z.toFixed(2)}px`);
  slice.style.setProperty("--w", `${width.toFixed(2)}px`);
  slice.style.setProperty("--h", `${height.toFixed(2)}px`);
  slice.style.setProperty("--x", `${offsetX.toFixed(2)}px`);
  slice.style.setProperty("--y", `${offsetY.toFixed(2)}px`);
  slice.style.setProperty("--tilt", `${tilt.toFixed(2)}deg`);

  const colorFactor = 1 - Math.abs(centered) * 0.33;
  slice.style.filter = `drop-shadow(0 0 ${9 + colorFactor * 14}px rgba(164, 52, 81, ${0.2 + colorFactor * 0.16}))`;

  const heart = document.createElement("div");
  heart.className = "heart";

  const light = 35 + colorFactor * 10;
  const sat = 42 + colorFactor * 18;
  heart.style.setProperty("--c1", `hsl(352 ${(sat + 6).toFixed(1)}% ${(light + 10).toFixed(1)}%)`);
  heart.style.setProperty("--c2", `hsl(355 ${sat.toFixed(1)}% ${(light + 1).toFixed(1)}%)`);
  heart.style.setProperty("--c3", `hsl(357 ${(sat - 8).toFixed(1)}% ${(light - 8).toFixed(1)}%)`);

  const sheen = document.createElement("div");
  sheen.className = "heart-surface";
  const fiber = document.createElement("div");
  fiber.className = "heart-fiber";
  const veins = document.createElement("div");
  veins.className = "heart-veins";

  heart.appendChild(sheen);
  heart.appendChild(fiber);
  heart.appendChild(veins);
  slice.appendChild(heart);
  fragment.appendChild(slice);
}

model.prepend(fragment);

const name = "ДАШЕНЬКА";
const textLayers = 14;
const textDepth = 14;
for (let i = 0; i < textLayers; i++) {
  const layer = document.createElement("div");
  layer.className = "text-layer";
  if (i === textLayers - 1) {
    layer.classList.add("text-front");
  }
  layer.textContent = name;

  const t = i / (textLayers - 1);
  const z = -textDepth / 2 + t * textDepth;
  const light = 28 + t * 48;
  layer.style.setProperty("--tz", `${z.toFixed(2)}px`);
  layer.style.color = `hsl(339 92% ${light.toFixed(1)}%)`;
  layer.style.opacity = `${(0.4 + t * 0.6).toFixed(2)}`;

  text3d.appendChild(layer);
}

let rotX = -16;
let rotY = 0;
let autoSpin = true;

let dragging = false;
let lastX = 0;
let lastY = 0;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function updateTransform() {
  model.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
}

function animate() {
  if (autoSpin && !dragging) {
    rotY += 0.4;
  }
  updateTransform();
  requestAnimationFrame(animate);
}

scene.addEventListener("pointerdown", (event) => {
  dragging = true;
  autoSpin = false;
  lastX = event.clientX;
  lastY = event.clientY;
  scene.setPointerCapture(event.pointerId);
});

scene.addEventListener("pointermove", (event) => {
  if (!dragging) return;
  const dx = event.clientX - lastX;
  const dy = event.clientY - lastY;
  rotY += dx * 0.45;
  rotX = clamp(rotX - dy * 0.35, -80, 80);
  lastX = event.clientX;
  lastY = event.clientY;
  updateTransform();
});

function endDrag() {
  dragging = false;
  setTimeout(() => {
    autoSpin = true;
  }, 450);
}

scene.addEventListener("pointerup", endDrag);
scene.addEventListener("pointercancel", endDrag);
scene.addEventListener("pointerleave", () => {
  if (!dragging) return;
  dragging = false;
  autoSpin = true;
});

updateTransform();
animate();
