import React from "react";
import InfoCard from "./InfoCard";
import { ServicosEnum } from "../enums/ServicosEnum";

export default function ProcedimentosTecnicos({ getQuantidade }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
        <span className="text-2xl mr-2">🛠️</span> Procedimentos Técnicos
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard title="Rastreamento Básico" value={getQuantidade(ServicosEnum.RASTREAMENTO_BASICO)} tone="green" />
        <InfoCard title="Auto Elite Max Moto" value={getQuantidade(ServicosEnum.MAX_MOTO)} tone="green" />
        <InfoCard title="Auto Elite Max Carro" value={getQuantidade(ServicosEnum.MAX_CARRO)} tone="green" />
        <InfoCard title="Rastreamento + Assistência Moto" value={getQuantidade(ServicosEnum.RASTREAMENTO_ASSISTENCIA_MOTO)} tone="green" />
        <InfoCard title="Rastreamento + Assistência Carro" value={getQuantidade(ServicosEnum.RASTREAMENTO_ASSISTENCIA_CARRO)} tone="green" />
        <InfoCard title="Manutenções" value={getQuantidade(ServicosEnum.MANUTENCOES)} tone="yellow" />
        <InfoCard title="Retiradas" value={getQuantidade(ServicosEnum.RETIRADAS)} tone="red" />
      </div>
    </section>
  );
}