import type { Metadata } from 'next';
import PolicyLayout from '@/components/PolicyLayout';

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy | Easy Breezy Service Provider',
  description:
    'Cancellation and Refund Policy for Easy Breezy Service Provider. Placeholder content — final policy will be published soon.',
};

export default function CancellationRefundPage() {
  return (
    <PolicyLayout
      title="Cancellation & Refund Policy"
      intro="Our approach to cancellations and refunds. (Placeholder content — final policy coming soon.)"
    >
      <h2 className="text-lg font-bold text-ink">1. Cancellations</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. You may cancel a
        booking before the service professional is dispatched. Placeholder text for
        cancellation windows and any applicable charges.
      </p>

      <h2 className="text-lg font-bold text-ink">2. Refunds</h2>
      <p>
        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eligible
        refunds are processed to the original payment method within a stated number of
        business days.
      </p>

      <h2 className="text-lg font-bold text-ink">3. Inspection / Visit Fees</h2>
      <p>
        Ut enim ad minim veniam, quis nostrud exercitation. For inspection or
        visit-based services, the visit fee covers the professional&apos;s time and is
        generally non-refundable once the visit is completed.
      </p>

      <h2 className="text-lg font-bold text-ink">4. Rescheduling</h2>
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit esse. Placeholder
        text describing how bookings may be rescheduled.
      </p>

      <h2 className="text-lg font-bold text-ink">5. Contact</h2>
      <p>
        For cancellation or refund requests, contact us at{' '}
        <a href="mailto:easybreezy607@gmail.com" className="font-semibold text-brand hover:underline">
          easybreezy607@gmail.com
        </a>{' '}
        or 90144-34640.
      </p>
    </PolicyLayout>
  );
}
