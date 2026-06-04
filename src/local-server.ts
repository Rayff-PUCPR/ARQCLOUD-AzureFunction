import 'dotenv/config';
import express from 'express';
import { CalculateRouteUseCase } from './application/calculate-route.use-case';

const app = express();
const calculateRouteUseCase = new CalculateRouteUseCase();
app.use(express.json());

app.get('/health', (_request, response) => {
  response.json({
    service: 'azure-function-local',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/calculate-route', (request, response) => {
  try {
    response.json(calculateRouteUseCase.execute(request.body));
  } catch (error) {
    response.status(400).json({
      message: 'Invalid route calculation payload',
      detail: (error as Error).message
    });
  }
});

const port = Number(process.env.PORT ?? 7071);
app.listen(port, () => {
  console.log(`Azure Function local server running on http://localhost:${port}`);
});
