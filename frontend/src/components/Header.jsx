import React, { useEffect, useMemo, useState, useRef } from "react";
import logo from "../assets/logo-autoelite.png";

export default function Header({ selectedMes, meses, onMesChange }) {
  const [search, setSearch] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [pulse, setPulse] = useState(false);
  const inputRef = useRef(null);

  // meses ordenados (mais recentes primeiro)
  const sortedMeses = useMemo(() => {
    const arr = [...(meses || [])];
    return arr.sort((a, b) => {
      const [ma, aa] = a.split("/").map(Number);
      const [mb, ab] = b.split("/").map(Number);
      if (aa !== ab) return ab - aa;
      return mb - ma;
    });
  }, [meses]);

  // define mês atual apenas uma vez no carregamento
  useEffect(() => {
    if (!sortedMeses.length || initialized) return;
    const now = new Date();
    const mesAtual = `${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
    if (sortedMeses.includes(mesAtual)) onMesChange(mesAtual);
    else onMesChange(sortedMeses[0]);
    setInitialized(true);
  }, [sortedMeses, initialized, onMesChange]);

  // lista filtrada durante digitação
  const filteredMeses = useMemo(() => {
    if (!isEditing) return [];
    const s = search.trim().toLowerCase();
    if (!s) return sortedMeses;
    return sortedMeses.filter((m) => m.toLowerCase().includes(s));
  }, [isEditing, search, sortedMeses]);

  // valor exibido no input
  const inputValue = isEditing ? search : (selectedMes || "");

  return (
    <header className="w-full bg-white shadow-sm rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Auto Elite" className="h-10 w-10 object-contain" />
        <h1 className="text-2xl font-semibold text-gray-700">
          Dashboard - <span className="text-emerald-600">Auto Elite</span>
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 mt-3 sm:mt-0 relative">
        <span className="text-sm text-gray-600">Período:</span>

        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => {
              setIsEditing(true);
              setSearch("");
            }}
            onBlur={() => {
              setTimeout(() => {
                setIsEditing(false);
                setSearch("");
              }, 120);
            }}
            placeholder="Buscar mês..."
            className={`border border-gray-300 rounded-md px-2 py-1 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 ${
              pulse ? "ring-2 ring-emerald-400" : ""
            }`}
          />

          {/* Dropdown */}
          {isEditing && (
            <ul className="absolute z-10 bg-white border border-gray-200 rounded-md mt-1 shadow-md max-h-40 overflow-y-auto w-full">
              {filteredMeses.length ? (
                filteredMeses.map((m) => (
                  <li
                    key={m}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onMesChange(m);
                      setIsEditing(false);
                      setSearch("");
                      inputRef.current?.blur(); // desfoca (simula tab)
                      setPulse(true); // ativa highlight
                      setTimeout(() => setPulse(false), 500); // remove após 0.5s
                    }}
                    className={`px-2 py-1 cursor-pointer hover:bg-emerald-50 text-sm ${
                      selectedMes === m ? "bg-emerald-100 font-medium" : ""
                    }`}
                  >
                    {m}
                  </li>
                ))
              ) : (
                <li className="px-2 py-1 text-gray-400 text-sm">
                  Nenhum mês encontrado
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
