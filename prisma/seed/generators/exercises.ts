import type { ExerciseType } from '@prisma/client';
import { buildExample, type VocabularyEntry } from '../data/vocabulary';

export interface AnswerDraft {
  textFr: string;
  textAr: string | null;
  isCorrect: boolean;
  matchKey: string | null;
  position: number;
}

export interface QuestionDraft {
  promptFr: string;
  promptAr: string;
  hintFr: string | null;
  hintAr: string | null;
  explanationFr: string;
  explanationAr: string;
  position: number;
  points: number;
  answers: AnswerDraft[];
}

export interface ExerciseDraft {
  type: ExerciseType;
  titleFr: string;
  titleAr: string;
  instructionsFr: string;
  instructionsAr: string;
  position: number;
  points: number;
  passingScore: number;
  questions: QuestionDraft[];
}

const META: Record<ExerciseType, { titleFr: string; titleAr: string; instrFr: string; instrAr: string }> = {
  MCQ: {
    titleFr: 'QCM de vocabulaire',
    titleAr: 'اختيار من متعدد في المفردات',
    instrFr: 'Choisissez la traduction arabe correcte pour chaque mot francais.',
    instrAr: 'اختر الترجمة العربية الصحيحة لكل كلمة فرنسية.',
  },
  FLASHCARD: {
    titleFr: 'Cartes memoire inversees',
    titleAr: 'بطاقات معكوسة',
    instrFr: 'Retrouvez le mot francais correspondant au mot arabe propose.',
    instrAr: 'ابحث عن الكلمة الفرنسية المقابلة للكلمة العربية.',
  },
  FILL_BLANK: {
    titleFr: 'Texte a trous',
    titleAr: 'املأ الفراغ',
    instrFr: 'Completez chaque phrase avec le mot manquant, sans article supplementaire.',
    instrAr: 'أكمل كل جملة بالكلمة الناقصة دون إضافة أدوات.',
  },
  MATCHING: {
    titleFr: 'Association francais / arabe',
    titleAr: 'توصيل فرنسي / عربي',
    instrFr: 'Associez chaque mot francais a sa traduction arabe.',
    instrAr: 'اربط كل كلمة فرنسية بترجمتها العربية.',
  },
  WORD_ORDER: {
    titleFr: 'Remettre les mots en ordre',
    titleAr: 'ترتيب الكلمات',
    instrFr: 'Reconstituez la phrase correcte en deplacant les mots.',
    instrAr: 'أعد بناء الجملة الصحيحة بتحريك الكلمات.',
  },
  TRUE_FALSE: {
    titleFr: 'Vrai ou faux',
    titleAr: 'صح أو خطأ',
    instrFr: 'Indiquez si la traduction proposee est correcte.',
    instrAr: 'حدّد إن كانت الترجمة المقترحة صحيحة.',
  },
  SENTENCE_COMPLETION: {
    titleFr: 'Completer la phrase',
    titleAr: 'أكمل الجملة',
    instrFr: 'Ecrivez le mot attendu pour que la phrase soit complete et correcte.',
    instrAr: 'اكتب الكلمة المطلوبة لتكون الجملة كاملة وصحيحة.',
  },
  LISTENING: {
    titleFr: 'Comprehension a l ecoute',
    titleAr: 'الفهم السماعي',
    instrFr: 'Lisez la phrase entendue puis choisissez ce qu elle signifie.',
    instrAr: 'اقرأ الجملة المسموعة ثم اختر معناها.',
  },
  PRONUNCIATION: {
    titleFr: 'Prononcer puis ecrire',
    titleAr: 'انطق ثم اكتب',
    instrFr: 'Prononcez le mot a voix haute, puis ecrivez-le sans le regarder.',
    instrAr: 'انطق الكلمة بصوت عالٍ ثم اكتبها دون النظر إليها.',
  },
};

const answer = (textFr: string, isCorrect: boolean, position: number, textAr: string | null = null, matchKey: string | null = null): AnswerDraft => ({
  textFr,
  textAr,
  isCorrect,
  matchKey,
  position,
});

function distractors(pool: VocabularyEntry[], exclude: string, count: number): VocabularyEntry[] {
  return pool.filter((entry) => entry.wordFr !== exclude).slice(0, count);
}

