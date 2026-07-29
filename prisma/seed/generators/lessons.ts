import type { CefrLevel, CourseSkill } from '@prisma/client';
import { buildExample, type VocabularyEntry } from '../data/vocabulary';

export interface LessonDraft {
  slug: string;
  titleFr: string;
  titleAr: string;
  summaryFr: string;
  summaryAr: string;
  contentFr: string;
  contentAr: string;
  explanationFr: string;
  explanationAr: string;
  examples: { fr: string; ar: string }[];
  position: number;
  estimatedMinutes: number;
  xpReward: number;
}

interface SkillCopy {
  angleFr: string;
  angleAr: string;
  methodFr: string;
  methodAr: string;
  warningFr: string;
  warningAr: string;
}

/** Angle pedagogique propre a chaque competence, injecte dans le corps des lecons. */
const SKILL_COPY: Record<CourseSkill, SkillCopy> = {
  GRAMMAR: {
    angleFr:
      'La grammaire francaise fonctionne par accords : chaque mot en informe un autre. Reperer qui commande quoi suffit souvent a lever le doute.',
    angleAr:
      'تعمل القواعد الفرنسية بالمطابقة: كل كلمة تُخبر عن أخرى. إدراك مَن يحكم مَن يكفي غالبًا لإزالة الشك.',
    methodFr:
      'Repperez d abord le noyau de la phrase, puis ajoutez les elements autour. Ne traduisez jamais mot a mot depuis l arabe.',
    methodAr: 'حدّد نواة الجملة أولًا ثم أضف العناصر حولها، ولا تترجم حرفيًا من العربية.',
    warningFr:
      'Le piege classique consiste a calquer l ordre arabe verbe-sujet. En francais, le sujet precede presque toujours le verbe.',
    warningAr: 'المزلق الشائع هو نقل ترتيب فعل ثم فاعل من العربية؛ في الفرنسية يتقدّم الفاعل الفعل عادة.',
  },
  CONJUGATION: {
    angleFr:
      'Un verbe francais se lit en deux morceaux : le radical porte le sens, la terminaison porte la personne et le temps.',
    angleAr: 'يُقرأ الفعل الفرنسي في جزأين: الجذر يحمل المعنى والنهاية تحمل الشخص والزمن.',
    methodFr:
      'Apprenez la terminaison avant le verbe entier : six formes memorisees ouvrent des centaines de verbes reguliers.',
    methodAr: 'تعلّم النهاية قبل الفعل كاملًا: ستّ صيغ محفوظة تفتح مئات الأفعال المنتظمة.',
    warningFr:
      'A l oral, plusieurs formes se prononcent pareil mais s ecrivent differemment. L ecrit reste exigeant.',
    warningAr: 'في الحديث تتشابه عدة صيغ لفظًا وتختلف كتابةً، فالكتابة تبقى دقيقة.',
  },
  SPELLING: {
    angleFr:
      'L orthographe francaise garde la trace de l histoire de la langue : les lettres muettes indiquent souvent la famille du mot.',
    angleAr: 'يحفظ الإملاء الفرنسي أثر تاريخ اللغة: الحروف الصامتة تدلّ غالبًا على أسرة الكلمة.',
    methodFr:
      'Remplacez le mot doute par un mot temoin : si la substitution fonctionne, la graphie est la bonne.',
    methodAr: 'استبدل الكلمة المشكوك فيها بكلمة شاهدة: إذا نجح الاستبدال فالكتابة صحيحة.',
    warningFr:
      'Les homophones se corrigent par le raisonnement, pas par l oreille. Prenez l habitude du test de substitution.',
    warningAr: 'تُصحَّح المتشابهات الصوتية بالتفكير لا بالسمع، فاعتَد اختبار الاستبدال.',
  },
  VOCABULARY: {
    angleFr:
      'Un mot isole s oublie, un mot en contexte reste. Apprenez toujours le mot avec un article et une phrase.',
    angleAr: 'الكلمة المعزولة تُنسى والكلمة في سياقها تبقى، فتعلّمها دائمًا مع أداتها وفي جملة.',
    methodFr:
      'Groupez le lexique par theme et par famille de mots : le cerveau retient les reseaux, pas les listes.',
    methodAr: 'اجمع المفردات بحسب الموضوع وأسرة الكلمات: الذاكرة تحفظ الشبكات لا القوائم.',
    warningFr:
      'Attention aux faux amis et aux emprunts : la forme ressemble a l arabe dialectal mais le sens a glisse.',
    warningAr: 'احترس من الأصدقاء الكاذبين والاقتراضات: الشكل قريب من العامية والمعنى تغيّر.',
  },
  PRONUNCIATION: {
    angleFr:
      'Le francais se prononce avec les levres et la tension musculaire : la position compte autant que le son vise.',
    angleAr: 'تُنطق الفرنسية بالشفتين وبتوتّر عضلي: وضع الفم يهمّ بقدر الصوت المقصود.',
    methodFr:
      'Exagerez volontairement l articulation pendant l entrainement, puis revenez a un debit normal.',
    methodAr: 'بالِغ في المخارج أثناء التدريب ثم عُد إلى إيقاع طبيعي.',
    warningFr:
      'Ne remplacez pas un son inconnu par le son arabe le plus proche : l habitude devient tres difficile a corriger.',
    warningAr: 'لا تستبدل صوتًا مجهولًا بأقرب صوت عربي، فالعادة تصعب معالجتها لاحقًا.',
  },
  LISTENING: {
    angleFr:
      'Comprendre a l oral, ce n est pas tout entendre : c est reperer les mots porteurs de sens et deviner le reste.',
    angleAr: 'الفهم السماعي ليس سماع كل شيء بل التقاط الكلمات الحاملة للمعنى وتخمين الباقي.',
    methodFr:
      'Ecoutez trois fois : la premiere pour le theme, la deuxieme pour les details, la troisieme pour verifier.',
    methodAr: 'استمع ثلاث مرات: الأولى للموضوع والثانية للتفاصيل والثالثة للتحقّق.',
    warningFr:
      'A vitesse reelle, les mots se collent. Entrainez-vous sur des enchainements, pas sur des mots isoles.',
    warningAr: 'في السرعة الطبيعية تتّصل الكلمات، فتدرّب على التسلسلات لا على الكلمات المفردة.',
  },
  READING: {
    angleFr:
      'Un texte francais s aborde par sa structure : titre, connecteurs et premiere phrase de chaque paragraphe.',
    angleAr: 'يُقارب النص الفرنسي من بنيته: العنوان وأدوات الربط والجملة الأولى من كل فقرة.',
    methodFr:
      'Lisez une premiere fois sans dictionnaire pour saisir l intention, puis relisez pour les details.',
    methodAr: 'اقرأ مرة أولى بلا قاموس لفهم المقصد ثم أعد القراءة للتفاصيل.',
    warningFr:
      'Chercher chaque mot inconnu casse la comprehension globale. Tolerez le flou au premier passage.',
    warningAr: 'البحث عن كل كلمة مجهولة يعطّل الفهم العام، فتحمّل الغموض في القراءة الأولى.',
  },
  EXPRESSIONS: {
    angleFr:
      'Une expression ne se traduit pas, elle se remplace. Cherchez l equivalent arabe, jamais le mot a mot.',
    angleAr: 'التعبير لا يُترجم بل يُستبدل، فابحث عن المقابل العربي لا عن الترجمة الحرفية.',
    methodFr:
      'Notez chaque expression avec sa situation d emploi et son registre : familier, courant ou soutenu.',
    methodAr: 'دوّن كل تعبير مع موقف استخدامه ومستواه: عامي أو عادي أو فصيح.',
    warningFr:
      'Une expression familiere placee dans un courriel professionnel produit un effet desastreux.',
    warningAr: 'التعبير العامي في بريد مهني يُحدث أثرًا سيّئًا.',
  },
  CULTURE: {
    angleFr:
      'Beaucoup de malentendus ne viennent pas de la langue mais du contexte social qui l entoure.',
    angleAr: 'كثير من سوء الفهم لا يأتي من اللغة بل من السياق الاجتماعي المحيط بها.',
    methodFr:
      'Observez d abord, imitez ensuite : les codes se transmettent par usage plus que par regle.',
    methodAr: 'لاحظ أولًا ثم قلّد: تنتقل الأعراف بالاستخدام أكثر من القاعدة.',
    warningFr:
      'Le degre de familiarite se lit dans le choix de tu ou vous. Se tromper vexe sans que personne le dise.',
    warningAr: 'تُقرأ درجة الأُلفة في اختيار tu أو vous، والخطأ يُغضب دون أن يُصرّح به أحد.',
  },
  EXAM_PREP: {
    angleFr:
      'Un examen evalue une methode autant qu un niveau. Connaitre le bareme fait gagner des points immediatement.',
    angleAr: 'يقيس الامتحان المنهجية بقدر المستوى، ومعرفة سلّم التصحيح تكسبك نقاطًا فورًا.',
    methodFr:
      'Chronometrez chaque partie a l entrainement et gardez cinq minutes de relecture systematique.',
    methodAr: 'وقّت كل جزء في التدريب واحتفظ بخمس دقائق لإعادة القراءة.',
    warningFr:
      'Repondre a cote du sujet coute plus cher que quelques fautes de langue. Lisez la consigne deux fois.',
    warningAr: 'الخروج عن الموضوع أغلى ثمنًا من بعض الأخطاء اللغوية، فاقرأ التعليمة مرتين.',
  },
};

