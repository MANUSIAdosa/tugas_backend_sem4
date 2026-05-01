import BaseService from './BaseService.js';

class PointConfigService extends BaseService {
  async getConfigForUser(userId) {
    const agg = await this.prisma.transactions.groupBy({
      by: ['userId'],
      where: { userId, status: 'SUCCESS' },
      _sum: { totalPaid: true }
    });
    const totalSpent = agg[0]?._sum.totalPaid ?? 0;

    const config = await this.prisma.point_configs.findFirst({
      where: { minSpent: { lte: totalSpent } },
      orderBy: { minSpent: 'desc' }
    });

    if (!config) {
      return await this.prisma.point_configs.findUnique({ where: { tierName: 'bronze' } });
    }
    return config;
  }

  async recalculateLevel(userId) {
    const config = await this.getConfigForUser(userId);
    await this.prisma.users.update({
      where: { id: userId },
      data: { level: config.levelNumber }
    });
    return config;
  }

  async getMileage(userId) {
    // Get current tier config
    const currentConfig = await this.getConfigForUser(userId);

    // Get total lifetime spending
    const agg = await this.prisma.transactions.groupBy({
      by: ['userId'],
      where: { userId, status: 'SUCCESS' },
      _sum: { totalPaid: true }
    });
    const totalSpent = agg[0]?._sum.totalPaid ?? 0;

    // Get next tier
    const nextConfig = await this.prisma.point_configs.findFirst({
      where: { minSpent: { gt: currentConfig.minSpent } },
      orderBy: { minSpent: 'asc' }
    });

    // Calculate progress percentage and amount needed
    let progress = 0;
    let amountNeeded = 0;

    if (nextConfig) {
      const tierRange = nextConfig.minSpent - currentConfig.minSpent;
      const spentInTier = totalSpent - currentConfig.minSpent;
      progress = Math.min(100, Math.floor((spentInTier / tierRange) * 100));
      amountNeeded = Math.max(0, nextConfig.minSpent - totalSpent);
    } else {
      progress = 100; // Max tier reached
    }

    return {
      currentTier: currentConfig,
      nextTier: nextConfig,
      totalSpent,
      progress,
      amountNeeded
    };
  }
}

export default PointConfigService;
