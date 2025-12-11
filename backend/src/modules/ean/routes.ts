import { Router } from "express";
import { generateEAN13, generateRandomEAN } from "./logic";

const router = Router();

const MAX_QTY = 200;

router.post("/generate", (req, res) => {
  try {
    const { prefixo, quantity = 1 } = req.body ?? {};

    const prefix = (prefixo ?? "").toString().trim();

    if (quantity > MAX_QTY) {
      return res.status(400).json({
        error: `Quantidade máxima permitida é ${MAX_QTY}.`
      });
    }

    if (prefix && prefix.length > 12) {
      return res.status(400).json({
        error: 'O prefixo deve ter no máximo 12 dígitos.'
      });
    }

    const codes = [];

    for (let i = 0; i < quantity; i++) {
      if (prefix && prefix.length > 0) {
        codes.push(generateEAN13(prefix));
      } else {
        codes.push(generateRandomEAN());
      }
    }

    return res.json({ codes });

  } catch (err: any) {
    console.error('Erro no backend:', err.message);
    return res.status(500).json({ error: 'Erro interno ao gerar EAN.' });
  }
});

export default router;
