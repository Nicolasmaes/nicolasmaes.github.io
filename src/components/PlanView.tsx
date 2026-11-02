import { PHASES, WEEKS, fmtDay, weekStart, type Week } from '../data'

const phases = [1, 2, 3, 4] as const

export function PlanView({ currentWeek, onPick }: { currentWeek: number; onPick: (n: number) => void }) {
  return (
    <div>
      <div className="eyebrow">Semaine par semaine</div>
      <h2 className="h2">Le calendrier</h2>
      <p className="lead">Kilométrages approximatifs. Toucher une semaine pour voir ses séances.</p>

      <div className="facts">
        <div className="fact"><div className="v num">2 nov.</div><div className="l">Début du plan, lundi</div></div>
        <div className="fact"><div className="v num">55 km</div><div className="l">Semaine la plus chargée</div></div>
        <div className="fact"><div className="v num">32 km</div><div className="l">Sortie la plus longue, le 12 mars</div></div>
        <div className="fact"><div className="v num">4 avril</div><div className="l">Jour de la course, dimanche</div></div>
      </div>

      {phases.map((p) => (
        <section key={p} className="phase">
          <div className="phase-head">
            <span className="phase-n num">{p}</span>
            <div>
              <h3>{PHASES[p].name}</h3>
              <p className="muted">{PHASES[p].desc}</p>
            </div>
          </div>
          {WEEKS.filter((w) => w.phase === p).map((w) => (
            <WeekRow key={w.n} w={w} current={w.n === currentWeek} onPick={() => onPick(w.n)} />
          ))}
        </section>
      ))}
      <p className="note">Semaine 22 : sans les 42 km du marathon.</p>
    </div>
  )
}

function WeekRow({ w, current, onPick }: { w: Week; current: boolean; onPick: () => void }) {
  return (
    <button className={`wrow${current ? ' cur' : ''}${w.flag === 'key' ? ' key' : ''}`} onClick={onPick}>
      <div className="wrow-id">
        <span className="wrow-s num">S{w.n}</span>
        <span className="muted num">{fmtDay(weekStart(w.n))}</span>
        {current ? <span className="tag tag-now">En cours</span>
          : w.flag === 'light' ? <span className="tag">Allégée</span>
          : w.flag === 'key' ? <span className="tag tag-key">Clé</span> : null}
      </div>
      <ul className="wrow-s-list">
        {w.sessions.map((s) => (
          <li key={s.day}><i className={`dot c-${s.type}`} />{s.title}</li>
        ))}
      </ul>
      <div className="wrow-km"><b className="num">{w.km}</b><span>km</span></div>
    </button>
  )
}
