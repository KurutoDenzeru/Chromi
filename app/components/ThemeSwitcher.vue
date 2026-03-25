<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { Sun, Moon, Monitor } from 'lucide-vue-next'
import { useStorage } from '@vueuse/core'

const modes = [
  { label: 'System', value: 'system', icon: Monitor },
  { label: 'Light', value: 'light', icon: Sun },
  { label: 'Dark', value: 'dark', icon: Moon },
]

const mode = useStorage<'system' | 'light' | 'dark'>(
  'palette-alchemy-theme',
  'system',
  typeof window !== 'undefined' ? window.localStorage : undefined,
)
let removeColorSchemeListener: (() => void) | undefined

onMounted(() => {
  applyTheme(mode.value)

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

function applyTheme(value: string) {
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
  mode.value = value as 'system' | 'light' | 'dark'
}

function selectTheme(value: string) {
  mode.value = value
  applyTheme(value)
}

const currentIcon = () => {
  const found = modes.find(m => m.value === mode.value)
  return found ? found.icon : Monitor
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        class="flex items-center gap-2 rounded-md border px-3 py-2 text-base bg-background text-foreground hover:bg-accent transition-colors focus:outline-none"
        aria-label="Switch theme"
        type="button"
      >
        <component :is="currentIcon()" class="w-5 h-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        v-for="m in modes"
        :key="m.value"
        @click="selectTheme(m.value)"
        :class="{'bg-accent text-accent-foreground': mode === m.value}"
      >
        <component :is="m.icon" class="w-4 h-4 mr-2" />
        <span>{{ m.label }}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
