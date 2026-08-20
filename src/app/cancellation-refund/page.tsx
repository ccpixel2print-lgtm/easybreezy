import type { Metadata } from 'next';
import PolicyLayout from '@/components/PolicyLayout';

export const metadata: Metadata = {
  title: 'Cancellation Policy | Easy Breezy Service Provider',
  description:
    'How to cancel or reschedule a service booking with Easy Breezy Service Provider, and how service-related concerns are handled.',
};

export default function CancellationRefundPage() {
  return (
    <PolicyLayout
      title="Cancellation Policy"
      intro="How you can cancel or reschedule a booking, and how we handle service concerns."
      badge="Simple & Fair" 
      badgeIcon="⏱️"
    >
      <h2 className="text-lg font-bold text-ink">1. Cancellations &amp; Rescheduling</h2>
      <p>
        You may cancel or reschedule a booking free of charge up until the point a
        technician has been assigned and dispatched to your location. Requests can be
        made from your account on the Platform or by contacting our customer support
        team.
      </p>

      <h2 className="text-lg font-bold text-ink">2. After a Technician Is Dispatched</h2>
      <p>
        Once a technician has been dispatched or has arrived at your location, a
        cancellation may attract a visit/cancellation charge to cover the
        technician&apos;s time and travel. Any such charge is as displayed at the time
        of booking. For inspection or visit-based services, the visit fee covers the
        technician&apos;s time and is generally non-refundable once the visit is
        completed.
      </p>

      <h2 className="text-lg font-bold text-ink">3. When We Cannot Provide a Service</h2>
      <p>
        If we are unable to provide a booked service (for example, due to technician
        unavailability or your location being outside our coverage area), we will inform
        you and, where you have already paid, the amount collected for the undelivered
        service will be returned to your original payment method or credited to your
        Easy Breezy wallet, as applicable.
      </p>

      <h2 className="text-lg font-bold text-ink">4. Service Concerns</h2>
      <p>
        If you are not satisfied with a completed service, please contact us within 3
        days. Where appropriate, we will arrange for a technician to re-visit and
        rectify a legitimate service defect at no additional service charge. Where a
        re-visit is not appropriate, we may, at our discretion and after review, adjust
        or reverse the charge for the affected service. Any approved refund is processed
        to your original payment method within 5–7 business days, or credited to your
        wallet where you prefer. This covers the quality of our service and does not
        cover any parts or appliances, which are provided by you and remain subject to
        their manufacturer&apos;s terms.
      </p>

      <h2 className="text-lg font-bold text-ink">5. Contact</h2>
      <p>
        For cancellation requests or service concerns, contact us at{' '}
        <a href="mailto:easybreezy607@gmail.com" className="font-semibold text-brand hover:underline">
          easybreezy607@gmail.com
        </a>{' '}
        or 90144-34640.
      </p>
    </PolicyLayout>
  );
}
