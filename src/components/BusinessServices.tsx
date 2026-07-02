import Image from 'next/image';
import Reveal from './Reveal';

const services = [
  {
    name: 'Apartment Maintenance',
    image: '/images/maintenance.webp',
    desc: 'End-to-end upkeep for societies — plumbing, electrical & facility care.',
    alt: 'Maintenance crew working in a modern apartment complex',
  },
  {
    name: 'Housekeeping',
    image: '/images/housekeeping.webp',
    desc: 'Trained housekeeping staff to keep common areas spotless and welcoming.',
    alt: 'Housekeeping staff cleaning a residential building lobby',
  },
  {
    name: 'Security',
    image: '/images/security.webp',
    desc: 'Verified, trained guards for safe and secure residential premises.',
    alt: 'Security guard on duty at an apartment gate',
  },
];

export default function BusinessServices() {
  return (
    <section className="relative overflow-hidden bg-brand-tint py-16 sm:py-24">
      <div className="pointer-events-none absolute -right-32 top-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-brand px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
            Enquiry Only
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-brand sm:text-4xl">
            For Businesses &amp; Societies
          </h2>
          <p className="mt-3 text-base text-ink/70">
            Tailored facility solutions for apartments, gated communities and
            commercial spaces. Reach out and our team will craft the right plan.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {services.map((s, i) => (
            <Reveal
              key={s.name}
              delay={i * 100}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-brand/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand/40 to-transparent" />
                <h3 className="absolute bottom-4 left-5 text-xl font-bold text-white drop-shadow">
                  {s.name}
                </h3>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="flex-1 text-sm text-ink/65">{s.desc}</p>
                <a
                  href="#contact"
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-brand px-4 py-2.5 text-sm font-semibold text-brand transition-all duration-200 hover:bg-brand hover:text-white active:scale-95"
                >
                  Contact Us
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
