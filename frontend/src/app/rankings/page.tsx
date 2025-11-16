'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getSportEmoji, getSportName } from '@/lib/utils';

export default function RankingsPage() {
  const [selectedSport, setSelectedSport] = useState('FOOTBALL');

  const sports = [
    { value: 'FOOTBALL', label: 'Futebol', emoji: '⚽' },
    { value: 'FUTSAL', label: 'Futsal', emoji: '🥅' },
    { value: 'VOLLEYBALL', label: 'Vôlei', emoji: '🏐' },
    { value: 'BASKETBALL', label: 'Basquete', emoji: '🏀' },
  ];

  // Mock data
  const topPlayers = Array.from({ length: 10 }, (_, i) => ({
    rank: i + 1,
    name: `Jogador ${i + 1}`,
    goals: 50 - i * 5,
    matches: 30 - i * 2,
    rating: (4.5 - i * 0.1).toFixed(1),
  }));

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/dashboard" className="text-2xl font-bold text-primary-600">
                🏆 Pelada Fácil
              </Link>
              <p className="text-sm text-gray-600 mt-1">Rankings</p>
            </div>
            <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 text-sm font-medium">
              ← Voltar
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">🏆 Rankings</h1>
          <p className="text-white/90 text-lg">Veja os melhores jogadores de cada esporte!</p>
        </div>

        {/* Sport Tabs */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
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

        {/* Rankings Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jogador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gols
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Partidas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topPlayers.map((player) => (
                  <tr key={player.rank} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`text-2xl ${
                            player.rank === 1
                              ? '🥇'
                              : player.rank === 2
                              ? '🥈'
                              : player.rank === 3
                              ? '🥉'
                              : ''
                          }`}
                        >
                          {player.rank <= 3 && (player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : '🥉')}
                        </span>
                        <span className="ml-2 text-sm font-semibold text-gray-900">
                          #{player.rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                          {player.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{player.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {player.goals}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {player.matches}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-yellow-600">
                        {player.rating} ⭐
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
          <Link href="/market" className="flex flex-col items-center text-gray-600">
            <span className="text-2xl">🎯</span>
            <span className="text-xs">Mercado</span>
          </Link>
          <Link href="/rankings" className="flex flex-col items-center text-primary-600">
            <span className="text-2xl">🏆</span>
            <span className="text-xs font-medium">Rankings</span>
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
