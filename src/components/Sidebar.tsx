import React from 'react';

const quickResources = [
  {
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    description: 'Web technology documentation',
  },
  {
    title: 'Khan Academy',
    url: 'https://www.khanacademy.org',
    description: 'Free courses for all ages',
  },
  {
    title: 'MIT OpenCourseWare',
    url: 'https://ocw.mit.edu',
    description: 'Free MIT course materials',
  },
  {
    title: 'Coursera',
    url: 'https://www.coursera.org',
    description: 'University courses online',
  },
  {
    title: 'edX',
    url: 'https://www.edx.org',
    description: 'Online courses from top universities',
  },
  {
    title: 'arXiv',
    url: 'https://arxiv.org',
    description: 'Free scientific preprints',
  },
];

const scholarships = [
  {
    title: 'Gates Scholarship',
    url: 'https://www.gatesfoundation.org',
    description: 'Gates Foundation scholarships',
  },
  {
    title: 'Fulbright Program',
    url: 'https://foreign.fulbrightonline.org',
    description: 'US exchange scholarships',
  },
  {
    title: 'Chevening',
    url: 'https://www.chevening.org',
    description: 'UK government scholarships',
  },
  {
    title: 'DAAD Scholarships',
    url: 'https://www.daad.de/en/',
    description: 'German academic exchange',
  },
];

const competitions = [
  {
    title: 'ICPC',
    url: 'https://icpc.global',
    description: 'International Collegiate Programming Contest',
  },
  {
    title: 'Google Code Jam',
    url: 'https://codingcompetitions.withgoogle.com/codejam',
    description: 'Google coding competition',
  },
  {
    title: 'International Math Olympiad',
    url: 'https://www.imo-official.org',
    description: 'World mathematics olympiad',
  },
  {
    title: 'Science Olympiad',
    url: 'https://www.soinc.org',
    description: 'STEM competition for students',
  },
];

export default function Sidebar() {
  return (
    <aside className="w-72 shrink-0">
      <div className="sticky top-20 space-y-4">
        {/* Quick Resources */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-indigo-600 text-white">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Quick Resources
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {quickResources.map((item) => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-400 mt-2 shrink-0 group-hover:bg-indigo-600 transition-colors" />
                <div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Scholarships */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-amber-500 text-white">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Scholarships
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {scholarships.map((item) => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
              >
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0 group-hover:bg-amber-600 transition-colors" />
                <div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-amber-600 transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Competitions */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-emerald-600 text-white">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Competitions
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {competitions.map((item) => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0 group-hover:bg-emerald-600 transition-colors" />
                <div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