const MINUTES_BY_LEVEL: Record<CefrLevel, number> = { A1: 10, A2: 12, B1: 15, B2: 18, C1: 22, C2: 25 };
const XP_BY_LEVEL: Record<CefrLevel, number> = { A1: 15, A2: 20, B1: 25, B2: 30, C1: 35, C2: 40 };

export function buildLesson(params: {
  courseSlug: string;
  courseTitleFr: string;
  courseTitleAr: string;
  skill: CourseSkill;
  level: CefrLevel;
  topic: { fr: string; ar: string };
  position: number;
  vocabulary: VocabularyEntry[];
}): LessonDraft {
  const { topic, skill, level, position, vocabulary } = params;
  const copy = SKILL_COPY[skill];
  const ordinalFr = ['premiere', 'deuxieme', 'troisieme', 'quatrieme'][position] ?? 'suivante';
  const ordinalAr = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة'][position] ?? 'التالية';

  const contentFr = [
    `Cette ${ordinalFr} etape du cours « ${params.courseTitleFr} » porte sur ${topic.fr.toLowerCase()}. Objectif : passer de la regle comprise a la regle utilisee, au niveau ${level}.`,
    copy.angleFr,
    `Concretement, ${topic.fr.toLowerCase()} intervient des que vous voulez etre precis. Les mots de la lecon (${vocabulary
      .slice(0, 4)
      .map((entry) => entry.wordFr)
      .join(', ')}) servent de terrain d entrainement : chaque exemple les reutilise pour que la forme se fixe avec du sens.`,
    copy.methodFr,
    `Prenez le temps de lire les exemples a voix haute avant de passer aux exercices. La lecture orale ancre la structure bien plus vite que la relecture silencieuse.`,
  ].join('\n\n');

  const contentAr = [
    `تتناول هذه الخطوة ${ordinalAr} من دورة « ${params.courseTitleAr} » موضوع ${topic.ar}. الهدف: الانتقال من فهم القاعدة إلى استخدامها في المستوى ${level}.`,
    copy.angleAr,
    `عمليًا، يظهر ${topic.ar} كلما أردت الدقّة. كلمات الدرس (${vocabulary
      .slice(0, 4)
      .map((entry) => entry.wordFr)
      .join('، ')}) هي ميدان التدريب: كل مثال يعيد استخدامها ليثبت الشكل مع المعنى.`,
    copy.methodAr,
    `اقرأ الأمثلة بصوت عالٍ قبل الانتقال إلى التمارين، فالقراءة الجهرية تثبّت التركيب أسرع من القراءة الصامتة.`,
  ].join('\n\n');

  return {
    slug: `${params.courseSlug}-${position + 1}`,
    titleFr: topic.fr,
    titleAr: topic.ar,
    summaryFr: `Comprendre et utiliser ${topic.fr.toLowerCase()} au niveau ${level}, avec ${vocabulary.length} mots de vocabulaire et des exercices corriges.`,
    summaryAr: `فهم واستخدام ${topic.ar} في المستوى ${level}، مع ${vocabulary.length} كلمة وتمارين مصحّحة.`,
    contentFr,
    contentAr,
    explanationFr: `${copy.warningFr} Retenez la logique suivante : on identifie la fonction, puis on applique la forme. Sur ${topic.fr.toLowerCase()}, cette discipline evite la majorite des erreurs observees au niveau ${level}.`,
    explanationAr: `${copy.warningAr} تذكّر المنطق التالي: نحدّد الوظيفة ثم نطبّق الشكل. في ${topic.ar} يمنع هذا الالتزام معظم الأخطاء الملاحظة في المستوى ${level}.`,
    examples: vocabulary.slice(0, 3).map((entry) => buildExample(entry)),
    position,
    estimatedMinutes: MINUTES_BY_LEVEL[level],
    xpReward: XP_BY_LEVEL[level],
  };
}
