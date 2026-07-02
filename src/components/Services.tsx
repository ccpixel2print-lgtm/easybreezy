import Image from 'next/image';
import Reveal from './Reveal';

const services = [
  {
    name: 'Plumber',
    image: '/images/plumber.webp',
    desc: 'Expert plumbers for leaks, fittings & blockages.',
    alt: 'Uniformed Indian plumber fixing a tap in a modern home',
  },
  {
    name: 'Electrician',
    image: '/images/electrician.webp',
    desc: 'Certified electricians for wiring, switches & repairs.',
    alt: 'Indian electrician working on a switchboard',
  },
  {
    name: 'Maid',
    image: '/images/maid.webp',
    desc: 'Reliable maids for daily cleaning & household help.',
    alt: 'Indian maid cleaning a modern living room',
  },
  {
    name: 'Deep Cleaning',
    image: '/images/deep-cleaning.webp',
    desc: 'Thorough deep cleaning for a spotless, fresh home.',
    alt: 'Professional team performing deep cleaning in a home',
  },
];

export default function Services() {
  return (
    <section id="services" className="scroll-mt-24 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-brand-tint px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
            Book Online
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-brand sm:text-4xl">
            Our Services
          </h2>
          <p className="mt-3 text-base text-ink/70">
            Pick a service, book in seconds, and relax — a verified professional
            will be at your doorstep in no time.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal
              key={s.name}
              delay={i * 90}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-brand shadow-sm backdrop-blur">
                  Bookable
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold text-ink">{s.name}</h3>
                <p className="mt-1 flex-1 text-sm text-ink/65">{s.desc}</p>
                <button
                  type="button"
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-dark active:scale-95"
                >
                  Book Now
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
