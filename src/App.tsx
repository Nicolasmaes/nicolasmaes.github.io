import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  RACE, START, WEEKS, daysBetween, fmtLong, sameDay, sessionDate, type Session, type Week,
} from './data'
import { WeekView } from './components/WeekView'
import { PlanView } from './components/PlanView'
import { PacesView } from './components/PacesView'
import { InfoView } from './components/InfoView'
import { SessionSheet } from './components/SessionSheet'
import type { Status } from './components/SessionCard'

type Tab = 'semaine' | 'plan' | 'allures' | 'infos'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'semaine', label: 'Semaine', icon: 'M4 6h16M4 6v13h16V6M4 10h16M9 3v4M15 3v4' },
  { id: 'plan', label: 'Plan', icon: 'M5 20V12M10 20V8M15 20V10M20 20V4' },
  { id: 'allures', label: 'Allures', icon: 'M12 13l4-4M4 17a8 8 0 1 1 16 0' },
  { id: 'infos', label: 'Infos', icon: 'M12 11v6M12 7.5v.5M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z' },
]

const startOfToday = () => {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export default function App() {
  const today = useMemo(startOfToday, [])
  const offset = daysBetween(START, today)
  const currentWeek = offset >= 0 && offset < WEEKS.length * 7 ? Math.floor(offset / 7) + 1 : 0
  const toRace = daysBetween(today, RACE)

  const [tab, setTab] = useState<Tab>('semaine')
  const [weekN, setWeekN] = useState(currentWeek || (offset < 0 ? 1 : WEEKS.length))
  const [sel, setSel] = useState<{ w: Week; s: Session } | null>(null)

  // Prochaine séance (aujourd'hui compris)
  const next = useMemo(() => {
    for (const w of WEEKS) for (const s of w.sessions) if (daysBetween(today, sessionDate(w, s)) >= 0) return { w, s }
    return null
  }, [today])

  const statusOf = useCallback(
    (w: Week, s: Session): Status => {
      const d = sessionDate(w, s)
      if (daysBetween(today, d) < 0) return 'past'
      if (sameDay(d, today)) return 'today'
      return next?.s === s ? 'next' : 'future'
    },
    [today, next],
  )

  const todayNote =
    next && !sameDay(sessionDate(next.w, next.s), today)
      ? `Aujourd'hui : pas de course. Prochaine séance ${fmtLong(sessionDate(next.w, next.s))} : ${next.s.title.toLowerCase()}.`
      : undefined

  // La fiche séance se ferme aussi avec le bouton « retour » du téléphone.
  const open = (w: Week, s: Session) => {
    history.pushState({ sheet: true }, '')
    setSel({ w, s })
  }
  const close = useCallback(() => {
    if (history.state?.sheet) history.back()
    else setSel(null)
  }, [])
  useEffect(() => {
    const onPop = () => setSel(null)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const switchTab = (t: Tab) => {
    setTab(t)
    window.scrollTo({ top: 0 })
  }
  const pickWeek = (n: number) => {
    setWeekN(n)
    switchTab('semaine')
  }

  return (
    <>
      <header className="bib">
        <div className="bib-main">
          <div className="eyebrow">Plan d'entraînement · 22 semaines</div>
          <h1>Marathon de Paris</h1>
          <div className="bib-date">Dimanche 4 avril 2027</div>
        </div>
        <div className="bib-side">
          <span className="small">Objectif</span>
          <span className="big num">4h15</span>
          <span className="small num">6'03"/km</span>
        </div>
        <div className="bib-count num">
          {toRace > 0 ? <>J-{toRace}</> : toRace === 0 ? 'Jour J' : 'Marathon couru'}
          {offset < 0 && <span> · début du plan dans {-offset} j</span>}
        </div>
      </header>

      <main className="main">
        {tab === 'semaine' && (
          <WeekView
            weekN={weekN}
            currentWeek={currentWeek}
            setWeekN={setWeekN}
            statusOf={statusOf}
            onOpen={open}
            todayNote={todayNote}
          />
        )}
        {tab === 'plan' && <PlanView currentWeek={currentWeek} onPick={pickWeek} />}
        {tab === 'allures' && <PacesView onPick={pickWeek} />}
        {tab === 'infos' && <InfoView />}
      </main>

      <nav className="tabbar" aria-label="Navigation">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? 'on' : ''} aria-current={tab === t.id} onClick={() => switchTab(t.id)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d={t.icon} /></svg>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      {sel && <SessionSheet week={sel.w} session={sel.s} onClose={close} />}
    </>
  )
}
