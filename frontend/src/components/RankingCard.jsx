import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ModalDetalhesTecnico from "./ModalDetalhesTecnico";

export default function RankingCard({ title, data = [], onFetchDetails }) {
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClick = async (nome) => {
    if (!onFetchDetails) return;
    setSelected(nome);
    setLoading(true);
    try {
      const result = await onFetchDetails(nome);
      setDetails(result);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelected(null);
    setDetails([]);
  };

  const getMedal = (index) => {
    const medals = ["🥇", "🥈", "🥉"];
    return medals[index] || "";
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-all duration-300">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>

        <ul className="space-y-2">
          {data.map((r, idx) => (
            <li
              key={r.responsavel || idx}
              onClick={() => handleClick(r.responsavel)}
              className={`flex justify-between items-center px-2 py-2 rounded-md cursor-pointer select-none transition-colors duration-200 ${
                selected === r.responsavel
                  ? "bg-indigo-50 text-indigo-700"
                  : "hover:bg-gray-50"
              }`}
            >
              <span className="flex items-center gap-1">
                {idx + 1}. {r.responsavel}
                {getMedal(idx) && (
                  <span className="text-lg ml-1">{getMedal(idx)}</span>
                )}
              </span>
              <span className="font-bold text-gray-900">{r.total}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 🔹 Modal flutuante de detalhes */}
      <AnimatePresence>
        {selected && (
          <ModalDetalhesTecnico
            tecnico={selected}
            detalhes={details}
            onClose={closeModal}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </>
  );
}
