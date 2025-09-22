'use client';

import { useState } from 'react';
import { InteractionResponse } from '../api/interactions/route';

interface RecentCheck {
  id: string;
  medA: string;
  medB: string;
  timestamp: Date;
  result: InteractionResponse;
}

export default function InteractionsPage() {
  const [medA, setMedA] = useState('');
  const [medB, setMedB] = useState('');
  const [result, setResult] = useState<InteractionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentChecks, setRecentChecks] = useState<RecentCheck[]>([]);

  const validateInput = () => {
    const trimmedA = medA.trim();
    const trimmedB = medB.trim();
    
    if (!trimmedA || !trimmedB) {
      setError('Both medication fields are required');
      return false;
    }
    
    if (trimmedA.toLowerCase() === trimmedB.toLowerCase()) {
      setError('Please enter two different medications');
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInput()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          medA: medA.trim(),
          medB: medB.trim(),
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check interaction');
      }
      
      const data: InteractionResponse = await response.json();
      setResult(data);
      
      // Add to recent checks
      const newCheck: RecentCheck = {
        id: Date.now().toString(),
        medA: medA.trim(),
        medB: medB.trim(),
        timestamp: new Date(),
        result: data,
      };
      
      setRecentChecks(prev => [newCheck, ...prev.slice(0, 4)]); // Keep only 5 most recent
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Medication Interaction Checker
          </h1>
          <p className="text-gray-600 text-sm">
            <strong>For informational purposes only. Not medical advice.</strong>
            <br />
            Always consult your healthcare provider about medication interactions.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="medA" className="block text-sm font-medium text-gray-700 mb-1">
                First Medication
              </label>
              <input
                type="text"
                id="medA"
                value={medA}
                onChange={(e) => setMedA(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                placeholder="e.g., Warfarin"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="medB" className="block text-sm font-medium text-gray-700 mb-1">
                Second Medication
              </label>
              <input
                type="text"
                id="medB"
                value={medB}
                onChange={(e) => setMedB(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                placeholder="e.g., Ibuprofen"
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
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Checking...' : 'Check Interaction'}
            </button>
          </form>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Interaction Result
            </h2>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Medications:</span>
                <p className="text-gray-900">{result.pair[0]} + {result.pair[1]}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500">Risk Level:</span>
                <div className="flex items-center mt-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      result.isPotentiallyRisky
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {result.isPotentiallyRisky ? 'Potentially Risky' : 'No Known High Risk'}
                  </span>
                </div>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500">Reason:</span>
                <p className="text-gray-900 capitalize">{result.reason}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500">Advice:</span>
                <p className="text-gray-900">{result.advice}</p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Checks */}
        {recentChecks.length > 0 && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Checks
            </h2>
            
            <div className="space-y-3">
              {recentChecks.map((check) => (
                <div key={check.id} className="border-l-4 border-gray-200 pl-4 py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {check.medA} + {check.medB}
                      </span>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          check.result.isPotentiallyRisky
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {check.result.isPotentiallyRisky ? 'Risky' : 'Safe'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {check.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
