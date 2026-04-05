<script setup lang="ts">
  import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'
  import { usePalette } from '@/composables/palette/usePalette'
  import Input from '@/components/ui/input/Input.vue'
  import { Palette, Shuffle, Info, Download, Sun, Moon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'
  import ExportPaletteDialog from '@/components/ExportPaletteDialog.vue'
  import { Drawer, DrawerTrigger, DrawerContent, DrawerClose, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer'
  import { useWindowSize, useStorage } from '@vueuse/core'
  import { Dialog, DialogTrigger, DialogTrigger as DialogTriggerComp, DialogContent as DialogContentComp, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose as DialogCloseComp } from '@/components/ui/dialog'

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
  const MODE_LABELS: Record<PaletteMode, string> = {
    analogous: 'Analogous',
    monochrome: 'Monochromatic',
    complementary: 'Complementary',
    triadic: 'Triadic',
    compound: 'Split-Complementary',
    shades: 'Shades',
    tetradic: 'Tetradic',
    square: 'Square',
  }

  const props = withDefaults(defineProps<{
    paletteMode?: PaletteMode
  }>(), {
    paletteMode: 'shades',
  })

  const colorInput = ref('#dc143c')
  const paletteMode = ref<PaletteMode>(props.paletteMode)
  const displayGridColumns = ref(12)

  const { width: windowWidth } = useWindowSize()
  const defaultGridColumns = computed(() => {
    if (typeof window === 'undefined') return 16
    const availableWidth = Math.max(windowWidth.value - 80, 300)
    const colCount = Math.max(4, Math.floor(availableWidth / 78))
    return Math.min(colCount, 28)
  })

  const gridSize = ref(14)
  const imagePalette = ref<string[]>([])

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
    gridColumnsChange: [value: number]
    paletteModeChange: [value: PaletteMode]
  }>()

  const isDesktop = ref(true)
  const open = ref(false)

  const Modal = computed(() => ({
    Root: isDesktop.value ? Dialog : Drawer,
    Trigger: isDesktop.value ? DialogTriggerComp : DrawerTrigger,
    Content: isDesktop.value ? DialogContentComp : DrawerContent,
    Header: isDesktop.value ? DialogHeader : DrawerHeader,
    Title: isDesktop.value ? DialogTitle : DrawerTitle,
    Description: isDesktop.value ? DialogDescription : DrawerDescription,
    Footer: isDesktop.value ? DialogFooter : DrawerFooter,
    Close: isDesktop.value ? DialogCloseComp : DrawerClose,
  }))

  const modalContentProps = computed(() => (isDesktop.value ? {} : { direction: 'bottom' as const }))
  let removeMediaListener: (() => void) | undefined
  let removeColorSchemeListener: (() => void) | undefined
  const resolvedTheme = ref<'light' | 'dark'>('light')

  const handleInputEnter = () => {
    generatePalette(gridSize.value)
  }

  const handleGenerateRandom = () => {
    const randomMode = MODES[Math.floor(Math.random() * MODES.length)] as PaletteMode
    paletteMode.value = randomMode
    generateRandom(gridSize.value)

    toast.success('Palette randomized!', {
      description: `Switched to ${randomMode} mode`,
      duration: 1800,
      position: isDesktop.value ? 'bottom-right' : 'top-center',
    })
  }

  const themeMode = useStorage<'system' | 'light' | 'dark'>(
    'palette-alchemy-theme',
    'system',
    typeof window !== 'undefined' ? window.localStorage : undefined,
  )

  onMounted(() => {
    if (typeof window === 'undefined') return

    applyTheme(themeMode.value)

    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const updateDesktopState = () => {
      isDesktop.value = mediaQuery.matches
    }

    updateDesktopState()
    mediaQuery.addEventListener('change', updateDesktopState)
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleColorSchemeChange = () => {
      if (themeMode.value === 'system') {
        applyTheme('system')
      }
    }
    colorSchemeQuery.addEventListener('change', handleColorSchemeChange)
    removeMediaListener = () => {
      mediaQuery.removeEventListener('change', updateDesktopState)
    }
    removeColorSchemeListener = () => {
      colorSchemeQuery.removeEventListener('change', handleColorSchemeChange)
    }
  })

  onBeforeUnmount(() => {
    removeMediaListener?.()
    removeColorSchemeListener?.()
  })

  function applyTheme(value: string) {
    if (typeof window === 'undefined') return

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = value === 'dark' || (value === 'system' && prefersDark)

    if (value === 'system') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', value)
    }

    document.documentElement.classList.toggle('dark', isDark)
    document.documentElement.classList.toggle('light', !isDark)
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
    resolvedTheme.value = isDark ? 'dark' : 'light'
    themeMode.value = value as 'system' | 'light' | 'dark'
  }

  function toggleTheme() {
    const next = resolvedTheme.value === 'dark' ? 'light' : 'dark'
    applyTheme(next)
  }

  watch(defaultGridColumns, (newDefault) => {
    if (gridSize.value > newDefault) {
      gridSize.value = newDefault
    }
  })

  watch([paletteMode, gridSize], () => {
    if (!imagePalette.value.length) {
      generatePalette(gridSize.value)
    }
  })

  watch([palette, secondaryPalette], () => {
    emit('paletteGenerated', { palette: palette.value, secondaryPalette: secondaryPalette.value })
  })

  watch(colorInput, (newValue) => {
    emit('colorInputChange', newValue)
  })

  watch(() => props.paletteMode, (newMode) => {
    if (newMode && newMode !== paletteMode.value) {
      paletteMode.value = newMode
    }
  }, { immediate: true })

  watch(paletteMode, (newMode) => {
    emit('paletteModeChange', newMode)
  })

  watch(displayGridColumns, (newValue) => {
    emit('gridColumnsChange', newValue)
  }, { immediate: true })

  if (!imagePalette.value.length) {
    generatePalette(gridSize.value)
  }
