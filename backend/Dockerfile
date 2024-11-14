# Dockerfile
FROM python:3.8

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Certifique-se de que o script está no diretório /app e tenha permissão de execução
RUN chmod +x /app/wait-for-it.sh

# Modifique o CMD para usar o script de espera
CMD ["./wait-for-it.sh", "db:3306", "--", "flask", "run", "--host=0.0.0.0"]
