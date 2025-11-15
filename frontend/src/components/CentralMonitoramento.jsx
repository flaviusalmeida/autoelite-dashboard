import React from "react";
import InfoCard from "./InfoCard";

export default function CentralMonitoramento({ sums }) {
  return (
    <section className="lg:col-span-2">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
        <span className="text-2xl mr-2">🚨</span> Central de Monitoramento 24h
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <InfoCard title="Ocorrências (R/F)" value={sums.ocorrencias} tone="white" textColor="red" fontSize="5xl" className="p-6 text-center" />
        <InfoCard title="Recuperações" value={sums.recuperacoes} tone="white" textColor="green" fontSize="5xl" className="p-6 text-center" />
      </div>
    </section>
  );
}