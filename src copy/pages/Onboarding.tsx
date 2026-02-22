import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DOMAINS } from '../data/questionBank';
import './Onboarding.css';

const BLOCKERS = [
    'I lose focus quickly',
    'I don\'t know where to start',
    'I get stuck on hard topics',
    'I can\'t stay consistent',
];

const pageVariants = {
    enter: { opacity: 0, x: 60 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -60 },
};

export default function Onboarding() {
    const [step, setStep] = useState(0);
    const [goal, setGoal] = useState('');
    const [blocker, setBlocker] = useState('');
    const [customBlocker, setCustomBlocker] = useState('');
    const { dispatch } = useApp();
    const navigate = useNavigate();

    const handleNext = () => {
        if (step === 0 && goal.trim()) {
            dispatch({ type: 'SET_USER', payload: { goal: goal.trim() } });
            setStep(1);
        } else if (step === 1 && (blocker || customBlocker.trim())) {
            const selectedBlocker = blocker === 'other' ? customBlocker.trim() : blocker;
            dispatch({ type: 'SET_USER', payload: { blocker: selectedBlocker } });
            setStep(2);
        }
    };

    const handleStartQuiz = () => {
        dispatch({ type: 'COMPLETE_ONBOARDING' });
        navigate('/quiz');
    };

    return (
        <div className="onboarding-container">
            {/* Background decoration */}
            <div className="onboarding-bg-glow" />
            <div className="onboarding-bg-grid" />

            <div className="onboarding-card">
                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            key="step-0"
                            variants={pageVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="onboarding-step"
                        >
                            <div className="penq-avatar animate-float">🐧</div>
                            <h1 className="onboarding-title">Hey! I'm Penq.</h1>
                            <p className="onboarding-subtitle">
                                What's one skill you want to master?
                            </p>
                            <input
                                type="text"
                                className="input onboarding-input"
                                placeholder='e.g. "Penetration Testing"'
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                                autoFocus
                            />
                            <button
                                className="btn btn-primary btn-lg onboarding-btn"
                                onClick={handleNext}
                                disabled={!goal.trim()}
                            >
                                Next →
                            </button>
                        </motion.div>
                    )}

                    {step === 1 && (
                        <motion.div
                            key="step-1"
                            variants={pageVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="onboarding-step"
                        >
                            <div className="penq-avatar animate-float">🐧</div>
                            <h1 className="onboarding-title">What usually gets in your way?</h1>
                            <p className="onboarding-subtitle">
                                This helps me tailor your learning experience.
                            </p>
                            <div className="blocker-options">
                                {BLOCKERS.map((b) => (
                                    <div
                                        key={b}
                                        className={`option-card ${blocker === b ? 'selected' : ''}`}
                                        onClick={() => { setBlocker(b); setCustomBlocker(''); }}
                                    >
                                        <div className="radio-dot" />
                                        <span>{b}</span>
                                    </div>
                                ))}
                                <div
                                    className={`option-card ${blocker === 'other' ? 'selected' : ''}`}
                                    onClick={() => setBlocker('other')}
                                >
                                    <div className="radio-dot" />
                                    <span>Other</span>
                                </div>
                                {blocker === 'other' && (
                                    <motion.input
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        type="text"
                                        className="input"
                                        placeholder="Tell me more..."
                                        value={customBlocker}
                                        onChange={(e) => setCustomBlocker(e.target.value)}
                                        autoFocus
                                    />
                                )}
                            </div>
                            <button
                                className="btn btn-primary btn-lg onboarding-btn"
                                onClick={handleNext}
                                disabled={!blocker && !customBlocker.trim()}
                            >
                                Next →
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step-2"
                            variants={pageVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="onboarding-step"
                        >
                            <div className="penq-avatar animate-float">🐧</div>
                            <h1 className="onboarding-title">Perfect. Let's map your skills.</h1>
                            <p className="onboarding-subtitle">
                                A quick adaptive quiz will fill in your Skill Pentagon.
                            </p>

                            <div className="empty-pentagon">
                                <svg viewBox="0 0 200 200" className="pentagon-svg">
                                    {/* Pentagon shape */}
                                    <polygon
                                        points={DOMAINS.map((_, i) => {
                                            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                                            const r = 80;
                                            return `${100 + r * Math.cos(angle)},${100 + r * Math.sin(angle)}`;
                                        }).join(' ')}
                                        fill="none"
                                        stroke="rgba(34, 211, 238, 0.2)"
                                        strokeWidth="1"
                                    />
                                    <polygon
                                        points={DOMAINS.map((_, i) => {
                                            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                                            const r = 40;
                                            return `${100 + r * Math.cos(angle)},${100 + r * Math.sin(angle)}`;
                                        }).join(' ')}
                                        fill="none"
                                        stroke="rgba(34, 211, 238, 0.1)"
                                        strokeWidth="1"
                                    />
                                    {/* Labels */}
                                    {DOMAINS.map((d, i) => {
                                        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                                        const r = 95;
                                        return (
                                            <text
                                                key={d.id}
                                                x={100 + r * Math.cos(angle)}
                                                y={100 + r * Math.sin(angle)}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                fill="rgba(148, 163, 184, 0.6)"
                                                fontSize="9"
                                                fontFamily="Inter"
                                            >
                                                {d.icon} ??
                                            </text>
                                        );
                                    })}
                                    {/* Question marks in center */}
                                    <text
                                        x="100" y="100"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill="rgba(34, 211, 238, 0.3)"
                                        fontSize="24"
                                        fontWeight="bold"
                                        fontFamily="Inter"
                                    >
                                        ?
                                    </text>
                                </svg>
                            </div>

                            <button
                                className="btn btn-primary btn-lg onboarding-btn animate-pulse-glow"
                                onClick={handleStartQuiz}
                            >
                                🎯 Start Calibration Quiz
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Step indicator */}
                <div className="step-dots">
                    {[0, 1, 2].map((s) => (
                        <div key={s} className={`dot ${step === s ? 'active' : ''} ${step > s ? 'done' : ''}`} />
                    ))}
                </div>
            </div>
        </div>
    );
}
