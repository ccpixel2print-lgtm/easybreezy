import type { Metadata } from 'next';
import PolicyLayout from '@/components/PolicyLayout';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Easy Breezy Service Provider',
  description:
    'Terms and Conditions for booking home and facility maintenance services from Easy Breezy Service Provider.',
};

export default function TermsPage() {
  return (
    <PolicyLayout
      title="Terms & Conditions"
      intro="Please read these terms carefully before booking our services."
      badge="Fair & Transparent"
      badgeIcon="🛡️"
    >
      <h2 className="text-lg font-bold text-ink">1. About Us &amp; Nature of Our Business</h2>
      <p>
        The Platform at https://easybreezy.in/ is owned and operated by Easy Breezy
        Service Provider, with its registered office at Plot No 29-32, BJR Nagar,
        Jawahar Nagar, Ambedkar Nagar, Hyderabad, Secunderabad, Telangana 500087
        (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;, the &quot;Company&quot;).
      </p>
      <p>
        Easy Breezy provides home and facility maintenance services such as electrical,
        plumbing, cleaning and appliance repair. We receive service requests directly
        from customers, deploy our own trained and/or vetted technicians to perform the
        requested work, supervise and monitor the job, and manage all customer support
        and complaints ourselves. <strong>We are the service provider and are directly
        responsible to you for the services you book. We are not a marketplace,
        aggregator, listing service, or intermediary between you and any third-party
        seller, and we do not sell, ship, or supply any physical goods or spare
        parts.</strong>
      </p>

      <h2 className="text-lg font-bold text-ink">2. Use of Services</h2>
      <p>
        By accessing, browsing or booking a service you agree to these Terms. You agree
        to provide true, accurate and complete booking details, including your service
        address and preferred time slot, and you are responsible for all activity under
        your registered account. You agree not to use the Platform for any purpose that
        is unlawful or forbidden by these Terms or by applicable Indian law.
      </p>

      <h2 className="text-lg font-bold text-ink">3. Technician Visits &amp; Parts</h2>
      <p>
        When you book a service, we schedule and deploy a technician to your address for
        the selected time slot. You agree to provide safe and reasonable access to the
        premises. Our technicians provide labour and workmanship only; <strong>any spare
        parts or materials required for the work are to be arranged and provided by
        you</strong>. Our technicians can advise on the parts required, but we do not
        sell or supply parts.
      </p>

      <h2 className="text-lg font-bold text-ink">4. Bookings &amp; Payments</h2>
      <p>
        The scope and price of a service are as displayed at the time of booking. You
        agree to pay the charges shown, including the service charge and any applicable
        platform fee, convenience fee and taxes (such as GST). For inspection or
        visit-based services, only the visit fee is charged at booking; any additional
        work identified during the visit will be carried out only after you approve the
        additional charges. You will be charged only for services actually performed and
        agreed.
      </p>

      <h2 className="text-lg font-bold text-ink">5. Liability &amp; Governing Law</h2>
      <p>
        We provide our Services with reasonable skill and care but exclude liability for
        inaccuracies in the information on this Website to the fullest extent permitted
        by law. Neither party is liable for failure to perform caused by a force majeure
        event. These Terms are governed by the laws of India, and all disputes are
        subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana.
      </p>

      <h2 className="text-lg font-bold text-ink">6. Contact</h2>
      <p>
        For any questions about these Terms, reach us at{' '}
        <a href="mailto:easybreezy607@gmail.com" className="font-semibold text-brand hover:underline">
          easybreezy607@gmail.com
        </a>{' '}
        or call 90144-34640.
      </p>
    </PolicyLayout>
  );
}
