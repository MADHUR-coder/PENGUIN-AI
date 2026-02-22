import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { DOMAINS, QUESTION_BANK } from '../data/questionBank';
import Sidebar from '../components/Sidebar';
import PenqWidget from '../components/PenqWidget';
import FocusTracker from '../components/FocusTracker';
import FocusGraph from '../components/FocusGraph';
import './Module.css';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

const MODULES_CONTENT: Record<string, {
    title: string;
    domain: string;
    domainId: string;
    reward: number;
    sections: { title: string; content: string }[];
}> = {
    'js-closures': {
        title: 'JavaScript Closures',
        domain: 'Advanced Concepts',
        domainId: 'advanced',
        reward: 15,
        sections: [
            {
                title: 'What is a Closure?',
                content: `A closure is a function that **remembers** and can access variables from its outer (enclosing) scope, even after the outer function has finished executing.\n\n**Why It Works:**\nIn JavaScript, functions create a new scope. When a function is defined inside another function, the inner function retains a reference to the outer function's variables.\n\nThis is one of the most powerful features in JavaScript, enabling patterns like data privacy, function factories, and partial application.`,
            },
            {
                title: 'Practical Use Cases',
                content: `**1. Private Variables:**\n\`\`\`javascript\nfunction createCounter() {\n  let count = 0;\n  return {\n    increment: () => ++count,\n    getCount: () => count\n  };\n}\n\`\`\`\nHere, \`count\` is private and only accessible via the returned methods.\n\n**2. Function Factories:**\nCreate specialized functions with pre-filled arguments.\n\n**3. Event Handlers:**\nPreserving state in callbacks and asynchronous operations.`,
            },
        ],
    },
    'python-basics': {
        title: 'Python for Hackers',
        domain: 'Syntax & Types',
        domainId: 'syntax',
        reward: 20,
        sections: [
            {
                title: 'Why Python?',
                content: `Python is the Swiss Army knife of security. From automated scripting to exploit development, its readability and vast library ecosystem (Scapy, Requests, Cryptography) make it essential.`,
            },
            {
                title: 'List Comprehensions',
                content: `Effective hackers write concise code. List comprehensions allow you to create lists in a single line:\n\n\`\`\`python\n[x**2 for x in range(10) if x % 2 == 0]\n\`\`\``,
            },
        ],
    },
    'cpp-memory': {
        title: 'C++ Memory Management',
        domain: 'Advanced Concepts',
        domainId: 'advanced',
        reward: 25,
        sections: [
            {
                title: 'Pointers and References',
                content: `Understanding memory is the key to binary exploitation. A pointer stores the address of a value.`,
            },
        ],
    },
    'js-async': {
        title: 'Modern JS: Async/Await',
        domain: 'Control Logic',
        domainId: 'logic',
        reward: 15,
        sections: [
            {
                title: 'The Event Loop',
                content: `JavaScript is single-threaded but handles concurrency through the Event Loop.`,
            },
        ],
    },
    'go-concurrency': {
        title: 'Go Concurrency Patterns',
        domain: 'Advanced Concepts',
        domainId: 'advanced',
        reward: 25,
        sections: [
            {
                title: 'Goroutines: Light-weight Threads',
                content: `Goroutines are functions that run concurrently with other functions. They are incredibly light-weight, often starting with just a few kilobytes of stack space.\n\nTo start one, simply use the \`go\` keyword before a function call.`,
            },
            {
                title: 'Channels: Communicating Sequential Processes',
                content: `Channels are the pipes that connect concurrent goroutines. You can send values into channels from one goroutine and receive them in another.\n\n**Don't communicate by sharing memory, share memory by communicating.**`,
            },
        ],
    },
    'rust-ownership': {
        title: 'Rust Memory Safety (Ownership)',
        domain: 'Advanced Concepts',
        domainId: 'advanced',
        reward: 30,
        sections: [
            {
                title: 'The Ownership System',
                content: `Ownership is Rust's most unique feature. It enables Rust to make memory safety guarantees without needing a garbage collector.\n\n**Rules:**\n1. Each value in Rust has a variable that's called its owner.\n2. There can only be one owner at a time.\n3. When the owner goes out of scope, the value will be dropped.`,
            },
            {
                title: 'Borrowing and References',
                content: `References allow you to refer to some value without taking ownership of it. We call the action of creating a reference **Borrowing**.\n\nReferences are immutable by default, unless specified with \`mut\`.`,
            },
        ],
    },
};

