// src/index.ts
import { createServer } from "./server.ts";

const app = createServer();
await app.listen({ port: 3000, host: '0.0.0.0' });
console.log("Agente RotaFácil rodando em http://localhost:3000");