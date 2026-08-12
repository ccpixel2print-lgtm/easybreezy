/** paise -> "₹1,234" */
export function formatRupees(paise?: number | null): string {
  const rupees = Math.round((paise ?? 0) / 100);
  return `₹${rupees.toLocaleString('en-IN')}`;
}

/** rupees string from a form -> paise integer (or undefined if blank) */
export function rupeesToPaise(input: string): number | undefined {
  const trimmed = input.trim();
  if (trimmed === '') return undefined;
  const n = Number(trimmed);
  if (Number.isNaN(n) || n < 0) return undefined;
  return Math.round(n * 100);
}

/** paise -> plain rupees string for a form field (no ₹, no commas) */
export function paiseToRupeeInput(paise?: number | null): string {
  if (paise === null || paise === undefined) return '';
  return String(Math.round(paise / 100));
}
