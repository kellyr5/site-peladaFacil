
// MELHORAR NAVBAR COM FOTO DE PERFIL MELHOR
Navbar = function() {
  return `
    <nav class="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-primary/10">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center h-20">
          <a href="#" onclick="navigate('home'); return false;" class="flex items-center space-x-3 group">
            <div class="transform group-hover:scale-110 transition">${Logo}</div>
            <div><div class="text-2xl font-black text-gray-900">Pelada Fácil</div><div class="text-xs text-primary font-bold">ESPORTE AMADOR</div></div>
          </a>
          <div class="hidden md:flex items-center space-x-1">
            <a href="#" onclick="navigate('partidas'); return false;" class="px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${state.page === 'partidas' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-primary/10'} transition">${Icons.soccer} Partidas</a>
            <a href="#" onclick="navigate('quadras'); return false;" class="px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${state.page === 'quadras' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-primary/10'} transition">${Icons.stadium} Quadras</a>
            <a href="#" onclick="navigate('campeonatos'); return false;" class="px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${state.page === 'campeonatos' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-primary/10'} transition">${Icons.trophy} Campeonatos</a>
            <a href="#" onclick="navigate('jogadores'); return false;" class="px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${state.page === 'jogadores' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-primary/10'} transition">${Icons.users} Jogadores</a>
          </div>
          ${state.user ? `
            <div class="flex items-center space-x-3">
              <button onclick="navigate('perfil')" class="flex items-center space-x-3 px-5 py-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl hover:from-primary/20 hover:to-primary/10 transition-all border-2 border-primary/20 hover:border-primary/30">
                <div class="relative">
                  <img src="${state.user.foto}" class="w-11 h-11 rounded-full border-3 border-white shadow-lg object-cover" />
                  <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div class="text-left">
                  <div class="text-sm font-black text-gray-900">${state.user.nome.split(' ')[0]}</div>
                  <div class="text-xs font-bold ${state.user.is_admin ? 'text-red-600' : 'text-primary'}">${state.user.is_admin ? 'Administrador' : 'Jogador Ativo'}</div>
                </div>
              </button>
              ${state.user.is_admin ? '<a href="#" onclick="navigate(\'admin\'); return false;" class="px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-sm font-black hover:from-red-600 hover:to-red-700 transition shadow-lg flex items-center gap-2">${Icons.settings} ADMIN</a>' : ''}
              <button onclick="logout()" class="px-5 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-600 hover:text-white transition flex items-center gap-2 border-2 border-red-100 hover:border-red-600">${Icons.logout} Sair</button>
            </div>
          ` : '<a href="#" onclick="navigate(\'login\'); return false;" class="px-8 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl text-sm font-black hover:shadow-xl transition">ENTRAR</a>'}
        </div>
      </div>
    </nav>
  `;
};

