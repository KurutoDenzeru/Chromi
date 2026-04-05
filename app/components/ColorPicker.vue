<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { cn } from '@/lib/utils'

  const props = defineProps<{
    modelValue: string
    class?: string
  }>()
  const emit = defineEmits(['update:modelValue'])

  const color = ref(props.modelValue)

  watch(() => props.modelValue, (val) => {
    color.value = val
  })

  function updateColor(e: Event) {
    const value = (e.target as HTMLInputElement).value
    color.value = value
    emit('update:modelValue', value)
  }
</script>

<template>
  <div :class="cn('flex items-center gap-2', props.class)">
    <input type="color" :value="color" @input="updateColor" class="w-10 h-10 rounded border cursor-pointer"
      aria-label="Pick color" />
  </div>
</template>
