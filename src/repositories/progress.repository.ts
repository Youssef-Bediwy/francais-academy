import { Prisma, ProgressStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export const progressRepository = {
  findForCourses(userId: string, courseIds: string[]) {
    return prisma.progress.findMany({
      where: { userId, courseId: { in: courseIds } },
    });
  },

  findForCourse(userId: string, courseId: string) {
    return prisma.progress.findUnique({ where: { userId_courseId: { userId, courseId } } });
  },

  findForLessons(userId: string, lessonIds: string[]) {
    return prisma.progress.findMany({ where: { userId, lessonId: { in: lessonIds } } });
  },

  findForLesson(userId: string, lessonId: string) {
    return prisma.progress.findUnique({ where: { userId_lessonId: { userId, lessonId } } });
  },

  upsertLesson(
    userId: string,
    lessonId: string,
    data: { status: ProgressStatus; percentage: number; timeSpentSeconds: number },
  ) {
    const completed = data.status === ProgressStatus.COMPLETED;
    return prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: {
        userId,
        lessonId,
        status: data.status,
        percentage: data.percentage,
        timeSpentSeconds: data.timeSpentSeconds,
        ...(completed ? { completedAt: new Date() } : {}),
      },
      update: {
        status: data.status,
        percentage: data.percentage,
        timeSpentSeconds: { increment: data.timeSpentSeconds },
        lastViewedAt: new Date(),
        ...(completed ? { completedAt: new Date() } : {}),
      },
    });
  },

  upsertCourse(
    userId: string,
    courseId: string,
    data: { status: ProgressStatus; percentage: number },
  ) {
    const completed = data.status === ProgressStatus.COMPLETED;
    return prisma.progress.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: { userId, courseId, status: data.status, percentage: data.percentage },
      update: {
        status: data.status,
        percentage: data.percentage,
        lastViewedAt: new Date(),
        ...(completed ? { completedAt: new Date() } : {}),
      },
    });
  },

  completedLessonIdsForCourse(userId: string, courseId: string) {
    return prisma.progress.findMany({
      where: { userId, status: ProgressStatus.COMPLETED, lesson: { courseId } },
      select: { lessonId: true },
    });
  },

  countCompletedLessons(userId: string) {
    return prisma.progress.count({
      where: { userId, status: ProgressStatus.COMPLETED, lessonId: { not: null } },
    });
  },

  countCompletedCourses(userId: string) {
    return prisma.progress.count({
      where: { userId, status: ProgressStatus.COMPLETED, courseId: { not: null } },
    });
  },

  totalTimeSpent(userId: string) {
    return prisma.progress.aggregate({ where: { userId }, _sum: { timeSpentSeconds: true } });
  },

  recentActivity(userId: string, take = 8) {
    return prisma.progress.findMany({
      where: { userId, lessonId: { not: null } },
      include: { lesson: { select: { titleFr: true, titleAr: true, xpReward: true } } },
      orderBy: { lastViewedAt: 'desc' },
      take,
    });
  },

  addTime(userId: string, lessonId: string, seconds: number) {
    return prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: {
        userId,
        lessonId,
        status: ProgressStatus.IN_PROGRESS,
        percentage: 10,
        timeSpentSeconds: seconds,
      },
      update: { timeSpentSeconds: { increment: seconds }, lastViewedAt: new Date() },
    });
  },

  raw(): Prisma.ProgressDelegate {
    return prisma.progress;
  },
};