// DASHBOARD ADMIN COMPLETO E EXPANDIDO
AdminPage = function() {
  if (!state.user?.is_admin) return Navbar() + '<div class="min-h-screen flex items-center justify-center"><div class="text-center"><div class="text-6xl mb-4 text-red-600">${Icons.x}</div><h1 class="text-3xl font-bold text-red-600">Acesso Negado</h1><p class="text-gray-600 mt-2">Você não tem permissão para acessar esta área</p></div></div>';
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.chart },
    { id: 'usuarios', label: 'Usuários', icon: Icons.users },
    { id: 'partidas', label: 'Partidas', icon: Icons.soccer },
    { id: 'quadras', label: 'Quadras', icon: Icons.stadium },
    { id: 'campeonatos', label: 'Campeonatos', icon: Icons.trophy },
    { id: 'pagamentos', label: 'Pagamentos', icon: Icons.money },
    { id: 'relatorios', label: 'Relatórios', icon: Icons.document },
    { id: 'config', label: 'Configurações', icon: Icons.settings }
  ];

  const currentTab = state.tab || 'dashboard';

  const usuarios = state.data.jogadores.map(j => ({...j, tipo: 'Jogador', status: 'Ativo', cadastro: '2024-08-15'}));
  
  const partidasPendentes = state.data.partidas.map(p => ({...p, status_admin: 'Pendente Aprovação'}));
  
  const quadrasPendentes = state.data.quadras.slice(0, 2).map(q => ({...q, status_admin: 'Aguardando Análise'}));
  
  const pagamentosPendentes = [
    { id: 1, usuario: 'Carlos Silva', valor: 25, partida: 'Pelada Sábado', data: '2025-11-16', metodo: 'Pix', status: 'Pendente' },
    { id: 2, usuario: 'Ana Santos', valor: 30, partida: 'Racha Domingo', data: '2025-11-15', metodo: 'Cartão', status: 'Pendente' },
    { id: 3, usuario: 'João Costa', valor: 150, partida: 'Copa Amadora', data: '2025-11-14', metodo: 'Pix', status: 'Processando' },
    { id: 4, usuario: 'Maria Oliveira', valor: 20, partida: 'Futsal Noturno', data: '2025-11-13', metodo: 'Cartão', status: 'Pendente' }
  ];

  const estatisticasDetalhadas = {
    hoje: { novosUsuarios: 12, partidasCriadas: 8, reservasQuadras: 15, faturamento: 850 },
    semana: { novosUsuarios: 89, partidasCriadas: 54, reservasQuadras: 102, faturamento: 5420 },
    mes: { novosUsuarios: 378, partidasCriadas: 245, reservasQuadras: 456, faturamento: 23680 }
  };

  const atividadesRecentes = [
    { tipo: 'usuario', acao: 'Novo usuário cadastrado', nome: 'Pedro Alves', tempo: '2 min atrás' },
    { tipo: 'partida', acao: 'Partida criada', nome: 'Racha da Galera', tempo: '15 min atrás' },
    { tipo: 'pagamento', acao: 'Pagamento aprovado', nome: 'R$ 150,00', tempo: '23 min atrás' },
    { tipo: 'quadra', acao: 'Nova quadra cadastrada', nome: 'Arena Premium', tempo: '1 hora atrás' },
    { tipo: 'campeonato', acao: 'Time inscrito', nome: 'Copa Master 2025', tempo: '2 horas atrás' }
  ];

  return Navbar() + `
    <div class="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-3 mb-4">
              <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl">${Icons.settings}</div>
              <div>
                <h1 class="text-5xl font-black">Painel Administrativo</h1>
                <p class="text-xl text-red-100">Gestão completa da plataforma</p>
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm font-bold text-red-200 mb-1">Último acesso</div>
            <div class="text-2xl font-black">${new Date().toLocaleString('pt-BR')}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="bg-white border-b-2 sticky top-20 z-40 shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex gap-2 overflow-x-auto">
          ${tabs.map(t => `
            <button onclick="state.tab='${t.id}'; render();" class="px-6 py-4 font-bold flex items-center gap-2 whitespace-nowrap transition ${currentTab === t.id ? 'border-b-4 border-red-600 text-red-600' : 'text-gray-600 hover:text-red-600 hover:bg-red-50'}">
              ${t.icon} ${t.label}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
    
    <div class="max-w-7xl mx-auto px-4 py-8">
      ${currentTab === 'dashboard' ? `
        <div class="space-y-8">
          <!-- MÉTRICAS PRINCIPAIS -->
          <div class="grid md:grid-cols-4 gap-6">
            ${[
              { label: 'Usuários Totais', value: state.data.stats?.totalUsuarios || 0, change: '+12%', color: 'blue', icon: Icons.users },
              { label: 'Partidas Ativas', value: state.data.stats?.partidasAbertas || 0, change: '+8%', color: 'green', icon: Icons.soccer },
              { label: 'Quadras Cadastradas', value: state.data.stats?.totalQuadras || 0, change: '+5%', color: 'orange', icon: Icons.stadium },
              { label: 'Faturamento Mensal', value: 'R$ 23.680', change: '+23%', color: 'purple', icon: Icons.money }
            ].map(metric => `
              <div class="bg-white p-6 rounded-2xl border-2 hover:shadow-2xl transition group">
                <div class="flex items-start justify-between mb-4">
                  <div class="w-14 h-14 bg-${metric.color}-100 rounded-xl flex items-center justify-center text-${metric.color}-600 text-2xl group-hover:scale-110 transition">
                    ${metric.icon}
                  </div>
                  <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-black">${metric.change}</span>
                </div>
                <div class="text-sm font-semibold text-gray-500 mb-1">${metric.label}</div>
                <div class="text-4xl font-black text-gray-900">${metric.value}</div>
              </div>
            `).join('')}
          </div>

          <!-- ESTATÍSTICAS TEMPORAIS -->
          <div class="bg-white p-8 rounded-2xl border-2">
            <h3 class="text-2xl font-black mb-6">Estatísticas por Período</h3>
            <div class="grid md:grid-cols-3 gap-6">
              ${Object.entries(estatisticasDetalhadas).map(([periodo, dados]) => `
                <div class="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2">
                  <h4 class="font-black text-lg mb-4 uppercase text-gray-700">${periodo === 'hoje' ? 'Hoje' : periodo === 'semana' ? 'Esta Semana' : 'Este Mês'}</h4>
                  <div class="space-y-3">
                    <div class="flex justify-between"><span class="text-gray-600">Novos Usuários</span><span class="font-black text-blue-600">${dados.novosUsuarios}</span></div>
                    <div class="flex justify-between"><span class="text-gray-600">Partidas Criadas</span><span class="font-black text-green-600">${dados.partidasCriadas}</span></div>
                    <div class="flex justify-between"><span class="text-gray-600">Reservas</span><span class="font-black text-orange-600">${dados.reservasQuadras}</span></div>
                    <div class="flex justify-between pt-3 border-t-2"><span class="text-gray-600 font-bold">Faturamento</span><span class="font-black text-purple-600 text-xl">R$ ${dados.faturamento}</span></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-8">
            <!-- ATIVIDADES RECENTES -->
            <div class="bg-white p-8 rounded-2xl border-2">
              <h3 class="text-2xl font-black mb-6">Atividades Recentes</h3>
              <div class="space-y-3">
                ${atividadesRecentes.map(a => `
                  <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <div class="w-12 h-12 rounded-full ${
                      a.tipo === 'usuario' ? 'bg-blue-100 text-blue-600' :
                      a.tipo === 'partida' ? 'bg-green-100 text-green-600' :
                      a.tipo === 'pagamento' ? 'bg-purple-100 text-purple-600' :
                      a.tipo === 'quadra' ? 'bg-orange-100 text-orange-600' :
                      'bg-yellow-100 text-yellow-600'
                    } flex items-center justify-center font-black text-xl">${
                      a.tipo === 'usuario' ? Icons.users :
                      a.tipo === 'partida' ? Icons.soccer :
                      a.tipo === 'pagamento' ? Icons.money :
                      a.tipo === 'quadra' ? Icons.stadium :
                      Icons.trophy
                    }</div>
                    <div class="flex-1">
                      <div class="font-bold text-gray-900">${a.acao}</div>
                      <div class="text-sm text-gray-600">${a.nome}</div>
                    </div>
                    <div class="text-sm text-gray-500">${a.tempo}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- PENDÊNCIAS -->
            <div class="bg-white p-8 rounded-2xl border-2">
              <h3 class="text-2xl font-black mb-6 flex items-center gap-2">
                Pendências 
                <span class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">${pagamentosPendentes.length}</span>
              </h3>
              <div class="space-y-3">
                ${pagamentosPendentes.slice(0, 5).map(p => `
                  <div class="p-4 border-2 rounded-xl hover:shadow-lg transition">
                    <div class="flex justify-between items-start mb-2">
                      <div><div class="font-bold">${p.usuario}</div><div class="text-sm text-gray-600">${p.partida}</div></div>
                      <div class="text-right"><div class="font-black text-xl text-purple-600">R$ ${p.valor}</div></div>
                    </div>
                    <div class="flex gap-2 mt-3">
                      <button class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition text-sm">Aprovar</button>
                      <button class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition text-sm">Rejeitar</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      ` : ''}

      ${currentTab === 'usuarios' ? `
        <div class="bg-white p-8 rounded-2xl border-2">
          <div class="flex justify-between items-center mb-8">
            <h3 class="text-3xl font-black">Gerenciar Usuários</h3>
            <div class="flex gap-3">
              <input type="text" placeholder="Buscar usuário..." class="px-4 py-3 border-2 rounded-xl font-semibold" />
              <select class="px-4 py-3 border-2 rounded-xl font-semibold">
                <option>Todos</option>
                <option>Ativos</option>
                <option>Inativos</option>
                <option>Bloqueados</option>
              </select>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-100 border-b-2">
                <tr>
                  <th class="p-4 text-left font-black">Usuário</th>
                  <th class="p-4 text-left font-black">Email</th>
                  <th class="p-4 text-left font-black">Tipo</th>
                  <th class="p-4 text-left font-black">Partidas</th>
                  <th class="p-4 text-left font-black">Status</th>
                  <th class="p-4 text-left font-black">Ações</th>
                </tr>
              </thead>
              <tbody>
                ${usuarios.map(u => `
                  <tr class="border-b hover:bg-gray-50 transition">
                    <td class="p-4">
                      <div class="flex items-center gap-3">
                        <img src="${u.foto}" class="w-12 h-12 rounded-full border-2" />
                        <div><div class="font-bold">${u.nome}</div><div class="text-sm text-gray-600">${u.posicao}</div></div>
                      </div>
                    </td>
                    <td class="p-4 text-gray-600">${u.email}</td>
                    <td class="p-4"><span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">${u.tipo}</span></td>
                    <td class="p-4 font-black">${u.total_partidas}</td>
                    <td class="p-4"><span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">${u.status}</span></td>
                    <td class="p-4">
                      <div class="flex gap-2">
                        <button class="px-3 py-1 bg-gray-100 rounded-lg font-bold hover:bg-gray-200 text-sm">Editar</button>
                        <button class="px-3 py-1 bg-red-100 text-red-600 rounded-lg font-bold hover:bg-red-200 text-sm">Bloquear</button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

      ${currentTab === 'partidas' ? `
        <div class="bg-white p-8 rounded-2xl border-2">
          <h3 class="text-3xl font-black mb-8">Gerenciar Partidas</h3>
          <div class="space-y-4">
            ${partidasPendentes.map(p => `
              <div class="p-6 border-2 rounded-xl hover:shadow-lg transition">
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="text-2xl font-black mb-2">${p.titulo}</h4>
                    <div class="flex gap-4 text-gray-600 mb-4">
                      <span>${Icons.calendar} ${new Date(p.data_hora).toLocaleDateString('pt-BR')}</span>
                      <span>${Icons.location} ${p.local}</span>
                      <span>${Icons.users} ${p.vagas_totais} vagas</span>
                    </div>
                    <div class="flex gap-3">
                      <span class="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-bold">${p.esporte}</span>
                      <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold">${p.status_admin}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-3xl font-black text-primary mb-2">R$ ${p.valor_individual}</div>
                    <div class="flex gap-2">
                      <button class="px-6 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600">Aprovar</button>
                      <button class="px-6 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600">Rejeitar</button>
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${currentTab === 'quadras' ? `
        <div class="bg-white p-8 rounded-2xl border-2">
          <h3 class="text-3xl font-black mb-8">Gerenciar Quadras</h3>
          <div class="grid md:grid-cols-2 gap-6">
            ${quadrasPendentes.map(q => `
              <div class="border-2 rounded-2xl overflow-hidden hover:shadow-xl transition">
                <img src="${q.foto}" class="w-full h-64 object-cover" />
                <div class="p-6">
                  <h4 class="text-2xl font-black mb-3">${q.nome}</h4>
                  <p class="text-gray-600 mb-4">${q.endereco}</p>
                  <div class="flex justify-between items-center mb-4">
                    <div class="text-3xl font-black text-orange-600">R$ ${q.valor_hora}/h</div>
                    <span class="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-bold">${q.status_admin}</span>
                  </div>
                  <div class="flex gap-3">
                    <button class="flex-1 px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600">Aprovar</button>
                    <button class="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600">Rejeitar</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${currentTab === 'pagamentos' ? `
        <div class="bg-white p-8 rounded-2xl border-2">
          <div class="flex justify-between items-center mb-8">
            <h3 class="text-3xl font-black">Gerenciar Pagamentos</h3>
            <div class="flex gap-3">
              <button class="px-6 py-3 bg-primary text-white rounded-xl font-bold">Pendentes (${pagamentosPendentes.length})</button>
              <button class="px-6 py-3 bg-gray-100 rounded-xl font-bold">Aprovados</button>
              <button class="px-6 py-3 bg-gray-100 rounded-xl font-bold">Rejeitados</button>
            </div>
          </div>
          <div class="space-y-4">
            ${pagamentosPendentes.map(p => `
              <div class="p-6 border-2 rounded-xl hover:shadow-lg transition">
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-4">
                    <div class="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-black">${Icons.money}</div>
                    <div>
                      <div class="font-black text-xl">${p.usuario}</div>
                      <div class="text-gray-600">${p.partida}</div>
                      <div class="text-sm text-gray-500 mt-1">${new Date(p.data).toLocaleDateString('pt-BR')} • ${p.metodo}</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-4xl font-black text-purple-600 mb-3">R$ ${p.valor}</div>
                    <div class="flex gap-2">
                      <button class="px-6 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600">Aprovar</button>
                      <button class="px-6 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600">Rejeitar</button>
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${currentTab === 'relatorios' ? `
        <div class="space-y-8">
          <div class="bg-white p-8 rounded-2xl border-2">
            <h3 class="text-3xl font-black mb-6">Gerar Relatórios</h3>
            <div class="grid md:grid-cols-3 gap-6">
              ${[
                { titulo: 'Relatório Financeiro', desc: 'Receitas, despesas e faturamento', icon: Icons.money, color: 'purple' },
                { titulo: 'Relatório de Usuários', desc: 'Cadastros, atividade e engajamento', icon: Icons.users, color: 'blue' },
                { titulo: 'Relatório de Partidas', desc: 'Estatísticas e desempenho', icon: Icons.soccer, color: 'green' }
              ].map(r => `
                <div class="p-6 border-2 rounded-xl hover:shadow-xl transition cursor-pointer group">
                  <div class="w-16 h-16 bg-${r.color}-100 rounded-xl flex items-center justify-center text-${r.color}-600 text-2xl mb-4 group-hover:scale-110 transition">${r.icon}</div>
                  <h4 class="font-black text-xl mb-2">${r.titulo}</h4>
                  <p class="text-gray-600 mb-4">${r.desc}</p>
                  <button class="w-full px-6 py-3 bg-${r.color}-600 text-white rounded-xl font-bold hover:bg-${r.color}-700">Gerar Relatório</button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      ` : ''}

      ${currentTab === 'config' ? `
        <div class="space-y-6">
          <div class="bg-white p-8 rounded-2xl border-2">
            <h3 class="text-2xl font-black mb-6">Configurações da Plataforma</h3>
            <div class="space-y-6">
              ${[
                { label: 'Modo de Manutenção', desc: 'Ativar para realizar manutenções no sistema' },
                { label: 'Registros Públicos', desc: 'Permitir novos cadastros de usuários' },
                { label: 'Aprovação Automática', desc: 'Aprovar partidas e quadras automaticamente' },
                { label: 'Notificações Email', desc: 'Enviar emails de notificação aos usuários' }
              ].map(c => `
                <label class="flex items-center justify-between p-5 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                  <div><div class="font-bold text-lg">${c.label}</div><div class="text-sm text-gray-600">${c.desc}</div></div>
                  <input type="checkbox" class="w-6 h-6" ${Math.random() > 0.5 ? 'checked' : ''} />
                </label>
              `).join('')}
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
};

console.log('Dashboard Admin expandido e foto de perfil melhorada!');
