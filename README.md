# Azure Function - RotaCerta

## Alunos

- Ícaro Rayff de Souza
- Armando de Souza Stein

Função HTTP responsável por cálculos auxiliares de rota, como distância aproximada, duração estimada, ordenação de paradas e score da rota.

## Descrição da arquitetura

A Azure Function separa a regra de cálculo da camada HTTP:

- `domain`: função pura de cálculo de rota.
- `application`: use case que executa o cálculo.
- `functions`: entrada HTTP no modelo oficial de Azure Functions v4.
- `local-server.ts`: servidor Express usado apenas para facilitar execução local.

Fluxo principal:

```txt
BFF -> Azure Function HTTP Trigger -> cálculo auxiliar de rota
```

O BFF chama esta função ao montar dados agregados e ao criar uma rota calculada a partir dos pedidos pendentes.

## Tecnologias utilizadas

- Node.js
- TypeScript
- Azure Functions v4
- Express para execução local
- Vitest
- dotenv

## Como rodar localmente

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente:

```env
PORT=7071
MAPS_PROVIDER=local
MAPS_API_KEY=
```

Inicie o servidor local:

```bash
npm run dev
```

Endpoint local:

```http
POST http://localhost:7071/api/calculate-route
```

Payload de exemplo:

```json
{
  "origin": { "latitude": -25.4515, "longitude": -49.2525 },
  "stops": [
    { "latitude": -25.4386, "longitude": -49.2707, "priority": "HIGH" }
  ]
}
```

O arquivo `src/functions/calculate-route.ts` usa o modelo oficial de Azure Functions v4. O arquivo `src/local-server.ts` existe apenas para desenvolvimento local.

Para rodar os testes:

```bash
npm test
```
