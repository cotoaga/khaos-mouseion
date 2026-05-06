'use client';

function lastSunday(): string {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay()); // getDay() === 0 on Sunday → stays today
  return d.toISOString().slice(0, 10);
}

const thStyle: React.CSSProperties = { padding: '12px 16px', color: 'white', fontFamily: 'var(--font-space-grotesk)', fontSize: 13, fontWeight: 600, textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' };
const tdStyle: React.CSSProperties = { padding: '12px 16px', color: 'var(--brand-text-secondary)' };
const tdMono: React.CSSProperties = { ...tdStyle, fontFamily: 'var(--font-mono)', fontSize: 13 };

export default function CyrilPage() {
  const sunday = lastSunday();
  const summaryItems = [
    { label: 'Books', value: '1' },
    { label: 'Authors', value: '0 known' },
    { label: 'Released', value: 'unknown' },
    { label: 'Read', value: sunday.slice(0, 4) },
  ];

  return (
    <div style={{ background: 'var(--brand-surface)', minHeight: '100vh', padding: '32px 24px', fontFamily: 'var(--font-inter)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--brand-text-secondary)', letterSpacing: '0.1em', fontFamily: 'var(--font-space-grotesk)', textTransform: 'uppercase' }}>KHAOS-MOUSEION</div>
          <h1 style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 36, fontWeight: 700, color: 'var(--brand-hero-color)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '8px 0 0' }}>CYRIL</h1>
        </div>

        {/* Summary Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, background: 'var(--brand-tint-bg)', border: '1px solid var(--brand-border)', padding: 20, marginBottom: 24 }}>
          {summaryItems.map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 28, fontWeight: 700, color: 'var(--brand-primary)', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 12, color: 'var(--brand-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--brand-primary)' }}>
                {['Title', 'Author', 'Released', 'Read', 'Themes', 'Categories', 'Medium'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--brand-border)' }}>
                <td style={{ ...tdStyle, color: 'var(--brand-text-body)' }}>Old Testament</td>
                <td style={tdStyle}>unknown</td>
                <td style={tdMono}>unknown</td>
                <td style={tdMono}>{sunday}</td>
                <td style={tdStyle}>—</td>
                <td style={tdStyle}>—</td>
                <td style={tdStyle}>—</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
