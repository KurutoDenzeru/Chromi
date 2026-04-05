<script setup lang="ts">
import { Ruler } from 'lucide-vue-next'

defineProps<{
  conversionRows: { label: string; value: string }[]
}>()
</script>

<template>
  <section class="pt-3">
    <div class="mb-2 flex items-center gap-2.5 text-foreground">
      <Ruler class="h-4 w-4 text-cyan-500 dark:text-cyan-200" />
      <div>
        <h2 class="text-sm font-semibold tracking-wide">Conversions</h2>
        <p class="mt-1 text-[10px] sm:text-xs text-muted-foreground">Format translations</p>
      </div>
    </div>
    <ul class="space-y-1.5 font-mono text-xs text-foreground">
      <li v-for="row in conversionRows" :key="row.label" class="flex justify-between gap-3">
        <span class="text-muted-foreground">{{ row.label }}</span>
        <span class="text-right">{{ row.value }}</span>
      </li>
    </ul>
  </section>
</template>
