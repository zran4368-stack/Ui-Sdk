const canUseDom = typeof window !== "undefined" && typeof document !== "undefined";

const SELECTORS = {
  ripple: "[data-bz-ripple]",
  tilt: "[data-bz-tilt]",
  shine: ".bz-band, .bz-card",
  animate: "[data-bz-animate]",
  modalOpen: "[data-bz-modal-open]",
  modalClose: "[data-bz-modal-close]",
  toast: "[data-bz-toast]",
  tabs: "[data-bz-tabs]",
  commandOpen: "[data-bz-command-open]",
  commandClose: "[data-bz-command-close]",
};

const state = {
  lastFocus: null,
};

const ANIMATIONS = {
  rise: [
    { opacity: 0, transform: "translate3d(0, 22px, 0) scale(0.98)", filter: "blur(10px)" },
    { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)", filter: "blur(0)" },
  ],
  pop: [
    { opacity: 0, transform: "scale(0.88)" },
    { opacity: 1, transform: "scale(1.035)", offset: 0.72 },
    { opacity: 1, transform: "scale(1)" },
  ],
  blaze: [
    { opacity: 0, transform: "translate3d(-18px, 0, 0)", boxShadow: "0 0 0 rgba(102, 228, 255, 0)" },
    { opacity: 1, transform: "translate3d(0, 0, 0)", boxShadow: "0 0 48px rgba(102, 228, 255, 0.28)" },
  ],
  float: [
    { transform: "translate3d(0, 6px, 0)" },
    { transform: "translate3d(0, -6px, 0)" },
  ],
  pulse: [
    { transform: "scale(1)", filter: "brightness(1)" },
    { transform: "scale(1.025)", filter: "brightness(1.18)" },
    { transform: "scale(1)", filter: "brightness(1)" },
  ],
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function ensureToastHost() {
  if (!canUseDom) return null;
  let host = document.querySelector(".bz-toast-host");
  if (!host) {
    host = document.createElement("div");
    host.className = "bz-toast-host";
    host.setAttribute("aria-live", "polite");
    document.body.append(host);
  }
  return host;
}

function createRipple(event) {
  const target = event.currentTarget;
  if (target.dataset.bzRippleBusy === "true") return;
  const rect = target.getBoundingClientRect();
  const ripple = document.createElement("span");

  ripple.className = "bz-ripple-dot";
  ripple.style.left = `${event.clientX - rect.left}px`;
  ripple.style.top = `${event.clientY - rect.top}px`;
  target.append(ripple);
  ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
}

function updatePointerVars(event) {
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
  const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100);

  target.style.setProperty("--bz-mx", `${x}%`);
  target.style.setProperty("--bz-my", `${y}%`);
  target.style.setProperty("--bz-reflect-x", `${x - 50}%`);
  target.style.setProperty("--bz-reflect-y", `${y - 50}%`);
}

function attachTilt(element) {
  if (element.dataset.bzBoundTilt === "true") return;
  element.dataset.bzBoundTilt = "true";
  const maxTilt = Number(element.dataset.bzTilt || 8);

  element.addEventListener("pointermove", (event) => {
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    element.style.transform = `perspective(900px) rotateX(${(-y * maxTilt).toFixed(2)}deg) rotateY(${(x * maxTilt).toFixed(2)}deg) translateY(-2px)`;
  });

  element.addEventListener("pointerleave", () => {
    element.style.transform = "";
  });
}

function getModal(id) {
  if (!canUseDom || !id) return null;
  return document.getElementById(id.replace("#", ""));
}

function openModal(modal) {
  if (!modal) return;
  state.lastFocus = document.activeElement;
  modal.dataset.open = "true";
  modal.setAttribute("aria-hidden", "false");
  const focusTarget = modal.querySelector("[autofocus], button, input, select, textarea, a[href]");
  focusTarget?.focus();
}

function closeModal(modal) {
  if (!modal) return;
  modal.dataset.open = "false";
  modal.setAttribute("aria-hidden", "true");
  state.lastFocus?.focus?.();
}

