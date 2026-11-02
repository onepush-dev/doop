# Doop on Railway: upstream's own repo-root Dockerfile (kgoedecke/doop @ a3749d9, v0.12.0),
# built first as doop-upstream:local by the workflow, plus a start wrapper that
# waits for Postgres so first-boot migrations never race the database.
ARG BASE=doop-upstream:local
FROM ${BASE}
LABEL org.opencontainers.image.source="https://github.com/onepush-dev/doop" \
      org.opencontainers.image.licenses="AGPL-3.0-only"
COPY --chmod=755 railway/railway-start.mjs /app/railway-start.mjs
ENV NODE_ENV=production \
    PORT=4400 \
    DOOP_RAILWAY_DB_WAIT_SECONDS=180
CMD ["node", "/app/railway-start.mjs"]
