import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartBadge from '@/components/CartBadge';
import SubServiceCard from '@/components/SubServiceCard';
import AddToCartButton from '@/components/AddToCartButton';
import { fetchServiceBySlug, fetchServiceSlugs } from '@/lib/api';

interface PageProps {
  params: { slug: string };
}

/** Required for static export — pre-render a page per service slug. */
export async function generateStaticParams() {
  const slugs = await fetchServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const service = await fetchServiceBySlug(params.slug);
  if (!service) return { title: 'Service | Easy Breezy Service Provider' };
  return {
    title: `${service.name} | Easy Breezy Service Provider`,
    description: service.longDescription ?? service.description,
  };
}


const WHATSAPP_URL =
  'https://wa.me/919014434640?text=Hi Easy Breezy%2C I would like to know more about your services.';

const trustPoints = [
  {
    title: 'Verified Professionals',
    desc: 'Background-checked & trained experts.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    ),
  },
  {
    title: 'Safe & Hygienic',
    desc: 'Sanitised tools & safe products, every visit.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7.5 3v6c0 4.5-3 8.25-7.5 9-4.5-.75-7.5-4.5-7.5-9V6L12 3z" />
    ),
  },
  {
    title: 'On-Time Delivery',
    desc: 'Punctual pros who value your time.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
  {
    title: 'Upfront Pricing',
    desc: 'Transparent rates with no hidden charges.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3M3.75 5.25h16.5a1.5 1.5 0 011.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6.75a1.5 1.5 0 011.5-1.5z" />
    ),
  },
];

