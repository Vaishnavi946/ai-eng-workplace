import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Sprint, Task } from '../types';

type SprintWithProgress = Sprint & { progress: number };

const filters = ['All', 'planned', 'active', 'completed'] as const;

export default function SprintsPage() {
  const [sprints, setSprints] = useState<SprintWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const { user } = useAuth();

  const fetchSprints = async () => {
    setLoading(true);
    try {
      const res = await api.get('/sprints');
      const sprintList: Sprint[] = res.data;

      const withProgress = await Promise.all(
        sprintList.map(async (s) => {
          try {
            const tasksRes = await api.get(`/tasks?sprint=${s._id}`);
            const tasks: Task[] = tasksRes.data;
            const done = tasks.filter((t) => t.status === 'done').length;
            const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
            return { ...s, progress };
          } catch {
            return { ...s, progress: 0 };
          }
        })
      );
      setSprints(withProgress);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSprints();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/sprints', { name, description, startDate, endDate });
      setName('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setShowForm(false);
      fetchSprints();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create sprint');
    }
  };

  const statusBadge = (status: string) => {
    if (status === 'active') return 'text-mint bg-mint/10 border-mint/20';
    if (status === 'completed') return 'text-text-dim bg-text-dim/10 border-text-dim/20';
    return 'text-amber bg-amber/10 border-amber/20';
  };

  const progressColor = (p: number) => {
    if (p === 100) return 'bg-mint';
    if (p > 0) return 'bg-accent';
    return 'bg-text-dim';
  };

  const initial = user?.name?.charAt(0).toUpperCase() || '?';

  const filteredSprints = sprints.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || s.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="px-6 py-8 md:px-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-text tracking-tight">
          Sprints
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm hover:bg-accent/90 hover:shadow-md transition-all self-start"
        >
          {showForm ? 'Cancel' : '+ New Sprint'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white border border-border rounded-xl p-6 mb-8 max-w-md shadow-sm"
        >
          {error && (
            <p className="text-rose text-sm mb-3 bg-rose/10 border border-rose/20 rounded-md py-2 px-3">
              {error}
            </p>
          )}
          <input
            type="text"
            placeholder="Sprint name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-bg border border-border rounded-md p-2.5 mb-3 text-sm text-text placeholder:text-text-dim focus:border-accent outline-none"
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-bg border border-border rounded-md p-2.5 mb-3 text-sm text-text placeholder:text-text-dim focus:border-accent outline-none"
          />
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="text-xs text-text-muted mb-1.5 block">Start date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-bg border border-border rounded-md p-2.5 text-sm text-text focus:border-accent outline-none"
                required
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-text-muted mb-1.5 block">End date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-bg border border-border rounded-md p-2.5 text-sm text-text focus:border-accent outline-none"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-accent text-white py-2.5 rounded-md text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            Create Sprint
          </button>
        </form>
      )}

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search sprints…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-white border border-border rounded-md px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-accent outline-none"
        />
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-md text-xs font-medium capitalize transition-colors ${
                filter === f
                  ? 'bg-accent text-white'
                  : 'bg-white border border-border text-text-muted hover:text-text'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-text-muted font-mono text-sm">Loading sprints…</p>
      ) : filteredSprints.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl p-12 text-center bg-white/50">
          <p className="text-text-muted text-sm">
            {sprints.length === 0
              ? 'No sprints yet — create your first one to get started.'
              : 'No sprints match your search.'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text-muted text-xs uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Sprint</th>
                <th className="px-5 py-3 font-medium">Progress</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Owner</th>
                <th className="px-5 py-3 font-medium">Dates</th>
              </tr>
            </thead>
            <tbody>
              {filteredSprints.map((sprint) => (
                <tr
                  key={sprint._id}
                  className="border-b border-border last:border-0 hover:bg-bg transition-colors cursor-pointer"
                >
                  <td className="px-5 py-4">
                    <Link to={`/sprints/${sprint._id}`} className="block">
                      <p className="font-medium text-text">{sprint.name}</p>
                      {sprint.description && (
                        <p className="text-xs text-text-muted mt-0.5 line-clamp-1 max-w-xs">
                          {sprint.description}
                        </p>
                      )}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 rounded-full bg-bg overflow-hidden">
                        <div
                          className={`h-full ${progressColor(sprint.progress)}`}
                          style={{ width: `${sprint.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-text-dim font-mono">
                        {sprint.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wide ${statusBadge(
                        sprint.status
                      )}`}
                    >
                      {sprint.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center text-xs font-display font-semibold">
                      {initial}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-text-dim font-mono whitespace-nowrap">
                    {new Date(sprint.startDate).toLocaleDateString()} →{' '}
                    {new Date(sprint.endDate).toLocaleDateString()}
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