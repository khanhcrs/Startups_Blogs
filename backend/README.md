# Startups Blogs Backend

NestJS modular-monolith REST API scaffold for Startups Blogs. See `../docs/BACKEND_ARCHITECTURE.md` for the architecture and module boundaries.

## Local setup

Requires Node.js 20.19+ and Docker.

```bash
cp .env.example .env
npm install
docker compose up -d postgres
npm run prisma:generate
npm run prisma:migrate:dev -- --name init
npm run prisma:seed
npm run dev
```

API: `http://localhost:3000/api/v1`

Swagger (non-production): `http://localhost:3000/api/v1/docs`

Health: `/api/v1/health/live` and `/api/v1/health/ready`

Implemented foundation and initial public APIs: identity sync, current user, taxonomies, businesses, funding opportunities, investors, News and Blogs. Remaining P0/P1 modules are registered as explicit extension points.
