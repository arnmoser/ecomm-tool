import React, { useState } from 'react';
import { useGenerateEan } from '../hooks/useEan';
import axios from 'axios';

export default function EanTool() {
  const { mutateAsync, isPending, isError, error } = useGenerateEan();
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [prefixo, setPrefixo] = useState("");
  const [hasError, setHasError] = useState(false);
  const [multi, setMulti] = useState(false);
  const [quantity, setQuantity] = useState(1);


  async function handleGenerate() {
  setCopied(false);

  // limpa tudo antes de gerar novamente
  setCode(null);       
  setHasError(false);

  try {
    const result = await mutateAsync({
      prefixo,
      quantity: multi ? quantity : 1
    });
    
    console.log(result.codes);
    setCode(result.codes.join("\n"));
  } catch (err) {
    setHasError(true);
  }
}

  async function handleCopy() {
    if (!code) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        // fallback
        const el = document.createElement('textarea');
        el.value = code;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      // opcional: show toaster
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Gerador de EAN (GTIN-13)</h1>
      <input
        type="number"
        value={prefixo}
        onChange={(e) => setPrefixo(e.target.value)}
      />
      
      <div className="mb-4">
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={multi}
      onChange={(e) => setMulti(e.target.checked)}
    />
    <span>Gerar múltiplos códigos EAN</span>
  </label>

  {multi && (
    <div className="mt-2">
      <label className="block text-sm text-slate-600 mb-1">
        Quantidade:
      </label>
      <input
        type="number"
        min={1}
        max={500}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="border rounded p-2 w-full"
      />
    </div>
  )}
</div>
      
      <div className="flex gap-3">
        <button
          aria-label="Gerar Código EAN"
          onClick={handleGenerate}
          disabled={isPending}
          className="px-4 py-2 rounded bg-sky-600 text-white disabled:opacity-60"
        >
          {isPending ? 'Gerando...' : 'Gerar EAN'}
        </button>

        <button
          aria-label="Copiar código gerado"
          onClick={handleCopy}
          disabled={!code}
          className="px-3 py-2 rounded border disabled:opacity-40"
        >
          {copied ? 'Copiado!' : 'Copiar código gerado'}
        </button>
      </div>

      <section aria-live="polite" className="mt-6">
        <label className="block text-sm text-slate-600 mb-1">Código gerado:</label>
        <div
          role="status"
          aria-atomic="true"
          className="rounded border p-3 bg-gray-50 min-h-[48px] flex items-center"
        >
       {isPending ? (
        <span>Gerando...</span>
      ) : hasError ? (
       <span className="text-red-600">{error?.message}</span>
        ) : code ? (
        <code className="font-mono text-lg">{code}</code>
        ) : (
         <span className="text-slate-500">Nenhum código gerado ainda.</span>
        )}

        </div>
      </section>
    </main>
  );
}
