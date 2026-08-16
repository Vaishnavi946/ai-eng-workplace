import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Sprint, Task, GitHubEvent } from '../types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [prQueue, setPrQueue] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const sprintsRes = await api.get('/sprints');
        const sprintList: Sprint[] = sprintsRes.data;
        setSprints(sprintList);

        const taskResults = await Promise.all(
          sprintList.map((s) => api.get(`/tasks?sprint=${s._id}`))
        );
        const tasks = taskResults.flatMap((r) => r.data as Task[]);
        setAllTasks(tasks);

        const prRes = await api.get('/webhooks/review-queue');
        setPrQueue(prRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const inProgress = allTasks.filter((t) => t.status === 'in-progress').length;
  const done = allTasks.filter((t) => t.status === 'done').length;

  const kpis = [
    { label: 'Total Sprints', value: sprints.length, accent: 'text-accent', to: '/sprints' },
    { label: 'In Progress', value: inProgress, accent: 'text-amber', to: '/tasks' },
    { label: 'Completed', value: done, accent: 'text-mint', to: '/tasks' },
    { label: 'Total Tasks', value: allTasks.length, accent: 'text-text', to: '/tasks' },
  ];

  const recentTasks = [...allTasks].slice(-5).reverse();
  const topPRs = [...prQueue]
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 4);

  const statusBadge = (status: string) => {
    if (status === 'done') return 'text-mint bg-mint/10 border-mint/20';
    if (status === 'in-progress') return 'text-amber bg-amber/10 border-amber/20';
    return 'text-text-dim bg-text-dim/10 border-text-dim/20';
  };

  if (loading)
    return (
      <div className="p-10">
        <p className="text-text-muted font-mono text-sm">Loading dashboard…</p>
      </div>
    );

  return (
    <div className="px-6 py-8 md:px-10">
      <h1 className="text-2xl font-semibold text-text tracking-tight mb-1">
        Welcome back, {user?.name} 👋
      </h1>
      <p className="text-text-muted text-sm mb-8">
        Here's what's happening across your sprints today.
      </p>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => (
          <Link
            key={kpi.label}
            to={kpi.to}
            className="bg-white border border-border rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all block"
          >
            <p className="text-xs text-text-muted mb-2">{kpi.label}</p>
            <p className={`text-2xl font-display font-semibold ${kpi.accent}`}>
              {kpi.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Recent tasks */}
        <div className="bg-white border border-border rounded-xl shadow-sm">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-display font-medium text-sm text-text">
              Recent Tasks
            </h2>
            <Link to="/tasks" className="text-xs text-accent hover:underline">
              View all →
            </Link>
          </div>
          <div className="p-2">
            {recentTasks.length === 0 ? (
              <p className="text-text-dim text-sm px-3 py-4">
                No tasks yet — create a sprint to get started.
              </p>
            ) : (
              recentTasks.map((task) => (
                <Link
                  key={task._id}
                  to={`/sprints/${task.sprint}`}
                  className="flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-bg transition-colors"
                >
                  <p className="text-sm text-text truncate mr-3">{task.title}</p>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wide shrink-0 ${statusBadge(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Review queue snapshot */}
        <div className="bg-white border border-border rounded-xl shadow-sm">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-display font-medium text-sm text-text">
              Top Priority PRs
            </h2>
            <Link
              to="/review-queue"
              className="text-xs text-accent hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="p-2">
            {topPRs.length === 0 ? (
              <p className="text-text-dim text-sm px-3 py-4">
                No open pull requests right now.
              </p>
            ) : (
              topPRs.map((pr) => (
                <Link
                  key={pr._id}
                  to={`/review-queue/${pr._id}`}
                  className="flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-bg transition-colors"
                >
                  <p className="text-sm text-text truncate mr-3">
                    <span className="font-mono text-text-dim mr-1">
                      #{pr.prNumber}
                    </span>
                    {pr.prTitle}
                  </p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full border font-medium text-rose bg-rose/10 border-rose/20 shrink-0">
                    {pr.priorityScore}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}