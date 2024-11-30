from flask import Blueprint, request, jsonify
from .models import *
from . import db
from sqlalchemy.sql import func
import pandas as pd
import numpy as np
import statsmodels.api as sm
import datetime

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

    data = [
        {
            'dia_semana': row[0],
            'total_faturamento': row[1]
        }
        for row in result
    ]

    return jsonify(data)


@marketing_bp.route('/marketing/distributions', methods=['GET'])
def distributions():
    result = (
        db.session.query(
            func.avg(Marketing.faturamento_diario).label(
                'avg_faturamento_diario'),
            func.stddev(Marketing.faturamento_diario).label(
                'std_faturamento_diario'),
            func.avg(Marketing.alcance_instagram).label(
                'avg_alcance_instagram'),
            func.stddev(Marketing.alcance_instagram).label(
                'std_alcance_instagram'),
            func.avg(Marketing.alcance_facebook).label('avg_alcance_facebook'),
            func.stddev(Marketing.alcance_facebook).label(
                'std_alcance_facebook'),
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


@marketing_bp.route('/marketing/gender-analysis', methods=['GET'])
def gender_analysis():
    df = pd.read_sql_table('Marketing', con=db.engine)

    gender_counts = df['maioria_sexo'].value_counts()

    return jsonify({
        'generos': gender_counts.index.tolist(),
        'ocorrencias': gender_counts.values.tolist()
    })


@marketing_bp.route('/marketing/peak-hours', methods=['GET'])
def peak_hours():
    df = pd.read_sql_table('Marketing', con=db.engine)

    df['horario_pico'] = pd.to_datetime(
        df['horario_pico'], format='%H:%M', errors='coerce').dt.time

    dias_ordenados = ['DOMINGO', 'SEGUNDA', 'TERCA',
                      'QUARTA', 'QUINTA', 'SEXTA', 'SABADO']

    horario_pico_dia = (
        df.groupby('dia_semana')['horario_pico']
        .agg(lambda x: x.mode()[0] if not x.mode().empty else None)
    )
    horario_pico_dia = horario_pico_dia.reindex(dias_ordenados)

    horarios_formatados = horario_pico_dia.apply(
        lambda t: t.strftime('%H:%M') if isinstance(t, datetime.time) else None)

    return jsonify({
        'dias': dias_ordenados,
        'horarios': horarios_formatados.tolist()
    })


@marketing_bp.route('/marketing/average-reach', methods=['GET'])
def average_reach_by_age():
    df = pd.read_sql_table('Marketing', con=db.engine)

    df['alcance_instagram'] = pd.to_numeric(
        df['alcance_instagram'], errors='coerce')
    df['alcance_facebook'] = pd.to_numeric(
        df['alcance_facebook'], errors='coerce')
    df['alcance_tiktok'] = pd.to_numeric(df['alcance_tiktok'], errors='coerce')

    df = df.dropna(subset=['idade_instagram', 'idade_facebook', 'idade_tiktok',
                   'alcance_instagram', 'alcance_facebook', 'alcance_tiktok'])

    alcance_instagram = df.groupby('idade_instagram')[
        'alcance_instagram'].mean().reset_index()
    alcance_facebook = df.groupby('idade_facebook')[
        'alcance_facebook'].mean().reset_index()
    alcance_tiktok = df.groupby('idade_tiktok')[
        'alcance_tiktok'].mean().reset_index()

    return jsonify({
        'instagram': alcance_instagram.to_dict(orient='records'),
        'facebook': alcance_facebook.to_dict(orient='records'),
        'tiktok': alcance_tiktok.to_dict(orient='records'),
    })


@marketing_bp.route('/marketing/reach-by-day', methods=['GET'])
def reach_by_day():
    df = pd.read_sql_table('Marketing', con=db.engine)

    df['alcance_instagram'] = pd.to_numeric(
        df['alcance_instagram'], errors='coerce')
    df['alcance_facebook'] = pd.to_numeric(
        df['alcance_facebook'], errors='coerce')
    df['alcance_tiktok'] = pd.to_numeric(df['alcance_tiktok'], errors='coerce')

    def remover_outliers(df, col):
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1
        limite_inferior = Q1 - 1.5 * IQR
        limite_superior = Q3 + 1.5 * IQR
        return df[(df[col] >= limite_inferior) & (df[col] <= limite_superior)]

    df = remover_outliers(df, 'alcance_tiktok')

    df = df.dropna(subset=['alcance_instagram',
                   'alcance_facebook', 'alcance_tiktok'])

    dias_ordenados = ['DOMINGO', 'SEGUNDA', 'TERCA',
                      'QUARTA', 'QUINTA', 'SEXTA', 'SABADO']

    alcance_por_dia = (
        df.groupby('dia_semana')[['alcance_instagram',
                                  'alcance_facebook', 'alcance_tiktok']]
        .sum()
        .reindex(dias_ordenados, fill_value=0)
    )

    return jsonify({
        'dias': alcance_por_dia.index.tolist(),
        'instagram': alcance_por_dia['alcance_instagram'].tolist(),
        'facebook': alcance_por_dia['alcance_facebook'].tolist(),
        'tiktok': alcance_por_dia['alcance_tiktok'].tolist()
    })


@marketing_bp.route('/marketing/summary', methods=['GET'])
def marketing_summary():
    df = pd.read_sql_table('Marketing', con=db.engine)

    df['data_id'] = pd.to_datetime(
        df['data_id'], format='%Y-%m-%d', errors='coerce')

    ultimo_dia = df['data_id'].max()
    clientes_novos_diarios = df[df['data_id']
                                == ultimo_dia]['qtd_clientes'].sum()

    alcance_total_instagram = df['alcance_instagram'].sum()
    alcance_total_facebook = df['alcance_facebook'].sum()
    alcance_total_tiktok = df['alcance_tiktok'].sum()
    alcance_total = alcance_total_instagram + \
        alcance_total_facebook + alcance_total_tiktok

    penultimo_dia = df[df['data_id'] < ultimo_dia]['data_id'].max()
    clientes_novos_anterior = df[df['data_id']
                                 == penultimo_dia]['qtd_clientes'].sum()

    variacao_clientes = ((clientes_novos_diarios - clientes_novos_anterior) /
                         clientes_novos_anterior) * 100 if clientes_novos_anterior else 0

    return jsonify({
        'clientes_novos_diarios': round(float(clientes_novos_diarios), 2),
        'variacao_clientes': round(float(variacao_clientes), 2),
        'alcance_total': round(float(alcance_total), 2),
        'alcance_total_instagram': round(float(alcance_total_instagram), 2),
        'alcance_total_facebook': round(float(alcance_total_facebook), 2),
        'alcance_total_tiktok': round(float(alcance_total_tiktok), 2)
    })


# ========================

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
        .limit(6)
        .all()
    )

    data = [
        {
            'nome_fornecedor': row[0],
            'total_faturamento': row[1]
        }
        for row in result
    ]

    return jsonify(data)


@financeiro_bp.route('/financial/profit-revenue-ratio', methods=['GET'])
def profit_revenue_ratio():
    result = (
        db.session.query(
            Financeiro.categoria_produto.label('categoria_produto'),
            func.sum(Financeiro.faturamento_produto).label(
                'total_faturamento'),
            func.sum(Financeiro.lucro_produto).label('total_lucro')
        )
        .group_by(Financeiro.categoria_produto)
        .all()
    )

    data = []
    for row in result:
        total_faturamento = row.total_faturamento or 0
        total_lucro = row.total_lucro or 0
        relacao = (total_lucro / total_faturamento *
                   100) if total_faturamento > 0 else 0
        data.append({
            'categoria_produto': row.categoria_produto,
            'relacao_lucro_faturamento': round(relacao, 2),
        })

    data.sort(key=lambda x: x['relacao_lucro_faturamento'], reverse=True)

    return jsonify(data)


@financeiro_bp.route('/financial/category-proportions', methods=['GET'])
def category_proportions():
    df = pd.read_sql_table('Financeiro', con=db.engine)

    categoria_counts = df['categoria_produto'].value_counts()

    proporcoes = (categoria_counts / categoria_counts.sum() * 100).round(1)

    return jsonify({
        'categories': categoria_counts.index.tolist(),
        'counts': categoria_counts.tolist(),
        'proportions': proporcoes.tolist()
    })


@financeiro_bp.route('/financial/top-products', methods=['GET'])
def top_products():
    df = pd.read_sql_table('Financeiro', con=db.engine)

    top_3_produtos = df.nlargest(3, 'lucro_produto')

    return jsonify({
        'produtos': top_3_produtos['nome_produto'].tolist(),
        'lucros': top_3_produtos['lucro_produto'].tolist()
    })


@financeiro_bp.route('/financial/category-distribution', methods=['GET'])
def category_distribution():
    df = pd.read_sql_table('Financeiro', con=db.engine)

    df_grouped = (
        df.groupby('categoria_produto')
        .agg(quantidade_total=('qtd_comprada', 'sum'))
        .reset_index()
    )

    return jsonify({
        'categorias': df_grouped['categoria_produto'].tolist(),
        'quantidades': df_grouped['quantidade_total'].tolist()
    })


@financeiro_bp.route('/financial/profit-margin', methods=['GET'])
def profit_margin_by_category():
    df = pd.read_sql_table('Financeiro', con=db.engine)

    df['margem_lucro'] = (df['lucro_produto'] /
                          df['faturamento_produto']) * 100

    margem_por_categoria = (
        df.groupby('categoria_produto')['margem_lucro']
        .mean()
        .reset_index()
    )

    return jsonify({
        'categorias': margem_por_categoria['categoria_produto'].tolist(),
        'margens': margem_por_categoria['margem_lucro'].round(2).tolist()
    })


@financeiro_bp.route('/financial/summary', methods=['GET'])
def financial_summary():
    df = pd.read_sql_table('Financeiro', con=db.engine)

    df['data_transacao'] = pd.to_datetime(df['data_transacao'], dayfirst=True)

    ultimo_dia = df['data_transacao'].max()
    faturamento_diario = df[df['data_transacao']
                            == ultimo_dia]['faturamento_produto'].sum()

    faturamento_total = df['faturamento_produto'].sum()

    penultimo_dia = df[df['data_transacao']
                       < ultimo_dia]['data_transacao'].max()
    faturamento_diario_anterior = df[df['data_transacao']
                                     == penultimo_dia]['faturamento_produto'].sum()

    variacao_diaria = ((faturamento_diario - faturamento_diario_anterior) /
                       faturamento_diario_anterior) * 100 if faturamento_diario_anterior else 0

    mes_atual = ultimo_dia.month
    mes_anterior = mes_atual - 1 if mes_atual > 1 else 12
    faturamento_mes_anterior = df[df['data_transacao'].dt.month ==
                                  mes_anterior]['faturamento_produto'].sum()
    variacao_total = ((faturamento_total - faturamento_mes_anterior) /
                      faturamento_mes_anterior) * 100 if faturamento_mes_anterior else 0

    return jsonify({
        'faturamento_diario': round(faturamento_diario, 2),
        'variacao_diaria': round(variacao_diaria, 2),
        'faturamento_total': round(faturamento_total, 2),
        'variacao_total': round(variacao_total, 2)
    })
