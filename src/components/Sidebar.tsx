import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Sidebar.css';

const NAV_ITEMS = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/paths', icon: '📚', label: 'Skill Paths' },
    { path: '/labs', icon: '🧪', label: 'Labs' },
    { path: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
    { path: '/focus', icon: '👁️', label: 'Focus Room' },
    { path: '/settings', icon: '⚙️', label: 'Settings' },
];

export default function Sidebar() {
    const { state } = useApp();
    const { pathname } = useLocation();

    const calculateProgress = (xp: number, level: number) => {
        const levels = [0, 200, 500, 1000, 2000, 5000];
        const nextXp = levels[level] || levels[levels.length - 1];
        const currentTierXp = levels[level - 1] || 0;
        const progressInTier = xp - currentTierXp;
        const tierSize = nextXp - currentTierXp;
        const percentage = Math.min(100, (progressInTier / tierSize) * 100);
        return { percentage, nextXp };
    };

    return (
        <aside className="sidebar glass-card-static">
            <div className="sidebar-logo">
                <span className="logo-icon">🌌</span>
                <span className="logo-text">PENQ</span>
            </div>

            <div className="sidebar-sync">
                <span className={`sync-dot ${state.syncStatus}`} />
                <span className="sync-text">
                    {state.syncStatus === 'syncing' ? 'Syncing...' :
                        state.syncStatus === 'error' ? 'Offline' : 'Connected'}
                </span>
            </div>

            {/* Progression */}
            <div className="sidebar-user-stats">
                <div className="user-stats-header">
                    <span className="user-level-badge">Lv. {state.economy.level}</span>
                    <span className="user-xp-text">{state.economy.xp} XP</span>
                </div>
                <div className="xp-bar-container">
                    <div
                        className="xp-bar-fill"
                        style={{ width: `${calculateProgress(state.economy.xp, state.economy.level).percentage}%` }}
                    />
                </div>
                <div className="xp-footer">
                    Next: {calculateProgress(state.economy.xp, state.economy.level).nextXp}
                </div>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <span className="sidebar-link-icon">{item.icon}</span>
                        <span className="sidebar-link-label">{item.label}</span>
                        {item.path === pathname && (
                            <div className="sidebar-link-indicator" />
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Economy */}
            <div className="sidebar-economy">
                <div className="sidebar-stat">
                    <span className="sidebar-stat-icon">🔥</span>
                    <span className="sidebar-stat-value">{state.economy.currentStreak}</span>
                    <span className="sidebar-stat-label">Streak</span>
                </div>
                <div className="sidebar-stat">
                    <span className="sidebar-stat-icon">💰</span>
                    <span className="sidebar-stat-value">{state.economy.balance}</span>
                    <span className="sidebar-stat-label">Penq</span>
                </div>
            </div>

            {/* Premium CTA */}
            {!state.user.isPremium && (
                <div className="sidebar-premium">
                    <span className="sidebar-premium-icon">💎</span>
                    <span className="sidebar-premium-text">Go Premium</span>
                    <span className="sidebar-premium-price">$9.99/mo</span>
                </div>
            )}
        </aside>
    );
}
