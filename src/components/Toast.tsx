import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, dismissToast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-200 bg-emerald-50/95 text-emerald-900',
    error: 'border-rose-200 bg-rose-50/95 text-rose-900',
    info: 'border-blue-200 bg-blue-50/95 text-blue-900'
  };

  return (
    <div
      id="toast-notification-banner"
      className="fixed bottom-5 right-5 z-50 max-w-md w-[calc(100vw-2.5rem)] animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div
        className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-sm ${borders[toast.type]}`}
      >
        {icons[toast.type]}
        <div className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</div>
        <button
          id="btn-dismiss-toast"
          onClick={dismissToast}
          className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-black/5"
          aria-label="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
