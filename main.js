import { initPageTransitions } from "./transitions.js";

document.documentElement.classList.add("js");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("DOMContentLoaded", () => {
  initPageTransitions();
  const animatedElements = document.querySelectorAll("[data-animate]");

  animatedElements.forEach((element) => {
    const delay = element.dataset.delay;
    if (delay) {
      element.style.setProperty("--delay", `${delay}ms`);
    }
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  animatedElements.forEach((element) => revealObserver.observe(element));

  const counters = document.querySelectorAll("[data-count]");
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.7 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  if (prefersReducedMotion) {
    return;
  }

  setupCursorGlow();
  setupMagneticButtons();
  setupTiltCards();
  setupSceneParallax();
});

function animateCounter(counter) {
  const target = Number(counter.dataset.count);
  const duration = 1300;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.round(target * eased);

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
}

function setupCursorGlow() {
  const root = document.documentElement;
  const updatePointer = (x, y) => {
    root.style.setProperty("--pointer-x", `${x}px`);
    root.style.setProperty("--pointer-y", `${y}px`);
  };

  updatePointer(window.innerWidth * 0.65, window.innerHeight * 0.2);

  window.addEventListener("pointermove", (event) => {
    updatePointer(event.clientX, event.clientY);
  });
}

function setupMagneticButtons() {
  const buttons = document.querySelectorAll(".magnetic");

  buttons.forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const strength = Number(button.dataset.strength || 24);
      const offsetX = event.clientX - rect.left - rect.width / 2;
      const offsetY = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${offsetX / strength}px, ${offsetY / strength}px)`;
    });

    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  });
}

function setupTiltCards() {
  const cards = document.querySelectorAll(".tilt-card");

  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
      const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

function setupSceneParallax() {
  const scene = document.querySelector(".hero-scene");
  const sceneLayers = document.querySelectorAll(".scene-halo");

  if (!scene || !sceneLayers.length) {
    return;
  }

  scene.addEventListener("pointermove", (event) => {
    const rect = scene.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    sceneLayers.forEach((layer, index) => {
      const depth = (index + 1) * 6;
      layer.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
    });
  });

  scene.addEventListener("pointerleave", () => {
    sceneLayers.forEach((layer) => {
      layer.style.transform = "";
    });
  });
}
