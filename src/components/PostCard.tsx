import Link from 'next/link';
import { getSubjectColors } from '@/lib/subjectColors';

interface PostCardProps {
  id: string;
  title: string;
  description: string;
  subject: string;
  topics: string;
  authorName: string;
  createdAt: Date | string;
  resourceCount?: number;
}

export default function PostCard({
  id,
  title,
  description,
  subject,
  topics,
  authorName,
  createdAt,
  resourceCount = 0,
}: PostCardProps) {
  const colors = getSubjectColors(subject);
  let parsedTopics: string[] = [];
  try {
    parsedTopics = JSON.parse(topics);
  } catch {
    parsedTopics = [];
  }

  const date = new Date(createdAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link href={`/posts/${id}`} className="block">
      <div className="card p-5 cursor-pointer group">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
          >
            {subject}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span>{resourceCount} {resourceCount === 1 ? 'resource' : 'resources'}</span>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
          {title}
        </h3>

        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{description}</p>

        {parsedTopics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {parsedTopics.slice(0, 4).map((topic) => (
              <span
                key={topic}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
              >
                {topic}
              </span>
            ))}
            {parsedTopics.length > 4 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-500">
                +{parsedTopics.length - 4} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>by {authorName}</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </Link>
  );
}
