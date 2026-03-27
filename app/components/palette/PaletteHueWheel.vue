<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
  import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

  const props = defineProps<{
    variations: number
    hueStart: number
    hueEnd: number
    saturation: number
    pointSaturations: number[]
  }>()

  const emit = defineEmits<{
    updateHueStart: [value: number]
    updateHueEnd: [value: number]
    updatePointSaturation: [payload: { index: number; value: number }]
  }>()

  const WHEEL_SIZE = 320
  const CENTER = WHEEL_SIZE / 2
  const OUTER_MIN_RADIUS = 66
  const INNER_RING_RADIUS = 72
  const MIDDLE_RING_RADIUS = 56
  const P3_SHELL_POINTS = [
    { x: 70, y: 106 },
    { x: 84, y: 58 },
    { x: 146, y: 33 },
    { x: 198, y: 26 },
    { x: 242, y: 29 },
    { x: 278, y: 46 },
    { x: 299, y: 94 },
    { x: 307, y: 143 },
    { x: 301, y: 214 },
    { x: 284, y: 267 },
    { x: 251, y: 286 },
    { x: 170, y: 288 },
    { x: 112, y: 281 },
    { x: 73, y: 257 },
    { x: 47, y: 223 },
    { x: 31, y: 173 },
    { x: 30, y: 126 },
    { x: 43, y: 82 },
  ] as const
  const P3_RADIUS_ANCHORS = [
    { hue: 0, radius: 121 },
    { hue: 24, radius: 126 },
    { hue: 46, radius: 132 },
    { hue: 70, radius: 136 },
    { hue: 96, radius: 135 },
    { hue: 122, radius: 131 },
    { hue: 146, radius: 124 },
    { hue: 170, radius: 118 },
    { hue: 194, radius: 114 },
    { hue: 220, radius: 113 },
    { hue: 246, radius: 117 },
    { hue: 274, radius: 123 },
    { hue: 302, radius: 128 },
    { hue: 328, radius: 130 },
    { hue: 348, radius: 126 },
  ] as const

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
  const normalizeHue = (value: number) => ((value % 360) + 360) % 360
  const roundToTenths = (value: number) => Math.round(value * 10) / 10

  type DragState =
    | { type: 'start' }
    | { type: 'end' }
    | { type: 'outer'; index: number }

  const wheelRef = ref<HTMLElement | null>(null)
  const draggingState = ref<DragState | null>(null)

  const safeVariations = computed(() => clamp(Math.round(props.variations), 2, 12))
  const safeHueStart = computed(() => roundToTenths(clamp(props.hueStart, 0, 360)))
  const safeHueEnd = computed(() => roundToTenths(clamp(props.hueEnd, 0, 360)))
  const safeSaturation = computed(() => clamp(Math.round(props.saturation), 0, 100))
  const safePointSaturations = computed(() =>
    Array.from({ length: safeVariations.value }, (_, index) => clamp(Math.round(props.pointSaturations[index] ?? safeSaturation.value), 0, 100)),
  )

  const shellRadiusForHue = (hue: number) => {
    const normalized = normalizeHue(hue)

    for (let index = 0; index < P3_RADIUS_ANCHORS.length; index += 1) {
      const current = P3_RADIUS_ANCHORS[index]
      const next = P3_RADIUS_ANCHORS[(index + 1) % P3_RADIUS_ANCHORS.length]
      if (!current || !next) continue
      const nextHue = index === P3_RADIUS_ANCHORS.length - 1 ? next.hue + 360 : next.hue
      const targetHue = index === P3_RADIUS_ANCHORS.length - 1 && normalized < current.hue ? normalized + 360 : normalized

      if (targetHue >= current.hue && targetHue <= nextHue) {
        const ratio = (targetHue - current.hue) / (nextHue - current.hue)
        return current.radius + (next.radius - current.radius) * ratio
      }
    }

    return 124
  }

  const columnAngles = computed(() => {
    const count = safeVariations.value
    const start = safeHueStart.value
    const end = safeHueEnd.value

    return Array.from({ length: count }, (_, index) => {
      const ratio = count === 1 ? 0 : index / (count - 1)
      return normalizeHue(start + (end - start) * ratio)
    })
  })

  const wheelNodes = computed(() => {
    return columnAngles.value.map((hue, index) => {
      const radians = ((hue - 90) * Math.PI) / 180
      const shellRadius = shellRadiusForHue(hue)
      const saturationValue = safePointSaturations.value[index] ?? safeSaturation.value
      const saturationRatio = saturationValue / 100
      const radius = OUTER_MIN_RADIUS + saturationRatio * (shellRadius - OUTER_MIN_RADIUS)
      const x = CENTER + Math.cos(radians) * radius
      const y = CENTER + Math.sin(radians) * radius

      return { hue, x, y, radius, shellRadius, saturation: saturationValue }
    })
  })

  const wheelPath = computed(() => wheelNodes.value.map((node) => `${node.x},${node.y}`).join(' '))
  const shellBoundaryPoints = computed(() => P3_SHELL_POINTS)
  const shellPath = computed(() => shellBoundaryPoints.value.map((point) => `${point.x},${point.y}`).join(' '))
  const shellClipPath = computed(() => `polygon(${shellBoundaryPoints.value.map((point) => `${(point.x / WHEEL_SIZE) * 100}% ${(point.y / WHEEL_SIZE) * 100}%`).join(', ')})`)

  const wheelFillStyle = computed(() => ({
    clipPath: shellClipPath.value,
    background: `
    radial-gradient(circle at 50% 50%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.72) 20%, rgba(255,255,255,0.26) 44%, rgba(255,255,255,0.04) 64%, rgba(255,255,255,0) 78%),
    conic-gradient(from -90deg, #ff184a 0deg, #ff4f00 32deg, #ffb800 58deg, #fff200 82deg, #a2ff00 112deg, #27f312 142deg, #00e98c 178deg, #09d7ff 226deg, #3272ff 268deg, #7020ff 304deg, #ea1cff 336deg, #ff184a 360deg)
  `,
  }))

  const wheelGlowStyle = computed(() => ({
    clipPath: shellClipPath.value,
    background: 'conic-gradient(from -90deg, #ff4a72 0deg, #ff8d36 58deg, #fff378 94deg, #95ff7d 148deg, #65f2ff 214deg, #7594ff 270deg, #ea61ff 330deg, #ff4a72 360deg)',
    opacity: 0.18,
  }))

  const innerHandle = (hue: number) => {
    const radians = ((hue - 90) * Math.PI) / 180
    return {
      x: CENTER + Math.cos(radians) * MIDDLE_RING_RADIUS,
      y: CENTER + Math.sin(radians) * MIDDLE_RING_RADIUS,
    }
  }

  const startNode = computed(() => innerHandle(safeHueStart.value))
  const endNode = computed(() => innerHandle(safeHueEnd.value))
  const innerArcDelta = computed(() => normalizeHue(safeHueEnd.value - safeHueStart.value))
  const innerArcGradient = computed(() => {
    const x1 = ((startNode.value.x / WHEEL_SIZE) * 100).toFixed(2)
    const y1 = ((startNode.value.y / WHEEL_SIZE) * 100).toFixed(2)
    const x2 = ((endNode.value.x / WHEEL_SIZE) * 100).toFixed(2)
    const y2 = ((endNode.value.y / WHEEL_SIZE) * 100).toFixed(2)

    return { x1: `${x1}%`, y1: `${y1}%`, x2: `${x2}%`, y2: `${y2}%` }
  })
  const innerArcPath = computed(() => {
    const largeArcFlag = innerArcDelta.value > 180 ? 1 : 0
    return `M ${startNode.value.x} ${startNode.value.y} A ${MIDDLE_RING_RADIUS} ${MIDDLE_RING_RADIUS} 0 ${largeArcFlag} 1 ${endNode.value.x} ${endNode.value.y}`
  })

  const handleStyle = (node: { x: number; y: number }) => ({
    left: `${(node.x / WHEEL_SIZE) * 100}%`,
    top: `${(node.y / WHEEL_SIZE) * 100}%`,
  })

  const getPointerMetrics = (clientX: number, clientY: number) => {
    if (!wheelRef.value) return
    const rect = wheelRef.value.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    const angle = Math.atan2(y - rect.height / 2, x - rect.width / 2)
    const hue = roundToTenths(normalizeHue((angle * 180) / Math.PI + 90))
    const distance = Math.hypot(x - rect.width / 2, y - rect.height / 2)
    return { hue, distance }
  }

  const updateHueFromPointer = (clientX: number, clientY: number, target: 'start' | 'end') => {
    const metrics = getPointerMetrics(clientX, clientY)
    if (!metrics) return

    if (target === 'start') {
      emit('updateHueStart', clamp(metrics.hue, 0, 360))
      return
    }

    emit('updateHueEnd', clamp(metrics.hue, 0, 360))
  }

  const updateOuterPointFromPointer = (clientX: number, clientY: number, index: number) => {
    const metrics = getPointerMetrics(clientX, clientY)
    if (!metrics) return

    const shellRadius = shellRadiusForHue(metrics.hue)
    const ratio = clamp((metrics.distance - OUTER_MIN_RADIUS) / (shellRadius - OUTER_MIN_RADIUS), 0, 1)
    emit('updatePointSaturation', {
      index,
      value: Math.round(ratio * 100),
    })
  }

  const stopDragging = () => {
    draggingState.value = null
  }

  const onPointerMove = (event: PointerEvent) => {
    if (!draggingState.value) return

    if (draggingState.value.type === 'outer') {
      updateOuterPointFromPointer(event.clientX, event.clientY, draggingState.value.index)
      return
    }

    updateHueFromPointer(event.clientX, event.clientY, draggingState.value.type)
  }

  const beginHandleDrag = (target: 'start' | 'end', event: PointerEvent) => {
    draggingState.value = { type: target }
    updateHueFromPointer(event.clientX, event.clientY, target)
  }

  const beginOuterDrag = (index: number, event: PointerEvent) => {
    draggingState.value = { type: 'outer', index }
    updateOuterPointFromPointer(event.clientX, event.clientY, index)
  }

  onMounted(() => {
    if (typeof window === 'undefined') return
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', stopDragging)
    window.addEventListener('pointercancel', stopDragging)
  })

  onBeforeUnmount(() => {
    if (typeof window === 'undefined') return
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', stopDragging)
    window.removeEventListener('pointercancel', stopDragging)
  })