function buildQuestions(
  type: ExerciseType,
  entries: VocabularyEntry[],
  pool: VocabularyEntry[],
): QuestionDraft[] {
  if (type === 'MATCHING') {
    const selection = entries.slice(0, 4);
    return [
      {
        promptFr: 'Associez chaque mot a sa traduction.',
        promptAr: 'اربط كل كلمة بترجمتها.',
        hintFr: null,
        hintAr: null,
        explanationFr: `Traductions attendues : ${selection
          .map((entry) => `${entry.wordFr} = ${entry.translationAr}`)
          .join(' ; ')}.`,
        explanationAr: `الترجمات الصحيحة: ${selection
          .map((entry) => `${entry.wordFr} = ${entry.translationAr}`)
          .join(' ؛ ')}.`,
        position: 0,
        points: 4,
        answers: selection.map((entry, index) =>
          answer(entry.wordFr, true, index, entry.translationAr, entry.translationAr),
        ),
      },
    ];
  }

  return entries.slice(0, 5).map((entry, index) => {
    const example = buildExample(entry);
    const wrong = distractors(pool, entry.wordFr, 3);

    if (type === 'FILL_BLANK') {
      const gapped = example.fr.replace(entry.wordFr, '_____');
      return {
        promptFr: gapped,
        promptAr: `أكمل: ${gapped}`,
        hintFr: `Traduction : ${entry.translationAr}`,
        hintAr: `الترجمة: ${entry.translationAr}`,
        explanationFr: `Le mot attendu est « ${entry.wordFr} » (${entry.translationAr}).`,
        explanationAr: `الكلمة المطلوبة هي « ${entry.wordFr} » أي ${entry.translationAr}.`,
        position: index,
        points: 1,
        answers: [answer(entry.wordFr, true, 0, entry.translationAr)],
      };
    }

    if (type === 'SENTENCE_COMPLETION') {
      return {
        promptFr: `Completez : ${example.fr.replace(entry.wordFr, '...')}`,
        promptAr: `أكمل: ${example.ar}`,
        hintFr: `Le mot commence par « ${entry.wordFr.charAt(0)} ».`,
        hintAr: `تبدأ الكلمة بحرف « ${entry.wordFr.charAt(0)} ».`,
        explanationFr: `Phrase complete : ${example.fr}`,
        explanationAr: `الجملة الكاملة: ${example.fr}`,
        position: index,
        points: 1,
        answers: [answer(entry.wordFr, true, 0, entry.translationAr)],
      };
    }

    if (type === 'PRONUNCIATION') {
      return {
        promptFr: `Prononcez puis ecrivez le mot qui signifie « ${entry.translationAr} ».`,
        promptAr: `انطق ثم اكتب الكلمة التي تعني « ${entry.translationAr} ».`,
        hintFr: `${entry.wordFr.length} lettres, commence par « ${entry.wordFr.charAt(0)} ».`,
        hintAr: `${entry.wordFr.length} حرفًا، تبدأ بـ « ${entry.wordFr.charAt(0)} ».`,
        explanationFr: `On ecrit « ${entry.wordFr} ». Exemple : ${example.fr}`,
        explanationAr: `نكتب « ${entry.wordFr} ». مثال: ${example.fr}`,
        position: index,
        points: 1,
        answers: [answer(entry.wordFr, true, 0, entry.translationAr)],
      };
    }

    if (type === 'WORD_ORDER') {
      const words = example.fr.replace('.', '').split(' ').filter(Boolean);
      return {
        promptFr: 'Remettez les mots dans le bon ordre.',
        promptAr: 'أعد ترتيب الكلمات.',
        hintFr: `La phrase parle de « ${entry.wordFr} ».`,
        hintAr: `الجملة تتحدّث عن « ${entry.wordFr} ».`,
        explanationFr: `Phrase correcte : ${example.fr}`,
        explanationAr: `الجملة الصحيحة: ${example.fr}`,
        position: index,
        points: 2,
        // matchKey porte le rang attendu ; l ordre affiche est volontairement decale.
        answers: words
          .map((word, wordIndex) => answer(word, true, wordIndex, null, String(wordIndex)))
          .sort((a, b) => (a.textFr > b.textFr ? 1 : -1))
          .map((item, wordIndex) => ({ ...item, position: wordIndex })),
      };
    }

    if (type === 'TRUE_FALSE') {
      const lie = wrong[0];
      const shown = index % 2 === 0 || !lie ? entry.translationAr : lie.translationAr;
      const isTrue = shown === entry.translationAr;
      return {
        promptFr: `« ${entry.wordFr} » signifie « ${shown} ».`,
        promptAr: `« ${entry.wordFr} » تعني « ${shown} ».`,
        hintFr: null,
        hintAr: null,
        explanationFr: isTrue
          ? `Exact : ${entry.wordFr} = ${entry.translationAr}.`
          : `Faux : ${entry.wordFr} signifie ${entry.translationAr}.`,
        explanationAr: isTrue
          ? `صحيح: ${entry.wordFr} = ${entry.translationAr}.`
          : `خطأ: ${entry.wordFr} تعني ${entry.translationAr}.`,
        position: index,
        points: 1,
        answers: [answer('Vrai', isTrue, 0, 'صحيح'), answer('Faux', !isTrue, 1, 'خطأ')],
      };
    }

    if (type === 'FLASHCARD') {
      const options = [entry, ...wrong];
      return {
        promptFr: `Quel mot francais correspond a « ${entry.translationAr} » ?`,
        promptAr: `أي كلمة فرنسية تقابل « ${entry.translationAr} » ؟`,
        hintFr: null,
        hintAr: null,
        explanationFr: `${entry.translationAr} se dit « ${entry.wordFr} ».`,
        explanationAr: `${entry.translationAr} تُقال « ${entry.wordFr} ».`,
        position: index,
        points: 1,
        answers: options.map((option, optionIndex) =>
          answer(option.wordFr, option.wordFr === entry.wordFr, optionIndex, option.translationAr),
        ),
      };
    }

    if (type === 'LISTENING') {
      const options = [entry, ...wrong];
      return {
        promptFr: `Vous entendez : « ${example.fr} » De quoi parle-t-on ?`,
        promptAr: `تسمع: « ${example.fr} » عن ماذا الحديث؟`,
        hintFr: 'Concentrez-vous sur le mot accentue en fin de groupe.',
        hintAr: 'ركّز على الكلمة المنبورة في نهاية المجموعة.',
        explanationFr: `La phrase parle de « ${entry.wordFr} » (${entry.translationAr}).`,
        explanationAr: `الجملة تتحدّث عن « ${entry.wordFr} » أي ${entry.translationAr}.`,
        position: index,
        points: 1,
        answers: options.map((option, optionIndex) =>
          answer(option.translationAr, option.wordFr === entry.wordFr, optionIndex, option.translationAr),
        ),
      };
    }

    // MCQ par defaut
    const options = [entry, ...wrong];
    return {
      promptFr: `Que signifie « ${entry.wordFr} » ?`,
      promptAr: `ماذا تعني « ${entry.wordFr} » ؟`,
      hintFr: `Exemple : ${example.fr}`,
      hintAr: `مثال: ${example.ar}`,
      explanationFr: `« ${entry.wordFr} » se traduit par « ${entry.translationAr} ». Exemple : ${example.fr}`,
      explanationAr: `« ${entry.wordFr} » تُترجم « ${entry.translationAr} ». مثال: ${example.fr}`,
      position: index,
      points: 1,
      answers: options.map((option, optionIndex) =>
        answer(option.translationAr, option.wordFr === entry.wordFr, optionIndex, option.translationAr),
      ),
    };
  });
}

export function buildExercise(params: {
  type: ExerciseType;
  position: number;
  entries: VocabularyEntry[];
  pool: VocabularyEntry[];
}): ExerciseDraft {
  const meta = META[params.type];
  const questions = buildQuestions(params.type, params.entries, params.pool);
  return {
    type: params.type,
    titleFr: meta.titleFr,
    titleAr: meta.titleAr,
    instructionsFr: meta.instrFr,
    instructionsAr: meta.instrAr,
    position: params.position,
    points: questions.reduce((sum, question) => sum + question.points, 0),
    passingScore: 70,
    questions,
  };
}
