<script setup lang="ts">
  import { computed } from 'vue'
  import { useColorConversions } from '@/composables/palette/useColorConversions'
  import { useColorAnalysis } from '@/composables/palette/useColorAnalysis'
  import chroma from 'chroma-js'
  import { Copy, Instagram, Linkedin, Github } from 'lucide-vue-next'
  import { Toaster, toast } from 'vue-sonner'
  import 'vue-sonner/style.css'

  const props = defineProps<{
    palette: { hex: string; rgba: string }[]
    secondaryPalette: { hex: string; rgba: string }[]
    gridColumns: number
    selectedColor: string
  }>()

  const emit = defineEmits<{
    colorSelected: [color: string]
  }>()

  // Use selectedColor for analysis/conversions
  const selectedColorRef = computed(() => props.selectedColor)
  const colorConversions = useColorConversions(selectedColorRef)
  const colorAnalysis = useColorAnalysis(selectedColorRef)

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex)
    toast.success(`Copied ${hex} to clipboard!`, {
      class: 'rounded-xl shadow-lg border-2 border-gray-500 bg-gray-600 text-white text-base font-semibold',
      style: {
        background: '#fff',
        color: '#000',
        border: '2px solid #6B7280',
        fontWeight: 600,
        fontSize: '1rem',
      },
      description: 'Color value has been copied.',
      duration: 2000,
      position: 'bottom-right',
    })
  }

  const handleSelectColor = (hex: string) => {
    emit('colorSelected', hex)
  }

  // Helper to get conversions for any color
  const getColorConversions = (hex: string) => {
    if (!chroma.valid(hex)) return { hex: '', rgb: '', hsl: '', hwb: '', cmyk: '', lch: '', keyword: '' }
    const c = chroma(hex)
    const toHwb = (c: chroma.Color) => {
      const [h] = c.hsl()
      const w = Math.min(...c.rgb()) / 255
      const b = 1 - Math.max(...c.rgb()) / 255
      return `hwb(${Math.round(h)}, ${(w * 100).toFixed(0)}%, ${(b * 100).toFixed(0)}%)`
    }
    const getKeyword = (hex: string) => {
      try { return chroma(hex).name() } catch { return '' }
    }
    return {
      hex: c.hex(),
      rgb: c.css('rgb'),
      hsl: c.css('hsl'),
      hwb: toHwb(c),
      cmyk: c.cmyk().map(x => Math.round(x)).join(','),
      lch: c.lch().map(x => Math.round(x)).join(','),
      keyword: getKeyword(c.hex())
    }
  }
</script>

