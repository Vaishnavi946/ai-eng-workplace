import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import type { GitHubEvent } from '../types';

export default function PRDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<GitHubEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get('/webhooks/review-queue');
        const events: GitHubEvent[] = res.data;
        const match = events.find((e) => e._id === id);
        setEvent(match || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const priorityLevel = (score: number) => {
    if (score >= 50) return { label: 'High', color: 'text-rose bg-rose/10 border-rose/20' };
    if (score >= 20) return { label: 'Medium', color: 'text-amber bg-amber/10 border-amber/20' };
    return { label: 'Low', color: 'text-text-dim bg-text-dim/10 border-text-dim/20' };
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-text-muted font-mono text-sm">Loading…</p>
      </div>
    );

  if (!event)
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-text-muted font-mono text-sm">PR not found.</p>
      </div>
    );

  const level = priorityLevel(event.priorityScore);

  return (
    <div className="px-6 py-8 md:px-10">
      <div className="flex items-center gap-2 text-sm mb-4">
        <Link to="/review-queue" className="text-text-muted hover:text-accent transition-colors">
          Review Queue
        </Link>
        <span className="text-text-dim">/</span>
        <span className="text-text font-medium">#{event.prNumber}</span>
      </div>

      <div className="bg-white border border-border rounded-xl shadow-sm max-w-2xl overflow-hidden">
        <div className={`h-1 ${event.priorityScore >= 50 ? 'bg-rose' : event.priorityScore >= 20 ? 'bg-amber' : 'bg-text-dim'}`} />
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-1">
            <h1 className="text-xl font-semibold text-text tracking-tight">
              {event.prTitle}
            </h1>
            {event.isStale && (
              <span className="text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wide text-amber bg-amber/10 border-amber/20 shrink-0">
                Stale
              </span>
            )}
          </div>
          <p className="text-sm text-text-muted mb-6">
            <span className="font-mono text-text-dim">#{event.prNumber}</span>{' '}
            in {event.repository} by {event.prAuthor}
          </p>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-xs text-text-muted mb-1">Priority score</p>
              <p className="text-2xl font-display font-semibold text-text">
                {event.priorityScore}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-1">Priority level</p>
              <span className={`inline-block text-xs px-2.5 py-1 rounded-full border font-medium ${level.color}`}>
                {level.label}
              </span>
            </div>
          </div>

          <div className="border-t border-border pt-4 mb-6">
            <p className="text-xs text-text-muted mb-2">How this score is calculated</p>
            <p className="text-sm text-text-muted leading-relaxed">
              Based on how long the PR has been open, the number of changed
              files, and whether it's still a draft. Higher scores mean the
              PR has likely been waiting longer and touches more of the
              codebase — so it surfaces first in the queue.
              {event.isStale && ' This PR hasn\u2019t been updated in 3+ days, which is why it\u2019s flagged as stale.'}
            </p>
          </div>

          <button
            onClick={() => window.open(event.prUrl, '_blank', 'noopener,noreferrer')}
            className="inline-block bg-accent text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm hover:bg-accent/90 hover:shadow-md transition-all"
          >
            Open on GitHub →
          </button>
        </div>
      </div>
    </div>
  );
}