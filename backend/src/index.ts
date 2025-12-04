import express from 'express';
import dotenv from 'dotenv';
import { generateEAN13, calculateEANCheckDigit, generateRandomEAN} from './eanlogic';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`server listening on ${port}`));

app.post('/generate-ean', (req, res) => {
  try {
    const { prefixo, quantity = 1 } = req.body ?? {};

    // validação de prefixo longo
    if (prefixo && prefixo.length > 12) {
      return res.status(400).json({
        error: 'Erro: O prefixo deve ter no máximo 12 dígitos.'
      });
    }

    const codes = [];

    for (let i = 0; i < quantity; i++) {
      if (prefixo && prefixo.length > 0) {
        codes.push(generateEAN13(prefixo));
      } else {
        codes.push(generateRandomEAN());
      }
    }

    return res.json({ codes });

  } catch (err: any) {
    console.error('Erro no backend:', err.message);

    return res.status(500).json({
      error: 'Erro interno ao gerar EAN.'
    });
  }
});
