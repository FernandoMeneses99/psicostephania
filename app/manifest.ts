import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Psico. Stephania | Acompañamiento psicológico profesional',
    short_name: 'Psico. Stephania',
    description:
      'Un espacio seguro para cuidar tu bienestar emocional. Acompañamiento psicológico profesional, confidencial y personalizado.',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf8f4',
    theme_color: '#ab5550',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}