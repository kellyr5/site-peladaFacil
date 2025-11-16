'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Match, Sport, MatchStatus } from '@/types';
import { getSportEmoji, getSportName, formatDateTime, getMatchStatusBadge, formatCurrency } from '@/lib/utils';

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedSport, setSelectedSport] = useState<Sport | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<MatchStatus | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    loadMatches();
  }, [selectedSport, selectedStatus]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedSport !== 'ALL') params.sport = selectedSport;
      if (selectedStatus !== 'ALL') params.status = selectedStatus;

      const response = await api.get('/matches', { params });
      setMatches(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading matches:', error);
      setLoading(false);
    }
  };

  const handleJoinMatch = async (matchId: string) => {
    try {
      await api.post(`/matches/${matchId}/join`);
      alert('Você entrou na partida com sucesso!');
      loadMatches();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao entrar na partida');
    }
  };

  const sports: Array<{ value: Sport | 'ALL'; label: string; emoji: string }> = [
    { value: 'ALL', label: 'Todos', emoji: '🏃' },
    { value: 'FOOTBALL', label: 'Futebol', emoji: '⚽' },
    { value: 'FUTSAL', label: 'Futsal', emoji: '🥅' },
    { value: 'VOLLEYBALL', label: 'Vôlei', emoji: '🏐' },
    { value: 'BASKETBALL', label: 'Basquete', emoji: '🏀' },
  ];

  const statuses: Array<{ value: MatchStatus | 'ALL'; label: string }> = [
    { value: 'ALL', label: 'Todos' },
    { value: 'OPEN', label: 'Abertos' },
    { value: 'FULL', label: 'Lotados' },
    { value: 'FINISHED', label: 'Finalizados' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/dashboard" className="text-2xl font-bold text-primary-600">
                🏆 Pelada Fácil
              </Link>
              <p className="text-sm text-gray-600 mt-1">Partidas Disponíveis</p>
            </div>
            <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 text-sm font-medium">
              ← Voltar
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-primary-500 to-accent-600 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">⚽ Partidas</h1>
          <p className="text-white/90 text-lg">Encontre e participe de partidas próximas a você!</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Esporte:</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {sports.map((sport) => (
                <button
                  key={sport.value}
                  onClick={() => setSelectedSport(sport.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                    selectedSport === sport.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{sport.emoji}</span>
                  <span className="text-sm font-medium">{sport.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Status:</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {statuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setSelectedStatus(status.value)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                    selectedStatus === status.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-sm font-medium">{status.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Matches Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Carregando partidas...</div>
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-gray-600 text-lg mb-2">Nenhuma partida encontrada</p>
            <p className="text-gray-500 text-sm">Tente alterar os filtros</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => {
              const statusBadge = getMatchStatusBadge(match.status);
              const spotsLeft = match.maxPlayers - match.currentPlayers;

              return (
                <div key={match.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{getSportEmoji(match.sport)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${statusBadge.color}`}>
                      {statusBadge.text}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-800 text-lg mb-2">{match.name}</h3>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>📍 {match.locationName}</p>
                    <p>📅 {formatDateTime(match.date)}</p>
                    <p>⚽ {getSportName(match.sport)}</p>
                    <p>👥 {match.currentPlayers}/{match.maxPlayers} jogadores</p>
                    {spotsLeft > 0 && (
                      <p className="text-green-600 font-semibold">
                        ✓ {spotsLeft} vaga{spotsLeft > 1 ? 's' : ''} disponível{spotsLeft > 1 ? 'is' : ''}
                      </p>
                    )}
                    <p>💵 {formatCurrency(match.cost)}</p>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-700">
                      {match.organizer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Organizador</p>
                      <p className="text-sm font-semibold text-gray-700">{match.organizer.name}</p>
                    </div>
                  </div>

                  {match.status === 'OPEN' && (
                    <button
                      onClick={() => handleJoinMatch(match.id)}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                      Entrar na Partida
                    </button>
                  )}
                  {match.status === 'FULL' && (
                    <button disabled className="w-full bg-gray-300 text-gray-500 font-semibold py-2 px-4 rounded-lg cursor-not-allowed">
                      Lotado
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-around">
          <Link href="/dashboard" className="flex flex-col items-center text-gray-600">
            <span className="text-2xl">🏠</span>
            <span className="text-xs">Início</span>
          </Link>
          <Link href="/matches" className="flex flex-col items-center text-primary-600">
            <span className="text-2xl">⚽</span>
            <span className="text-xs font-medium">Partidas</span>
          </Link>
          <Link href="/market" className="flex flex-col items-center text-gray-600">
            <span className="text-2xl">🎯</span>
            <span className="text-xs">Mercado</span>
          </Link>
          <Link href="/rankings" className="flex flex-col items-center text-gray-600">
            <span className="text-2xl">🏆</span>
            <span className="text-xs">Rankings</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-600">
            <span className="text-2xl">👤</span>
            <span className="text-xs">Perfil</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
