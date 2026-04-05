<script setup lang="ts">
import PaletteSelectionPanel from '@/components/palette/PaletteSelectionPanel.vue'
import PaletteColorAnalysisPanel from '@/components/palette/PaletteColorAnalysisPanel.vue'
import PaletteColorConversionsPanel from '@/components/palette/PaletteColorConversionsPanel.vue'
import ExportPaletteDialog from '@/components/ExportPaletteDialog.vue'

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
  <aside class="flex h-full flex-col">
    <div class="flex-1 overflow-y-auto p-3 sm:p-4">
      <PaletteSelectionPanel
        :selected-color="selectedColor"
        :selected-swatch-style="selectedSwatchStyle"
        :key-metrics="keyMetrics"
        :export-palette="exportPalette"
      />

      <PaletteColorAnalysisPanel :color-analysis="colorAnalysis" />

      <PaletteColorConversionsPanel :conversion-rows="conversionRows" />
    </div>

    <div class="shrink-0 border-t border-border/60 p-4">
      <ExportPaletteDialog :palette="exportPalette" :is-loading="false" />
    </div>
  </aside>
</template>
