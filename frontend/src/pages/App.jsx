import React, { useEffect, useMemo, useState } from "react";
import { fetchMeses, fetchServicos, fetchOperacional } from "../services/api";
import Header from "../components/Header.jsx";
import { cleanString } from "../Utils/stringUtils.js";
import { ServicosEnum } from "../enums/ServicosEnum.js";
import AssistenciaVeicular from "../components/AssistenciaVeicular.jsx";
import ProcedimentosTecnicos from "../components/ProcedimentosTecnicos.jsx";
import DistribuicaoProcedimentos from "../components/DistribuicaoProcedimentos.jsx";
import CentralMonitoramento from "../components/CentralMonitoramento";
import Feedback from "../components/Feedback";
import RankingTecnico from "../components/RankingTecnico";

export default function App() {
  const [meses, setMeses] = useState([]);
  const [selectedMes, setSelectedMes] = useState("");
  const [servicos, setServicos] = useState([]);
  const [operacional, setOperacional] = useState({ list: [], ranking: [] });
  const [prevOperacional, setPrevOperacional] = useState({ list: [], ranking: [] });

  useEffect(() => {
    fetchMeses().then(setMeses).catch(console.error);
  }, []);

  useEffect(() => {
    const mesAtual = selectedMes || meses[meses.length - 1];
    if (!mesAtual) return;

    fetchServicos(mesAtual)
      .then((d) => setServicos(d.servicos || []))
      .catch(console.error);

    fetchOperacional(mesAtual)
      .then((d) =>
        setOperacional({
          list: d.operacional || [],
          ranking: d.ranking || [],
        })
      )
      .catch(console.error);
  }, [selectedMes, meses]);

  useEffect(() => {
    const indexAtual = meses.indexOf(selectedMes);
    const mesAnterior = indexAtual > 0 ? meses[indexAtual - 1] : null;
    if (!mesAnterior) return;

    fetchOperacional(mesAnterior)
      .then((d) =>
        setPrevOperacional({
          list: d.operacional || [],
          ranking: d.ranking || [],
        })
      )
      .catch(console.error);
  }, [selectedMes, meses]);

  const getQuantidade = (nome, origem = servicos) => {
    const row = origem.find((s) => cleanString(s["Serviço"] || "") === cleanString(nome));
    return Number(row?.["Quantidade"] || 0);
  };

  const sumByField = (list, fieldName) => {
    if (!list || list.length === 0) return 0;

    const normalizedField = fieldName.trim().toUpperCase();

    return list.reduce((total, item) => {
      const keyMatch = Object.keys(item).find(
        (k) => k.trim().toUpperCase() === normalizedField
      );
      if (!keyMatch) return total;

      const rawValue = (item[keyMatch] || "").toString().replace(",", ".");
      const valor = Number(rawValue) || 0;
      return total + valor;
    }, 0);
  };

  const sums = useMemo(() => {
    const instalacoes =
      getQuantidade(ServicosEnum.RASTREAMENTO_BASICO) +
      getQuantidade(ServicosEnum.MAX_MOTO) +
      getQuantidade(ServicosEnum.MAX_CARRO) +
      getQuantidade(ServicosEnum.RASTREAMENTO_ASSISTENCIA_MOTO) +
      getQuantidade(ServicosEnum.RASTREAMENTO_ASSISTENCIA_CARRO);

    const manutencoes = getQuantidade(ServicosEnum.MANUTENCOES);
    const retiradas = getQuantidade(ServicosEnum.RETIRADAS);

    const reboqueTotal = getQuantidade(ServicosEnum.REBOQUE_CARRO) + getQuantidade(ServicosEnum.REBOQUE_MOTO);
    const auxBateria = getQuantidade(ServicosEnum.AUXILIO_BATERIA);
    const trocaBateria = getQuantidade(ServicosEnum.TROCA_BATERIA);
    const socorroPneu = getQuantidade(ServicosEnum.SOCORRO_PNEU);
    const taxiUber = getQuantidade(ServicosEnum.TAXI_UBER);

    const ocorrencias = getQuantidade(ServicosEnum.TOTAL_OCORRENCIAS);
    const recuperacoes = getQuantidade(ServicosEnum.TOTAL_RECUPERACOES);
    const feedbacks = getQuantidade(ServicosEnum.FEEDBACKS_RECEBIDOS);

    return {
      instalacoes,
      manutencoes,
      retiradas,
      reboqueTotal,
      auxBateria,
      trocaBateria,
      socorroPneu,
      taxiUber,
      ocorrencias,
      recuperacoes,
      feedbacks,
    };
  }, [servicos]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <Header
        selectedMes={selectedMes || ""}
        meses={meses}
        onMesChange={setSelectedMes}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProcedimentosTecnicos getQuantidade={getQuantidade} />
        <DistribuicaoProcedimentos sums={sums} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <AssistenciaVeicular sums={sums} />
        <CentralMonitoramento sums={sums} />
        <Feedback sums={sums} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <RankingTecnico
          operacional={operacional}
          prevOperacional={prevOperacional}
          sumByField={sumByField}
        />
      </div>
    </div>
  );
}
