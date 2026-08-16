import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import type { Sprint, Task } from '../types';

export default function ProfilePage() {
  const { user } = useAuth();
  const [sprintCount, setSprintCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const sprintsRes = await api.get('/sprints');
        const sprints: Sprint[] = sprintsRes.data;
        setSprintCount(sprints.length);

        const taskLists = await Promise.all(
          sprints.map((s) => api.get(`/tasks?sprint=${s._id}`))
        );
        const allTasks = taskLists.flatMap((r) => r.data as Task[]);
        setTaskCount(allTasks.length);
        setDoneCount(allTasks.filter((t) => t.status === 'done').length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const initial = user?.name?.charAt(0).toUpperCase() || '?';

  const stats = [
    { label: 'Sprints', value: sprintCount },
    { label: 'Total tasks', value: taskCount },
    { label: 'Tasks completed', value: doneCount },
    { label: 'Role', value: user?.role || '—' },
  ];

  return (
    <div className="px-6 py-8 md:px-10">
      <h1 className="text-2xl font-semibold text-text tracking-tight mb-6">
        Profile
      </h1>

      <div className="bg-white border border-border rounded-xl shadow-sm max-w-2xl overflow-hidden">
        <div className="h-20 bg-accent" />
        <div className="px-6 pb-6">
          <div className="w-20 h-20 rounded-full bg-accent border-4 border-white text-white flex items-center justify-center text-2xl font-display font-semibold -mt-10 mb-4 shadow-sm">
            {initial}
          </div>
          <h2 className="text-lg font-semibold text-text">{user?.name}</h2>
          <p className="text-sm text-text-muted mb-6">{user?.email}</p>

          <div className="border-t border-border pt-5 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-xs text-text-muted mb-1">{s.label}</p>
                <p className="text-lg font-display font-semibold text-text capitalize">
                  {loading ? '—' : s.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}