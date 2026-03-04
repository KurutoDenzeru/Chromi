import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-13',
  devtools: { enabled: true },
  modules: [
    '@nuxt/image',
    'shadcn-nuxt',
    '@pinia/nuxt'
  ],
  css: [
    '~/assets/css/main.css',
    'vue-sonner/style.css',
  ],

  build: {
    transpile: ['vaul-vue'],
  },

  vite: {
    plugins: [tailwindcss()] as any,
  },

  components: {
    global: true,
    dirs: [
      '~/components',
      '~/components/ui',
      '~/composables',
    ],
  },

  // Shadnc Nuxt
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui'
  }
})
