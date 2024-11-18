from flask import Blueprint, request, jsonify
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


class Financeiro(db.Model):
    __tablename__ = 'Financeiro'
    id_transacao = db.Column(db.Integer, primary_key=True, autoincrement=True)
    data_transacao = db.Column(db.String(255))
    preco_unitario = db.Column(db.Float)
    qtd_comprada = db.Column(db.Integer)
    preco_total = db.Column(db.Float)
    nome_produto = db.Column(db.String(255))
    marca_produto = db.Column(db.String(255))
    categoria_produto = db.Column(db.String(255))
    descricao_produto = db.Column(db.String(255))
    faturamento_produto = db.Column(db.Float)
    lucro_produto = db.Column(db.Float)
    cnpj_fornecedor = db.Column(db.String(255))
    nome_fornecedor = db.Column(db.String(255))

    def serialize(self):
        return {
            'id_transacao': self.id_transacao,
            'data_transacao': self.data_transacao,
            'preco_unitario': self.preco_unitario,
            'qtd_comprada': self.qtd_comprada,
            'preco_total': self.preco_total,
            'nome_produto': self.nome_produto,
            'marca_produto': self.marca_produto,
            'categoria_produto': self.categoria_produto,
            'descricao_produto': self.descricao_produto,
            'faturamento_produto': self.faturamento_produto,
            'lucro_produto': self.lucro_produto,
            'cnpj_fornecedor': self.cnpj_fornecedor,
            'nome_fornecedor': self.nome_fornecedor,
        }


class Marketing(db.Model):
    __tablename__ = 'Marketing'
    data_id = db.Column(db.Date, primary_key=True)
    dia_semana = db.Column(db.String(255))
    horario_pico = db.Column(db.String(255))
    gatos_adotados = db.Column(db.Integer)
    faturamento_diario = db.Column(db.Float)
    alcance_instagram = db.Column(db.Integer)
    alcance_facebook = db.Column(db.Integer)
    alcance_tiktok = db.Column(db.Integer)
    idade_instagram = db.Column(db.String(255))
    idade_facebook = db.Column(db.String(255))
    idade_tiktok = db.Column(db.String(255))
    qtd_clientes = db.Column(db.Integer)
    maioria_sexo = db.Column(db.String(255))

    def serialize(self):
        return {
            'data_id': self.data_id.isoformat(),
            'dia_semana': self.dia_semana,
            'horario_pico': self.horario_pico,
            'gatos_adotados': self.gatos_adotados,
            'faturamento_diario': self.faturamento_diario,
            'alcance_instagram': self.alcance_instagram,
            'alcance_facebook': self.alcance_facebook,
            'alcance_tiktok': self.alcance_tiktok,
            'idade_instagram': self.idade_instagram,
            'idade_facebook': self.idade_facebook,
            'idade_tiktok': self.idade_tiktok,
            'qtd_clientes': self.qtd_clientes,
            'maioria_sexo': self.maioria_sexo,
        }
