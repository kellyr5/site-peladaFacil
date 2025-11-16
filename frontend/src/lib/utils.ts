import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function getSportEmoji(sport: string): string {
  const sportEmojis: { [key: string]: string } = {
    FOOTBALL: '⚽',
    FUTSAL: '🥅',
    VOLLEYBALL: '🏐',
    BASKETBALL: '🏀',
    TENNIS: '🎾',
    PADEL: '🎾',
  };
  return sportEmojis[sport] || '🏃';
}

export function getSportName(sport: string): string {
  const sportNames: { [key: string]: string } = {
    FOOTBALL: 'Futebol',
    FUTSAL: 'Futsal',
    VOLLEYBALL: 'Vôlei',
    BASKETBALL: 'Basquete',
    TENNIS: 'Tênis',
    PADEL: 'Padel',
  };
  return sportNames[sport] || sport;
}

export function getMatchStatusBadge(status: string): { text: string; color: string } {
  const statuses: { [key: string]: { text: string; color: string } } = {
    OPEN: { text: 'Aberto', color: 'bg-green-500' },
    FULL: { text: 'Lotado', color: 'bg-yellow-500' },
    ONGOING: { text: 'Em Andamento', color: 'bg-blue-500' },
    FINISHED: { text: 'Finalizado', color: 'bg-gray-500' },
    CANCELLED: { text: 'Cancelado', color: 'bg-red-500' },
  };
  return statuses[status] || { text: status, color: 'bg-gray-500' };
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
