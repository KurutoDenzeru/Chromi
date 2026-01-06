<script setup lang="ts">
  import { ref } from 'vue'
  import PaletteControls from '@/components/PaletteControls.vue'
  import PaletteDisplay from '@/components/PaletteDisplay.vue'
  import { useHead } from 'nuxt/app'

  // State for communication between components
  const palette = ref<{ hex: string; rgba: string }[]>([])
  const secondaryPalette = ref<{ hex: string; rgba: string }[]>([])
  const selectedColor = ref<string>('#dc143c')
  const gridColumns = ref<number>(16)

  // Handle events from PaletteControls
  const handleColorInputChange = (color: string) => {
    selectedColor.value = color
  }

  const handlePaletteGenerated = (data: { palette: any[], secondaryPalette: any[] }) => {
    palette.value = data.palette
    secondaryPalette.value = data.secondaryPalette
  }

  // Handle events from PaletteDisplay
  const handleColorSelected = (color: string) => {
    selectedColor.value = color
  }

  const siteUrl = 'https://chromi.vercel.app'
  const pageTitle = 'Chromi – Color Palette Generator'
  const pageDescription = '🎨 Feature-rich palette generator and analyzer using Nuxt, TypeScript, Tailwind, shadcn/ui, Pinia, chroma-js, html2canvas, and VueUse for a fast, accessible, and extensible design workflow.'

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}#organization`,
        "name": "Chromi",
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/brand.webp`
        }
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        "url": siteUrl,
        "name": pageTitle,
        "publisher": { "@id": `${siteUrl}#organization` }
      },
      {
        "@type": "WebPage",
        "@id": `${siteUrl}#webpage`,
        "url": siteUrl,
        "inLanguage": "en-US",
        "name": pageTitle,
        "isPartOf": { "@id": `${siteUrl}#website` },
        "description": pageDescription,
        "publisher": { "@id": `${siteUrl}#organization` }
      }
    ]
  }

  useHead({
    title: pageTitle,
    htmlAttrs: { lang: 'en' },
    base: { href: `${siteUrl}/` },
    link: [
      { rel: 'icon', href: '/brand.webp', type: 'image/webp' },
      { rel: 'apple-touch-icon', href: '/brand.webp' },
      { rel: 'canonical', href: `${siteUrl}/` },
      { rel: 'alternate', href: `${siteUrl}/`, hreflang: 'en' },
      { rel: 'alternate', href: `${siteUrl}/`, hreflang: 'x-default' }
    ],
    meta: [
      { name: 'description', content: pageDescription },
      { name: 'keywords', content: 'color palette, palette generator, color analyzer, nuxt, typescript, tailwind, shadcn, ui, pinia, chroma-js, html2canvas, vueuse' },
      { name: 'robots', content: 'index,follow' },
      { name: 'author', content: 'Kurt Calacday' },
      { name: 'creator', content: 'Kurt Calacday' },
      { name: 'publisher', content: 'Kurt Calacday' },
      { name: 'theme-color', content: '#000000' },

      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: pageTitle },
      { property: 'og:description', content: pageDescription },
      { property: 'og:image', content: `${siteUrl}/OpenGraph.webp` },
      { property: 'og:url', content: `${siteUrl}/` },
      { property: 'og:site_name', content: 'Chromi' },
      { property: 'og:locale', content: 'en_US' },
      { property: 'og:image:alt', content: 'Chromi Open Graph Image' },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: pageTitle },
      { name: 'twitter:description', content: pageDescription },
      { name: 'twitter:image', content: `${siteUrl}/OpenGraph.webp` }
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(structuredData)
      }
    ]
  })
</script>

<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
    <!-- Sidebar: Palette Controls (responsive: sidebar on md+, top bar on mobile) -->
    <PaletteControls @color-input-change="handleColorInputChange" @palette-generated="handlePaletteGenerated" />

    <!-- Main Content -->
    <PaletteDisplay :palette="palette" :secondary-palette="secondaryPalette" :grid-columns="gridColumns"
      :selected-color="selectedColor" @color-selected="handleColorSelected" />
  </div>
</template>