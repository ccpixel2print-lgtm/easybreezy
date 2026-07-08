import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServicesGrid from '@/components/ServicesGrid';
import BusinessServicesSection from '@/components/BusinessServicesSection';
import Reveal from '@/components/Reveal';
import { fetchServices } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Our Services | Easy Breezy Service Provider',
  description:
    'Browse all Easy Breezy home services — plumber, electrician, maid, deep cleaning, AC service, bathroom, sofa & kitchen cleaning. Trusted, verified professionals for every home need.',
};

export default async function ServicesPage() {
  const services = await fetchServices();
  return (
    <>
      <Navbar />
      <main>
        {/* Page header / banner */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-tint via-white to-white pt-[68px]">
          <div className="pointer-events-none absolute -right-24 -top-10 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-20">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-brand shadow-soft ring-1 ring-brand/10">
                <span className="flex h-2 w-2 rounded-full bg-accent" />
                All Home Services
              </span>

              <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-brand sm:text-5xl">
                Our{' '}
                <span className="relative inline-block">
                  <span className="relative z-10">Services</span>
                  <span className="absolute inset-x-0 bottom-1 z-0 h-3.5 -rotate-1 bg-accent/70 sm:h-4" />
                </span>
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-base text-ink/75 sm:text-lg">
                Trusted, verified professionals for every home need.
              </p>
            </div>
          </div>
        </section>

        {/* B2C services grid */}
        <section id="services" className="scroll-mt-24 bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="mx-auto mb-10 max-w-2xl text-center">
              <span className="inline-block rounded-full bg-brand-tint px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
                Book Online
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-brand sm:text-4xl">
                Book a Home Service
              </h2>
              <p className="mt-3 text-base text-ink/70">
                Pick a service, choose a time, and relax — a verified professional
                will be at your doorstep.
              </p>
            </Reveal>

            <ServicesGrid services={services} />
          </div>
        </section>

        {/* B2B section (Contact Us scrolls back to home contact section) */}
        <BusinessServicesSection contactHref="/#contact" />
      </main>
      <Footer />
    </>
  );
}
