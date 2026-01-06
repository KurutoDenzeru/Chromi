<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Sun, Moon, Monitor } from 'lucide-vue-next'

const modes = [
  { label: 'System', value: 'system', icon: Monitor },
  { label: 'Light', value: 'light', icon: Sun },
  { label: 'Dark', value: 'dark', icon: Moon },
]

const mode = ref('system')
let isClient = false

onMounted(() => {
  isClient = true
  applyTheme(mode.value)
})

function applyTheme(value: string) {
  if (typeof window === 'undefined') return
  if (value === 'system') {
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.classList.remove('dark', 'light')
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark')
    }
  } else {
    document.documentElement.setAttribute('data-theme', value)
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(value)
  }
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
