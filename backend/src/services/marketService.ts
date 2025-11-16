import prisma from '../config/database';
import { Sport, Position, RequestUrgency } from '@prisma/client';

export interface CreateMarketRequestData {
  matchId: string;
  sport: Sport;
  position?: Position;
  urgency: RequestUrgency;
  radius?: number; // km, default 10
}

export class MarketService {
  /**
   * Criar solicitação no Mercado de Jogadores
   * Quando um organizador precisa de jogadores para completar o time
   */
  async createRequest(requesterId: string, data: CreateMarketRequestData) {
    // Get match info
    const match = await prisma.match.findUnique({
      where: { id: data.matchId },
    });

    if (!match) {
      throw new Error('Match not found');
    }

    if (match.organizerId !== requesterId) {
      throw new Error('Only match organizer can create market requests');
    }

    // Create market request
    const request = await prisma.marketRequest.create({
      data: {
        matchId: data.matchId,
        requesterId,
        sport: data.sport,
        position: data.position,
        urgency: data.urgency,
        latitude: match.latitude,
        longitude: match.longitude,
        radius: data.radius || 10,
      },
      include: {
        match: {
          include: {
            organizer: {
              select: {
                id: true,
                name: true,
                avatar: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    // Find and notify available players nearby
    await this.notifyNearbyPlayers(request.id);

    return request;
  }

  /**
   * Buscar jogadores disponíveis próximos
   * Para exibir no mapa do Mercado de Jogadores
   */
  async findAvailablePlayers(filters: {
    sport?: Sport;
    position?: Position;
    latitude: number;
    longitude: number;
    radius?: number; // km, default 10
    minRating?: number;
  }) {
    const radius = filters.radius || 10;
    const latRange = radius / 111; // 1 degree ~ 111km
    const lngRange = radius / (111 * Math.cos(filters.latitude * Math.PI / 180));

    const where: any = {
      isAvailable: true,
      latitude: {
        gte: filters.latitude - latRange,
        lte: filters.latitude + latRange,
      },
      longitude: {
        gte: filters.longitude - lngRange,
        lte: filters.longitude + lngRange,
      },
    };

    if (filters.sport) {
      where.preferredSports = {
        has: filters.sport,
      };
    }

    if (filters.position) {
      where.preferredPositions = {
        has: filters.position,
      };
    }

    if (filters.minRating) {
      where.rating = {
        gte: filters.minRating,
      };
    }

    const players = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        avatar: true,
        rating: true,
        totalRatings: true,
        level: true,
        latitude: true,
        longitude: true,
        preferredSports: true,
        preferredPositions: true,
        city: true,
        state: true,
      },
      take: 50, // Limit results
    });

    // Calculate distance for each player
    const playersWithDistance = players.map(player => ({
      ...player,
      distance: this.calculateDistance(
        filters.latitude,
        filters.longitude,
        player.latitude!,
        player.longitude!
      ),
    }));

    // Sort by distance
    playersWithDistance.sort((a, b) => a.distance - b.distance);

    return playersWithDistance;
  }

  /**
   * Convocar jogador para partida
   * O organizador envia convite para um jogador específico
   */
  async invitePlayer(requestId: string, playerId: string, requesterId: string) {
    const request = await prisma.marketRequest.findUnique({
      where: { id: requestId },
      include: {
        match: true,
      },
    });

    if (!request) {
      throw new Error('Market request not found');
    }

    if (request.requesterId !== requesterId) {
      throw new Error('Only requester can invite players');
    }

    if (request.status !== 'OPEN') {
      throw new Error('Request is not open');
    }

    // Check if player is available
    const player = await prisma.user.findUnique({
      where: { id: playerId },
    });

    if (!player || !player.isAvailable) {
      throw new Error('Player is not available');
    }

    // Update request
    const updatedRequest = await prisma.marketRequest.update({
      where: { id: requestId },
      data: {
        responderId: playerId,
        status: 'ACCEPTED',
      },
    });

    // Add player to match
    await prisma.matchPlayer.create({
      data: {
        matchId: request.matchId,
        userId: playerId,
        position: request.position,
      },
    });

    // Update match player count
    const match = await prisma.match.findUnique({
      where: { id: request.matchId },
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
        where: { id: request.matchId },
        data: {
          currentPlayers: match._count.players + 1,
          status: match._count.players + 1 >= match.maxPlayers ? 'FULL' : match.status,
        },
      });
    }

    // Create notification for player
    await prisma.notification.create({
      data: {
        userId: playerId,
        title: 'Convocação para Partida!',
        message: `Você foi convocado para jogar ${request.sport} em ${match?.locationName}`,
        type: 'market_request',
        data: {
          requestId: request.id,
          matchId: request.matchId,
        },
      },
    });

    return updatedRequest;
  }

  /**
   * Buscar solicitações abertas no mercado
   * Para jogadores que querem encontrar partidas
   */
  async getOpenRequests(filters: {
    sport?: Sport;
    latitude?: number;
    longitude?: number;
    radius?: number;
  }) {
    const where: any = {
      status: 'OPEN',
    };

    if (filters.sport) {
      where.sport = filters.sport;
    }

    // Geolocation filter
    if (filters.latitude && filters.longitude) {
      const radius = filters.radius || 10;
      const latRange = radius / 111;
      const lngRange = radius / (111 * Math.cos(filters.latitude * Math.PI / 180));

      where.latitude = {
        gte: filters.latitude - latRange,
        lte: filters.latitude + latRange,
      };
      where.longitude = {
        gte: filters.longitude - lngRange,
        lte: filters.longitude + lngRange,
      };
    }

    const requests = await prisma.marketRequest.findMany({
      where,
      include: {
        match: {
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
          },
        },
        requester: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Add distance if coordinates provided
    if (filters.latitude && filters.longitude) {
      return requests.map(req => ({
        ...req,
        distance: this.calculateDistance(
          filters.latitude!,
          filters.longitude!,
          req.latitude,
          req.longitude
        ),
      }));
    }

    return requests;
  }

  /**
   * Cancelar solicitação do mercado
   */
  async cancelRequest(requestId: string, requesterId: string) {
    const request = await prisma.marketRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new Error('Request not found');
    }

    if (request.requesterId !== requesterId) {
      throw new Error('Only requester can cancel the request');
    }

    const updatedRequest = await prisma.marketRequest.update({
      where: { id: requestId },
      data: {
        status: 'CANCELLED',
      },
    });

    return updatedRequest;
  }

  /**
   * Notificar jogadores próximos sobre nova solicitação
   */
  private async notifyNearbyPlayers(requestId: string) {
    const request = await prisma.marketRequest.findUnique({
      where: { id: requestId },
      include: {
        match: true,
      },
    });

    if (!request) return;

    // Find players nearby
    const players = await this.findAvailablePlayers({
      sport: request.sport,
      position: request.position || undefined,
      latitude: request.latitude,
      longitude: request.longitude,
      radius: request.radius,
    });

    // Create notifications for top 10 players
    const notificationPromises = players.slice(0, 10).map(player =>
      prisma.notification.create({
        data: {
          userId: player.id,
          title: 'Nova Partida Disponível!',
          message: `Partida de ${request.sport} precisando de jogadores a ${player.distance.toFixed(1)}km de você`,
          type: 'market_request',
          data: {
            requestId: request.id,
            matchId: request.matchId,
            distance: player.distance,
          },
        },
      })
    );

    await Promise.all(notificationPromises);
  }

  /**
   * Calcular distância entre dois pontos (Haversine formula)
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of Earth in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export default new MarketService();
