const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const db = new Database('database.db');

app.use(cors());
app.use(express.json());

const JWT_SECRET = 'pelada-facil-secret-2025';

// CRIAR TABELAS
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    telefone TEXT,
    foto TEXT DEFAULT 'https://i.pravatar.cc/150',
    tipo_usuario TEXT DEFAULT 'jogador',
    is_admin INTEGER DEFAULT 0,
    reputacao REAL DEFAULT 3.0,
    total_partidas INTEGER DEFAULT 0,
    total_gols INTEGER DEFAULT 0,
    total_assistencias INTEGER DEFAULT 0,
    nivel_habilidade INTEGER DEFAULT 1,
    posicao TEXT,
    disponivel INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS partidas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descricao TEXT,
    esporte TEXT NOT NULL,
    data_hora DATETIME NOT NULL,
    local TEXT NOT NULL,
    endereco TEXT,
    valor_individual REAL NOT NULL,
    vagas_totais INTEGER NOT NULL,
    vagas_disponiveis INTEGER NOT NULL,
    nivel_minimo INTEGER DEFAULT 1,
    status TEXT DEFAULT 'aberta',
    organizador_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizador_id) REFERENCES usuarios(id)
  );

  CREATE TABLE IF NOT EXISTS quadras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    endereco TEXT NOT NULL,
    cidade TEXT NOT NULL,
    esportes TEXT NOT NULL,
    valor_hora REAL NOT NULL,
    foto TEXT,
    dono_id INTEGER,
    telefone TEXT,
    status TEXT DEFAULT 'ativa',
    avaliacoes REAL DEFAULT 0,
    total_avaliacoes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dono_id) REFERENCES usuarios(id)
  );

  CREATE TABLE IF NOT EXISTS campeonatos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    esporte TEXT NOT NULL,
    status TEXT DEFAULT 'inscricoes_abertas',
    valor_inscricao REAL NOT NULL,
    data_inicio DATE,
    data_fim DATE,
    numero_times INTEGER,
    times_inscritos INTEGER DEFAULT 0,
    foto TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS pagamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL,
    nome TEXT NOT NULL,
    valor REAL NOT NULL,
    status TEXT DEFAULT 'pendente',
    metodo TEXT,
    usuario_id INTEGER,
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
  );
