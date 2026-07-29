# Fichiers statiques

- `images/` : illustrations des lecons (champ `Lesson.illustrationUrl`).
- `audio/` : prononciations et dialogues (`Lesson.audioUrl`, `Vocabulary.audioUrl`, `Question.audioUrl`).

Les composants `AudioButton` et l illustration de lecon se masquent automatiquement quand la
ressource est absente : le projet fonctionne donc sans aucun media, et s enrichit des que vous
deposez des fichiers ici et renseignez les champs correspondants en base.
