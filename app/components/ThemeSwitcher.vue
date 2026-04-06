<script setup lang="ts">
  import { onBeforeUnmount, onMounted, watch } from 'vue'
  import type { HTMLAttributes } from 'vue'
  import { Monitor, Moon, Sun } from 'lucide-vue-next'
  import { useStorage } from '@vueuse/core'
  import { cn } from '@/lib/utils'
  import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

  type ThemeMode = 'system' | 'light' | 'dark'

  const props = defineProps<{
    class?: HTMLAttributes['class']
    iconOnly?: boolean
  }>()

  const modes = [
    { label: 'System', value: 'system', icon: Monitor },
    { label: 'Light', value: 'light', icon: Sun },
    { label: 'Dark', value: 'dark', icon: Moon },
  ] as const

  const mode = useStorage<ThemeMode>(
    'palette-alchemy-theme',
    'dark',
    typeof window !== 'undefined' ? window.localStorage : undefined,
  )
  let removeColorSchemeListener: (() => void) | undefined

  watch(mode, (value) => {
    applyTheme(value)
  }, { immediate: true })

  onMounted(() => {
    if (typeof window === 'undefined') return

    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleColorSchemeChange = () => {
      if (mode.value === 'system') applyTheme('system')
    }

    colorSchemeQuery.addEventListener('change', handleColorSchemeChange)
    removeColorSchemeListener = () => {
      colorSchemeQuery.removeEventListener('change', handleColorSchemeChange)
    }
  })

  onBeforeUnmount(() => {
    removeColorSchemeListener?.()
  })

  function applyTheme(value: ThemeMode) {
    if (typeof window === 'undefined') return

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = value === 'dark' || (value === 'system' && prefersDark)

    if (value === 'system') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', value)
    }

    document.documentElement.classList.toggle('dark', isDark)
    document.documentElement.classList.toggle('light', !isDark)
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
  }
</script>

<template>
  <Tabs v-model="mode" :class="cn('w-full', props.class)">
    <TabsList :class="cn(
      'grid h-11 w-full grid-cols-3 rounded-full border border-border/70 bg-background/60 p-1 shadow-sm backdrop-blur-xl',
      iconOnly && 'h-9 w-[120px]'
    )">
      <TabsTrigger v-for="m in modes" :key="m.value" :value="m.value" :class="cn(
        'rounded-full gap-1.5 px-3 text-[11px] uppercase tracking-[0.16em] sm:text-xs',
        iconOnly && 'px-0'
      )" :aria-label="m.label">
        <component :is="m.icon" class="h-4 w-4" />
        <span v-if="!iconOnly">{{ m.label }}</span>
      </TabsTrigger>
    </TabsList>
  </Tabs>
</template>
