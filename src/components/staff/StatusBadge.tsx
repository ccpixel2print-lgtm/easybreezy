const STYLES: Record<string, string> = {
  ASSIGNED: 'bg-blue-50 text-blue-700 ring-blue-200',
  IN_PROGRESS: 'bg-amber-50 text-amber-700 ring-amber-200',
  COMPLETED: 'bg-green-50 text-green-700 ring-green-200',
  CONFIRMED: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  PENDING_PAYMENT: 'bg-gray-100 text-gray-600 ring-gray-200',
  AWAITING_QUOTE: 'bg-purple-50 text-purple-700 ring-purple-200',
  CANCELLED: 'bg-red-50 text-red-700 ring-red-200',
  NO_SHOW: 'bg-red-50 text-red-700 ring-red-200',
};

export default function StatusBadge({ status }: { status: string }) {
  const cls = STYLES[status] || 'bg-gray-100 text-gray-600 ring-gray-200';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${cls}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}
