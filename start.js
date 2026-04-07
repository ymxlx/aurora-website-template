import { initPageTransitions } from "./transitions.js";

document.documentElement.classList.add("js");

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// ── State ────────────────────────────────────────────────────
let currentStep = 1;
const TOTAL_STEPS = 4;

// ── Elements ─────────────────────────────────────────────────
const steps       = Array.from({ length: TOTAL_STEPS }, (_, i) => document.getElementById(`step${i + 1}`));
const btnNext     = document.getElementById("btnNext");
const btnBack     = document.getElementById("btnBack");
const progressFill= document.getElementById("progressFill");
const progressDots= document.querySelectorAll(".progress-step");
const progressBar = document.getElementById("progressBar");
const successPanel= document.getElementById("successPanel");
const formNav     = document.getElementById("formNav");
const charCount   = document.getElementById("charCount");
const textarea    = document.getElementById("projectDetails");

// ── Init ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initPageTransitions();
  showStep(1, "none");

  if (!prefersReducedMotion) {
    setupCursorGlow();
    setupMagneticButtons();
    setupTiltCards();
  }

  // Type cards — clicking anywhere on the label selects it
  document.querySelectorAll(".type-card").forEach((card) => {
    card.addEventListener("click", () => {
      // clear error if shown
      hideError("step1Error");
    });
    // keyboard accessibility: Enter/Space on the label
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.querySelector("input").click();
      }
    });
  });

  // Textarea character counter
  if (textarea) {
    textarea.addEventListener("input", () => {
      const len = textarea.value.length;
      charCount.textContent = `${len} / 600`;
      charCount.classList.toggle("near-limit", len > 500);
      if (len > 0) hideError("step2Error");
    });
  }

  // Select change → hide error
  document.getElementById("timeline")?.addEventListener("change", () => hideError("step3Error"));
  document.getElementById("budget")?.addEventListener("change", () => hideError("step3Error"));
  document.getElementById("name")?.addEventListener("input", () => hideError("step4Error"));
  document.getElementById("email")?.addEventListener("input", () => hideError("step4Error"));

  btnNext.addEventListener("click", handleNext);
  btnBack.addEventListener("click", handleBack);
});

// ── Navigation ───────────────────────────────────────────────
function handleNext() {
  if (!validateStep(currentStep)) return;

  if (currentStep === TOTAL_STEPS) {
    submitForm();
    return;
  }

  goToStep(currentStep + 1);
}

function handleBack() {
  if (currentStep > 1) goToStep(currentStep - 1);
}

function goToStep(next) {
  const prev = currentStep;
  const leaving = steps[prev - 1];

  if (!prefersReducedMotion) {
    leaving.classList.add("is-exiting");
    // Use timeout matching the stepExit animation duration (300ms)
    setTimeout(() => {
      leaving.classList.remove("is-exiting");
      leaving.hidden = true;
      currentStep = next;
      showStep(next, next > prev ? 1 : -1);
    }, 310);
  } else {
    leaving.hidden = true;
    currentStep = next;
    showStep(next, "none");
  }
}

function showStep(n, _direction) {
  const el = steps[n - 1];
  el.hidden = false;
  el.style.animation = "none";
  // Trigger reflow to restart animation
  void el.offsetWidth;
  el.style.animation = "";

  // Progress bar
  const pct = (n / TOTAL_STEPS) * 100;
  progressFill.style.width = `${pct}%`;
  progressBar.setAttribute("aria-valuenow", n);

  // Dot indicators
  progressDots.forEach((dot, i) => {
    dot.classList.remove("active", "done");
    if (i + 1 < n) dot.classList.add("done");
    if (i + 1 === n) dot.classList.add("active");
  });

  // Button labels
  btnBack.hidden = n === 1;
  btnNext.innerHTML =
    n === TOTAL_STEPS
      ? `Send brief <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>`
      : `Continue <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>`;

  // Re-register magnetic on the updated button
  if (!prefersReducedMotion) {
    setupMagneticButtons();
  }

  // Focus the step for accessibility
  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
  el.removeAttribute("tabindex");
}

// ── Validation ───────────────────────────────────────────────
function validateStep(n) {
  switch (n) {
    case 1: {
      const selected = document.querySelector('input[name="projectType"]:checked');
      if (!selected) { showError("step1Error"); return false; }
      return true;
    }
    case 2: {
      const val = textarea?.value.trim();
      if (!val || val.length < 20) { showError("step2Error"); return false; }
      return true;
    }
    case 3: {
      const tl = document.getElementById("timeline")?.value;
      const bud = document.getElementById("budget")?.value;
      if (!tl || !bud) { showError("step3Error"); return false; }
      return true;
    }
    case 4: {
      const name  = document.getElementById("name")?.value.trim();
      const email = document.getElementById("email")?.value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!name || !emailOk) { showError("step4Error"); return false; }
      return true;
    }
  }
  return true;
}

function showError(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("hidden");
  el.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function hideError(id) {
  document.getElementById(id)?.classList.add("hidden");
}

// ── Submit ───────────────────────────────────────────────────
function submitForm() {
  // Disable button and show loading state
  btnNext.disabled = true;
  btnNext.innerHTML = `
    <svg class="spin" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"
      style="animation: spin 0.8s linear infinite;">
      <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
    </svg>
    Sending…`;

  // Add spin keyframe inline
  const style = document.createElement("style");
  style.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
  document.head.appendChild(style);

  // Simulate async submission — replace with real fetch() in production
  setTimeout(() => {
    steps[currentStep - 1].hidden = true;
    formNav.hidden = true;
    progressBar.hidden = true;
    successPanel.classList.remove("hidden");

    if (!prefersReducedMotion) setupMagneticButtons();

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 1200);
}

// ── Cursor glow ──────────────────────────────────────────────
function setupCursorGlow() {
  const root = document.documentElement;
  const glow = document.querySelector(".cursor-glow");

  const update = (x, y) => {
    root.style.setProperty("--pointer-x", `${x}px`);
    root.style.setProperty("--pointer-y", `${y}px`);
    if (glow) {
      glow.style.left = `${x}px`;
      glow.style.top  = `${y}px`;
      glow.style.opacity = "1";
    }
  };

  update(window.innerWidth * 0.6, window.innerHeight * 0.3);

  window.addEventListener("pointermove", (e) => update(e.clientX, e.clientY), { passive: true });

  document.addEventListener("mouseleave", () => {
    if (glow) glow.style.opacity = "0";
  });
}

// ── Magnetic buttons ─────────────────────────────────────────
function handleMagneticMove(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const strength = Number(btn.dataset.strength || 24);
  const ox = e.clientX - rect.left - rect.width / 2;
  const oy = e.clientY - rect.top - rect.height / 2;
  btn.style.transform = `translate(${ox / strength}px, ${oy / strength}px)`;
}

function handleMagneticLeave(e) {
  e.currentTarget.style.transform = "";
}

function setupMagneticButtons() {
  document.querySelectorAll(".magnetic").forEach((btn) => {
    // Skip if already bound (prevents duplicate listeners)
    if (btn.dataset.magneticBound) return;
    btn.dataset.magneticBound = "1";
    btn.addEventListener("pointermove", handleMagneticMove);
    btn.addEventListener("pointerleave", handleMagneticLeave);
  });
}

// ── Tilt cards ───────────────────────────────────────────────
function setupTiltCards() {
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const rx = ((e.clientY - rect.top)  / rect.height - 0.5) * -7;
      const ry = ((e.clientX - rect.left) / rect.width  - 0.5) *  9;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}
