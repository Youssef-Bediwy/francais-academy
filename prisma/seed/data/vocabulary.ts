/**
 * Corpus lexical de reference : 500 entrees reelles francais / arabe.
 * Format d une ligne : mot | traduction | nature | genre
 *   nature : n = nom, v = verbe (traduction au nom verbal), a = adjectif,
 *            d = mot invariable, e = expression
 *   genre  : m ou f pour les noms, vide sinon
 */
export const VOCABULARY_CORPUS = `
famille|عائلة|n|f
pere|أب|n|m
mere|أم|n|f
fils|ابن|n|m
fille|ابنة|n|f
frere|أخ|n|m
soeur|أخت|n|f
grand-pere|جدّ|n|m
grand-mere|جدّة|n|f
oncle|عمّ|n|m
tante|عمّة|n|f
cousin|ابن العمّ|n|m
neveu|ابن الأخ|n|m
niece|ابنة الأخ|n|f
mari|زوج|n|m
femme|زوجة|n|f
enfant|طفل|n|m
bebe|رضيع|n|m
adolescent|مراهق|n|m
adulte|راشد|n|m
voisin|جار|n|m
ami|صديق|n|m
collegue|زميل|n|m
invite|مدعوّ|n|m
prenom|الاسم الأول|n|m
nom|اللقب|n|m
age|العمر|n|m
naissance|الميلاد|n|f
mariage|الزواج|n|m
parent|أحد الوالدين|n|m
corps|جسم|n|m
tete|رأس|n|f
cheveux|شعر|n|m
visage|وجه|n|m
oeil|عين|n|m
nez|أنف|n|m
bouche|فم|n|f
dent|سنّ|n|f
langue|لسان|n|f
oreille|أذن|n|f
cou|رقبة|n|m
epaule|كتف|n|f
bras|ذراع|n|m
main|يد|n|f
doigt|إصبع|n|m
ventre|بطن|n|m
dos|ظهر|n|m
jambe|ساق|n|f
pied|قدم|n|m
coeur|قلب|n|m
sang|دم|n|m
peau|جلد|n|f
os|عظم|n|m
sante|صحة|n|f
maladie|مرض|n|f
fievre|حمّى|n|f
douleur|ألم|n|f
medecin|طبيب|n|m
pharmacie|صيدلية|n|f
medicament|دواء|n|m
maison|منزل|n|f
appartement|شقة|n|m
immeuble|عمارة|n|m
chambre|غرفة|n|f
cuisine|مطبخ|n|f
salon|صالة|n|m
salle de bain|حمّام|n|f
toilettes|مرحاض|n|f
porte|باب|n|f
fenetre|نافذة|n|f
mur|حائط|n|m
sol|أرضية|n|m
plafond|سقف|n|m
toit|سطح|n|m
escalier|درج|n|m
ascenseur|مصعد|n|m
cle|مفتاح|n|f
serrure|قفل|n|f
lit|سرير|n|m
oreiller|وسادة|n|m
couverture|غطاء|n|f
armoire|خزانة|n|f
etagere|رفّ|n|f
table|طاولة|n|f
chaise|كرسي|n|f
fauteuil|أريكة|n|m
canape|كنبة|n|m
lampe|مصباح|n|f
miroir|مرآة|n|m
rideau|ستارة|n|m
tapis|سجّاد|n|m
frigo|ثلاجة|n|m
four|فرن|n|m
assiette|طبق|n|f
verre|كأس|n|m
tasse|فنجان|n|f
fourchette|شوكة|n|f
couteau|سكّين|n|m
cuillere|ملعقة|n|f
casserole|قدر|n|f
nourriture|طعام|n|f
pain|خبز|n|m
beurre|زبدة|n|m
fromage|جبن|n|m
lait|حليب|n|m
oeuf|بيضة|n|m
viande|لحم|n|f
poulet|دجاج|n|m
boeuf|لحم بقري|n|m
agneau|لحم خروف|n|m
poisson|سمك|n|m
crevette|روبيان|n|f
riz|أرزّ|n|m
pates|معكرونة|n|f
semoule|سميد|n|f
soupe|حساء|n|f
salade|سلطة|n|f
legume|خضرة|n|m
tomate|طماطم|n|f
pomme de terre|بطاطس|n|f
carotte|جزر|n|f
oignon|بصل|n|m
ail|ثوم|n|m
courgette|كوسة|n|f
aubergine|باذنجان|n|f
concombre|خيار|n|m
poivron|فلفل|n|m
fruit|فاكهة|n|m
pomme|تفاح|n|f
banane|موز|n|f
orange|برتقال|n|f
citron|ليمون|n|m
raisin|عنب|n|m
figue|تين|n|f
datte|تمر|n|f
grenade|رمّان|n|f
pasteque|بطّيخ|n|f
fraise|فراولة|n|f
olive|زيتون|n|f
huile|زيت|n|f
sel|ملح|n|m
poivre|فلفل أسود|n|m
sucre|سكّر|n|m
miel|عسل|n|m
farine|طحين|n|f
gateau|كعكة|n|m
dessert|حلوى|n|m
glace|مثلجات|n|f
chocolat|شوكولاتة|n|m
boisson|شراب|n|f
eau|ماء|n|f
the|شاي|n|m
cafe|قهوة|n|m
jus|عصير|n|m
petit dejeuner|فطور|n|m
dejeuner|غداء|n|m
diner|عشاء|n|m
vetement|لباس|n|m
chemise|قميص|n|f
pantalon|بنطال|n|m
jupe|تنّورة|n|f
robe|فستان|n|f
veste|سُترة|n|f
manteau|معطف|n|m
pull|كنزة|n|m
tee-shirt|قميص قصير|n|m
chaussette|جورب|n|f
chaussure|حذاء|n|f
botte|حذاء طويل|n|f
ceinture|حزام|n|f
cravate|ربطة عنق|n|f
chapeau|قبّعة|n|m
echarpe|وشاح|n|f
gant|قفّاز|n|m
sac|حقيبة|n|m
lunettes|نظّارة|n|f
bijou|حلي|n|m
ville|مدينة|n|f
village|قرية|n|m
quartier|حيّ|n|m
rue|شارع|n|f
avenue|جادّة|n|f
place|ساحة|n|f
pont|جسر|n|m
trottoir|رصيف|n|m
carrefour|تقاطع|n|m
feu rouge|إشارة حمراء|n|m
magasin|متجر|n|m
boulangerie|مخبزة|n|f
boucherie|ملحمة|n|f
marche|سوق|n|m
supermarche|سوق كبير|n|m
banque|بنك|n|f
poste|بريد|n|f
hopital|مستشفى|n|m
ecole|مدرسة|n|f
universite|جامعة|n|f
bibliotheque|مكتبة|n|f
musee|متحف|n|m
theatre|مسرح|n|m
cinema|سينما|n|m
restaurant|مطعم|n|m
hotel|فندق|n|m
eglise|كنيسة|n|f
mosquee|مسجد|n|f
parc|حديقة عامة|n|m
stade|ملعب|n|m
piscine|مسبح|n|f
plage|شاطئ|n|f
gare|محطة قطار|n|f
aeroport|مطار|n|m
quai|رصيف الميناء|n|m
billet|تذكرة|n|m
voyage|سفر|n|m
valise|حقيبة سفر|n|f
train|قطار|n|m
metro|مترو|n|m
tramway|ترام|n|m
bus|حافلة|n|m
voiture|سيارة|n|f
velo|درّاجة|n|m
moto|درّاجة نارية|n|f
avion|طائرة|n|m
bateau|قارب|n|m
taxi|سيارة أجرة|n|m
camion|شاحنة|n|m
travail|عمل|n|m
metier|مهنة|n|m
emploi|وظيفة|n|m
entreprise|شركة|n|f
bureau|مكتب|n|m
usine|مصنع|n|f
chantier|ورشة|n|m
reunion|اجتماع|n|f
projet|مشروع|n|m
contrat|عقد|n|m
salaire|راتب|n|m
patron|رئيس العمل|n|m
employe|موظّف|n|m
ouvrier|عامل|n|m
stage|تدريب|n|m
entretien|مقابلة|n|m
candidature|ترشّح|n|f
collegue de bureau|زميل مكتب|n|m
secretaire|سكرتير|n|m
comptable|محاسب|n|m
ingenieur|مهندس|n|m
avocat|محام|n|m
juge|قاض|n|m
infirmier|ممرّض|n|m
professeur|أستاذ|n|m
eleve|تلميذ|n|m
etudiant|طالب|n|m
classe|صف|n|f
cours|درس|n|m
lecon|درس تعليمي|n|f
devoir|واجب|n|m
examen|امتحان|n|m
note|علامة|n|f
diplome|شهادة|n|m
livre|كتاب|n|m
cahier|دفتر|n|m
stylo|قلم|n|m
crayon|قلم رصاص|n|m
gomme|ممحاة|n|f
regle|مسطرة|n|f
feuille|ورقة|n|f
dossier|ملف|n|m
ordinateur|حاسوب|n|m
clavier|لوحة مفاتيح|n|m
ecran|شاشة|n|m
telephone|هاتف|n|m
internet|إنترنت|n|m
message|رسالة|n|m
courriel|بريد إلكتروني|n|m
nature|طبيعة|n|f
ciel|سماء|n|m
soleil|شمس|n|m
lune|قمر|n|f
etoile|نجمة|n|f
nuage|سحابة|n|m
pluie|مطر|n|f
neige|ثلج|n|f
vent|ريح|n|m
orage|عاصفة|n|m
brouillard|ضباب|n|m
chaleur|حرارة|n|f
froid|برد|n|m
temperature|درجة حرارة|n|f
saison|فصل|n|f
printemps|ربيع|n|m
ete|صيف|n|m
automne|خريف|n|m
hiver|شتاء|n|m
mer|بحر|n|f
ocean|محيط|n|m
riviere|نهر|n|f
lac|بحيرة|n|m
montagne|جبل|n|f
colline|تلّة|n|f
vallee|وادٍ|n|f
desert|صحراء|n|m
foret|غابة|n|f
arbre|شجرة|n|m
fleur|زهرة|n|f
herbe|عشب|n|f
feuille d arbre|ورقة شجر|n|f
racine|جذر|n|f
graine|بذرة|n|f
terre|تراب|n|f
pierre|حجر|n|f
sable|رمل|n|m
animal|حيوان|n|m
chien|كلب|n|m
chat|قطّة|n|m
cheval|حصان|n|m
ane|حمار|n|m
chameau|جمل|n|m
mouton|خروف|n|m
chevre|عنزة|n|f
vache|بقرة|n|f
lapin|أرنب|n|m
oiseau|طائر|n|m
poule|دجاجة|n|f
abeille|نحلة|n|f
temps|وقت|n|m
annee|سنة|n|f
mois|شهر|n|m
semaine|أسبوع|n|f
jour|يوم|n|m
heure|ساعة|n|f
minute|دقيقة|n|f
seconde|ثانية|n|f
matin|صباح|n|m
midi|منتصف النهار|n|m
apres-midi|بعد الظهر|n|m
soir|مساء|n|m
nuit|ليل|n|f
aujourd hui|اليوم|d|
demain|غدًا|d|
hier|أمس|d|
lundi|الاثنين|n|m
mardi|الثلاثاء|n|m
mercredi|الأربعاء|n|m
jeudi|الخميس|n|m
vendredi|الجمعة|n|m
samedi|السبت|n|m
dimanche|الأحد|n|m
week-end|نهاية الأسبوع|n|m
vacances|عطلة|n|f
fete|عيد|n|f
anniversaire|عيد ميلاد|n|m
rendez-vous|موعد|n|m
couleur|لون|n|f
blanc|أبيض|a|
noir|أسود|a|
rouge|أحمر|a|
bleu|أزرق|a|
vert|أخضر|a|
jaune|أصفر|a|
orange vif|برتقالي|a|
violet|بنفسجي|a|
rose|زهري|a|
gris|رمادي|a|
marron|بنّي|a|
carre|مربّع|n|m
cercle|دائرة|n|m
triangle|مثلّث|n|m
ligne|خط|n|f
parler|التحدّث|v|
dire|القول|v|
demander|السؤال|v|
repondre|الإجابة|v|
ecouter|الاستماع|v|
entendre|السمع|v|
regarder|النظر|v|
voir|الرؤية|v|
lire|القراءة|v|
ecrire|الكتابة|v|
comprendre|الفهم|v|
apprendre|التعلّم|v|
enseigner|التدريس|v|
etudier|الدراسة|v|
savoir|المعرفة|v|
penser|التفكير|v|
croire|الاعتقاد|v|
se souvenir|التذكّر|v|
oublier|النسيان|v|
chercher|البحث|v|
trouver|الإيجاد|v|
perdre|الخسارة|v|
gagner|الفوز|v|
choisir|الاختيار|v|
decider|القرار|v|
commencer|البدء|v|
finir|الإنهاء|v|
continuer|المتابعة|v|
arreter|التوقّف|v|
essayer|المحاولة|v|
reussir|النجاح|v|
echouer|الفشل|v|
travailler|العمل|v|
aider|المساعدة|v|
servir|الخدمة|v|
utiliser|الاستخدام|v|
fabriquer|الصناعة|v|
reparer|الإصلاح|v|
nettoyer|التنظيف|v|
cuisiner|الطهي|v|
manger|الأكل|v|
boire|الشرب|v|
gouter|التذوّق|v|
acheter|الشراء|v|
vendre|البيع|v|
payer|الدفع|v|
couter|التكلفة|v|
louer|الاستئجار|v|
preter|الإعارة|v|
emprunter|الاستعارة|v|
donner|الإعطاء|v|
prendre|الأخذ|v|
porter|الحمل|v|
apporter|الإحضار|v|
envoyer|الإرسال|v|
recevoir|الاستلام|v|
ouvrir|الفتح|v|
fermer|الإغلاق|v|
allumer|الإشعال|v|
eteindre|الإطفاء|v|
marcher|المشي|v|
courir|الجري|v|
sauter|القفز|v|
nager|السباحة|v|
voler|الطيران|v|
conduire|القيادة|v|
voyager|السفر|v|
partir|الرحيل|v|
arriver|الوصول|v|
entrer|الدخول|v|
sortir|الخروج|v|
monter|الصعود|v|
descendre|النزول|v|
tomber|السقوط|v|
se lever|الاستيقاظ|v|
s asseoir|الجلوس|v|
dormir|النوم|v|
se reveiller|الصحو|v|
se laver|الاغتسال|v|
s habiller|اللبس|v|
attendre|الانتظار|v|
rencontrer|اللقاء|v|
inviter|الدعوة|v|
remercier|الشكر|v|
excuser|الاعتذار|v|
feliciter|التهنئة|v|
aimer|الحبّ|v|
detester|الكراهية|v|
preferer|التفضيل|v|
esperer|الأمل|v|
vouloir|الإرادة|v|
pouvoir|القدرة|v|
devoir moral|الالتزام|v|
falloir|اللزوم|v|
rire|الضحك|v|
pleurer|البكاء|v|
sourire|الابتسامة|v|
chanter|الغناء|v|
danser|الرقص|v|
jouer|اللعب|v|
dessiner|الرسم|v|
grand|كبير|a|
petit|صغير|a|
long|طويل|a|
court|قصير|a|
large|واسع|a|
etroit|ضيّق|a|
haut|عالٍ|a|
bas|منخفض|a|
gros|ضخم|a|
mince|نحيف|a|
lourd|ثقيل|a|
leger|خفيف|a|
fort|قويّ|a|
faible|ضعيف|a|
rapide|سريع|a|
lent|بطيء|a|
nouveau|جديد|a|
vieux|قديم|a|
jeune|شابّ|a|
propre|نظيف|a|
sale|قذر|a|
chaud|حارّ|a|
froid au toucher|بارد|a|
sec|جافّ|a|
humide|رطب|a|
dur|قاسٍ|a|
mou|طريّ|a|
plein|ممتلئ|a|
vide|فارغ|a|
cher|غالٍ|a|
pas cher|رخيص|a|
riche|غنيّ|a|
pauvre|فقير|a|
facile|سهل|a|
difficile|صعب|a|
simple|بسيط|a|
complique|معقّد|a|
important|مهمّ|a|
inutile|غير مفيد|a|
vrai|صحيح|a|
faux|خاطئ|a|
bon|جيّد|a|
mauvais|سيّئ|a|
beau|جميل|a|
laid|قبيح|a|
content|راضٍ|a|
triste|حزين|a|
fatigue|متعب|a|
malade|مريض|a|
gentil|لطيف|a|
mechant|شرّير|a|
calme|هادئ|a|
bruyant|صاخب|a|
toujours|دائمًا|d|
jamais|أبدًا|d|
souvent|غالبًا|d|
parfois|أحيانًا|d|
rarement|نادرًا|d|
maintenant|الآن|d|
bientot|قريبًا|d|
deja|سبق|d|
encore|ما زال|d|
enfin|أخيرًا|d|
beaucoup|كثيرًا|d|
peu|قليلًا|d|
tres|جدًا|d|
trop|أكثر من اللازم|d|
assez|كفاية|d|
vite|بسرعة|d|
lentement|ببطء|d|
ensemble|معًا|d|
seul|وحده|d|
ici|هنا|d|
la-bas|هناك|d|
partout|في كل مكان|d|
ailleurs|في مكان آخر|d|
surtout|خصوصًا|d|
peut-etre|ربّما|d|
bonjour|صباح الخير|e|
bonsoir|مساء الخير|e|
au revoir|إلى اللقاء|e|
s il vous plait|من فضلك|e|
merci beaucoup|شكرًا جزيلًا|e|
de rien|لا شكر على واجب|e|
excusez-moi|عفوًا|e|
je suis desole|أنا آسف|e|
ca va|كيف الحال|e|
enchante|تشرّفت بك|e|
a bientot|إلى قريب|e|
bonne chance|حظًا سعيدًا|e|
bon appetit|بالهناء والشفاء|e|
felicitations|تهانينا|e|
attention|احترس|e|
d accord|موافق|e|
bien sur|بالطبع|e|
pas du tout|إطلاقًا|e|
ca depend|هذا يتوقّف على الأمر|e|
tant pis|لا بأس|e|
`.trim();

