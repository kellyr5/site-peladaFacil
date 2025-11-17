from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import json

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'pelada-facil-secret-key-2024'
CORS(app)
jwt = JWTManager(app)

# Banco de dados em memória
usuarios = [
    {
        'id': 1,
        'nome': 'João Silva',
        'email': 'joao@email.com',
        'senha': '123456',
        'telefone': '(11) 99999-8888',
        'foto': 'https://i.pravatar.cc/150?img=12',
        'posicao': 'Atacante',
        'nivel_habilidade': 8,
        'reputacao': 4.8,
        'total_partidas': 45,
        'total_gols': 23,
        'is_admin': False
    },
    {
        'id': 2,
        'nome': 'Admin Master',
        'email': 'admin@peladafacil.com',
        'senha': 'admin123',
        'telefone': '(11) 98888-7777',
        'foto': 'https://i.pravatar.cc/150?img=33',
        'posicao': 'Administrador',
        'nivel_habilidade': 10,
        'reputacao': 5.0,
        'total_partidas': 0,
        'total_gols': 0,
        'is_admin': True
    }
]

partidas = [
    {
        'id': 1,
        'titulo': 'Pelada Sábado Manhã',
        'esporte': 'Futebol',
        'data_hora': '2025-11-23T09:00:00',
        'local': 'Arena São Paulo',
        'endereco': 'Rua dos Esportes, 123 - São Paulo/SP',
        'valor_individual': 25.00,
        'vagas_totais': 20,
        'vagas_disponiveis': 8,
        'nivel': 'Intermediário',
        'descricao': 'Pelada tranquila para começar o fim de semana',
        'organizador_id': 1,
        'status': 'aberta',
        'jogadores': []
    },
    {
        'id': 2,
        'titulo': 'Racha Domingo Tarde',
        'esporte': 'Futebol',
        'data_hora': '2025-11-24T16:00:00',
        'local': 'Campo Morumbi',
        'endereco': 'Av. Morumbi, 456 - São Paulo/SP',
        'valor_individual': 30.00,
        'vagas_totais': 22,
        'vagas_disponiveis': 15,
        'nivel': 'Avançado',
        'descricao': 'Racha competitivo, nível alto',
        'organizador_id': 1,
        'status': 'aberta',
        'jogadores': []
    },
    {
        'id': 3,
        'titulo': 'Futsal Noturno',
        'esporte': 'Futsal',
        'data_hora': '2025-11-25T20:00:00',
        'local': 'Quadra Central',
        'endereco': 'Rua Central, 789 - São Paulo/SP',
        'valor_individual': 20.00,
        'vagas_totais': 10,
        'vagas_disponiveis': 3,
        'nivel': 'Intermediário',
        'descricao': 'Futsal após o trabalho',
        'organizador_id': 2,
        'status': 'aberta',
        'jogadores': []
    }
]

quadras = [
    {
        'id': 1,
        'nome': 'Arena São Paulo',
        'tipo': 'Campo Society',
        'endereco': 'Rua dos Esportes, 123 - São Paulo/SP',
        'valor_hora': 150.00,
        'foto': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
        'comodidades': ['Vestiário', 'Estacionamento', 'Iluminação', 'Arquibancada'],
        'horarios_disponiveis': ['08:00', '10:00', '14:00', '16:00', '18:00', '20:00'],
        'avaliacao': 4.8,
        'total_avaliacoes': 156
    },
    {
        'id': 2,
        'nome': 'Campo Morumbi',
        'tipo': 'Campo Oficial',
        'endereco': 'Av. Morumbi, 456 - São Paulo/SP',
        'valor_hora': 200.00,
        'foto': 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800',
        'comodidades': ['Vestiário', 'Estacionamento', 'Iluminação', 'Bar', 'Lanchonete'],
        'horarios_disponiveis': ['09:00', '11:00', '15:00', '17:00', '19:00'],
        'avaliacao': 4.9,
        'total_avaliacoes': 203
    },
    {
        'id': 3,
        'nome': 'Quadra Central',
        'tipo': 'Quadra Futsal',
        'endereco': 'Rua Central, 789 - São Paulo/SP',
        'valor_hora': 100.00,
        'foto': 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800',
        'comodidades': ['Vestiário', 'Iluminação', 'Bebedouro'],
        'horarios_disponiveis': ['07:00', '12:00', '14:00', '18:00', '20:00', '22:00'],
        'avaliacao': 4.7,
        'total_avaliacoes': 89
    }
]

