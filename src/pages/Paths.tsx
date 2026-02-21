import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DOMAINS } from '../data/questionBank';
import Sidebar from '../components/Sidebar';
import PenqWidget from '../components/PenqWidget';
import './Paths.css';

const LANGUAGES_PATHS = [
    { id: 'python', name: 'Python', icon: '🐍', color: '#3776ab', description: 'Master AI, Data Science & Backends' },
    { id: 'javascript', name: 'JavaScript', icon: '🟨', color: '#f7df1e', description: 'Build modern web & mobile apps' },
    { id: 'cpp', name: 'C++', icon: '🔵', color: '#00599c', description: 'Game engines & system performance' },
    { id: 'go', name: 'Go', icon: '🔷', color: '#00add8', description: 'Cloud-native & scalable microservices' },
    { id: 'rust', name: 'Rust', icon: '🦀', color: '#dea584', description: 'Memory safety & modern systems coding' },
];

export default function Paths() {
    const { state, dispatch } = useApp();
    const navigate = useNavigate();
    const [selectedLang, setSelectedLang] = useState<typeof LANGUAGES_PATHS[0] | null>(null);

    const calculateOverallProgress = () => {
        const scores = Object.values(state.pentagon);
        if (scores.length === 0) return 0;
        return scores.reduce((a, b) => a + b, 0) / scores.length;
    };

    const overall = calculateOverallProgress();

    const handleLevelSelect = (level: 'beginner' | 'intermediate') => {
        if (!selectedLang) return;
        dispatch({ type: 'SET_LANGUAGE', payload: selectedLang.id });
        navigate(`/path-quiz/${selectedLang.id}/${level}`);
    };

    return (
        <div className="page-layout">
            <Sidebar />
            <main className="main-content">
                <header className="page-header">
                    <h1 className="section-title">Technical Learning Paths</h1>
                    <p className="section-subtitle">Pick a specialization and master your stack.</p>
                </header>

                <div className="paths-overview glass-card-static">
                    <div className="overall-stat">
                        <span className="overall-label">Global Tech Mastery</span>
                        <div className="overall-value-row">
                            <span className="overall-value">{Math.round(overall)}%</span>
                            <div className="overall-progress-outer">
                                <motion.div
                                    className="overall-progress-inner"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${overall}%` }}
                                    transition={{ duration: 1.5, ease: 'easeOut' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="language-grid">
                    {LANGUAGES_PATHS.map((lang, idx) => (
                        <motion.div
                            key={lang.id}
                            className="lang-path-card glass-card-static h-clickable"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => setSelectedLang(lang)}
                            style={{ '--accent': lang.color } as any}
                        >
                            <div className="lang-icon">{lang.icon}</div>
                            <h3 className="lang-name">{lang.name}</h3>
                            <p className="lang-desc">{lang.description}</p>
                            <div className="lang-badge">Start Journey →</div>
                        </motion.div>
                    ))}
                </div>

                <AnimatePresence>
                    {selectedLang && (
                        <div className="modal-overlay" onClick={() => setSelectedLang(null)}>
                            <motion.div
                                className="level-modal glass-card-static"
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button className="modal-close" onClick={() => setSelectedLang(null)}>✕</button>
                                <div className="modal-header">
                                    <span className="modal-icon">{selectedLang.icon}</span>
                                    <h2 className="modal-title">Select your {selectedLang.name} Level</h2>
                                </div>
                                <div className="level-options">
                                    <div className="level-option" onClick={() => handleLevelSelect('beginner')}>
                                        <div className="level-option-head">
                                            <span className="level-emoji">🐣</span>
                                            <h3>Beginner</h3>
                                        </div>
                                        <p>Basics, syntax, and fundamental problem solving.</p>
                                    </div>
                                    <div className="level-option" onClick={() => handleLevelSelect('intermediate')}>
                                        <div className="level-option-head">
                                            <span className="level-emoji">🦅</span>
                                            <h3>Intermediate</h3>
                                        </div>
                                        <p>Advanced patterns, libraries, and efficiency.</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <div className="domains-status-grid" style={{ marginTop: 'var(--space-10)' }}>
                    {DOMAINS.map((d) => (
                        <div key={d.id} className="domain-status-card glass-card-static">
                            <span className="domain-status-icon">{d.icon}</span>
                            <div className="domain-status-info">
                                <h4 className="domain-status-name">{d.label}</h4>
                                <span className="domain-status-level">LVL {Math.floor((state.pentagon[d.id] || 0) / 10)}</span>
                            </div>
                            <div className="domain-status-progress">
                                <div className="ds-progress-fill" style={{ width: `${state.pentagon[d.id] || 0}%`, background: d.color }} />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <PenqWidget />
        </div>
    );
}
