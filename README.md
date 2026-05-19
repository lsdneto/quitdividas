# QuitDívidas

Aplicação full stack para gestão de quitação de dívidas.

## Stack
- Frontend: React + TypeScript + Tailwind + Context API
- Backend: Node.js + Express + TypeScript + TypeORM + JWT
- Banco: PostgreSQL

## Estrutura
```bash
quitdividas/
├── frontend/
├── backend/
├── docker-compose.yml
├── .env.example
└── README.md
```

## Como executar
1. Copie variáveis de ambiente:
   - `cp .env.example backend/.env`
   - `cp .env.example frontend/.env`
2. Backend:
   - `cd backend`
   - `npm install`
   - `npm run dev`
3. Frontend:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

## Endpoints principais
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET/POST/PUT/DELETE /api/devedores`
- `GET/POST/PUT/DELETE /api/dividas`
- `GET/POST/PUT/DELETE /api/pagamentos`
- `GET /api/dashboard`
- `GET /api/relatorios`
