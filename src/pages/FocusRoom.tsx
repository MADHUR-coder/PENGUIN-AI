import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import FocusTracker from '../components/FocusTracker';
import PenqWidget from '../components/PenqWidget';
import './FocusRoom.css';
import { useEffect, useState } from 'react';

export default function FocusRoom() {
    const { state, dispatch } = useApp();
    const [seconds, setSeconds] = useState(0);

    const active = state.focusSession.active;
    const score = state.focusSession.score;

    useEffect(() => {
        let interval: number;
        if (active) {
            interval = setInterval(() => setSeconds(s => s + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [active]);

    const formatTime = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const toggleSession = () => {
        if (active) {
            dispatch({ type: 'STOP_FOCUS_SESSION' });
            setSeconds(0);
        } else {
            dispatch({ type: 'START_FOCUS_SESSION' });
        }
    };

    const getScoreColor = () => {
        if (score > 70) return 'var(--aurora-green)';
        if (score > 40) return 'var(--amber)';
        return 'var(--rose)';
    };

    return (
        <div className={`page-layout focus-layout ${active ? 'session-active' : ''}`}>
            {active && <div className="focus-active-overlay" />}
            <Sidebar />
            <FocusTracker />
            <main className="main-content focus-content">
                <AnimatePresence mode="wait">
                    {!active ? (
                        <motion.div
                            key="setup"
                            className="focus-setup-panel glass-card-static"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                        >
                            <h1 className="focus-title">Enter Focus Room</h1>
                            <p className="focus-desc">
                                Activate real-time presence monitoring. Penq will nudge you if you get distracted or walk away.
                            </p>
                            <div className="focus-perks">
                                <div className="perk-item"><span>👁️</span> Camera Presence Detection</div>
                                <div className="perk-item"><span>🔇</span> Distraction Silencer</div>
                                <div className="perk-item"><span>💎</span> 2x Coin Multiplier</div>
                            </div>
                            <button className="btn btn-primary btn-lg" onClick={toggleSession}>
                                Start Focus Session
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="active"
                            className="focus-active-panel"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className="status-bar">
                                {state.focusSession.status === 'loading' && (
                                    <div className="status-msg loading">⚙️ AI Warming Up...</div>
                                )}
                                {state.focusSession.status === 'ready' && (
                                    <div className="status-msg ready">✅ Presence Active</div>
                                )}
                                {state.focusSession.status === 'error' && (
                                    <div className="status-msg error">❌ Camera Sync Failed</div>
                                )}
                            </div>

                            <div className="focus-timer">{formatTime(seconds)}</div>

                            <div className="focus-meter-container">
                                <div className="focus-meter-label">Attention Level</div>
                                <div className="focus-meter-outer">
                                    <motion.div
                                        className="focus-meter-inner"
                                        animate={{
                                            width: `${score}%`,
                                            backgroundColor: getScoreColor()
                                        }}
                                        transition={{ type: 'spring', stiffness: 50 }}
                                    />
                                </div>
                                <div className="focus-score-text" style={{ color: getScoreColor() }}>
                                    {score}%
                                </div>
                            </div>

                            <p className="focus-status-msg">
                                {score > 70 ? 'Excellent focus. Keep it up!' :
                                    score > 40 ? 'Slightly distracted? Focus back.' :
                                        'Penq is getting worried...'}
                            </p>

                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={toggleSession}
                                disabled={state.focusSession.status === 'loading'}
                            >
                                {state.focusSession.status === 'loading' ? 'Warming up...' : 'End Session'}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            <PenqWidget />
        </div>
    );
}
