'use client';

export function CatalogModal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-bold text-ink">{title}</h3>
        {children}
      </div>
    </div>
  );
}

export function CatalogInput({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink">{label}</label>
      <input {...props} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:bg-gray-50 disabled:text-ink/50" />
    </div>
  );
}

export function ErrorBox({ msg }: { msg: string }) {
  return <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">{msg}</div>;
}

export function ModalActions({ submitting, onClose, label }: { submitting: boolean; onClose: () => void; label: string }) {
  return (
    <div className="mt-5 flex justify-end gap-2">
      <button type="button" onClick={onClose} className="rounded-full px-5 py-2.5 text-sm font-semibold text-ink/60 hover:text-ink">Cancel</button>
      <button type="submit" disabled={submitting} className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
        {submitting ? 'Saving…' : label}
      </button>
    </div>
  );
}