<script setup lang="ts">
  import { Sparkles } from 'lucide-vue-next'

  defineProps<{
    title?: string
    highlightedTitle?: string
    description?: string
    badgeText?: string
  }>()
</script>

<template>
  <section
    class="relative mx-auto flex max-w-4xl flex-col items-center justify-center pt-20 pb-16 text-center sm:pt-28 sm:pb-20">
    <!-- Ambient Glow behind Hero -->
    <div
      class="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-full max-w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.15),transparent_60%)] blur-3xl mix-blend-screen dark:bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.1),transparent_60%)]" />

    <div class="relative z-10 mb-6 flex animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
      <span
        class="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-500 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-300">
        <Sparkles class="h-3 w-3" /> {{ badgeText || 'Chromi Studio 2.0' }}
      </span>
    </div>

    <h1
      class="relative z-10 text-5xl font-extrabold uppercase leading-[0.9] tracking-tighter text-foreground animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 ease-out fill-mode-both sm:text-7xl md:text-8xl">
      <slot name="title">
        Color <br class="sm:hidden" /> Palette <br />
        <span
          class="animate-rainbow-shimmer bg-linear-to-r from-[#ff184a] via-[#ffb800] via-[#a2ff00] via-[#09d7ff] via-[#3272ff] via-[#ea1cff] to-[#ff184a] bg-[length:200%_auto] bg-clip-text text-transparent">
          Generator
        </span>
      </slot>
    </h1>

    <p
      class="relative z-10 mt-6 max-w-xl text-base text-muted-foreground animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 ease-out fill-mode-both sm:text-lg">
      <slot name="description">
        {{
          description ||
          'Engineer mathematically precise color matrices. Analyze contrast ratios instantly, craft harmonious combinations, and export production - ready tokens in seconds.'
        }}
      </slot>
    </p>

    <div class="relative z-10 mt-10 animate-in fade-in duration-1000 delay-500 fill-mode-both text-muted-foreground/60">
      <div class="flex flex-col items-center gap-3">
        <span class="text-[10px] font-bold uppercase tracking-[0.2em]">Explore Builder</span>
        <div class="flex h-8 w-5 justify-center rounded-full border-2 border-current p-1 opacity-60">
          <div class="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
        </div>
      </div>
    </div>
  </section>
</template>
