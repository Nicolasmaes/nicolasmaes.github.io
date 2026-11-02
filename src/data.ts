// Plan de Coralie, retranscrit depuis « Marathon de Paris 2027 021126.html » et le PDF.
// Les durées (min) sont des estimations calculées à partir des allures, pour dessiner le profil des séances.

export type Zone = 'e' | 'am' | 't' | 'v' | 'r'

export interface ZoneInfo {
  name: string
  short: string
  pace: string
  feel: string
  minPerKm: number
  level: number // hauteur dans le profil de séance (0 à 1)
}

export const ZONES: Record<Zone, ZoneInfo> = {
  e: {
    name: 'Facile',
    short: 'Facile',
    pace: `6'30"–6'50"`,
    feel: "Coralie court d'habitude vers 6'15\" : ralentir sur les jours faciles permet de bien faire les séances de qualité.",
    minPerKm: 6.67,
    level: 0.42,
  },
  am: {
    name: 'Allure marathon',
    short: 'Allure marathon',
    pace: `6'03"`,
    feel: 'Soutenue mais contrôlée, régulière pendant des heures.',
    minPerKm: 6.05,
    level: 0.64,
  },
  t: {
    name: 'Tempo / seuil',
    short: 'Tempo',
    pace: `6'05"–6'15"`,
    feel: 'Dur mais contrôlé, phrases très courtes.',
    minPerKm: 6.17,
    level: 0.78,
  },
  v: {
    name: 'Rapide (allure 10 km)',
    short: 'Rapide',
    pace: `5'55"–6'00"`,
    feel: 'Dur, respiration marquée. Viser environ 5\'50" ensuite.',
    minPerKm: 5.97,
    level: 0.95,
  },
  r: {
    name: 'Récupération',
    short: 'Trot',
    pace: `≥ 7'00"`,
    feel: 'Trot très lent entre deux efforts, juste pour reprendre son souffle.',
    minPerKm: 7.2,
    level: 0.22,
  },
}

export const ZONE_ORDER: Zone[] = ['e', 'am', 't', 'v', 'r']

export interface Run {
  kind: 'run'
  z: Zone
  label: string
  pace?: string // remplace l'allure de la zone
  effort?: string // remplace le nom de la zone quand l'allure est spécifique
  min: number
}

export interface Repeat {
  kind: 'rep'
  n: number
  name?: string // ex. « Fartlek »
  work: { z: Zone; label: string; min: number }
  rest?: { label: string; min: number }
}

export type Step = Run | Repeat

export type Day = 'lun' | 'mer' | 'ven' | 'dim'
export type SessionType = 'q' | 'e' | 'l' | 'race'

export interface Session {
  day: Day
  type: SessionType
  title: string
  steps: Step[]
}

export interface Week {
  n: number
  phase: 1 | 2 | 3 | 4
  flag?: 'light' | 'key'
  km: number
  sessions: Session[]
}

// --- Briques ---------------------------------------------------------------
const easyMin = (km: number) => Math.round(km * ZONES.e.minPerKm)
const run = (z: Zone, label: string, min: number, pace?: string, effort?: string): Run => ({ kind: 'run', z, label, min, pace, effort })
const easy = (km: number, label = `${km} km faciles`): Run => run('e', label, easyMin(km))
const EC = easy(2, 'Échauffement 2 km')
const RC = easy(2, 'Retour au calme 2 km')
const LD = (n: number): Run => run('v', `${n} lignes droites de 20", progressives`, n, `≈ 5'30"–5'40"`, 'Accélérations courtes')
const rep = (n: number, z: Zone, label: string, min: number, rest?: [string, number], name?: string): Repeat => ({
  kind: 'rep',
  n,
  name,
  work: { z, label, min },
  rest: rest && { label: rest[0], min: rest[1] },
})

const footing = (km: number): Session => ({ day: 'mer', type: 'e', title: 'Footing facile', steps: [easy(km)] })
const longue = (km: number): Session => ({ day: 'ven', type: 'l', title: 'Sortie longue', steps: [easy(km)] })
const longueAM = (kmE: number, kmAM: number, amLabel = `${kmAM} derniers km`): Session => ({
  day: 'ven',
  type: 'l',
  title: 'Sortie longue, fin à allure marathon',
  steps: [easy(kmE, `${kmE} premiers km faciles`), run('am', amLabel, Math.round(kmAM * ZONES.am.minPerKm))],
})
const tempo = (min: number): Session => ({
  day: 'lun',
  type: 'q',
  title: `Tempo · ${min} min`,
  steps: [EC, run('t', `${min} min de tempo`, min), RC],
})
const km1000 = (n: number): Session => ({
  day: 'lun',
  type: 'q',
  title: `Fractionné · ${n} × 1000 m`,
  steps: [EC, rep(n, 'v', '1000 m', 6, ['90" de trot', 1.5]), RC],
})
const am3x3 = (n: number, rest = true): Session => ({
  day: 'lun',
  type: 'q',
  title: `Allure marathon · ${n} × 3 km`,
  steps: [EC, rep(n, 'am', '3 km', 18, rest ? ['1 min de trot', 1] : undefined), RC],
})
const footingLD = (km: number, ld: number): Session => ({
  day: 'lun',
  type: 'e',
  title: 'Footing + lignes droites',
  steps: [easy(km), LD(ld)],
})

