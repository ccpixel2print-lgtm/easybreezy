import type { Metadata } from 'next';
import PolicyLayout from '@/components/PolicyLayout';

export const metadata: Metadata = {
  title: 'Service Delivery Policy | Easy Breezy Service Provider',
  description:
    'How Easy Breezy Service Provider delivers its on-site home and facility maintenance services.',
};

export default function ShippingPage() {
  return (
    <PolicyLayout
      title="Service Delivery Policy"
      intro="How our services are delivered to you."
      badge="How We Deliver" 
      badgeIcon="🧰"
    >
      <h2 className="text-lg font-bold text-ink">1. We Deliver Services, Not Goods</h2>
      <p>
        Easy Breezy provides on-site home and facility maintenance services.{' '}
        <strong>We do not sell, ship, or deliver any physical goods or spare
        parts.</strong> &quot;Delivery&quot; of our services means the attendance of our
        technician at the address you provide, within the confirmed date and time slot,
        to perform the requested work.
      </p>

      <h2 className="text-lg font-bold text-ink">2. Parts &amp; Materials</h2>
      <p>
        Our technicians provide labour and workmanship only. Any spare parts or
        materials required to complete the work are to be arranged and provided by you.
        Our technicians can advise on what is required, but we do not supply or ship
        parts.
      </p>

      <h2 className="text-lg font-bold text-ink">3. Service Areas</h2>
      <p>
        Services are available only within the locations and pin codes we currently
        cover, as indicated on the Platform. If your location is outside our coverage
        area, we will let you know at the time of booking.
      </p>

      <h2 className="text-lg font-bold text-ink">4. Scheduling &amp; Confirmation</h2>
      <p>
        You choose a preferred date and time window during booking, and we confirm the
        technician&apos;s visit via SMS, email and/or the Platform using the details you
        provided at registration. If a technician is delayed or a visit needs to be
        rescheduled, we will make reasonable efforts to inform you in advance and arrange
        an alternative slot.
      </p>

      <h2 className="text-lg font-bold text-ink">5. Contact</h2>
      <p>
        For scheduling questions, reach us at{' '}
        <a href="mailto:easybreezy607@gmail.com" className="font-semibold text-brand hover:underline">
          easybreezy607@gmail.com
        </a>
        .
      </p>
    </PolicyLayout>
  );
}
