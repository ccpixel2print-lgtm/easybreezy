import type { Metadata } from 'next';
import PolicyLayout from '@/components/PolicyLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | Easy Breezy Service Provider',
  description:
    'Privacy Policy for Easy Breezy Service Provider. Placeholder content — final policy will be published soon.',
};

export default function PrivacyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      intro="How we collect, use, and protect your information. (Placeholder content — final policy coming soon.)"
    >
      <h2 className="text-lg font-bold text-ink">1. Information We Collect</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. We may collect your
        name, contact number, address, pincode, and booking preferences to fulfil the
        services you request.
      </p>

      <h2 className="text-lg font-bold text-ink">2. How We Use Your Information</h2>
      <p>
        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Your
        information is used to schedule services, connect you with verified
        professionals, and improve your experience.
      </p>

      <h2 className="text-lg font-bold text-ink">3. Data Sharing</h2>
      <p>
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. We share
        only the details necessary to complete your booking with the assigned service
        professional.
      </p>

      <h2 className="text-lg font-bold text-ink">4. Data Security</h2>
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
        eu fugiat. Placeholder text describing the safeguards used to protect your
        data.
      </p>

      <h2 className="text-lg font-bold text-ink">5. Contact</h2>
      <p>
        For privacy-related queries, email{' '}
        <a href="mailto:easybreezy607@gmail.com" className="font-semibold text-brand hover:underline">
          easybreezy607@gmail.com
        </a>
        .
      </p>
    </PolicyLayout>
  );
}
