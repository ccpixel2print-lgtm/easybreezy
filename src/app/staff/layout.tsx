import { StaffAuthProvider } from '@/context/StaffAuthContext';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return <StaffAuthProvider>{children}</StaffAuthProvider>;
}
