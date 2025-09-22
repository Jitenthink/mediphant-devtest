import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mediphant DevTest
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Medication Interaction Checker & FAQ System
          </p>
          <p className="text-sm text-gray-500">
            <strong>For informational purposes only. Not medical advice.</strong>
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link 
            href="/interactions"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200 hover:border-blue-300"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Interaction Checker
              </h2>
            </div>
            <p className="text-gray-600">
              Check for potential interactions between two medications using our mock knowledge base.
            </p>
            <div className="mt-4 text-blue-600 text-sm font-medium">
              Check Interactions →
            </div>
          </Link>

          <Link 
            href="/faq"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200 hover:border-blue-300"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Medication FAQ
              </h2>
            </div>
            <p className="text-gray-600">
              Get AI-powered answers to medication questions using vector search and retrieval.
            </p>
            <div className="mt-4 text-green-600 text-sm font-medium">
              Ask Questions →
            </div>
          </Link>
        </div>

        {/* Tech Stack */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tech Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium text-gray-900">Frontend</div>
              <div className="text-gray-600">Next.js 14</div>
              <div className="text-gray-600">TypeScript</div>
              <div className="text-gray-600">Tailwind CSS</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900">Backend</div>
              <div className="text-gray-600">API Routes</div>
              <div className="text-gray-600">Zod Validation</div>
              <div className="text-gray-600">OpenAI</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900">Vector DB</div>
              <div className="text-gray-600">Pinecone</div>
              <div className="text-gray-600">Embeddings</div>
              <div className="text-gray-600">Fallback</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
