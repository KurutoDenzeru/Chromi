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
  import { Palette, Shuffle, Info } from 'lucide-vue-next'
  import ColorPicker from '~/components/ColorPicker.vue'
  import ExportPaletteDialog from '@/components/ExportPaletteDialog.vue'
  import ThemeSwitcher from '@/components/ThemeSwitcher.vue'

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
  <aside
    class="w-full md:max-w-xs md:min-h-screen bg-card border-b md:border-b-0 md:border-r px-4 md:px-6 py-4 md:py-8 flex flex-col gap-8 md:sticky md:top-0 z-20">
    <div>
      <div class="flex items-center gap-3 mb-4">
        <NuxtImg src="/brand.webp" alt="Chromi Logo" class="w-16 h-16" loading="lazy" />
        <h1 class="font-bold text-xl">Chromi</h1>
      </div>
      <h2 class="text-lg font-semibold mb-1">Palette Controls</h2>
      <p class="text-muted-foreground text-sm mb-4">Pick a color, palette mode, and grid size. Generate or randomize
        your palette.</p>
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
          <label class="text-sm font-medium mb-1">Grid Size: <span class="font-mono">{{ gridColumns[0] }}</span></label>
          <Slider v-model="gridColumns" :min="4" :max="32" :step="4" class="w-full" />
          <div class="flex justify-between w-full mt-1 text-sm text-muted-foreground font-mono select-none">
            <span v-for="n in [4, 8, 12, 16, 20, 24, 28, 32]" :key="n">{{ n }}</span>
          </div>
        </div>
        <div class="flex gap-2 mt-2 flex-wrap">
          <Button @click="handleGeneratePalette" :disabled="isLoading" class="w-full">
            <Palette class="w-5 h-5" />
            Generate Palette
          </Button>
          <Button @click="handleGenerateRandom" variant="outline" class="w-full">
            <Shuffle class="w-5 h-5" />
            Generate Random
          </Button>
        </div>
      </div>
    </div>
    <!-- Download Dialog Trigger (responsive) -->
    <div class="mt-4 md:mt-auto flex flex-row items-center justify-between gap-3">
      <div class="flex-1">
        <ExportPaletteDialog :palette="palette" :isLoading="isLoading" />
      </div>
      <div class="shrink-0">
        <ThemeSwitcher />
      </div>
    </div>
  </aside>
</template>
