import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { DOMAINS } from '../data/questionBank';
import { MODULES_CONTENT_LIST } from './Module';
import Sidebar from '../components/Sidebar';
import SkillPentagon from '../components/SkillPentagon';
import PenqWidget from '../components/PenqWidget';
import './Dashboard.css';


const stagger = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any } },
};

export default function Dashboard() {
    const { state } = useApp();
    const navigate = useNavigate();

    // --- Learning Edge Logic ---
    // 1. Filter modules by language

    // 2. Filter modules by language
    const recommendedModules = MODULES_CONTENT_LIST.filter(mod => {
        // Only show modules matching the user's selected language
        const lang = (state.user.language || 'javascript').toLowerCase();
        const modId = mod.id.toLowerCase();
        if (lang === 'python' && modId.includes('python')) return true;
        if (lang === 'cpp' && modId.includes('cpp')) return true;
        if (lang === 'javascript' && (modId.includes('js') || modId.includes('javascript'))) return true;
        if (lang === 'go' && modId.includes('go')) return true;
        if (lang === 'rust' && modId.includes('rust')) return true;
        return false;
    }).slice(0, 5); // Show top 5 recommendations

    const getDomainColor = (domainId: string) => {
        return DOMAINS.find((d) => d.id === domainId)?.color || 'var(--cyan)';
    };

    const getDomainIcon = (domainId: string) => {
        return DOMAINS.find((d) => d.id === domainId)?.icon || '📚';
    };

    const strongestDomain = DOMAINS.reduce((best, d) =>
        (state.pentagon[d.id] || 0) > (state.pentagon[best.id] || 0) ? d : best
        , DOMAINS[0]);

    return (
        <div className="page-layout">
            <Sidebar />
            <motion.main
                className="main-content"
                variants={stagger}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.div className="dash-header" variants={fadeUp}>
                    <div className="dash-header-left">
                        <h1 className="dash-greeting">
                            Welcome back{state.user.name ? `, ${state.user.name}` : ''} 👋
                        </h1>
                        <div className="dash-level-bar-container">
                            <div className="dash-level-info">
                                <span className="level-badge">
                                    <span className="pulse-dot" style={{ width: 6, height: 6 }} />
                                    LVL {state.economy.level}
                                </span>
                                <span className="level-xp-text">{state.economy.xp} / 2000 XP</span>
                            </div>
                            <div className="progress-bar" style={{ height: 8 }}>
                                <motion.div
                                    className="progress-bar-fill"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(state.economy.xp / 2000) * 100}%` }}
                                    style={{ 
                                        background: 'linear-gradient(90deg, var(--purple), var(--cyan))',
                                        boxShadow: '0 0 12px var(--purple-glow)'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="dash-header-right">
                        {state.syncStatus === 'syncing' && (
                            <div className="sync-indicator" style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px',
                                padding: '8px 16px',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: 'var(--font-sm)',
                                color: 'var(--text-secondary)'
                            }}>
                                <motion.span 
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                    style={{ display: 'inline-block' }}
                                >🌐</motion.span>
                                Syncing...
                            </div>
                        )}
                        <div className="dash-badge">
                            <div className="dash-badge-icon">🔥</div>
                            <div className="dash-badge-content">
                                <motion.span
                                    className="dash-badge-value"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                >
                                    {state.economy.currentStreak}
                                </motion.span>
                                <span className="dash-badge-label">day streak</span>
                            </div>
                        </div>
                        <div className="dash-badge">
                            <div className="dash-badge-icon">💎</div>
                            <div className="dash-badge-content">
                                <motion.span
                                    className="dash-badge-value"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
                                >
                                    {state.economy.balance}
                                </motion.span>
                                <span className="dash-badge-label">Penq</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main grid */}
                <div className="dash-grid">
                    {/* Pentagon card */}
                    <motion.div className="dash-pentagon-card glass-card-static" variants={fadeUp}>
                        <h2 className="dash-card-title">Skill Pentagon</h2>
                        <SkillPentagon data={state.pentagon} size={280} />
                        <div className="pentagon-domains">
                            {DOMAINS.map((d) => (
                                <div key={d.id} className="pentagon-domain-row">
                                    <span className="pentagon-domain-icon">{d.icon}</span>
                                    <span className="pentagon-domain-name">{d.label}</span>
                                    <div className="pentagon-domain-bar">
                                        <div
                                            className="pentagon-domain-fill"
                                            style={{
                                                width: `${state.pentagon[d.id] || 0}%`,
                                                background: d.color,
                                            }}
                                        />
                                    </div>
                                    <span className="pentagon-domain-score" style={{ color: d.color }}>
                                        {Math.round(state.pentagon[d.id] || 0)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <button
                            className="btn btn-secondary"
                            style={{ marginTop: 'var(--space-4)', width: '100%' }}
                            onClick={() => navigate('/quiz')}
                        >
                            🔄 Re-Calibrate
                        </button>
                    </motion.div>

                    {/* Right column */}
                    <div className="dash-right-col">
                        {/* Daily Modules */}
                        <motion.div className="glass-card-static" variants={fadeUp}>
                            <h2 className="dash-card-title">Learning Edge — Personalized for You</h2>
                            <div className="module-list">
                                {recommendedModules.map((mod) => {
                                    const progress = state.moduleProgress.find(p => p.moduleId === mod.id)?.status === 'completed' ? 100 : 0;
                                    return (
                                        <div
                                            key={mod.id}
                                            className="module-item"
                                            onClick={() => navigate(`/module/${mod.id}`)}
                                        >
                                            <div className="module-item-left">
                                                <span className="module-item-icon">{getDomainIcon(mod.domainId as any)}</span>
                                                <div className="module-item-info">
                                                    <span className="module-item-title">{mod.title}</span>
                                                    <div className="module-item-progress-bar">
                                                        <div
                                                            className="module-item-progress-fill"
                                                            style={{
                                                                width: `${progress}%`,
                                                                background: getDomainColor(mod.domainId as any),
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="module-item-right">
                                                {progress > 0 ? (
                                                    <span className="badge badge-cyan">{progress}%</span>
                                                ) : (
                                                    <span className="badge badge-amber">+{mod.reward} 💰</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Activity Feed + Strongest domain */}
                        <div className="dash-bottom-row">
                            <motion.div className="glass-card-static dash-activity" variants={fadeUp}>
                                <h2 className="dash-card-title">Recent Activity</h2>
                                <div className="activity-list">
                                    {(state.activityRecords.length > 0 ? state.activityRecords : [
                                        { id: 'a1', icon: '🚀', text: 'Started your coding journey', time: '1m ago', color: 'var(--cyan)' },
                                        { id: 'a2', icon: '🎯', text: 'Set goal: ' + (state.user.goal || 'Mastery'), time: '2m ago', color: 'var(--amber)' },
                                        { id: 'a3', icon: '🐧', text: 'Penq AI initialized', time: '5m ago', color: 'var(--purple)' },
                                    ]).map((item) => (
                                        <div key={item.id} className="activity-item">
                                            <span className="activity-icon" style={{ color: item.color }}>
                                                {item.icon}
                                            </span>
                                            <div className="activity-info">
                                                <span className="activity-text">{item.text}</span>
                                                <span className="activity-time">{item.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div className="glass-card-static dash-highlight" variants={fadeUp}>
                                <div className="highlight-icon">{strongestDomain.icon}</div>
                                <h3 className="highlight-title">Strongest Skill</h3>
                                <p className="highlight-domain" style={{ color: strongestDomain.color }}>
                                    {strongestDomain.label}
                                </p>
                                <p className="highlight-score">
                                    {Math.round(state.pentagon[strongestDomain.id] || 0)}
                                    <span className="highlight-max">/100</span>
                                </p>
                                <p className="highlight-hint" style={{ marginBottom: 'var(--space-4)' }}>Keep building on this foundation.</p>

                                <div className="focus-stability-mini glass-card" style={{ padding: 'var(--space-3)', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                                    <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>REAL-TIME STABILITY</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div className="pulse-dot" />
                                        <span style={{ color: 'var(--aurora-green)', fontWeight: 700 }}>94.2%</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.main>
            <PenqWidget />
        </div>
    );
}
