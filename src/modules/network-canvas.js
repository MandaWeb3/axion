import { prefersReducedMotion } from './preferences.js';

const LINK_DISTANCE = 140;
const MAX_NODES = 90;
const AREA_PER_NODE = 16000;
const MAX_SPEED = 0.125;
const NODE_RADIUS = 1.6;
const MAX_PIXEL_RATIO = 2;
const RESIZE_DEBOUNCE_MS = 150;

/**
 * Drifting node network behind the Digital Future Fund section. Animates only
 * while the canvas is on screen; with reduced motion it draws a single frame.
 */
export function initNetworkCanvas() {
  const canvas = document.getElementById('net');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let nodes = [];
  let frameId = 0;

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance >= LINK_DISTANCE) continue;
        ctx.strokeStyle = `rgba(48, 230, 248, ${(1 - distance / LINK_DISTANCE) * 0.28})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
    ctx.fillStyle = 'rgba(120, 200, 255, .8)';
    for (const node of nodes) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    // Mobile browsers fire resize when the URL bar collapses; only rebuild on a real size change.
    if (rect.width === width && rect.height === height) return;
    width = rect.width;
    height = rect.height;

    const pixelRatio = Math.min(MAX_PIXEL_RATIO, window.devicePixelRatio || 1);
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const count = Math.round(Math.min(MAX_NODES, (width * height) / AREA_PER_NODE));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2 * MAX_SPEED,
      vy: (Math.random() - 0.5) * 2 * MAX_SPEED,
    }));
    draw();
  };

  const tick = () => {
    for (const node of nodes) {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;
    }
    draw();
    frameId = requestAnimationFrame(tick);
  };

  resize();
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, RESIZE_DEBOUNCE_MS);
  });

  if (prefersReducedMotion) return;

  new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting && !frameId) {
        frameId = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && frameId) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      }
    }
  }).observe(canvas);
}