export const MODULES_CONTENT_LIST = Object.entries(MODULES_CONTENT).map(([id, content]) => ({
    id,
    ...content
}));

const LABELS = ['A', 'B', 'C', 'D'];

export default function Module() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { dispatch } = useApp();
    const [currentSection, setCurrentSection] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        // Auto-start focus session when entering learning phase
        dispatch({ type: 'START_FOCUS_SESSION' });
        return () => {
            // Optional: Stop session on exit
            // dispatch({ type: 'STOP_FOCUS_SESSION' });
        };
    }, [dispatch]);

    const module = MODULES_CONTENT[id || ''];
    if (!module) {
        return (
            <div className="page-layout">
                <Sidebar />
                <main className="main-content">
                    <div className="module-not-found glass-card-static">
                        <h2>Module not found</h2>
                        <p>This module is coming soon.</p>
                        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                            ← Back to Dashboard
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    const domain = DOMAINS.find((d) => d.id === module.domain);
    const domainQuestions = QUESTION_BANK.filter((q) => q.domainId === module.domain).slice(0, 3);
    const totalSections = module.sections.length;

    const handleCompleteModule = () => {
        setCompleted(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#22d3ee', '#34d399', '#a78bfa']
        });
        dispatch({ type: 'ADD_COINS', payload: { amount: module.reward, reason: 'module_complete' } });
        dispatch({
            type: 'SET_MODULE_PROGRESS',
            payload: { moduleId: id || '', status: 'completed', score: 100 },
        });
        dispatch({
            type: 'ADD_ACTIVITY',
            payload: {
                icon: '✅',
                text: `Completed Module: ${module.title}`,
                color: 'var(--aurora-green)'
            }
        });
        dispatch({
            type: 'ADD_PENQ_MESSAGE',
            payload: {
                id: Date.now().toString(),
                trigger: 'module_complete',
                message: `🐧 ${module.title} complete. +${module.reward} Penq earned. Your ${domain?.label || ''} skills are growing.`,
                suggestedAction: 'Back to Dashboard',
                suggestedRoute: '/dashboard',
                emotion: 'happy',
                dismissed: false,
                timestamp: Date.now(),
            },
        });
    };

    return (
        <div className="page-layout">
            <Sidebar />
            <main className="main-content">
                {/* Header */}
                <div className="module-header">
                    <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
                        ← Back to Dashboard
                    </button>
                    <div className="module-header-info">
                        <h1 className="module-title">
                            {domain?.icon} {module.title}
                        </h1>
                        <span className="badge badge-amber">💰 +{module.reward} Penq</span>
                    </div>
                </div>

                {completed ? (
                    <motion.div
                        className="module-complete-card glass-card-static"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🎉</div>
                        <h2 style={{ color: 'var(--aurora-green)', marginBottom: 'var(--space-2)' }}>
                            Module Complete!
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                            You earned <strong style={{ color: 'var(--amber)' }}>+{module.reward} Penq coins</strong>.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                                Back to Dashboard →
                            </button>
                            <button className="btn btn-ghost" onClick={() => alert('Feature incoming! Sharing your mastery with the community...')}>
                                🔗 Share Progress
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="module-body-wrapper">
                        <FocusTracker />
                        <div className="module-content-main">
                            <div className="module-lesson glass-card-static">
                                <div className="module-section-tabs">
                                    {module.sections.map((_, i) => (
                                        <button
                                            key={i}
                                            className={`module-tab ${currentSection === i ? 'active' : ''} ${i < currentSection ? 'done' : ''}`}
                                            onClick={() => setCurrentSection(i)}
                                        >
                                            {i < currentSection ? '✓' : i + 1}
                                        </button>
                                    ))}
                                </div>

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentSection}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="module-section-content"
                                    >
                                        <h2 className="module-section-title">
                                            {module.sections[currentSection].title}
                                        </h2>
                                        <div className="module-section-body">
                                            {module.sections[currentSection].content.split('\n').map((line, i) => {
                                                if (line.startsWith('**') && line.endsWith('**')) {
                                                    return <p key={i}><strong>{line.replace(/\*\*/g, '')}</strong></p>;
                                                }
                                                if (line.startsWith('•')) {
                                                    return <p key={i} className="module-bullet">{line}</p>;
                                                }
                                                if (line.startsWith('`') && line.endsWith('`')) {
                                                    return <code key={i} className="module-code">{line.replace(/`/g, '')}</code>;
                                                }
                                                if (line === '') return <br key={i} />;
                                                return <p key={i}>{line.replace(/\*\*(.*?)\*\*/g, '').length < line.length
                                                    ? <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`(.*?)`/g, '<code>$1</code>') }} />
                                                    : line
                                                }</p>;
                                            })}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                <div className="module-section-nav">
                                    <button
                                        className="btn btn-ghost"
                                        onClick={() => setCurrentSection((s) => Math.max(0, s - 1))}
                                        disabled={currentSection === 0}
                                    >
                                        ← Previous
                                    </button>
                                    <span className="module-section-counter">
                                        Section {currentSection + 1} of {totalSections}
                                    </span>
                                    {currentSection < totalSections - 1 ? (
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => setCurrentSection((s) => s + 1)}
                                        >
                                            Next →
                                        </button>
                                    ) : (
                                        <div />
                                    )}
                                </div>

                                {/* Progress bar */}
                                <div className="progress-bar" style={{ marginTop: 'var(--space-4)' }}>
                                    <div
                                        className="progress-bar-fill"
                                        style={{ width: `${((currentSection + 1) / totalSections) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Mini quiz */}
                            {currentSection === totalSections - 1 && (
                                <motion.div
                                    className="module-quiz glass-card-static"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <h3 className="dash-card-title">📝 Knowledge Check</h3>
                                    {domainQuestions.map((q, qi) => (
                                        <div key={q.id} className="mini-quiz-question">
                                            <p className="mini-quiz-stem">
                                                Q{qi + 1}: {q.stem}
                                            </p>
                                            <div className="mini-quiz-options">
                                                {q.options.map((opt, oi) => {
                                                    let cls = 'answer-card';
                                                    if (quizSubmitted) {
                                                        cls += ' disabled';
                                                        if (oi === q.correctIndex) cls += ' correct';
                                                        else if (oi === quizAnswers[q.id] && oi !== q.correctIndex) cls += ' incorrect';
                                                    } else if (quizAnswers[q.id] === oi) {
                                                        cls += ' selected';
                                                    }
                                                    return (
                                                        <div
                                                            key={oi}
                                                            className={cls}
                                                            onClick={() => {
                                                                if (!quizSubmitted) {
                                                                    setQuizAnswers((prev) => ({ ...prev, [q.id]: oi }));
                                                                }
                                                            }}
                                                            style={{ padding: 'var(--space-2) var(--space-3)' }}
                                                        >
                                                            <span className="answer-label" style={{ width: 28, height: 28, fontSize: '0.7rem' }}>
                                                                {LABELS[oi]}
                                                            </span>
                                                            <span style={{ fontSize: 'var(--font-sm)' }}>{opt}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}

                                    {!quizSubmitted ? (
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => setQuizSubmitted(true)}
                                            disabled={Object.keys(quizAnswers).length < domainQuestions.length}
                                            style={{ marginTop: 'var(--space-4)', width: '100%' }}
                                        >
                                            Check Answers
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-primary btn-lg"
                                            onClick={handleCompleteModule}
                                            style={{ marginTop: 'var(--space-4)', width: '100%' }}
                                        >
                                            ✅ Complete Module — Earn {module.reward} Penq
                                        </button>
                                    )}
                                </motion.div>
                            )}
                        </div>

                        <div className="module-focus-sidebar">
                            <FocusGraph />
                        </div>
                    </div>
                )}
            </main>
            <PenqWidget />
        </div>
    );
}
