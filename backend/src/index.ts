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
  const { prefixo, quantity = 1} = req.body ?? {};


  const codes = [];
  for (let i = 0; i < quantity; i++) {
    if(prefixo && prefixo.length > 0) {
      codes.push(generateEAN13(prefixo));
      console.log("rodou1");
    }
    else {
      codes.push(generateRandomEAN());
         console.log("rodou2");
    }
  }
  res.json({ codes });
});