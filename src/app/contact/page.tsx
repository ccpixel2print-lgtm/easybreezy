import type { Metadata } from 'next';
import PolicyLayout from '@/components/PolicyLayout';

export const metadata: Metadata = {
  title: 'Contact Us | Easy Breezy Service Provider',
  description:
    'Contact Easy Breezy Service Provider by phone, email or at our registered office in Secunderabad, Telangana.',
};

export default function ContactPage() {
  return (
    <PolicyLayout
      title="Contact Us"
      intro="We're here to help with bookings, support and any questions."
      badge="We're Here to Help" 
      badgeIcon="💬"
    >
      <h2 className="text-lg font-bold text-ink">Registered Office</h2>
      <p>
        Easy Breezy Service Provider<br />
        Plot No 29-32, BJR Nagar, Jawahar Nagar,<br />
        Ambedkar Nagar, Hyderabad,<br />
        Secunderabad, Telangana 500087
      </p>

      <h2 className="text-lg font-bold text-ink">Phone</h2>
      <p>
        <a href="tel:+919014434640" className="font-semibold text-brand hover:underline">
          90144-34640
        </a>{' '}
        (Monday to Friday, 9:00–18:00)
      </p>

      <h2 className="text-lg font-bold text-ink">Email</h2>
      <p>
        <a href="mailto:easybreezy607@gmail.com" className="font-semibold text-brand hover:underline">
          easybreezy607@gmail.com
        </a>
      </p>

      <h2 className="text-lg font-bold text-ink">Customer Support</h2>
      <p>
        For help with a booking, cancellation or a service concern, call or email us
        using the details above and our support team will assist you.
      </p>
    </PolicyLayout>
  );
}
