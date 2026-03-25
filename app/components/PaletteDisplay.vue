<script setup lang="ts">
import { computed, ref } from 'vue'
import chroma from 'chroma-js'
import { Instagram, Linkedin, Github } from 'lucide-vue-next'
import { Toaster, toast } from 'vue-sonner'
import { useColorConversions } from '@/composables/palette/useColorConversions'
import { useColorAnalysis } from '@/composables/palette/useColorAnalysis'
import PaletteLeftSidebar from '@/components/palette/PaletteLeftSidebar.vue'
import PaletteRightSidebar from '@/components/palette/PaletteRightSidebar.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'

const props = defineProps<{
  selectedColor: string
}>()

const emit = defineEmits<{
  colorSelected: [color: string]
}>()

const selectedColorRef = computed(() => props.selectedColor)
const colorConversions = useColorConversions(selectedColorRef)
const colorAnalysis = useColorAnalysis(selectedColorRef)

const variations = ref(6)
const hueStart = ref(140)
const hueEnd = ref(295)
const saturation = ref(80)

const selectedSwatchStyle = computed(() => ({
  background: props.selectedColor,
}))

const rowScale = [
  { step: '50', lightness: 0.95 },
  { step: '100', lightness: 0.9 },
  { step: '200', lightness: 0.82 },
  { step: '300', lightness: 0.72 },
  { step: '400', lightness: 0.58 },
  { step: '500', lightness: 0.46 },
  { step: '600', lightness: 0.37 },
  { step: '700', lightness: 0.3 },
  { step: '800', lightness: 0.24 },
  { step: '900', lightness: 0.18 },
  { step: '950', lightness: 0.12 },
] as const

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const normalizeHue = (value: number) => ((value % 360) + 360) % 360

const normalizedVariations = computed(() => clamp(Math.round(variations.value), 2, 12))
const normalizedSaturation = computed(() => clamp(Math.round(saturation.value), 0, 100))
const normalizedHueStart = computed(() => clamp(Math.round(hueStart.value), 0, 360))
const normalizedHueEnd = computed(() => clamp(Math.round(hueEnd.value), 0, 360))

const columnHues = computed(() => {
  const count = normalizedVariations.value
  const start = normalizedHueStart.value
  const end = normalizedHueEnd.value

  return Array.from({ length: count }, (_, index) => {
    const ratio = count === 1 ? 0 : index / (count - 1)
    return normalizeHue(start + (end - start) * ratio)
  })
})

const paletteColumns = computed(() => {
  return columnHues.value.map((hue) => {
    const swatches = rowScale.map((row) => {
      const hex = chroma.hsl(hue, normalizedSaturation.value / 100, row.lightness).hex().toLowerCase()
      return { step: row.step, hex }
    })

    const midHex = swatches.find((swatch) => swatch.step === '500')?.hex ?? swatches[0].hex
    const name = chroma(midHex).name() || `hue-${Math.round(hue)}`

    return {
      hue,
      name,
      swatches,
    }
  })
})

const isSelected = (hex: string) => hex.toLowerCase() === props.selectedColor.toLowerCase()

const textColorForHex = (hex: string) => {
  const lum = chroma(hex).luminance()
  return lum > 0.44 ? '#0b1220' : '#f8fafc'
}

const swatchStyle = (hex: string) => ({
  backgroundColor: hex,
  color: textColorForHex(hex),
})

const handleCopy = (hex: string) => {
  navigator.clipboard.writeText(hex)
  toast.success(`Copied ${hex}`, {
    description: 'Color value copied to clipboard.',
    duration: 1400,
    position: 'bottom-right',
  })
}

const handleSelectColor = (hex: string) => {
  emit('colorSelected', hex)
}

const handleSwatchClick = (hex: string) => {
  handleSelectColor(hex)
  handleCopy(hex)
}

const updateVariations = (value: number) => {
  variations.value = clamp(value, 2, 12)
}

const updateHueStart = (value: number) => {
  hueStart.value = clamp(value, 0, 360)
}

const updateHueEnd = (value: number) => {
  hueEnd.value = clamp(value, 0, 360)
}

const updateSaturation = (value: number) => {
  saturation.value = clamp(value, 0, 100)
}

const keyMetrics = computed(() => [
  { label: 'Hue', value: `${colorAnalysis.value.hue}°` },
  { label: 'Brightness', value: `${colorAnalysis.value.brightness}%` },
  { label: 'Contrast', value: `${colorAnalysis.value.contrast.toFixed(2)}:1` },
])

const conversionRows = computed(() => [
  { label: 'HEX', value: colorConversions.value.hex },
  { label: 'RGB', value: colorConversions.value.rgb },
  { label: 'HSL', value: colorConversions.value.hsl },
  { label: 'HWB', value: colorConversions.value.hwb },
  { label: 'CMYK', value: colorConversions.value.cmyk },
  { label: 'LCH', value: colorConversions.value.lch },
  { label: 'Keyword', value: colorConversions.value.keyword || 'none' },
])
</script>

