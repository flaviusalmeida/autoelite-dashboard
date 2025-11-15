import React from "react";
import RankingCard from "./RankingCard";
import MetricCard from "./MetricCard";

export default function RankingTecnico({ operacional, prevOperacional, sumByField }) {
  return (
    <section className="lg:col-span-3">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
        <span className="text-2xl mr-2">🏆</span> Procedimentos Técnicos Executados
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <RankingCard
          title="Ranking por Técnico"
          data={operacional.ranking || []}
          onFetchDetails={async (nome) => {
            const registros = (operacional.list || []).filter(
              (r) => r["Responsável"]?.trim() === nome.trim()
            );

            if (registros.length === 0) return [];

            const acumulado = {};
            registros.forEach((r) => {
              Object.entries(r).forEach(([chave, valor]) => {
                if (["Responsável", "Mês"].includes(chave)) return;
                const num = Number(valor) || 0;
                if (!isNaN(num) && num > 0) {
                  acumulado[chave] = (acumulado[chave] || 0) + num;
                }
              });
            });

            return Object.entries(acumulado).map(([servico, quantidade]) => ({
              servico,
              quantidade,
            }));
          }}
        />

        <div className="grid grid-cols-2 gap-4 self-start">
          {[
            { title: "Instalação Básica", field: "Instalação Básica" },
            { title: "Cobertura Total", field: "Vistoria Cobertura Total" },
            { title: "Manutenções", field: "Manutenção" },
            { title: "Retiradas", field: "Retirada" },
          ].map((m) => {
            const atual = sumByField(operacional.list, m.field);
            const anterior = sumByField(prevOperacional.list, m.field);
            return (
              <MetricCard
                key={m.title}
                title={m.title}
                valorAtual={atual}
                valorAnterior={anterior}
                tone="white"
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}