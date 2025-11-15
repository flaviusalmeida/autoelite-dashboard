import React from "react";
import Donut from "./Donut";

export default function DistribuicaoProcedimentos({ sums }) {
  return (
    <section className="flex flex-col h-full">
      <h2 className="text-2xl font-semibold text-gray-700 mb-3">
        Distribuição de Procedimentos
      </h2>
      <div className="flex-grow flex items-start justify-center mt-[4px]">
        <Donut
          data={{
            instalacoes: sums.instalacoes,
            manutencoes: sums.manutencoes,
            retiradas: sums.retiradas,
          }}
        />
      </div>
    </section>
  );
}