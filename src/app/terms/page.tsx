import type { Metadata } from 'next';
import PolicyLayout from '@/components/PolicyLayout';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Easy Breezy Service Provider',
  description:
    'Terms and Conditions for using Easy Breezy Service Provider. Placeholder content — final terms will be published soon.',
};

export default function TermsPage() {
  return (
    <PolicyLayout
      title="Terms & Conditions"
      intro="Please read these terms carefully before using our services. (Placeholder content — final terms coming soon.)"
    >
      <h2 className="text-lg font-bold text-ink">1. Introduction</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. These Terms &amp;
        Conditions govern your use of the Easy Breezy Service Provider platform and
        the services offered through it. By accessing or booking a service, you agree
        to be bound by these terms.
      </p>

      <h2 className="text-lg font-bold text-ink">2. Use of Services</h2>
      <p>
        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. You agree to provide accurate booking details, including
        address and preferred time.
      </p>

      <h2 className="text-lg font-bold text-ink">3. Bookings &amp; Payments</h2>
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.
        For inspection or visit-based services, only the visit fee is charged at the
        time of booking; final charges are shared after the professional&apos;s
        assessment.
      </p>

      <h2 className="text-lg font-bold text-ink">4. Liability</h2>
      <p>
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
        deserunt mollit anim id est laborum. Placeholder text for liability and
        limitation clauses.
      </p>

      <h2 className="text-lg font-bold text-ink">5. Contact</h2>
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
