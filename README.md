<div align="center">

<!-- Hero Logo -->
<img src="https://raw.githubusercontent.com/yourusername/alloy/main/.github/assets/logo.svg" width="120" alt="Alloy Logo">

# Alloy

### *The Design Token Studio*

[![npm version](https://img.shields.io/npm/v/@alloy/studio?style=flat-square&colorA=0a0a0a&colorB=ffc404)](https://www.npmjs.com/package/@alloy/studio)
[![License](https://img.shields.io/github/license/yourusername/alloy?style=flat-square&colorA=0a0a0a&colorB=22c55e)](LICENSE)
[![Stars](https://img.shields.io/github/stars/yourusername/alloy?style=flat-square&colorA=0a0a0a&colorB=0ea5e9)](https://github.com/yourusername/alloy/stargazers)
[![React](https://img.shields.io/badge/React-19-0a0a0a?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-0a0a0a?style=flat-square&logo=tailwindcss&logoColor=06B6D4)](https://tailwindcss.com)

**Build, visualize, and export complete design systems — primitives, semantics, typography, and utilities — in one reactive studio.**

[🚀 Live Demo](https://giovannicaiazzo01.github.io/Alloy/)

</div>

---

<div align="center">
  <img src="https://raw.githubusercontent.com/yourusername/alloy/main/.github/assets/hero.png" width="100%" alt="Alloy Studio Interface">
</div>

## ✨ What is Alloy?

Alloy is a **visual design token editor** that lets you construct entire design systems from the ground up. Instead of hand-writing hundreds of CSS variables, you:

1. **Define primitives** — 9-step color scales (100→900) for any palette.
2. **Map semantics** — Alias tokens like `background-neutral-primary` to `grey.100`.
3. **Tune typography** — Size, line-height, letter-spacing, and weight per token.
4. **Export** — Generate production-ready **Tailwind v4** CSS with `@theme`, `@utility`, and breakpoints.

> *Primitives are raw ore. Semantics are the alloy. This is the forge.*

---

## 🎬 Features

<table>
<tr>
<td width="50%">

#### 🎨 Primitive Scales
Create and edit full 9-step color scales. Add custom palettes (e.g., `teal`, `rose`, `sand`) dynamically. Every hex value updates the live preview instantly.

</td>
<td width="50%">

#### 🔗 Semantic Aliasing
Map meaningful names to primitives. Change `grey.100` once, and every `background-neutral-*` token updates automatically. No find-and-replace hell.

</td>
</tr>
<tr>
<td width="50%">

#### 🔤 Typography System
Define role-based tokens like `caption`, `body`, `title-large`, and `display-large` with precise control over size, line-height, letter-spacing, and weight. See live specimens render in your chosen Google Font.

</td>
<td width="50%">

#### ⚡️ Tailwind v4 Export
Generates a single `.css` file with `@theme`, `@utility`, breakpoints, and semantic mappings. Drop it into any Tailwind v4 project and go.

</td>
</tr>
<tr>
<td width="50%">

#### 🌗 Self-Theming Studio
The entire application chrome adapts to your active token set. Designing a dark mode system? The studio goes dark. Light mode? It glows. The tool *is* the preview.

</td>
<td width="50%">

#### 📋 One-Click Copy
Copy the full generated CSS to your clipboard in one click. No build step, no config file wrangling.

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites
- Node.js `>= 18`
- React `>= 18`

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/alloy.git
cd alloy

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open `http://localhost:5173` and start forging tokens.

---

## 📖 Usage

### 1. Define Primitives

Start with your base color scales. Alloy ships with sensible defaults for `grey`, `primary`, `secondary`, and `pink`, but you can add any scale you need.

```css
/* Generated output */
@theme {
  --color-grey-100: #f4f4f2;
  --color-grey-200: #eae9e5;
  --color-grey-300: #dfddd8;
  --color-grey-400: #cac7be;
  --color-grey-500: #a29f98;
  --color-grey-600: #797772;
  --color-grey-700: #51504c;
  --color-grey-800: #282826;
  --color-grey-900: #0a0a0a;

  --color-primary-500: #ffc404;
  /* ... */
}
```

### 2. Map Semantics

Create aliases that describe *intent*, not *value*.

```css
@theme {
  --color-background-neutral-primary: var(--color-grey-100);
  --color-text-neutral-primary: var(--color-grey-900);
  --color-border-neutral-active: var(--color-primary-500);
}
```

### 3. Set Typography

Configure your type scale with exact measurements.

```css
@theme {
  --text-display-large: 3.063rem;
  --text-display-large--line-height: 120%;
  --text-display-large--letter-spacing: 0;
}

@utility type-display-large {
  font-family: var(--font-sans);
  font-size: var(--text-display-large);
  line-height: var(--text-display-large--line-height);
  letter-spacing: var(--text-display-large--letter-spacing);
  font-weight: 500;
}
```

### 4. Export & Ship

Click **Export** → **Copy CSS** → Paste into your `globals.css`. Done.

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────┐
│              Alloy Studio Shell              │
│  (Self-themed via active design tokens)      │
├──────────────┬──────────────┬───────────────┤
│  Presets     │   Editor     │   Live        │
│  Sidebar     │   Tabs       │   Preview     │
│              │              │   Panel       │
│  • Manrope   │  • Primitives│               │
│  • Midnight  │  • Semantics │  • Mock UI    │
│  • Custom    │  • Typography│  • Type Spec  │
└──────────────┴──────────────┴───────────────┘
                      │
                      ▼
            ┌──────────────────┐
            │  Export Engine   │
            │  (Tailwind v4)   │
            └──────────────────┘
```

- **React + Hooks** — State is lifted to the root; every panel reacts to token changes.
- **Dynamic Font Loading** — Google Fonts are injected via `<link>` when you change the font family.
- **Semantic Resolver** — `resolveToken()` maps `scale.step` references to hex values in real time.
- **Shell Theme Hook** — `useShellTheme()` computes the entire app chrome from your semantic tokens, so the editor *becomes* your design.

---

## 🛠 Export Formats

| Format | Status | Notes |
|--------|--------|-------|
| **Tailwind v4** | ✅ Ready | `@theme`, `@utility`, `@import "tailwindcss"` |
| **CSS Variables** | ✅ Ready | Plain `:root` custom properties |
| **Tailwind v3** | 🚧 Planned | `tailwind.config.js` object export |
| **Style Dictionary** | 🚧 Planned | JSON for multi-platform builds |
| **Figma Variables** | 💡 Idea | Plugin for bi-directional sync |

---

## 🧩 Built With

- [React](https://react.dev) — UI framework
- [Tailwind CSS](https://tailwindcss.com) — The target system
- [Lucide React](https://lucide.dev) — Iconography
- [Google Fonts API](https://fonts.google.com) — Dynamic font loading

---

## 🤝 Contributing

We welcome contributions! Whether it's a new preset, an export format, or a bug fix:

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

Please read our [Contributing Guide](CONTRIBUTING.md) for code standards and commit conventions.

---

## 📜 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

<div align="center">

**Made with 🔥 by the Alloy community**

[⬆ Back to Top](#alloy)

</div>
