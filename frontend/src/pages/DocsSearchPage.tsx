import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { QueryResponse } from '../types';

export default function DocsSearchPage() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await api.post('/ai/ask', { question });
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to get an answer');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Link to="/sprints" className="text-blue-600 text-sm mb-4 inline-block">
        Back to Sprints
      </Link>

      <h1 className="text-2xl font-bold mb-1">Docs & Incident Search</h1>
      <p className="text-gray-500 text-sm mb-6">
        Ask a question about your team's docs and runbooks
      </p>

      <form onSubmit={handleAsk} className="mb-8 max-w-2xl">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="e.g. How do we deploy to staging?"
            value={question}
            onChange={function (e) {
              setQuestion(e.target.value);
            }}
            className="flex-1 border rounded p-3"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Thinking...' : 'Ask'}
          </button>
        </div>
      </form>

      {error ? <p className="text-red-500 mb-4">{error}</p> : null}

      {result ? (
        <div className="max-w-2xl">
          <div className="bg-white p-6 rounded-lg shadow mb-4">
            <h2 className="font-semibold text-lg mb-2">Answer</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{result.answer}</p>
          </div>

          {result.sources.length > 0 ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="font-semibold text-lg mb-3">Sources</h2>
              <div className="space-y-3">
                {result.sources.map(function (source, index) {
                  return (
                    <div key={index} className="border-l-4 border-blue-200 pl-4">
                      <p className="text-sm font-medium text-gray-700">
                        {source.document_name}
                      </p>
                      <p className="text-sm text-gray-500">{source.chunk_text}...</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}