export default async function ServiceDetailPage({ params }: PageProps) {
  const service = await fetchServiceBySlug(params.slug);
  if (!service) notFound();


  return (
    <>
      <Navbar />
      <main className="pt-[68px]">
        {/* ===== Service banner ===== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-tint via-white to-white">
          <div className="pointer-events-none absolute -right-24 -top-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-ink/60" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-brand">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/services" className="hover:text-brand">Services</Link>
              <span className="mx-2">/</span>
              <span className="font-medium text-brand">{service.name}</span>
            </nav>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
              <div className="relative order-1 overflow-hidden rounded-3xl shadow-card ring-1 ring-black/5 lg:order-none">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  width={900}
                  height={675}
                  className="h-full w-full object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand/20 to-transparent" />
              </div>

              <div>
                <span className="inline-block rounded-full bg-brand-tint px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
                  {service.category}
                </span>
                <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-brand sm:text-4xl lg:text-[2.75rem]">
                  {service.name}
                </h1>

                {/* Ratings + bookings */}
                {(service.rating || service.bookings) && (
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                    {service.rating && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 font-semibold text-ink shadow-soft ring-1 ring-black/5">
                        <span className="text-accent-dark">★</span>
                        {service.rating.toFixed(1)}
                      </span>
                    )}
                    {service.bookings && (
                      <span className="text-ink/60">
                        <strong className="text-ink">{service.bookings}</strong> bookings
                      </span>
                    )}
                  </div>
                )}

                <p className="mt-4 text-base leading-relaxed text-ink/75">
                  {service.longDescription ?? service.description}
                </p>

                {/* Trust badges */}
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {['Verified Professionals', 'Safe & Hygienic'].map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand shadow-soft ring-1 ring-brand/10"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" />
                      </svg>
                      {b}
                    </span>
                  ))}
                </div>

                {/* Direct booking (only when there are NO sub-services) */}
                {!service.hasSubServices && (
                  <div className="mt-7 rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                      Directly bookable
                    </p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="text-2xl font-extrabold text-brand">
                          ₹{(service.directPrice ?? service.startingPrice).toLocaleString('en-IN')}
                        </span>
                        {service.directDuration && (
                          <span className="ml-3 text-sm text-ink/60">
                            {service.directDuration}
                          </span>
                        )}
                      </div>
                      <div className="w-full sm:w-44">
                        <AddToCartButton />
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-ink/55">
                      This service has a single flat price — no packages to choose.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ===== Main content: sub-services + sidebar ===== */}
        <section className="bg-white py-12 sm:py-16">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            {/* Sub-services list */}
            <div className="lg:col-span-2">
              {service.hasSubServices && service.subServices ? (
                <>
                  <h2 className="text-2xl font-extrabold tracking-tight text-brand sm:text-3xl">
                    Choose a Package
                  </h2>
                  <p className="mt-2 text-sm text-ink/70">
                    Select the option that fits your needs and add it to your cart.
                  </p>
                  <div className="mt-6 grid grid-cols-1 gap-5">
                    {service.subServices.map((sub, i) => (
                      <SubServiceCard key={sub.id} subService={sub} index={i} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-brand/20 bg-brand-tint/40 p-8 text-center">
                  <h2 className="text-2xl font-extrabold tracking-tight text-brand">
                    No packages needed
                  </h2>
                  <p className="mx-auto mt-2 max-w-md text-sm text-ink/70">
                    <strong>{service.name}</strong> is a directly-bookable service with a
                    single flat price. Just add it to your cart using the button above —
                    no sub-services to select.
                  </p>
                  <p className="mx-auto mt-3 max-w-md text-xs text-ink/50">
                    (Our flexible model supports both grouped services with multiple
                    packages and simple directly-bookable services.)
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Why choose Easy Breezy */}
                <div className="rounded-2xl bg-cloud p-6 ring-1 ring-black/5">
                  <h2 className="text-lg font-bold text-brand">
                    Why choose Easy Breezy
                  </h2>
                  <ul className="mt-4 space-y-4">
                    {trustPoints.map((t) => (
                      <li key={t.title} className="flex items-start gap-3">
                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                            {t.icon}
                          </svg>
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-ink">{t.title}</p>
                          <p className="text-xs text-ink/60">{t.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* WhatsApp help prompt */}
                <div className="rounded-2xl bg-brand p-6 text-white shadow-card">
                  <h2 className="text-lg font-bold">Need help?</h2>
                  <p className="mt-1 text-sm text-white/75">
                    Not sure which package to pick? Our team is happy to help you choose.
                  </p>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.02] active:scale-95"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                      <path d="M16.004 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.257.592 4.464 1.716 6.41L3.2 28.8l6.57-1.72a12.74 12.74 0 006.234 1.588h.005c7.06 0 12.8-5.74 12.8-12.8S23.064 3.2 16.004 3.2zm0 23.06h-.004a10.6 10.6 0 01-5.4-1.48l-.388-.23-4.02 1.052 1.073-3.918-.253-.402a10.56 10.56 0 01-1.62-5.632c0-5.87 4.777-10.646 10.652-10.646 2.844 0 5.518 1.108 7.53 3.12a10.58 10.58 0 013.118 7.532c0 5.872-4.777 10.648-10.652 10.648zm5.84-7.976c-.32-.16-1.894-.934-2.188-1.04-.293-.107-.507-.16-.72.16-.213.32-.826 1.04-1.013 1.253-.187.213-.373.24-.693.08-.32-.16-1.352-.498-2.576-1.588-.952-.85-1.594-1.9-1.78-2.22-.187-.32-.02-.492.14-.652.144-.143.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.736-.987-2.376-.26-.624-.524-.54-.72-.55l-.613-.01c-.213 0-.56.08-.853.4-.293.32-1.12 1.094-1.12 2.67 0 1.574 1.147 3.096 1.307 3.31.16.213 2.256 3.446 5.466 4.832.764.33 1.36.527 1.824.674.767.244 1.464.21 2.016.127.615-.092 1.894-.774 2.16-1.522.267-.747.267-1.387.187-1.522-.08-.133-.293-.213-.613-.373z" />
                    </svg>
                    Chat on WhatsApp
                  </a>
                </div>

                {/* Back link */}
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  Back to all services
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
      <CartBadge />
    </>
  );
}
