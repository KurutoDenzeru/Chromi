<script setup lang="ts">
import { ref } from 'vue'
import PaletteDisplay from '@/components/PaletteDisplay.vue'

const selectedColor = ref<string>('#dc143c')

const handleColorSelected = (color: string) => {
  selectedColor.value = color
}
</script>

<template>
  <div class="relative min-h-screen bg-background text-foreground">
    <PaletteDisplay
      :selected-color="selectedColor"
      @color-selected="handleColorSelected"
    />
  </div>
</template>
