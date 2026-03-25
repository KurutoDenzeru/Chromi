<script setup lang="ts">
import PaletteSelectionPanel from '@/components/palette/PaletteSelectionPanel.vue'
import PaletteColorAnalysisPanel from '@/components/palette/PaletteColorAnalysisPanel.vue'
import PaletteColorConversionsPanel from '@/components/palette/PaletteColorConversionsPanel.vue'

defineProps<{
  selectedColor: string
  selectedSwatchStyle: { background: string }
  keyMetrics: { label: string; value: string }[]
  exportPalette: { hex: string }[]
  colorAnalysis: {
    isValid: boolean
    format: string
    hue: number
    brightness: number
    luminance: number
    contrast: number
  }
  conversionRows: { label: string; value: string }[]
}>()
</script>

<template>
  <aside>
    <div class="h-full p-3 sm:p-4">
      <PaletteSelectionPanel
        :selected-color="selectedColor"
        :selected-swatch-style="selectedSwatchStyle"
        :key-metrics="keyMetrics"
        :export-palette="exportPalette"
      />

      <PaletteColorAnalysisPanel :color-analysis="colorAnalysis" />

      <PaletteColorConversionsPanel :conversion-rows="conversionRows" />
    </div>
  </aside>
</template>
