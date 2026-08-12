import { StaffAuthProvider } from '@/context/StaffAuthContext';
import RequireRole from '@/components/staff/RequireRole';
import DashboardLayout from '@/components/staff/DashboardLayout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <StaffAuthProvider>
      <RequireRole allow={['ADMIN', 'SUPERVISOR']}>
        <DashboardLayout>{children}</DashboardLayout>
      </RequireRole>
    </StaffAuthProvider>
  );
}
