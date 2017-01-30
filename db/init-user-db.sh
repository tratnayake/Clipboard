#! /bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER clipboard_docker WITH PASSWORD '$POSTGRES_PASSWORD';
    CREATE DATABASE clipboard_docker;
    GRANT ALL PRIVILEGES ON DATABASE clipboard_docker TO clipboard_docker;
EOSQL
