import React, { useState } from "react";

// Define o tipo do resultado que o backend retorna
interface MelimcResult {
  mcabs: number;
  mcperc: number;
  tributetaxValue: number;
  percentagetaxValue: number;
}

export default function Calculator() {
  // Estados para os inputs do usuário
  const [prodcost, setProdcost] = useState<number | "">("");
  const [tributetax, setTributetax] = useState<number | "">("");
  const [percentagetax, setPercentagetax] = useState<number | "">("");
  const [fixtax, setFixtax] = useState<number | "">("");
  const [saleprice, setSaleprice] = useState<number | "">("");

  // Estado para o resultado
  const [result, setResult] = useState<MelimcResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função que envia os dados para o backend
  const handleCalculate = async () => {
    setError(null);
    setLoading(true);

    // Validação mínima
    if (
      prodcost === "" ||
      tributetax === "" ||
      percentagetax === "" ||
      fixtax === "" ||
      saleprice === ""
    ) {
      setError("Preencha todos os campos.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        prodcost: Number(prodcost),
        tributetax: Number(tributetax),
        percentagetax: Number(percentagetax),
        fixtax: Number(fixtax),
        saleprice: Number(saleprice),
      };

      const response = await fetch("/api/calc/melimc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao calcular margem");
      }

      const data: MelimcResult = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Calculadora de Margem</h1>

      <label>Preço de Custo:</label>
      <input
        type="number"
        value={prodcost}
        onChange={(e) => setProdcost(e.target.value === "" ? "" : Number(e.target.value))}
      />

      <label>Tributo (%):</label>
      <input
        type="number"
        value={tributetax}
        onChange={(e) => setTributetax(e.target.value === "" ? "" : Number(e.target.value))}
      />

      <label>Taxa (%):</label>
      <input
        type="number"
        value={percentagetax}
        onChange={(e) => setPercentagetax(e.target.value === "" ? "" : Number(e.target.value))}
      />

      <label>Taxa Fixa:</label>
      <input
        type="number"
        value={fixtax}
        onChange={(e) => setFixtax(e.target.value === "" ? "" : Number(e.target.value))}
      />

      <label>Preço de Venda:</label>
      <input
        type="number"
        value={saleprice}
        onChange={(e) => setSaleprice(e.target.value === "" ? "" : Number(e.target.value))}
      />

      <button onClick={handleCalculate} disabled={loading} style={{ marginTop: 10 }}>
        {loading ? "Calculando..." : "Calcular"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 20 }}>
          <p>Margem Absoluta: {result.mcabs.toFixed(2)}</p>
          <p>Margem Percentual: {result.mcperc.toFixed(2)}%</p>
          <p>Valor do Tributo: {result.tributetaxValue.toFixed(2)}</p>
          <p>Valor da Taxa (%): {result.percentagetaxValue.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}
