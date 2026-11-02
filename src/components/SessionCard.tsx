import {
  DAY_LABEL, TYPE_LABEL, fmtDay, fmtDuration, sessionDate, sessionMinutes,
  type Session, type Week,
} from '../data'
import { Profile } from './Profile'

export type Status = 'past' | 'today' | 'next' | 'future'

const STATUS_LABEL: Partial<Record<Status, string>> = { today: "Aujourd'hui", next: 'Prochaine séance' }

export function SessionCard({ week, session, status, onOpen }: {
  week: Week
  session: Session
  status: Status
  onOpen: () => void
}) {
  const date = sessionDate(week, session)
  return (
    <button className={`scard t-${session.type} st-${status}`} onClick={onOpen}>
      <div className="scard-top">
        <span className="scard-day">
          {DAY_LABEL[session.day]} <span className="muted">{fmtDay(date)}</span>
        </span>
        {STATUS_LABEL[status] && <span className="badge badge-now">{STATUS_LABEL[status]}</span>}
      </div>
      <div className="scard-title">{session.title}</div>
      <div className="scard-meta">
        <span className={`chip c-${session.type}`}>{TYPE_LABEL[session.type]}</span>
        <span className="muted num">≈ {fmtDuration(sessionMinutes(session))}</span>
      </div>
      <Profile session={session} />
      <ul className="scard-steps">
        {session.steps.map((st, i) =>
          st.kind === 'run' ? (
            <li key={i}><i className={`dot z-${st.z}`} />{st.label}</li>
          ) : (
            <li key={i}>
              <i className={`dot z-${st.work.z}`} />
              {st.name ? `${st.name} : ` : ''}{st.n} × {st.work.label}
              {st.rest && <span className="muted"> · récup {st.rest.label.replace(/ de trot$/, '')}</span>}
            </li>
          ),
        )}
      </ul>
      <span className="scard-more">
        Voir le détail <span aria-hidden="true">→</span>
      </span>
    </button>
  )
}
