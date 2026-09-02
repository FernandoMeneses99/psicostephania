import type { Metadata } from 'next'
import { Lora, Nunito_Sans } from 'next/font/google'
import { CookieConsent } from '@/components/layout/cookie-consent'
import './globals.css'

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito-sans',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://psicostephania.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Psico. Stephania | Acompañamiento psicológico profesional',
    template: '%s | Psico. Stephania',
  },
  description:
    'Un espacio seguro para cuidar tu bienestar emocional. Acompañamiento psicológico profesional, confidencial y personalizado.',
  applicationName: 'Psico. Stephania',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Psico. Stephania',
    title: 'Psico. Stephania | Acompañamiento psicológico profesional',
    description:
      'Un espacio seguro para cuidar tu bienestar emocional. Acompañamiento psicológico profesional, confidencial y personalizado.',
    locale: 'es_CO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Psico. Stephania | Acompañamiento psicológico profesional',
    description:
      'Un espacio seguro para cuidar tu bienestar emocional.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${lora.variable} ${nunitoSans.variable}`}>
      <body>
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}