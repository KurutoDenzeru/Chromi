<script setup lang="ts">
import { computed } from 'vue'
import { ChevronDown, ChevronUp, Shuffle } from 'lucide-vue-next'
import Input from '@/components/ui/input/Input.vue'
import { InputGroup } from '@/components/ui/input-group'
import PaletteHueWheel from '@/components/palette/PaletteHueWheel.vue'

const props = defineProps<{
  variations: number
  hueStart: number
  hueEnd: number
  saturation: number
  pointSaturations: number[]
}>()

const emit = defineEmits<{
  updateVariations: [value: number]
  updateHueStart: [value: number]
  updateHueEnd: [value: number]
  updateSaturation: [value: number]
  updatePointSaturation: [payload: { index: number; value: number }]
  randomizeRequested: []
}>()

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const roundToTenths = (value: number) => Math.round(value * 10) / 10
const safeVariations = computed(() => clamp(Math.round(props.variations), 2, 12))
const safeHueStart = computed(() => roundToTenths(clamp(props.hueStart, 0, 360)))
const safeHueEnd = computed(() => roundToTenths(clamp(props.hueEnd, 0, 360)))
const safeSaturation = computed(() => clamp(Math.round(props.saturation), 0, 100))

const onVariationsChange = (value: number[]) => {
  if (value?.[0] !== undefined) emit('updateVariations', clamp(Math.round(value[0]), 2, 12))
}

const onSaturationChange = (value: number[]) => {
  if (value?.[0] !== undefined) emit('updateSaturation', clamp(Math.round(value[0]), 0, 100))
}

const onHueStartInput = (value: string) => {
  const next = Number.parseFloat(value)
  if (!Number.isNaN(next)) emit('updateHueStart', clamp(next, 0, 360))
}

const onHueEndInput = (value: string) => {
  const next = Number.parseFloat(value)
  if (!Number.isNaN(next)) emit('updateHueEnd', clamp(next, 0, 360))
}

const nudgeHueStart = (delta: number) => {
  emit('updateHueStart', roundToTenths(clamp(safeHueStart.value + delta, 0, 360)))
}

const nudgeHueEnd = (delta: number) => {
  emit('updateHueEnd', roundToTenths(clamp(safeHueEnd.value + delta, 0, 360)))
}
</script>

<template>
  <aside class="border-b border-border/60 xl:border-b-0 xl:border-r">
    <div class="h-full p-4 sm:p-5">
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

        <PaletteHueWheel
          :variations="safeVariations"
          :hue-start="safeHueStart"
          :hue-end="safeHueEnd"
          :saturation="safeSaturation"
          :point-saturations="props.pointSaturations"
          @update-hue-start="emit('updateHueStart', $event)"
          @update-hue-end="emit('updateHueEnd', $event)"
          @update-point-saturation="emit('updatePointSaturation', $event)"
        />
      </div>

      <div class="space-y-4">
        <div class="grid gap-3 sm:grid-cols-2">
          <div>
            <label class="mb-1 block text-[13px] font-medium text-foreground">Hue Start</label>
            <div class="grid grid-cols-[1fr_auto] gap-2">
              <InputGroup class="h-11 rounded-xl bg-background/70">
                <Input :model-value="safeHueStart.toFixed(1)" class="h-11 rounded-xl border-0 bg-transparent shadow-none focus-visible:ring-0" @update:model-value="onHueStartInput" />
              </InputGroup>
              <div class="grid h-11 w-11 overflow-hidden rounded-xl border border-border/70 bg-background/65">
                <Button variant="ghost" size="icon" class="h-[21px] w-11 rounded-none border-b border-border/70" @click="nudgeHueStart(0.1)">
                  <ChevronUp class="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" class="h-[21px] w-11 rounded-none" @click="nudgeHueStart(-0.1)">
                  <ChevronDown class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div>
            <label class="mb-1 block text-[13px] font-medium text-foreground">Hue End</label>
            <div class="grid grid-cols-[1fr_auto] gap-2">
              <InputGroup class="h-11 rounded-xl bg-background/70">
                <Input :model-value="safeHueEnd.toFixed(1)" class="h-11 rounded-xl border-0 bg-transparent shadow-none focus-visible:ring-0" @update:model-value="onHueEndInput" />
              </InputGroup>
              <div class="grid h-11 w-11 overflow-hidden rounded-xl border border-border/70 bg-background/65">
                <Button variant="ghost" size="icon" class="h-[21px] w-11 rounded-none border-b border-border/70" @click="nudgeHueEnd(0.1)">
                  <ChevronUp class="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" class="h-[21px] w-11 rounded-none" @click="nudgeHueEnd(-0.1)">
                  <ChevronDown class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
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
