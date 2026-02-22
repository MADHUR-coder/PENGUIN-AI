import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LANGUAGE_TOPICS } from '../data/topicQuestions';
import Sidebar from '../components/Sidebar';
import './TopicSelect.css';

const LANG_META: Record<string, { name: string; icon: string; gradient: string }> = {
    javascript: { name: 'JavaScript', icon: '🟨', gradient: 'linear-gradient(135deg, #f7df1e33 0%, #f0db4f11 100%)' },
    python: { name: 'Python', icon: '🐍', gradient: 'linear-gradient(135deg, #3776ab33 0%, #ffd34311 100%)' },
    cpp: { name: 'C++', icon: '⚙️', gradient: 'linear-gradient(135deg, #00599c33 0%, #004e8c11 100%)' },
    go: { name: 'Go', icon: '🐹', gradient: 'linear-gradient(135deg, #00add833 0%, #00a29b11 100%)' },
};

export default function TopicSelect() {
    const { language } = useParams<{ language: string }>();
    const navigate = useNavigate();
    const lang = language || 'javascript';
    const topics = LANGUAGE_TOPICS[lang] || [];
    const meta = LANG_META[lang] || { name: lang, icon: '📚', gradient: 'none' };

    return (
        <div className="page-layout">
            <Sidebar />
            <main className="main-content">
                <motion.header
                    className="page-header center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <button className="btn btn-ghost topic-back-btn" onClick={() => navigate('/language-select')}>
                        ← Back to Languages
                    </button>
                    <div className="topic-lang-badge" style={{ background: meta.gradient }}>
                        <span className="topic-lang-icon">{meta.icon}</span>
                        <span className="topic-lang-name">{meta.name}</span>
                    </div>
                    <h1 className="section-title">Choose a Topic</h1>
                    <p className="section-subtitle">Pick a topic to practice. Each has 5 focused questions to test your skills.</p>
                </motion.header>

                <div className="topic-grid">
                    {topics.map((topic, idx) => (
                        <motion.div
                            key={topic.id}
                            className="topic-card glass-card h-clickable"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            onClick={() => navigate(`/topic-quiz/${lang}/${topic.id}`)}
                            style={{ '--topic-color': topic.color } as React.CSSProperties}
                        >
                            <div className="topic-icon-wrap" style={{ background: `${topic.color}22` }}>
                                <span className="topic-icon">{topic.icon}</span>
                            </div>
                            <h2 className="topic-name">{topic.label}</h2>
                            <div className="topic-meta">
                                <span className="topic-q-count">5 Questions</span>
                                <span className="topic-arrow" style={{ color: topic.color }}>Start →</span>
                            </div>
                            <div className="topic-glow" style={{ background: topic.color }} />
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}
