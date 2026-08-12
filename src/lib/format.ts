/** paise -> "₹1,234" */
export function formatRupees(paise?: number | null): string {
  const rupees = Math.round((paise ?? 0) / 100);
  return `₹${rupees.toLocaleString('en-IN')}`;
}
