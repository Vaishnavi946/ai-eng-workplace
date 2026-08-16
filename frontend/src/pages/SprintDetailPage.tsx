import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import type { Task, Sprint } from '../types';

const tabs = ['Overview', 'Tasks'] as const;

export default function SprintDetailPage() {
  const { id } = useParams();
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Overview');
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [sprintRes, tasksRes] = await Promise.all([
        api.get(`/sprints/${id}`),
        api.get(`/tasks?sprint=${id}`),
      ]);
      setSprint(sprintRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/tasks', { title, description, priority, sprint: id });
      setTitle('');
      setDescription('');
      setPriority('medium');
      setShowForm(false);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const columns: { key: Task['status']; label: string; accent: string }[] = [
    { key: 'todo', label: 'To Do', accent: 'bg-text-dim' },
    { key: 'in-progress', label: 'In Progress', accent: 'bg-amber' },
    { key: 'done', label: 'Done', accent: 'bg-mint' },
  ];

  const priorityStyles = (p: string) => {
    if (p === 'high') return 'text-rose bg-rose/10 border-rose/20';
    if (p === 'low') return 'text-text-dim bg-text-dim/10 border-text-dim/20';
    return 'text-amber bg-amber/10 border-amber/20';
  };

  const shortId = (taskId: string) => `#${taskId.slice(-6)}`;

  const doneCount = tasks.filter((t) => t.status === 'done').length;
  const progress = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-text-muted font-mono text-sm">Loading…</p>
      </div>
    );
  if (!sprint)
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-text-muted font-mono text-sm">Sprint not found.</p>
      </div>
    );

  return (
    <div className="px-6 py-8 md:px-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-4">
        <Link to="/sprints" className="text-text-muted hover:text-accent transition-colors">
          Sprints
        </Link>
        <span className="text-text-dim">/</span>
        <span className="text-text font-medium">{sprint.name}</span>
      </div>

      <h1 className="text-2xl font-semibold text-text tracking-tight mb-6">
        {sprint.name}
      </h1>

      {/* Tabs */}
      <div className="flex border-b border-border mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'text-accent border-accent'
                : 'text-text-muted border-transparent hover:text-text'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm max-w-2xl">
          {sprint.description && (
            <p className="text-text-muted mb-6">{sprint.description}</p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-text-muted mb-1">Status</p>
              <p className="text-sm font-medium text-text capitalize">{sprint.status}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-1">Progress</p>
              <p className="text-sm font-medium text-text">{progress}%</p>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-1">Start date</p>
              <p className="text-sm font-medium text-text font-mono">
                {new Date(sprint.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-1">Due date</p>
              <p className="text-sm font-medium text-text font-mono">
                {new Date(sprint.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <div className="w-full h-1.5 rounded-full bg-bg overflow-hidden">
              <div
                className="h-full bg-accent"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Tasks' && (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-accent text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm hover:bg-accent/90 hover:shadow-md transition-all"
            >
              {showForm ? 'Cancel' : '+ New Task'}
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleCreateTask}
              className="bg-white border border-border rounded-xl p-6 mb-8 max-w-md shadow-sm"
            >
              {error && <p className="text-rose text-sm mb-3">{error}</p>}
              <input
                type="text"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-bg border border-border rounded-md p-2.5 mb-3 text-sm text-text placeholder:text-text-dim focus:border-accent outline-none"
                required
              />
              <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-bg border border-border rounded-md p-2.5 mb-3 text-sm text-text placeholder:text-text-dim focus:border-accent outline-none"
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-bg border border-border rounded-md p-2.5 mb-4 text-sm text-text focus:border-accent outline-none"
              >
                <option value="low">Low priority</option>
                <option value="medium">Medium priority</option>
                <option value="high">High priority</option>
              </select>
              <button
                type="submit"
                className="w-full bg-accent text-white py-2.5 rounded-md text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                Create Task
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {columns.map((col) => {
              const colTasks = tasks.filter((t) => t.status === col.key);
              return (
                <div
                  key={col.key}
                  className="bg-white border border-border rounded-xl overflow-hidden shadow-sm"
                >
                  <div className={`h-1 ${col.accent}`} />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display font-medium text-sm text-text tracking-wide uppercase">
                        {col.label}
                      </h3>
                      <span className="font-mono text-xs text-text-dim bg-bg rounded-full px-2 py-0.5">
                        {colTasks.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {colTasks.map((task) => (
                        <div
                          key={task._id}
                          className="bg-bg border border-border rounded-lg p-3 hover:shadow-sm hover:border-accent/30 transition-all"
                        >
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <span className="font-mono text-[10px] text-text-dim">
                              {shortId(task._id)}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wide ${priorityStyles(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>
                          </div>

                          <p className="text-sm text-text font-medium mb-1">
                            {task.title}
                          </p>

                          {task.description && (
                            <p className="text-xs text-text-muted mb-3 line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          <select
                            value={task.status}
                            onChange={(e) =>
                              updateTaskStatus(task._id, e.target.value)
                            }
                            className="text-xs bg-white border border-border rounded-md p-1.5 w-full text-text-muted focus:border-accent outline-none"
                          >
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="done">Done</option>
                          </select>
                        </div>
                      ))}

                      {colTasks.length === 0 && (
                        <p className="text-xs text-text-dim font-mono py-2">
                          — empty —
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}