import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MetricCard({
  title,
  valorAtual = 0,
  valorAnterior = 0,
  tone = "white",
}) {
  const diff = valorAnterior ? ((valorAtual - valorAnterior) / valorAnterior) * 100 : 0;

  let statusColor = "text-gray-500";
  let icon = "■";
  let label = "sem variação";

  if (diff > 0.01) {
    statusColor = "text-green-600";
    icon = "▲";
    label = "acima do mês anterior";
  } else if (diff < -0.01) {
    statusColor = "text-red-600";
    icon = "▼";
    label = "abaixo do mês anterior";
  }

  const toneClasses = {
    white: "bg-white border border-gray-200 shadow-md",
    gray: "bg-gray-50 border border-gray-200 shadow-md",
  };

  return (
    <div
      className={`p-6 ${toneClasses[tone]} rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
    >
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>

      <AnimatePresence mode="wait">
        <motion.p
          key={valorAtual}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="text-5xl font-bold text-gray-900"
        >
          {valorAtual}
        </motion.p>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.p
          key={diff.toFixed(1)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className={`text-sm font-medium mt-2 flex items-center justify-center gap-1 ${statusColor}`}
        >
          {icon} {Math.abs(diff).toFixed(1)}% {label}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
