index.ts 

/* eslint-disable no-console */
import { PrismaClient, type CefrLevel, type ExerciseType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { categories } from './data/categories';
import { courses } from './data/courses';
import { parseVocabulary, buildExample } from './data/vocabulary';
import { buildLesson } from './generators/lessons';
import { buildExercise } from './generators/exercises';
import { buildBadges } from './generators/badges';

const prisma = new PrismaClient();

const TARGET = {
  categories: 10,
  courses: 30,
  lessons: 120,
  vocabulary: 500,
  exercises: 300,
  flashcards: 200,
  badges: 50,
} as const;

const EXERCISE_CYCLE: ExerciseType[] = [
  'MCQ',
  'FILL_BLANK',
  'TRUE_FALSE',
  'MATCHING',
  'WORD_ORDER',
  'FLASHCARD',
  'SENTENCE_COMPLETION',
  'LISTENING',
  'PRONUNCIATION',
];

/** Generateur pseudo aleatoire deterministe : le seed est reproductible. */
function rng(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

async function reset() {
  console.info('Nettoyage de la base...');
  await prisma.$transaction([
    prisma.answer.deleteMany(),
    prisma.question.deleteMany(),
    prisma.exerciseResult.deleteMany(),
    prisma.exercise.deleteMany(),
    prisma.revisionSession.deleteMany(),
    prisma.favorite.deleteMany(),
    prisma.flashcard.deleteMany(),
    prisma.vocabulary.deleteMany(),
    prisma.progress.deleteMany(),
    prisma.lesson.deleteMany(),
    prisma.course.deleteMany(),
    prisma.category.deleteMany(),
    prisma.achievement.deleteMany(),
    prisma.badge.deleteMany(),
    prisma.dailyGoal.deleteMany(),
    prisma.userStatistics.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}

async function seedUsers() {
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin1234!';
  const demoPassword = process.env.SEED_DEMO_PASSWORD ?? 'Demo1234!';

  const admin = await prisma.user.create({
    data: {
      email: process.env.SEED_ADMIN_EMAIL ?? 'admin@francais-academy.com',
      name: 'Amina Benali',
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: 'ADMIN',
      locale: 'FR',
      level: 'C1',
      xp: 4820,
      streakCurrent: 12,
      streakLongest: 43,
      lastActiveOn: new Date(),
      statistics: { create: {} },
    },
  });

  const demo = await prisma.user.create({
    data: {
      email: process.env.SEED_DEMO_EMAIL ?? 'demo@francais-academy.com',
      name: 'Karim Haddad',
      passwordHash: await bcrypt.hash(demoPassword, 10),
      role: 'USER',
      locale: 'AR',
      level: 'A2',
      xp: 1260,
      streakCurrent: 6,
      streakLongest: 18,
      lastActiveOn: new Date(),
      statistics: { create: {} },
    },
  });

  const extras = [
    { name: 'Leila Mansouri', xp: 3120, level: 'B1' as CefrLevel },
    { name: 'Youssef Ait', xp: 2450, level: 'B1' as CefrLevel },
    { name: 'Nour Chaabane', xp: 1890, level: 'A2' as CefrLevel },
    { name: 'Hicham Ziani', xp: 940, level: 'A1' as CefrLevel },
    { name: 'Sara Bouzid', xp: 620, level: 'A1' as CefrLevel },
  ];

  for (const [index, extra] of extras.entries()) {
    await prisma.user.create({
      data: {
        email: `apprenant${index + 1}@francais-academy.com`,
        name: extra.name,
        passwordHash: await bcrypt.hash('Apprenant1234!', 10),
        locale: index % 2 === 0 ? 'AR' : 'FR',
        level: extra.level,
        xp: extra.xp,
        streakCurrent: 3 + index,
        streakLongest: 10 + index * 2,
        lastActiveOn: new Date(Date.now() - index * 86_400_000),
        statistics: { create: { totalXp: extra.xp } },
      },
    });
  }

  console.info(`Utilisateurs crees : ${extras.length + 2}`);
  return { admin, demo };
}

async function main() {
  const start = Date.now();
  await reset();
  const { demo } = await seedUsers();

  // ------------------------------------------------------------ categories
  const categoryBySlug = new Map<string, string>();
  for (const [index, category] of categories.entries()) {
    const created = await prisma.category.create({
      data: { ...category, position: index },
    });
    categoryBySlug.set(category.slug, created.id);
  }
  console.info(`Categories : ${categories.length}`);

  // ------------------------------------------------------------ vocabulaire disponible
  const corpus = parseVocabulary().slice(0, TARGET.vocabulary);
  const perLesson = Math.floor(corpus.length / TARGET.lessons); // 4
  const remainder = corpus.length - perLesson * TARGET.lessons; // 20

  // ------------------------------------------------------------ cours, lecons, mots, exercices
  const random = rng(20260729);
  let lessonCounter = 0;
  let vocabularyCounter = 0;
  let exerciseCounter = 0;
  const createdLessonIds: string[] = [];
  const createdVocabularyIds: { id: string; categorySlug: string; level: CefrLevel }[] = [];

  for (const [courseIndex, course] of courses.entries()) {
    const categoryId = categoryBySlug.get(course.categorySlug);
    if (!categoryId) throw new Error(`Categorie inconnue : ${course.categorySlug}`);
    const category = categories.find((item) => item.slug === course.categorySlug);
    if (!category) throw new Error(`Categorie introuvable : ${course.categorySlug}`);

    const createdCourse = await prisma.course.create({
      data: {
        slug: course.slug,
        categoryId,
        titleFr: course.titleFr,
        titleAr: course.titleAr,
        descriptionFr: course.descriptionFr,
        descriptionAr: course.descriptionAr,
        level: course.level,
        estimatedMinutes: 4 * (course.level === 'A1' ? 10 : course.level === 'A2' ? 12 : 18),
        position: courseIndex,
        isPublished: true,
        learnerCount: 180 + Math.floor(random() * 3200),
        rating: Number((4.2 + random() * 0.8).toFixed(1)),
      },
    });

    for (const [topicIndex, topic] of course.lessonTopics.entries()) {
      const extra = lessonCounter < remainder ? 1 : 0;
      const slice = corpus.slice(vocabularyCounter, vocabularyCounter + perLesson + extra);
      vocabularyCounter += slice.length;

      const draft = buildLesson({
        courseSlug: course.slug,
        courseTitleFr: course.titleFr,
        courseTitleAr: course.titleAr,
        skill: category.skill,
        level: course.level,
        topic,
        position: topicIndex,
        vocabulary: slice,
      });

      const lesson = await prisma.lesson.create({
        data: {
          courseId: createdCourse.id,
          slug: draft.slug,
          titleFr: draft.titleFr,
          titleAr: draft.titleAr,
          summaryFr: draft.summaryFr,
          summaryAr: draft.summaryAr,
          contentFr: draft.contentFr,
          contentAr: draft.contentAr,
          explanationFr: draft.explanationFr,
          explanationAr: draft.explanationAr,
          examples: draft.examples,
          position: draft.position,
          estimatedMinutes: draft.estimatedMinutes,
          xpReward: draft.xpReward,
        },
      });
      createdLessonIds.push(lesson.id);

      // vocabulaire rattache a la lecon
      for (const entry of slice) {
        const example = buildExample(entry);
        const created = await prisma.vocabulary.create({
          data: {
            wordFr: entry.wordFr,
            translationAr: entry.translationAr,
            gender: entry.gender,
            partOfSpeech: entry.partOfSpeech,
            exampleFr: example.fr,
            exampleAr: example.ar,
            level: course.level,
            courseId: createdCourse.id,
            lessonId: lesson.id,
          },
        });
        createdVocabularyIds.push({
          id: created.id,
          categorySlug: course.categorySlug,
          level: course.level,
        });
      }

      // 2 exercices par lecon, 3 pour les 60 premieres -> 300 au total
      const exerciseCount = lessonCounter < TARGET.exercises - TARGET.lessons * 2 ? 3 : 2;
      for (let position = 0; position < exerciseCount; position += 1) {
        const type = EXERCISE_CYCLE[(lessonCounter + position) % EXERCISE_CYCLE.length] ?? 'MCQ';
        const poolStart = (lessonCounter * 7 + position * 3) % Math.max(1, corpus.length - 8);
        const exercise = buildExercise({
          type,
          position,
          entries: slice.length >= 4 ? slice : corpus.slice(poolStart, poolStart + 4),
          pool: corpus.slice(poolStart, poolStart + 8),
        });

        await prisma.exercise.create({
          data: {
            lessonId: lesson.id,
            type: exercise.type,
            titleFr: exercise.titleFr,
            titleAr: exercise.titleAr,
            instructionsFr: exercise.instructionsFr,
            instructionsAr: exercise.instructionsAr,
            position: exercise.position,
            points: exercise.points,
            passingScore: exercise.passingScore,
            questions: {
              create: exercise.questions.map((question) => ({
                promptFr: question.promptFr,
                promptAr: question.promptAr,
                hintFr: question.hintFr,
                hintAr: question.hintAr,
                explanationFr: question.explanationFr,
                explanationAr: question.explanationAr,
                position: question.position,
                points: question.points,
                answers: { create: question.answers },
              })),
            },
          },
        });
        exerciseCounter += 1;
      }

      lessonCounter += 1;
    }
  }
  console.info(`Cours : ${courses.length} | Lecons : ${lessonCounter} | Mots : ${vocabularyCounter} | Exercices : ${exerciseCounter}`);

  // ------------------------------------------------------------ cartes memoire
  const flashcardSources = createdVocabularyIds.slice(0, TARGET.flashcards);
  const flashcardIds: string[] = [];
  for (const source of flashcardSources) {
    const word = await prisma.vocabulary.findUnique({ where: { id: source.id } });
    if (!word) continue;
    const card = await prisma.flashcard.create({
      data: {
        vocabularyId: word.id,
        categoryId: categoryBySlug.get(source.categorySlug) ?? null,
        frontFr: word.wordFr,
        backAr: word.translationAr,
        hintFr: word.exampleFr,
        level: source.level,
      },
    });
    flashcardIds.push(card.id);
  }
  console.info(`Cartes memoire : ${flashcardIds.length}`);

  // ------------------------------------------------------------ badges
  const badges = buildBadges();
  for (const badge of badges) {
    await prisma.badge.create({ data: badge });
  }
  console.info(`Badges : ${badges.length}`);

  // ------------------------------------------------------------ progression de demonstration
  const demoLessons = createdLessonIds.slice(0, 9);
  for (const [index, lessonId] of demoLessons.entries()) {
    const completed = index < 6;
    await prisma.progress.create({
      data: {
        userId: demo.id,
        lessonId,
        status: completed ? 'COMPLETED' : 'IN_PROGRESS',
        percentage: completed ? 100 : 40,
        timeSpentSeconds: 480 + index * 90,
        ...(completed ? { completedAt: new Date(Date.now() - index * 86_400_000) } : {}),
      },
    });
  }

  const demoCourses = await prisma.course.findMany({ orderBy: { position: 'asc' }, take: 3 });
  for (const [index, course] of demoCourses.entries()) {
    await prisma.progress.create({
      data: {
        userId: demo.id,
        courseId: course.id,
        status: index === 0 ? 'COMPLETED' : 'IN_PROGRESS',
        percentage: index === 0 ? 100 : 50 - index * 10,
        ...(index === 0 ? { completedAt: new Date() } : {}),
      },
    });
  }

  const demoExercises = await prisma.exercise.findMany({
    where: { lessonId: { in: demoLessons } },
    include: { questions: true },
    take: 14,
  });
  for (const [index, exercise] of demoExercises.entries()) {
    const total = Math.max(1, exercise.questions.length);
    const correct = Math.max(1, total - (index % 3));
    const percentage = Math.round((correct / total) * 100);
    await prisma.exerciseResult.create({
      data: {
        userId: demo.id,
        exerciseId: exercise.id,
        score: correct,
        maxScore: total,
        correctCount: correct,
        totalCount: total,
        percentage,
        passed: percentage >= exercise.passingScore,
        durationSeconds: 120 + index * 15,
        xpEarned: percentage === 100 ? 25 : percentage >= 70 ? 15 : 0,
        details: exercise.questions.map((question, questionIndex) => ({
          questionId: question.id,
          correct: questionIndex < correct,
          given: [],
        })),
        createdAt: new Date(Date.now() - index * 43_200_000),
      },
    });
  }

  for (const [index, flashcardId] of flashcardIds.slice(0, 45).entries()) {
    const repetitions = index % 5;
    await prisma.revisionSession.create({
      data: {
        userId: demo.id,
        flashcardId,
        easeFactor: 2.5 - (index % 4) * 0.1,
        intervalDays: repetitions === 0 ? 1 : repetitions * 3,
        repetitions,
        lapses: index % 7 === 0 ? 1 : 0,
        reviewCount: repetitions + 1,
        dueAt: new Date(Date.now() + (index % 6 === 0 ? -86_400_000 : repetitions * 86_400_000)),
        lastGrade: repetitions === 0 ? 'AGAIN' : repetitions > 2 ? 'EASY' : 'GOOD',
        lastReviewedAt: new Date(Date.now() - index * 3_600_000),
      },
    });
  }

  const goalRandom = rng(4242);
  for (let dayOffset = 20; dayOffset >= 0; dayOffset -= 1) {
    const date = new Date(Date.now() - dayOffset * 86_400_000);
    const day = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const achievedXp = Math.floor(goalRandom() * 110);
    await prisma.dailyGoal.create({
      data: {
        userId: demo.id,
        date: day,
        targetXp: 50,
        targetLessons: 1,
        targetMinutes: 15,
        achievedXp,
        achievedLessons: achievedXp > 50 ? 2 : achievedXp > 20 ? 1 : 0,
        achievedMinutes: Math.round(achievedXp / 3),
        completed: achievedXp >= 50,
      },
    });
  }

  await prisma.userStatistics.update({
    where: { userId: demo.id },
    data: {
      totalXp: 1260,
      totalTimeSeconds: 6 * 3600,
      coursesCompleted: 1,
      lessonsCompleted: 6,
      exercisesAttempted: demoExercises.length,
      exercisesPassed: Math.round(demoExercises.length * 0.8),
      flashcardsReviewed: 45,
      perfectScores: 4,
      accuracy: 82,
    },
  });

  const unlockable = await prisma.badge.findMany();
  for (const badge of unlockable) {
    const metric =
      badge.criteria === 'XP_TOTAL'
        ? 1260
        : badge.criteria === 'STREAK_DAYS'
          ? 18
          : badge.criteria === 'LESSONS_COMPLETED'
            ? 6
            : badge.criteria === 'COURSES_COMPLETED'
              ? 1
              : badge.criteria === 'EXERCISES_PASSED'
                ? 11
                : badge.criteria === 'FLASHCARDS_REVIEWED'
                  ? 45
                  : 4;
    if (metric >= badge.threshold) {
      await prisma.achievement.create({
        data: { userId: demo.id, badgeId: badge.id, progress: metric },
      });
    }
  }

  const favouriteCourse = demoCourses[0];
  const favouriteLesson = createdLessonIds[0];
  const favouriteCard = flashcardIds[0];
  if (favouriteCourse) {
    await prisma.favorite.create({
      data: { userId: demo.id, type: 'COURSE', courseId: favouriteCourse.id },
    });
  }
  if (favouriteLesson) {
    await prisma.favorite.create({
      data: { userId: demo.id, type: 'LESSON', lessonId: favouriteLesson },
    });
  }
  if (favouriteCard) {
    await prisma.favorite.create({
      data: { userId: demo.id, type: 'FLASHCARD', flashcardId: favouriteCard },
    });
  }

  // ------------------------------------------------------------ verification finale
  const counts = {
    utilisateurs: await prisma.user.count(),
    categories: await prisma.category.count(),
    cours: await prisma.course.count(),
    lecons: await prisma.lesson.count(),
    mots: await prisma.vocabulary.count(),
    exercices: await prisma.exercise.count(),
    questions: await prisma.question.count(),
    reponses: await prisma.answer.count(),
    cartes: await prisma.flashcard.count(),
    badges: await prisma.badge.count(),
  };

  console.info('--- Contenu genere ---');
  console.table(counts);
  console.info(`Termine en ${((Date.now() - start) / 1000).toFixed(1)} s`);
  console.info(`Admin : ${process.env.SEED_ADMIN_EMAIL ?? 'admin@francais-academy.com'} / ${process.env.SEED_ADMIN_PASSWORD ?? 'Admin1234!'}`);
  console.info(`Demo  : ${process.env.SEED_DEMO_EMAIL ?? 'demo@francais-academy.com'} / ${process.env.SEED_DEMO_PASSWORD ?? 'Demo1234!'}`);
}

main()
  .catch((error) => {
    console.error('Echec du seed :', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
