import { statsRepository } from '@/repositories/stats.repository';
import { userRepository } from '@/repositories/user.repository';
import { toIsoDate } from '@/utils/date';

export const statisticsService = {
  platform() {
    return statsRepository.platformTotals();
  },

  async admin() {
    const [overview, signups, levels, top] = await Promise.all([
      statsRepository.adminOverview(),
      statsRepository.signupsByDay(30),
      statsRepository.levelDistribution(),
      userRepository.leaderboard(5),
    ]);

    const byDay = new Map<string, number>();
    for (const row of signups) {
      const key = toIsoDate(row.createdAt);
      byDay.set(key, (byDay.get(key) ?? 0) + 1);
    }

    return {
      ...overview,
      signups: [...byDay.entries()].map(([date, count]) => ({ date, count })),
      levels: levels.map((row) => ({ level: row.level, count: row._count._all })),
      topLearners: top,
    };
  },
};
