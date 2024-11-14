#!/bin/sh
# wait-for-it.sh
host="$1"
port="$2"
shift 2
cmd="$@"

while ! nc -z "$host" "$port"; do
  echo "Aguardando o banco de dados MySQL iniciar em $host:$port..."
  sleep 1
done

echo "Banco de dados MySQL está pronto - executando comando"
exec $cmd