// --- Les 22 semaines ---------------------------------------------------------
export const WEEKS: Week[] = [
  { n: 1, phase: 1, km: 28, sessions: [footingLD(8, 6), footing(8), longue(12)] },
  {
    n: 2, phase: 1, km: 30,
    sessions: [
      { day: 'lun', type: 'q', title: 'Fractionné · 6 × 2 min', steps: [EC, rep(6, 'v', '2 min rapides', 2, ['2 min de trot', 2]), RC] },
      footing(8), longue(13),
    ],
  },
  { n: 3, phase: 1, km: 34, sessions: [tempo(20), footing(9), longue(15)] },
  {
    n: 4, phase: 1, flag: 'light', km: 27,
    sessions: [
      {
        day: 'lun', type: 'q', title: 'Fractionné · 8 × 1 min',
        steps: [run('e', 'Échauffement 15 min', 15), rep(8, 'v', '1 min rapide', 1, ['1 min de trot', 1]), run('e', 'Retour au calme 10 min', 10)],
      },
      footing(7), longue(12),
    ],
  },
  { n: 5, phase: 1, km: 36, sessions: [km1000(5), footing(9), longue(16)] },
  { n: 6, phase: 1, km: 37, sessions: [tempo(25), footing(9), longue(17)] },
  { n: 7, phase: 2, km: 40, sessions: [km1000(6), footing(10), longue(18)] },
  {
    n: 8, phase: 2, flag: 'light', km: 31,
    sessions: [
      {
        day: 'lun', type: 'q', title: 'Fartlek · 6 × 1 min',
        steps: [EC, rep(6, 'v', '1 min rapide', 1, ['1 min 30 de trot', 1.5], 'Fartlek'), easy(4.5, 'Reste du footing, 9 km au total')],
      },
      footing(8), longue(14),
    ],
  },
  {
    n: 9, phase: 2, km: 41,
    sessions: [
      { day: 'lun', type: 'q', title: 'Tempo · 3 × 10 min', steps: [EC, rep(3, 't', '10 min de tempo', 10, ['2 min de trot', 2]), RC] },
      footing(10), longue(19),
    ],
  },
  {
    n: 10, phase: 2, flag: 'key', km: 36,
    sessions: [
      {
        day: 'lun', type: 'race', title: 'Test 10 km à fond',
        steps: [EC, run('v', `TEST : 10 km à fond (objectif ≤ 57')`, 57, `≈ 5'42" ou mieux`, 'Course test, à fond'), easy(1, 'Retour au calme 1 km')],
      },
      footing(8), longue(15),
    ],
  },
  {
    n: 11, phase: 2, km: 42,
    sessions: [
      { day: 'lun', type: 'q', title: 'Tempo · 2 × 15 min', steps: [EC, rep(2, 't', '15 min de tempo', 15, ['3 min de trot', 3]), RC] },
      footing(10), longue(20),
    ],
  },
  {
    n: 12, phase: 2, km: 44,
    sessions: [
      { day: 'lun', type: 'q', title: 'Fractionné · 4 × 1500 m', steps: [EC, rep(4, 'v', '1500 m', 9, ['2 min de trot', 2]), RC] },
      footing(10), longueAM(19, 3),
    ],
  },
  { n: 13, phase: 2, flag: 'light', km: 33, sessions: [footingLD(9, 6), footing(8), longue(16)] },
  { n: 14, phase: 3, km: 47, sessions: [am3x3(3), footing(10), longueAM(16, 8)] },
  { n: 15, phase: 3, km: 49, sessions: [tempo(30), footing(10), longueAM(16, 10)] },
  { n: 16, phase: 3, flag: 'light', km: 36, sessions: [footingLD(10, 6), footing(8), longue(18)] },
  {
    n: 17, phase: 3, flag: 'key', km: 43,
    sessions: [
      footingLD(9, 4),
      {
        day: 'mer', type: 'q', title: 'Footing + allure marathon',
        steps: [EC, rep(3, 'am', '1 km', 6, ['1 min de trot', 1]), easy(2.7, 'Reste du footing, 8 km au total')],
      },
      { day: 'ven', type: 'e', title: 'Footing court', steps: [easy(5)] },
      {
        day: 'dim', type: 'race', title: 'Semi test · 21,1 km',
        steps: [run('v', 'SEMI TEST, 21,1 km (objectif ≤ 1h58)', 118, `départ 5'40", puis ≈ 5'35"`, 'Course test, à fond')],
      },
    ],
  },
  {
    n: 18, phase: 3, km: 40,
    sessions: [
      { day: 'lun', type: 'e', title: 'Footing de récupération', steps: [easy(6, '6 km de récupération')] },
      {
        day: 'mer', type: 'q', title: 'Footing + allure marathon',
        steps: [EC, rep(2, 'am', '3 km', 18, ['1 min de trot', 1]), easy(1.8, 'Reste du footing, 10 km au total')],
      },
      longue(24),
    ],
  },
  {
    n: 19, phase: 3, flag: 'key', km: 55,
    sessions: [am3x3(3), footing(10), longueAM(22, 10, '10 derniers km (sortie la plus longue : 32 km)')],
  },
  {
    n: 20, phase: 4, km: 42,
    sessions: [
      km1000(4), footing(9),
      {
        day: 'ven', type: 'l', title: 'Sortie longue, 2 blocs allure marathon',
        steps: [easy(6), run('am', '5 km', 30), easy(2), run('am', '5 km', 30), easy(4)],
      },
    ],
  },
  { n: 21, phase: 4, km: 32, sessions: [am3x3(2, false), footing(8), longue(14)] },
  {
    n: 22, phase: 4, flag: 'key', km: 18,
    sessions: [
      footingLD(8, 4),
      {
        day: 'mer', type: 'q', title: 'Footing + allure marathon',
        steps: [EC, rep(3, 'am', '1 km', 6, ['1 min de trot', 1]), easy(0.8, 'Reste du footing, 6 km au total')],
      },
      { day: 'ven', type: 'e', title: 'Déblocage', steps: [run('e', '3–4 km très faciles, ou repos', 23)] },
      {
        day: 'dim', type: 'race', title: 'Marathon de Paris',
        steps: [run('am', 'MARATHON (objectif 4h15)', 255, `6'03" régulier`, 'Le jour J')],
      },
    ],
  },
]

