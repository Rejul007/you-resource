export const subjectColors: Record<string, { bg: string; text: string; border: string }> = {
  Mathematics: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  Physics: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
  'Computer Science': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  Chemistry: { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200' },
  Biology: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
  History: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
  Economics: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  Literature: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-200' },
  Geography: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  Philosophy: { bg: 'bg-violet-100', text: 'text-violet-800', border: 'border-violet-200' },
  Psychology: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200' },
  Engineering: { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-200' },
  default: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
};

export function getSubjectColors(subject: string) {
  return subjectColors[subject] || subjectColors.default;
}
