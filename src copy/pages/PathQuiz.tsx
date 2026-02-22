import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { QUESTION_BANK } from '../data/questionBank';
import type { IRTItem } from '../data/questionBank';
import Sidebar from '../components/Sidebar';
import './Quiz.css';

const MAX_QUESTIONS = 10;
const LABELS = ['A', 'B', 'C', 'D'];

export default function PathQuiz() {
    const { language, level } = useParams<{ language: string; level: string }>();
    const { dispatch } = useApp();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState<IRTItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);

    useEffect(() => {
        // Filter questions by language tag and level
        // level: beginner (-2.5 to 0), intermediate (0 to 2.5)
        const difficultyRange = level === 'beginner' ? [-3, 0.2] : [-0.2, 3];

        const filtered = QUESTION_BANK.filter(item => {
            const hasLangTag = item.tags.includes(language || '');
            const inDifficulty = item.difficulty >= difficultyRange[0] && item.difficulty <= difficultyRange[1];
            return hasLangTag && inDifficulty;
        });

        // Shuffle and take MAX_QUESTIONS
        const shuffled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, MAX_QUESTIONS);
        setQuestions(shuffled);
    }, [language, level]);

    const handleAnswer = (index: number) => {
        if (showFeedback || quizComplete) return;

        const correct = index === questions[currentIndex].correctIndex;
        setSelectedAnswer(index);
        setIsCorrect(correct);
        setShowFeedback(true);
        if (correct) {
            setScore(s => s + 1);
            const xpAmount = level === 'beginner' ? 20 : 50;
            dispatch({ type: 'ADD_XP', payload: { amount: xpAmount } });
        }

        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(i => i + 1);
                setSelectedAnswer(null);
                setShowFeedback(false);
            } else {
                finishQuiz();
            }
        }, 2000);
    };

    const finishQuiz = () => {
        setQuizComplete(true);
        const coinsEarned = score * 5;
        dispatch({ type: 'ADD_COINS', payload: { amount: coinsEarned, reason: 'path_quiz_complete' } });
        dispatch({
            type: 'ADD_ACTIVITY',
            payload: {
                icon: '📚',
                text: `Finished ${language} ${level} Path Quiz`,
                color: 'var(--cyan)'
            }
        });

        dispatch({
            type: 'ADD_PENQ_MESSAGE',
            payload: {
                id: Date.now().toString(),
                trigger: 'path_complete',
                message: `🎉 Great job! You scored ${score}/${questions.length} in ${language} ${level}. Keep it up!`,
                emotion: 'proud',
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
                        <h2 style={{ marginBottom: 'var(--space-4)' }}>No Questions Found</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>We're still gathering focused questions for this path. Try another level or language!</p>
                        <button className="btn btn-primary" onClick={() => navigate('/paths')} style={{ marginTop: 'var(--space-6)' }}>Back to Paths</button>
                    </div>
                </main>
            </div>
        );
    }

    if (quizComplete) {
        return (
            <div className="page-layout">
                <Sidebar />
                <main className="main-content">
                    <div className="quiz-results glass-card-static animate-in" style={{ marginTop: 'var(--space-10)' }}>
                        <div className="penq-avatar animate-float" style={{ fontSize: '3rem' }}>🐧</div>
                        <h1 className="results-title">Path Milestone Reached!</h1>
                        <p className="results-subtitle">
                            You've sharpened your skills in <strong>{language} ({level})</strong>.
                        </p>

                        <div className="results-stats" style={{ margin: 'var(--space-8) 0' }}>
                            <div className="stat-card">
                                <span className="stat-value">{score}/{questions.length}</span>
                                <span className="stat-label">Score</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-value">+{score * 5}</span>
                                <span className="stat-label">Penq Earned</span>
                            </div>
                        </div>

                        <button className="btn btn-primary btn-lg" onClick={() => navigate('/paths')}>
                            Continue Learning →
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    const currentItem = questions[currentIndex];

    return (
        <div className="page-layout">
            <Sidebar />
            <main className="main-content">
                <header className="page-header" style={{ marginBottom: 'var(--space-8)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div>
                            <h1 className="section-title" style={{ textTransform: 'capitalize' }}>{language} {level}</h1>
                            <p className="section-subtitle">Focused skill assessment.</p>
                        </div>
                        <div className="quiz-timer">
                            Question {currentIndex + 1} / {questions.length}
                        </div>
                    </div>
                </header>

                <div className="quiz-body" style={{ gridTemplateColumns: '1fr' }}>
                    <div className="quiz-question-area">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="question-stem glass-card-static" style={{ fontSize: '1.4rem' }}>
                                    {currentItem.stem}
                                </div>

                                <div className="answer-options" style={{ marginTop: 'var(--space-6)' }}>
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

                                {showFeedback && (
                                    <motion.div
                                        className={`feedback-panel ${isCorrect ? 'correct' : 'incorrect'}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{ marginTop: 'var(--space-6)' }}
                                    >
                                        <strong>{isCorrect ? '✨ Sharp as a penguin\'s beak!' : '🧊 Chilly! Not quite.'}</strong>
                                        <p style={{ marginTop: '4px', opacity: 0.9 }}>
                                            {currentItem.explanation}
                                        </p>
                                    </motion.div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="quiz-progress" style={{ marginTop: 'var(--space-10)' }}>
                    <div className="progress-bar" style={{ height: '6px' }}>
                        <div
                            className="progress-bar-fill"
                            style={{
                                width: `${((currentIndex + 1) / questions.length) * 100}%`,
                                background: 'var(--cyan)'
                            }}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
