import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DOMAINS } from '../data/questionBank';
import type { IRTItem } from '../data/questionBank';
import {
    selectNextCalibrationItem,
    estimateAbility,
    thetaToPentagonLevel,
    calculateSEM,
} from '../data/irtEngine';
import SkillPentagon from '../components/SkillPentagon';
import './Quiz.css';

const MAX_QUESTIONS = 10;
const SEM_THRESHOLD = 0.30;
const LABELS = ['A', 'B', 'C', 'D'];

interface ResponseRecord {
    item: IRTItem;
    correct: boolean;
    selectedIndex: number;
}

export default function Quiz() {
    const { dispatch } = useApp();
    const navigate = useNavigate();

    const [domainThetas, setDomainThetas] = useState<Record<string, number>>(() => {
        const t: Record<string, number> = {};
        DOMAINS.forEach((d) => (t[d.id] = 0));
        return t;
    });

    const [domainResponses, setDomainResponses] = useState<
        Record<string, ResponseRecord[]>
    >(() => {
        const r: Record<string, ResponseRecord[]> = {};
        DOMAINS.forEach((d) => (r[d.id] = []));
        return r;
    });

    const [currentItem, setCurrentItem] = useState<IRTItem | null>(null);
    const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());
    const [questionCount, setQuestionCount] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [timer, setTimer] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);
    const [totalCorrect, setTotalCorrect] = useState(0);

    // Timer
    useEffect(() => {
        if (quizComplete) return;
        const interval = setInterval(() => setTimer((t) => t + 1), 1000);
        return () => clearInterval(interval);
    }, [quizComplete]);

    // Load first question
    useEffect(() => {
        console.log('Quiz: Loading first question...');
        const item = selectNextCalibrationItem(domainThetas, answeredIds, 0);
        console.log('Quiz: First item selected:', item?.id);
        setCurrentItem(item);
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const getCurrentDomain = () => {
        if (!currentItem) return DOMAINS[0];
        return DOMAINS.find((d) => d.id === currentItem.domainId) || DOMAINS[0];
    };

    const getDifficultyBar = () => {
        if (!currentItem) return 50;
        return Math.round(((currentItem.difficulty + 3) / 6) * 100);
    };

    const getLivePentagon = useCallback(() => {
        const data: Record<string, number> = {};
        DOMAINS.forEach((d) => {
            data[d.id] = thetaToPentagonLevel(domainThetas[d.id]);
        });
        return data;
    }, [domainThetas]);

    const handleAnswer = (index: number) => {
        if (showFeedback || !currentItem) return;

        const correct = index === currentItem.correctIndex;
        setSelectedAnswer(index);
        setIsCorrect(correct);
        setShowFeedback(true);
        if (correct) setTotalCorrect((c) => c + 1);

        // Update domain responses and re-estimate ability
        const domainId = currentItem.domainId;
        const newRecord: ResponseRecord = { item: currentItem, correct, selectedIndex: index };
        const updatedResponses = { ...domainResponses };
        updatedResponses[domainId] = [...updatedResponses[domainId], newRecord];
        setDomainResponses(updatedResponses);

        // Re-estimate theta for this domain
        const newTheta = estimateAbility(updatedResponses[domainId]);
        const updatedThetas = { ...domainThetas, [domainId]: newTheta };
        setDomainThetas(updatedThetas);

        // Update pentagon in global state
        dispatch({
            type: 'UPDATE_PENTAGON_DOMAIN',
            payload: {
                domainId,
                level: thetaToPentagonLevel(newTheta),
                theta: newTheta,
            },
        });

        // Award rewards for correct answers
        if (correct) {
            dispatch({ type: 'ADD_COINS', payload: { amount: 2, reason: 'quiz_correct' } });
            dispatch({ type: 'ADD_XP', payload: { amount: 5 } });
        }

        const newCount = questionCount + 1;
        const newAnsweredIds = new Set(answeredIds);
        newAnsweredIds.add(currentItem.id);
        setAnsweredIds(newAnsweredIds);
        setQuestionCount(newCount);

        // Check stopping conditions
        const allResponses = Object.values(updatedResponses).flat();
        const avgTheta =
            Object.values(updatedThetas).reduce((s, t) => s + t, 0) / DOMAINS.length;
        const sem = calculateSEM(avgTheta, allResponses);

        setTimeout(() => {
            console.log('Quiz: Moving to next state. Current count:', newCount, 'SEM:', sem);
            if (newCount >= MAX_QUESTIONS || (sem < SEM_THRESHOLD && newCount >= 10)) {
                console.log('Quiz: Stopping conditions met.');
                finishQuiz(updatedThetas);
            } else {
                const nextItem = selectNextCalibrationItem(updatedThetas, newAnsweredIds, newCount);
                console.log('Quiz: Next item:', nextItem?.id);
                if (!nextItem) {
                    console.log('Quiz: No more items available.');
                    finishQuiz(updatedThetas);
                } else {
                    setCurrentItem(nextItem);
                    setSelectedAnswer(null);
                    setShowFeedback(false);
                }
            }
        }, 2500);
    };

    const finishQuiz = (finalThetas: Record<string, number>) => {
        setQuizComplete(true);

        // Set all pentagon values
        const pentagonData: Record<string, number> = {};
        DOMAINS.forEach((d) => {
            pentagonData[d.id] = thetaToPentagonLevel(finalThetas[d.id]);
        });
        dispatch({ type: 'SET_PENTAGON', payload: pentagonData });
        dispatch({ type: 'SET_PENTAGON_THETA', payload: finalThetas });
        dispatch({ type: 'SET_CALIBRATION_DONE' });
        dispatch({ type: 'INCREMENT_STREAK' });
        dispatch({
            type: 'ADD_ACTIVITY',
            payload: {
                icon: '✅',
                text: 'Completed Initial Calibration',
                color: 'var(--aurora-green)'
            }
        });

        // Penq congratulation message
        const strongestDomain = DOMAINS.reduce((best, d) =>
            pentagonData[d.id] > pentagonData[best.id] ? d : best
            , DOMAINS[0]);

        dispatch({
            type: 'ADD_PENQ_MESSAGE',
            payload: {
                id: Date.now().toString(),
                trigger: 'first_calibration_complete',
                message: `⭐ Your Skill Pentagon is live! You're strongest in ${strongestDomain.label} — nice foundation to build on.`,
                suggestedAction: 'Explore Skill Paths',
                suggestedRoute: '/dashboard',
                emotion: 'proud',
                dismissed: false,
                timestamp: Date.now(),
            },
        });
    };

    if (quizComplete) {
        return (
            <div className="quiz-container">
                <div className="quiz-bg-glow" />
                <motion.div
                    className="quiz-results glass-card-static"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="penq-avatar animate-float" style={{ fontSize: '3rem' }}>🐧</div>
                    <h1 className="results-title">Calibration Complete!</h1>
                    <p className="results-subtitle">
                        Your Skill Pentagon is ready. Here's how you scored:
                    </p>

                    <div className="results-pentagon">
                        <SkillPentagon data={getLivePentagon()} size={280} />
                    </div>

                    <div className="results-stats">
                        <div className="stat-card">
                            <span className="stat-value">{questionCount}</span>
                            <span className="stat-label">Questions</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{totalCorrect}</span>
                            <span className="stat-label">Correct</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{formatTime(timer)}</span>
                            <span className="stat-label">Time</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">+{totalCorrect * 2}</span>
                            <span className="stat-label">Penq Earned</span>
                        </div>
                    </div>

                    <div className="results-domains">
                        {DOMAINS.map((d) => (
                            <div key={d.id} className="domain-result">
                                <span className="domain-icon">{d.icon}</span>
                                <span className="domain-name">{d.label}</span>
                                <div className="domain-bar">
                                    <motion.div
                                        className="domain-bar-fill"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${getLivePentagon()[d.id]}%` }}
                                        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                        style={{ background: d.color }}
                                    />
                                </div>
                                <span className="domain-score" style={{ color: d.color }}>
                                    {Math.round(getLivePentagon()[d.id])}
                                </span>
                            </div>
                        ))}
                    </div>

                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => navigate('/language-select')}
                        style={{ marginTop: 'var(--space-6)' }}
                    >
                        Pick Learning Path →
                    </button>
                </motion.div>
            </div>
        );
    }

    if (!currentItem) return null;

    const currentDomain = getCurrentDomain();

    return (
        <div className="quiz-container">
            <div className="quiz-bg-glow" />

            <div className="quiz-main">
                {/* Header */}
                <div className="quiz-header">
                    <div className="quiz-header-left">
                        <h2 className="quiz-title">Calibration Quiz</h2>
                    </div>
                    <div className="quiz-header-right">
                        <span className="quiz-counter">
                            Question {questionCount + 1} of ~{MAX_QUESTIONS}
                        </span>
                        <span className="quiz-timer">⏱ {formatTime(timer)}</span>
                    </div>
                </div>

                <div className="quiz-body">
                    {/* Left: question area */}
                    <div className="quiz-question-area">
                        {/* Domain & difficulty */}
                        <div className="quiz-meta">
                            <span className="badge badge-cyan">
                                {currentDomain.icon} {currentDomain.label}
                            </span>
                            <div className="difficulty-indicator">
                                <span className="difficulty-label">Difficulty</span>
                                <div className="difficulty-bar">
                                    <motion.div
                                        className="difficulty-fill"
                                        animate={{ width: `${getDifficultyBar()}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Question */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentItem.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="question-stem glass-card-static">
                                    {currentItem.stem}
                                </div>

                                {/* Answer options */}
                                <div className="answer-options">
                                    {currentItem.options.map((opt, i) => {
                                        let cardClass = 'answer-card';
                                        if (showFeedback) {
                                            cardClass += ' disabled';
                                            if (i === currentItem.correctIndex) cardClass += ' correct';
                                            else if (i === selectedAnswer && !isCorrect) cardClass += ' incorrect';
                                        }

                                        return (
                                            <motion.div
                                                key={i}
                                                className={cardClass}
                                                onClick={() => handleAnswer(i)}
                                                whileHover={!showFeedback ? { x: 4 } : {}}
                                                whileTap={!showFeedback ? { scale: 0.98 } : {}}
                                            >
                                                <span className="answer-label">{LABELS[i]}</span>
                                                <span className="answer-text">{opt}</span>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Feedback */}
                                <AnimatePresence>
                                    {showFeedback && (
                                        <motion.div
                                            className={`feedback-panel ${isCorrect ? 'correct' : 'incorrect'}`}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            <strong>{isCorrect ? '✅ Correct!' : '❌ Not quite.'}</strong>
                                            <p style={{ marginTop: '4px', opacity: 0.9 }}>
                                                {currentItem.explanation}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </AnimatePresence>

                        {/* Progress bar */}
                        <div className="quiz-progress">
                            <div className="progress-bar">
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${((questionCount + 1) / MAX_QUESTIONS) * 100}%` }}
                                />
                            </div>
                            <span className="progress-text">
                                {questionCount + 1}/{MAX_QUESTIONS}
                            </span>
                        </div>
                    </div>

                    {/* Right: live mini pentagon */}
                    <div className="quiz-sidebar">
                        <div className="mini-pentagon-card glass-card-static">
                            <h3 className="mini-pentagon-title">Live Skill Map</h3>
                            <SkillPentagon data={getLivePentagon()} size={200} />
                            <p className="mini-pentagon-hint">Updating as you answer...</p>
                        </div>

                        <div className="quiz-stats-card glass-card-static">
                            <div className="quiz-stat">
                                <span className="quiz-stat-label">Correct</span>
                                <span className="quiz-stat-value" style={{ color: 'var(--aurora-green)' }}>
                                    {totalCorrect}
                                </span>
                            </div>
                            <div className="quiz-stat">
                                <span className="quiz-stat-label">Earned</span>
                                <span className="quiz-stat-value" style={{ color: 'var(--amber)' }}>
                                    💰 {totalCorrect * 2}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
