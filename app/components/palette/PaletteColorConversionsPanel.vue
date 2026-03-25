<script setup lang="ts">
import { Ruler } from 'lucide-vue-next'

defineProps<{
  conversionRows: { label: string; value: string }[]
}>()
</script>

<template>
  <section class="pt-3">
    <div class="mb-2 flex items-center gap-2 text-foreground">
      <Ruler class="h-4 w-4 text-cyan-500 dark:text-cyan-200" />
      <span class="text-sm font-semibold tracking-wide">Conversions</span>
    </div>
    <ul class="space-y-1.5 font-mono text-sm text-foreground">
      <li v-for="row in conversionRows" :key="row.label" class="flex justify-between gap-3">
        <span class="text-muted-foreground">{{ row.label }}</span>
        <span class="text-right">{{ row.value }}</span>
      </li>
    </ul>
  </section>
</template>
