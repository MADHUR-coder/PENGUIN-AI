import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import PenqWidget from '../components/PenqWidget';
import './Settings.css';

export default function Settings() {
    const { state } = useApp();

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all progress? This will delete your Skill Pentagon, coins, and streak.')) {
            localStorage.clear();
            window.location.href = '/';
        }
    };

    return (
        <div className="page-layout">
            <Sidebar />
            <main className="main-content">
                <header className="page-header">
                    <h1 className="section-title">Settings</h1>
                </header>

                <div className="settings-grid">
                    <section className="settings-section glass-card-static">
                        <h2 className="settings-section-title">Profile</h2>
                        <div className="settings-item">
                            <span className="settings-label">Goal</span>
                            <span className="settings-value">{state.user.goal || 'Not set'}</span>
                        </div>
                        <div className="settings-item">
                            <span className="settings-label">Learning Blocker</span>
                            <span className="settings-value">{state.user.blocker || 'Not set'}</span>
                        </div>
                        <div className="settings-item">
                            <span className="settings-label">Status</span>
                            <span className={`badge ${state.user.isPremium ? 'badge-amber' : 'badge-cyan'}`}>
                                {state.user.isPremium ? '💎 Premium' : 'Free Tier'}
                            </span>
                        </div>
                    </section>

                    <section className="settings-section glass-card-static">
                        <h2 className="settings-section-title">Data & Privacy</h2>
                        <p className="settings-desc">
                            Your data is stored locally in your browser. Clearing your cache or clicking reset will remove all progress.
                        </p>
                        <button className="btn btn-secondary" onClick={handleReset} style={{ color: 'var(--rose)', borderColor: 'var(--rose-dim)' }}>
                            🗑️ Reset All Progress
                        </button>
                    </section>

                    <section className="settings-section glass-card-static">
                        <h2 className="settings-section-title">About Penq</h2>
                        <p className="settings-desc">
                            Penq v0.1.0-mvp<br />
                            Built for adaptive, gamified learning.
                        </p>
                        <div className="penq-footer-avatar">🐧</div>
                    </section>
                </div>
            </main>
            <PenqWidget />
        </div>
    );
}
