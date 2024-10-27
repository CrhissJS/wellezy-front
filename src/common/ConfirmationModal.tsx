// ConfirmationModal.tsx
import React from "react";
import Loader from "./Loader";

interface ConfirmationModalProps {
  isOpen: boolean;
  isReserving: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  isReserving,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
        <h2 className="text-lg font-bold mb-4">¿Confirmar Reserva?</h2>
        <p>¿Estás seguro de que deseas reservar este vuelo?</p>
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={onConfirm}
            disabled={isReserving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isReserving ? <Loader /> : "Confirmar"}
          </button>
          <button
            onClick={onClose}
            disabled={isReserving}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
