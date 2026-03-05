<script setup lang="ts">
import { computed } from 'vue'
import chroma from 'chroma-js'
import { Copy, Instagram, Linkedin, Github, Sparkles, Blend, Ruler } from 'lucide-vue-next'
import { Toaster, toast } from 'vue-sonner'
import { useColorConversions } from '@/composables/palette/useColorConversions'
import { useColorAnalysis } from '@/composables/palette/useColorAnalysis'

const props = defineProps<{
  palette: { hex: string; rgba: string }[]
  secondaryPalette: { hex: string; rgba: string }[]
  gridColumns: number
  selectedColor: string
}>()

const emit = defineEmits<{
  colorSelected: [color: string]
}>()

const selectedColorRef = computed(() => props.selectedColor)
const colorConversions = useColorConversions(selectedColorRef)
const colorAnalysis = useColorAnalysis(selectedColorRef)

const selectedSwatchStyle = computed(() => ({
  background: props.selectedColor,
}))

const paletteTitle = computed(() => (props.palette.length ? `${props.palette.length} generated shades` : 'Waiting for palette'))

const swatchGridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.gridColumns}, minmax(0, 1fr))`,
}))

const handleCopy = (hex: string) => {
  navigator.clipboard.writeText(hex)
  toast.success(`Copied ${hex}`, {
    description: 'Color value copied to clipboard.',
    duration: 1600,
    position: 'bottom-right',
  })
}

const handleSelectColor = (hex: string) => {
  emit('colorSelected', hex)
}

const getColorConversions = (hex: string) => {
  if (!chroma.valid(hex)) {
    return { hex: '', rgb: '', hsl: '', hwb: '', cmyk: '', lch: '', keyword: '' }
  }

  const color = chroma(hex)
  const [hue] = color.hsl()
  const rgb = color.rgb()
  const whiteness = Math.min(...rgb) / 255
  const blackness = 1 - Math.max(...rgb) / 255

  return {
    hex: color.hex(),
    rgb: color.css('rgb'),
    hsl: color.css('hsl'),
    hwb: `hwb(${Math.round(hue)}, ${(whiteness * 100).toFixed(0)}%, ${(blackness * 100).toFixed(0)}%)`,
    cmyk: color.cmyk().map((value) => Math.round(value)).join(','),
    lch: color.lch().map((value) => Math.round(value)).join(','),
    keyword: color.name() || 'none',
  }
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
    <div class="pointer-events-none absolute inset-0 bg-slate-950" />
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,rgba(56,189,248,0.2),transparent_40%),radial-gradient(circle_at_75%_86%,rgba(168,85,247,0.11),transparent_35%)]" />
    <div class="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,rgba(56,189,248,0.11)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.07)_1px,transparent_1px)] [background-size:56px_56px]" />

    <main class="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 pb-28 pt-6 md:gap-7 md:pl-28 md:pr-6 md:pt-8">
      <Card class="border-white/15 bg-slate-900/55 py-4 backdrop-blur-xl dark:bg-slate-950/60">
        <CardContent class="grid gap-3 px-3 sm:px-4 md:grid-cols-[220px_1fr] md:items-stretch">
          <div class="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-2.5">
            <div class="h-16 w-16 shrink-0 aspect-square rounded-xl border border-white/25" :style="selectedSwatchStyle" />
            <div class="min-w-0">
              <p class="text-[11px] uppercase tracking-[0.22em] text-slate-300">Current Selection</p>
              <p class="truncate font-mono text-2xl text-white">{{ selectedColor }}</p>
            </div>
          </div>

          <div class="grid gap-2 sm:grid-cols-3">
            <div v-for="metric in keyMetrics" :key="metric.label" class="rounded-2xl border border-white/15 bg-white/5 px-3 py-2.5">
              <p class="text-[11px] uppercase tracking-[0.14em] text-slate-300">{{ metric.label }}</p>
              <p class="mt-1 font-mono text-xl text-slate-100">{{ metric.value }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border-white/15 bg-slate-900/55 py-5 backdrop-blur-xl dark:bg-slate-950/60">
        <CardHeader class="px-4 pb-3">
          <CardTitle class="flex items-center gap-2 text-xl text-white">
            <Sparkles class="h-5 w-5 text-cyan-200" />
            Generated Palette
          </CardTitle>
          <CardDescription class="text-slate-300">{{ paletteTitle }}</CardDescription>
        </CardHeader>

        <CardContent class="space-y-6 px-4">
          <div class="grid gap-2" :style="swatchGridStyle">
            <HoverCard v-for="color in palette" :key="`primary-${color.hex}`">
              <HoverCardTrigger>
                <button type="button" class="group w-full" @click="() => { handleSelectColor(color.hex); handleCopy(color.hex) }">
                  <div class="aspect-square w-full rounded-xl border border-white/25 transition duration-200 group-hover:scale-[1.02]" :style="{ background: color.hex }" />
                  <p class="mt-1 truncate text-center font-mono text-[11px] text-slate-100">{{ color.hex }}</p>
                </button>
              </HoverCardTrigger>
              <HoverCardContent class="w-[280px] border-white/20 bg-slate-950/95 text-slate-100">
                <div class="space-y-1 text-xs font-mono">
                  <button
                    v-for="format in [
                      { label: 'HEX', value: color.hex },
                      { label: 'RGB', value: getColorConversions(color.hex).rgb },
                      { label: 'HSL', value: getColorConversions(color.hex).hsl },
                      { label: 'HWB', value: getColorConversions(color.hex).hwb },
                      { label: 'CMYK', value: getColorConversions(color.hex).cmyk },
                      { label: 'LCH', value: getColorConversions(color.hex).lch },
                    ]"
                    :key="`${color.hex}-${format.label}`"
                    type="button"
                    class="flex w-full items-center justify-between rounded-md px-2 py-1.5 hover:bg-white/10"
                    @click="handleCopy(format.value)"
                  >
                    <span>{{ format.label }}: {{ format.value }}</span>
                    <Copy class="h-3.5 w-3.5 text-slate-300" />
                  </button>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>

          <div>
            <div class="mb-3 flex items-center gap-2 text-base font-semibold text-white">
              <Blend class="h-4 w-4 text-amber-200" />
              Related Colors
            </div>

            <div class="grid gap-2" :style="swatchGridStyle">
              <HoverCard v-for="color in secondaryPalette" :key="`related-${color.hex}`">
                <HoverCardTrigger>
                  <button type="button" class="group w-full" @click="() => { handleSelectColor(color.hex); handleCopy(color.hex) }">
                    <div class="aspect-square w-full rounded-xl border border-white/25 transition duration-200 group-hover:scale-[1.02]" :style="{ background: color.hex }" />
                    <p class="mt-1 truncate text-center font-mono text-[11px] text-slate-100">{{ color.hex }}</p>
                  </button>
                </HoverCardTrigger>
                <HoverCardContent class="w-[280px] border-white/20 bg-slate-950/95 text-slate-100">
                  <div class="space-y-1 text-xs font-mono">
                    <button
                      v-for="format in [
                        { label: 'HEX', value: color.hex },
                        { label: 'RGB', value: getColorConversions(color.hex).rgb },
                        { label: 'HSL', value: getColorConversions(color.hex).hsl },
                        { label: 'HWB', value: getColorConversions(color.hex).hwb },
                        { label: 'CMYK', value: getColorConversions(color.hex).cmyk },
                        { label: 'LCH', value: getColorConversions(color.hex).lch },
                      ]"
                      :key="`${color.hex}-${format.label}`"
                      type="button"
                      class="flex w-full items-center justify-between rounded-md px-2 py-1.5 hover:bg-white/10"
                      @click="handleCopy(format.value)"
                    >
                      <span>{{ format.label }}: {{ format.value }}</span>
                      <Copy class="h-3.5 w-3.5 text-slate-300" />
                    </button>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
        </CardContent>
      </Card>

      <section class="grid gap-4 md:grid-cols-2">
        <Card class="border-white/15 bg-slate-900/55 py-5 backdrop-blur-xl dark:bg-slate-950/60">
          <CardHeader class="px-4 pb-2">
            <CardTitle class="text-xl text-white">Color Analysis</CardTitle>
            <CardDescription class="text-slate-300">Quality checks for the active color token.</CardDescription>
          </CardHeader>
          <CardContent class="px-4">
            <dl class="space-y-2 font-mono text-sm text-slate-100">
              <div class="flex justify-between gap-3">
                <dt class="text-slate-300">Valid CSS</dt>
                <dd :class="colorAnalysis.isValid ? 'text-emerald-300' : 'text-rose-300'">{{ colorAnalysis.isValid ? 'Yes' : 'No' }}</dd>
              </div>
              <div class="flex justify-between gap-3">
                <dt class="text-slate-300">Format</dt>
                <dd>{{ colorAnalysis.format }}</dd>
              </div>
              <div class="flex justify-between gap-3">
                <dt class="text-slate-300">Hue</dt>
                <dd>{{ colorAnalysis.hue }}°</dd>
              </div>
              <div class="flex justify-between gap-3">
                <dt class="text-slate-300">Brightness</dt>
                <dd>{{ colorAnalysis.brightness }}%</dd>
              </div>
              <div class="flex justify-between gap-3">
                <dt class="text-slate-300">Luminance</dt>
                <dd>{{ colorAnalysis.luminance }}%</dd>
              </div>
              <div class="flex justify-between gap-3">
                <dt class="text-slate-300">Contrast on white</dt>
                <dd>{{ colorAnalysis.contrast.toFixed(2) }}:1</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card class="border-white/15 bg-slate-900/55 py-5 backdrop-blur-xl dark:bg-slate-950/60">
          <CardHeader class="px-4 pb-2">
            <CardTitle class="flex items-center gap-2 text-xl text-white">
              <Ruler class="h-5 w-5 text-cyan-200" />
              Conversions
            </CardTitle>
            <CardDescription class="text-slate-300">Output values across common color spaces.</CardDescription>
          </CardHeader>
          <CardContent class="px-4">
            <ul class="space-y-2 font-mono text-sm text-slate-100">
              <li v-for="row in conversionRows" :key="row.label" class="flex justify-between gap-3">
                <span class="text-slate-300">{{ row.label }}</span>
                <span class="text-right">{{ row.value }}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <footer class="mt-2 flex flex-col items-center gap-2 pb-1 text-xs text-slate-300 md:pb-3">
        <div class="flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
          <a href="https://instagram.com/krtclcdy" target="_blank" rel="noopener" aria-label="Instagram" class="text-slate-100 transition hover:text-cyan-200">
            <Instagram class="h-4 w-4" />
          </a>
          <a href="https://linkedin.com/in/kurtcalacday" target="_blank" rel="noopener" aria-label="LinkedIn" class="text-slate-100 transition hover:text-cyan-200">
            <Linkedin class="h-4 w-4" />
          </a>
          <a href="https://github.com/KurutoDenzeru/Chromi" target="_blank" rel="noopener" aria-label="GitHub" class="text-slate-100 transition hover:text-cyan-200">
            <Github class="h-4 w-4" />
          </a>
        </div>
        <p class="text-center">© {{ new Date().getFullYear() }} Chromi. KurutoDenzeru. All rights reserved.</p>
      </footer>

      <Toaster position="bottom-right" />
    </main>
  </div>
</template>
