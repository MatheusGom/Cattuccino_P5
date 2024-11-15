import time
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)



    max_retries = 10  # Número máximo de tentativas
    retry_interval = 5  # Intervalo de tempo entre as tentativas (em segundos)
    connected = False
    attempt = 0

    while not connected and attempt < max_retries:
        try:
            db.init_app(app)
            with app.app_context():
                db.create_all()
            connected = True
            print("Conexão com o banco de dados estabelecida com sucesso.")
        except Exception as e:
            attempt += 1
            print(f"Tentativa {attempt}/{max_retries} - Aguardando o banco de dados MySQL... Erro:", e)
            time.sleep(retry_interval)

    if not connected:
        raise Exception("Não foi possível conectar ao banco de dados após várias tentativas.")

    with app.app_context():
        from . import routes

    return app