function showToast(options = {}) {
  const host = ensureToastHost();
  if (!host) return null;
  const toast = document.createElement("div");
  const title = options.title || "Blazer CSS++";
  const message = options.message || "Efek visual aktif.";
  const timeout = Number(options.timeout || 3600);

  toast.className = "bz-toast";
  toast.innerHTML = `
    <div>
      <strong></strong>
      <span></span>
    </div>
    <button type="button" aria-label="Tutup toast">x</button>
  `;

  toast.querySelector("strong").textContent = title;
  toast.querySelector("span").textContent = message;
  toast.querySelector("button").addEventListener("click", () => toast.remove());
  host.append(toast);

  window.setTimeout(() => toast.remove(), timeout);
  return toast;
}

function initTabs(root) {
  if (root.dataset.bzBoundTabs === "true") return;
  root.dataset.bzBoundTabs = "true";
  const tabs = Array.from(root.querySelectorAll("[role='tab']"));
  const panels = Array.from(root.querySelectorAll("[role='tabpanel']"));

  function activate(tab) {
    tabs.forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
    panels.forEach((panel) => {
      panel.dataset.active = String(panel.id === tab.getAttribute("aria-controls"));
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activate(tab));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === "ArrowLeft" ? -1 : 1;
      const nextIndex = event.key === "Home"
        ? 0
        : event.key === "End"
          ? tabs.length - 1
          : (index + direction + tabs.length) % tabs.length;
      tabs[nextIndex].focus();
      activate(tabs[nextIndex]);
    });
  });
}

function ensureCommandPalette() {
  if (!canUseDom) return null;
  let command = document.querySelector(".bz-command");
  if (command) return command;

  command = document.createElement("div");
  command.className = "bz-command";
  command.dataset.open = "false";
  command.innerHTML = `
    <div class="bz-command-box" role="dialog" aria-modal="true" aria-label="Command palette">
      <input type="search" placeholder="Cari aksi UI..." aria-label="Cari aksi">
      <ul class="bz-command-list"></ul>
    </div>
  `;
  document.body.append(command);

  const actions = [
    { label: "Tampilkan toast", hint: "Feedback", run: () => showToast({ title: "Toast", message: "Komponen toast berjalan." }) },
    { label: "Buka modal demo", hint: "Dialog", run: () => openModal(getModal("bz-demo-modal")) },
    { label: "Scroll ke komponen", hint: "Navigate", run: () => document.querySelector("#components")?.scrollIntoView({ behavior: "smooth" }) },
  ];

  const input = command.querySelector("input");
  const list = command.querySelector(".bz-command-list");

  function render(filter = "") {
    const query = filter.trim().toLowerCase();
    const results = actions.filter((item) => item.label.toLowerCase().includes(query) || item.hint.toLowerCase().includes(query));
    list.innerHTML = "";
    results.forEach((item, index) => {
      const row = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.active = String(index === 0);
      button.innerHTML = `<span></span><small></small>`;
      button.querySelector("span").textContent = item.label;
      button.querySelector("small").textContent = item.hint;
      button.addEventListener("click", () => {
        closeCommand(command);
        item.run();
      });
      row.append(button);
      list.append(row);
    });
  }

  input.addEventListener("input", () => render(input.value));
  command.addEventListener("click", (event) => {
    if (event.target === command) closeCommand(command);
  });

  render();
  return command;
}

function resolveElements(targets) {
  if (!canUseDom || !targets) return [];
  if (typeof targets === "string") return Array.from(document.querySelectorAll(targets));
  if (targets instanceof Element) return [targets];
  if (targets instanceof NodeList || Array.isArray(targets)) return Array.from(targets);
  return [];
}

function animate(targets, preset = "rise", options = {}) {
  const keyframes = ANIMATIONS[preset] || ANIMATIONS.rise;
  const config = {
    duration: Number(options.duration || 560),
    delay: Number(options.delay || 0),
    easing: options.easing || "cubic-bezier(0.2, 0.8, 0.2, 1)",
    fill: options.fill || "both",
    iterations: options.iterations || 1,
  };

  return resolveElements(targets).map((element, index) => {
    const stagger = Number(options.stagger || 0) * index;
    if (typeof element.animate !== "function") {
      element.classList.add(`bz-animate-${preset}`);
      return null;
    }
    return element.animate(keyframes, { ...config, delay: config.delay + stagger });
  });
}

