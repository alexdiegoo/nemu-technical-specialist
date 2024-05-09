import express, { Request, Response } from 'express';
import { NemuWorker } from './workers/NemuWorker';
import { ProductJsonRepository } from './repositories/ProductDataRepository';

const productData = new ProductJsonRepository("./productData.json");

const app = express();
const port = 3000;

app.use(express.json()); 

app.post('/webhooks', (req: Request, res: Response) => {
  console.log(req.body)
  const { payload } = req.body;
  if (!payload) {
    return res.status(500).send();
  }

  const nemuWorker = new NemuWorker(productData);
  nemuWorker.process({ payload });

  res.status(200).send('Received'); 
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
