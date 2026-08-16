import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Sprint, Task, GitHubEvent } from '../types';

type ActivityItem = {
  id: string;
  text: string;
  type: 'sprint' | 'task' | 'pr';
  linkTo?: string;
};

export default function ActivityPage() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const sprintsRes = await api.get('/sprints');
        const sprints: Sprint[] = sprintsRes.data;

        const sprintItems: ActivityItem[] = sprints.map((s) => ({
          id: `sprint-${s._id}`,
          text: `Sprint "${s.name}" created — status: ${s.status}`,
          type: 'sprint',
          linkTo: `/sprints/${s._id}`,
        }));

        const taskLists = await Promise.all(
          sprints.map(async (s) => {
            const res = await api.get(`/tasks?sprint=${s._id}`);
            return (res.data as Task[]).map((t) => ({
              id: `task-${t._id}`,
              text: `Task "${t.title}" is ${t.status === 'todo' ? 'to do' : t.status}`,
              type: 'task' as const,
              linkTo: `/sprints/${s._id}`,
            }));
          })
        );

        const prRes = await api.get('/webhooks/review-queue');
        const prItems: ActivityItem[] = (prRes.data as GitHubEvent[]).map((e) => ({
          id: `pr-${e._id}`,
          text: `PR #${e.prNumber} "${e.prTitle}" — priority ${e.priorityScore}${e.isStale ? ' (stale)' : ''}`,
          type: 'pr',
          linkTo: `/review-queue/${e._id}`,
        }));

        setItems([...sprintItems, ...taskLists.flat(), ...prItems]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  const dotColor = (type: ActivityItem['type']) => {
    if (type === 'sprint') return 'bg-accent';
    if (type === 'pr') return 'bg-amber';
    return 'bg-mint';
  };

  return (
    <div className="px-6 py-8 md:px-10">
      <h1 className="text-2xl font-semibold text-text tracking-tight mb-6">
        Activity
      </h1>

      {loading ? (
        <p className="text-text-muted font-mono text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl p-12 text-center bg-white/50 max-w-2xl">
          <p className="text-text-muted text-sm">
            No activity yet — create a sprint or connect GitHub to get started.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-xl shadow-sm max-w-2xl divide-y divide-border">
          {items.map((item) => {
            const content = (
              <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-bg transition-colors">
                <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor(item.type)}`} />
                <p className="text-sm text-text">{item.text}</p>
              </div>
            );
            return item.linkTo ? (
              <Link key={item.id} to={item.linkTo}>
                {content}
              </Link>
            ) : (
              <div key={item.id}>{content}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}