<template>
  <div class="relative min-h-screen w-full overflow-hidden">
    <div class="pointer-events-none absolute inset-0 bg-background" />
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(14,165,233,0.16),transparent_42%),radial-gradient(circle_at_82%_88%,rgba(59,130,246,0.15),transparent_35%)] dark:bg-[radial-gradient(circle_at_18%_20%,rgba(56,189,248,0.2),transparent_40%),radial-gradient(circle_at_82%_88%,rgba(168,85,247,0.12),transparent_35%)]" />
    <div class="pointer-events-none absolute inset-0 opacity-40 dark:opacity-35 [background-image:linear-gradient(to_right,rgba(14,165,233,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,165,233,0.07)_1px,transparent_1px)] dark:[background-image:linear-gradient(to_right,rgba(56,189,248,0.11)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.07)_1px,transparent_1px)] [background-size:56px_56px]" />

    <main class="relative mx-auto flex min-h-screen w-full max-w-[1820px] flex-col px-3 pb-24 pt-6 sm:px-4 md:px-6">
      <div class="mb-4 flex justify-center">
        <ThemeSwitcher />
      </div>

      <div class="grid min-h-[calc(100vh-9rem)] overflow-hidden rounded-2xl border border-border/70 bg-background/75 backdrop-blur-xl dark:bg-background/70 xl:grid-cols-[430px_minmax(0,1fr)_300px]">
        <PaletteLeftSidebar
          :variations="normalizedVariations"
          :hue-start="normalizedHueStart"
          :hue-end="normalizedHueEnd"
          :saturation="normalizedSaturation"
          @update-variations="updateVariations"
          @update-hue-start="updateHueStart"
          @update-hue-end="updateHueEnd"
          @update-saturation="updateSaturation"
        />

        <section class="min-w-0 border-b border-border/60 xl:border-b-0 xl:border-r">
          <div class="h-full p-3 sm:p-4">
            <div class="mb-3 flex items-baseline justify-between">
              <h2 class="text-xl font-semibold tracking-tight text-foreground">Palette Grid</h2>
              <p class="text-sm text-muted-foreground">{{ normalizedVariations }} palettes · {{ rowScale.length }} tones</p>
            </div>

            <div class="overflow-auto rounded-xl border border-border/70 bg-card/60">
              <div class="grid min-w-max" :style="{ gridTemplateColumns: `repeat(${paletteColumns.length}, minmax(180px, 1fr))` }">
                <div
                  v-for="column in paletteColumns"
                  :key="`col-${column.hue}`"
                  class="border-r border-border/60 last:border-r-0"
                >
                  <div class="sticky top-0 z-10 border-b border-border/70 bg-background/90 px-3 py-3 text-sm font-semibold lowercase tracking-wide text-foreground backdrop-blur-md">
                    {{ column.name }}
                  </div>

                  <button
                    v-for="swatch in column.swatches"
                    :key="`swatch-${column.hue}-${swatch.step}`"
                    type="button"
                    class="relative flex h-[108px] w-full flex-col justify-between border-b border-foreground/10 px-3 py-3 text-left transition hover:brightness-105"
                    :style="swatchStyle(swatch.hex)"
                    @click="handleSwatchClick(swatch.hex)"
                  >
                    <span class="text-3xl font-semibold leading-none">{{ swatch.step }}</span>
                    <span class="font-mono text-base tracking-tight">{{ swatch.hex }}</span>
                    <span v-if="isSelected(swatch.hex)" class="absolute right-2 top-2 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground">Selected</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <PaletteRightSidebar
          :selected-color="selectedColor"
          :selected-swatch-style="selectedSwatchStyle"
          :key-metrics="keyMetrics"
          :color-analysis="colorAnalysis"
          :conversion-rows="conversionRows"
        />
      </div>

      <footer class="mt-3 flex flex-col items-center gap-2 text-xs text-muted-foreground">
        <div class="flex items-center gap-3 rounded-full border border-border/70 bg-background/70 px-4 py-2 backdrop-blur-md dark:bg-background/55">
          <a href="https://instagram.com/krtclcdy" target="_blank" rel="noopener" aria-label="Instagram" class="text-foreground transition hover:text-cyan-600 dark:hover:text-cyan-200">
            <Instagram class="h-4 w-4" />
          </a>
          <a href="https://linkedin.com/in/kurtcalacday" target="_blank" rel="noopener" aria-label="LinkedIn" class="text-foreground transition hover:text-cyan-600 dark:hover:text-cyan-200">
            <Linkedin class="h-4 w-4" />
          </a>
          <a href="https://github.com/KurutoDenzeru/Chromi" target="_blank" rel="noopener" aria-label="GitHub" class="text-foreground transition hover:text-cyan-600 dark:hover:text-cyan-200">
            <Github class="h-4 w-4" />
          </a>
        </div>
        <p class="text-center">© {{ new Date().getFullYear() }} Chromi. KurutoDenzeru. All rights reserved.</p>
      </footer>

      <Toaster position="bottom-right" />
    </main>
  </div>
</template>
