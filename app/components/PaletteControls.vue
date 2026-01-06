<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { usePalette } from '@/composables/palette/usePalette'
import Input from '@/components/ui/input/Input.vue'
import { Palette, Shuffle, Info, Download, Sun, Moon } from 'lucide-vue-next'
import ColorPicker from '~/components/ColorPicker.vue'
import ExportPaletteDialog from '@/components/ExportPaletteDialog.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer'
import { useMediaQuery } from '@vueuse/core'
import { Dialog, DialogTrigger as DialogTriggerComp, DialogContent as DialogContentComp, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose as DialogCloseComp } from '@/components/ui/dialog'

const MODES = [
  'analogous',
  'monochrome',
  'complementary',
  'triadic',
  'compound',
  'shades',
  'tetradic',
  'square',
] as const

type PaletteMode = typeof MODES[number]

const colorInput = ref('#dc143c')
const paletteMode = ref<PaletteMode>('shades')
const gridColumns = ref([16])
const imagePalette = ref<string[]>([])
const lastImageFile = ref<File | null>(null)

const {
  palette,
  secondaryPalette,
  isLoading,
  generatePalette,
  generateRandom,
} = usePalette(colorInput, paletteMode)

const emit = defineEmits<{
  colorInputChange: [value: string]
  paletteGenerated: [data: { palette: any[], secondaryPalette: any[] }]
}>()

// Responsive modal/drawer mapping: Dialog on desktop, Drawer on mobile
const isDesktop = useMediaQuery('(min-width: 640px)')
const open = ref(false)
const Modal = computed(() => ({
  Root: isDesktop.value ? Dialog : Drawer,
  Trigger: isDesktop.value ? DialogTriggerComp : DrawerTrigger,
  Content: isDesktop.value ? DialogContentComp : DrawerContent,
  Header: isDesktop.value ? DialogHeader : DrawerHeader,
  Title: isDesktop.value ? DialogTitle : DrawerTitle,
  Description: isDesktop.value ? DialogDescription : DrawerDescription,
  Footer: isDesktop.value ? DialogFooter : DrawerFooter,
  Close: isDesktop.value ? DialogCloseComp : DrawerClose,
}))

const handleInputEnter = () => {
  generatePalette(gridColumns.value[0])
}

const handleGeneratePalette = () => {
  generatePalette(gridColumns.value[0])
}

const handleGenerateRandom = () => {
  generateRandom(gridColumns.value[0])
}

// Theme toggle helper (quick toggle for dock button)
const themeMode = ref<'system'|'light'|'dark'>('system')
onMounted(() => {
  if (typeof window === 'undefined') return
  if (document.documentElement.classList.contains('dark')) themeMode.value = 'dark'
  else if (document.documentElement.classList.contains('light')) themeMode.value = 'light'
  else themeMode.value = 'system'
})

function applyTheme(value: string) {
  if (typeof window === 'undefined') return
  if (value === 'system') {
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.classList.remove('dark','light')
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark')
    }
  } else {
    document.documentElement.setAttribute('data-theme', value)
    document.documentElement.classList.remove('dark','light')
    document.documentElement.classList.add(value)
  }
  themeMode.value = value as any
}

function toggleTheme() {
  const next = themeMode.value === 'dark' ? 'light' : 'dark'
  applyTheme(next)
}

watch(() => gridColumns.value[0], async (newCount) => {
  if (lastImageFile.value) {
    // Re-extract colors from the last image with new count
  } else if (!imagePalette.value.length) {
    generatePalette(newCount)
  }
})

// Regenerate palette when paletteMode or gridColumns changes
watch([paletteMode, () => gridColumns.value[0]], () => {
  if (!imagePalette.value.length) {
    generatePalette(gridColumns.value[0])
  }
})

// Emit changes to parent
watch([palette, secondaryPalette], () => {
  emit('paletteGenerated', { palette: palette.value, secondaryPalette: secondaryPalette.value })
})

watch(colorInput, (newValue) => {
  emit('colorInputChange', newValue)
})

// On initial load, generate palette with correct count
if (!imagePalette.value.length) {
  generatePalette(gridColumns.value[0])
}
</script>

