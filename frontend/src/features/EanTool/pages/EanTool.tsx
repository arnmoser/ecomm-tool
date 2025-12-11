import React, { useState } from "react";
import { useGenerateEan } from "../hooks/useEan";
import "./eantool.css";

export default function EanTool() {
  const { mutateAsync, isPending, error } = useGenerateEan();

  const [prefixo, setPrefixo] = useState("");
  const [multi, setMulti] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const [code, setCode] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setCopied(false);
    setCode(null);
    setHasError(false);

    try {
      const result = await mutateAsync({
        prefixo,
        quantity: multi ? quantity : 1,
      });

      setCode(result.codes.join("\n"));
    } catch {
      setHasError(true);
    }
  }

  async function handleCopy() {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 flex items-center justify-center p-6">
      <div className="ean-wrapper">
        <div className="ean-card">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">
          Gerador de EAN (GTIN-13)
        </h1>

        {/* PREFIX INPUT */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-semibold text-slate-700">
            Prefixo (opcional)
          </label>

          <input
            type="number"
            value={prefixo}
            onChange={(e) => setPrefixo(e.target.value)}
            placeholder="Ex: 789"
            className="
              w-full rounded-xl border border-slate-300 bg-slate-50 
              p-3 shadow-sm
              text-slate-800
              focus:outline-none focus:ring-2 focus:ring-sky-500
            "
          />
        </div>

        {/* MULTIPLE CHECKBOX */}
        <div className="mb-8">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={multi}
              onChange={(e) => setMulti(e.target.checked)}
              className="w-4 h-4 accent-sky-600"
            />
            <span className="text-slate-700 text-sm font-medium">
              Gerar múltiplos códigos
            </span>
          </label>

          {multi && (
            <div className="mt-4">
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Quantidade
              </label>

              <input
                type="number"
                min={1}
                max={500}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="
                  w-full rounded-xl border border-slate-300 bg-slate-50
                  p-3 shadow-sm
                  text-slate-800
                  focus:outline-none focus:ring-2 focus:ring-sky-500
                "
              />
            </div>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={handleGenerate}
            disabled={isPending}
            className="
              flex-1 px-5 py-3 rounded-xl bg-sky-600 text-white
              font-semibold shadow-md transition
              hover:bg-sky-700 active:scale-[0.98]
              disabled:opacity-50
            "
          >
            {isPending ? "Gerando..." : "Gerar EAN"}
          </button>

          <button
            onClick={handleCopy}
            disabled={!code}
            className="
              px-5 py-3 rounded-xl border border-slate-400 text-slate-700
              font-semibold shadow-sm transition
              hover:bg-slate-100 active:scale-[0.98]
              disabled:opacity-40
            "
          >
            {copied ? "Copiado!" : "Copiar"}
          </button>
        </div>

        {/* RESULT */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-slate-700">
            Resultado
          </label>

          <div
            className="
              bg-slate-50 border border-slate-300 rounded-xl p-4 
              min-h-[120px] whitespace-pre-line
              text-slate-900 font-mono shadow-inner
            "
          >
            {isPending && "Gerando..."}

            {hasError && (
              <span className="text-red-600">
                {error?.message || "Erro ao gerar código."}
              </span>
            )}

            {!isPending && !hasError && code && code}

            {!isPending && !hasError && !code && (
              <span className="text-slate-500">Nenhum código gerado.</span>
            )}
          </div>
        </div>
      </div>
     </div> 
    </main>
  );
}
