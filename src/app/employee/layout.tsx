import { StaffAuthProvider } from '@/context/StaffAuthContext';
import RequireRole from '@/components/staff/RequireRole';
import DashboardLayout from '@/components/staff/DashboardLayout';

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <StaffAuthProvider>
      <RequireRole allow={['EMPLOYEE']}>
        <DashboardLayout>{children}</DashboardLayout>
      </RequireRole>
    </StaffAuthProvider>
  );
}
