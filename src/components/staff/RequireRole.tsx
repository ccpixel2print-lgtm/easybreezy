'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStaffAuth } from '@/context/StaffAuthContext';
import type { AuthUser } from '@/lib/api';

type Role = AuthUser['role'];

export default function RequireRole({
  allow,
  children,
}: {
  allow: Role[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { staff, loading } = useStaffAuth();

  useEffect(() => {
    if (loading) return;
    if (!staff) {
      router.replace('/staff/login');
    }
  }, [loading, staff, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cloud">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  if (!staff) return null; // redirecting

  if (!allow.includes(staff.role)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cloud px-4 text-center">
        <h1 className="text-2xl font-bold text-ink">Not authorized</h1>
        <p className="max-w-sm text-sm text-ink/60">
          Your account ({staff.role}) doesn&apos;t have access to this area.
        </p>
        <a
          href={staff.role === 'EMPLOYEE' ? '/employee' : '/admin'}
          className="mt-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Go to my dashboard
        </a>
      </div>
    );
  }

  return <>{children}</>;
}
