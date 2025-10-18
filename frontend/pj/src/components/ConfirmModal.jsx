import React from "react";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, type = "success" }) => {
  if (!isOpen) return null;

  const textColor = type === "success" ? "text-green-800" : "text-red-800";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
        <h2 className={`text-lg font-bold mb-2 ${textColor}`}>{title}</h2>
        <p className={`mb-4 ${textColor}`}>{message}</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2  cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            OK
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 cursor-pointer bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
