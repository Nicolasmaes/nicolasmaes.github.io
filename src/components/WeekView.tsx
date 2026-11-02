import { useEffect, useRef } from 'react'
import { PHASES, WEEKS, weekRange, type Session, type Week } from '../data'
import { RENFO } from '../content'
import { SessionCard, type Status } from './SessionCard'

const MAX_KM = 55

export function WeekView({ weekN, currentWeek, setWeekN, statusOf, onOpen, todayNote }: {
  weekN: number
  currentWeek: number
  setWeekN: (n: number) => void
  statusOf: (w: Week, s: Session) => Status
  onOpen: (w: Week, s: Session) => void
  todayNote?: string
}) {
  const week = WEEKS[weekN - 1]
  const stripRef = useRef<HTMLDivElement>(null)
  const sessionsRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; y: number; dx: number; axis?: 'x' | 'y' } | null>(null)

  useEffect(() => {
    const strip = stripRef.current
    const el = strip?.querySelector<HTMLElement>('[aria-current="true"]')
    if (strip && el) strip.scrollTo({ left: el.offsetLeft - strip.clientWidth / 2 + el.clientWidth / 2, behavior: 'smooth' })
  }, [weekN])

  const go = (n: number) => setWeekN(Math.min(WEEKS.length, Math.max(1, n)))
  // Les cartes suivent le doigt, puis sortent d'un côté et la semaine suivante entre de l'autre.
  const slide = (x: number, ms = 0) => {
    const el = sessionsRef.current
    if (!el) return
    el.style.transition = ms ? `transform ${ms}ms ease-out` : 'none'
    el.style.transform = x ? `translateX(${x}px)` : ''
  }
  const release = () => {
    const d = drag.current
    drag.current = null
    if (!d || d.axis !== 'x') return
    const dir = d.dx < 0 ? 1 : -1
    const target = weekN + dir
    if (Math.abs(d.dx) < 70 || target < 1 || target > WEEKS.length) return slide(0, 200)
    const w = sessionsRef.current!.offsetWidth
    slide(-dir * w, 180)
    setTimeout(() => {
      go(target)
      slide(dir * w)
      requestAnimationFrame(() => requestAnimationFrame(() => slide(0, 220)))
    }, 180)
  }

  const hasSunday = week.sessions.some((s) => s.day === 'dim')

  return (
    <div>
      <div className="strip" ref={stripRef} role="tablist" aria-label="Semaines">
        {WEEKS.map((w) => (
          <button
            key={w.n}
            role="tab"
            className={`strip-w${w.flag === 'light' ? ' light' : ''}${w.n === currentWeek ? ' cur' : ''}`}
            aria-current={w.n === weekN}
            aria-selected={w.n === weekN}
            aria-label={`Semaine ${w.n}, ${w.km} km`}
            onClick={() => go(w.n)}
          >
            <span className="strip-km num">{w.km}</span>
            <span className="strip-bar"><span style={{ height: `${(w.km / MAX_KM) * 100}%` }} /></span>
            <span className="strip-n num">S{w.n}</span>
          </button>
        ))}
      </div>

      <div className="week-head">
        <button className="icon-btn" onClick={() => go(weekN - 1)} disabled={weekN === 1} aria-label="Semaine précédente">‹</button>
        <div className="week-title">
          <div className="eyebrow">{PHASES[week.phase].name}</div>
          <h2>
            Semaine {week.n}
            {week.flag === 'light' && <span className="tag">Allégée</span>}
            {week.flag === 'key' && <span className="tag tag-key">Clé</span>}
            {week.n === currentWeek && <span className="tag tag-now">En cours</span>}
          </h2>
          <div className="muted num">{weekRange(week.n)} · <b className="km">{week.km} km</b></div>
        </div>
        <button className="icon-btn" onClick={() => go(weekN + 1)} disabled={weekN === WEEKS.length} aria-label="Semaine suivante">›</button>
      </div>

      {todayNote && week.n === currentWeek && <div className="today-note">{todayNote}</div>}

      <div className="sessions-clip">
        <div
          className="sessions"
          ref={sessionsRef}
          onTouchStart={(e) => (drag.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, dx: 0 })}
          onTouchMove={(e) => {
            const d = drag.current
            if (!d) return
            const dx = e.touches[0].clientX - d.x
            const dy = e.touches[0].clientY - d.y
            if (!d.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 10) d.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
            if (d.axis !== 'x') return
            d.dx = dx
            const atEdge = (dx > 0 && weekN === 1) || (dx < 0 && weekN === WEEKS.length)
            slide(atEdge ? dx / 3 : dx)
          }}
          onTouchEnd={release}
          onTouchCancel={release}
        >
          {week.sessions.map((s) => (
            <SessionCard key={s.day} week={week} session={s} status={statusOf(week, s)} onOpen={() => onOpen(week, s)} />
          ))}
        </div>
      </div>

      <div className="offdays">
        <div><b>Mar · Jeu · Sam</b><span>{RENFO}</span></div>
        <div>
          <b>{hasSunday ? 'Samedi' : 'Week-end'}</b>
          <span>
            Repos. Une 4ᵉ sortie facultative de 30 à 40' très faciles le jeudi ne remplace rien.
          </span>
        </div>
      </div>
      <p className="hint muted">Glisser à gauche ou à droite pour changer de semaine.</p>
    </div>
  )
}
