<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePalette } from '@/composables/palette/usePalette'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Select from '@/components/ui/select/Select.vue'
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue'
import SelectContent from '@/components/ui/select/SelectContent.vue'
import SelectItem from '@/components/ui/select/SelectItem.vue'
import Slider from '@/components/ui/slider/Slider.vue'
import Tooltip from '@/components/ui/tooltip/Tooltip.vue'
import TooltipTrigger from '@/components/ui/tooltip/TooltipTrigger.vue'
import TooltipContent from '@/components/ui/tooltip/TooltipContent.vue'
import TooltipProvider from '@/components/ui/tooltip/TooltipProvider.vue'
import { Palette, Shuffle, Info, Download } from 'lucide-vue-next'
import ColorPicker from '~/components/ColorPicker.vue'
import ExportPaletteDialog from '@/components/ExportPaletteDialog.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import { Separator } from '@/components/ui/separator'
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from '@/components/ui/drawer'

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

const handleInputEnter = () => {
  generatePalette(gridColumns.value[0])
}

const handleGeneratePalette = () => {
  generatePalette(gridColumns.value[0])
}

const handleGenerateRandom = () => {
  generateRandom(gridColumns.value[0])
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
  <Drawer>
    <TooltipProvider>
      <!-- Dock trigger: bottom center for md+, bottom-right FAB for mobile -->
      <div class="fixed inset-x-0 bottom-6 flex justify-center items-end pointer-events-none z-50 md:bottom-8">
        <div class="hidden md:flex items-center gap-3 pointer-events-auto">
          <div
            class="flex items-center gap-2 bg-white/30 dark:bg-slate-800/40 backdrop-blur-md border border-white/10 dark:border-slate-700/40 rounded-xl px-2 py-1.5 shadow-lg">
            <!-- Brand icon -->
            <div class="flex items-center justify-center w-10 h-10 rounded-lg overflow-hidden bg-white/10">
              <NuxtImg src="/brand.webp" alt="Brand" class="w-8 h-8" loading="lazy" />
            </div>
            <Separator orientation="vertical" />

            <!-- Main trigger (palette) -->
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <DrawerTrigger as-child>
                    <button aria-label="Open Palette Controls" aria-controls="palette-controls-drawer"
                      class="w-12 h-12 rounded-lg flex items-center justify-center hover:scale-105 transform transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50">
                      <Palette class="w-6 h-6 text-foreground" />
                    </button>
                  </DrawerTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">Palette Controls</TooltipContent>
              </Tooltip>
            </TooltipProvider>

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
                <div class="shrink-0">
                  <ThemeSwitcher />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">Theme</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <!-- Mobile FAB -->
        <div class="md:hidden pointer-events-auto">
          <Tooltip>
            <TooltipTrigger as-child>
              <DrawerTrigger as-child>
                <button aria-label="Open Palette Controls" aria-controls="palette-controls-drawer"
                  class="w-14 h-14 rounded-lg bg-white/30 dark:bg-slate-800/40 backdrop-blur-md border border-white/10 dark:border-slate-700/40 shadow-lg flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50">
                  <Palette class="w-6 h-6 text-foreground" />
                </button>
              </DrawerTrigger>
            </TooltipTrigger>
            <TooltipContent side="top">Palette Controls</TooltipContent>
          </Tooltip>
        </div>
      </div>

    </TooltipProvider>

    <!-- Drawer content: same controls as before, now in a bottom drawer -->
    <DrawerContent id="palette-controls-drawer" direction="bottom" role="dialog" aria-modal="true"
      aria-labelledby="palette-controls-title" class="max-w-3xl mx-auto">
      <div class="px-6 py-6 md:py-8 lg:px-8 lg:py-10">
        <div class="flex items-center gap-3 mb-4">
          <NuxtImg src="/brand.webp" alt="Logo" class="w-12 h-12" loading="lazy" />
          <h1 id="palette-controls-title" class="font-bold text-lg md:text-xl">Palette Controls</h1>
          <div class="ml-auto">
            <DrawerClose as-child>
              <button aria-label="Close Palette Controls"
                class="p-2 rounded-md hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M10 8.586l4.95-4.95 1.414 1.414L11.414 10l4.95 4.95-1.414 1.414L10 11.414l-4.95 4.95-1.414-1.414L8.586 10 3.636 5.05 5.05 3.636 10 8.586z"
                    clip-rule="evenodd" />
                </svg>
              </button>
            </DrawerClose>
          </div>
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
    </DrawerContent>
  </Drawer>
</template>
