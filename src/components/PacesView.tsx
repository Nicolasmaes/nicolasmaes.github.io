import { ZONES, ZONE_ORDER } from '../data'
import { CHECK_10K, CHECK_SEMI, SEMI_EXPLAINED } from '../content'
import { CheckTable } from './CheckTable'

export function PacesView({ onPick }: { onPick: (n: number) => void }) {
  return (
    <div>
      <div className="eyebrow">Repères</div>
      <h2 className="h2">Les allures</h2>
      <p className="lead">Valeurs de départ, à recalibrer après le test 10 km du 4 janvier.</p>

      <ul className="paces">
        {ZONE_ORDER.map((z) => (
          <li key={z} className={`pace-card z-${z}`}>
            <div className="pace-top">
              <b>{ZONES[z].name}</b>
              <span className="pace-v num">{ZONES[z].pace}</span>
            </div>
            <p>{ZONES[z].feel}</p>
          </li>
        ))}
      </ul>
      <p className="note">
        Après le test : allure 10 km = temps du test ÷ 10, tempo ≈ allure 10 km + 5 à 10 secondes. L'allure marathon
        cible se confirme au semi.
      </p>

      <div className="eyebrow sec">Points de contrôle</div>
      <h2 className="h2">Deux rendez-vous pour ajuster</h2>
      <CheckTable check={CHECK_10K} />
      <button className="link" onClick={() => onPick(CHECK_10K.week)}>Voir la semaine 10 →</button>
      <CheckTable check={CHECK_SEMI} />
      <button className="link" onClick={() => onPick(CHECK_SEMI.week)}>Voir la semaine 17 →</button>

      <details className="card more">
        <summary>Qu'est-ce que le semi test ?</summary>
        {SEMI_EXPLAINED.map((t) => <p key={t}>{t}</p>)}
      </details>
    </div>
  )
}
