export function CheckTable({ check }: { check: { title: string; when: string; rows: string[][]; note?: string } }) {
  return (
    <div className="card check">
      <h3>{check.title}</h3>
      <div className="when num">{check.when}</div>
      <ul>
        {check.rows.map(([k, v]) => (
          <li key={k}><b className="num">{k}</b><span>{v}</span></li>
        ))}
      </ul>
      {check.note && <p className="note">{check.note}</p>}
    </div>
  )
}
