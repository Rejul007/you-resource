import { competitionsList } from '@/lib/sidebarData';

export const metadata = { title: 'Competitions — StudyHub' };

const categoryColors: Record<string, { bg: string; color: string; border: string }> = {
  'Algo Trading':         { bg: 'rgba(16,185,129,0.08)',  color: '#6ee7b7', border: 'rgba(16,185,129,0.2)' },
  'ML & Alpha Research':  { bg: 'rgba(99,102,241,0.08)',  color: '#a5b4fc', border: 'rgba(99,102,241,0.2)' },
  'ML & Data Science':    { bg: 'rgba(99,102,241,0.08)',  color: '#a5b4fc', border: 'rgba(99,102,241,0.2)' },
  'Quant Research':       { bg: 'rgba(245,158,11,0.08)',  color: '#fcd34d', border: 'rgba(245,158,11,0.2)' },
  'Trading Simulation':   { bg: 'rgba(14,165,233,0.08)',  color: '#7dd3fc', border: 'rgba(14,165,233,0.2)' },
  'Discovery Program':    { bg: 'rgba(212,146,63,0.08)',  color: '#C8956A', border: 'rgba(212,146,63,0.2)' },
  'SWE / Trading':        { bg: 'rgba(236,72,153,0.08)',  color: '#f9a8d4', border: 'rgba(236,72,153,0.2)' },
};

function StatusBadge({ status }: { status: string }) {
  const isOpen = status === 'open';
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        background: isOpen ? 'rgba(16,185,129,0.1)' : 'rgba(90,56,40,0.1)',
        color: isOpen ? '#6ee7b7' : '#9A7A62',
        border: `1px solid ${isOpen ? 'rgba(16,185,129,0.25)' : 'rgba(90,56,40,0.2)'}`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: isOpen ? '#10b981' : '#9A7A62' }} />
      {isOpen ? 'Open' : 'TBA'}
    </span>
  );
}

export default function CompetitionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-4" style={{
          fontFamily: 'JetBrains Mono, monospace',
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.2)',
          color: '#6ee7b7',
        }}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          COMPETITIONS
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif', color: '#C8956A' }}>
          Quant Competitions
        </h1>
        <p style={{ color: '#9A7A62' }}>
          Algorithmic trading, quant research, and discovery programs from top firms.
        </p>
      </div>

      {/* List */}
      <div className="space-y-3">
        {competitionsList.map((item) => {
          const catStyle = categoryColors[item.category] ?? { bg: 'rgba(193,127,58,0.08)', color: '#C8956A', border: 'rgba(193,127,58,0.2)' };
          return (
            <a
              key={item.url + item.title}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl p-5 transition-all duration-150"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(180,90,40,0.18)' }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold" style={{ fontFamily: 'Syne, sans-serif', color: '#C8956A' }}>
                    {item.title}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: catStyle.bg, color: catStyle.color, border: `1px solid ${catStyle.border}` }}
                  >
                    {item.category}
                  </span>
                  <StatusBadge status={item.status} />
                </div>
                <svg
                  className="w-4 h-4 shrink-0 mt-0.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  style={{ color: '#5a3828' }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>

              {/* Org */}
              <p className="text-xs mb-2" style={{ color: '#5a3828', fontFamily: 'JetBrains Mono, monospace' }}>
                {item.org}
              </p>

              {/* Description */}
              <p className="text-sm mb-3" style={{ color: '#9A7A62' }}>{item.description}</p>

              {/* Prize + Deadline */}
              <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: '#5a3828' }}>
                {item.prize && (
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span style={{ color: '#C8956A' }}>{item.prize}</span>
                  </div>
                )}
                {item.deadline && (
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Deadline: {item.deadline}
                  </div>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
