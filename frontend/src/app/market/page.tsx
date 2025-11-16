'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { MarketRequest, Sport } from '@/types';
import { getSportEmoji, getSportName, formatDateTime } from '@/lib/utils';

export default function MarketPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<MarketRequest[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<any[]>([]);
  const [selectedSport, setSelectedSport] = useState<Sport | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'requests' | 'players'>('requests');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    loadMarketData();
  }, [selectedSport]);

  const loadMarketData = async () => {
    try {
      setLoading(true);

      // Load open requests
      const requestsResponse = await api.get('/market/requests', {
        params: selectedSport !== 'ALL' ? { sport: selectedSport } : {},
      });
      setRequests(requestsResponse.data);

      // Load available players (mock location for demo)
      // In production, use real geolocation
      const mockLat = -23.5505;
      const mockLng = -46.6333;

      try {
        const playersResponse = await api.get('/market/players', {
          params: {
            latitude: mockLat,
            longitude: mockLng,
            radius: 20,
            ...(selectedSport !== 'ALL' && { sport: selectedSport }),
          },
        });
        setAvailablePlayers(playersResponse.data);
      } catch (err) {
        // Players endpoint might not be fully implemented
        setAvailablePlayers([]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading market data:', error);
      setLoading(false);
    }
  };

  const sports: Array<{ value: Sport | 'ALL'; label: string; emoji: string }> = [
    { value: 'ALL', label: 'Todos', emoji: '🏃' },
    { value: 'FOOTBALL', label: 'Futebol', emoji: '⚽' },
    { value: 'FUTSAL', label: 'Futsal', emoji: '🥅' },
    { value: 'VOLLEYBALL', label: 'Vôlei', emoji: '🏐' },
    { value: 'BASKETBALL', label: 'Basquete', emoji: '🏀' },
    { value: 'TENNIS', label: 'Tênis', emoji: '🎾' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/dashboard" className="text-2xl font-bold text-primary-600">
                🏆 Pelada Fácil
              </Link>
              <p className="text-sm text-gray-600 mt-1">Mercado de Jogadores</p>
            </div>

            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-primary-600 text-sm font-medium"
            >
              ← Voltar
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-accent-500 to-primary-600 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            🎯 Mercado de Jogadores
          </h1>
          <p className="text-white/90 text-lg">
            Encontre jogadores disponíveis ou procure partidas que precisam de você!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-white/80">Solicitações Abertas</p>
              <p className="text-3xl font-bold">{requests.length}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-white/80">Jogadores Disponíveis</p>
              <p className="text-3xl font-bold">{availablePlayers.length}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-white/80">Raio de Busca</p>
              <p className="text-3xl font-bold">20 km</p>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setView('requests')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
              view === 'requests'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📋 Solicitações de Partidas
          </button>
          <button
            onClick={() => setView('players')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
              view === 'players'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            👥 Jogadores Disponíveis
          </button>
        </div>

        {/* Sport Filter */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">Filtrar por Esporte:</p>
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

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Carregando...</div>
          </div>
        ) : (
          <>
            {view === 'requests' ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Solicitações Abertas
                </h2>

                {requests.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <p className="text-4xl mb-4">🔍</p>
                    <p className="text-gray-600 text-lg mb-2">
                      Nenhuma solicitação encontrada
                    </p>
                    <p className="text-gray-500 text-sm">
                      Tente alterar os filtros ou crie uma nova partida
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map((request) => (
                      <div
                        key={request.id}
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-3xl">{getSportEmoji(request.sport)}</span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              request.urgency === 'HIGH'
                                ? 'bg-red-100 text-red-700'
                                : request.urgency === 'MEDIUM'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {request.urgency === 'HIGH'
                              ? '🔥 Urgente'
                              : request.urgency === 'MEDIUM'
                              ? '⚠️ Médio'
                              : '✓ Baixo'}
                          </span>
                        </div>

                        <h3 className="font-bold text-gray-800 mb-2">
                          {request.match.name}
                        </h3>

                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <p>
                            📍 {request.match.locationName}
                            {request.distance && ` (${request.distance.toFixed(1)} km)`}
                          </p>
                          <p>📅 {formatDateTime(request.match.date)}</p>
                          <p>⚽ {getSportName(request.sport)}</p>
                          {request.position && <p>🎯 Posição: {request.position}</p>}
                          <p>
                            💵 R$ {request.match.cost.toFixed(2)} por pessoa
                          </p>
                        </div>

                        <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition">
                          Aceitar Convocação
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Jogadores Disponíveis Próximos
                </h2>

                {availablePlayers.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <p className="text-4xl mb-4">📍</p>
                    <p className="text-gray-600 text-lg mb-2">
                      Nenhum jogador disponível no momento
                    </p>
                    <p className="text-gray-500 text-sm">
                      Tente aumentar o raio de busca ou volte mais tarde
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availablePlayers.map((player) => (
                      <div
                        key={player.id}
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-2xl font-bold">
                            {player.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">{player.name}</h3>
                            <p className="text-sm text-gray-600">
                              {player.city}, {player.state}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Nível</span>
                            <span className="font-semibold text-gray-800">
                              {player.level}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Rating</span>
                            <span className="font-semibold text-gray-800">
                              {player.rating.toFixed(1)} ⭐
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Distância</span>
                            <span className="font-semibold text-gray-800">
                              {player.distance?.toFixed(1)} km
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {player.preferredSports.slice(0, 3).map((sport: Sport) => (
                            <span
                              key={sport}
                              className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium"
                            >
                              {getSportEmoji(sport)} {getSportName(sport)}
                            </span>
                          ))}
                        </div>

                        <button className="w-full bg-accent-600 hover:bg-accent-700 text-white font-semibold py-2 px-4 rounded-lg transition">
                          Convocar Jogador
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-around">
          <Link href="/dashboard" className="flex flex-col items-center text-gray-600">
            <span className="text-2xl">🏠</span>
            <span className="text-xs">Início</span>
          </Link>
          <Link href="/matches" className="flex flex-col items-center text-gray-600">
            <span className="text-2xl">⚽</span>
            <span className="text-xs">Partidas</span>
          </Link>
          <Link href="/market" className="flex flex-col items-center text-primary-600">
            <span className="text-2xl">🎯</span>
            <span className="text-xs font-medium">Mercado</span>
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
