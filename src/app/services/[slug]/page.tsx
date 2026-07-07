import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { services } from '@/data/services';

interface PageProps {
  params: { slug: string };
}

/** Required for static export — pre-render a page per service slug. */
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const service = services.find((s) => s.slug === params.slug);
  if (!service) return { title: 'Service | Easy Breezy Service Provider' };
  return {
    title: `${service.name} | Easy Breezy Service Provider`,
    description: service.description,
  };
}

export default function ServiceDetailPage({ params }: PageProps) {
  const service = services.find((s) => s.slug === params.slug);
  if (!service) notFound();

  const priceLabel = `Starting at ₹${service.startingPrice.toLocaleString('en-IN')}`;

  return (
    <>
      <Navbar />
      <main className="pt-[68px]">
        <section className="bg-gradient-to-b from-brand-tint via-white to-white py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-ink/60" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-brand">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/services" className="hover:text-brand">Services</Link>
              <span className="mx-2">/</span>
              <span className="font-medium text-brand">{service.name}</span>
            </nav>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
              <div className="relative overflow-hidden rounded-3xl shadow-card ring-1 ring-black/5">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  width={900}
                  height={675}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>

              <div>
                <span className="inline-block rounded-full bg-brand-tint px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
                  {service.category}
                </span>
                <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-brand sm:text-4xl">
                  {service.name}
                </h1>
                <p className="mt-3 text-base text-ink/75">{service.description}</p>
                <p className="mt-5 text-lg font-bold text-brand">{priceLabel}</p>

                {/* Placeholder booking note */}
                <div className="mt-6 rounded-2xl bg-accent/15 p-4 text-sm text-ink/80 ring-1 ring-accent/40">
                  <p className="font-semibold text-brand-dark">
                    Online booking coming soon.
                  </p>
                  <p className="mt-1">
                    This is a placeholder service page. Booking, pricing plans and
                    scheduling will be available here shortly.
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-dark active:scale-95"
                  >
                    Book Now
                  </button>
                  <Link
                    href="/services"
                    className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand px-6 py-3 text-sm font-semibold text-brand transition-all duration-200 hover:bg-brand hover:text-white active:scale-95"
                  >
                    Back to Services
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