<template>
  <div class="relative w-full h-full">
    <!-- Background Pattern and Gradients -->
    <div>
      <div class="absolute inset-0 overflow-hidden bg-white dark:bg-gray-950">
        <div class="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950" />
        <div class="absolute inset-0 opacity-20 dark:opacity-10">
          <svg width="100%" height="100%">
            <pattern
              id="analytics-pattern"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 70L20 70L20 30L40 30L40 50L60 50L60 20L80 20L80 60L100 60"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="text-blue-500 dark:text-blue-400"
              />
              <path
                d="M0 80L20 80L20 60L40 60L40 90L60 90L60 70L80 70L80 40L100 40"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="text-emerald-500 dark:text-emerald-400"
                stroke-dasharray="2,2"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#analytics-pattern)" />
          </svg>
        </div>
      </div>
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_30%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_30%)]" />
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(124,58,237,0.1),transparent_30%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(124,58,237,0.15),transparent_30%)]" />
      </div>
    </div>
    <main
      class="relative flex-1 min-h-screen flex flex-col gap-4 justify-center items-center px-4 md:px-8 py-4 md:py-8 overflow-auto">
      <!-- Generated Palette & Related Colors -->
      <section class="w-full mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Generated Palette:</CardTitle>
          </CardHeader>
          <CardContent class="cursor-pointer">
            <div :class="`grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-${gridColumns} cursor-pointer`"
              style="display: flex; flex-wrap: wrap;">
              <HoverCard v-for="color in palette" :key="color.hex" class="w-full">
                <HoverCardTrigger>
                  <div :style="{ background: color.hex, width: '73px', height: '75px' }"
                    @click="() => { handleSelectColor(color.hex); handleCopy(color.hex); }" />
                  <div class="w-full text-center text-xs font-mono mt-1" @click="handleCopy(color.hex)">{{
                    color.hex }}</div>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div
                    class="flex flex-col text-sm font-mono group-hover:bg-accent/10 rounded-md min-w-[350px] transition-colors">
                    <div v-for="fmt in [
                      { label: 'HEX', value: color.hex },
                      { label: 'RGB', value: getColorConversions(color.hex).rgb },
                      { label: 'HSL', value: getColorConversions(color.hex).hsl },
                      { label: 'HWB', value: getColorConversions(color.hex).hwb },
                      { label: 'CMYK', value: getColorConversions(color.hex).cmyk },
                      { label: 'LCH', value: getColorConversions(color.hex).lch }
                    ]" :key="fmt.label"
                      class="flex items-center justify-between px-2 py-2 rounded cursor-pointer transition-colors group hover:bg-gray-300/50"
                      @click="handleCopy(fmt.value)">
                      <span>
                        <span class="font-bold">{{ fmt.label }}:</span>
                        <span class="ml-2">{{ fmt.value }}</span>
                      </span>
                      <Copy class="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            <div class="mt-6">
              <CardTitle class="text-base mb-2">Related Colors:</CardTitle>
              <div class="flex gap-2 flex-wrap">
                <HoverCard v-for="color in secondaryPalette" :key="color.hex">
                  <HoverCardTrigger>
                    <div :style="{ background: color.hex, width: '73px', height: '75px' }"
                      @click="() => { handleSelectColor(color.hex); handleCopy(color.hex); }" />
                    <div class="w-full text-center text-xs font-mono mt-1" @click="handleCopy(color.hex)">{{ color.hex }}
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div
                      class="flex flex-col text-sm font-mono group-hover:bg-accent/10 rounded-md min-w-[350px] transition-colors">
                      <div v-for="fmt in [
                        { label: 'HEX', value: color.hex },
                        { label: 'RGB', value: getColorConversions(color.hex).rgb },
                        { label: 'HSL', value: getColorConversions(color.hex).hsl },
                        { label: 'HWB', value: getColorConversions(color.hex).hwb },
                        { label: 'CMYK', value: getColorConversions(color.hex).cmyk },
                        { label: 'LCH', value: getColorConversions(color.hex).lch }
                      ]" :key="fmt.label"
                        class="flex items-center justify-between px-2 py-2 rounded cursor-pointer transition-colors group hover:bg-gray-300/50"
                        @click="handleCopy(fmt.value)">
                        <span>
                          <span class="font-bold">{{ fmt.label }}:</span>
                          <span class="ml-2">{{ fmt.value }}</span>
                        </span>
                        <Copy class="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <!-- Color Analysis & Conversions -->
      <section class="w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Color Analysis:</CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="text-sm space-y-1 font-mono">
              <li>Valid CSS Color: <span
                  :class="{ 'text-green-600': colorAnalysis.isValid, 'text-red-600': !colorAnalysis.isValid }">{{
                    colorAnalysis.isValid ? 'Yes' : 'No' }}</span></li>
              <li>Format: {{ colorAnalysis.format }}</li>
              <li>Hue: {{ colorAnalysis.hue }}°</li>
              <li>Brightness: {{ colorAnalysis.brightness }}%</li>
              <li>Luminance: {{ colorAnalysis.luminance }}%</li>
              <li>Contrast on White: {{ colorAnalysis.contrast.toFixed(2) }}:1</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conversions:</CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="text-sm space-y-1 font-mono">
              <li>HEX: {{ colorConversions.hex }}</li>
              <li>RGB: {{ colorConversions.rgb }}</li>
              <li>HSL: {{ colorConversions.hsl }}</li>
              <li>HWB: {{ colorConversions.hwb }}</li>
              <li>CMYK: {{ colorConversions.cmyk }}</li>
              <li>LCH: {{ colorConversions.lch }}</li>
              <li>CSS Keyword: {{ colorConversions.keyword }}</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <!-- Footer -->
      <footer class="mt-6 flex flex-col items-center gap-2 text-xs text-muted-foreground">
        <div class="flex gap-4 mb-1">
          <a href="https://instagram.com/krtclcdy" target="_blank" rel="noopener" aria-label="Instagram">
            <Instagram class="w-5 h-5 hover:text-primary transition" />
          </a>
          <a href="https://linkedin.com/in/kurtcalacday" target="_blank" rel="noopener" aria-label="LinkedIn">
            <Linkedin class="w-5 h-5 hover:text-primary transition" />
          </a>
          <a href="https://github.com/KurutoDenzeru/Chromi" target="_blank" rel="noopener" aria-label="GitHub">
            <Github class="w-5 h-5 hover:text-primary transition" />
          </a>
        </div>
        <div class="text-center">
          © {{ new Date().getFullYear() }} Palette Alchemacy. KurutoDenzeru. All rights reserved.
        </div>
      </footer>

      <Toaster position="bottom-right" />
    </main>
  </div>
</template>
