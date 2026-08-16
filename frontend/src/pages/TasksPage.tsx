import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Sprint, Task } from '../types';

type TaskWithSprint = Task & { sprintName: string };

const filters = ['All', 'todo', 'in-progress', 'done'] as const;

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskWithSprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const sprintsRes = await api.get('/sprints');
        const sprints: Sprint[] = sprintsRes.data;

        const taskLists = await Promise.all(
          sprints.map(async (s) => {
            const res = await api.get(`/tasks?sprint=${s._id}`);
            return (res.data as Task[]).map((t) => ({
              ...t,
              sprintName: s.name,
            }));
          })
        );
        setTasks(taskLists.flat());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const statusBadge = (status: string) => {
    if (status === 'done') return 'text-mint bg-mint/10 border-mint/20';
    if (status === 'in-progress') return 'text-accent bg-accent/10 border-accent/20';
    return 'text-text-dim bg-text-dim/10 border-text-dim/20';
  };

  const priorityBadge = (p: string) => {
    if (p === 'high') return 'text-rose bg-rose/10 border-rose/20';
    if (p === 'low') return 'text-text-dim bg-text-dim/10 border-text-dim/20';
    return 'text-amber bg-amber/10 border-amber/20';
  };

  const statusLabel = (status: string) =>
    status === 'todo' ? 'To Do' : status === 'in-progress' ? 'In Progress' : 'Done';

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || t.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="px-6 py-8 md:px-10">
      <h1 className="text-2xl font-semibold text-text tracking-tight mb-6">
        Tasks
      </h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search tasks…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-white border border-border rounded-md px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-accent outline-none"
        />
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                filter === f
                  ? 'bg-accent text-white'
                  : 'bg-white border border-border text-text-muted hover:text-text'
              }`}
            >
              {f === 'All' ? 'All' : statusLabel(f)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-text-muted font-mono text-sm">Loading tasks…</p>
      ) : filteredTasks.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl p-12 text-center bg-white/50">
          <p className="text-text-muted text-sm">
            {tasks.length === 0
              ? 'No tasks yet — add tasks from inside a sprint.'
              : 'No tasks match your search.'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text-muted text-xs uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Task</th>
                <th className="px-5 py-3 font-medium">Sprint</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Priority</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr
                  key={task._id}
                  className="border-b border-border last:border-0 hover:bg-bg transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-text">{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-text-muted mt-0.5 line-clamp-1 max-w-xs">
                        {task.description}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      to={`/sprints/${task.sprint}`}
                      className="text-xs text-accent hover:underline"
                    >
                      {task.sprintName}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wide ${statusBadge(
                        task.status
                      )}`}
                    >
                      {statusLabel(task.status)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wide ${priorityBadge(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}