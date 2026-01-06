import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/image',
    'nuxt-vitalizer',
    'shadcn-nuxt',
    '@pinia/nuxt'
  ],
  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],

    build: {
      sourcemap: false,
    },
  },

  components: {
    global: true,
    dirs: [
      '~/layouts',
      '~/components',
      '~/components/ui',
      '~/composables',
    ],
  },

  // Nuxt Vitalizer
  vitalizer: {
    // Remove the render-blocking entry CSS
    // disableStylesheets: 'entry',
    // Remove preloading build resources
    // disablePrefetchLinks: true
  },

  // Shadnc Nuxt
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./app/components/ui"
     */
    componentDir: './app/components/ui'
  }
})