`);

// POPULAR COM DADOS INICIAIS
const adminExists = db.prepare('SELECT id FROM usuarios WHERE email = ?').get('admin@peladafacil.com');

if (!adminExists) {
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  
  // Admin
  db.prepare(`INSERT INTO usuarios (nome, email, senha, is_admin, foto, tipo_usuario) VALUES (?, ?, ?, 1, ?, 'admin')`)
    .run('Administrador', 'admin@peladafacil.com', hashedPassword, 'https://i.pravatar.cc/150?img=50');
  
  // Usuários
  for (let i = 1; i <= 40; i++) {
    const senha = bcrypt.hashSync('senha123', 10);
    const tipos = ['jogador', 'jogador', 'jogador', 'dono_quadra'];
    const posicoes = ['Atacante', 'Meia', 'Zagueiro', 'Goleiro', 'Lateral', 'Volante'];
    db.prepare(`INSERT INTO usuarios (nome, email, senha, telefone, foto, tipo_usuario, posicao, reputacao, total_partidas, total_gols, nivel_habilidade) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(
        'Jogador ' + i,
        'jogador' + i + '@email.com',
        senha,
        '(11) 9' + Math.floor(Math.random() * 90000000 + 10000000),
        'https://i.pravatar.cc/150?img=' + i,
        tipos[i % tipos.length],
        posicoes[i % posicoes.length],
        3 + Math.random() * 2,
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 30),
        1 + Math.floor(Math.random() * 5)
      );
  }
  
  // Partidas
  const partidas = [
    ['Pelada Sábado Manhã', 'futebol', '2025-11-23 09:00:00', 'Arena São Paulo', 'Rua das Flores, 123', 25, 20, 15, 2],
    ['Futsal Noturno', 'futsal', '2025-11-24 19:00:00', 'Quadra Central', 'Av. Paulista, 456', 20, 14, 8, 1],
    ['Racha Domingo', 'futebol', '2025-11-24 15:00:00', 'Campo Morumbi', 'Rua Morumbi, 789', 30, 22, 5, 3],
    ['Vôlei de Areia', 'volei', '2025-11-25 10:00:00', 'Beach Sports', 'Orla da Praia', 15, 8, 4, 1],
    ['Basquete 3x3', 'basquete', '2025-11-26 17:00:00', 'Quadra Poliesportiva', 'Rua dos Esportes, 321', 18, 6, 2, 2]
  ];
  
  partidas.forEach(p => {
    db.prepare(`INSERT INTO partidas (titulo, esporte, data_hora, local, endereco, valor_individual, vagas_totais, vagas_disponiveis, nivel_minimo, organizador_id, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'aberta')`)
      .run(...p);
  });
  
  // Quadras
  const quadras = [
    ['Arena São Paulo Premium', 'Rua das Flores, 123', 'São Paulo', 'futebol,futsal', 150, 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600', '(11) 98888-1111', 4.8, 127],
    ['Quadra Central Paulista', 'Av. Paulista, 456', 'São Paulo', 'futsal,volei', 120, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600', '(11) 98888-2222', 4.6, 89],
    ['Campo Society Norte', 'Rua Norte, 789', 'São Paulo', 'futebol', 100, 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600', '(11) 98888-3333', 4.9, 203]
  ];
  
  quadras.forEach(q => {
    db.prepare(`INSERT INTO quadras (nome, endereco, cidade, esportes, valor_hora, foto, telefone, avaliacoes, total_avaliacoes, dono_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 2)`)
      .run(...q);
  });
  
  // Campeonatos
  db.prepare(`INSERT INTO campeonatos (nome, descricao, esporte, status, valor_inscricao, data_inicio, data_fim, numero_times, times_inscritos, foto) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run('Copa Pelada Fácil 2025', 'Maior campeonato amador de SP', 'futebol', 'inscricoes_abertas', 200, '2025-12-01', '2026-01-30', 16, 8, 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600');
  
  console.log('✅ Banco de dados populado!');
}

// MIDDLEWARE AUTH
const auth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// ROTAS AUTH
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
    if (!user || !bcrypt.compareSync(senha, user.senha)) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, nome: user.nome, email: user.email, foto: user.foto, is_admin: user.is_admin, tipo_usuario: user.tipo_usuario } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/me', auth, (req, res) => {
  try {
    const user = db.prepare('SELECT id, nome, email, foto, tipo_usuario, is_admin, reputacao, total_partidas FROM usuarios WHERE id = ?').get(req.userId);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROTAS PARTIDAS
app.get('/api/partidas', (req, res) => {
  try {
    const partidas = db.prepare(`
      SELECT p.*, u.nome as organizador_nome, u.foto as organizador_foto 
      FROM partidas p 
      LEFT JOIN usuarios u ON p.organizador_id = u.id 
      ORDER BY p.data_hora ASC
    `).all();
    res.json(partidas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROTAS QUADRAS
app.get('/api/quadras', (req, res) => {
  try {
    const quadras = db.prepare('SELECT * FROM quadras WHERE status = ?').all('ativa');
    res.json(quadras);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROTAS USUÁRIOS
app.get('/api/users', (req, res) => {
  try {
    const users = db.prepare('SELECT id, nome, email, foto, posicao, reputacao, total_partidas, total_gols, nivel_habilidade, disponivel FROM usuarios WHERE tipo_usuario = ?').all('jogador');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROTAS CAMPEONATOS
app.get('/api/campeonatos', (req, res) => {
  try {
    const campeonatos = db.prepare('SELECT * FROM campeonatos ORDER BY created_at DESC').all();
    res.json(campeonatos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// STATS
app.get('/api/stats/dashboard', (req, res) => {
  try {
    const stats = {
      totalUsuarios: db.prepare('SELECT COUNT(*) as count FROM usuarios').get().count,
      partidasAbertas: db.prepare("SELECT COUNT(*) as count FROM partidas WHERE status = 'aberta'").get().count,
      totalPartidas: db.prepare('SELECT COUNT(*) as count FROM partidas').get().count,
      totalCampeonatos: db.prepare('SELECT COUNT(*) as count FROM campeonatos').get().count,
      totalQuadras: db.prepare('SELECT COUNT(*) as count FROM quadras').get().count,
      pagamentosPendentes: db.prepare("SELECT COUNT(*) as count FROM pagamentos WHERE status = 'pendente'").get().count || 0
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log('\n✅ Backend iniciado com sucesso!');
  console.log('📊 API disponível em: http://localhost:' + PORT);
  console.log('🔐 Login admin: admin@peladafacil.com / admin123\n');
});
