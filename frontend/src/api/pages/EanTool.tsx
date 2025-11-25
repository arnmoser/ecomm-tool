import React, { useState } from 'react';
import { useGenerateEan } from '../hooks/useEan';

export default function EanTool() {
  const { mutateAsync, isPending, isError, error } = useGenerateEan();
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setCopied(false);
    try {
      // se quiser passar prefix/quantity: mutateAsync({ prefix, quantity: 1 })
      const result = await mutateAsync(undefined);
      const first = result.codes?.[0] ?? null;
      setCode(first);
    } catch (err) {
      setCode(null);
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

      <div className="flex gap-3">
        <button
          aria-label="Gerar EAN aleatório"
          onClick={handleGenerate}
          disabled={isPending}
          className="px-4 py-2 rounded bg-sky-600 text-white disabled:opacity-60"
        >
          {isPending ? 'Gerando...' : 'Gerar EAN aleatório'}
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
        <label className="block text-sm text-slate-600 mb-1">Código gerado</label>
        <div
          role="status"
          aria-atomic="true"
          className="rounded border p-3 bg-gray-50 min-h-[48px] flex items-center"
        >
          {isPending ? (
            <span>Gerando...</span>
          ) : code ? (
            <code className="font-mono text-lg">{code}</code>
          ) : isError ? (
            <span className="text-red-600">Erro: {error?.message ?? 'Não foi possível gerar'}</span>
          ) : (
            <span className="text-slate-500">Nenhum código gerado ainda.</span>
          )}
        </div>
      </section>
    </main>
  );
}
