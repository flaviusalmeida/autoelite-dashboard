import React, { useEffect, useMemo, useState } from "react";
import { fetchMeses, fetchServicos, fetchOperacional } from "../services/api";
import Donut from "../components/Donut.jsx";
import Header from "../components/Header.jsx";
import RankingCard from "../components/RankingCard.jsx";
import InfoCard from "../components/InfoCard.jsx";
import MetricCard from "../components/MetricCard.jsx";

export default function App() {
  const [meses, setMeses] = useState([]);
  const [selectedMes, setSelectedMes] = useState("");
  const [servicos, setServicos] = useState([]);
  const [operacional, setOperacional] = useState({ list: [], ranking: [] });
  const [prevOperacional, setPrevOperacional] = useState({ list: [], ranking: [] });

  // 🔹 Carrega lista de meses
  useEffect(() => {
    fetchMeses().then(setMeses).catch(console.error);
  }, []);

  // 🔹 Carrega dados do mês selecionado
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

  // 🔹 Carrega dados do mês anterior
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

  // 🔹 Helpers
  const getQ = (nome, origem = servicos) => {
    const row = origem.find((s) => (s["Serviço"] || "") === nome);
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

      // Converte string vazia, vírgula, etc.
      const rawValue = (item[keyMatch] || "").toString().replace(",", ".");
      const valor = Number(rawValue) || 0;
      return total + valor;
    }, 0);
  };

  const calcDiff = (current, prev) => {
    if (!prev || prev === 0) return 0;
    return ((current - prev) / prev) * 100;
  };

  // 🔹 Agrupamento padrão de serviços (para cards)
  const sums = useMemo(() => {
    const instalacoes =
      getQ("RASTREAMENTO BÁSICO") +
      getQ("AUTO ELITE MAX MOTO") +
      getQ("AUTO ELITE MAX CARRO") +
      getQ("RASTREAMENTO + ASSISTÊNCIA MOTO") +
      getQ("RASTREAMENTO + ASSISTÊNCIA CARRO");

    const manutencoes = getQ("MANUTENÇÕES");
    const retiradas = getQ("RETIRADAS");

    const reboqueTotal = getQ("REBOQUE CARRO") + getQ("REBOQUE MOTO");
    const auxBateria = getQ("AUXÍLIO BATERIA");
    const trocaBateria = getQ("TROCA DE BATERIA");
    const socorroPneu = getQ("SOCORRO PNEU");
    const taxiUber = getQ("TÁXI/ UBER") || getQ("TÁXI / UBER");

    const ocorrencias = getQ("TOTAL DE OCORRÊNCIAS");
    const recuperacoes = getQ("TOTAL DE RECUPERAÇÕES");
    const feedbacks = getQ("FEEDBACKS RECEBIDOS");

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

  const periodoLabel = selectedMes || meses[meses.length - 1] || "--/----";

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* ======= Cabeçalho ======= */}
      <Header
        selectedMes={selectedMes || ""}
        meses={meses}
        onMesChange={setSelectedMes}
      />

      {/* ======= Linha 1: Procedimentos + Donut ======= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
            <span className="text-2xl mr-2">🛠️</span> Procedimentos Técnicos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard title="Rastreamento Básico" value={getQ("RASTREAMENTO BÁSICO")} tone="green" />
            <InfoCard title="AUTO ELITE MAX MOTO" value={getQ("AUTO ELITE MAX MOTO")} tone="green" />
            <InfoCard title="AUTO ELITE MAX CARRO" value={getQ("AUTO ELITE MAX CARRO")} tone="green" />
            <InfoCard title="Rast. + Ass. Moto" value={getQ("RASTREAMENTO + ASSISTÊNCIA MOTO")} tone="green" />
            <InfoCard title="Rast. + Ass. Carro" value={getQ("RASTREAMENTO + ASSISTÊNCIA CARRO")} tone="green" />
            <InfoCard title="Manutenções" value={getQ("MANUTENÇÕES")} tone="yellow" />
            <InfoCard title="Retiradas" value={getQ("RETIRADAS")} tone="red" />
          </div>
        </section>

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
      </div>
      
      {/* ======= Linha 2: Assistência Veicular ======= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
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

        {/* ======= Central de Monitoramento 24h ======= */}
        <section className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
            <span className="text-2xl mr-2">🚨</span> Central de Monitoramento 24h
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InfoCard title="Ocorrências (R/F)" value={sums.ocorrencias} tone="white" textColor="red" fontSize="4xl" className="p-6 text-center" />
            <InfoCard title="Recuperações" value={sums.recuperacoes} tone="white" textColor="green" fontSize="4xl" className="p-6 text-center" />
          </div>
        </section>

        {/* ======= Feedback ======= */}
        <section className="lg:col-span-1">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
            <span className="text-2xl mr-2">⭐</span> Feedback
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <InfoCard title="Feedbacks Recebidos" value={sums.feedbacks} tone="yellow" textColor="gray" fontSize="4xl" className="p-6 text-center" />
          </div>
        </section>
      </div>




      {/* ======= Linha 2: Indicadores ======= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* ======= Ranking ======= */}
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
      </div>
    </div>
  );
}
