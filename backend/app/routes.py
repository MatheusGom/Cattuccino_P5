from flask import Blueprint, request, jsonify
from .models import *
from . import db
from sqlalchemy.sql import func
import pandas as pd
import numpy as np
import statsmodels.api as sm

usuarios_bp = Blueprint('usuarios_bp', __name__)


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

@usuarios_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email e senha são obrigatórios'}), 400

    usuario = Usuario.query.filter_by(EMAIL=email).first()

    if not usuario:
        return jsonify({'error': 'Usuário não encontrado'}), 404

    return jsonify({
        'message': 'Login bem-sucedido',
        'role': usuario.GERENCIA,  
        'user': usuario.serialize()
    }), 200


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

###### Analises ######

# Marketing
@marketing_bp.route('/marketing/revenue-by-day', methods=['GET'])
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

@marketing_bp.route('/marketing/distributions', methods=['GET'])
def distributions():
    result = (
        db.session.query(
            func.avg(Marketing.faturamento_diario).label('avg_faturamento_diario'),
            func.stddev(Marketing.faturamento_diario).label('std_faturamento_diario'),
            func.avg(Marketing.alcance_instagram).label('avg_alcance_instagram'),
            func.stddev(Marketing.alcance_instagram).label('std_alcance_instagram'),
            func.avg(Marketing.alcance_facebook).label('avg_alcance_facebook'),
            func.stddev(Marketing.alcance_facebook).label('std_alcance_facebook'),
            func.avg(Marketing.alcance_tiktok).label('avg_alcance_tiktok'),
            func.stddev(Marketing.alcance_tiktok).label('std_alcance_tiktok'),
            func.avg(Marketing.qtd_clientes).label('avg_qtd_clientes'),
            func.stddev(Marketing.qtd_clientes).label('std_qtd_clientes')
        )
        .all()
    )

    data = {
        'faturamento_diario': {
            'average': result[0].avg_faturamento_diario,
            'stddev': result[0].std_faturamento_diario
        },
        'alcance_instagram': {
            'average': result[0].avg_alcance_instagram,
            'stddev': result[0].std_alcance_instagram
        },
        'alcance_facebook': {
            'average': result[0].avg_alcance_facebook,
            'stddev': result[0].std_alcance_facebook
        },
        'alcance_tiktok': {
            'average': result[0].avg_alcance_tiktok,
            'stddev': result[0].std_alcance_tiktok
        },
        'qtd_clientes': {
            'average': result[0].avg_qtd_clientes,
            'stddev': result[0].std_qtd_clientes
        }
    }

    return jsonify(data)



# Financeiro
@financeiro_bp.route('/financial/top-suppliers', methods=['GET'])
def revenue_by_supplier():
    result = (
        db.session.query(
            Financeiro.nome_fornecedor.label('nome_fornecedor'),
            func.sum(Financeiro.faturamento_produto).label('total_faturamento')
        )
        .group_by(Financeiro.nome_fornecedor)
        .order_by(func.sum(Financeiro.faturamento_produto).desc())
        .limit(6)  # Seleciona os 6 maiores fornecedores em faturamento
        .all()
    )

    # Formatar os resultados em JSON
    data = [
        {
            'nome_fornecedor': row[0],  # Nome do fornecedor
            'total_faturamento': row[1]  # Faturamento total
        }
        for row in result
    ]

    # Retornar os dados no formato JSON
    return jsonify(data)

@financeiro_bp.route('/financial/profit-revenue-ratio', methods=['GET'])
def profit_revenue_ratio():
    result = (
        db.session.query(
            Financeiro.categoria_produto.label('categoria_produto'),
            func.sum(Financeiro.faturamento_produto).label('total_faturamento'),
            func.sum(Financeiro.lucro_produto).label('total_lucro')
        )
        .group_by(Financeiro.categoria_produto)
        .all()
    )

    # Calcular a relação lucro/faturamento e ordenar os resultados
    data = []
    for row in result:
        total_faturamento = row.total_faturamento or 0
        total_lucro = row.total_lucro or 0
        relacao = (total_lucro / total_faturamento * 100) if total_faturamento > 0 else 0
        data.append({
            'categoria_produto': row.categoria_produto,
            'relacao_lucro_faturamento': round(relacao, 2),
        })

    # Ordenar pela relação lucro/faturamento em ordem decrescente
    data.sort(key=lambda x: x['relacao_lucro_faturamento'], reverse=True)

    return jsonify(data)

@financeiro_bp.route('/financial/multiple-regression', methods=['GET'])
def multiple_regression():
    # Obter dados do banco de dados
    data = db.session.query(
        Financeiro.preco_unitario,
        Financeiro.lucro_produto,
        Financeiro.marca_produto,
        Financeiro.cnpj_fornecedor
    ).all()

    # Converter para DataFrame
    df = pd.DataFrame(data, columns=['preco_unitario', 'lucro_produto', 'marca_produto', 'cnpj_fornecedor'])

    # Limpeza dos dados
    df = df.dropna()
    df = df[(df['preco_unitario'] >= 0) & (df['lucro_produto'] >= 0)]

    # Criar variáveis dummy
    df_dummies = pd.get_dummies(df, columns=['marca_produto', 'cnpj_fornecedor'], drop_first=True)

    # Definir variáveis independentes (X) e dependente (y)
    X = df_dummies.drop(['lucro_produto'], axis=1)
    y = df_dummies['lucro_produto']

    # Adicionar constante
    X = sm.add_constant(X)

    # Ajustar modelo de regressão linear múltipla
    model = sm.OLS(y, X).fit()

    # Retornar resumo do modelo e dados principais
    coefficients = model.params.to_dict()
    return jsonify({
        'summary': model.summary().as_text(),
        'coefficients': coefficients,
        'data': {
            'preco_unitario': df['preco_unitario'].tolist(),
            'lucro_produto': df['lucro_produto'].tolist(),
            'marca_produto': df['marca_produto'].tolist()
        }
    })