campeonatos = [
    {
        'id': 1,
        'nome': 'Copa Amadora 2025',
        'esporte': 'Futebol',
        'data_inicio': '2025-12-01',
        'data_fim': '2025-12-20',
        'inscricoes_abertas': True,
        'valor_inscricao': 300.00,
        'times_inscritos': 8,
        'vagas_totais': 16,
        'formato': 'Eliminatório',
        'premiacao': 'R$ 5.000 + Troféu',
        'descricao': 'Campeonato amador de futebol society',
        'foto': 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800'
    },
    {
        'id': 2,
        'nome': 'Liga Sábado',
        'esporte': 'Futsal',
        'data_inicio': '2025-11-25',
        'data_fim': '2026-02-25',
        'inscricoes_abertas': True,
        'valor_inscricao': 200.00,
        'times_inscritos': 12,
        'vagas_totais': 12,
        'formato': 'Pontos Corridos',
        'premiacao': 'R$ 3.000 + Troféu',
        'descricao': 'Liga de futsal aos sábados',
        'foto': 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800'
    }
]

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    senha = data.get('senha')
    
    usuario = next((u for u in usuarios if u['email'] == email and u['senha'] == senha), None)
    
    if usuario:
        usuario_sem_senha = {k: v for k, v in usuario.items() if k != 'senha'}
        token = create_access_token(identity=usuario['id'])
        return jsonify({'token': token, 'user': usuario_sem_senha}), 200
    
    return jsonify({'error': 'Credenciais inválidas'}), 401

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if any(u['email'] == data['email'] for u in usuarios):
        return jsonify({'error': 'Email já cadastrado'}), 400
    
    novo_usuario = {
        'id': len(usuarios) + 1,
        'nome': data['nome'],
        'email': data['email'],
        'senha': data['senha'],
        'telefone': data.get('telefone', ''),
        'foto': f'https://i.pravatar.cc/150?img={len(usuarios) + 10}',
        'posicao': data.get('posicao', 'Não informado'),
        'nivel_habilidade': 5,
        'reputacao': 5.0,
        'total_partidas': 0,
        'total_gols': 0,
        'is_admin': False
    }
    
    usuarios.append(novo_usuario)
    token = create_access_token(identity=novo_usuario['id'])
    usuario_sem_senha = {k: v for k, v in novo_usuario.items() if k != 'senha'}
    
    return jsonify({'token': token, 'user': usuario_sem_senha}), 201

@app.route('/api/partidas', methods=['GET'])
def get_partidas():
    return jsonify(partidas), 200

@app.route('/api/partidas/<int:id>', methods=['GET'])
def get_partida(id):
    partida = next((p for p in partidas if p['id'] == id), None)
    if partida:
        return jsonify(partida), 200
    return jsonify({'error': 'Partida não encontrada'}), 404

@app.route('/api/partidas', methods=['POST'])
@jwt_required()
def create_partida():
    data = request.get_json()
    user_id = get_jwt_identity()
    
    nova_partida = {
        'id': len(partidas) + 1,
        'titulo': data['titulo'],
        'esporte': data['esporte'],
        'data_hora': data['data_hora'],
        'local': data['local'],
        'endereco': data['endereco'],
        'valor_individual': float(data['valor_individual']),
        'vagas_totais': int(data['vagas_totais']),
        'vagas_disponiveis': int(data['vagas_totais']),
        'nivel': data['nivel'],
        'descricao': data['descricao'],
        'organizador_id': user_id,
        'status': 'aberta',
        'jogadores': []
    }
    
    partidas.append(nova_partida)
    return jsonify(nova_partida), 201

@app.route('/api/quadras', methods=['GET'])
def get_quadras():
    return jsonify(quadras), 200

@app.route('/api/quadras/<int:id>', methods=['GET'])
def get_quadra(id):
    quadra = next((q for q in quadras if q['id'] == id), None)
    if quadra:
        return jsonify(quadra), 200
    return jsonify({'error': 'Quadra não encontrada'}), 404

@app.route('/api/campeonatos', methods=['GET'])
def get_campeonatos():
    return jsonify(campeonatos), 200

@app.route('/api/campeonatos/<int:id>', methods=['GET'])
def get_campeonato(id):
    campeonato = next((c for c in campeonatos if c['id'] == id), None)
    if campeonato:
        return jsonify(campeonato), 200
    return jsonify({'error': 'Campeonato não encontrado'}), 404

@app.route('/api/jogadores', methods=['GET'])
def get_jogadores():
    jogadores = [{k: v for k, v in u.items() if k != 'senha'} for u in usuarios if not u['is_admin']]
    return jsonify(jogadores), 200

@app.route('/api/stats/dashboard', methods=['GET'])
def get_stats_dashboard():
    stats = {
        'totalUsuarios': len([u for u in usuarios if not u['is_admin']]),
        'totalPartidas': len(partidas),
        'partidasAbertas': len([p for p in partidas if p['status'] == 'aberta']),
        'totalQuadras': len(quadras),
        'totalCampeonatos': len(campeonatos)
    }
    return jsonify(stats), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