export const PHASES: Record<Week['phase'], { name: string; desc: string }> = {
  1: { name: 'Base et introduction de la vitesse', desc: "Semaines 1 à 6 · la régularité s'installe, les footings restent vraiment faciles." },
  2: { name: 'Développement', desc: 'Semaines 7 à 13 · le volume et le seuil montent, test 10 km en semaine 10.' },
  3: { name: 'Spécifique marathon', desc: 'Semaines 14 à 19 · allure marathon dans les sorties longues, semi test, pic à 32 km.' },
  4: { name: 'Affûtage', desc: "Semaines 20 à 22 · le volume baisse, l'intensité reste." },
}

export const TYPE_LABEL: Record<SessionType, string> = {
  q: 'Qualité',
  e: 'Facile',
  l: 'Sortie longue',
  race: 'Course',
}

export const DAY_LABEL: Record<Day, string> = { lun: 'Lundi', mer: 'Mercredi', ven: 'Vendredi', dim: 'Dimanche' }

// --- Dates -------------------------------------------------------------------
export const START = new Date(2026, 10, 2)
export const RACE = new Date(2027, 3, 4)
const DAY_OFFSET: Record<Day, number> = { lun: 0, mer: 2, ven: 4, dim: 6 }
const DAY_MS = 86_400_000

export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
export const weekStart = (n: number) => addDays(START, (n - 1) * 7)
export const sessionDate = (w: Week, s: Session) => addDays(weekStart(w.n), DAY_OFFSET[s.day])
export const daysBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / DAY_MS)
export const sameDay = (a: Date, b: Date) => daysBetween(a, b) === 0

const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('fr-FR', opts)
export const fmtDay = (d: Date) => fmt({ day: 'numeric', month: 'short' }).format(d)
export const fmtWeekday = (d: Date) => fmt({ weekday: 'short', day: 'numeric', month: 'short' }).format(d)
export const fmtLong = (d: Date) => fmt({ weekday: 'long', day: 'numeric', month: 'long' }).format(d)

export function weekRange(n: number) {
  const a = weekStart(n)
  const b = addDays(a, 6)
  return a.getMonth() === b.getMonth()
    ? `${a.getDate()}–${fmtDay(b)}`
    : `${fmtDay(a)} – ${fmtDay(b)}`
}

// --- Durées ------------------------------------------------------------------
export const stepMinutes = (s: Step) =>
  s.kind === 'run' ? s.min : s.n * s.work.min + (s.rest ? (s.n - 1) * s.rest.min : 0)

export const sessionMinutes = (s: Session) => s.steps.reduce((t, st) => t + stepMinutes(st), 0)

export function fmtDuration(min: number) {
  const m = Math.max(5, Math.round(min / 5) * 5)
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  const r = m % 60
  return r ? `${h} h ${String(r).padStart(2, '0')}` : `${h} h`
}

export const stepPace = (s: Run) => s.pace ?? ZONES[s.z].pace
