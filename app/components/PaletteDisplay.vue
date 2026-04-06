<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import chroma from 'chroma-js'
  import { Toaster, toast } from 'vue-sonner'
  import { useColorConversions } from '@/composables/palette/useColorConversions'
  import { useColorAnalysis } from '@/composables/palette/useColorAnalysis'
  import { LayoutGrid, Sparkles, ArrowDown } from 'lucide-vue-next'
  import PaletteLeftSidebar from '@/components/palette/PaletteLeftSidebar.vue'
  import PaletteRightSidebar from '@/components/palette/PaletteRightSidebar.vue'
  import AppNavbar from '@/components/AppNavbar.vue'
  import AppHero from '@/components/AppHero.vue'
  import AppFooter from '@/components/AppFooter.vue'

  const copiedSwatchKey = ref<string | null>(null)

  const props = defineProps<{
    selectedColor: string
  }>()

  const emit = defineEmits<{
    colorSelected: [color: string]
  }>()

  const selectedColorRef = computed(() => props.selectedColor)
  const colorConversions = useColorConversions(selectedColorRef)
  const colorAnalysis = useColorAnalysis(selectedColorRef)

  const variations = ref(12)
  const hueStart = ref(167)
  const hueEnd = ref(13)
  const saturation = ref(80)
  const pointSaturations = ref<number[]>([])

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
  const roundToTenths = (value: number) => Math.round(value * 10) / 10

  const MAX_VARIATIONS = 25
  const normalizedVariations = computed(() => clamp(Math.round(variations.value), 2, MAX_VARIATIONS))
  const normalizedSaturation = computed(() => clamp(Math.round(saturation.value), 0, 100))
  const normalizedHueStart = computed(() => roundToTenths(clamp(hueStart.value, 0, 360)))
  const normalizedHueEnd = computed(() => roundToTenths(clamp(hueEnd.value, 0, 360)))
  const normalizedPointSaturations = computed(() =>
    Array.from({ length: normalizedVariations.value }, (_, index) => clamp(Math.round(pointSaturations.value[index] ?? normalizedSaturation.value), 0, 100)),
  )

  watch(normalizedVariations, (count) => {
    pointSaturations.value = Array.from({ length: count }, (_, index) => pointSaturations.value[index] ?? normalizedSaturation.value)
  }, { immediate: true })

  const columnHues = computed(() => {
    const count = normalizedVariations.value
    const start = normalizedHueStart.value
    const end = normalizedHueEnd.value
    const span = normalizeHue(end - start)

    return Array.from({ length: count }, (_, index) => {
      const ratio = count === 1 ? 0 : index / (count - 1)
      return normalizeHue(start + span * ratio)
    })
  })

  const paletteColumns = computed(() => {
    return columnHues.value.map((hue, index) => {
      const columnSaturation = normalizedPointSaturations.value[index] ?? normalizedSaturation.value
      const swatches = rowScale.map((row) => {
        const hex = chroma.hsl(hue, columnSaturation / 100, row.lightness).hex().toLowerCase()
        return { step: row.step, hex }
      })

      const midHex = swatches.find((swatch) => swatch.step === '500')?.hex ?? swatches[0]?.hex ?? '#000000'
      const name = chroma(midHex).name() || `hue-${Math.round(hue)}`

      return {
        hue,
        name,
        swatches,
        saturation: columnSaturation,
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

  const handleCopy = (hex: string, key: string) => {
    navigator.clipboard.writeText(hex)
    copiedSwatchKey.value = key
    setTimeout(() => {
      copiedSwatchKey.value = null
    }, 1200)

    toast.success(`Copied ${hex}`, {
      description: 'Color value copied to clipboard.',
      duration: 1400,
      position: 'bottom-right',
    })
  }

  const handleSelectColor = (hex: string) => {
    emit('colorSelected', hex)
  }

  const handleSwatchClick = (hex: string, key: string) => {
    handleSelectColor(hex)
    handleCopy(hex, key)
  }

  const randomizePaletteSettings = () => {
    const nextVariations = Math.floor(Math.random() * 22) + 4
    const nextHueStart = Math.floor(Math.random() * 360)
    const span = Math.floor(Math.random() * 170) + 90
    const nextHueEnd = normalizeHue(nextHueStart + span)
    const nextSaturation = Math.floor(Math.random() * 41) + 55

    variations.value = clamp(nextVariations, 2, MAX_VARIATIONS)
    hueStart.value = clamp(nextHueStart, 0, 360)
    hueEnd.value = clamp(nextHueEnd, 0, 360)
    saturation.value = clamp(nextSaturation, 0, 100)
    pointSaturations.value = Array.from({ length: clamp(nextVariations, 2, MAX_VARIATIONS) }, () => clamp(nextSaturation, 0, 100))

    toast.success('Palette randomized', {
      description: `Hues ${hueStart.value}° to ${hueEnd.value}° • Saturation ${saturation.value}%`,
      duration: 1500,
      position: 'bottom-right',
    })
  }

  const updateVariations = (value: number) => {
    variations.value = clamp(value, 2, MAX_VARIATIONS)
  }

  const updateHueStart = (value: number) => {
    hueStart.value = roundToTenths(clamp(value, 0, 360))
  }

  const updateHueEnd = (value: number) => {
    hueEnd.value = roundToTenths(clamp(value, 0, 360))
  }

  const updateSaturation = (value: number) => {
    const next = clamp(value, 0, 100)
    saturation.value = next
    pointSaturations.value = Array.from({ length: normalizedVariations.value }, () => next)
  }

  const updatePointSaturation = (payload: { index: number; value: number }) => {
    pointSaturations.value[payload.index] = clamp(Math.round(payload.value), 0, 100)
    const nextAverage = Math.round(pointSaturations.value.reduce((sum, current) => sum + current, 0) / pointSaturations.value.length)
    saturation.value = clamp(nextAverage, 0, 100)
  }

  const handleExportPalette = () => {
    const colors = exportPalette.value.map((item) => item.hex)
    const data = JSON.stringify(colors, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chromi-palette.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Palette exported', { description: 'JSON file downloaded.', duration: 1400, position: 'bottom-right' })
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

  const exportPalette = computed(() =>
    paletteColumns.value.flatMap((column) => column.swatches.map((swatch) => ({ hex: swatch.hex }))),
  )
</script>

<template>
  <div class="relative min-h-screen w-full overflow-x-clip">
    <div class="pointer-events-none absolute inset-0 bg-background" />
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(14,165,233,0.16),transparent_42%),radial-gradient(circle_at_82%_88%,rgba(59,130,246,0.15),transparent_35%)] dark:bg-[radial-gradient(circle_at_18%_20%,rgba(56,189,248,0.2),transparent_40%),radial-gradient(circle_at_82%_88%,rgba(168,85,247,0.12),transparent_35%)]" />
    <div
      class="pointer-events-none absolute inset-0 opacity-30 dark:opacity-0 [background-image:linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] [background-size:48px_48px]" />
    <div
      class="pointer-events-none absolute inset-0 opacity-0 dark:opacity-35 dark:[background-image:linear-gradient(to_right,rgba(56,189,248,0.11)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.07)_1px,transparent_1px)] dark:[background-size:56px_56px]" />

    <main class="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-3 pb-24 pt-6 sm:px-4 md:px-6">
      <AppNavbar @randomize="randomizePaletteSettings" @exportPalette="handleExportPalette" />

      <AppHero />

      <div
        class="grid min-h-[840px] overflow-hidden rounded-xl border border-border/50 bg-background/60 shadow-lg backdrop-blur-md xl:grid-cols-1 2xl:grid-cols-[18rem_minmax(0,1fr)_16rem] animate-in fade-in zoom-in-95 duration-1000 delay-300 ease-out fill-mode-both">
        <PaletteLeftSidebar :variations="normalizedVariations" :hue-start="normalizedHueStart"
          :hue-end="normalizedHueEnd" :saturation="normalizedSaturation" :point-saturations="normalizedPointSaturations"
          @randomize-requested="randomizePaletteSettings" @update-variations="updateVariations"
          @update-hue-start="updateHueStart" @update-hue-end="updateHueEnd" @update-saturation="updateSaturation"
          @update-point-saturation="updatePointSaturation" />

        <section class="min-w-0 border-b border-border/60 xl:border-b-0 xl:border-r">
          <div class="flex h-full flex-col">
            <div class="shrink-0 px-4 py-4">
              <div class="flex items-center gap-2">
                <LayoutGrid class="h-4 w-4 text-cyan-500 dark:text-cyan-200" />
                <h2 class="text-sm font-semibold tracking-wide text-foreground">Palette Grid</h2>
              </div>
              <p class="mt-1 text-xs text-muted-foreground">{{ normalizedVariations }} palettes · {{ rowScale.length
              }} tones</p>
            </div>

            <ScrollArea class="flex-1 border-t border-border/60 bg-card/40">
              <div class="grid min-w-max"
                :style="{ gridTemplateColumns: `repeat(${paletteColumns.length}, minmax(140px, 1fr))` }">
                <div v-for="column in paletteColumns" :key="`col-${column.hue}`"
                  class="border-r border-border/60 last:border-r-0">
                  <div
                    class="sticky top-0 z-10 border-b border-border/50 bg-background/70 px-3 py-2.5 text-xs font-semibold lowercase tracking-wide text-foreground backdrop-blur-md">
                    {{ column.name }}
                  </div>

                  <button v-for="swatch in column.swatches" :key="`swatch-${column.hue}-${swatch.step}`" type="button"
                    class="relative flex h-[66px] w-full flex-col justify-between border-b border-foreground/10 px-3 py-2.5 text-left overflow-hidden group"
                    :style="swatchStyle(swatch.hex)"
                    @click="handleSwatchClick(swatch.hex, `${column.hue}-${swatch.step}`)">

                    <Transition name="swatch-copy">
                      <div v-if="copiedSwatchKey === `${column.hue}-${swatch.step}`"
                        class="absolute inset-0 z-20 flex items-center justify-center bg-inherit">
                        <span class="text-sm font-bold uppercase tracking-widest opacity-90">Copied!</span>
                      </div>
                    </Transition>

                    <span
                      class="text-xl font-extrabold leading-none transition-transform duration-300 group-hover:scale-105 group-hover:origin-left">{{
                        swatch.step }}</span>
                    <span class="font-mono text-sm tracking-tight opacity-95">{{ swatch.hex }}</span>
                  </button>
                </div>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </section>

        <PaletteRightSidebar :selected-color="selectedColor" :selected-swatch-style="selectedSwatchStyle"
          :key-metrics="keyMetrics" :export-palette="exportPalette" :color-analysis="colorAnalysis"
          :conversion-rows="conversionRows" />
      </div>

      <AppFooter />

      <Toaster position="bottom-right" />
    </main>
  </div>
</template>

<style scoped>

  .swatch-copy-enter-active,
  .swatch-copy-leave-active {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .swatch-copy-enter-from {
    transform: translateY(-100%);
  }

  .swatch-copy-leave-to {
    transform: translateY(100%);
    opacity: 0;
  }
</style>
