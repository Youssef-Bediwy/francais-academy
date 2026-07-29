import type { CefrLevel } from '@prisma/client';

export interface CourseSeed {
  slug: string;
  categorySlug: string;
  titleFr: string;
  titleAr: string;
  descriptionFr: string;
  descriptionAr: string;
  level: CefrLevel;
  /** Themes utilises pour generer les 4 lecons du cours. */
  lessonTopics: { fr: string; ar: string }[];
}

export const courses: CourseSeed[] = [
  {
    slug: 'grammaire-les-bases-a1',
    categorySlug: 'grammaire',
    titleFr: 'Les bases de la phrase francaise',
    titleAr: 'أساسيات الجملة الفرنسية',
    descriptionFr:
      'Construire vos premieres phrases correctes : sujet, verbe, complement, articles et genre des noms.',
    descriptionAr: 'بناء أول جمل صحيحة: الفاعل، الفعل، المكمّل، أدوات التعريف وجنس الأسماء.',
    level: 'A1',
    lessonTopics: [
      { fr: 'Le sujet et le verbe', ar: 'الفاعل والفعل' },
      { fr: 'Les articles definis et indefinis', ar: 'أدوات التعريف والتنكير' },
      { fr: 'Le genre des noms', ar: 'جنس الأسماء' },
      { fr: 'La negation avec ne... pas', ar: 'النفي بـ ne... pas' },
    ],
  },
  {
    slug: 'grammaire-pronoms-a2',
    categorySlug: 'grammaire',
    titleFr: 'Les pronoms sans se tromper',
    titleAr: 'الضمائر دون خطأ',
    descriptionFr:
      'Pronoms sujets, complements directs et indirects, pronoms toniques : savoir enfin lequel choisir.',
    descriptionAr: 'ضمائر الفاعل والمفعول المباشر وغير المباشر والضمائر المنفصلة: اختر الضمير الصحيح.',
    level: 'A2',
    lessonTopics: [
      { fr: 'Les pronoms complements directs', ar: 'ضمائر المفعول المباشر' },
      { fr: 'Les pronoms complements indirects', ar: 'ضمائر المفعول غير المباشر' },
      { fr: 'Les pronoms y et en', ar: 'الضميران y و en' },
      { fr: 'La place des pronoms dans la phrase', ar: 'موضع الضمائر في الجملة' },
    ],
  },
  {
    slug: 'grammaire-relatives-b1',
    categorySlug: 'grammaire',
    titleFr: 'Les propositions relatives',
    titleAr: 'الجمل الوصلية',
    descriptionFr:
      'Qui, que, dont, ou, lequel : relier deux idees dans une seule phrase fluide et naturelle.',
    descriptionAr: 'qui و que و dont و ou و lequel: ربط فكرتين في جملة واحدة سلسة.',
    level: 'B1',
    lessonTopics: [
      { fr: 'Qui et que', ar: 'qui و que' },
      { fr: 'Le pronom relatif dont', ar: 'الضمير الوصلي dont' },
      { fr: 'Ou et les relatives de lieu', ar: 'ou والوصلات المكانية' },
      { fr: 'Lequel, auquel, duquel', ar: 'lequel و auquel و duquel' },
    ],
  },
  {
    slug: 'grammaire-discours-indirect-b2',
    categorySlug: 'grammaire',
    titleFr: 'Le discours indirect',
    titleAr: 'الكلام المنقول',
    descriptionFr:
      'Rapporter les paroles d autrui avec les bons temps, les bonnes conjonctions et la bonne ponctuation.',
    descriptionAr: 'نقل كلام الآخرين بالأزمنة وأدوات الربط والترقيم الصحيحة.',
    level: 'B2',
    lessonTopics: [
      { fr: 'Rapporter une affirmation', ar: 'نقل جملة إخبارية' },
      { fr: 'Rapporter une question', ar: 'نقل سؤال' },
      { fr: 'La concordance des temps', ar: 'تطابق الأزمنة' },
      { fr: 'Les verbes introducteurs', ar: 'أفعال التقديم' },
    ],
  },
  {
    slug: 'grammaire-nuances-c1',
    categorySlug: 'grammaire',
    titleFr: 'Nuances et structures complexes',
    titleAr: 'الفوارق والتراكيب المعقّدة',
    descriptionFr:
      'Mise en relief, inversion, participes, gerondif : ecrire un francais precis et elegant.',
    descriptionAr: 'التوكيد والقلب واسم الفاعل والحال: كتابة فرنسية دقيقة وأنيقة.',
    level: 'C1',
    lessonTopics: [
      { fr: 'La mise en relief', ar: 'أساليب التوكيد' },
      { fr: 'Le gerondif et le participe present', ar: 'الحال واسم الفاعل' },
      { fr: 'Les tournures impersonnelles', ar: 'التراكيب غير الشخصية' },
      { fr: 'La concession et l opposition', ar: 'الاستدراك والمقابلة' },
    ],
  },
  {
    slug: 'conjugaison-present-a1',
    categorySlug: 'conjugaison',
    titleFr: 'Le present de l indicatif',
    titleAr: 'المضارع الإخباري',
    descriptionFr:
      'Les trois groupes de verbes, les terminaisons regulieres et les dix irreguliers indispensables.',
    descriptionAr: 'مجموعات الأفعال الثلاث، النهايات المنتظمة والأفعال الشاذة العشرة الأساسية.',
    level: 'A1',
    lessonTopics: [
      { fr: 'Les verbes en -er', ar: 'الأفعال المنتهية بـ -er' },
      { fr: 'Etre et avoir', ar: 'الفعلان être و avoir' },
      { fr: 'Aller, faire, venir', ar: 'aller و faire و venir' },
      { fr: 'Les verbes en -ir et -re', ar: 'الأفعال المنتهية بـ -ir و -re' },
    ],
  },
  {
    slug: 'conjugaison-passe-a2',
    categorySlug: 'conjugaison',
    titleFr: 'Raconter au passe',
    titleAr: 'الحديث عن الماضي',
    descriptionFr:
      'Passe compose, imparfait et choix entre les deux : raconter un souvenir sans hesiter.',
    descriptionAr: 'الماضي المركّب والماضي المستمر والاختيار بينهما: سرد ذكرى بثقة.',
    level: 'A2',
    lessonTopics: [
      { fr: 'Le passe compose avec avoir', ar: 'الماضي المركّب مع avoir' },
      { fr: 'Le passe compose avec etre', ar: 'الماضي المركّب مع être' },
      { fr: 'L imparfait', ar: 'الماضي المستمر' },
      { fr: 'Passe compose ou imparfait', ar: 'المركّب أم المستمر' },
    ],
  },
  {
    slug: 'conjugaison-subjonctif-b1',
    categorySlug: 'conjugaison',
    titleFr: 'Le subjonctif apprivoise',
    titleAr: 'ترويض الشرطي',
    descriptionFr:
      'Quand et pourquoi le subjonctif : formation, declencheurs et pieges les plus frequents.',
    descriptionAr: 'متى ولماذا نستخدم الشرطي: التكوين والمحفّزات والمزالق الشائعة.',
    level: 'B1',
    lessonTopics: [
      { fr: 'Former le subjonctif present', ar: 'تكوين الشرطي الحاضر' },
      { fr: 'Les verbes qui declenchent le subjonctif', ar: 'الأفعال التي تستدعي الشرطي' },
      { fr: 'Les conjonctions du subjonctif', ar: 'أدوات الربط مع الشرطي' },
      { fr: 'Subjonctif ou indicatif', ar: 'الشرطي أم الإخباري' },
    ],
  },
  {
    slug: 'conjugaison-conditionnel-b2',
    categorySlug: 'conjugaison',
    titleFr: 'Conditionnel et hypothese',
    titleAr: 'الشرط والافتراض',
    descriptionFr:
      'Les trois types d hypothese avec si, le conditionnel de politesse et le regret.',
    descriptionAr: 'أنواع الافتراض الثلاثة مع si، وشرطي التأدّب والتحسّر.',
    level: 'B2',
    lessonTopics: [
      { fr: 'Le conditionnel present', ar: 'الشرطي الحاضر' },
      { fr: 'Le conditionnel passe', ar: 'الشرطي الماضي' },
      { fr: 'Les phrases avec si', ar: 'جمل si' },
      { fr: 'Exprimer le regret', ar: 'التعبير عن التحسّر' },
    ],
  },
  {
    slug: 'orthographe-homophones-a2',
    categorySlug: 'orthographe',
    titleFr: 'Les homophones qui piegent tout le monde',
    titleAr: 'المتشابهات الصوتية التي توقع الجميع',
    descriptionFr:
      'a ou a, ou ou ou, son ou sont, ce ou se : des reperes simples pour ne plus hesiter.',
    descriptionAr: 'a أم à، ou أم où، son أم sont: قواعد بسيطة لتفادي الخطأ.',
    level: 'A2',
    lessonTopics: [
      { fr: 'a et a', ar: 'a و à' },
      { fr: 'son et sont', ar: 'son و sont' },
      { fr: 'ce et se', ar: 'ce و se' },
      { fr: 'ou et ou', ar: 'ou و où' },
    ],
  },
  {
    slug: 'orthographe-accords-b1',
    categorySlug: 'orthographe',
    titleFr: 'Les accords du participe passe',
    titleAr: 'مطابقة اسم المفعول',
    descriptionFr:
      'Avec etre, avec avoir, avec les verbes pronominaux : la regle et ses exceptions reelles.',
    descriptionAr: 'مع être ومع avoir ومع الأفعال الانعكاسية: القاعدة واستثناءاتها.',
    level: 'B1',
    lessonTopics: [
      { fr: 'Accord avec etre', ar: 'المطابقة مع être' },
      { fr: 'Accord avec avoir', ar: 'المطابقة مع avoir' },
      { fr: 'Les verbes pronominaux', ar: 'الأفعال الانعكاسية' },
      { fr: 'Les cas particuliers', ar: 'الحالات الخاصة' },
    ],
  },
  {
    slug: 'vocabulaire-quotidien-a1',
    categorySlug: 'vocabulaire',
    titleFr: 'Le vocabulaire du quotidien',
    titleAr: 'مفردات الحياة اليومية',
    descriptionFr:
      'Se presenter, la famille, la maison, les nombres et l heure : le socle des 500 premiers mots.',
    descriptionAr: 'التعريف بالنفس والعائلة والمنزل والأعداد والوقت: أساس أول خمسمئة كلمة.',
    level: 'A1',
    lessonTopics: [
      { fr: 'Se presenter', ar: 'التعريف بالنفس' },
      { fr: 'La famille', ar: 'العائلة' },
      { fr: 'La maison', ar: 'المنزل' },
      { fr: 'Les nombres et l heure', ar: 'الأعداد والوقت' },
    ],
  },
  {
    slug: 'vocabulaire-alimentation-a2',
    categorySlug: 'vocabulaire',
    titleFr: 'Manger et cuisiner en francais',
    titleAr: 'الأكل والطهي بالفرنسية',
    descriptionFr:
      'Le marche, la recette, le restaurant et les quantites : commander et cuisiner sans stress.',
    descriptionAr: 'السوق والوصفة والمطعم والكميات: الطلب والطهي دون توتّر.',
    level: 'A2',
    lessonTopics: [
      { fr: 'Au marche', ar: 'في السوق' },
      { fr: 'Au restaurant', ar: 'في المطعم' },
      { fr: 'Une recette', ar: 'وصفة طهي' },
      { fr: 'Les quantites', ar: 'الكميات' },
    ],
  },
  {
    slug: 'vocabulaire-travail-b1',
    categorySlug: 'vocabulaire',
    titleFr: 'Le francais du travail',
    titleAr: 'فرنسية العمل',
    descriptionFr:
      'CV, entretien, courriel professionnel et reunion : le lexique attendu en entreprise.',
    descriptionAr: 'السيرة الذاتية والمقابلة والبريد المهني والاجتماع: المعجم المطلوب في الشركة.',
    level: 'B1',
    lessonTopics: [
      { fr: 'Le CV et la lettre de motivation', ar: 'السيرة الذاتية وخطاب التحفيز' },
      { fr: 'L entretien d embauche', ar: 'مقابلة العمل' },
      { fr: 'Le courriel professionnel', ar: 'البريد المهني' },
      { fr: 'La reunion', ar: 'الاجتماع' },
    ],
  },
  {
    slug: 'vocabulaire-actualite-b2',
    categorySlug: 'vocabulaire',
    titleFr: 'Comprendre l actualite',
    titleAr: 'فهم الأخبار',
    descriptionFr:
      'Politique, economie, environnement, sciences : lire un journal francais sans dictionnaire.',
    descriptionAr: 'السياسة والاقتصاد والبيئة والعلوم: قراءة صحيفة فرنسية بلا قاموس.',
    level: 'B2',
    lessonTopics: [
      { fr: 'La vie politique', ar: 'الحياة السياسية' },
      { fr: 'L economie', ar: 'الاقتصاد' },
      { fr: 'L environnement', ar: 'البيئة' },
      { fr: 'Sciences et technologies', ar: 'العلوم والتكنولوجيا' },
    ],
  },
  {
    slug: 'vocabulaire-academique-c2',
    categorySlug: 'vocabulaire',
    titleFr: 'Le francais academique et scientifique',
    titleAr: 'الفرنسية الأكاديمية والعلمية',
    descriptionFr:
      'Argumenter, citer, nuancer, structurer : le lexique de la dissertation et de l expose.',
    descriptionAr: 'الحجاج والاقتباس والتحفّظ والتنظيم: معجم المقال والعرض.',
    level: 'C2',
    lessonTopics: [
      { fr: 'Introduire et annoncer un plan', ar: 'التقديم وعرض الخطة' },
      { fr: 'Argumenter et nuancer', ar: 'الحجاج والتحفّظ' },
      { fr: 'Citer et reformuler', ar: 'الاقتباس وإعادة الصياغة' },
      { fr: 'Conclure', ar: 'الخاتمة' },
    ],
  },
  {
    slug: 'prononciation-sons-a1',
    categorySlug: 'prononciation',
    titleFr: 'Les sons du francais',
    titleAr: 'أصوات الفرنسية',
    descriptionFr:
      'Les voyelles qui n existent pas en arabe, le u, le e muet et les consonnes finales.',
    descriptionAr: 'الحركات غير الموجودة في العربية، وحرف u، والهاء الصامتة والسواكن النهائية.',
    level: 'A1',
    lessonTopics: [
      { fr: 'Le son u', ar: 'الصوت u' },
      { fr: 'Le e muet', ar: 'الهاء الصامتة' },
      { fr: 'Les consonnes finales', ar: 'السواكن النهائية' },
      { fr: 'Les sons e ouvert et e ferme', ar: 'الصوتان é و è' },
    ],
  },
  {
    slug: 'prononciation-nasales-a2',
    categorySlug: 'prononciation',
    titleFr: 'Voyelles nasales et liaisons',
    titleAr: 'الحركات الأنفية والوصل',
    descriptionFr:
      'an, on, in, un et les liaisons obligatoires : gagner en fluidite immediatement.',
    descriptionAr: 'an و on و in و un والوصل الإلزامي: تحسين الطلاقة فورًا.',
    level: 'A2',
    lessonTopics: [
      { fr: 'Les nasales an et on', ar: 'الأنفيتان an و on' },
      { fr: 'Les nasales in et un', ar: 'الأنفيتان in و un' },
      { fr: 'Les liaisons obligatoires', ar: 'الوصل الإلزامي' },
      { fr: 'L enchainement', ar: 'التسلسل الصوتي' },
    ],
  },
  {
    slug: 'oral-dialogues-a1',
    categorySlug: 'comprehension-orale',
    titleFr: 'Premiers dialogues du quotidien',
    titleAr: 'أول حوارات يومية',
    descriptionFr:
      'Saluer, acheter, prendre rendez-vous : comprendre de courts echanges a debit normal.',
    descriptionAr: 'التحية والشراء وتحديد موعد: فهم حوارات قصيرة بسرعة عادية.',
    level: 'A1',
    lessonTopics: [
      { fr: 'Saluer et se presenter', ar: 'التحية والتعريف بالنفس' },
      { fr: 'Dans un magasin', ar: 'في المتجر' },
      { fr: 'Prendre rendez-vous', ar: 'تحديد موعد' },
      { fr: 'Au telephone', ar: 'على الهاتف' },
    ],
  },
  {
    slug: 'oral-podcasts-b1',
    categorySlug: 'comprehension-orale',
    titleFr: 'Podcasts et interviews',
    titleAr: 'بودكاست ومقابلات',
    descriptionFr:
      'Suivre un echange de plusieurs minutes, reperer les arguments et prendre des notes.',
    descriptionAr: 'متابعة حوار من عدة دقائق، تحديد الحجج وتدوين الملاحظات.',
    level: 'B1',
    lessonTopics: [
      { fr: 'Comprendre un temoignage', ar: 'فهم شهادة' },
      { fr: 'Suivre une interview', ar: 'متابعة مقابلة' },
      { fr: 'Reperer les arguments', ar: 'تحديد الحجج' },
      { fr: 'Prendre des notes', ar: 'تدوين الملاحظات' },
    ],
  },
  {
    slug: 'oral-medias-b2',
    categorySlug: 'comprehension-orale',
    titleFr: 'Journal televise et debat',
    titleAr: 'نشرة الأخبار والنقاش',
    descriptionFr:
      'Le francais des medias : debit rapide, implicite, ironie et registres de langue.',
    descriptionAr: 'فرنسية الإعلام: سرعة الإيقاع والمضمر والسخرية ومستويات اللغة.',
    level: 'B2',
    lessonTopics: [
      { fr: 'Le journal televise', ar: 'نشرة الأخبار' },
      { fr: 'Le debat contradictoire', ar: 'النقاش الجدلي' },
      { fr: 'Reperer l implicite', ar: 'التقاط المضمر' },
      { fr: 'Les registres de langue', ar: 'مستويات اللغة' },
    ],
  },
  {
    slug: 'ecrit-messages-a1',
    categorySlug: 'comprehension-ecrite',
    titleFr: 'Lire les messages du quotidien',
    titleAr: 'قراءة رسائل الحياة اليومية',
    descriptionFr: 'SMS, panneaux, menus, horaires : decoder les ecrits courts de la vie reelle.',
    descriptionAr: 'الرسائل واللوحات وقوائم الطعام والمواعيد: فهم النصوص القصيرة اليومية.',
    level: 'A1',
    lessonTopics: [
      { fr: 'Panneaux et pictogrammes', ar: 'اللوحات والرموز' },
      { fr: 'Un menu de restaurant', ar: 'قائمة مطعم' },
      { fr: 'Un SMS et un mot', ar: 'رسالة قصيرة ومذكرة' },
      { fr: 'Horaires et calendriers', ar: 'المواعيد والتقاويم' },
    ],
  },
  {
    slug: 'ecrit-administratif-b1',
    categorySlug: 'comprehension-ecrite',
    titleFr: 'Comprendre un document administratif',
    titleAr: 'فهم وثيقة إدارية',
    descriptionFr:
      'Prefecture, banque, logement, sante : comprendre les formulaires et les courriers officiels.',
    descriptionAr: 'المحافظة والبنك والسكن والصحة: فهم الاستمارات والمراسلات الرسمية.',
    level: 'B1',
    lessonTopics: [
      { fr: 'Un formulaire administratif', ar: 'استمارة إدارية' },
      { fr: 'Un contrat de location', ar: 'عقد إيجار' },
      { fr: 'Un courrier de la banque', ar: 'مراسلة من البنك' },
      { fr: 'Le vocabulaire de la sante', ar: 'مفردات الصحة' },
    ],
  },
  {
    slug: 'ecrit-litteraire-c1',
    categorySlug: 'comprehension-ecrite',
    titleFr: 'Lire la litterature francaise',
    titleAr: 'قراءة الأدب الفرنسي',
    descriptionFr:
      'Extraits classiques et contemporains : figures de style, narration et lecture critique.',
    descriptionAr: 'مقتطفات كلاسيكية ومعاصرة: الصور البلاغية والسرد والقراءة النقدية.',
    level: 'C1',
    lessonTopics: [
      { fr: 'Les figures de style', ar: 'الصور البلاغية' },
      { fr: 'Le point de vue narratif', ar: 'وجهة النظر السردية' },
      { fr: 'Le texte poetique', ar: 'النص الشعري' },
      { fr: 'La lecture critique', ar: 'القراءة النقدية' },
    ],
  },
  {
    slug: 'expressions-courantes-a2',
    categorySlug: 'expressions',
    titleFr: 'Expressions courantes indispensables',
    titleAr: 'تعبيرات شائعة لا غنى عنها',
    descriptionFr:
      'Ca marche, du coup, n importe quoi : les tournures que vous entendrez des le premier jour.',
    descriptionAr: 'Ça marche و du coup و n importe quoi: تعبيرات ستسمعها من اليوم الأول.',
    level: 'A2',
    lessonTopics: [
      { fr: 'Reagir dans une conversation', ar: 'التفاعل في الحوار' },
      { fr: 'Exprimer son accord', ar: 'التعبير عن الموافقة' },
      { fr: 'Exprimer son desaccord', ar: 'التعبير عن الاعتراض' },
      { fr: 'Les mots du quotidien', ar: 'كلمات الحياة اليومية' },
    ],
  },
  {
    slug: 'expressions-imagees-b2',
    categorySlug: 'expressions',
    titleFr: 'Expressions imagees et idiomes',
    titleAr: 'التعبيرات المجازية',
    descriptionFr:
      'Poser un lapin, avoir le coup de foudre, tomber dans les pommes : comprendre et bien les placer.',
    descriptionAr: 'تعبيرات مجازية شهيرة: فهمها واستخدامها في موضعها الصحيح.',
    level: 'B2',
    lessonTopics: [
      { fr: 'Les expressions du corps', ar: 'تعبيرات الجسد' },
      { fr: 'Les expressions animalieres', ar: 'تعبيرات الحيوانات' },
      { fr: 'Les expressions de la nourriture', ar: 'تعبيرات الطعام' },
      { fr: 'Registre familier', ar: 'المستوى العامي' },
    ],
  },
  {
    slug: 'culture-codes-a2',
    categorySlug: 'culture-francaise',
    titleFr: 'Codes sociaux et savoir-vivre',
    titleAr: 'الأعراف الاجتماعية وحسن التعامل',
    descriptionFr:
      'Tu ou vous, la bise, les horaires, les invitations : eviter les malentendus culturels.',
    descriptionAr: 'tu أم vous، والتحية والمواعيد والدعوات: تفادي سوء الفهم الثقافي.',
    level: 'A2',
    lessonTopics: [
      { fr: 'Tu ou vous', ar: 'tu أم vous' },
      { fr: 'Saluer et se dire au revoir', ar: 'التحية والوداع' },
      { fr: 'Invitations et repas', ar: 'الدعوات والوجبات' },
      { fr: 'La politesse au travail', ar: 'اللباقة في العمل' },
    ],
  },
  {
    slug: 'culture-histoire-b1',
    categorySlug: 'culture-francaise',
    titleFr: 'Reperes d histoire et de societe',
    titleAr: 'محطّات من التاريخ والمجتمع',
    descriptionFr:
      'Republique, laicite, regions, institutions : le contexte pour comprendre les conversations.',
    descriptionAr: 'الجمهورية والعلمانية والأقاليم والمؤسسات: السياق لفهم الأحاديث.',
    level: 'B1',
    lessonTopics: [
      { fr: 'La Republique et ses symboles', ar: 'الجمهورية ورموزها' },
      { fr: 'Les regions francaises', ar: 'الأقاليم الفرنسية' },
      { fr: 'Les institutions', ar: 'المؤسسات' },
      { fr: 'Fetes et traditions', ar: 'الأعياد والتقاليد' },
    ],
  },
  {
    slug: 'examens-delf-b1',
    categorySlug: 'preparation-examens',
    titleFr: 'Preparer le DELF B1',
    titleAr: 'التحضير لامتحان DELF B1',
    descriptionFr:
      'Les quatre epreuves, la gestion du temps, les criteres de notation et deux sujets complets.',
    descriptionAr: 'الاختبارات الأربعة وإدارة الوقت ومعايير التصحيح وموضوعان كاملان.',
    level: 'B1',
    lessonTopics: [
      { fr: 'Comprehension de l oral', ar: 'الفهم السماعي' },
      { fr: 'Comprehension des ecrits', ar: 'الفهم القرائي' },
      { fr: 'Production ecrite', ar: 'الإنتاج الكتابي' },
      { fr: 'Production orale', ar: 'الإنتاج الشفوي' },
    ],
  },
  {
    slug: 'examens-tcf-b2',
    categorySlug: 'preparation-examens',
    titleFr: 'Strategies pour le TCF et le TEF',
    titleAr: 'استراتيجيات TCF و TEF',
    descriptionFr:
      'QCM chronometre, pieges recurrents, methode d elimination et entrainement en conditions reelles.',
    descriptionAr: 'اختيار من متعدد بوقت محدّد، مزالق متكرّرة، منهجية الإقصاء وتدريب واقعي.',
    level: 'B2',
    lessonTopics: [
      { fr: 'Structure du test', ar: 'بنية الاختبار' },
      { fr: 'Gerer le temps', ar: 'إدارة الوقت' },
      { fr: 'La methode d elimination', ar: 'منهجية الإقصاء' },
      { fr: 'Test blanc', ar: 'اختبار تجريبي' },
    ],
  },
];
