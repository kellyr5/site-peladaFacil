const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const db = new Database('database.db');
const senha = bcrypt.hashSync('jogador123', 10);

// Adicionar 3 jogadores de exemplo
const jogadores = [
  ['Carlos Silva', 'carlos@email.com', '(11) 98888-7777', 'https://i.pravatar.cc/150?img=11', 'Atacante'],
  ['Rafael Santos', 'rafael@email.com', '(11) 98888-8888', 'https://i.pravatar.cc/150?img=12', 'Meia'],
  ['Bruno Costa', 'bruno@email.com', '(11) 98888-9999', 'https://i.pravatar.cc/150?img=13', 'Zagueiro']
];

jogadores.forEach(j => {
  try {
    db.prepare(`INSERT INTO usuarios (nome, email, senha, telefone, foto, tipo_usuario, posicao, reputacao, total_partidas, total_gols, nivel_habilidade) 
                VALUES (?, ?, ?, ?, ?, 'jogador', ?, 4.5, 45, 12, 4)`)
      .run(j[0], j[1], senha, j[2], j[3], j[4]);
    console.log('✅ Adicionado:', j[0]);
  } catch (err) {
    console.log('Usuário já existe:', j[0]);
  }
});

db.close();
console.log('\n✅ Jogadores adicionados!\n');
