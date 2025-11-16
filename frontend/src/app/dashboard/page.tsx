'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { User } from '@/types';
import { formatDate, getSportEmoji, getMatchStatusBadge } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      // Check if logged in
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      // Load user profile
      const userResponse = await api.get('/auth/profile');
      setUser(userResponse.data);

      // Note: Dashboard stats endpoint would be implemented in backend
      // For now, we'll show basic UI

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      router.push('/auth/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-primary-600">🏆 Pelada Fácil</h1>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-primary-600 font-semibold">
                Dashboard
              </Link>
              <Link href="/matches" className="text-gray-600 hover:text-primary-600 transition">
                Partidas
              </Link>
              <Link href="/market" className="text-gray-600 hover:text-primary-600 transition">
                Mercado
              </Link>
              <Link href="/rankings" className="text-gray-600 hover:text-primary-600 transition">
                Rankings
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-primary-600 transition">
                Perfil
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white font-bold">
                  {user?.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">Nível {user?.level}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 text-sm font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-500 to-accent-600 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Bem-vindo, {user?.name.split(' ')[0]}! 👋
          </h2>
          <p className="text-white/90">
            Pronto para mais uma partida épica?
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-white/80">Nível</p>
              <p className="text-3xl font-bold">{user?.level}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-white/80">XP</p>
              <p className="text-3xl font-bold">{user?.xp}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-white/80">Rating</p>
              <p className="text-3xl font-bold">{user?.rating.toFixed(1)} ⭐</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-white/80">Avaliações</p>
              <p className="text-3xl font-bold">{user?.totalRatings}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/matches/create"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                ⚽
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Criar Partida</h3>
                <p className="text-sm text-gray-600">Organize um jogo</p>
              </div>
            </div>
          </Link>

          <Link
            href="/market"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                🎯
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Mercado de Jogadores</h3>
                <p className="text-sm text-gray-600">Encontre jogadores</p>
              </div>
            </div>
          </Link>

          <Link
            href="/rankings"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                🏆
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Rankings</h3>
                <p className="text-sm text-gray-600">Veja sua posição</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Matches */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Próximas Partidas
            </h3>

            <div className="text-center py-12 text-gray-500">
              <p className="text-4xl mb-4">📅</p>
              <p>Nenhuma partida agendada</p>
              <Link
                href="/matches"
                className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-semibold"
              >
                Encontrar Partidas
              </Link>
            </div>
          </div>

          {/* Your Stats */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Suas Estatísticas
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Partidas Jogadas</span>
                <span className="font-bold text-gray-800">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Gols Marcados</span>
                <span className="font-bold text-gray-800">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Assistências</span>
                <span className="font-bold text-gray-800">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Vitórias</span>
                <span className="font-bold text-gray-800">0</span>
              </div>

              <Link
                href="/profile"
                className="block w-full text-center py-2 mt-4 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition font-semibold"
              >
                Ver Perfil Completo
              </Link>
            </div>
          </div>
        </div>

        {/* Achievements Preview */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Conquistas Recentes 🏅
          </h3>

          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-4">🎯</p>
            <p>Jogue partidas para desbloquear conquistas!</p>
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-around">
          <Link href="/dashboard" className="flex flex-col items-center text-primary-600">
            <span className="text-2xl">🏠</span>
            <span className="text-xs font-medium">Início</span>
          </Link>
          <Link href="/matches" className="flex flex-col items-center text-gray-600">
            <span className="text-2xl">⚽</span>
            <span className="text-xs">Partidas</span>
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
