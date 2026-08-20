import type { Metadata } from 'next';
import PolicyLayout from '@/components/PolicyLayout';

export const metadata: Metadata = {
  title: 'About Us | Easy Breezy Service Provider',
  description:
    'Easy Breezy Service Provider delivers home and facility maintenance services with our own trained technicians.',
};

export default function AboutPage() {
  return (
    <PolicyLayout
      title="About Us"
      intro="Trusted home and facility maintenance, delivered by our technicians."
      badge="Our Story"
      badgeIcon="✨"
    >
      <h2 className="text-lg font-bold text-ink">Who We Are</h2>
      <p>
        Easy Breezy Service Provider is a home and facility maintenance services company
        based in Secunderabad, Telangana. We offer services such as electrical, plumbing,
        cleaning and appliance repair to customers across our serviceable areas.
      </p>

      <h2 className="text-lg font-bold text-ink">How We Work</h2>
      <p>
        We take service requests directly from our customers through this Platform.
        For each booking, we assign and dispatch our own trained and vetted technicians,
        supervise the job through to completion, and handle all customer support and
        complaints ourselves. We are the service provider and are directly responsible
        for the work we do — we are not a marketplace or intermediary, and we do not sell
        or ship any goods.
      </p>

      <h2 className="text-lg font-bold text-ink">Get in Touch</h2>
      <p>
        Easy Breezy Service Provider, Plot No 29-32, BJR Nagar, Jawahar Nagar, Ambedkar
        Nagar, Hyderabad, Secunderabad, Telangana 500087. Call{' '}
        <a href="tel:+919014434640" className="font-semibold text-brand hover:underline">
          90144-34640
        </a>{' '}
        or email{' '}
        <a href="mailto:easybreezy607@gmail.com" className="font-semibold text-brand hover:underline">
          easybreezy607@gmail.com
        </a>
        .
      </p>
    </PolicyLayout>
  );
}
