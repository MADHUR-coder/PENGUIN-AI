import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TOPIC_QUESTIONS, LANGUAGE_TOPICS } from '../data/topicQuestions';
import type { IRTItem } from '../data/questionBank';
import Sidebar from '../components/Sidebar';
import './TopicQuiz.css';

const LABELS = ['A', 'B', 'C', 'D'];

export default function TopicQuiz() {
    const { language, topicId } = useParams<{ language: string; topicId: string }>();
    const { dispatch } = useApp();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState<IRTItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);

    const lang = language || 'javascript';
    const topic = topicId || '';
    const topicDef = LANGUAGE_TOPICS[lang]?.find(t => t.id === topic);

    useEffect(() => {
        const qs = TOPIC_QUESTIONS[topic] || [];
        const shuffled = [...qs].sort(() => 0.5 - Math.random());
        setQuestions(shuffled);
        setCurrentIndex(0);
        setScore(0);
        setQuizComplete(false);
        setSelectedAnswer(null);
        setShowFeedback(false);
    }, [topic]);

    const handleAnswer = (index: number) => {
        if (showFeedback || quizComplete) return;
        const correct = index === questions[currentIndex].correctIndex;
        setSelectedAnswer(index);
        setIsCorrect(correct);
        setShowFeedback(true);
        if (correct) {
            setScore(s => s + 1);
            dispatch({ type: 'ADD_XP', payload: { amount: 10 } });
            dispatch({ type: 'ADD_COINS', payload: { amount: 3, reason: 'topic_quiz_correct' } });
        }

        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(i => i + 1);
                setSelectedAnswer(null);
                setShowFeedback(false);
            } else {
                finishQuiz(correct ? score + 1 : score);
            }
        }, 2200);
    };

    const finishQuiz = (finalScore: number) => {
        setQuizComplete(true);
        dispatch({
            type: 'ADD_ACTIVITY',
            payload: {
                icon: '🎯',
                text: `Completed ${topicDef?.label || topic} in ${lang}`,
                color: topicDef?.color || 'var(--cyan)',
            }
        });
        dispatch({
            type: 'ADD_PENQ_MESSAGE',
            payload: {
                id: Date.now().toString(),
                trigger: 'topic_quiz_complete',
                message: `🎯 ${finalScore}/${questions.length} on ${topicDef?.label}! ${finalScore === questions.length ? 'Perfect! 🏆' : 'Keep practicing!'}`,
                emotion: finalScore >= 3 ? 'proud' : 'happy',
                dismissed: false,
                timestamp: Date.now(),
            },
        });
    };

    if (questions.length === 0) {
        return (
            <div className="page-layout">
                <Sidebar />
                <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="glass-card-static" style={{ padding: 'var(--space-10)', textAlign: 'center' }}>
                        <h2>No Questions Found</h2>
                        <p style={{ color: 'var(--text-secondary)', margin: 'var(--space-4) 0' }}>Try another topic!</p>
                        <button className="btn btn-primary" onClick={() => navigate(`/topic-select/${lang}`)}>← Back to Topics</button>
                    </div>
                </main>
            </div>
        );
    }

    if (quizComplete) {
        const pct = Math.round((score / questions.length) * 100);
        const grade = pct === 100 ? '🏆 Perfect!' : pct >= 60 ? '⭐ Great Job!' : '📚 Keep Learning!';
        return (
            <div className="page-layout">
                <Sidebar />
                <main className="main-content">
                    <motion.div
                        className="tq-results glass-card-static"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="tq-results-icon animate-float">{topicDef?.icon || '🎯'}</div>
                        <h1 className="tq-results-title">{grade}</h1>
                        <p className="tq-results-topic" style={{ color: topicDef?.color }}>
                            {topicDef?.label}
                        </p>
                        <div className="tq-results-ring" style={{ '--ring-pct': `${pct}%`, '--ring-color': topicDef?.color || 'var(--cyan)' } as React.CSSProperties}>
                            <span className="tq-ring-score">{score}/{questions.length}</span>
                        </div>
                        <div className="tq-results-stats">
                            <div className="tq-stat">
                                <span className="tq-stat-val" style={{ color: 'var(--aurora-green)' }}>+{score * 3}</span>
                                <span className="tq-stat-label">💰 Penq</span>
                            </div>
                            <div className="tq-stat">
                                <span className="tq-stat-val" style={{ color: 'var(--amber)' }}>+{score * 10}</span>
                                <span className="tq-stat-label">⚡ XP</span>
                            </div>
                        </div>
                        <div className="tq-results-actions">
                            <button className="btn btn-secondary" onClick={() => { setQuizComplete(false); setCurrentIndex(0); setScore(0); setSelectedAnswer(null); setShowFeedback(false); setQuestions([...questions].sort(() => 0.5 - Math.random())); }}>
                                🔄 Retry
                            </button>
                            <button className="btn btn-primary" onClick={() => navigate(`/topic-select/${lang}`)}>
                                More Topics →
                            </button>
                        </div>
                    </motion.div>
                </main>
            </div>
        );
    }

    const currentItem = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="page-layout">
            <Sidebar />
            <main className="main-content">
                <div className="tq-header">
                    <button className="btn btn-ghost" onClick={() => navigate(`/topic-select/${lang}`)}>← Back</button>
                    <div className="tq-header-center">
                        <span className="tq-topic-badge" style={{ background: `${topicDef?.color}22`, color: topicDef?.color }}>
                            {topicDef?.icon} {topicDef?.label}
                        </span>
                    </div>
                    <span className="tq-counter">
                        {currentIndex + 1} / {questions.length}
                    </span>
                </div>

                <div className="tq-progress">
                    <div className="tq-progress-bar">
                        <motion.div
                            className="tq-progress-fill"
                            animate={{ width: `${progress}%` }}
                            style={{ background: topicDef?.color || 'var(--cyan)' }}
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        className="tq-question-area"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="question-stem glass-card-static tq-stem">
                            {currentItem.stem}
                        </div>

                        <div className="tq-options">
                            {currentItem.options.map((opt, i) => {
                                let cls = 'answer-card';
                                if (showFeedback) {
                                    cls += ' disabled';
                                    if (i === currentItem.correctIndex) cls += ' correct';
                                    else if (i === selectedAnswer && !isCorrect) cls += ' incorrect';
                                }
                                return (
                                    <motion.div
                                        key={i}
                                        className={cls}
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

                        <AnimatePresence>
                            {showFeedback && (
                                <motion.div
                                    className={`feedback-panel ${isCorrect ? 'correct' : 'incorrect'}`}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <strong>{isCorrect ? '✅ Correct!' : '❌ Not quite.'}</strong>
                                    <p style={{ marginTop: 4, opacity: 0.9 }}>{currentItem.explanation}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
