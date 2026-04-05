<script setup lang="ts">
import { Activity } from 'lucide-vue-next'

defineProps<{
  colorAnalysis: {
    isValid: boolean
    format: string
    hue: number
    brightness: number
    luminance: number
    contrast: number
  }
}>()
</script>

<template>
  <section class="border-b border-border/60 py-3">
    <div class="mb-2 flex items-center gap-2.5 text-foreground">
      <Activity class="h-4 w-4 text-cyan-500 dark:text-cyan-200" />
      <div>
        <h2 class="text-sm font-semibold tracking-wide">Color Analysis</h2>
        <p class="mt-1 text-[10px] sm:text-xs text-muted-foreground">Visual metrics & stats</p>
      </div>
    </div>
    <dl class="space-y-1.5 font-mono text-xs text-foreground">
      <div class="flex justify-between gap-3">
        <dt class="text-muted-foreground">Valid CSS</dt>
        <dd :class="colorAnalysis.isValid ? 'text-emerald-500 dark:text-emerald-300' : 'text-rose-500 dark:text-rose-300'">
          {{ colorAnalysis.isValid ? 'Yes' : 'No' }}
        </dd>
      </div>
      <div class="flex justify-between gap-3">
        <dt class="text-muted-foreground">Format</dt>
        <dd>{{ colorAnalysis.format }}</dd>
      </div>
      <div class="flex justify-between gap-3">
        <dt class="text-muted-foreground">Hue</dt>
        <dd>{{ colorAnalysis.hue }}°</dd>
      </div>
      <div class="flex justify-between gap-3">
        <dt class="text-muted-foreground">Brightness</dt>
        <dd>{{ colorAnalysis.brightness }}%</dd>
      </div>
      <div class="flex justify-between gap-3">
        <dt class="text-muted-foreground">Luminance</dt>
        <dd>{{ colorAnalysis.luminance }}%</dd>
      </div>
      <div class="flex justify-between gap-3">
        <dt class="text-muted-foreground">Contrast on white</dt>
        <dd>{{ colorAnalysis.contrast.toFixed(2) }}:1</dd>
      </div>
    </dl>
  </section>
</template>
