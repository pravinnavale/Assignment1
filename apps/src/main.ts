import express from 'express';
import bodyParser from "body-parser";
import { routes } from './router';

const app = express();

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

export let simulatedDay = 0;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.status(503).setTimeout(3000);
  simulatedDay = Number(req.headers['simulated-day']);
  next();
});

routes(app);

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
