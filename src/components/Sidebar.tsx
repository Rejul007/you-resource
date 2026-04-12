'use client';

import React from 'react';

const quickResources = [
  { title: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu', description: 'Free MIT course materials' },
  { title: 'QuantConnect', url: 'https://www.quantconnect.com', description: 'Algorithmic trading & backtesting' },
  { title: 'WorldQuant BRAIN', url: 'https://platform.worldquantbrain.com', description: 'Build & simulate alpha models' },
  { title: 'Kaggle', url: 'https://www.kaggle.com', description: 'Data science competitions & datasets' },
  { title: 'arXiv Quant Finance', url: 'https://arxiv.org/list/q-fin/recent', description: 'Latest quant finance papers' },
  { title: 'SSRN Finance', url: 'https://www.ssrn.com/index.cfm/en/finance/', description: 'Finance working papers & research' },
];

const internships = [
  { title: 'Jane Street', url: 'https://www.janestreet.com/join-jane-street/internship/', description: 'QT/QR intern — NYC/London/HK' },
  { title: 'Citadel', url: 'https://www.citadel.com/careers/open-opportunities/students/', description: 'QR/Trading/SWE intern — Chicago/NYC' },
  { title: 'Two Sigma', url: 'https://www.twosigma.com/careers/', description: 'Quant Research intern — NYC' },
  { title: 'D.E. Shaw', url: 'https://www.deshaw.com/careers/internships', description: 'Quant Analyst/Trader intern — NYC' },
  { title: 'Jump Trading', url: 'https://jumptrading.com/careers/', description: 'Quant Research intern — Chicago' },
  { title: 'Optiver', url: 'https://optiver.com/working-at-optiver/career-opportunities/', description: 'Trading/SWE intern — Amsterdam/Chicago' },
];

const competitions = [
  { title: 'IMC Prosperity 2026', url: 'https://prosperity.imc.com', description: 'Python algo trading — $50k prize · Open' },
  { title: 'WorldQuant IQC 2026', url: 'https://platform.worldquantbrain.com/iqc', description: 'Alpha model competition — Cash + FT · Open' },
  { title: 'Citadel Quant Invitational', url: 'https://www.citadelsecurities.com/careers/programs-and-events/the-citadel-securities-quant-invitational/', description: 'STEM challenge London — $10k prize' },
  { title: 'Jane Street AMP 2026', url: 'https://www.janestreet.com/join-jane-street/programs-and-events/amp/', description: '6-week HS program — $5k scholarship' },
  { title: 'Optiver Career Kickstarter', url: 'https://optiver.com/working-at-optiver/career-opportunities/', description: 'Tech & trading tracks — Amsterdam' },
  { title: 'SIG Discover 2026', url: 'https://careers.sig.com/discover', description: 'Spring discovery program — Philadelphia' },
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
          title="Internships"
          accentColor="#D4923F"
          icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
          items={internships}
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
