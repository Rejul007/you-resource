import React from 'react';

const quickResources = [
  { title: 'MDN Web Docs', url: 'https://developer.mozilla.org', description: 'Web technology documentation' },
  { title: 'Khan Academy', url: 'https://www.khanacademy.org', description: 'Free courses for all ages' },
  { title: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu', description: 'Free MIT course materials' },
  { title: 'Coursera', url: 'https://www.coursera.org', description: 'University courses online' },
  { title: 'edX', url: 'https://www.edx.org', description: 'Online courses from top universities' },
  { title: 'arXiv', url: 'https://arxiv.org', description: 'Free scientific preprints' },
];

const scholarships = [
  { title: 'Gates Scholarship', url: 'https://www.gatesfoundation.org', description: 'Gates Foundation scholarships' },
  { title: 'Fulbright Program', url: 'https://foreign.fulbrightonline.org', description: 'US exchange scholarships' },
  { title: 'Chevening', url: 'https://www.chevening.org', description: 'UK government scholarships' },
  { title: 'DAAD Scholarships', url: 'https://www.daad.de/en/', description: 'German academic exchange' },
];

const competitions = [
  { title: 'ICPC', url: 'https://icpc.global', description: 'International Collegiate Programming Contest' },
  { title: 'Google Code Jam', url: 'https://codingcompetitions.withgoogle.com/codejam', description: 'Google coding competition' },
  { title: 'International Math Olympiad', url: 'https://www.imo-official.org', description: 'World mathematics olympiad' },
  { title: 'Science Olympiad', url: 'https://www.soinc.org', description: 'STEM competition for students' },
];

function SidebarSection({
  title,
  icon,
  accentColor,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  accentColor: string;
  items: { title: string; url: string; description: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl" style={{ border: '1px solid rgba(180,90,40,0.18)', background: 'rgba(255,255,255,0.025)' }}>
      <div className="px-4 py-3 flex items-center gap-2.5" style={{ borderBottom: '1px solid rgba(180,90,40,0.15)', background: 'rgba(255,255,255,0.03)' }}>
        <div className="w-6 h-6 flex items-center justify-center rounded-lg" style={{ background: `${accentColor}20`, color: accentColor }}>
          {icon}
        </div>
        <h3 className="text-sm font-semibold tracking-wide uppercase" style={{ fontFamily: 'Syne, sans-serif', color: '#C8956A', letterSpacing: '0.06em' }}>
          {title}
        </h3>
      </div>
      <div>
        {items.map((item) => (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 px-4 py-2.5 transition-all duration-150 group"
            style={{ borderBottom: '1px solid rgba(180,90,40,0.08)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(193,127,58,0.06)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 transition-colors" style={{ background: accentColor, opacity: 0.6 }} />
            <div>
              <p className="text-sm font-medium transition-colors" style={{ color: '#C8956A' }}>
                {item.title}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#5a3828' }}>{item.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0">
      <div className="sticky top-20 space-y-3">
        <SidebarSection
          title="Resources"
          accentColor="#6366f1"
          icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>}
          items={quickResources}
        />
        <SidebarSection
          title="Scholarships"
          accentColor="#D4923F"
          icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
          items={scholarships}
        />
        <SidebarSection
          title="Competitions"
          accentColor="#10b981"
          icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
          items={competitions}
        />
      </div>
    </aside>
  );
}
