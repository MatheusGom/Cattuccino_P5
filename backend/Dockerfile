# Dockerfile
FROM python:3.8

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

# Copie o restante do backend
COPY . /app

# Iniciar o servidor Flask diretamente
CMD ["flask", "run", "--host=0.0.0.0"]