function initAutoAnimations(root) {
  const elements = Array.from(root.querySelectorAll(SELECTORS.animate));
  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => animate(element, element.dataset.bzAnimate));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      if (element.dataset.bzAnimated === "true") return;
      element.dataset.bzAnimated = "true";
      animate(element, element.dataset.bzAnimate, {
        delay: Number(element.dataset.bzDelay || 0),
        duration: Number(element.dataset.bzDuration || 560),
      });
      observer.unobserve(element);
    });
  }, { threshold: 0.18 });

  elements.forEach((element) => observer.observe(element));
}

function openCommand(command) {
  if (!canUseDom) return;
  const target = command || ensureCommandPalette();
  if (!target) return;
  state.lastFocus = document.activeElement;
  target.dataset.open = "true";
  target.querySelector("input").value = "";
  target.querySelector("input").dispatchEvent(new Event("input"));
  target.querySelector("input").focus();
}

function closeCommand(command) {
  if (!canUseDom) return;
  const target = command || document.querySelector(".bz-command");
  if (!target) return;
  target.dataset.open = "false";
  state.lastFocus?.focus?.();
}

function bindOnce(element, key, event, handler) {
  const flag = `bzBound${key}`;
  if (element.dataset[flag] === "true") return;
  element.dataset[flag] = "true";
  element.addEventListener(event, handler);
}

function initBlazer(root = canUseDom ? document : null) {
  if (!canUseDom || !root) return;
  root.querySelectorAll(SELECTORS.ripple).forEach((element) => {
    bindOnce(element, "Ripple", "click", createRipple);
  });

  root.querySelectorAll(SELECTORS.shine).forEach((element) => {
    bindOnce(element, "Shine", "pointermove", updatePointerVars);
  });

  root.querySelectorAll(SELECTORS.tilt).forEach(attachTilt);
  root.querySelectorAll(SELECTORS.tabs).forEach(initTabs);
  initAutoAnimations(root);

  root.querySelectorAll(SELECTORS.modalOpen).forEach((button) => {
    bindOnce(button, "ModalOpen", "click", () => openModal(getModal(button.dataset.bzModalOpen)));
  });

  root.querySelectorAll(SELECTORS.modalClose).forEach((button) => {
    bindOnce(button, "ModalClose", "click", () => closeModal(button.closest(".bz-modal-root")));
  });

  root.querySelectorAll(".bz-modal-root").forEach((modal) => {
    bindOnce(modal, "ModalBackdrop", "click", (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });

  root.querySelectorAll(SELECTORS.toast).forEach((button) => {
    bindOnce(button, "Toast", "click", () => showToast({
      title: button.dataset.bzToastTitle || "Blazer CSS++",
      message: button.dataset.bzToast || "Aksi berhasil dijalankan.",
    }));
  });

  root.querySelectorAll(SELECTORS.commandOpen).forEach((button) => {
    bindOnce(button, "CommandOpen", "click", () => openCommand());
  });

  root.querySelectorAll(SELECTORS.commandClose).forEach((button) => {
    bindOnce(button, "CommandClose", "click", () => closeCommand());
  });

  if (document.documentElement.dataset.bzBoundKeys !== "true") {
    document.documentElement.dataset.bzBoundKeys = "true";
    document.addEventListener("keydown", (event) => {
      const isCommandShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
      if (isCommandShortcut) {
        event.preventDefault();
        openCommand();
      }

      if (event.key === "Escape") {
        closeCommand();
        closeModal(document.querySelector(".bz-modal-root[data-open='true']"));
      }
    });
  }

  ensureCommandPalette();
}

if (canUseDom && document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => initBlazer());
} else if (canUseDom) {
  initBlazer();
}

if (canUseDom) {
  window.Blazer = {
    init: initBlazer,
    toast: showToast,
    animate,
    openModal,
    closeModal,
    openCommand,
    closeCommand,
  };
}

export {
  initBlazer,
  showToast,
  animate,
  openModal,
  closeModal,
  openCommand,
  closeCommand,
};
