import RequestForm from '@/components/RequestForm';

export default function RequestPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Study Resources</h1>
        <p className="text-gray-500">
          Describe what you need — our AI will classify your request and help the community
          find the right resources for you.
        </p>
      </div>
      <RequestForm />
    </div>
  );
}
