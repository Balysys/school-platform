import { useEffect, useState } from "react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}

let toastId = 0;
let toastListeners: ((msg: ToastMessage) => void)[] = [];

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (msg: ToastMessage) => {
      setToasts((prev) => [...prev, msg]);
      if (msg.duration !== 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== msg.id));
        }, msg.duration || 3000);
      }
    };

    toastListeners.push(handleToast);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== handleToast);
    };
  }, []);

  return { toasts, removeToast: (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)) };
};

export const showToast = (type: "success" | "error" | "info" | "warning", message: string, duration?: number) => {
  const id = String(toastId++);
  toastListeners.forEach((listener) => listener({ id, type, message, duration }));
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
    warning: "⚠️",
  };

  const colors = {
    success: "bg-gradient-to-r from-success-500 to-success-600",
    error: "bg-gradient-to-r from-danger-500 to-danger-600",
    info: "bg-gradient-to-r from-primary-500 to-primary-600",
    warning: "bg-gradient-to-r from-warning-500 to-warning-600",
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${colors[toast.type]} text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-slide-down backdrop-blur-sm border border-white/20 max-w-sm`}
        >
          <span className="text-xl flex-shrink-0">{icons[toast.type]}</span>
          <span className="flex-1 font-medium text-sm">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white hover:text-gray-200 flex-shrink-0 ml-2"
            type="button"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
