from . import db

class Usuario(db.Model):
    __tablename__ = 'Usuario'
    ID = db.Column(db.Integer, primary_key=True)
    NOME = db.Column(db.String(200))
    EMAIL = db.Column(db.String(200))
    SENHA = db.Column(db.String(100))
    IDADE = db.Column(db.Integer)
    LOCALIZACAO = db.Column(db.String(250))
    TIPO_SANGUINEO = db.Column(db.String(5))
    FORMACAO = db.Column(db.String(100))
    DT_NASCIMENTO = db.Column(db.Date)
    COR = db.Column(db.String(50))
    GENERO = db.Column(db.String(50))
    DT_ADMISSAO = db.Column(db.Date)
    EXTROVERTID = db.Column(db.Integer)
    CRIATIV = db.Column(db.Integer)
    OCUPAD = db.Column(db.Integer)
    ORGANIZAD = db.Column(db.Integer)
    TRANQUIL = db.Column(db.Integer)
    GERENCIA = db.Column(db.Integer)

    def serialize(self):
        return {
            'ID': self.ID,
            'NOME': self.NOME,
            'EMAIL': self.EMAIL,
            'SENHA': self.SENHA,
            'IDADE': self.IDADE,
            'LOCALIZACAO': self.LOCALIZACAO,
            'TIPO_SANGUINEO': self.TIPO_SANGUINEO,
            'FORMACAO': self.FORMACAO,
            'DT_NASCIMENTO': self.DT_NASCIMENTO.isoformat(),
            'COR': self.COR,
            'GENERO': self.GENERO,
            'DT_ADMISSAO': self.DT_ADMISSAO.isoformat(),
            'EXTROVERTID': self.EXTROVERTID,
            'CRIATIV': self.CRIATIV,
            'OCUPAD': self.OCUPAD,
            'ORGANIZAD': self.ORGANIZAD,
            'TRANQUIL': self.TRANQUIL,
            'GERENCIA': self.GERENCIA
        }
