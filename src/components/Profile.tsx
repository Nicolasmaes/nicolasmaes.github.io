import { ZONES, type Session, type Zone } from '../data'

interface Block {
  z: Zone
  min: number
  gapBefore?: boolean
}

function blocks(s: Session): Block[] {
  const out: Block[] = []
  for (const st of s.steps) {
    if (st.kind === 'run') {
      out.push({ z: st.z, min: st.min })
      continue
    }
    for (let i = 0; i < st.n; i++) {
      out.push({ z: st.work.z, min: st.work.min, gapBefore: i > 0 && !st.rest })
      if (st.rest && i < st.n - 1) out.push({ z: 'r', min: st.rest.min })
    }
  }
  return out
}

/** Profil d'intensité : largeur = durée estimée, hauteur = intensité. */
export function Profile({ session, size = 'sm' }: { session: Session; size?: 'sm' | 'lg' }) {
  return (
    <div className={`profile profile-${size}`} aria-hidden="true">
      {blocks(session).map((b, i) => (
        <span
          key={i}
          className={`pb z-${b.z}${b.gapBefore ? ' gap' : ''}`}
          style={{ flexGrow: b.min, height: `${ZONES[b.z].level * 100}%` }}
        />
      ))}
    </div>
  )
}
