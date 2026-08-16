import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'D' },
  { to: '/sprints', label: 'Sprints', icon: 'S' },
  { to: '/tasks', label: 'Tasks', icon: 'T' },
  { to: '/review-queue', label: 'Review Queue', icon: 'R' },
  { to: '/docs-search', label: 'Docs Search', icon: 'A' },
  { to: '/activity', label: 'Activity', icon: 'V' },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initial = user?.name?.charAt(0).toUpperCase() || '?';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-white border-r border-border flex flex-col">
        <div className="px-5 py-6">
          <span className="font-display font-semibold text-text">
            AI Eng Workplace
          </span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-muted hover:bg-bg hover:text-text'
                }`
              }
            >
              <span className="w-6 h-6 rounded-md bg-current/10 flex items-center justify-center text-[10px] font-mono">
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Profile / Settings */}
        <div className="px-3 pb-2 pt-3 border-t border-border space-y-1">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-muted hover:bg-bg hover:text-text'
              }`
            }
          >
            <span className="w-6 h-6 rounded-md bg-current/10 flex items-center justify-center text-[10px] font-mono">
              P
            </span>
            Profile
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-muted hover:bg-bg hover:text-text'
              }`
            }
          >
            <span className="w-6 h-6 rounded-md bg-current/10 flex items-center justify-center text-[10px] font-mono">
              G
            </span>
            Settings
          </NavLink>
        </div>

        <div className="px-3 pb-5 pt-3 border-t border-border">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-xs font-display font-semibold shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-text font-medium truncate">
                {user?.name}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-text-muted hover:bg-rose/10 hover:text-rose transition-colors"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Page content */}
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}