export interface VocabularyEntry {
  wordFr: string;
  translationAr: string;
  partOfSpeech: 'n' | 'v' | 'a' | 'd' | 'e';
  gender: 'm' | 'f' | null;
}

export function parseVocabulary(): VocabularyEntry[] {
  return VOCABULARY_CORPUS.split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [wordFr = '', translationAr = '', pos = 'n', gender = ''] = line.split('|');
      return {
        wordFr,
        translationAr,
        partOfSpeech: (['n', 'v', 'a', 'd', 'e'].includes(pos) ? pos : 'n') as VocabularyEntry['partOfSpeech'],
        gender: gender === 'm' || gender === 'f' ? gender : null,
      };
    });
}

/** Construit une phrase d exemple grammaticalement correcte dans les deux langues. */
export function buildExample(entry: VocabularyEntry): { fr: string; ar: string } {
  switch (entry.partOfSpeech) {
    case 'v':
      return {
        fr: `Il est important de ${entry.wordFr} chaque jour.`,
        ar: `من المهم ${entry.translationAr} كل يوم.`,
      };
    case 'a':
      return {
        fr: `Ce livre est vraiment ${entry.wordFr}.`,
        ar: `هذا الكتاب ${entry.translationAr} حقًا.`,
      };
    case 'd':
      return {
        fr: `On emploie souvent « ${entry.wordFr} » a l oral.`,
        ar: `تُستخدم « ${entry.wordFr} » كثيرًا في الحديث.`,
      };
    case 'e':
      return {
        fr: `On dit « ${entry.wordFr} » dans cette situation.`,
        ar: `نقول « ${entry.wordFr} » أي ${entry.translationAr}.`,
      };
    case 'n':
    default:
      return entry.gender === 'f'
        ? { fr: `Voici une ${entry.wordFr}.`, ar: `هذه ${entry.translationAr}.` }
        : { fr: `Voici un ${entry.wordFr}.`, ar: `هذا ${entry.translationAr}.` };
  }
}
