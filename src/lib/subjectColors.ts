// Dark-theme subject color system for QuantSun-style UI
// Returns inline style objects since these use rgba values not in Tailwind's default palette

export interface SubjectStyle {
  bg: string;
  text: string;
  border: string;
  // Inline style version for glassmorphic badges
  style: {
    background: string;
    color: string;
    border: string;
  };
}

const subjectMap: Record<string, SubjectStyle> = {
  Mathematics: {
    bg: '', text: '', border: '',
    style: { background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.28)' },
  },
  Physics: {
    bg: '', text: '', border: '',
    style: { background: 'rgba(139,92,246,0.12)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.28)' },
  },
  'Computer Science': {
    bg: '', text: '', border: '',
    style: { background: 'rgba(16,185,129,0.12)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.28)' },
  },
  Chemistry: {
    bg: '', text: '', border: '',
    style: { background: 'rgba(20,184,166,0.12)', color: '#5eead4', border: '1px solid rgba(20,184,166,0.28)' },
  },
  Biology: {
    bg: '', text: '', border: '',
    style: { background: 'rgba(34,197,94,0.12)', color: '#86efac', border: '1px solid rgba(34,197,94,0.28)' },
  },
  History: {
    bg: '', text: '', border: '',
    style: { background: 'rgba(245,158,11,0.12)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.28)' },
  },
  Economics: {
    bg: '', text: '', border: '',
    style: { background: 'rgba(234,179,8,0.12)', color: '#fde047', border: '1px solid rgba(234,179,8,0.28)' },
  },
  Literature: {
    bg: '', text: '', border: '',
    style: { background: 'rgba(244,63,94,0.12)', color: '#fda4af', border: '1px solid rgba(244,63,94,0.28)' },
  },
  Geography: {
    bg: '', text: '', border: '',
    style: { background: 'rgba(249,115,22,0.12)', color: '#fdba74', border: '1px solid rgba(249,115,22,0.28)' },
  },
  Philosophy: {
    bg: '', text: '', border: '',
    style: { background: 'rgba(167,139,250,0.12)', color: '#ddd6fe', border: '1px solid rgba(167,139,250,0.28)' },
  },
  Psychology: {
    bg: '', text: '', border: '',
    style: { background: 'rgba(236,72,153,0.12)', color: '#f9a8d4', border: '1px solid rgba(236,72,153,0.28)' },
  },
  Engineering: {
    bg: '', text: '', border: '',
    style: { background: 'rgba(14,165,233,0.12)', color: '#7dd3fc', border: '1px solid rgba(14,165,233,0.28)' },
  },
};

const defaultStyle: SubjectStyle = {
  bg: '', text: '', border: '',
  style: { background: 'rgba(193,127,58,0.12)', color: '#C8956A', border: '1px solid rgba(193,127,58,0.28)' },
};

export function getSubjectColors(subject: string): SubjectStyle {
  return subjectMap[subject] || defaultStyle;
}
