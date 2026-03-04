<script setup lang="ts">
import { TooltipProvider as TooltipProviderPrimitive, type TooltipProviderProps } from 'reka-ui'

const props = withDefaults(defineProps<TooltipProviderProps>(), {
  delayDuration: 0,
})
</script>

<template>
  <TooltipProviderPrimitive v-bind="props">
    <slot />
  </TooltipProviderPrimitive>
</template>
