// frontend/src/components/common/Toast.jsx
import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';

export function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-400" />,
    error: <AlertTriangle className="h-5 w-5 text-red-400" />,
  };

  const colors = {
    success: 'bg-green-50 text-green-800',
    error: 'bg-red-50 text-red-800',
  };

  return (
    <div
      className={`fixed bottom-4 right-4 ${colors[type]} p-4 rounded-lg shadow-lg max-w-md z-50`}
    >
      <div className="flex items-center">
        {icons[type]}
        <div className="ml-3">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button onClick={onClose} className="ml-auto pl-3">
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
