<script setup lang="ts">
import { Activity } from 'lucide-vue-next'

defineProps<{
  selectedColor: string
  selectedSwatchStyle: { background: string }
  keyMetrics: { label: string; value: string }[]
}>()
</script>

<template>
  <section class="border-b border-border/60 pb-3">
    <div class="mb-2 flex items-center gap-2 text-foreground">
      <Activity class="h-4 w-4 text-cyan-500 dark:text-cyan-200" />
      <span class="text-sm font-semibold tracking-wide">Selection</span>
    </div>
    <div class="rounded-xl border border-border/70 bg-card/80 p-2.5">
      <div class="flex items-center gap-3">
        <div class="h-14 w-14 shrink-0 rounded-lg border border-border/70" :style="selectedSwatchStyle" />
        <div class="min-w-0">
          <p class="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Current Selection</p>
          <p class="truncate font-mono text-2xl text-foreground">{{ selectedColor }}</p>
        </div>
      </div>
    </div>
    <div class="mt-2 grid grid-cols-1 gap-2">
      <div v-for="metric in keyMetrics" :key="metric.label" class="rounded-lg border border-border/70 bg-background/70 px-2.5 py-2 dark:bg-background/55">
        <p class="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{{ metric.label }}</p>
        <p class="font-mono text-lg text-foreground">{{ metric.value }}</p>
      </div>
    </div>
  </section>
</template>
