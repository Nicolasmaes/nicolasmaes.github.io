import { useEffect, useRef } from 'react'
import {
  DAY_LABEL, PHASES, TYPE_LABEL, ZONES, ZONE_ORDER, fmtDuration, fmtLong, sessionDate, sessionMinutes, stepPace,
  type Session, type Week, type Zone,
} from '../data'
import { CHECK_10K, CHECK_SEMI, NUTRITION } from '../content'
import { Profile } from './Profile'
import { CheckTable } from './CheckTable'

const zonesOf = (s: Session) => {
  const set = new Set<Zone>()
  for (const st of s.steps) {
    if (st.kind === 'run') {
      if (!st.pace) set.add(st.z)
    }
    else {
      set.add(st.work.z)
      if (st.rest) set.add('r')
    }
  }
  return ZONE_ORDER.filter((z) => set.has(z))
}

// Petites explications des termes présents dans la séance.
function glossary(s: Session): [string, string][] {
  const text = s.steps.map((st) => (st.kind === 'run' ? st.label : `${st.name ?? ''} ${st.work.label}`)).join(' ')
  const hasRep = s.steps.some((st) => st.kind === 'rep')
  const out: [string, string][] = []
  if (/lignes droites/.test(text))
    out.push(['Lignes droites (LD)', 'Accélérations progressives de 20 secondes en fin de footing, jusqu\'à ≈ 5\'30"–5\'40", retour en marchant ou en trottinant entre chaque. Elles réveillent la foulée sans fatiguer.'])
  if (/tempo/.test(text))
    out.push(['Tempo', 'Un effort continu « dur mais contrôlé » : on peut dire quelques mots, pas des phrases. Régulier du premier au dernier kilomètre.'])
  if (/Fartlek/.test(text))
    out.push(['Fartlek', 'Un « jeu d\'allure » au milieu du footing : on accélère, on récupère en trottinant, sans jamais s\'arrêter.'])
  else if (hasRep && s.steps.some((st) => st.kind === 'rep' && st.work.z === 'v'))
    out.push(['Fractionné', 'On alterne effort rapide et récupération en trot, sans s\'arrêter. Le dernier doit être aussi rapide que le premier : ne pas partir trop fort.'])
  if (/Reste du footing/.test(text))
    out.push(['Reste du footing', 'On termine en facile jusqu\'à atteindre le kilométrage total indiqué.'])
  return out
}

function nutrition(s: Session): string[] {
  const hasAM = s.steps.some((st) => (st.kind === 'run' ? st.z : st.work.z) === 'am')
  if (s.type === 'l' || s.type === 'race') return hasAM ? [NUTRITION.long, NUTRITION.longAM] : [NUTRITION.long]
  if (s.type === 'q') return [NUTRITION.quality]
  return [NUTRITION.easy]
}

const PRIORITY: Partial<Record<Session['type'], string>> = {
  l: 'Priorité 1 de la semaine',
  q: 'Priorité 2 de la semaine',
}

export function SessionSheet({ week, session, onClose }: { week: Week; session: Session; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.classList.add('locked')
    ref.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('locked')
    }
  }, [onClose])

  const date = sessionDate(week, session)
  const priority = PRIORITY[session.type] ?? (session.day === 'mer' ? 'Priorité 3 de la semaine' : undefined)
  const zones = zonesOf(session)
  const terms = glossary(session)
  const isTest10 = week.n === 10 && session.type === 'race'
  const isSemi = week.n === 17 && session.day === 'dim'
  let stepNo = 0

  return (
    <div className="sheet-wrap" onClick={onClose}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        tabIndex={-1}
        ref={ref}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-grip" aria-hidden="true" />
        <div className="sheet-head">
          <div>
            <div className="eyebrow">
              S{week.n} · {DAY_LABEL[session.day]} {fmtLong(date).replace(/^\S+ /, '')}
            </div>
            <h2 id="sheet-title" className="sheet-title">{session.title}</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Fermer">✕</button>
        </div>

        <div className="sheet-meta">
          <span className={`chip c-${session.type}`}>{TYPE_LABEL[session.type]}</span>
          <span className="chip chip-plain num">≈ {fmtDuration(sessionMinutes(session))}</span>
          {priority && <span className="chip chip-plain">{priority}</span>}
        </div>

        <div className="sheet-profile">
          <Profile session={session} size="lg" />
          <div className="profile-axis"><span>Départ</span><span>Intensité ↑ · durée →</span><span>Fin</span></div>
        </div>

        <h3 className="sheet-h">Déroulé</h3>
        <ol className="steps">
          {session.steps.map((st, i) => {
            if (st.kind === 'run') {
              stepNo++
              return (
                <li key={i} className={`step z-${st.z}${stepPace(st).length > 12 ? ' step-wide' : ''}`}>
                  <span className="step-n num">{stepNo}</span>
                  <div className="step-body">
                    <div className="step-label">{st.label}</div>
                    <div className="step-zone">{st.effort ?? ZONES[st.z].name}</div>
                  </div>
                  <div className="step-pace num">{stepPace(st)}</div>
                </li>
              )
            }
            stepNo++
            return (
              <li key={i} className="step step-rep">
                <span className="step-n num">{stepNo}</span>
                <div className="rep">
                  <div className="rep-head">
                    <span className="rep-x num">{st.n} ×</span>
                    <span>{st.name ? `${st.name}, à répéter ${st.n} fois` : `À répéter ${st.n} fois`}</span>
                  </div>
                  <div className={`rep-line z-${st.work.z}`}>
                    <div className="step-body">
                      <div className="step-label">{st.work.label}</div>
                      <div className="step-zone">{ZONES[st.work.z].name}</div>
                    </div>
                    <div className="step-pace num">{ZONES[st.work.z].pace}</div>
                  </div>
                  {st.rest ? (
                    <div className="rep-line z-r">
                      <div className="step-body">
                        <div className="step-label">{st.rest.label}</div>
                        <div className="step-zone">Récupération entre chaque, sans s'arrêter</div>
                      </div>
                      <div className="step-pace num">{ZONES.r.pace}</div>
                    </div>
                  ) : (
                    <div className="rep-note">Sans récupération indiquée entre les blocs.</div>
                  )}
                </div>
              </li>
            )
          })}
        </ol>

        {isTest10 && <CheckTable check={CHECK_10K} />}
        {isSemi && <CheckTable check={CHECK_SEMI} />}

        {zones.length > 0 && <h3 className="sheet-h">Les allures de la séance</h3>}
        <ul className="zlist">
          {zones.map((z) => (
            <li key={z} className={`z-${z}`}>
              <div className="zlist-top">
                <b>{ZONES[z].name}</b>
                <span className="num">{ZONES[z].pace}</span>
              </div>
              <p>{ZONES[z].feel}</p>
            </li>
          ))}
        </ul>

        {terms.length > 0 && (
          <>
            <h3 className="sheet-h">Comment faire</h3>
            <dl className="terms">
              {terms.map(([t, d]) => (
                <div key={t}><dt>{t}</dt><dd>{d}</dd></div>
              ))}
            </dl>
          </>
        )}

        <h3 className="sheet-h">Carburant</h3>
        <div className="tip">
          {nutrition(session).map((t) => <p key={t}>{t}</p>)}
        </div>

        <p className="sheet-foot muted">
          Phase {week.phase} · {PHASES[week.phase].name}. Durée estimée à partir des allures, kilométrages approximatifs.
        </p>
      </div>
    </div>
  )
}
