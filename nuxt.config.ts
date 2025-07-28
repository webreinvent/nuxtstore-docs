// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['docus'],

  modules: ['@nuxtjs/plausible'],

  css: ['~/assets/css/main.css'],

  site: {
    name: 'NuxtStore',
  },

  devtools: {
    enabled: true
  },

  colorMode: {
    disableTransition: true
  },

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2025-07-18',

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true
    }
  },

  typescript: {
    strict: false
  },

  hooks: {
    // Define `@nuxt/ui` components as global to use them in `.md` (feel free to add those you need)
    'components:extend': (components) => {
      const globals = components.filter(c => ['UButton', 'UIcon'].includes(c.pascalName))

      globals.forEach(c => c.global = true)
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