<template>
  <!-- Floating Liquid Glass Dock (bottom-centered on larger screens, FAB on small screens) -->
  <component :is="Modal.Root" v-model:open="open">
    <TooltipProvider>
      <!-- Dock trigger: top on desktop, bottom on mobile -->
      <div :class="['fixed inset-x-0 flex justify-center pointer-events-none z-50', isDesktop ? 'top-6 md:top-8 items-start' : 'bottom-6 md:bottom-8 items-end']">
        <div class="flex items-center gap-3 pointer-events-auto">
          <div
            class="flex items-center gap-2 bg-white/30 dark:bg-slate-800/40 backdrop-blur-md border border-white/10 dark:border-slate-700/40 rounded-xl px-2 py-1.5 shadow-lg">
            <!-- Brand icon (link to home) -->
            <NuxtLink to="/" class="flex items-center gap-2">
              <div class="w-10 h-10 rounded-lg overflow-hidden transition hover:bg-white/10 dark:hover:bg-slate-800/40">
                <NuxtImg src="/brand.webp" alt="Brand" class="w-10 h-10" loading="lazy" />
              </div>
              <span class="ml-0.5 font-bold hidden sm:inline">Chromi</span>
            </NuxtLink>

            <div class="w-px h-6 bg-white/10 dark:bg-slate-700/40 rounded mx-1"></div>

            <!-- Main trigger (palette) -->
            <Tooltip>
              <TooltipTrigger as-child>
                <component :is="Modal.Trigger" as-child>
                  <button aria-label="Open Palette Controls" aria-controls="palette-controls-drawer"
                    class="w-10 h-10 rounded-lg flex items-center justify-center hover:scale-105 hover:bg-white/20 transform transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50">
                    <Palette class="w-6 h-6 text-foreground" />
                  </button>
                </component>
              </TooltipTrigger>
              <TooltipContent side="top">Palette Controls</TooltipContent>
            </Tooltip>

            <!-- Randomize -->
            <Tooltip>
              <TooltipTrigger as-child>
                <button aria-label="Randomize Palette" @click="handleGenerateRandom"
                  class="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50">
                  <Shuffle class="w-5 h-5 text-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Randomize Palette</TooltipContent>
            </Tooltip>

            <!-- Export -->
            <ExportPaletteDialog :palette="palette" :isLoading="isLoading">
              <template #trigger>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <button aria-label="Export Palette"
                      class="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50">
                      <Download class="w-5 h-5 text-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Export Palette</TooltipContent>
                </Tooltip>
              </template>
            </ExportPaletteDialog>

            <!-- separator before theme -->
            <div class="w-px h-6 bg-white/10 dark:bg-slate-700/40 rounded mx-1"></div>

            <Tooltip>
              <TooltipTrigger as-child>
                <button aria-label="Toggle theme" @click="toggleTheme" class="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50">
                  <component :is="themeMode === 'dark' ? Moon : Sun" class="w-5 h-5 text-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Toggle Theme</TooltipContent>
            </Tooltip>
          </div>
        </div>


      </div>

    </TooltipProvider>

    <!-- Modal/Drawer content: Dialog on desktop, Drawer on mobile -->
    <component :is="Modal.Content" id="palette-controls-drawer" direction="bottom" role="dialog" aria-modal="true"
      aria-labelledby="palette-controls-title" class="max-w-3xl mx-auto">
      <div class="px-6 py-6 md:py-8 lg:px-8 lg:py-10">
        <div class="flex items-center gap-3 mb-4">
          <h1 id="palette-controls-title" class="font-bold text-lg md:text-xl">Palette Controls</h1>
        </div>

        <p class="text-muted-foreground text-sm mb-4">Pick a color, palette mode, and grid size. Generate or randomize
          your
          palette.</p>

        <div class="flex flex-col gap-4">
          <TooltipProvider>
            <label class="text-sm font-medium">Base Color:</label>
            <div class="flex items-center gap-2 w-full relative">
              <div class="relative w-full">
                <Input v-model="colorInput" class="w-full pr-10" placeholder="HEX, RGB, HSL, or CSS color name"
                  @keyup.enter="handleInputEnter" />
                <span class="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer">
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <Info class="w-4 h-4 text-muted-foreground hover:text-primary" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <span class="font-mono text-xs">Supported: HEX, RGB, HSL, CSS color names (e.g. crimson)</span>
                    </TooltipContent>
                  </Tooltip>
                </span>
              </div>
              <ColorPicker v-model="colorInput" />
            </div>
          </TooltipProvider>

          <label class="text-sm font-medium">Color Harmony:</label>
          <Select v-model="paletteMode">
            <SelectTrigger class="w-full capitalize">{{ paletteMode }}</SelectTrigger>
            <SelectContent>
              <SelectItem v-for="mode in MODES" :key="mode" :value="mode" class="capitalize">
                {{ mode }}
              </SelectItem>
            </SelectContent>
          </Select>

          <div class="flex flex-col items-start w-full">
            <label class="text-sm font-medium mb-1">Grid Size: <span class="font-mono">{{ gridColumns[0]
                }}</span></label>
            <Slider v-model="gridColumns" :min="4" :max="32" :step="4" class="w-full" />
            <div class="flex justify-between w-full mt-1 text-sm text-muted-foreground font-mono select-none">
              <span v-for="n in [4, 8, 12, 16, 20, 24, 28, 32]" :key="n">{{ n }}</span>
            </div>
          </div>

          <div class="flex gap-2 mt-2 flex-wrap">
            <Button @click="handleGeneratePalette" :disabled="isLoading" class="w-full md:w-auto">
              <Palette class="w-5 h-5" />
              <span class="ml-2">Generate Palette</span>
            </Button>
            <Button @click="handleGenerateRandom" variant="outline" class="w-full md:w-auto">
              <Shuffle class="w-5 h-5" />
              <span class="ml-2">Generate Random</span>
            </Button>
          </div>
        </div>

        <div class="mt-4 flex flex-row items-center justify-between gap-3">
          <div class="flex-1">
            <ExportPaletteDialog :palette="palette" :isLoading="isLoading" />
          </div>
          <div class="shrink-0">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </component>
  </component>
</template>
