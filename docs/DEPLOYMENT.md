# HRFlow AI — Production Deployment Guide

This document covers dockerizing the HRFlow AI platform, managing services, running database migrations, and configuring backup/restore policies.

## 1. Container Topology

The production setup uses five main services:
1. **Frontend**: Next.js App server serving endpoints and SSR screens.
2. **Backend / Worker**: Node.js/Python task runner for executing background processes (email sends, vector syncs).
3. **Database**: PostgreSQL 14+ instance for relational transactions and logs.
4. **Redis**: Cache and message queue for jobs.
5. **Vector/Search (Optional)**: Vector database (pgvector extension inside Postgres, or standalone vector DB) for policy embeddings.

---

## 2. Docker Setup

### Building Services
To build all docker containers for production release:
```bash
docker-compose -f infrastructure/docker-compose.yml build
```

### Running Services
To run containers in the background:
```bash
docker-compose -f infrastructure/docker-compose.yml up -d
```

### Checking Health & Readiness
Each container implements healthchecks:
```bash
# Verify database accessibility
docker exec -it hrflow-postgres pg_isready -U postgres

# Check Next.js app status
curl -f http://localhost:3000/api/health
```

---

## 3. Database Management

### Migrations
On startup, the migration runner applies SQL scripts to PostgreSQL. To run migrations manually:
```bash
# Execute schemas migrations inside postgres container
docker exec -i hrflow-postgres psql -U postgres -d hrflow_db < database/schemas/schema.sql
```

### Seeding Sandbox for Testing
To apply sample sandbox data:
```bash
docker exec -i hrflow-postgres psql -U postgres -d hrflow_db < database/seeds/seed.sql
```

---

## 4. Backup & Restore Operations

### Backup Strategy
Perform logical daily backups of the database:
```bash
# Dump postgres database to file
docker exec -t hrflow-postgres pg_dumpall -c -U postgres > backups/dump_$(date +%Y-%m-%d_%H%M%S).sql
```

### Restore Strategy
To restore the database from a backup file:
```bash
# Restore schema and records
docker exec -i hrflow-postgres psql -U postgres -d hrflow_db < backups/dump_file.sql
```
