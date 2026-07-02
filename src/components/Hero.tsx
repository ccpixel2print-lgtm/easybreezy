'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Hero() {
  const [pincode, setPincode] = useState('');
  const [checked, setChecked] = useState(false);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length >= 5) {
      setChecked(true);
    }
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-brand-tint via-white to-white pt-[68px]"
    >
      {/* Decorative accents */}
      <div className="pointer-events-none absolute -right-24 -top-16 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 top-1/3 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:py-24 lg:px-8">
        {/* Left: copy */}
        <div className="animate-fade-up text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-brand shadow-soft ring-1 ring-brand/10">
            <span className="flex h-2 w-2 rounded-full bg-accent" />
            India&apos;s trusted home-services marketplace
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-brand sm:text-5xl lg:text-[3.4rem]">
            One App,{' '}
            <span className="relative inline-block">
              <span className="relative z-10">All Services</span>
              <span className="absolute inset-x-0 bottom-1 z-0 h-3.5 -rotate-1 bg-accent/70 sm:h-4" />
            </span>
            ,<br className="hidden sm:block" /> Total{' '}
            <span className="relative inline-block">
              <span className="relative z-10">Peace of Mind</span>
              <span className="absolute inset-x-0 bottom-1 z-0 h-3.5 -rotate-1 bg-accent/70 sm:h-4" />
            </span>
            .
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base text-ink/75 sm:text-lg lg:mx-0">
            Trusted, verified home service professionals at your doorstep — from
            plumbing and electrical to cleaning and maid services.
          </p>

          {/* Pincode widget */}
          <form
            onSubmit={handleCheck}
            className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 rounded-2xl bg-white p-3 shadow-card ring-1 ring-black/5 sm:flex-row sm:items-center lg:mx-0"
          >
            <div className="flex flex-1 items-center gap-2 rounded-xl bg-cloud px-3">
              <svg
                className="h-5 w-5 flex-shrink-0 text-brand"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              <input
                type="text"
                inputMode="numeric"
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setChecked(false);
                }}
                placeholder="Enter your pincode to check availability"
                aria-label="Enter your pincode"
                className="w-full bg-transparent py-3 text-sm text-ink placeholder:text-ink/45 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-accent px-5 py-3 text-sm font-bold text-brand-dark shadow-sm transition-all duration-200 hover:bg-accent-dark hover:shadow-md active:scale-95"
            >
              Check Availability
            </button>
          </form>

          {checked && (
            <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-green-600">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.3 3.3 6.8-6.8a1 1 0 011.4 0z"
                  clipRule="evenodd"
                />
              </svg>
              Great news! We serve your area. Book a service below.
            </p>
          )}

          {/* Mini trust stats */}
          <dl className="mt-8 flex items-center justify-center gap-8 lg:justify-start">
            {[
              { v: '50k+', l: 'Happy Homes' },
              { v: '1,200+', l: 'Verified Pros' },
              { v: '4.8★', l: 'Avg. Rating' },
            ].map((s) => (
              <div key={s.l} className="text-center lg:text-left">
                <dt className="text-2xl font-extrabold text-brand">{s.v}</dt>
                <dd className="text-xs font-medium text-ink/60">{s.l}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right: hero image */}
        <div className="relative animate-fade-up" style={{ animationDelay: '150ms' }}>
          <div className="relative overflow-hidden rounded-3xl shadow-card ring-1 ring-black/5">
            <Image
              src="/images/hero.webp"
              alt="Friendly verified Easy Breezy home-service professional arriving at a modern Indian home"
              width={1600}
              height={900}
              priority
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand/20 to-transparent" />
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-card ring-1 ring-black/5 sm:left-6 animate-float-slow">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/20 text-brand">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-bold text-ink">Verified &amp; Background-Checked</p>
              <p className="text-xs text-ink/60">Every professional, every time</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
