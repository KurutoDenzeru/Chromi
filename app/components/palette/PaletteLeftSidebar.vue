<script setup lang="ts">
  import { computed } from 'vue'
  import { ChevronDown, ChevronUp, Shuffle, FoldVertical, Wand2 } from 'lucide-vue-next'
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
  const MAX_VARIATIONS = 25
  const safeVariations = computed(() => clamp(Math.round(props.variations), 2, MAX_VARIATIONS))
  const safeHueStart = computed(() => roundToTenths(clamp(props.hueStart, 0, 360)))
  const safeHueEnd = computed(() => roundToTenths(clamp(props.hueEnd, 0, 360)))
  const safeSaturation = computed(() => clamp(Math.round(props.saturation), 0, 100))

  const onVariationsChange = (value: number[] | undefined) => {
    if (value?.[0] !== undefined) emit('updateVariations', clamp(Math.round(value[0]), 2, MAX_VARIATIONS))
  }

  const onSaturationChange = (value: number[] | undefined) => {
    if (value?.[0] !== undefined) emit('updateSaturation', clamp(Math.round(value[0]), 0, 100))
  }

  const onHueStartInput = (value: string | number) => {
    const next = typeof value === 'number' ? value : Number.parseFloat(value)
    if (!Number.isNaN(next)) emit('updateHueStart', clamp(next, 0, 360))
  }

  const onHueEndInput = (value: string | number) => {
    const next = typeof value === 'number' ? value : Number.parseFloat(value)
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
  <aside class="border-b border-border/60 bg-transparent xl:border-b-0 xl:border-r">
    <div class="flex h-full flex-col overflow-hidden">
      <div class="shrink-0 px-4 py-4">
        <div class="flex items-center gap-2">
          <Wand2 class="h-4 w-4 text-cyan-500 dark:text-cyan-200" />
          <h2 class="text-sm font-semibold tracking-wide text-foreground">Generate Palettes</h2>
        </div>
        <p class="mt-1 text-xs text-muted-foreground">Adding {{ safeVariations }} palettes</p>
      </div>

      <div class="flex-1 space-y-4 overflow-y-auto px-4 pb-4">
        <div class="space-y-2">
          <div class="flex h-5 items-center justify-between gap-2 text-foreground">
            <span class="text-sm font-medium leading-none">Color Wheel</span>
            <span class="inline-flex size-5 shrink-0 items-center justify-center text-secondary-foreground opacity-80">
              <FoldVertical />
            </span>
          </div>

          <div class="relative flex justify-center pt-2">
            <PaletteHueWheel :variations="safeVariations" :hue-start="safeHueStart" :hue-end="safeHueEnd"
              :saturation="safeSaturation" :point-saturations="props.pointSaturations"
              @update-hue-start="emit('updateHueStart', $event)" @update-hue-end="emit('updateHueEnd', $event)"
              @update-point-saturation="emit('updatePointSaturation', $event)" />
          </div>
        </div>

        <div class="space-y-4">
          <div class="grid gap-3 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-xs font-medium text-foreground">Hue Start</label>
              <div class="grid grid-cols-[1fr_auto] gap-2">
                <InputGroup class="h-9 rounded-lg bg-background/70 shadow-sm transition-shadow hover:shadow-md">
                  <Input :model-value="safeHueStart.toFixed(1)"
                    class="h-9 rounded-lg border-0 bg-transparent px-2.5 text-sm shadow-none focus-visible:ring-0"
                    @update:model-value="onHueStartInput" />
                </InputGroup>
                <div class="grid h-9 w-9 overflow-hidden rounded-lg border border-border/70 bg-background/65 shadow-sm">
                  <Button variant="ghost" size="icon" class="h-[17px] w-9 rounded-none border-b border-border/70 group"
                    @click="nudgeHueStart(0.1)">
                    <ChevronUp class="h-3 w-3 opacity-70 group-hover:opacity-100" />
                  </Button>
                  <Button variant="ghost" size="icon" class="h-[17px] w-9 rounded-none group" @click="nudgeHueStart(-0.1)">
                    <ChevronDown class="h-3 w-3 opacity-70 group-hover:opacity-100" />
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-foreground">Hue End</label>
              <div class="grid grid-cols-[1fr_auto] gap-2">
                <InputGroup class="h-9 rounded-lg bg-background/70 shadow-sm transition-shadow hover:shadow-md">
                  <Input :model-value="safeHueEnd.toFixed(1)"
                    class="h-9 rounded-lg border-0 bg-transparent px-2.5 text-sm shadow-none focus-visible:ring-0"
                    @update:model-value="onHueEndInput" />
                </InputGroup>
                <div class="grid h-9 w-9 overflow-hidden rounded-lg border border-border/70 bg-background/65 shadow-sm">
                  <Button variant="ghost" size="icon" class="h-[17px] w-9 rounded-none border-b border-border/70 group"
                    @click="nudgeHueEnd(0.1)">
                    <ChevronUp class="h-3 w-3 opacity-70 group-hover:opacity-100" />
                  </Button>
                  <Button variant="ghost" size="icon" class="h-[17px] w-9 rounded-none group" @click="nudgeHueEnd(-0.1)">
                    <ChevronDown class="h-3 w-3 opacity-70 group-hover:opacity-100" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="mb-2 block text-xs font-medium text-foreground">Saturation ({{ safeSaturation }}%)</label>
            <Slider :model-value="[safeSaturation]" :min="0" :max="100" :step="1" class="w-full"
              @update:model-value="onSaturationChange" />
            <p class="mt-2 text-[10px] text-muted-foreground leading-tight">Adjust all chromas uniformly across columns.</p>
          </div>

          <div class="border-t border-border/60 pt-3">
            <label class="mb-2 block text-xs font-medium text-foreground">Variations ({{ safeVariations }})</label>
            <Slider :model-value="[safeVariations]" :min="2" :max="MAX_VARIATIONS" :step="1" class="w-full"
              @update:model-value="onVariationsChange" />
          </div>
        </div>
      </div>

      <div class="shrink-0 border-t border-border/60 p-4">
        <Button variant="outline" class="w-full gap-2 bg-background/50 hover:bg-accent hover:shadow-sm transition-all" @click="emit('randomizeRequested')">
          <Shuffle class="h-4 w-4" />
          Randomize Palette
        </Button>
      </div>
    </div>
  </aside>
</template>
