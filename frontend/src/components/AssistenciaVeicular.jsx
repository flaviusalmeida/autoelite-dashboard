import React from "react";
import InfoCard from "./InfoCard";

export default function AssistenciaVeicular({ sums }) {
  return (
    <section className="lg:col-span-3">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
        <span className="text-2xl mr-2">🚚</span> Assistência Veicular (Total:{" "}
        {sums.reboqueTotal +
          sums.auxBateria +
          sums.trocaBateria +
          sums.socorroPneu +
          sums.taxiUber}
        )
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <InfoCard title="Reboque (Carro+Moto)" value={sums.reboqueTotal} tone="green" />
        <InfoCard title="Auxílio Bateria" value={sums.auxBateria} tone="green" />
        <InfoCard title="Troca de Bateria" value={sums.trocaBateria} tone="green" />
        <InfoCard title="Socorro Pneu" value={sums.socorroPneu} tone="green" />
        <InfoCard title="Táxi / Uber" value={sums.taxiUber} tone="green" />
      </div>
    </section>
  );
}