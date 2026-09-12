# Animavia

A mindful web application designed to cultivate intentional daily rhythms. It pairs gentle habit tracking with emotional self-awareness, guided reflective journaling, and a dedicated gratitude practice—creating a safe space to pause, reflect, and grow at your own pace.

## Project structure
The project uses [Turborepo](https://turborepo.dev) to manage the monorepo. The directory structure includes:

### Apps and Services
- `apps/web`: Frontend | Next.js (App router), TailwindCSS, shadcnUI.
- `apps/backend`: Main API Server | NestJS
- `apps/email-service`: A service for sending emails | NestJS, Redis as pub/sub


## Prerequisites
- [NodeJS](https://nodejs.org/en/) (version >= 24.x)
- [yarn](https://classic.yarnpkg.com/en) (version 1.x)
- [Redis](https://redis.io/)
- [PostgreSQL](https://www.postgresql.org) (version 18)
