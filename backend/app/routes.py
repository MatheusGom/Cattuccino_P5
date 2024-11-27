from flask import Blueprint, request, jsonify
from .models import *
from . import db
from sqlalchemy.sql import func


usuarios_bp = Blueprint('usuarios_bp', __name__)

@usuarios_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('EMAIL')
    senha = data.get('SENHA')

    if not email or not senha:
        return jsonify({'message': 'Email e senha são obrigatórios'}), 400

    usuario = Usuario.query.filter_by(EMAIL=email, SENHA=senha).first()
    
    if usuario:
        return jsonify({
            'message': 'Login realizado com sucesso!', 
            'user_id': usuario.ID,
            'GERENCIA': usuario.GERENCIA
        }), 200
    else:
        return jsonify({'message': 'Credenciais inválidas, tente novamente'}), 401


@usuarios_bp.route('/usuarios', methods=['POST'])
def create_usuario():
    data = request.get_json()
    usuario = Usuario(**data)
    db.session.add(usuario)
    db.session.commit()
    return jsonify({'message': 'Usuário criado com sucesso!'}), 201


@usuarios_bp.route('/usuarios', methods=['GET'])
def get_usuarios():
    usuarios = Usuario.query.all()
    return jsonify([usuario.serialize() for usuario in usuarios])


@usuarios_bp.route('/usuarios/<int:id>', methods=['GET'])
def get_usuario(id):
    usuario = Usuario.query.get_or_404(id)
    return jsonify(usuario.serialize())


@usuarios_bp.route('/usuarios/<int:id>', methods=['PUT'])
def update_usuario(id):
    usuario = Usuario.query.get_or_404(id)
    data = request.get_json()
    for key, value in data.items():
        setattr(usuario, key, value)
    db.session.commit()
    return jsonify({'message': 'Usuário atualizado com sucesso!'})


@usuarios_bp.route('/usuarios/<int:id>', methods=['DELETE'])
def delete_usuario(id):
    usuario = Usuario.query.get_or_404(id)
    db.session.delete(usuario)
    db.session.commit()
    return jsonify({'message': 'Usuário deletado com sucesso!'})


financeiro_bp = Blueprint('financeiro_bp', __name__)


@financeiro_bp.route('/financeiro', methods=['POST'])
def create_financeiro():
    data = request.get_json()
    financeiro = Financeiro(**data)
    db.session.add(financeiro)
    db.session.commit()
    return jsonify({'message': 'Transação financeira criada com sucesso!'}), 201


@financeiro_bp.route('/financeiro', methods=['GET'])
def get_financeiros():
    financeiros = Financeiro.query.all()
    return jsonify([financeiro.serialize() for financeiro in financeiros])


@financeiro_bp.route('/financeiro/<int:id>', methods=['GET'])
def get_financeiro(id):
    financeiro = Financeiro.query.get_or_404(id)
    return jsonify(financeiro.serialize())


@financeiro_bp.route('/financeiro/<int:id>', methods=['PUT'])
def update_financeiro(id):
    financeiro = Financeiro.query.get_or_404(id)
    data = request.get_json()
    for key, value in data.items():
        setattr(financeiro, key, value)
    db.session.commit()
    return jsonify({'message': 'Transação financeira atualizada com sucesso!'})


@financeiro_bp.route('/financeiro/<int:id>', methods=['DELETE'])
def delete_financeiro(id):
    financeiro = Financeiro.query.get_or_404(id)
    db.session.delete(financeiro)
    db.session.commit()
    return jsonify({'message': 'Transação financeira deletada com sucesso!'})


marketing_bp = Blueprint('marketing_bp', __name__)


@marketing_bp.route('/marketing', methods=['POST'])
def create_marketing():
    data = request.get_json()
    marketing = Marketing(**data)
    db.session.add(marketing)
    db.session.commit()
    return jsonify({'message': 'Dados de marketing criados com sucesso!'}), 201


@marketing_bp.route('/marketing', methods=['GET'])
def get_marketings():
    marketings = Marketing.query.all()
    return jsonify([marketing.serialize() for marketing in marketings])


@marketing_bp.route('/marketing/<data_id>', methods=['GET'])
def get_marketing(data_id):
    marketing = Marketing.query.get_or_404(data_id)
    return jsonify(marketing.serialize())


@marketing_bp.route('/marketing/<data_id>', methods=['PUT'])
def update_marketing(data_id):
    marketing = Marketing.query.get_or_404(data_id)
    data = request.get_json()
    for key, value in data.items():
        setattr(marketing, key, value)
    db.session.commit()
    return jsonify({'message': 'Dados de marketing atualizados com sucesso!'})


@marketing_bp.route('/marketing/<data_id>', methods=['DELETE'])
def delete_marketing(data_id):
    marketing = Marketing.query.get_or_404(data_id)
    db.session.delete(marketing)
    db.session.commit()
    return jsonify({'message': 'Dados de marketing deletados com sucesso!'})

@marketing_bp.route('/revenue-by-day', methods=['GET'])
def revenue_by_day():

    result = (
        db.session.query(
            func.lower(Marketing.dia_semana).label('dia_semana'),
            func.sum(Marketing.faturamento_diario).label('total_faturamento')
        )
        .group_by(func.lower(Marketing.dia_semana))
        .all()
    )


    # Formatar os resultados em JSON
    data = [
        {
            'dia_semana': row[0],  # Dias da semana permanecem em português
            'total_faturamento': row[1]
        }
        for row in result
    ]

    # Retornar os dados no formato JSON
    return jsonify(data)
