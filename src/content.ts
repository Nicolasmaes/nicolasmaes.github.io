// Textes du plan (HTML + PDF), utilisés dans plusieurs vues.

export const CHECK_10K = {
  title: 'Test 10 km à fond',
  when: 'Lundi 4 janvier · semaine 10',
  week: 10,
  rows: [
    ["≤ 57'", 'La trajectoire 4h15 est bonne.'],
    ["57' à 59'", "On garde l'objectif, avec attention au semi."],
    ["> 59'", 'On ajuste les allures et on vise plutôt 4h20 à 4h30.'],
  ],
}

export const CHECK_SEMI = {
  title: 'Semi test',
  when: 'Dimanche 28 février · semaine 17',
  week: 17,
  rows: [
    ['≤ 1h58', 'Objectif marathon : 4h15.'],
    ['≈ 2h00', 'Objectif réaliste : environ 4h20.'],
    ['≈ 2h03', 'Objectif réaliste : environ 4h27.'],
    ['> 2h05', 'Viser 4h30 à 4h35 en sécurité.'],
  ],
  note: 'Idéalement une course officielle. Sinon seule, sur parcours plat, avec une semaine de marge possible.',
}

export const SEMI_EXPLAINED = [
  "Un semi-marathon (21,1 km) couru à fond, comme une répétition générale, 5 semaines avant le marathon. Son temps permet de savoir si 4h15 est réaliste, et le tableau le convertit en objectif marathon.",
  "La semaine de marge : la date du 28 février n'est pas obligatoire. Si une course officielle tombe un autre week-end, le semi peut être décalé d'une semaine. Mieux vaut avancer (dimanche 21 février, fin de la semaine 16, déjà allégée) que reculer (dimanche 7 mars, juste avant la grosse semaine 19 et sa sortie de 32 km).",
  "Seule sur parcours plat, un jour sans vent fort : le chrono sera souvent un peu moins bon qu'en course officielle, sans que ce soit inquiétant.",
]

export const NUTRITION = {
  easy: "À jeun possible jusqu'à 60 à 75 minutes, comme Coralie le fait déjà.",
  quality: 'Un petit glucide 1h30 à 2h avant, ou au minimum une collation légère. Une séance dure à jeun perd en qualité.',
  long: 'Petit-déjeuner complet 2 à 3 heures avant. Dès 75 minutes de course, glucides (gels, boisson, compotes) et eau. Viser progressivement 40 à 60 g de glucides par heure.',
  longAM: 'À répéter pendant les sorties avec allure marathon, avec exactement ce qui sera utilisé le jour J.',
}

export const PRIORITIES = 'Priorité 1 : la sortie longue. Priorité 2 : la séance de qualité. Priorité 3 : le footing du mercredi. On ne rattrape jamais une séance en doublant la suivante.'

export const RENFO = 'Renfo à la maison 2 à 3 fois par semaine, mardi, jeudi ou samedi (squats, gainage, abdos, fentes). Jambes légères la veille d\'une séance de qualité ou d\'une sortie longue.'
