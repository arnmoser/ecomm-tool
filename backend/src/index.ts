import express from 'express';
import dotenv from 'dotenv';
import { generateEAN13, calculateEANCheckDigit } from './eanlogic';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`server listening on ${port}`));

