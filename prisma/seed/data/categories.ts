import type { CourseSkill } from '@prisma/client';

export interface CategorySeed {
  slug: string;
  skill: CourseSkill;
  nameFr: string;
  nameAr: string;
  descriptionFr: string;
  descriptionAr: string;
  icon: string;
  color: string;
}

export const categories: CategorySeed[] = [
  {
    slug: 'grammaire',
    skill: 'GRAMMAR',
    nameFr: 'Grammaire',
    nameAr: 'القواعد',
    descriptionFr:
      'La structure de la phrase francaise : articles, genre, nombre, pronoms, accords et negation.',
    descriptionAr: 'بنية الجملة الفرنسية: أدوات التعريف، الجنس، العدد، الضمائر، المطابقة والنفي.',
    icon: 'book-open',
    color: 'brand',
  },
  {
    slug: 'conjugaison',
    skill: 'CONJUGATION',
    nameFr: 'Conjugaison',
    nameAr: 'التصريف',
    descriptionFr:
      'Tous les temps utiles, du present de l indicatif au subjonctif, avec les verbes irreguliers.',
    descriptionAr: 'جميع الأزمنة المفيدة، من المضارع إلى الشرطي، مع الأفعال الشاذة.',
    icon: 'clock',
    color: 'teal',
  },
  {
    slug: 'orthographe',
    skill: 'SPELLING',
    nameFr: 'Orthographe',
    nameAr: 'الإملاء',
    descriptionFr:
      'Ecrire sans faute : homophones, accents, doubles consonnes, accords du participe passe.',
    descriptionAr: 'الكتابة بلا أخطاء: المتشابهات الصوتية، علامات النبر، الحروف المضاعفة والمطابقة.',
    icon: 'spell-check',
    color: 'sun',
  },
  {
    slug: 'vocabulaire',
    skill: 'VOCABULARY',
    nameFr: 'Vocabulaire',
    nameAr: 'المفردات',
    descriptionFr:
      'Le lexique du quotidien puis celui du travail, des etudes et de l actualite, par themes.',
    descriptionAr: 'معجم الحياة اليومية ثم العمل والدراسة والأخبار، مرتّب بحسب المواضيع.',
    icon: 'library',
    color: 'berry',
  },
  {
    slug: 'prononciation',
    skill: 'PRONUNCIATION',
    nameFr: 'Prononciation',
    nameAr: 'النطق',
    descriptionFr:
      'Les sons qui n existent pas en arabe : voyelles nasales, u, e muet, liaisons et rythme.',
    descriptionAr: 'الأصوات غير الموجودة في العربية: الحركات الأنفية، حرف u، الهاء الصامتة والوصل.',
    icon: 'mic',
    color: 'brand',
  },
  {
    slug: 'comprehension-orale',
    skill: 'LISTENING',
    nameFr: 'Comprehension orale',
    nameAr: 'الفهم السماعي',
    descriptionFr:
      'Comprendre le francais parle a vitesse reelle : dialogues, annonces, radio et podcasts.',
    descriptionAr: 'فهم الفرنسية المنطوقة بسرعتها الطبيعية: حوارات، إعلانات، إذاعة وبودكاست.',
    icon: 'headphones',
    color: 'teal',
  },
  {
    slug: 'comprehension-ecrite',
    skill: 'READING',
    nameFr: 'Comprehension ecrite',
    nameAr: 'الفهم القرائي',
    descriptionFr:
      'Lire et decoder : messages, articles, documents administratifs et textes litteraires.',
    descriptionAr: 'القراءة والتحليل: رسائل، مقالات، وثائق إدارية ونصوص أدبية.',
    icon: 'file-text',
    color: 'sun',
  },
  {
    slug: 'expressions',
    skill: 'EXPRESSIONS',
    nameFr: 'Expressions idiomatiques',
    nameAr: 'التعبيرات الاصطلاحية',
    descriptionFr:
      'Les tournures que les manuels oublient et que les Francais utilisent tous les jours.',
    descriptionAr: 'التعبيرات التي تغفلها الكتب ويستخدمها الفرنسيون كل يوم.',
    icon: 'message-circle',
    color: 'berry',
  },
  {
    slug: 'culture-francaise',
    skill: 'CULTURE',
    nameFr: 'Culture francaise',
    nameAr: 'الثقافة الفرنسية',
    descriptionFr:
      'Codes sociaux, histoire, gastronomie, administration : comprendre le contexte pour mieux parler.',
    descriptionAr: 'الأعراف الاجتماعية والتاريخ والمطبخ والإدارة: فهم السياق لتحسين التواصل.',
    icon: 'landmark',
    color: 'brand',
  },
  {
    slug: 'preparation-examens',
    skill: 'EXAM_PREP',
    nameFr: 'Preparation aux examens',
    nameAr: 'التحضير للامتحانات',
    descriptionFr:
      'DELF, DALF, TCF et TEF : methodologie, gestion du temps et entrainement type examen.',
    descriptionAr: 'DELF و DALF و TCF و TEF: المنهجية وإدارة الوقت والتدريب على نمط الامتحان.',
    icon: 'graduation-cap',
    color: 'teal',
  },
];
