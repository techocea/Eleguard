import Navbar from '@/components/eleguard/Navbar'
import Hero from '@/components/eleguard/Hero'
import ProblemSolution from '@/components/eleguard/ProblemSolution'
import HowItWorks from '@/components/eleguard/HowItWorks'
import KeyFeatures from '@/components/eleguard/KeyFeatures'
import Dashboard from '@/components/eleguard/Dashboard'
import Stats from '@/components/eleguard/Stats'
import CTA from '@/components/eleguard/CTA'
import Footer from '@/components/eleguard/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProblemSolution />
        <HowItWorks />
        <KeyFeatures />
        <Dashboard />
        <Stats />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
