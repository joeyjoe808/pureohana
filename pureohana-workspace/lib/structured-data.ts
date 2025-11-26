/**
 * Structured Data (Schema.org) utilities for SEO
 * Generates JSON-LD markup for rich snippets in search results
 */

import type { Gallery, Photo } from './supabase/types'

export interface BreadcrumbItem {
  name: string
  url: string
}

/**
 * Organization/LocalBusiness Schema
 * Used on homepage and key pages
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://pureohanatreasures.com/#organization',
    name: 'Pure Ohana Treasures',
    alternateName: 'Pure Ohana Photography',
    description: 'Luxury photography services in Hawaii specializing in family portraits, couples, weddings, and special events. Capturing life\'s precious moments with aloha.',
    url: 'https://pureohanatreasures.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://pureohanatreasures.com/logo.png',
      width: 600,
      height: 600,
    },
    image: {
      '@type': 'ImageObject',
      url: 'https://pureohanatreasures.com/og-image.jpg',
    },
    telephone: '', // Add when available
    email: 'pureohanatreasures@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Aiea',
      addressRegion: 'HI',
      addressCountry: 'US',
      areaServed: [
        {
          '@type': 'State',
          name: 'Hawaii',
        },
      ],
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 21.3869, // Aiea, Oahu
      longitude: -157.9311,
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 21.3869,
        longitude: -157.9311,
      },
      geoRadius: '100000', // 100km - covers all Hawaiian Islands
    },
    priceRange: '$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '18:00',
    },
    sameAs: [
      'https://www.instagram.com/pureohanatreasures/',
      'https://www.facebook.com/pureohanatreasures/',
      'https://twitter.com/pureohana',
    ],
  }
}

/**
 * Breadcrumb Schema
 * Shows page hierarchy in search results
 */
export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Service Schema
 * Used on services page and individual service pages
 */
export function getServiceSchema(service: {
  name: string
  description: string
  price?: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Photography',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Pure Ohana Treasures',
      url: 'https://pureohanatreasures.com',
    },
    areaServed: {
      '@type': 'State',
      name: 'Hawaii',
    },
    ...(service.price && {
      offers: {
        '@type': 'Offer',
        price: service.price.replace(/[^0-9.]/g, ''),
        priceCurrency: 'USD',
      },
    }),
    ...(service.image && {
      image: {
        '@type': 'ImageObject',
        url: service.image,
      },
    }),
  }
}

/**
 * ImageGallery Schema
 * Used on gallery pages
 */
export function getImageGallerySchema(gallery: Gallery, photos: Photo[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: gallery.title,
    description: gallery.description || `Photo gallery: ${gallery.title}`,
    creator: {
      '@type': 'Organization',
      name: 'Pure Ohana Treasures',
    },
    image: photos.slice(0, 10).map((photo) => ({
      '@type': 'ImageObject',
      contentUrl: photo.web_url,
      thumbnailUrl: photo.thumbnail_url,
      name: photo.filename,
      width: photo.width,
      height: photo.height,
      encodingFormat: 'image/jpeg',
    })),
  }
}

/**
 * ImageObject Schema
 * Used for individual photos
 */
export function getImageObjectSchema(photo: Photo, galleryTitle: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: photo.web_url,
    thumbnailUrl: photo.thumbnail_url,
    name: photo.filename,
    description: `Photo from ${galleryTitle}`,
    width: photo.width,
    height: photo.height,
    encodingFormat: 'image/jpeg',
    creator: {
      '@type': 'Organization',
      name: 'Pure Ohana Treasures',
    },
    copyrightNotice: '© Pure Ohana Treasures LLC',
  }
}

