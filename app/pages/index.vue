<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PaletteControls from '@/components/PaletteControls.vue'
import PaletteDisplay from '@/components/PaletteDisplay.vue'

const palette = ref<{ hex: string; rgba: string }[]>([])
const secondaryPalette = ref<{ hex: string; rgba: string }[]>([])
const selectedColor = ref<string>('#dc143c')
const gridColumns = ref<number>(16)

const handleColorInputChange = (color: string) => {
  selectedColor.value = color
}

const handlePaletteGenerated = (data: { palette: { hex: string; rgba: string }[]; secondaryPalette: { hex: string; rgba: string }[] }) => {
  palette.value = data.palette
  secondaryPalette.value = data.secondaryPalette
}

const handleColorSelected = (color: string) => {
  selectedColor.value = color
}

const handleGridColumnsChange = (value: number) => {
  gridColumns.value = value
}

const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
</script>

<template>
  <div class="relative min-h-screen bg-background text-foreground">
    <PaletteControls
      v-if="isMounted"
      @color-input-change="handleColorInputChange"
      @palette-generated="handlePaletteGenerated"
      @grid-columns-change="handleGridColumnsChange"
    />

    <PaletteDisplay
      :palette="palette"
      :secondary-palette="secondaryPalette"
      :grid-columns="gridColumns"
      :selected-color="selectedColor"
      @color-selected="handleColorSelected"
    />
  </div>
</template>
