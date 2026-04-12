import { internshipsList } from '@/lib/sidebarData';

export const metadata = { title: 'Internships — StudyHub' };

const typeColors: Record<string, { bg: string; color: string; border: string }> = {
  'Trading':    { bg: 'rgba(16,185,129,0.08)',  color: '#6ee7b7', border: 'rgba(16,185,129,0.2)' },
  'Quant':      { bg: 'rgba(99,102,241,0.08)',   color: '#a5b4fc', border: 'rgba(99,102,241,0.2)' },
  'Bank Quant': { bg: 'rgba(245,158,11,0.08)',   color: '#fcd34d', border: 'rgba(245,158,11,0.2)' },
  'SWE':        { bg: 'rgba(236,72,153,0.08)',   color: '#f9a8d4', border: 'rgba(236,72,153,0.2)' },
  'FinTech':    { bg: 'rgba(14,165,233,0.08)',   color: '#7dd3fc', border: 'rgba(14,165,233,0.2)' },
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
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: isOpen ? '#10b981' : '#9A7A62' }}
      />
      {isOpen ? 'Open' : 'TBA'}
    </span>
  );
}

export default function InternshipsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-4" style={{
          fontFamily: 'JetBrains Mono, monospace',
          background: 'rgba(212,146,63,0.08)',
          border: '1px solid rgba(212,146,63,0.2)',
          color: '#C8956A',
        }}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          INTERNSHIPS
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif', color: '#C8956A' }}>
          Quant Internships
        </h1>
        <p style={{ color: '#9A7A62' }}>
          Summer internship programs at top quantitative trading firms, hedge funds, and banks.
        </p>
      </div>

      {/* List */}
      <div className="space-y-3">
        {internshipsList.map((item) => {
          const typeStyle = typeColors[item.type] ?? { bg: 'rgba(193,127,58,0.08)', color: '#C8956A', border: 'rgba(193,127,58,0.2)' };
          return (
            <a
              key={item.url + item.title}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-2xl p-5 transition-all duration-150"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(180,90,40,0.18)' }}
            >
              {/* Company initial */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold uppercase shrink-0"
                style={{ background: 'rgba(193,127,58,0.12)', color: '#C8956A', border: '1px solid rgba(193,127,58,0.22)' }}
              >
                {item.title.charAt(0)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-semibold" style={{ fontFamily: 'Syne, sans-serif', color: '#C8956A' }}>
                    {item.title}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: typeStyle.bg, color: typeStyle.color, border: `1px solid ${typeStyle.border}` }}
                  >
                    {item.type}
                  </span>
                  <StatusBadge status={item.status} />
                </div>
                <p className="text-sm mb-2" style={{ color: '#9A7A62' }}>{item.description}</p>
                {item.deadline && (
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: '#5a3828' }}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Deadline: {item.deadline}
                  </div>
                )}
              </div>

              {/* Arrow */}
              <svg
                className="w-4 h-4 shrink-0 mt-1 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ color: '#5a3828' }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          );
        })}
      </div>
    </div>
  );
}
