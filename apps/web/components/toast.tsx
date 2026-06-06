"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type ToastType = "success" | "error";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

function ToastItem({
  toast: t,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  const [entering, setEntering] = useState(true);

  useEffect(() => {
    requestAnimationFrame(() => setEntering(false));
  }, []);

  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timer.current = setTimeout(() => {
      onRemove(t.id);
    }, 5000);
    return () => clearTimeout(timer.current);
  }, [t.id, onRemove]);

  const bg = t.type === "error" ? "bg-red-50 border-red-400 text-red-800" : "bg-green-50 border-green-400 text-green-800";

  return (
    <div
      className={`pointer-events-auto w-80 rounded-lg border px-4 py-3 text-sm shadow-lg transition-all duration-300 ${bg} ${
        entering ? "translate-x-4 opacity-0" : "translate-x-0 opacity-100"
      }`}
    >
      {t.message}
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, type }]);
    },
    []
  );

  const toast = useCallback(
    (message: string, type?: ToastType) => addToast(message, type),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
