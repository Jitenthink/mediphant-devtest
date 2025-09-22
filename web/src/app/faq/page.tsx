'use client';

import { useState } from 'react';

interface Match {
  text: string;
  score: number;
  title?: string;
}

interface FAQResponse {
  answer: string;
  matches: Match[];
}

export default function FAQPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<FAQResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a question');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/faq?q=${encodeURIComponent(query.trim())}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get answer');
      }
      
      const data: FAQResponse = await response.json();
      setResult(data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    "How can I improve medication adherence?",
    "What are high-risk drug interactions?",
    "How should I manage my medication list?",
    "What tools can help with taking medications?"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Medication FAQ
          </h1>
          <p className="text-gray-600 text-sm">
            <strong>For informational purposes only. Not medical advice.</strong>
            <br />
            Get answers to common medication questions using AI-powered search.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
                Ask a question about medications
              </label>
              <input
                type="text"
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                placeholder="e.g., How can I remember to take my medications?"
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Searching...' : 'Get Answer'}
            </button>
          </form>
        </div>

        {/* Sample Questions */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Try these sample questions:
          </h2>
          <div className="grid gap-2">
            {sampleQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setQuery(question)}
                className="text-left text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition-colors text-sm"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Answer */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Answer
              </h2>
              <div className="prose prose-sm text-gray-700">
                {result.answer}
              </div>
            </div>

            {/* Matches */}
            {result.matches.length > 0 && (
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Supporting Information
                </h2>
                <div className="space-y-4">
                  {result.matches.map((match, index) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-4">
                      {match.title && (
                        <h3 className="font-medium text-gray-900 mb-1">
                          {match.title}
                        </h3>
                      )}
                      <p className="text-gray-700 text-sm mb-2">
                        {match.text}
                      </p>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500">
                          Relevance: {Math.round(match.score * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
