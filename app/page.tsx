import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { Hero } from '@/components/landing/hero'
import { About } from '@/components/landing/about'
import { Services } from '@/components/landing/services'
import { Approach } from '@/components/landing/approach'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Faq } from '@/components/landing/faq'
import { Contact } from '@/components/landing/contact'

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Services />
        <Approach />
        <HowItWorks />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
    </>
  )
}