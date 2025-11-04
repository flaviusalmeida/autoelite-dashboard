import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchOperacional } from "../services/api";

export default function MediaProcedimentos({ selectedMes, meses, operacional }) {
  const [prevRanking, setPrevRanking] = useState([]);
  const [loadingPrev, setLoadingPrev] = useState(false);

  // 🔹 Determina o mês anterior
  const indexAtual = meses.indexOf(selectedMes);
  const mesAnterior = indexAtual > 0 ? meses[indexAtual - 1] : null;

  // 🔹 Carrega ranking do mês anterior
  useEffect(() => {
    if (!mesAnterior) return;
    setLoadingPrev(true);

    fetchOperacional(mesAnterior)
      .then((res) => setPrevRanking(res?.ranking || []))
      .catch(() => setPrevRanking([]))
      .finally(() => setLoadingPrev(false));
  }, [mesAnterior]);

  // 🔹 Cálculo memoizado das médias
  const { mediaAtual, mediaAnterior, diff, isUp } = useMemo(() => {
    const atual = operacional?.ranking || [];
    const anterior = prevRanking || [];

    const sumAtual = atual.reduce((a, b) => a + (b.total || 0), 0);
    const mediaAtual = atual.length ? sumAtual / atual.length : 0;

    const sumAnterior = anterior.reduce((a, b) => a + (b.total || 0), 0);
    const mediaAnterior = anterior.length ? sumAnterior / anterior.length : 0;

    const diff = mediaAnterior
      ? ((mediaAtual - mediaAnterior) / mediaAnterior) * 100
      : 0;

    return { mediaAtual, mediaAnterior, diff, isUp: diff >= 0 };
  }, [operacional, prevRanking]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Média de Procedimentos
      </h3>

      <div className="text-center">
        <p className="text-sm text-gray-500 mb-1">Média por Técnico</p>

        {/* Valor principal com transição */}
        <AnimatePresence mode="wait">
          <motion.p
            key={mediaAtual.toFixed(1)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="text-5xl font-bold text-gray-900 mt-1"
          >
            {loadingPrev ? "..." : mediaAtual.toFixed(1)}
          </motion.p>
        </AnimatePresence>

        {/* Comparativo */}
        <AnimatePresence mode="wait">
          {loadingPrev ? (
            <motion.p
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-gray-400 mt-2"
            >
              Carregando comparativo...
            </motion.p>
          ) : (
            <motion.p
              key={diff.toFixed(1)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className={`text-sm font-medium mt-2 ${
                isUp ? "text-green-600" : "text-red-600"
              }`}
            >
              {isUp ? "▲" : "▼"} {Math.abs(diff).toFixed(1)}%{" "}
              {isUp ? "acima" : "abaixo"} do mês anterior
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
