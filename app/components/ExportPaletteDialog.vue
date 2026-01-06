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

    <DialogContent class="max-w-[95vw] w-full sm:max-w-md text-left">
      <DialogHeader class="text-left">
        <DialogTitle class="flex items-center gap-2">
          <Package class="w-5 h-5" />
          Export Palette
        </DialogTitle>
      </DialogHeader>
      <div class="flex flex-col gap-4 py-2">
        <label class="text-sm font-medium">File Name:</label>
        <Input v-model="paletteName" class="mb-2" placeholder="Palette name" />
        <label class="text-sm font-medium">Export Format:</label>
        <Select v-model="exportFormat">
          <SelectTrigger class="w-full">
            <component :is="exportFormats.find(f => f.value === exportFormat)?.icon" class="size-4 mr-2" />
            {{exportFormats.find(f => f.value === exportFormat)?.label}}
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="fmt in exportFormats" :key="fmt.value" :value="fmt.value">
              <component :is="fmt.icon" class="size-4 mr-2" />
              {{ fmt.label }}
            </SelectItem>
          </SelectContent>
        </Select>
        <DialogFooter class="pt-2">
          <Button class="w-full gap-2" @click="exportPalette">
            <Download class="w-4 h-4" />
            Export
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
</template>
