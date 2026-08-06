# Startups_Blogs Workspace Rules

## 1. Documentation & References
Before making any significant changes or architectural decisions, you **MUST** consult the relevant markdown (`.md`) files in the `docs/` directory. This is the source of truth for the project:
- **Database & Data**: `docs/DATABASE_SCHEMA.md`, `docs/DATABASE_DECISION.md`
- **Architecture**: `docs/FRONTEND_ARCHITECTURE.md`, `docs/BACKEND_ARCHITECTURE.md`, `docs/SYSTEM_ARCHITECTURE.md`, `docs/AWS_ARCHITECTURE.md`
- **APIs**: `docs/API_DESIGN.md`, `docs/API_LIST.md`
- **Workflows & Git**: `docs/GIT_WORKFLOW.md`
- **Project Context**: `docs/BUSINESS_CONTEXT_AND_FLOWS.md`, `docs/USER_STORIES.md`, `docs/PROJECT_BRIEF.md`
- **Status**: `docs/IMPLEMENTATION_STATUS.md`

## 2. Business Logic Consistency
- Ensure strict adherence to predefined constraints (e.g., standard business stages: `Idea`, `Early Stage`, `Operating`, `Growing`, `Expansion`, `Mature`). Do not invent ad-hoc statuses or enum values not defined in the schema or standard data models.

## 3. Technology Stack
- **Frontend**: React (Vite), TypeScript, CSS Modules. Prioritize modern, clean, and dynamic UIs.
- **Backend**: NestJS, TypeScript, Prisma (PostgreSQL). Maintain strict Controller -> Service architecture and use explicit DTOs.
