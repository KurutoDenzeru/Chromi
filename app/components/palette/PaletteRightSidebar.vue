<script setup lang="ts">
  import { Pipette } from 'lucide-vue-next'
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
    <div class="shrink-0 px-4 py-4">
      <div class="flex items-center gap-2">
        <Pipette class="h-4 w-4 text-cyan-500 dark:text-cyan-200" />
        <h2 class="text-sm font-semibold tracking-wide text-foreground">Color Inspector</h2>
      </div>
      <p class="mt-1 text-xs text-muted-foreground">Detailed swatch analysis</p>
    </div>

    <div class="flex-1 overflow-y-auto border-t border-border/60 p-3 sm:p-4">
      <PaletteSelectionPanel :selected-color="selectedColor" :selected-swatch-style="selectedSwatchStyle"
        :key-metrics="keyMetrics" :export-palette="exportPalette" />

      <PaletteColorAnalysisPanel :color-analysis="colorAnalysis" />

      <PaletteColorConversionsPanel :conversion-rows="conversionRows" />
    </div>

    <div class="shrink-0 border-t border-border/60 p-4">
      <ExportPaletteDialog :palette="exportPalette" :is-loading="false" />
    </div>
  </aside>
</template>
