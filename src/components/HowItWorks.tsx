import Reveal from './Reveal';

const steps = [
  {
    num: 1,
    title: 'Choose a service',
    desc: 'Browse our range of home services and pick what you need.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    ),
  },
  {
    num: 2,
    title: 'Enter pincode & book',
    desc: 'Check availability in your area and book online in seconds.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    ),
  },
  {
    num: 3,
    title: 'Professional arrives',
    desc: 'A verified, background-checked expert reaches your doorstep.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0" />
    ),
  },
  {
    num: 4,
    title: 'Job done — rate it',
    desc: 'Enjoy quality work and share your experience with a rating.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.5a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.5.04.703.663.322.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.322-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-cloud py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-block rounded-full bg-accent/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-dark">
            Simple &amp; Fast
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-brand sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 text-base text-ink/70">
            Getting help at home has never been this easy — just four simple steps.
          </p>
        </Reveal>

        <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* connecting line (desktop) */}
          <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-0.5 bg-gradient-to-r from-transparent via-brand/25 to-transparent lg:block" />

          {steps.map((step, i) => (
            <Reveal key={step.num} delay={i * 110} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-brand text-white shadow-card ring-4 ring-cloud">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                  {step.icon}
                </svg>
                <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-extrabold text-brand-dark ring-2 ring-cloud">
                  {step.num}
                </span>
              </div>
              <h3 className="mt-5 text-base font-bold text-ink">{step.title}</h3>
              <p className="mt-1.5 max-w-[15rem] text-sm text-ink/60">{step.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
