import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { GitHubEvent } from '../types';

function getPriorityStyles(score: number): { badge: string; bar: string } {
  if (score >= 50) return { badge: 'text-rose bg-rose/10 border-rose/20', bar: 'bg-rose' };
  if (score >= 20) return { badge: 'text-amber bg-amber/10 border-amber/20', bar: 'bg-amber' };
  return { badge: 'text-text-dim bg-text-dim/10 border-text-dim/20', bar: 'bg-text-dim' };
}

function EventCard({ event }: { event: GitHubEvent }) {
  const s = getPriorityStyles(event.priorityScore);

  return (
    <Link
      to={`/review-queue/${event._id}`}
      className="block bg-white border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      <div className={`h-1 ${s.bar}`} />
      <div className="p-4 flex justify-between items-start gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-medium text-text">
              <span className="font-mono text-text-dim text-sm mr-1">
                #{event.prNumber}
              </span>
              {event.prTitle}
            </span>
            {event.isStale && (
              <span className="text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wide text-amber bg-amber/10 border-amber/20 shrink-0">
                Stale
              </span>
            )}
          </div>
          <p className="text-sm text-text-muted truncate">
            {event.repository} by {event.prAuthor}
          </p>
        </div>
        <span
          className={`text-[10px] px-3 py-1 rounded-full border font-medium uppercase tracking-wide shrink-0 ${s.badge}`}
        >
          Priority {event.priorityScore}
        </span>
      </div>
    </Link>
  );
}

export default function ReviewQueuePage() {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchQueue() {
    setLoading(true);
    try {
      const res = await api.get('/webhooks/review-queue');
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQueue();
  }, []);

  return (
    <div className="px-6 py-8 md:px-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-text tracking-tight">
            Review Queue
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Pull requests prioritized by AI, most urgent first
          </p>
        </div>
        <button
          onClick={fetchQueue}
          className="bg-white border border-border text-text px-4 py-2 rounded-md text-sm font-medium shadow-sm hover:shadow-md hover:border-accent/40 transition-all self-start"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <p className="text-text-muted font-mono text-sm">Loading…</p>
      )}

      {!loading && events.length === 0 && (
        <div className="border border-dashed border-border rounded-xl p-12 text-center bg-white/50">
          <p className="text-text-muted text-sm">
            No open pull requests yet — connect a GitHub repo to see PRs here.
          </p>
        </div>
      )}

      {!loading && events.length > 0 && (
        <div className="space-y-3">
          {events.map(function (event) {
            return <EventCard key={event._id} event={event} />;
          })}
        </div>
      )}
    </div>
  );
}