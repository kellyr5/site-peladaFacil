import prisma from '../config/database';
import { Sport } from '@prisma/client';

export class StatsService {
  /**
   * Get player statistics by sport
   */
  async getPlayerStats(userId: string, sport?: Sport) {
    if (sport) {
      const stats = await prisma.playerStats.findUnique({
        where: {
          userId_sport: {
            userId,
            sport,
          },
        },
      });

      return stats;
    }

    // Get all sports stats
    const stats = await prisma.playerStats.findMany({
      where: { userId },
    });

    return stats;
  }

  /**
   * Get rankings by sport
   */
  async getRankings(sport: Sport, limit: number = 50) {
    const stats = await prisma.playerStats.findMany({
      where: { sport },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rating: true,
            level: true,
            city: true,
            state: true,
          },
        },
      },
      orderBy: [
        { wins: 'desc' },
        { goals: 'desc' },
      ],
      take: limit,
    });

    return stats.map((stat, index) => ({
      rank: index + 1,
      ...stat,
    }));
  }

  /**
   * Get top scorers by sport
   */
  async getTopScorers(sport: Sport, limit: number = 20) {
    const stats = await prisma.playerStats.findMany({
      where: { sport },
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
      orderBy: {
        goals: 'desc',
      },
      take: limit,
    });

    return stats.map((stat, index) => ({
      rank: index + 1,
      userId: stat.user.id,
      name: stat.user.name,
      avatar: stat.user.avatar,
      rating: stat.user.rating,
      goals: stat.goals,
      matches: stat.matchesPlayed,
      average: stat.matchesPlayed > 0 ? (stat.goals / stat.matchesPlayed).toFixed(2) : '0.00',
    }));
  }

  /**
   * Get player achievements
   */
  async getPlayerAchievements(userId: string) {
    const achievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: {
        unlockedAt: 'desc',
      },
    });

    return achievements;
  }

  /**
   * Get all available achievements
   */
  async getAllAchievements() {
    const achievements = await prisma.achievement.findMany({
      orderBy: {
        type: 'asc',
      },
    });

    return achievements;
  }

  /**
   * Check and unlock achievements for user
   */
  async checkAndUnlockAchievements(userId: string) {
    const stats = await prisma.playerStats.findMany({
      where: { userId },
    });

    const allAchievements = await this.getAllAchievements();
    const unlockedAchievements: string[] = [];

    for (const achievement of allAchievements) {
      const alreadyUnlocked = await prisma.userAchievement.findUnique({
        where: {
          userId_achievementId: {
            userId,
            achievementId: achievement.id,
          },
        },
      });

      if (alreadyUnlocked) continue;

      const requirement = achievement.requirement as any;
      let shouldUnlock = false;

      // Check requirements based on type
      switch (achievement.type) {
        case 'goals':
          const totalGoals = stats.reduce((sum, s) => sum + s.goals, 0);
          shouldUnlock = totalGoals >= requirement.value;
          break;
        case 'matches':
          const totalMatches = stats.reduce((sum, s) => sum + s.matchesPlayed, 0);
          shouldUnlock = totalMatches >= requirement.value;
          break;
        case 'wins':
          const totalWins = stats.reduce((sum, s) => sum + s.wins, 0);
          shouldUnlock = totalWins >= requirement.value;
          break;
      }

      if (shouldUnlock) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
          },
        });

        unlockedAchievements.push(achievement.id);

        // Create notification
        await prisma.notification.create({
          data: {
            userId,
            title: 'Nova Conquista Desbloqueada!',
            message: `Você desbloqueou: ${achievement.name}`,
            type: 'achievement',
            data: {
              achievementId: achievement.id,
            },
          },
        });
      }
    }

    return unlockedAchievements;
  }

  /**
   * Get dashboard stats for user
   */
  async getDashboardStats(userId: string) {
    const stats = await prisma.playerStats.findMany({
      where: { userId },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        level: true,
        xp: true,
        rating: true,
        totalRatings: true,
      },
    });

    const totalMatches = stats.reduce((sum, s) => sum + s.matchesPlayed, 0);
    const totalGoals = stats.reduce((sum, s) => sum + s.goals, 0);
    const totalWins = stats.reduce((sum, s) => sum + s.wins, 0);
    const totalAssists = stats.reduce((sum, s) => sum + s.assists, 0);

    const upcomingMatches = await prisma.matchPlayer.findMany({
      where: {
        userId,
        match: {
          date: {
            gte: new Date(),
          },
          status: {
            in: ['OPEN', 'FULL'],
          },
        },
      },
      include: {
        match: {
          include: {
            organizer: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: {
        match: {
          date: 'asc',
        },
      },
      take: 5,
    });

    const recentMatches = await prisma.matchPlayer.findMany({
      where: {
        userId,
        match: {
          status: 'FINISHED',
        },
      },
      include: {
        match: {
          include: {
            organizer: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: {
        match: {
          date: 'desc',
        },
      },
      take: 5,
    });

    return {
      user,
      summary: {
        totalMatches,
        totalGoals,
        totalWins,
        totalAssists,
        winRate: totalMatches > 0 ? ((totalWins / totalMatches) * 100).toFixed(1) : '0.0',
      },
      upcomingMatches,
      recentMatches,
    };
  }
}

export default new StatsService();
