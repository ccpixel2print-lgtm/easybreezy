import type { Metadata } from 'next';
import PolicyLayout from '@/components/PolicyLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | Easy Breezy Service Provider',
  description:
    'How Easy Breezy Service Provider collects, uses, shares and protects your personal data.',
};

export default function PrivacyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      intro="How we collect, use and protect your personal data."
      badge="Your Data, Protected" 
      badgeIcon="🔒"
    >
      <h2 className="text-lg font-bold text-ink">1. Introduction</h2>
      <p>
        This Privacy Policy describes how Easy Breezy Service Provider
        (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) collects, uses, shares and
        protects your personal data through https://easybreezy.in/ (the
        &quot;Platform&quot;). We operate only in India, and your data is primarily
        stored and processed in India. By using the Platform or booking a service, you
        agree to this Policy. If you do not agree, please do not use the Platform.
      </p>

      <h2 className="text-lg font-bold text-ink">2. Information We Collect</h2>
      <p>
        We collect information you provide when you register or book a service, such as
        your name, service address, mobile number and email ID. To process payments, our
        payment gateway partner may collect payment instrument information with your
        consent. You may choose not to provide certain information, though this may limit
        your ability to use some services.
      </p>

      <h2 className="text-lg font-bold text-ink">3. How We Use Your Information</h2>
      <p>
        We use your data to schedule bookings, deploy and coordinate our technicians,
        supervise the job, process payments, provide customer support, resolve disputes,
        prevent fraud, and — where you have not opted out — to inform you about offers
        and updates.
      </p>

      <h2 className="text-lg font-bold text-ink">4. How We Share Your Information</h2>
      <p>
        We share your data with our own technicians and field staff (only as needed to
        perform your booking), our payment gateway and payment partners (to process
        payments), and service providers who support our operations. We may disclose data
        to government or law-enforcement agencies where required by law. We do not sell
        your personal data.
      </p>

      <h2 className="text-lg font-bold text-ink">5. Security, Retention &amp; Your Rights</h2>
      <p>
        We adopt reasonable security practices to protect your data, though no internet
        transmission is completely secure. We retain your data only as long as necessary
        for the purposes it was collected or as required by law. You can access, correct
        and update your data through the Platform, and you may delete your account from
        your profile settings (subject to any pending bookings or grievances).
      </p>

      <h2 className="text-lg font-bold text-ink">6. Consent &amp; Contact</h2>
      <p>
        By using the Platform, you consent to being contacted via SMS, messaging apps,
        call and/or email for the purposes described here. You may withdraw consent by
        writing to our Grievance Officer. For any privacy concern, contact our Grievance
        Officer at{' '}
        <a href="mailto:easybreezy607@gmail.com" className="font-semibold text-brand hover:underline">
          easybreezy607@gmail.com
        </a>{' '}
        or 90144-34640, Monday to Friday (9:00–18:00), Easy Breezy Service Provider,
        Plot No 29-32, BJR Nagar, Jawahar Nagar, Ambedkar Nagar, Hyderabad,
        Secunderabad, Telangana 500087.
      </p>
    </PolicyLayout>
  );
}
