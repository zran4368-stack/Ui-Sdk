# Blazer CSS++

Blazer CSS++ is a vanilla CSS + JavaScript npm package for building polished UI with animations, gradients, glow, glass surfaces, reflections, ripple effects, modals, toasts, tabs, tilt interactions, and a command palette without a framework.

Product name: **Blazer CSS++**  
npm package name: `blazer-css-plus-plus`

The package name uses `plus-plus` instead of `++` so it stays safe for npm registry names and import paths.

## Install

```bash
npm install blazer-css-plus-plus
```

```js
import "blazer-css-plus-plus/blazer.css";
import { initBlazer, animate, showToast } from "blazer-css-plus-plus";

initBlazer();
animate(".hero-card", "rise", { stagger: 80 });
showToast({ title: "Blazer", message: "UI is ready." });
```

## Quick HTML

```html
<link rel="stylesheet" href="./blazer.css">
<script type="module" src="./blazer.js"></script>
```

```html
<body class="bz-theme">
  <button class="bz-btn bz-btn-primary" data-bz-ripple>
    Launch
  </button>

  <article class="bz-card bz-reflect" data-bz-tilt="8" data-bz-animate="rise">
    <h3>Glass card</h3>
    <p>Gradient, glow, reflection, and motion are active.</p>
  </article>
</body>
```

## API

- `initBlazer(root)`: scans `data-bz-*` attributes and activates UI behavior.
- `animate(targets, preset, options)`: runs an animation preset.
- `showToast({ title, message, timeout })`: displays a toast.
- `openModal(element)` / `closeModal(element)`: controls dialogs.
- `openCommand()` / `closeCommand()`: controls the command palette.

Animation presets: `rise`, `pop`, `blaze`, `float`, `pulse`.

## Attributes

- `data-bz-ripple`: adds a click ripple effect.
- `data-bz-tilt="8"`: adds 3D pointer tilt.
- `data-bz-animate="rise"`: animates an element when it enters the viewport.
- `data-bz-modal-open="modal-id"` and `data-bz-modal-close`: controls modals.
- `data-bz-toast="Message"` and `data-bz-toast-title="Title"`: displays a toast.
- `data-bz-tabs`: activates ARIA-based tabs.
- `data-bz-command-open`: opens the command palette.

## Publish

```bash
npm login
npm run check
npm run pack:dry
npm publish --access public
```

## Demo

```bash
npm start
```

Open `http://localhost:4173`.
