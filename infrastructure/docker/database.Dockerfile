# Custom PostgreSQL Dockerfile with pgvector extension enabled
FROM postgres:14-alpine

# Install build dependencies, download pgvector, compile it, and clean up
RUN apk add --no-cache --virtual .build-deps \
    git \
    make \
    gcc \
    clang15-dev \
    musl-dev \
    llvm15-dev \
    && cd /tmp \
    && git clone --branch v0.4.4 https://github.com/pgvector/pgvector.git \
    && cd pgvector \
    && make \
    && make install \
    && apk del .build-deps \
    && rm -rf /tmp/pgvector

EXPOSE 5432