</script>

<template>
  <TooltipProvider>
    <div ref="wheelRef"
      class="relative mx-auto aspect-square w-full max-w-[min(100%,22rem)] overflow-hidden rounded-2xl border border-white/8 bg-[#161616] p-4 shadow-sm sm:max-w-[22rem] sm:p-5">
      <div
        class="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div class="pointer-events-none absolute inset-5 rounded-2xl border border-white/8" />
      <div class="pointer-events-none absolute inset-0 m-5 rounded-2xl blur-[10px]" :style="wheelGlowStyle" />
      <div class="pointer-events-none absolute inset-0 m-5 rounded-2xl" :style="wheelFillStyle" />
      <div class="pointer-events-none absolute inset-[22%] rounded-full border border-white/12 bg-[#111111]" />
      <div class="pointer-events-none absolute inset-[25%] rounded-full border border-white/10" />
      <div class="pointer-events-none absolute inset-[29%] rounded-full border border-white/8" />
      <div class="pointer-events-none absolute inset-[34%] rounded-full border border-dashed border-white/10" />

      <svg viewBox="0 0 320 320" class="pointer-events-none absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="inner-hue-arc" :x1="innerArcGradient.x1" :y1="innerArcGradient.y1"
            :x2="innerArcGradient.x2" :y2="innerArcGradient.y2">
            <stop offset="0%" :stop-color="`hsl(${safeHueStart} 95% 72%)`" />
            <stop offset="100%" :stop-color="`hsl(${safeHueEnd} 95% 62%)`" />
          </linearGradient>
        </defs>

        <polyline :points="shellPath" fill="none" stroke="rgba(255,255,255,0.2)" stroke-linecap="round"
          stroke-linejoin="round" stroke-width="1" />

        <polyline :points="wheelPath" fill="none" stroke="rgba(255,255,255,0.92)" stroke-linecap="round"
          stroke-linejoin="round" stroke-width="2" />

        <circle v-for="(node, index) in wheelNodes" :key="`wheel-node-${Math.round(node.hue)}-${index}`" :cx="node.x"
          :cy="node.y" r="4" fill="#f8fafc" :stroke="`hsl(${node.hue} 95% 58%)`" stroke-width="2.5" />

        <circle :cx="CENTER" :cy="CENTER" :r="INNER_RING_RADIUS" fill="none" stroke="rgba(255,255,255,0.15)"
          stroke-width="1.5" />

        <polyline :points="`${startNode.x},${startNode.y} ${CENTER},${CENTER} ${endNode.x},${endNode.y}`" fill="none"
          stroke="rgba(255,255,255,0.16)" stroke-dasharray="5 7" stroke-linecap="round" stroke-linejoin="round"
          stroke-width="1.5" />

        <path :d="innerArcPath" fill="none" stroke="url(#inner-hue-arc)" stroke-linecap="round" stroke-width="5" />
      </svg>

      <Tooltip v-for="(node, index) in wheelNodes" :key="`outer-handle-${index}`">
        <TooltipTrigger as-child>
          <button type="button"
            class="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-transparent transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            :class="draggingState?.type === 'outer' && draggingState.index === index ? 'cursor-grabbing scale-110' : 'cursor-grab hover:scale-105'"
            :style="handleStyle(node)" :aria-label="`Adjust palette ${index + 1} chroma`"
            @pointerdown.prevent.stop="beginOuterDrag(index, $event)" />
        </TooltipTrigger>
        <TooltipContent side="top" class="rounded-lg border border-white/10 bg-[#111111] px-3 py-2 text-[#f8fafc]">
          <div class="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">Palette {{ index + 1 }}</div>
          <div class="mt-1 text-sm font-medium">Chroma {{ node.saturation }}%</div>
          <div class="mt-1 text-[11px] text-white/55">Drag inward or outward to tune this column.</div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger as-child>
          <button type="button"
            class="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#f8fafc] transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            :class="draggingState?.type === 'start' ? 'cursor-grabbing' : 'cursor-grab'" :style="handleStyle(startNode)"
            aria-label="Adjust Hue Start" @pointerdown.prevent.stop="beginHandleDrag('start', $event)" />
        </TooltipTrigger>
        <TooltipContent side="top" class="rounded-lg border border-white/10 bg-[#111111] px-3 py-2 text-[#f8fafc]">
          <div class="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">Hue Start</div>
          <div class="mt-1 text-sm font-medium">{{ safeHueStart }}°</div>
          <div class="mt-1 text-[11px] text-white/55">Drag the endpoint to update the start hue.</div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger as-child>
          <button type="button"
            class="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#f8fafc] transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            :class="draggingState?.type === 'end' ? 'cursor-grabbing' : 'cursor-grab'" :style="handleStyle(endNode)"
            aria-label="Adjust Hue End" @pointerdown.prevent.stop="beginHandleDrag('end', $event)" />
        </TooltipTrigger>
        <TooltipContent side="top" class="rounded-lg border border-white/10 bg-[#111111] px-3 py-2 text-[#f8fafc]">
          <div class="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">Hue End</div>
          <div class="mt-1 text-sm font-medium">{{ safeHueEnd }}°</div>
          <div class="mt-1 text-[11px] text-white/55">Drag the endpoint to update the ending hue.</div>
        </TooltipContent>
      </Tooltip>

      <div
        class="pointer-events-none absolute left-4 top-4 rounded-lg border border-white/10 bg-white/6 px-2 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white/70">
        P{{ safeVariations }}
      </div>
    </div>
  </TooltipProvider>
</template>
