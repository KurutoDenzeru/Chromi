<script setup lang="ts">
  import { ref } from 'vue'
  import PaletteControls from '@/components/PaletteControls.vue'
  import PaletteDisplay from '@/components/PaletteDisplay.vue'
  import { useHead, useSeoMeta } from 'nuxt/app'

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

  useHead({
    title: 'Chromi – Modern Color Palette Generator',
    htmlAttrs: { lang: 'en' },
    link: [
      { rel: 'icon', type: 'image/webp', href: '/brand.webp' }
    ]
  })

  useSeoMeta({
    title: 'Chromi – Modern Color Palette Generator',
    description: '🎨 Feature-rich color palette tool using Nuxt, TypeScript, Tailwind, and Shadcn/ui, letting designers generate palettes across color theories, analyze properties, export formats, and enjoy a responsive, elegant interface.',
    ogTitle: 'Chromi – Modern Color Palette Generator',
    ogDescription: '🎨 Feature-rich color palette tool using Nuxt, TypeScript, Tailwind, and Shadcn/ui, letting designers generate palettes across color theories, analyze properties, export formats, and enjoy a responsive, elegant interface.',
    ogImage: '/OpenGraph.webp',
    ogUrl: 'https://chromi.vercel.app/',
    twitterTitle: 'Chromi – Modern Color Palette Generator',
    twitterDescription: '🎨 Feature-rich color palette tool using Nuxt, TypeScript, Tailwind, and Shadcn/ui, letting designers generate palettes across color theories, analyze properties, export formats, and enjoy a responsive, elegant interface.',
    twitterImage: '/OpenGraph.webp',
    twitterCard: 'summary_large_image',
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