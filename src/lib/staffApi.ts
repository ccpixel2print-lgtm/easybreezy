import type { AuthUser } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface StaffAuthResult {
  accessToken: string;
  user: AuthUser;
}

/** Thrown on 401 so the context can force a logout + redirect. */
export class StaffAuthError extends Error {
  constructor(message = 'Session expired. Please log in again.') {
    super(message);
    this.name = 'StaffAuthError';
  }
}

async function parseError(res: Response, fallback: string): Promise<never> {
  const body = await res.json().catch(() => ({}));
  throw new Error(body.message || fallback);
}

/** Authenticated fetch for all /admin/* and /employee/* endpoints. */
async function staffFetch<T>(
  path: string,
  token: string,
  init: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init.headers || {}),
    },
    cache: 'no-store',
  });
  if (res.status === 401) throw new StaffAuthError();
  if (res.status === 403) throw new Error('You are not authorized to perform this action.');
  if (!res.ok) return parseError(res, `Request failed (${res.status}).`);
  return res.json() as Promise<T>;
}

// ---- Auth ----

export async function staffLogin(email: string, password: string): Promise<StaffAuthResult> {
  const res = await fetch(`${API_URL}/auth/staff/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  });
  if (!res.ok) return parseError(res, 'Invalid email or password.');
  return res.json();
}

export async function fetchStaffMe(token: string): Promise<AuthUser> {
  return staffFetch<AuthUser>('/auth/me', token);
}

export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
}

export function updateStaffMe(token: string, payload: UpdateProfilePayload) {
  return staffFetch<AuthUser>('/auth/me', token, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

// ---- Admin / Supervisor read views (Step 17) ----

export interface DashboardSummary {
  orders?: { byStatus?: Record<string, number> };
  bookings?: { byStatus?: Record<string, number> };
  revenue?: { paidRevenue?: number; bookedRevenue?: number };
  operations?: { todaysJobs?: number; unassignedQueue?: number };
  staff?: { byRole?: Record<string, number> };
  customers?: { total?: number };
  recentOrders?: unknown[];
  // kept loose until we see the live payload; we'll tighten after first call
  [key: string]: unknown;
}

export function fetchDashboard(token: string) {
  return staffFetch<DashboardSummary>('/admin/dashboard', token);
}

export interface AdminOrder {
  id: string;
  orderNumber?: string;
  contactName?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  subtotal?: number | null;     // paise
  taxAmount?: number | null;    // paise
  totalAmount?: number | null;  // paise
  status?: string;
  paymentStatus?: string;
  city?: string | null;
  pincode?: string | null;
  placedAt?: string;
  // legacy aliases (kept optional so nothing else breaks)
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  createdAt?: string;
  [key: string]: unknown;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** Normalizes whatever envelope the backend returns into a consistent shape. */
function normalizePage<T>(raw: any, page: number, pageSize: number): Paginated<T> {
  const data: T[] = raw?.data ?? raw?.items ?? (Array.isArray(raw) ? raw : []);
  const total: number =
    raw?.total ?? raw?.meta?.total ?? raw?.count ?? data.length;
  return {
    data,
    total,
    page: raw?.page ?? raw?.meta?.page ?? page,
    pageSize: raw?.pageSize ?? raw?.meta?.pageSize ?? pageSize,
  };
}

export async function fetchAdminOrders(
  token: string,
  params: {
    page?: number;
    pageSize?: number;
    status?: string;
    paymentStatus?: string;
    search?: string;
    from?: string;
    to?: string;
  } = {},
): Promise<Paginated<AdminOrder>> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const qs = new URLSearchParams(
    Object.entries({ ...params, page, pageSize })
      .filter(([, v]) => v !== undefined && v !== '')
      .map(([k, v]) => [k, String(v)]),
  ).toString();
  const raw = await staffFetch<any>(`/admin/orders?${qs}`, token);
  return normalizePage<AdminOrder>(raw, page, pageSize);
}


export interface AdminCustomer {
  id: string;
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  orderCount?: number | null;
  lifetimeValue?: number | null; // paise (paid orders)
  createdAt?: string;
  [key: string]: unknown;
}

export async function fetchAdminCustomers(
  token: string,
  params: { page?: number; pageSize?: number; search?: string } = {},
): Promise<Paginated<AdminCustomer>> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const qs = new URLSearchParams(
    Object.entries({ ...params, page, pageSize })
      .filter(([, v]) => v !== undefined && v !== '')
      .map(([k, v]) => [k, String(v)]),
  ).toString();
  const raw = await staffFetch<any>(`/admin/customers?${qs}`, token);
  return normalizePage<AdminCustomer>(raw, page, pageSize);
}

// ---- Employee jobs (Step 16) ----

export interface EmployeeJob {
  id: string;
  bookingNumber: string;
  status:
    | 'ASSIGNED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CONFIRMED'
    | 'CANCELLED'
    | 'NO_SHOW'
    | string;
  itemName?: string | null;
  serviceName?: string | null;
  subServiceName?: string | null;
  scheduledDate?: string | null;
  scheduledTimeWindow?: string | null;
  address?: string | null;
  pincode?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  assignedAt?: string | null;
  acceptedAt?: string | null;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
  startedAt?: string | null;
  workDoneAt?: string | null;
  completedAt?: string | null;
  confirmedAt?: string | null;
  notes?: string | null;
  photos?: BookingPhoto[];
  // loose until confirmed against the live payload
  [key: string]: unknown;
}

export interface BookingPhoto {
  id: string;
  kind: 'BEFORE' | 'AFTER';
  url: string;
  createdAt?: string;
}


export function fetchEmployeeJobs(token: string, status?: string) {
  const qs = status ? `?status=${encodeURIComponent(status)}` : '';
  return staffFetch<EmployeeJob[]>(`/employee/jobs${qs}`, token);
}

export function fetchEmployeeJob(token: string, id: string) {
  return staffFetch<EmployeeJob>(`/employee/jobs/${id}`, token);
}

export function acceptEmployeeJob(token: string, id: string) {
  return staffFetch<EmployeeJob>(`/employee/jobs/${id}/accept`, token, { method: 'POST' });
}

export function rejectEmployeeJob(token: string, id: string, reason?: string) {
  return staffFetch<EmployeeJob>(`/employee/jobs/${id}/reject`, token, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export function startEmployeeJob(token: string, id: string) {
  return staffFetch<EmployeeJob>(`/employee/jobs/${id}/start`, token, { method: 'POST' });
}

export function workDoneEmployeeJob(token: string, id: string, notes?: string) {
  return staffFetch<EmployeeJob>(`/employee/jobs/${id}/work-done`, token, {
    method: 'POST',
    body: JSON.stringify({ notes }),
  });
}

/** Photo upload uses multipart/form-data, so it bypasses the JSON staffFetch helper. */
export async function uploadJobPhoto(
  token: string,
  id: string,
  kind: 'before' | 'after',
  file: File,
): Promise<BookingPhoto> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_URL}/employee/jobs/${id}/photos?kind=${kind}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }, // no Content-Type: browser sets multipart boundary
    body: form,
    cache: 'no-store',
  });
  if (res.status === 401) throw new StaffAuthError();
  if (!res.ok) return parseError(res, `Upload failed (${res.status}).`);
  return res.json() as Promise<BookingPhoto>;
}

export interface AdminBooking {
  id: string;
  bookingNumber?: string;
  status?: string;
  itemName?: string | null;
  serviceName?: string | null;
  subServiceName?: string | null;
  scheduledDate?: string | null;
  scheduledTimeWindow?: string | null;
  address?: string | null;
  // full service-location snapshot (from Booking model)
  addressLine1?: string | null;
  addressLine2?: string | null;
  area?: string | null;
  city?: string | null;
  pincode?: string | null;
    customer?: {
    id: string;
    fullName?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;
  order?: {
    contactName?: string | null;
    contactPhone?: string | null;
    contactEmail?: string | null;
  } | null;
  // legacy flat fields (kept optional)
  customerName?: string | null;
  customerPhone?: string | null;
  assignedEmployeeId?: string | null;
  assignedEmployee?: { id: string; fullName?: string | null; email?: string | null } | null;
  assignedAt?: string | null;
  [key: string]: unknown;
}

export interface StaffMember {
  id: string;
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  role: 'ADMIN' | 'SUPERVISOR' | 'EMPLOYEE' | string;
  status?: string;
  active?: boolean;
  payoutRatePercent?: number | null;
  [key: string]: unknown;
}

export function fetchAdminBookings(
  token: string,
  params: { status?: string; assigned?: boolean; employeeId?: string } = {},
) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== '');
  const qs = new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
  return staffFetch<AdminBooking[]>(`/admin/bookings${qs ? `?${qs}` : ''}`, token);
}

export function fetchStaffList(token: string) {
  return staffFetch<StaffMember[]>('/admin/staff', token);
}

export function assignBooking(token: string, bookingId: string, employeeId: string) {
  return staffFetch<AdminBooking>(`/admin/bookings/${bookingId}/assign`, token, {
    method: 'POST',
    body: JSON.stringify({ employeeId }),
  });
}

export function reassignBooking(token: string, bookingId: string, employeeId: string) {
  return staffFetch<AdminBooking>(`/admin/bookings/${bookingId}/reassign`, token, {
    method: 'POST',
    body: JSON.stringify({ employeeId }),
  });
}

export function unassignBooking(token: string, bookingId: string) {
  return staffFetch<AdminBooking>(`/admin/bookings/${bookingId}/unassign`, token, {
    method: 'POST',
  });
}

export function confirmBookingCompletion(token: string, bookingId: string) {
  return staffFetch<AdminBooking>(`/admin/bookings/${bookingId}/confirm`, token, {
    method: 'POST',
  });
}

export interface CreateStaffPayload {
  fullName: string;
  email: string;
  phone?: string;
  role: 'SUPERVISOR' | 'EMPLOYEE';
  password: string;
}

export interface UpdateStaffPayload {
  fullName?: string;
  phone?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export function createStaff(token: string, payload: CreateStaffPayload) {
  return staffFetch<StaffMember>('/admin/staff', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateStaff(token: string, id: string, payload: UpdateStaffPayload) {
  return staffFetch<StaffMember>(`/admin/staff/${id}`, token, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function resetStaffPassword(token: string, id: string, password: string) {
  return staffFetch<{ ok?: boolean }>(`/admin/staff/${id}/reset-password`, token, {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
}

// ---- Catalog admin (Step 18) — ADMIN only ----

export interface AdminCategory {
  id: string;
  name: string;
  displayOrder?: number | null;
  active?: boolean;
  [key: string]: unknown;
}

export interface AdminPincode {
  id: string;
  pincode: string;
  areaName?: string | null;
  city?: string | null;
  active?: boolean;
  [key: string]: unknown;
}

// Categories
export function fetchCategories(token: string) {
  return staffFetch<AdminCategory[]>('/admin/catalog/categories', token);
}
export function createCategory(
  token: string,
  body: { name: string; displayOrder?: number; active?: boolean },
) {
  return staffFetch<AdminCategory>('/admin/catalog/categories', token, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
export function updateCategory(
  token: string,
  id: string,
  body: { name?: string; displayOrder?: number; active?: boolean },
) {
  return staffFetch<AdminCategory>(`/admin/catalog/categories/${id}`, token, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}
export function deleteCategory(token: string, id: string) {
  return staffFetch<unknown>(`/admin/catalog/categories/${id}`, token, { method: 'DELETE' });
}

// Pincodes
export function fetchPincodes(token: string) {
  return staffFetch<AdminPincode[]>('/admin/catalog/pincodes', token);
}
export function createPincode(
  token: string,
  body: { pincode: string; areaName?: string; city?: string; active?: boolean },
) {
  return staffFetch<AdminPincode>('/admin/catalog/pincodes', token, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
export function updatePincode(
  token: string,
  id: string,
  body: { areaName?: string; city?: string; active?: boolean },
) {
  return staffFetch<AdminPincode>(`/admin/catalog/pincodes/${id}`, token, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}
export function deletePincode(token: string, id: string) {
  return staffFetch<unknown>(`/admin/catalog/pincodes/${id}`, token, { method: 'DELETE' });
}

// ---- Catalog admin: Services + Sub-services (ADMIN only) ----

export type PricingType = 'FIXED' | 'HOURLY' | 'VISITING';

export interface AdminSubService {
  id: string;
  serviceId?: string;
  name: string;
  pricingType?: PricingType;
  description?: string | null;
  basePrice?: number | null;   // paise
  hourlyRate?: number | null;  // paise
  visitFee?: number | null;    // paise
  durationLabel?: string | null;
  displayOrder?: number | null;
  active?: boolean;
  [key: string]: unknown;
}

export interface AdminService {
  id: string;
  categoryId?: string;
  category?: { id: string; name: string } | null;
  name: string;
  slug?: string;
  description?: string | null;
  longDescription?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  hasSubServices?: boolean;
  pricingType?: PricingType;
  basePrice?: number | null;
  hourlyRate?: number | null;
  visitFee?: number | null;
  startingPrice?: number | null;
  durationLabel?: string | null;
  displayOrder?: number | null;
  active?: boolean;
  subServices?: AdminSubService[];
  [key: string]: unknown;
}

export interface ServicePayload {
  categoryId: string;
  name: string;
  slug?: string;
  description?: string;
  longDescription?: string;
  imageUrl?: string;
  imageAlt?: string;
  hasSubServices?: boolean;
  pricingType?: PricingType;
  basePrice?: number;
  hourlyRate?: number;
  visitFee?: number;
  startingPrice?: number;
  durationLabel?: string;
  displayOrder?: number;
  active?: boolean;
}

export interface SubServicePayload {
  serviceId: string;
  name: string;
  pricingType: PricingType; // required by backend
  description?: string;
  basePrice?: number;
  hourlyRate?: number;
  visitFee?: number;
  durationLabel?: string;
  displayOrder?: number;
  active?: boolean;
}

export function fetchAdminServices(token: string, categoryId?: string) {
  const qs = categoryId ? `?categoryId=${encodeURIComponent(categoryId)}` : '';
  return staffFetch<AdminService[]>(`/admin/catalog/services${qs}`, token);
}
export function fetchAdminService(token: string, id: string) {
  return staffFetch<AdminService>(`/admin/catalog/services/${id}`, token);
}
export function createService(token: string, body: ServicePayload) {
  return staffFetch<AdminService>('/admin/catalog/services', token, {
    method: 'POST', body: JSON.stringify(body),
  });
}
export function updateService(token: string, id: string, body: Partial<ServicePayload>) {
  return staffFetch<AdminService>(`/admin/catalog/services/${id}`, token, {
    method: 'PATCH', body: JSON.stringify(body),
  });
}
export function deleteService(token: string, id: string) {
  return staffFetch<unknown>(`/admin/catalog/services/${id}`, token, { method: 'DELETE' });
}

export function createSubService(token: string, body: SubServicePayload) {
  return staffFetch<AdminSubService>('/admin/catalog/sub-services', token, {
    method: 'POST', body: JSON.stringify(body),
  });
}
export function updateSubService(token: string, id: string, body: Partial<Omit<SubServicePayload, 'serviceId'>>) {
  return staffFetch<AdminSubService>(`/admin/catalog/sub-services/${id}`, token, {
    method: 'PATCH', body: JSON.stringify(body),
  });
}
export function deleteSubService(token: string, id: string) {
  return staffFetch<unknown>(`/admin/catalog/sub-services/${id}`, token, { method: 'DELETE' });
}

// ---- Settings: pricing group (ADMIN only) ----

export type FeeType = 'FLAT' | 'PERCENT';

export interface ConfigurableFee {
  enabled: boolean;
  type: FeeType;
  value: number; // paise if FLAT; whole-number percent if PERCENT
}

export interface PricingSettings {
  gstEnabled: boolean;
  gstRate: number; // decimal, e.g. 0.18
  platformFee: ConfigurableFee;
  convenienceFee: ConfigurableFee;
}

export function fetchPricingSettings(token: string) {
  return staffFetch<PricingSettings>('/admin/settings/pricing', token);
}

export function updatePricingSettings(token: string, body: Partial<PricingSettings>) {
  return staffFetch<PricingSettings>('/admin/settings/pricing', token, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

// ---- Settings: payments group (ADMIN only) ----

export type PaymentProviderName = 'mock' | 'cod' | 'phonepe';

export interface PaymentsSettings {
  activeProvider: PaymentProviderName;
  enabledProviders: PaymentProviderName[];
}

export function fetchPaymentsSettings(token: string) {
  return staffFetch<PaymentsSettings>('/admin/settings/payments', token);
}

export function updatePaymentsSettings(token: string, body: Partial<PaymentsSettings>) {
  return staffFetch<PaymentsSettings>('/admin/settings/payments', token, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

// ---- Settings: payouts group (ADMIN only) ----

export interface PayoutsSettings {
  defaultPayoutPercent: number; // whole-number percent, e.g. 70 = 70%
}

export function fetchPayoutsSettings(token: string) {
  return staffFetch<PayoutsSettings>('/admin/settings/payouts', token);
}

export function updatePayoutsSettings(token: string, body: Partial<PayoutsSettings>) {
  return staffFetch<PayoutsSettings>('/admin/settings/payouts', token, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

// ---- Wallet: employee (own) ----

export type WalletEntryType = 'JOB_CREDIT' | 'PAYOUT' | 'REVERSAL' | 'ADJUSTMENT';

export interface WalletEntry {
  id: string;
  type: WalletEntryType;
  amount: number;        // paise; positive = credit, negative = debit
  bookingId?: string | null;
  note?: string | null;
  createdById?: string | null;
  createdAt: string;
}

export interface WalletSummary {
  balance: number;       // paise
  totalEarned: number;   // paise
  totalPaidOut: number;  // paise (positive magnitude)
  totalReversed: number; // paise (positive magnitude)
  totalAdjusted: number; // paise (signed)
}

/** Employee's own wallet summary. */
export function fetchMyWallet(token: string) {
  return staffFetch<WalletSummary>('/employee/jobs/wallet', token);
}

/** Employee's own wallet ledger (newest first). */
export function fetchMyWalletLedger(token: string) {
  return staffFetch<WalletEntry[]>('/employee/jobs/wallet/ledger', token);
}

// ---- Wallet: admin/supervisor (any employee) ----

export function fetchEmployeeWallet(token: string, employeeId: string) {
  return staffFetch<WalletSummary>(
    `/admin/bookings/employees/${employeeId}/wallet`,
    token,
  );
}

export function fetchEmployeeWalletLedger(token: string, employeeId: string) {
  return staffFetch<WalletEntry[]>(
    `/admin/bookings/employees/${employeeId}/wallet/ledger`,
    token,
  );
}

/** Record a payout (debit). amount in paise, positive. */
export function recordEmployeePayout(
  token: string,
  employeeId: string,
  amount: number,
  note?: string,
) {
  return staffFetch<WalletEntry>(
    `/admin/bookings/employees/${employeeId}/wallet/payout`,
    token,
    { method: 'POST', body: JSON.stringify({ amount, note }) },
  );
}

/** Set an employee's per-employee payout rate; pass null to fall back to global. */
export function setEmployeePayoutRate(
  token: string,
  employeeId: string,
  payoutRatePercent: number | null,
) {
  return staffFetch<{ id: string; fullName?: string | null; payoutRatePercent: number | null }>(
    `/admin/bookings/employees/${employeeId}/payout-rate`,
    token,
    { method: 'POST', body: JSON.stringify({ payoutRatePercent }) },
  );
}

// ---- Settings: notifications group (ADMIN only) ----

export interface NotificationsSettings {
  ccEmail: string; // optional internal address BCC'd on customer/employee emails; '' = off
}

export function fetchNotificationsSettings(token: string) {
  return staffFetch<NotificationsSettings>('/admin/settings/notifications', token);
}

export function updateNotificationsSettings(
  token: string,
  body: Partial<NotificationsSettings>,
) {
  return staffFetch<NotificationsSettings>('/admin/settings/notifications', token, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

// ---- Notifications (all authenticated roles; /me/notifications) ----

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown> | null;
  readAt?: string | null;
  createdAt: string;
}

/** Recent notifications for the current user, newest first (default 30). */
export function fetchNotifications(token: string, limit = 30) {
  return staffFetch<AppNotification[]>(
    `/me/notifications?limit=${limit}`,
    token,
  );
}

/** Unread count for the badge. */
export function fetchUnreadCount(token: string) {
  return staffFetch<{ count: number }>('/me/notifications/unread-count', token);
}

/** Mark one notification read. */
export function markNotificationRead(token: string, id: string) {
  return staffFetch<{ ok: true }>(`/me/notifications/${id}/read`, token, {
    method: 'PATCH',
  });
}

/** Mark all read. */
export function markAllNotificationsRead(token: string) {
  return staffFetch<{ ok: true }>('/me/notifications/read-all', token, {
    method: 'PATCH',
  });
}