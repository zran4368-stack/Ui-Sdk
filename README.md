# Blazer CSS++

Blazer CSS++ adalah paket npm vanilla CSS + JavaScript untuk membuat UI dengan animasi, gradient, glow, efek kaca, pantulan, ripple, modal, toast, tabs, tilt, dan command palette tanpa framework.

Nama produk: **Blazer CSS++**  
Nama package npm: `blazer-css-plus-plus`

`++` tidak dipakai di nama package agar aman untuk registry npm dan import path.

## Install

```bash
npm install blazer-css-plus-plus
```

```js
import "blazer-css-plus-plus/blazer.css";
import { initBlazer, animate, showToast } from "blazer-css-plus-plus";

initBlazer();
animate(".hero-card", "rise", { stagger: 80 });
showToast({ title: "Blazer", message: "UI aktif." });
```

## HTML Cepat

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
    <p>Gradient, glow, reflection, dan motion aktif.</p>
  </article>
</body>
```

## API

- `initBlazer(root)`: scan atribut `data-bz-*` dan aktifkan behavior.
- `animate(targets, preset, options)`: jalankan preset animasi.
- `showToast({ title, message, timeout })`: tampilkan toast.
- `openModal(element)` / `closeModal(element)`: kontrol dialog.
- `openCommand()` / `closeCommand()`: kontrol command palette.

Preset animasi: `rise`, `pop`, `blaze`, `float`, `pulse`.

## Atribut

- `data-bz-ripple`: efek ripple pada klik.
- `data-bz-tilt="8"`: tilt 3D mengikuti pointer.
- `data-bz-animate="rise"`: animasi saat elemen masuk viewport.
- `data-bz-modal-open="modal-id"` dan `data-bz-modal-close`: kontrol modal.
- `data-bz-toast="Pesan"` dan `data-bz-toast-title="Judul"`: toast.
- `data-bz-tabs`: aktifkan tab dengan role ARIA.
- `data-bz-command-open`: buka command palette.

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

Buka `http://localhost:4173`.
