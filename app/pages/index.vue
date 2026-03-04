<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import PaletteControls from '@/components/PaletteControls.vue'
  import PaletteDisplay from '@/components/PaletteDisplay.vue'

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

  const isMounted = ref(false)
  onMounted(() => {
    isMounted.value = true
  })
</script>

<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
    <!-- Sidebar: Palette Controls (responsive: sidebar on md+, top bar on mobile) -->
    <PaletteControls v-if="isMounted" @color-input-change="handleColorInputChange" @palette-generated="handlePaletteGenerated" />

    <!-- Main Content -->
    <PaletteDisplay :palette="palette" :secondary-palette="secondaryPalette" :grid-columns="gridColumns"
      :selected-color="selectedColor" @color-selected="handleColorSelected" />
  </div>
</template>
