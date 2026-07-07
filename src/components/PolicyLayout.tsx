import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface PolicyLayoutProps {
  title: string;
  intro?: string;
  children: ReactNode;
}

/**
 * Shared brand-styled shell for legal / policy pages.
 * Reuses the sticky navbar + footer. WhatsApp button is global via layout.tsx.
 */
export default function PolicyLayout({ title, intro, children }: PolicyLayoutProps) {
  return (
    <>
      <Navbar />
      <main>
        {/* Header banner */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-tint via-white to-white pt-[68px]">
          <div className="pointer-events-none absolute -right-24 -top-10 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />

          <div className="relative mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-brand shadow-soft ring-1 ring-brand/10">
                <span className="flex h-2 w-2 rounded-full bg-accent" />
                Legal
              </span>
              <h1 className="mx-auto mt-5 text-3xl font-extrabold leading-[1.15] tracking-tight text-brand sm:text-4xl">
                {title}
              </h1>
              {intro && (
                <p className="mx-auto mt-4 max-w-xl text-base text-ink/75">{intro}</p>
              )}
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <article className="prose-policy space-y-6 text-sm leading-relaxed text-ink/75">
              <p className="text-xs font-medium uppercase tracking-wider text-ink/40">
                Last updated: 7 July 2026
              </p>
              {children}
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
