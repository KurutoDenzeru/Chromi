<script setup lang="ts">
  import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
</script>

<template>
  <nav
    class="mb-6 rounded-2xl border border-border/70 bg-card/95 px-4 py-3 shadow-xs backdrop-blur-xl transition-colors sm:px-5">
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="relative h-10 w-10 overflow-hidden">
          <img src="/brand.webp" alt="Chromi logo" class="h-full w-full object-cover" />
        </div>
        <span class="text-lg font-bold tracking-tight text-foreground">Chromi</span>
      </div>

      <ThemeSwitcher icon-only class="w-auto" />
    </div>
  </nav>
</template>
