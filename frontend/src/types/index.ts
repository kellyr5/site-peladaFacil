export type Sport =
  | 'FOOTBALL'
  | 'FUTSAL'
  | 'VOLLEYBALL'
  | 'BASKETBALL'
  | 'TENNIS'
  | 'PADEL';

export type MatchStatus = 'OPEN' | 'FULL' | 'ONGOING' | 'FINISHED' | 'CANCELLED';

export type MatchType = 'CASUAL' | 'CHAMPIONSHIP';

export type UserRole = 'PLAYER' | 'ADMIN';

export type Position =
  | 'GOALKEEPER'
  | 'DEFENDER'
  | 'MIDFIELDER'
  | 'FORWARD'
  | 'SETTER'
  | 'OPPOSITE'
  | 'OUTSIDE_HITTER'
  | 'MIDDLE_BLOCKER'
  | 'LIBERO'
  | 'POINT_GUARD'
  | 'SHOOTING_GUARD'
  | 'SMALL_FORWARD'
  | 'POWER_FORWARD'
  | 'CENTER'
  | 'SINGLES'
  | 'DOUBLES';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  birthDate?: string;
  bio?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  preferredSports: Sport[];
  preferredPositions: Position[];
  level: number;
  xp: number;
  rating: number;
  totalRatings: number;
  isAvailable: boolean;
  role: UserRole;
  createdAt: string;
}

export interface Match {
  id: string;
  type: MatchType;
  sport: Sport;
  name: string;
  description?: string;
  date: string;
  locationName: string;
  address: string;
  latitude: number;
  longitude: number;
  organizerId: string;
  maxPlayers: number;
  currentPlayers: number;
  cost: number;
  status: MatchStatus;
  organizer: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
  };
  players?: MatchPlayer[];
}

export interface MatchPlayer {
  id: string;
  matchId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
  };
  position?: Position;
  checkedIn: boolean;
  hasPaid: boolean;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  isMVP: boolean;
}

export interface MarketRequest {
  id: string;
  matchId: string;
  requesterId: string;
  sport: Sport;
  position?: Position;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  latitude: number;
  longitude: number;
  radius: number;
  status: 'OPEN' | 'ACCEPTED' | 'CANCELLED';
  distance?: number;
  match: Match;
}

export interface PlayerStats {
  id: string;
  userId: string;
  sport: Sport;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  mvpCount: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: string;
  requirement: any;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
  achievement: Achievement;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  data?: any;
  read: boolean;
  createdAt: string;
}
