<script setup lang="ts">
  const siteUrl = 'https://chromi.vercel.app'
  const metadataBase = new URL(siteUrl)
  const pageTitle = 'Chromi - Color Palette Generator'
  const pageDescription = 'Feature-rich palette generator and analyzer using Nuxt, TypeScript, Tailwind, shadcn/ui, Pinia, chroma-js, html2canvas, and VueUse for a fast, accessible, and extensible design workflow.'
  const pageKeywords = 'color palette generator, color analyzer, palette tool, chromi, nuxt, typescript, tailwind'

  const organizationName = 'Chromi'
  const personName = 'Kurt Calacday'
  const absoluteUrl = (path: string) => new URL(path, metadataBase).toString()

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}#organization`,
        name: organizationName,
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: absoluteUrl('/brand.webp'),
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}#website`,
        url: siteUrl,
        name: organizationName,
        description: pageDescription,
        publisher: { '@id': `${siteUrl}#organization` },
        inLanguage: 'en-US',
      },
      {
        '@type': 'WebPage',
        '@id': `${siteUrl}#webpage`,
        url: absoluteUrl('/'),
        name: pageTitle,
        description: pageDescription,
        isPartOf: { '@id': `${siteUrl}#website` },
        about: { '@id': `${siteUrl}#organization` },
        inLanguage: 'en-US',
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${siteUrl}#app`,
        name: organizationName,
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Web',
        url: siteUrl,
        image: absoluteUrl('/OpenGraph.webp'),
        description: pageDescription,
        publisher: { '@id': `${siteUrl}#organization` },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    ],
  }

  useHead({
    htmlAttrs: { lang: 'en' },
    title: pageTitle,
    link: [
      { rel: 'canonical', href: absoluteUrl('/') },
      { rel: 'alternate', href: absoluteUrl('/'), hreflang: 'en-US' },
      { rel: 'alternate', href: absoluteUrl('/'), hreflang: 'x-default' },
      { rel: 'icon', type: 'image/webp', href: '/brand.webp' },
      { rel: 'apple-touch-icon', href: '/brand.webp' },
    ],
    meta: [{ name: 'googlebot', content: 'index, follow, max-image-preview:large' }],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(structuredData),
      },
    ],
  })

  useSeoMeta({
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords,
    author: personName,
    creator: personName,
    publisher: personName,
    robots: 'index, follow, max-image-preview:large',
    ogTitle: pageTitle,
    ogDescription: pageDescription,
    ogType: 'website',
    ogUrl: absoluteUrl('/'),
    ogSiteName: organizationName,
    ogLocale: 'en_US',
    ogImage: absoluteUrl('/OpenGraph.webp'),
    ogImageAlt: 'Chromi Open Graph Image',
    twitterCard: 'summary_large_image',
    twitterTitle: pageTitle,
    twitterDescription: pageDescription,
    twitterImage: absoluteUrl('/OpenGraph.webp'),
  })
</script>

<template>
  <NuxtPage />
</template>
