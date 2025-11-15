import React from "react";
import InfoCard from "./InfoCard";

export default function Feedback({ sums }) {
  return (
    <section className="lg:col-span-1">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
        <span className="text-2xl mr-2">⭐</span> Feedback
      </h2>
      <div className="grid grid-cols-1 gap-6">
        <InfoCard title="Feedbacks Recebidos" value={sums.feedbacks} tone="yellow" textColor="gray" fontSize="5xl" className="p-6 text-center" />
      </div>
    </section>
  );
}