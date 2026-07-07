import type { Metadata } from 'next';
import PolicyLayout from '@/components/PolicyLayout';

export const metadata: Metadata = {
  title: 'Shipping Policy | Easy Breezy Service Provider',
  description:
    'Shipping / Service Delivery Policy for Easy Breezy Service Provider. Placeholder content — final policy will be published soon.',
};

export default function ShippingPage() {
  return (
    <PolicyLayout
      title="Shipping Policy"
      intro="How our services are delivered to your doorstep. (Placeholder content — final policy coming soon.)"
    >
      <h2 className="text-lg font-bold text-ink">1. Service Delivery</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Easy Breezy is a
        home-services platform. Rather than shipping physical goods, we dispatch
        verified professionals to your address at the scheduled date and time.
      </p>

      <h2 className="text-lg font-bold text-ink">2. Service Areas</h2>
      <p>
        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Services
        are available within serviceable pincodes. Availability may vary by location
        and service type.
      </p>

      <h2 className="text-lg font-bold text-ink">3. Scheduling</h2>
      <p>
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. You choose
        a preferred date and time window during booking, and we confirm the
        professional&apos;s arrival accordingly.
      </p>

      <h2 className="text-lg font-bold text-ink">4. Physical Products</h2>
      <p>
        Duis aute irure dolor in reprehenderit. If any physical products (such as
        spare parts) are supplied, applicable delivery details will be shared at the
        time of the service.
      </p>

      <h2 className="text-lg font-bold text-ink">5. Contact</h2>
      <p>
        For delivery or scheduling questions, reach us at{' '}
        <a href="mailto:easybreezy607@gmail.com" className="font-semibold text-brand hover:underline">
          easybreezy607@gmail.com
        </a>
        .
      </p>
    </PolicyLayout>
  );
}
