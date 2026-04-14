import { quickResources } from '@/lib/sidebarData';

export const metadata = { title: 'Resources — StudyHub' };

export default function ResourcesPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-4" style={{
          fontFamily: 'JetBrains Mono, monospace',
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          color: '#818cf8',
        }}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          STUDY RESOURCES
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif', color: '#C8956A' }}>
          Learning Resources
        </h1>
        <p style={{ color: '#9A7A62' }}>
          Curated platforms and tools for quantitative finance, mathematics, and computer science.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {quickResources.map((item) => (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-2xl p-5 transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(180,90,40,0.18)',
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-semibold mb-1 truncate" style={{ fontFamily: 'Syne, sans-serif', color: '#C8956A' }}>
                  {item.title}
                </h3>
                <p className="text-sm" style={{ color: '#9A7A62' }}>{item.description}</p>
              </div>
              <svg
                className="w-4 h-4 shrink-0 mt-0.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ color: '#5a3828' }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#6366f1', opacity: 0.7 }} />
              <span className="text-xs truncate" style={{ color: '#5a3828', fontFamily: 'JetBrains Mono, monospace' }}>
                {new URL(item.url).hostname.replace('www.', '')}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
