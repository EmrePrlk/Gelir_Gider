import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dashboard',
    short_name: 'Dashboard',
    description: 'Kişisel komuta merkezin',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#0F0F1A',
    theme_color: '#0F0F1A',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}
