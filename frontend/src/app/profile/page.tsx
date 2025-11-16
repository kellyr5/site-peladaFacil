'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { User } from '@/types';
import { getSportEmoji, getSportName } from '@/lib/utils';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading profile:', error);
      router.push('/auth/login');
    }
  };

  const toggleAvailability = async () => {
    try {
      const response = await api.put('/auth/profile', {
        isAvailable: !user?.isAvailable,
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/dashboard" className="text-2xl font-bold text-primary-600">
                🏆 Pelada Fácil
              </Link>
              <p className="text-sm text-gray-600 mt-1">Meu Perfil</p>
            </div>
            <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 text-sm font-medium">
              ← Voltar
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-4xl font-bold">
              {user?.name.charAt(0)}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{user?.name}</h1>
              <p className="text-gray-600 mb-4">{user?.email}</p>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                  Nível {user?.level}
                </span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                  {user?.rating.toFixed(1)} ⭐
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  user?.isAvailable
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {user?.isAvailable ? '✓ Disponível' : '✗ Indisponível'}
                </span>
              </div>

              <button
                onClick={toggleAvailability}
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                {user?.isAvailable ? 'Marcar como Indisponível' : 'Marcar como Disponível'}
              </button>
            </div>
          </div>

          {user?.bio && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-700">{user.bio}</p>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-600 text-sm mb-2">XP</p>
            <p className="text-3xl font-bold text-primary-600">{user?.xp}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-600 text-sm mb-2">Rating</p>
            <p className="text-3xl font-bold text-yellow-600">{user?.rating.toFixed(1)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-600 text-sm mb-2">Avaliações</p>
            <p className="text-3xl font-bold text-gray-800">{user?.totalRatings}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-600 text-sm mb-2">Nível</p>
            <p className="text-3xl font-bold text-accent-600">{user?.level}</p>
          </div>
        </div>

        {/* Preferred Sports */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Esportes Preferidos</h2>
          {user?.preferredSports && user.preferredSports.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.preferredSports.map((sport) => (
                <span
                  key={sport}
                  className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg font-semibold"
                >
                  {getSportEmoji(sport)} {getSportName(sport)}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nenhum esporte selecionado</p>
          )}
        </div>

        {/* Location */}
        {user?.city && user?.state && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Localização</h2>
            <p className="text-gray-700">📍 {user.city}, {user.state}</p>
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
          <Link href="/profile" className="flex flex-col items-center text-primary-600">
            <span className="text-2xl">👤</span>
            <span className="text-xs font-medium">Perfil</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
