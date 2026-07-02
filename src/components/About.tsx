import Image from 'next/image';
import Reveal from './Reveal';

const highlights = [
  'Verified & background-checked professionals',
  'Transparent pricing with no hidden charges',
  'Serving homes, apartments & societies across the city',
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 bg-white py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Image */}
        <Reveal className="relative order-1 lg:order-none">
          <div className="relative overflow-hidden rounded-3xl shadow-card ring-1 ring-black/5">
            <Image
              src="/images/about.webp"
              alt="Happy Indian family welcoming a verified Easy Breezy professional at home"
              width={900}
              height={675}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-4 hidden rounded-2xl bg-brand p-5 text-white shadow-card sm:block">
            <p className="text-3xl font-extrabold text-accent">100%</p>
            <p className="text-sm font-medium">Peace of Mind, Guaranteed</p>
          </div>
        </Reveal>

        {/* Copy */}
        <Reveal delay={100}>
          <span className="inline-block rounded-full bg-brand-tint px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
            About Us
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-brand sm:text-4xl">
            Your trusted partner for a happier home
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink/75">
            Easy Breezy Service Provider is a trusted home-services company on a
            simple mission: to bring verified, reliable professionals for
            cleaning, plumbing, electrical and maid services right to your
            doorstep. We believe managing your home should feel effortless.
          </p>
          <p className="mt-3 text-base leading-relaxed text-ink/75">
            From a quick tap repair to full deep cleaning — and complete facility
            solutions for apartments and societies — every service is delivered
            with quality, care and total peace of mind. One app, all services.
          </p>

          <ul className="mt-6 space-y-3">
            {highlights.map((h) => (
              <li key={h} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent text-brand-dark">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.3 3.3 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="text-sm font-medium text-ink/80">{h}</span>
              </li>
            ))}
          </ul>

          <a
            href="#services"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-dark active:scale-95"
          >
            Explore Our Services
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
