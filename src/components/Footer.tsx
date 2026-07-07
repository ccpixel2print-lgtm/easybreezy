import Link from 'next/link';
import Logo from './Logo';

const quickLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/services' },
  { label: 'Cart', href: '/cart' },
  { label: 'Contact', href: '/#contact' },
];

const policyLinks = [
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Cancellation & Refund', href: '/cancellation-refund' },
  { label: 'Shipping Policy', href: '/shipping' },
];

const socials = [
  {
    label: 'Facebook',
    href: '#',
    icon: <path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z" />,
  },
  {
    label: 'Instagram',
    href: '#',
    icon: <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 01-1.38-.9 3.7 3.7 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.68A6.16 6.16 0 1018.16 12 6.16 6.16 0 0012 5.84zm0 10.16A4 4 0 1116 12a4 4 0 01-4 4zm6.41-10.4a1.44 1.44 0 11-1.44-1.44 1.44 1.44 0 011.44 1.44z" />,
  },
  {
    label: 'Twitter',
    href: '#',
    icon: <path d="M23 4.9c-.8.35-1.66.59-2.56.7a4.48 4.48 0 001.96-2.47 8.94 8.94 0 01-2.83 1.08 4.46 4.46 0 00-7.6 4.07A12.66 12.66 0 013 3.9a4.46 4.46 0 001.38 5.95c-.72-.02-1.4-.22-2-.55v.06a4.46 4.46 0 003.58 4.37c-.66.18-1.36.2-2.02.08a4.47 4.47 0 004.17 3.1A8.96 8.96 0 012 18.57a12.63 12.63 0 006.84 2c8.2 0 12.69-6.8 12.69-12.69 0-.19 0-.39-.01-.58A9.05 9.05 0 0023 4.9z" />,
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05a3.75 3.75 0 013.38-1.86c3.61 0 4.27 2.38 4.27 5.47v6.28zM5.34 7.43a2.07 2.07 0 110-4.14 2.07 2.07 0 010 4.14zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />,
  },
];

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-2">
            <Logo variant="light" size={48} />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              One App, All Services, Total Peace of Mind. Trusted, verified home
              service professionals at your doorstep across India.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-200 hover:bg-accent hover:text-brand-dark"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    {s.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-accent">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/70 transition-colors hover:text-accent"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-accent">
              Policies
            </h3>
            <ul className="mt-4 space-y-3">
              {policyLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/70 transition-colors hover:text-accent"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-accent">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <a href="tel:+919014434640" className="transition-colors hover:text-accent">
                  90144-34640
                </a>
              </li>
              <li>
                <a
                  href="mailto:easybreezy607@gmail.com"
                  className="break-all transition-colors hover:text-accent"
                >
                  easybreezy607@gmail.com
                </a>
              </li>
              <li>
                BJR Nagar, Jawahar Nagar, Ambedkar Nagar, Hyderabad, Secunderabad,
                Telangana 500087
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center">
          <p className="text-sm text-white/60">
            © 2026 EASY BREEZY SERVICE PROVIDER. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
