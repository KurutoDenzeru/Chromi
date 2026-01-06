<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Select from '@/components/ui/select/Select.vue'
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue'
import SelectContent from '@/components/ui/select/SelectContent.vue'
import SelectItem from '@/components/ui/select/SelectItem.vue'
import Dialog from '@/components/ui/dialog/Dialog.vue'
import DialogTrigger from '@/components/ui/dialog/DialogTrigger.vue'
import DialogContent from '@/components/ui/dialog/DialogContent.vue'
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue'
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue'
import DialogFooter from '@/components/ui/dialog/DialogFooter.vue'
import { FileJson, FileImage, FileText, Download } from 'lucide-vue-next'

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
      <DialogTrigger as-child>
        <slot name="trigger" />
      </DialogTrigger>
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
        <DialogTitle>Export Palette</DialogTitle>
      </DialogHeader>
      <div class="flex flex-col gap-2">
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
        <DialogFooter>
          <Button class="mt-4 w-full" @click="exportPalette">Export</Button>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
</template>
