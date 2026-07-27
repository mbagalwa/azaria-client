"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

export type ToastInput = {
  title?: string;
  message: string;
  href?: string;
  duration?: number;
};
type Toast = ToastInput & { id: number };

const ToastContext = createContext<(t: ToastInput) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const remove = useCallback(
    (id: number) => setToasts((l) => l.filter((t) => t.id !== id)),
    [],
  );
  const push = useCallback(
    (t: ToastInput) => {
      const id = ++idRef.current;
      setToasts((l) => [...l, { id, ...t }].slice(-4));
      window.setTimeout(() => remove(id), t.duration ?? 6000);
    },
    [remove],
  );

  return (
    <ToastContext.Provider value={push}>
      {children}
      <Toaster toasts={toasts} onClose={remove} />
    </ToastContext.Provider>
  );
}

function Toaster({
  toasts,
  onClose,
}: {
  toasts: Toast[];
  onClose: (id: number) => void;
}) {
  const router = useRouter();

  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-[70] flex flex-col gap-2 sm:left-auto sm:right-4 sm:w-96">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          onClick={() => {
            if (t.href) router.push(t.href);
            onClose(t.id);
          }}
          className="pointer-events-auto flex cursor-pointer items-start gap-3 rounded-card border border-ink/10 bg-surface p-3 shadow-[0_20px_45px_-25px_rgba(18,59,46,0.5)]"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            {t.title && (
              <p className="text-sm font-semibold text-ink">{t.title}</p>
            )}
            <p className="text-sm text-ink-soft">{t.message}</p>
            {t.href && (
              <p className="mt-0.5 text-xs font-semibold text-brand">Voir →</p>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose(t.id);
            }}
            aria-label="Fermer"
            className="-mr-1 rounded-md p-1 text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
