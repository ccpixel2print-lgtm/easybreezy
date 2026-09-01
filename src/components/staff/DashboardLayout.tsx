'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';
import { useStaffAuth } from '@/context/StaffAuthContext';
import type { AuthUser } from '@/lib/api';

type Role = AuthUser['role'];

interface NavItem {
  label: string;
  href: string;
  roles: Role[];
}

const NAV: NavItem[] = [
  { label: 'Overview', href: '/admin', roles: ['ADMIN', 'SUPERVISOR'] },
  { label: 'Orders', href: '/admin/orders', roles: ['ADMIN', 'SUPERVISOR'] },
  { label: 'Bookings', href: '/admin/bookings', roles: ['ADMIN', 'SUPERVISOR'] },
  { label: 'Customers', href: '/admin/customers', roles: ['ADMIN', 'SUPERVISOR'] },
  { label: 'Staff', href: '/admin/staff', roles: ['ADMIN', 'SUPERVISOR'] },
  { label: 'Catalog', href: '/admin/catalog', roles: ['ADMIN'] },
  { label: 'My Jobs', href: '/employee', roles: ['EMPLOYEE'] },
  { label: 'Settings', href: '/admin/settings', roles: ['ADMIN'] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { staff, logout } = useStaffAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = NAV.filter((i) => staff && i.roles.includes(staff.role));

  const isActive = (href: string) =>
    href === '/admin' || href === '/employee'
      ? pathname === href
      : pathname.startsWith(href);

  const sidebar = (
    <nav className="flex h-full flex-col gap-1 p-4">
      <div className="mb-4 px-2">
        <Logo />
      </div>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setOpen(false)}
          className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            isActive(item.href)
              ? 'bg-brand text-white'
              : 'text-ink/70 hover:bg-brand-tint hover:text-brand'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-cloud">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 flex-shrink-0 border-r border-black/5 bg-white lg:block">
        {sidebar}
      </aside>

      {/* Mobile slide-over */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">{sidebar}</div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-black/5 bg-white px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 text-ink hover:bg-brand-tint lg:hidden"
            aria-label="Open menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          </button>

          <div className="ml-auto flex items-center gap-3">
            <Link href="/admin/profile" className="text-right transition-opacity hover:opacity-70">
              <p className="text-sm font-semibold text-ink">{staff?.fullName || staff?.email}</p>
              <p className="text-xs text-ink/50">{staff?.role}</p>
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-brand px-4 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand-tint"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
