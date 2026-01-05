![Chromi](/public/OpenGraph.webp)

# Chromi

🎨 Feature-rich palette generator and analyzer using Nuxt, TypeScript, Tailwind, shadcn/ui, Pinia, chroma-js, html2canvas, and VueUse for a fast, accessible, and extensible design workflow.

## ☁️ Deploy your own

[![Deploy with Vercel](_deploy_vercel.svg)](https://vercel.com/new/clone?repository-url=https://github.com/KurutoDenzeru/Chromi)  [![Deploy with Netlify](_deploy_netlify.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/KurutoDenzeru/Chromi)

## ✨ Features

- **Multi-Mode Palette Generation:** Generate color palettes using analogous, monochrome, complementary, triadic, compound, shades, tetradic, and square color theories.
- **Random & Customizable Generation:** Create random palettes with custom color counts and instantly refresh to explore new combinations.
- **Format Conversions:** Convert colors between HEX, RGB, HSL, HWB, and other formats seamlessly with real-time updates.
- **Color Analysis & Properties:** Analyze hue, brightness, luminance, saturation, contrast, and other color metrics in-depth.
- **Quick Copy to Clipboard:** Copy individual color values or entire palettes to clipboard with instant toast notifications.
- **Export Palettes:** Export color palettes in multiple formats for use in design tools and codebases.
- **Responsive & Accessible UI:** Beautiful, mobile-first interface with sidebar controls, grid display, and accessible design patterns.

## 🧱 Tech Stack

- [Nuxt 4](https://nuxt.com/) + [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/): Modern meta-framework for fast, full-stack development.
- [Tailwind](https://tailwindcss.com/): Utility-first CSS framework for rapid, responsive styling.
- [Shadcn Vue](https://www.shadcn-vue.com/) + [Radix Vue](https://radix-vue.com/): Headless UI components and design patterns.
- [Pinia](https://pinia.vuejs.org/): Lightweight, intuitive state management for Vue 3.
- [chroma-js](https://gka.github.io/chroma.js/): Powerful color manipulation and analysis library.
- [VueUse](https://vueuse.org/): Collection of essential Vue composition utilities.

## ⚡ Getting Started

Clone the repo, install deps, and boot the dev server:

```bash
git clone https://github.com/KurutoDenzeru/Chromi.git
cd Chromi
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📦 Build for Production

```bash
bun run build
bun start
```

## 🗂️ Configuration

The editor is componentized under `app/components`. Key areas to customize are:

```text
app/
  components/
    ColorPicker.vue           # color input UI
    PaletteDisplay.vue        # palette grid & swatches
    PaletteControls.vue       # sidebar controls
  composables/
    palette/
      usePalette.ts           # palette generation logic
      usePaletteStore.ts      # Pinia store for palette state
      useColorAnalysis.ts     # color analysis helpers
  pages/                      # file-based routes (e.g., `index.vue`)
  types/                      # TypeScript types (e.g., `palette.ts`)
```

## 🤝🏻 Contributing

Contributions are always welcome, whether you’re fixing bugs, improving docs, or shipping new features that make the project better for everyone.

Check out [Contributing.md](Contributing) to learn how to get started and follow the recommended workflow.

<!-- Please adhere to this project's `Code of Conduct`. -->

## ⚖️ License

This project is released under the MIT License, giving you the freedom to use, modify, and distribute the code with minimal restrictions.

For the full legal text, see the [MIT](LICENSE) file.
