'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useStaffAuth } from '@/context/StaffAuthContext';
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  StaffAuthError,
  type AppNotification,
} from '@/lib/staffApi';

function timeAgo(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const secs = Math.floor((Date.now() - d.getTime()) / 1000);
  if (secs < 60) return 'just now';
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

export default function NotificationBell() {
  const { token, logout } = useStaffAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Poll the unread count every 60s (in-app is the reliable channel).
  const loadCount = useCallback(async () => {
    if (!token) return;
    try {
      const { count } = await fetchUnreadCount(token);
      setUnread(count);
    } catch (err) {
      if (err instanceof StaffAuthError) logout();
      // otherwise silent — the badge is non-critical
    }
  }, [token, logout]);

  useEffect(() => {
    loadCount();
    const id = setInterval(loadCount, 60_000);
    return () => clearInterval(id);
  }, [loadCount]);

  // Load the list when the panel opens.
  const loadList = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await fetchNotifications(token, 30);
      setItems(data);
    } catch (err) {
      if (err instanceof StaffAuthError) logout();
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    if (open) loadList();
  }, [open, loadList]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  async function handleMarkRead(n: AppNotification) {
    if (n.readAt || !token) return;
    // optimistic
    setItems((prev) =>
      prev.map((x) => (x.id === n.id ? { ...x, readAt: new Date().toISOString() } : x)),
    );
    setUnread((c) => Math.max(0, c - 1));
    try {
      await markNotificationRead(token, n.id);
    } catch (err) {
      if (err instanceof StaffAuthError) logout();
    }
  }

  async function handleMarkAll() {
    if (!token) return;
    setItems((prev) => prev.map((x) => ({ ...x, readAt: x.readAt ?? new Date().toISOString() })));
    setUnread(0);
    try {
      await markAllNotificationsRead(token);
    } catch (err) {
      if (err instanceof StaffAuthError) logout();
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-lg p-2 text-ink transition-colors hover:bg-brand-tint"
        aria-label="Notifications"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5">
          <div className="flex items-center justify-between border-b border-black/5 px-4 py-3">
            <span className="text-sm font-bold text-ink">Notifications</span>
            {unread > 0 && (
              <button
                type="button"
                onClick={handleMarkAll}
                className="text-xs font-semibold text-brand hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
              </div>
            ) : items.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-ink/50">
                No notifications yet.
              </p>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => handleMarkRead(n)}
                  className={`flex w-full flex-col gap-0.5 border-b border-black/5 px-4 py-3 text-left transition-colors last:border-0 hover:bg-brand-tint/40 ${
                    n.readAt ? 'bg-white' : 'bg-brand-tint/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-ink">{n.title}</span>
                    {!n.readAt && (
                      <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand" />
                    )}
                  </div>
                  <span className="text-xs text-ink/60">{n.body}</span>
                  <span className="mt-0.5 text-[11px] text-ink/40">
                    {timeAgo(n.createdAt)}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
