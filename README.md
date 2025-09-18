# Mercy Interns App - Full project

This archive contains a ready-to-run frontend and backend for Mercy Innovation Lab interns management.
- Frontend: React (in `frontend/`)
- Backend: Node/Express + Sequelize (Postgres) (in `backend/`)
- docker-compose.yml to run the whole stack locally.

Quick start:
1. Copy `.env.example` to `backend/.env` and adjust if necessary.
2. Run: `docker-compose up --build`
3. Frontend: http://localhost:3000
   Backend API: http://localhost:4000

Seeded admin (on first run):
- admin@mercylab.com / password123 (please change immediately)

CI/CD: Jenkinsfile provided as a starting point (customize `yourdockerhub` and `deploy@yourserver`).
