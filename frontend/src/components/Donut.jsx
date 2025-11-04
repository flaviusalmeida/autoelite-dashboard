import React, { useEffect, useRef } from "react";
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

export default function Donut({ data }) {
  const ref = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    if (chartRef.current) chartRef.current.destroy();

    const ctx = ref.current.getContext("2d");

    chartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Instalações", "Manutenções", "Retiradas"],
        datasets: [
          {
            data: [data.instalacoes, data.manutencoes, data.retiradas],
            backgroundColor: ["#16a34a", "#f59e0b", "#ef4444"], // verde, laranja, vermelho
            borderWidth: 3,
            borderColor: "#fff",
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "72%", // abertura interna levemente maior
        layout: {
          padding: { top: 10, bottom: 10, left: 10, right: 10 },
        },
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            align: "center",
            labels: {
              usePointStyle: true,
              pointStyle: "circle",
              boxWidth: 12,
              boxHeight: 12,
              color: "#374151",
              font: { size: 13 },
              padding: 18,
            },
          },
          tooltip: {
            backgroundColor: "rgba(0,0,0,0.85)",
            bodyFont: { size: 13 },
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.formattedValue}`,
            },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [data]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-[320px] bg-white rounded-xl shadow-md border border-gray-100 p-4">
      <div className="w-full h-[240px] flex justify-center items-center">
        <canvas ref={ref} className="max-w-[420px] max-h-[240px]" />
      </div>
    </div>
  );
}
