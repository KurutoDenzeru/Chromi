<script setup lang="ts">
import { computed } from 'vue'
import { Shuffle } from 'lucide-vue-next'
import Input from '@/components/ui/input/Input.vue'

const props = defineProps<{
  variations: number
  hueStart: number
  hueEnd: number
  saturation: number
}>()

const emit = defineEmits<{
  updateVariations: [value: number]
  updateHueStart: [value: number]
  updateHueEnd: [value: number]
  updateSaturation: [value: number]
  randomizeRequested: []
}>()

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const normalizeHue = (value: number) => ((value % 360) + 360) % 360

const safeVariations = computed(() => clamp(Math.round(props.variations), 2, 12))
const safeHueStart = computed(() => clamp(Math.round(props.hueStart), 0, 360))
const safeHueEnd = computed(() => clamp(Math.round(props.hueEnd), 0, 360))
const safeSaturation = computed(() => clamp(Math.round(props.saturation), 0, 100))

const wheelNodes = computed(() => {
  const count = safeVariations.value
  const start = safeHueStart.value
  const end = safeHueEnd.value

  return Array.from({ length: count }, (_, index) => {
    const ratio = count === 1 ? 0 : index / (count - 1)
    const hue = normalizeHue(start + (end - start) * ratio)
    const radians = ((hue - 90) * Math.PI) / 180
    const radius = 44
    const x = 50 + Math.cos(radians) * radius
    const y = 50 + Math.sin(radians) * radius
    return { hue, x, y }
  })
})

const onVariationsChange = (value: number[]) => {
  if (value?.[0] !== undefined) emit('updateVariations', clamp(Math.round(value[0]), 2, 12))
}

const onSaturationChange = (value: number[]) => {
  if (value?.[0] !== undefined) emit('updateSaturation', clamp(Math.round(value[0]), 0, 100))
}

const onHueStartInput = (value: string) => {
  const next = Number.parseInt(value, 10)
  if (!Number.isNaN(next)) emit('updateHueStart', clamp(next, 0, 360))
}

const onHueEndInput = (value: string) => {
  const next = Number.parseInt(value, 10)
  if (!Number.isNaN(next)) emit('updateHueEnd', clamp(next, 0, 360))
}
</script>

<template>
  <aside class="border-b border-border/60 xl:border-b-0 xl:border-r">
    <div class="h-full p-4">
      <div class="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 class="text-sm font-semibold tracking-wide text-foreground">Generate Palettes</h2>
          <p class="text-xs text-muted-foreground">Adding {{ safeVariations }} palettes</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          class="h-8 gap-1.5 border border-border/70 bg-background/65 px-2.5 text-xs text-foreground hover:bg-accent"
          @click="emit('randomizeRequested')"
        >
          <Shuffle class="h-3.5 w-3.5" />
          Randomize
        </Button>
      </div>

      <div class="mb-5">
        <div class="mb-2 flex items-center justify-between text-foreground">
          <span class="text-sm font-semibold tracking-wide">Color Wheel</span>
          <span class="rounded-md border border-border/80 bg-muted/70 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">P{{ safeVariations }}</span>
        </div>

        <div class="rounded-xl border border-border/70 bg-card/80 p-3">
          <div class="relative mx-auto h-64 w-64">
            <div class="absolute inset-0 rounded-[28%] bg-[conic-gradient(from_0deg,red,#ff8c00,#ffd700,#8cff00,#00d084,#00bfff,#3b82f6,#8b5cf6,#e11d48,red)]" />
            <div class="absolute inset-[18px] rounded-[26%] border border-border/70 bg-background/85" />
            <div class="absolute inset-[58px] rounded-full border border-dashed border-border/70 bg-background/60" />

            <svg viewBox="0 0 100 100" class="absolute inset-[18px] h-[calc(100%-36px)] w-[calc(100%-36px)]">
              <polyline
                :points="wheelNodes.map((node) => `${node.x},${node.y}`).join(' ')"
                fill="none"
                class="stroke-foreground/80"
                stroke-width="1.4"
              />
              <circle
                v-for="node in wheelNodes"
                :key="`node-${Math.round(node.hue)}-${node.x}`"
                :cx="node.x"
                :cy="node.y"
                r="3.6"
                class="stroke-background"
                fill="hsl(var(--node-h), 85%, 55%)"
                :style="{ '--node-h': `${node.hue}` }"
                stroke-width="1.6"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="grid grid-cols-[1fr_auto_1fr_auto] items-end gap-2">
          <div>
            <label class="mb-1 block text-[13px] font-medium text-foreground">Hue Start</label>
            <Input :model-value="String(safeHueStart)" class="h-10 bg-background/70" @update:model-value="onHueStartInput" />
          </div>
          <Button variant="ghost" size="icon" class="h-10 w-10" @click="emit('updateHueStart', clamp(safeHueStart - 1, 0, 360))">−</Button>

          <div>
            <label class="mb-1 block text-[13px] font-medium text-foreground">Hue End</label>
            <Input :model-value="String(safeHueEnd)" class="h-10 bg-background/70" @update:model-value="onHueEndInput" />
          </div>
          <Button variant="ghost" size="icon" class="h-10 w-10" @click="emit('updateHueEnd', clamp(safeHueEnd + 1, 0, 360))">+</Button>
        </div>

        <div>
          <label class="mb-2 block text-[13px] font-medium text-foreground">Saturation ({{ safeSaturation }}%)</label>
          <Slider :model-value="[safeSaturation]" :min="0" :max="100" :step="1" class="w-full" @update:model-value="onSaturationChange" />
          <p class="mt-2 text-xs text-muted-foreground">Adjust all chromas uniformly across palette columns.</p>
        </div>

        <div class="border-t border-border/60 pt-3">
          <label class="mb-2 block text-[13px] font-medium text-foreground">Variations ({{ safeVariations }})</label>
          <Slider :model-value="[safeVariations]" :min="2" :max="12" :step="1" class="w-full" @update:model-value="onVariationsChange" />
        </div>
      </div>
    </div>
  </aside>
</template>