</script>

<template>
  <component :is="Modal.Root" v-model:open="open">
    <TooltipProvider>
      <div v-if="isDesktop" class="pointer-events-none fixed inset-x-0 top-5 z-50 hidden justify-center md:flex">
        <div
          class="pointer-events-auto flex items-center gap-2 rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-foreground backdrop-blur-xl shadow-md dark:border-border/50 dark:bg-background/75">
          <NuxtLink to="/" aria-label="Chromi Home"
            class="group flex h-12 w-12 items-center justify-center rounded-2xl border border-border/60 bg-background/55 backdrop-blur-md transition hover:bg-accent/80 dark:border-border/50 dark:bg-background/40 dark:hover:bg-accent/50">
            <NuxtImg src="/brand.webp" alt="Chromi" class="h-9 w-9" loading="lazy" />
          </NuxtLink>

          <Separator orientation="vertical" class="mx-1 h-8 bg-border/80 dark:bg-border/60" />

          <Tooltip>
            <TooltipTrigger as-child>
              <component :is="Modal.Trigger" as-child>
                <Button variant="ghost" size="icon" aria-label="Open Palette Controls"
                  class="h-10 w-10 rounded-2xl border border-transparent bg-background/50 text-foreground backdrop-blur-sm transition hover:border-border/70 hover:bg-accent/85 dark:bg-background/35 dark:hover:bg-accent/60">
                  <Palette class="h-5 w-5" />
                </Button>
              </component>
            </TooltipTrigger>
            <TooltipContent side="bottom">Palette controls</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="ghost" size="icon" aria-label="Randomize Palette"
                class="h-10 w-10 rounded-2xl border border-transparent bg-background/50 text-foreground backdrop-blur-sm transition hover:border-border/70 hover:bg-accent/85 dark:bg-background/35 dark:hover:bg-accent/60"
                @click="handleGenerateRandom">
                <Shuffle class="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Randomize</TooltipContent>
          </Tooltip>

          <ExportPaletteDialog :palette="palette" :is-loading="isLoading">
            <template #trigger>
              <Tooltip>
                <TooltipTrigger as-child>
                  <DialogTrigger as-child>
                    <Button variant="ghost" size="icon" aria-label="Export Palette"
                      class="h-10 w-10 rounded-2xl border border-transparent bg-background/50 text-foreground backdrop-blur-sm transition hover:border-border/70 hover:bg-accent/85 dark:bg-background/35 dark:hover:bg-accent/60">
                      <Download class="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">Export palette</TooltipContent>
              </Tooltip>
            </template>
          </ExportPaletteDialog>

          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="ghost" size="icon" aria-label="Toggle theme"
                class="h-10 w-10 rounded-2xl border border-transparent bg-background/50 text-foreground backdrop-blur-sm transition hover:border-border/70 hover:bg-accent/85 dark:bg-background/35 dark:hover:bg-accent/60"
                @click="toggleTheme">
                <component :is="resolvedTheme === 'dark' ? Moon : Sun" class="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Toggle theme</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div v-else class="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
        <div
          class="pointer-events-auto flex w-full max-w-[360px] items-center justify-between rounded-3xl border border-border/70 bg-background/75 px-3 py-2 text-foreground backdrop-blur-xl shadow-md dark:border-border/50 dark:bg-background/80">
          <Button variant="ghost" size="icon" aria-label="Randomize Palette"
            class="h-11 w-11 rounded-2xl bg-background/55 text-foreground hover:bg-accent/80 dark:bg-background/40 dark:hover:bg-accent/60"
            @click="handleGenerateRandom">
            <Shuffle class="h-5 w-5" />
          </Button>

          <ExportPaletteDialog :palette="palette" :is-loading="isLoading">
            <template #trigger>
              <DialogTrigger as-child>
                <Button variant="ghost" size="icon" aria-label="Export Palette"
                  class="h-11 w-11 rounded-2xl bg-background/55 text-foreground hover:bg-accent/80 dark:bg-background/40 dark:hover:bg-accent/60">
                  <Download class="h-5 w-5" />
                </Button>
              </DialogTrigger>
            </template>
          </ExportPaletteDialog>

          <component :is="Modal.Trigger" as-child>
            <Button variant="ghost" aria-label="Open Palette Controls"
              class="h-14 w-14 rounded-2xl border border-border/70 bg-background/65 text-foreground hover:bg-accent/85 dark:border-border/50 dark:bg-background/45 dark:hover:bg-accent/65">
              <Palette class="h-6 w-6" />
            </Button>
          </component>

          <Button variant="ghost" size="icon" aria-label="Toggle theme"
            class="h-11 w-11 rounded-2xl bg-background/55 text-foreground hover:bg-accent/80 dark:bg-background/40 dark:hover:bg-accent/60"
            @click="toggleTheme">
            <component :is="resolvedTheme === 'dark' ? Moon : Sun" class="h-5 w-5" />
          </Button>

          <NuxtLink to="/" aria-label="Chromi Home"
            class="flex h-11 w-11 items-center justify-center rounded-2xl bg-background/55 hover:bg-accent/80 dark:bg-background/40 dark:hover:bg-accent/60">
            <NuxtImg src="/brand.webp" alt="Chromi" class="h-7 w-7" loading="lazy" />
          </NuxtLink>
        </div>
      </div>
    </TooltipProvider>

    <component :is="Modal.Content" v-bind="modalContentProps"
      class="w-[96vw] max-w-xl border-border/70 bg-background/95 text-foreground backdrop-blur-2xl dark:border-border/50 dark:bg-background/95">
      <div class="space-y-5 px-4 py-3 sm:px-5 sm:py-4">
        <component :is="Modal.Header" class="text-left">
          <component :is="Modal.Title" class="font-semibold tracking-wide text-lg">Palette Lab</component>
          <component :is="Modal.Description" class="text-muted-foreground">
            Tune base color, generation count, and display layout.
          </component>
        </component>

        <div class="space-y-4">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Base color</label>
              <Tooltip>
                <TooltipTrigger as-child>
                  <button type="button"
                    class="inline-flex items-center gap-1 text-xs text-muted-foreground/90 hover:text-foreground">
                    <Info class="h-3.5 w-3.5" />
                    formats
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  HEX, RGB, HSL, and named colors are supported.
                </TooltipContent>
              </Tooltip>
            </div>
            <div class="flex items-center gap-2">
              <Input v-model="colorInput"
                class="h-11 border-border bg-background/70 font-mono text-base text-foreground placeholder:text-muted-foreground dark:bg-background/55"
                placeholder="#dc143c" @keyup.enter="handleInputEnter" />
              <ColorPicker v-model="colorInput"
                class="rounded-xl border border-border bg-background/70 p-1 dark:bg-background/55" />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Harmony</label>
            <Select v-model="paletteMode">
              <SelectTrigger
                class="h-11 w-full border-border bg-background/70 capitalize text-foreground dark:bg-background/55">
                {{ MODE_LABELS[paletteMode] }}
              </SelectTrigger>
              <SelectContent class="border-border bg-popover text-popover-foreground">
                <SelectItem v-for="mode in MODES" :key="mode" :value="mode" class="capitalize">
                  {{ MODE_LABELS[mode] }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Generated
                shades</label>
              <span
                class="rounded-full border border-border bg-muted px-2.5 py-0.5 font-mono text-sm text-muted-foreground">
                {{ gridSize }}
              </span>
            </div>
            <Slider :model-value="[gridSize]" :min="4" :max="32" :step="2" class="w-full"
              @update:model-value="(value) => { if (value && value[0]) gridSize = value[0] }" />
            <div class="grid grid-cols-8 gap-1 text-center text-[11px] font-mono text-muted-foreground">
              <span v-for="n in [4, 8, 12, 16, 20, 24, 28, 32]" :key="n">{{ n }}</span>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Display grid
                columns</label>
              <span
                class="rounded-full border border-border bg-muted px-2.5 py-0.5 font-mono text-sm text-muted-foreground">
                {{ displayGridColumns }}
              </span>
            </div>
            <Slider :model-value="[displayGridColumns]" :min="4" :max="16" :step="1" class="w-full"
              @update:model-value="(value) => { if (value && value[0]) displayGridColumns = value[0] }" />
            <div class="grid grid-cols-7 gap-1 text-center text-[11px] font-mono text-muted-foreground">
              <span v-for="n in [4, 6, 8, 10, 12, 14, 16]" :key="n">{{ n }}</span>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
            <Button variant="ghost"
              class="h-10 border border-border bg-background/70 text-foreground hover:bg-accent/80 dark:bg-background/55 dark:hover:bg-accent/60"
              :disabled="isLoading" @click="handleGenerateRandom">
              <Shuffle class="h-4 w-4" />
              Randomize
            </Button>

            <ExportPaletteDialog :palette="palette" :is-loading="isLoading">
              <template #trigger>
                <DialogTrigger as-child>
                  <Button variant="ghost"
                    class="h-10 border border-border bg-background/70 text-foreground hover:bg-accent/80 dark:bg-background/55 dark:hover:bg-accent/60">
                    <Download class="h-4 w-4" />
                    Export
                  </Button>
                </DialogTrigger>
              </template>
            </ExportPaletteDialog>
          </div>
        </div>
      </div>
    </component>
  </component>
</template>
