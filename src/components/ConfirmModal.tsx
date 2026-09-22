import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Xác nhận xóa',
  cancelLabel = 'Hủy bỏ',
  isDestructive = true,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="confirm-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onCancel}
    >
      <div
        id="confirm-modal-content"
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-full shrink-0 ${
                isDestructive ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
              }`}
            >
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 leading-snug">{title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{message}</p>
            </div>
            <button
              id="btn-close-confirm-modal"
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              id="btn-cancel-action"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {cancelLabel}
            </button>
            <button
              id="btn-confirm-action"
              onClick={() => {
                onConfirm();
                onCancel();
              }}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm text-white shadow-sm transition-all cursor-pointer ${
                isDestructive
                  ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
