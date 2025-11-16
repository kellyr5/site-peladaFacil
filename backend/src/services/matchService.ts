import prisma from '../config/database';
import { Sport, MatchType, MatchStatus } from '@prisma/client';

export interface CreateMatchData {
  type: MatchType;
  sport: Sport;
  name: string;
  description?: string;
  date: Date;
  locationName: string;
  address: string;
  latitude: number;
  longitude: number;
  maxPlayers: number;
  cost: number;
}

export class MatchService {
  async createMatch(organizerId: string, data: CreateMatchData) {
    const match = await prisma.match.create({
      data: {
        ...data,
        organizerId,
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rating: true,
          },
        },
        players: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                rating: true,
              },
            },
          },
        },
      },
    });

    return match;
  }

  async getMatches(filters: {
    sport?: Sport;
    status?: MatchStatus;
    latitude?: number;
    longitude?: number;
    radius?: number; // km
  }) {
    const where: any = {};

    if (filters.sport) {
      where.sport = filters.sport;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    // Simple geolocation filter (for production, use PostGIS)
    if (filters.latitude && filters.longitude && filters.radius) {
      const latRange = filters.radius / 111; // 1 degree ~ 111km
      const lngRange = filters.radius / (111 * Math.cos(filters.latitude * Math.PI / 180));

      where.latitude = {
        gte: filters.latitude - latRange,
        lte: filters.latitude + latRange,
      };
      where.longitude = {
        gte: filters.longitude - lngRange,
        lte: filters.longitude + lngRange,
      };
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rating: true,
          },
        },
        players: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                rating: true,
              },
            },
          },
        },
        _count: {
          select: {
            players: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return matches;
  }

  async getMatchById(matchId: string) {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rating: true,
            phone: true,
          },
        },
        players: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                rating: true,
                preferredPositions: true,
              },
            },
          },
        },
        teams: {
          include: {
            matchPlayers: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
        marketRequests: {
          where: {
            status: 'OPEN',
          },
        },
      },
    });

    if (!match) {
      throw new Error('Match not found');
    }

    return match;
  }

  async joinMatch(matchId: string, userId: string) {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        _count: {
          select: {
            players: true,
          },
        },
      },
    });

    if (!match) {
      throw new Error('Match not found');
    }

    if (match.status === 'FULL' || match._count.players >= match.maxPlayers) {
      throw new Error('Match is full');
    }

    if (match.status !== 'OPEN') {
      throw new Error('Match is not open for new players');
    }

    // Check if user already joined
    const existingPlayer = await prisma.matchPlayer.findUnique({
      where: {
        matchId_userId: {
          matchId,
          userId,
        },
      },
    });

    if (existingPlayer) {
      throw new Error('You already joined this match');
    }

    // Add player
    const matchPlayer = await prisma.matchPlayer.create({
      data: {
        matchId,
        userId,
      },
    });

    // Update match player count
    const currentPlayers = match._count.players + 1;
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        currentPlayers,
        status: currentPlayers >= match.maxPlayers ? 'FULL' : 'OPEN',
      },
    });

    return { matchPlayer, match: updatedMatch };
  }

  async leaveMatch(matchId: string, userId: string) {
    const matchPlayer = await prisma.matchPlayer.findUnique({
      where: {
        matchId_userId: {
          matchId,
          userId,
        },
      },
    });

    if (!matchPlayer) {
      throw new Error('You are not in this match');
    }

    await prisma.matchPlayer.delete({
      where: {
        id: matchPlayer.id,
      },
    });

    // Update match
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        _count: {
          select: {
            players: true,
          },
        },
      },
    });

    if (match) {
      await prisma.match.update({
        where: { id: matchId },
        data: {
          currentPlayers: match._count.players,
          status: match._count.players < match.maxPlayers ? 'OPEN' : match.status,
        },
      });
    }

    return { message: 'Left match successfully' };
  }

  async updateMatchStats(matchId: string, playerId: string, stats: {
    goals?: number;
    assists?: number;
    yellowCards?: number;
    redCards?: number;
    isMVP?: boolean;
  }) {
    const matchPlayer = await prisma.matchPlayer.update({
      where: {
        matchId_userId: {
          matchId,
          userId: playerId,
        },
      },
      data: stats,
    });

    return matchPlayer;
  }

  async finishMatch(matchId: string, organizerId: string) {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new Error('Match not found');
    }

    if (match.organizerId !== organizerId) {
      throw new Error('Only organizer can finish the match');
    }

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        status: 'FINISHED',
      },
    });

    // Update player stats
    const players = await prisma.matchPlayer.findMany({
      where: { matchId },
      include: {
        user: true,
      },
    });

    for (const player of players) {
      await this.updatePlayerStats(player.userId, match.sport, {
        goals: player.goals,
        assists: player.assists,
        yellowCards: player.yellowCards,
        redCards: player.redCards,
        mvpCount: player.isMVP ? 1 : 0,
      });
    }

    return updatedMatch;
  }

  private async updatePlayerStats(userId: string, sport: Sport, stats: {
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    mvpCount: number;
  }) {
    const existingStats = await prisma.playerStats.findUnique({
      where: {
        userId_sport: {
          userId,
          sport,
        },
      },
    });

    if (existingStats) {
      await prisma.playerStats.update({
        where: {
          userId_sport: {
            userId,
            sport,
          },
        },
        data: {
          matchesPlayed: { increment: 1 },
          goals: { increment: stats.goals },
          assists: { increment: stats.assists },
          yellowCards: { increment: stats.yellowCards },
          redCards: { increment: stats.redCards },
          mvpCount: { increment: stats.mvpCount },
        },
      });
    } else {
      await prisma.playerStats.create({
        data: {
          userId,
          sport,
          matchesPlayed: 1,
          ...stats,
        },
      });
    }
  }
}

export default new MatchService();
