import type { Metadata } from 'next';
import PolicyLayout from '@/components/PolicyLayout';

export const metadata: Metadata = {
  title: 'Cancellation, Rescheduling & Refund Policy | Easy Breezy Service Provider',
  description:
    'How to cancel or reschedule a service booking with Easy Breezy Service Provider, how service-related concerns are handled, and our refund policy.',
};

export default function CancellationRefundPage() {
  return (
    <PolicyLayout
      title="Cancellation, Rescheduling & Refund Policy"
      intro="How you can cancel or reschedule a booking, how we handle service concerns, and when refunds apply."
      badge="Simple & Fair"
      badgeIcon="⏱️"
    >
      <h2 className="text-lg font-bold text-ink">1. Cancellations &amp; Rescheduling</h2>
      <p>
        You may cancel or reschedule a booking free of charge until the point at which a
        technician has been assigned and dispatched to your location.
      </p>
      <p>
        Cancellation or rescheduling requests can be made through your account on the
        Platform or by contacting our customer support team.
      </p>

      <h2 className="text-lg font-bold text-ink">2. After a Technician Is Assigned</h2>
      <p>
        Once a technician has been assigned or has arrived at your location, cancellation
        may attract a visit or cancellation charge to cover the technician&apos;s time and
        travel.
      </p>
      <p>Any applicable charge will be displayed at the time of booking.</p>

      <h2 className="text-lg font-bold text-ink">3. When We Cannot Provide a Service</h2>
      <p>
        If we are unable to provide a booked service due to location limitations, or other
        operational reasons, we will inform the customer and may offer rescheduling where
        applicable.
      </p>
      <p>
        Any cancellation or service resolution will be handled according to the applicable
        booking terms.
      </p>

      <h2 className="text-lg font-bold text-ink">4. Service Concerns</h2>
      <p>
        If you are not satisfied with a completed service, please contact our customer
        support team within 3 days from the date of service completion.
      </p>
      <p>
        Where appropriate, we may arrange a revisit or take other reasonable action to
        address a legitimate service-related concern. This covers the quality of our
        service and does not cover any parts or appliances, which are provided by you and
        remain subject to their manufacturer&apos;s terms.
      </p>

      <h2 className="text-lg font-bold text-ink">5. Refund Policy</h2>
      <p>Refunds are provided only in these verified cases:</p>
      <ul className="list-disc space-y-1 pl-6">
        <li>Duplicate transactions.</li>
        <li>Unable to provide a booked service due to location limitations.</li>
        <li>Before a technician is assigned.</li>
      </ul>
      <p>
        A duplicate transaction means that the customer has been charged more than once for
        the same booking or service due to a payment or technical issue.
      </p>
      <p>
        To request a refund for a duplicate transaction, the customer must provide relevant
        transaction details or payment confirmation for verification.
      </p>
      <p>
        Once the refund is approved, the additional payment will be refunded and credited to
        the original payment method within 5–7 business days.
      </p>
      <p>
        The actual time taken for the amount to reflect in the customer&apos;s account may
        vary depending on the bank, payment gateway, card issuer, UPI provider, or other
        financial institution.
      </p>

      <h2 className="text-lg font-bold text-ink">6. No Refund for Other Reasons</h2>
      <p>
        Except for verified duplicate transactions, payments are generally non-refundable,
        including payments relating to:
      </p>
      <ul className="list-disc space-y-1 pl-6">
        <li>Change of mind.</li>
        <li>Cancellation after the applicable cancellation period.</li>
        <li>Completed services.</li>
        <li>Technician visit or inspection charges.</li>
        <li>Customer unavailability.</li>
        <li>
          Dissatisfaction with the service where no duplicate transaction has occurred.
        </li>
      </ul>

      <h2 className="text-lg font-bold text-ink">7. Contact Us</h2>
      <p>
        For cancellation, rescheduling, duplicate transaction verification, or
        service-related concerns, please contact:
      </p>
      <p>
        Email:{' '}
        <a
          href="mailto:easybreezy607@gmail.com"
          className="font-semibold text-brand hover:underline"
        >
          easybreezy607@gmail.com
        </a>
        <br />
        Phone: 90144-34640
      </p>
    </PolicyLayout>
  );
}
