<script setup lang="ts">
  import { ref } from 'vue'
  import Input from '@/components/ui/input/Input.vue'
  import { FileJson, FileImage, FileText, Download, Package } from 'lucide-vue-next'

  const exportFormats = [
    { label: 'PNG', value: 'png', icon: FileImage },
    { label: 'JPEG', value: 'jpeg', icon: FileImage },
    { label: 'WEBP', value: 'webp', icon: FileImage },
    { label: 'CSS', value: 'css', icon: FileText },
    { label: 'JSON', value: 'json', icon: FileJson }
  ]

  const props = defineProps<{
    palette: { hex: string }[]
    isLoading: boolean
  }>()

  const emit = defineEmits(['exported'])

  const paletteName = ref('My Palette')
  const exportFormat = ref('png')

  const exportPalette = async () => {
    const colors = props.palette.map((c: any) => c.hex)
    const name = paletteName.value || 'palette'
    const format = exportFormat.value

    if (['png', 'jpeg', 'webp'].includes(format)) {
      const canvas = document.createElement('canvas')
      const cellSize = 64
      canvas.width = cellSize * colors.length
      canvas.height = cellSize
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      colors.forEach((hex: any, i: any) => {
        ctx.fillStyle = hex
        ctx.fillRect(i * cellSize, 0, cellSize, cellSize)
      })
      const mime = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png'
      canvas.toBlob(blob => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${name}.${format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        emit('exported', format)
      }, mime)
    } else if (format === 'css') {
      let css = `:root {\n`
      colors.forEach((hex: any, i: any) => {
        css += `  --palette-color-${i + 1}: ${hex};\n`
      })
      css += `}`
      const blob = new Blob([css], { type: 'text/css' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${name}.css`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      emit('exported', format)
    } else if (format === 'json') {
      const json = JSON.stringify(colors, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${name}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      emit('exported', format)
    }
  }
</script>

<template>
  <Dialog>
    <!-- Optional trigger slot: if provided, use it; otherwise fall back to full-width button -->
    <template v-if="$slots.trigger">
      <slot name="trigger" />
    </template>
    <template v-else>
      <DialogTrigger as-child>
        <Button
          class="w-full flex items-center justify-center gap-2 rounded-md shadow-xs bg-card hover:bg-accent transition-colors"
          aria-label="Open Export Dialog" variant="outline">
          <Download class="w-5 h-5 text-primary" />
          <span>Export Palette</span>
        </Button>
      </DialogTrigger>
    </template>

    <DialogContent class="max-w-[95vw] w-full sm:max-w-[480px] p-0 overflow-hidden border-border/60">
      <div class="bg-card p-6 pb-4 border-b border-border/40">
        <DialogHeader class="text-left">
          <DialogTitle class="flex items-center gap-2.5 text-xl font-bold tracking-tight">
            <div
              class="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Download class="size-4" />
            </div>
            Export Palette
          </DialogTitle>
          <DialogDescription class="text-sm text-muted-foreground mt-1.5 opacity-90 leading-tight">
            Download your current tone matrix locally, save as formatted tokens, or share effortlessly.
          </DialogDescription>
        </DialogHeader>
      </div>

      <div class="flex flex-col gap-6 px-6 py-4">
        <div class="space-y-3">
          <label class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">File Name</label>
          <Input v-model="paletteName"
            class="h-11 rounded-lg bg-accent/30 focus-visible:ring-primary/40 focus-visible:border-primary/50 text-base"
            placeholder="My Chromi Palette" />
        </div>

        <div class="space-y-3">
          <label class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Export Format</label>
          <div class="grid grid-cols-3 gap-2.5">
            <button v-for="fmt in exportFormats" :key="fmt.value" @click="exportFormat = fmt.value" :class="[
              'flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all duration-200 outline-none',
              exportFormat === fmt.value
                ? 'border-primary bg-primary/10 text-primary ring-[3px] ring-primary/20 scale-[1.02]'
                : 'border-border/60 bg-card hover:bg-accent hover:border-border text-muted-foreground'
            ]">
              <component :is="fmt.icon" class="size-6 transition-transform"
                :class="exportFormat === fmt.value ? 'scale-110' : ''" />
              <span class="text-xs font-semibold">{{ fmt.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="bg-card/50 p-6 pt-4 border-t border-border/40">
        <Button class="w-full h-11 text-[13px] font-semibold uppercase tracking-wider rounded-lg shadow-sm"
          @click="exportPalette">
          <Package class="mr-2 size-4" />
          Export {{exportFormats.find(f => f.value === exportFormat)?.label}}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
