import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import './LabSpace.css';

const LAB_SCENARIOS: Record<string, {
    title: string;
    steps: {
        text: string;
        options: { label: string; action: string; nextIndex: number; success?: boolean }[];
    }[];
}> = {
    'lab-1': {
        title: 'Neural Network from Scratch',
        steps: [
            {
                text: 'System initialized. You are currently in the scratch environment. We need to define the perceptron weights. What initialization method do you choose?',
                options: [
                    { label: 'Zeros Initialization', action: 'Initialize with 0s', nextIndex: 1 },
                    { label: 'He Normal Initialization', action: 'Initialize with He Normal', nextIndex: 2, success: true }
                ]
            },
            {
                text: '[CRITICAL ERROR] Vanishing gradient detected. The model is not learning correctly. Try a better weight initialization.',
                options: [
                    { label: 'Try He Normal', action: 'Switch to He Normal', nextIndex: 2, success: true }
                ]
            },
            {
                text: 'Weights healthy. Forward propagation active. Now, which activation function for the hidden layer?',
                options: [
                    { label: 'Sigmoid', action: 'Use Sigmoid', nextIndex: 3 },
                    { label: 'ReLU', action: 'Use ReLU', nextIndex: 4, success: true }
                ]
            },
            {
                text: 'Training speed is slow due to saturation. Sigmoid might not be optimal here.',
                options: [
                    { label: 'Switch to ReLU', action: 'Update to ReLU', nextIndex: 4, success: true }
                ]
            },
            {
                text: 'Training complete. Accuracy: 99.8%. Lab objectives achieved. You have mastered basic NN architecture!',
                options: [
                    { label: 'Exit Lab', action: 'Complete Simulation', nextIndex: -1 }
                ]
            }
        ]
    }
};

export default function LabSpace() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { dispatch } = useApp();
    const [currentStep, setCurrentStep] = useState(0);
    const [history, setHistory] = useState<{ text: string; type: 'cmd' | 'output' }[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scenario = LAB_SCENARIOS[id || 'lab-1'] || LAB_SCENARIOS['lab-1'];

    useEffect(() => {
        setHistory([{ text: scenario.steps[0].text, type: 'output' }]);
    }, [scenario]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleOption = (opt: any) => {
        setHistory(prev => [...prev,
        { text: `> ${opt.action}`, type: 'cmd' },
        { text: opt.nextIndex === -1 ? 'Simulation success. Shutting down...' : scenario.steps[opt.nextIndex].text, type: 'output' }
        ]);

        if (opt.nextIndex === -1) {
            setTimeout(() => {
                setIsComplete(true);
                dispatch({ type: 'ADD_COINS', payload: { amount: 50, reason: 'lab_complete' } });
            }, 1000);
        } else {
            setCurrentStep(opt.nextIndex);
        }
    };

    return (
        <div className="lab-space-container">
            <header className="terminal-header">
                <div className="terminal-title">
                    <span>🐧 PenqOS // </span>
                    <span style={{ color: '#fbbf24' }}>{scenario.title}</span>
                </div>
                <div className="terminal-status">
                    <span className="status-item">RAM: 4.2GB / 12GB</span>
                    <span className="status-item status-online">SECURE_LINK: YES</span>
                    <button onClick={() => navigate('/labs')} style={{ background: 'none', border: '1px solid #f87171', color: '#f87171', cursor: 'pointer', padding: '2px 8px', borderRadius: 4 }}>ABORT</button>
                </div>
            </header>

            <main className="terminal-main">
                {history.map((line, i) => (
                    <div key={i} className={`terminal-line ${line.type === 'cmd' ? 'line-prefix' : ''}`}>
                        {line.type === 'cmd' && <span className="line-prefix">$</span>}
                        {line.text}
                    </div>
                ))}
                <div ref={scrollRef} />

                {!isComplete && (
                    <div className="terminal-input-area">
                        <div className="interactive-options">
                            {scenario.steps[currentStep].options.map((opt, i) => (
                                <button key={i} className="option-btn" onClick={() => handleOption(opt)}>
                                    <span className="option-key">[{i + 1}]</span>
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <AnimatePresence>
                {isComplete && (
                    <motion.div
                        className="lab-complete-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="success-badge">🏅</div>
                        <h2 style={{ color: '#4ade80', fontSize: '2.5rem' }}>LAB COMPLETE</h2>
                        <p style={{ margin: 'var(--space-4) 0', color: '#94a3b8' }}>Neural Network simulation successfully finalized.</p>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button className="btn btn-primary" onClick={() => navigate('/labs')}>Back to Labs</button>
                            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
