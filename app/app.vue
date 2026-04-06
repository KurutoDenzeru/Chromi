<script setup lang="ts">
  const siteUrl = 'https://chromi.vercel.app'
  const metadataBase = new URL(siteUrl)
  const pageTitle = 'Chromi — Color Palette Generator & Analyzer'
  const pageDescription = 'Feature-rich palette generator and analyzer using Nuxt, TypeScript, Tailwind, shadcn/ui, Pinia, chroma-js, html2canvas, and VueUse for a fast, accessible, and extensible design workflow.'
  const pageKeywords = 'color palette generator, palette analyzer, color palette tool, design accessibility, Nuxt, Tailwind, TypeScript'

  const organizationName = 'Chromi'
  const personName = 'Kurt Calacday'
  const publisherName = 'Kurt Calacday'
  const creatorName = 'Kurt Calacday'
  const absoluteUrl = (path: string) => new URL(path, metadataBase).toString()
  const ogImages = [absoluteUrl('/OpenGraph.webp'), absoluteUrl('/OpenGraph.png')]
  const ogImageMeta = ogImages.map((url) => ({ url, alt: 'Chromi Open Graph Image' }))

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
        '@type': 'Person',
        '@id': `${siteUrl}#author`,
        name: personName,
        url: siteUrl,
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
        author: { '@id': `${siteUrl}#author` },
        inLanguage: 'en-US',
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${siteUrl}#app`,
        name: organizationName,
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Web',
        url: siteUrl,
        image: ogImages[0],
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

  useHead(
    {
      htmlAttrs: { lang: 'en' },
      title: pageTitle,
      link: [
        { rel: 'canonical', href: absoluteUrl('/') },
        { rel: 'alternate', href: absoluteUrl('/'), hreflang: 'en-US' },
        { rel: 'alternate', href: absoluteUrl('/'), hreflang: 'x-default' },
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'icon', type: 'image/webp', href: '/brand.webp' },
        { rel: 'apple-touch-icon', href: '/brand.webp' },
        {
          rel: 'stylesheet',
          href: 'https://api.fonts.coollabs.io/css2?family=Chakra+Petch:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
        },
      ],
      meta: [
        { name: 'description', content: pageDescription },
        { name: 'keywords', content: pageKeywords },
        { name: 'author', content: personName },
        { name: 'publisher', content: publisherName },
        { name: 'creator', content: creatorName },
        { name: 'robots', content: 'index, follow, max-image-preview:large' },
        { name: 'googlebot', content: 'index, follow, max-image-preview:large' },
        { name: 'theme-color', content: '#111827' },
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(structuredData),
        },
      ],
    }
  )

  useSeoMeta({
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords,
    author: personName,
    creator: creatorName,
    publisher: publisherName,
    robots: 'index, follow, max-image-preview:large',
    ogTitle: pageTitle,
    ogDescription: pageDescription,
    ogType: 'website',
    ogUrl: absoluteUrl('/'),
    ogSiteName: organizationName,
    ogLocale: 'en_US',
    ogImage: ogImageMeta,
    ogImageAlt: 'Chromi Open Graph Image',
    twitterCard: 'summary_large_image',
    twitterTitle: pageTitle,
    twitterDescription: pageDescription,
    twitterImage: ogImageMeta,
    twitterImageAlt: 'Chromi Open Graph Image',
  })
</script>

<template>
  <NuxtPage />
</template>
