<script setup lang="ts">
  import { Instagram, Linkedin, Github } from 'lucide-vue-next'
  import Button from '@/components/ui/button/Button.vue'
  import ThemeSwitcher from '@/components/ThemeSwitcher.vue'

  const socials = [
    { label: 'Instagram', url: 'https://instagram.com/krtclcdy', icon: Instagram },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/kurtcalacday', icon: Linkedin },
    { label: 'GitHub', url: 'https://github.com/KurutoDenzeru/Chromi', icon: Github },
  ] as const
</script>

<template>
  <footer class="mt-4 flex justify-center">
    <div
      class="w-full max-w-7xl rounded-xl border border-border/70 bg-card/80 px-4 py-4 shadow-xs backdrop-blur-xl sm:px-5">
      <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p class="text-sm text-muted-foreground order-2 sm:order-1">
          © {{ new Date().getFullYear() }} Chromi. KurutoDenzeru. All rights reserved.
        </p>

        <div class="flex items-center gap-2 order-1 sm:order-2">
          <Button v-for="item in socials" :key="item.label" as="a" :href="item.url" target="_blank"
            rel="noopener noreferrer" variant="ghost" size="icon"
            class="rounded-full border border-border/70 bg-background/50 text-foreground transition hover:bg-background/80 hover:text-cyan-500"
            :aria-label="item.label">
            <component :is="item.icon" class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </footer>
</template>
