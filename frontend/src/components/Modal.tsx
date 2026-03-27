import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  isDangerous?: boolean;
}

export function Modal({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  isLoading = false,
  isDangerous = false,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in border border-gray-100">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
          <div className="mb-8 text-gray-600">{children}</div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={isLoading}
              type="button"
              className="px-6 py-2.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 disabled:opacity-50 font-semibold transition-all"
            >
              {cancelText}
            </button>
            {onConfirm && (
              <button
                onClick={onConfirm}
                disabled={isLoading}
                type="button"
                className={`px-6 py-2.5 rounded-lg text-white font-semibold transition-all ${
                  isDangerous
                    ? "bg-danger-600 hover:bg-danger-700 disabled:opacity-50"
                    : "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:opacity-50"
                }`}
              >
                {isLoading ? "⏳ Traitement..." : confirmText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading = false,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}) {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onCancel}
      onConfirm={onConfirm}
      confirmText="Supprimer"
      cancelText="Annuler"
      isLoading={isLoading}
      isDangerous
    >
      <p className="text-gray-600">{message}</p>
    </Modal>
  );
}
