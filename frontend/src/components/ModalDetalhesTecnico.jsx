import React, { useRef } from "react";
import { motion } from "framer-motion";

export default function ModalDetalhesTecnico({ tecnico, detalhes = [], onClose }) {
  const backdropRef = useRef();

  const handleBackdropClick = (e) => {
    // Fecha o modal somente se o clique for no fundo (não dentro do conteúdo)
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  return (
    <motion.div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Técnico: {tecnico}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg"
          >
            ✖
          </button>
        </div>

        {/* Conteúdo */}
        <div className="overflow-y-auto max-h-[60vh]">
          {detalhes && detalhes.length > 0 ? (
            <table className="w-full text-sm border-t border-gray-100">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2">Serviço</th>
                  <th className="py-2 text-right">Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {detalhes.map((s, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-2">{s.servico}</td>
                    <td className="py-2 text-right font-semibold text-gray-800">
                      {s.quantidade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Nenhum dado encontrado para este técnico.
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
