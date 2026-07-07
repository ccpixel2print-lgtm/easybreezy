import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartView from '@/components/CartView';

export const metadata: Metadata = {
  title: 'Your Cart | Easy Breezy Service Provider',
  description:
    'Review the home services you have added, adjust your booking, and proceed to checkout with Easy Breezy Service Provider.',
};

export default function CartPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Page header / banner */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-tint via-white to-white pt-[68px]">
          <div className="pointer-events-none absolute -right-24 -top-10 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-brand shadow-soft ring-1 ring-brand/10">
                <span className="flex h-2 w-2 rounded-full bg-accent" />
                Review &amp; Book
              </span>

              <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-brand sm:text-5xl">
                Your{' '}
                <span className="relative inline-block">
                  <span className="relative z-10">Cart</span>
                  <span className="absolute inset-x-0 bottom-1 z-0 h-3.5 -rotate-1 bg-accent/70 sm:h-4" />
                </span>
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-base text-ink/75 sm:text-lg">
                Review the services you&apos;ve added, adjust your booking, and
                proceed to checkout.
              </p>
            </div>
          </div>
        </section>

        {/* Cart content */}
        <section className="bg-cloud py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <CartView />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
