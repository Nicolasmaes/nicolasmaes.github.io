import { NUTRITION, PRIORITIES, RENFO } from '../content'

const GAUGE: [string, string, number, boolean?][] = [
  ['Paris 2019', '4h38', 93],
  ['Projection du 10 km', '≈ 4h40', 94],
  ['Objectif', '4h15', 85, true],
  ['Garde-fou', '4h30', 90],
]

export function InfoView() {
  return (
    <div>
      <div className="eyebrow">Point de départ</div>
      <h2 className="h2">Un objectif ambitieux</h2>
      <div className="card reading">
        <p>
          4h15 demande de tenir <strong>6'03" par kilomètre pendant 42 km</strong>. C'est presque son allure actuelle sur
          10 km (6'06"). Pour y arriver, il faut gagner environ 5 à 6 minutes sur 10 km d'ici la course, soit viser 55'.
        </p>
        <p>
          Point favorable : Coralie a beaucoup de kilomètres faciles dans les jambes, mais très peu de travail de vitesse
          structuré. La marge de progression est réelle.
        </p>
        <p>
          Deux points de contrôle (un test de 10 km en janvier, un semi fin février) permettent de confirmer 4h15 ou de
          viser plus prudemment 4h20 à 4h30, sans stress. Sous 4h30 reste le garde-fou.
        </p>
      </div>

      <div className="card gauge">
        <div className="eyebrow">Temps au marathon</div>
        {GAUGE.map(([l, t, w, goal]) => (
          <div className="grow" key={l}>
            <span>{l}</span>
            <div className="track"><div className={`fill${goal ? ' goal' : ''}`} style={{ width: `${w}%` }} /></div>
            <span className="t num">{t}</span>
          </div>
        ))}
        <p className="note">Projection : 10 km en 1h01 converti avec la formule de Riegel. Barres à l'échelle, de 0 à 5 h.</p>
      </div>

      <details className="card more">
        <summary>Le profil de Coralie</summary>
        <dl className="profile-dl">
          <div><dt>Âge, taille</dt><dd>35 ans, 1 m 59, très bonne condition physique, aucune blessure passée ou actuelle</dd></div>
          <div><dt>Volume actuel</dt><dd>3 à 4 sorties par semaine, environ 30 km, sortie la plus longue récente : 11 km</dd></div>
          <div><dt>Repères de course</dt><dd>10 km en 1h01 (≈ 6'06"/km) · allure habituelle des sorties à jeun ≈ 6'15"/km (avril : 154 km à 6'14" de moyenne) · marathon de Paris 2019 en 4h38</dd></div>
          <div><dt>Renforcement</dt><dd>2 à 3 fois par semaine à la maison : squats, gainage, abdos, fentes · court avec une Apple Watch</dd></div>
          <div><dt>Contraintes</dt><dd>Entraînements idéaux lundi, mercredi, vendredi (vie de parents) · sortie longue le vendredi · pas de course intermédiaire prévue</dd></div>
        </dl>
      </details>

      <div className="eyebrow sec">Le rythme</div>
      <h2 className="h2">Une semaine type</h2>
      <div className="week3">
        <div className="day t-q"><div className="d">Lundi</div><h3>Qualité</h3><p>Fractionné, tempo, puis allure marathon. La séance exigeante de la semaine, jambes fraîches après le week-end.</p></div>
        <div className="day t-e"><div className="d">Mercredi</div><h3>Footing facile</h3><p>Allure vraiment tranquille, parfois quelques lignes droites ou un peu d'allure marathon.</p></div>
        <div className="day t-l"><div className="d">Vendredi</div><h3>Sortie longue</h3><p>De 12 à 32 km. Le pilier du plan, suivi d'un week-end sans course.</p></div>
      </div>
      <div className="tip"><p><b>Renfo :</b> {RENFO}</p></div>
      <div className="tip"><p><b>Dimanche :</b> repos, sauf le semi test (28 février) et le marathon (4 avril). Une 4ᵉ sortie facultative de 30 à 40' très faciles le jeudi ne remplace rien.</p></div>
      <div className="tip tip-alt"><p><b>Un imprévu ?</b> {PRIORITIES}</p></div>

      <div className="eyebrow sec">Carburant</div>
      <h2 className="h2">Nutrition et sorties à jeun</h2>
      <div className="card fuel"><h3>Footings faciles</h3><p>{NUTRITION.easy}</p></div>
      <div className="card fuel"><h3>Séances du lundi</h3><p>{NUTRITION.quality}</p></div>
      <div className="card fuel"><h3>Sorties longues</h3><p>{NUTRITION.long}</p><p>{NUTRITION.longAM}</p></div>

      <div className="eyebrow sec">Bon à savoir</div>
      <h2 className="h2">Les conseils</h2>
      <div className="foot">
        <p><b>Hiver :</b> en cas de verglas ou de forte pluie, on garde le jour mais on passe en footing facile, ou on décale d'un jour.</p>
        <p><b>Douleur :</b> si elle persiste plus de 2 à 3 jours, lever le pied et consulter plutôt que forcer.</p>
        <p><b>Chaussures :</b> roder une paire neuve vers les semaines 12 à 14, avec au moins 80 à 100 km avant le jour J.</p>
      </div>
    </div>
  )
}
