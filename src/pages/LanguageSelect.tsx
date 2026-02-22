import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import './LanguageSelect.css';

const LANGUAGES = [
    { id: 'javascript', name: 'JavaScript', icon: '🟨', desc: 'The backbone of the web and modern apps.', color: '#f7df1e', topics: 5 },
    { id: 'python', name: 'Python', icon: '🐍', desc: 'Powering AI, data science, and backend systems.', color: '#3776ab', topics: 5 },
    { id: 'cpp', name: 'C++', icon: '⚙️', desc: 'High-performance systems and game development.', color: '#00599c', topics: 5 },
    { id: 'go', name: 'Go', icon: '🐹', desc: 'Efficient, cloud-native backend engineering.', color: '#00add8', topics: 5 },
];

export default function LanguageSelect() {
    const { dispatch } = useApp();
    const navigate = useNavigate();

    const selectLanguage = (langId: string) => {
        dispatch({ type: 'SET_LANGUAGE', payload: langId });
        navigate(`/topic-select/${langId}`);
    };

    return (
        <div className="page-layout">
            <Sidebar />
            <main className="main-content">
                <header className="page-header center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="language-header"
                    >
                        <h1 className="section-title">Choose Your Language</h1>
                        <p className="section-subtitle">Select a language to explore topics and practice with focused quizzes. Each language has multiple topics with 5 questions each.</p>
                    </motion.div>
                </header>

                <div className="language-grid">
                    {LANGUAGES.map((lang, idx) => (
                        <motion.div
                            key={lang.id}
                            className="language-card glass-card h-clickable"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            onClick={() => selectLanguage(lang.id)}
                            style={{ '--lang-color': lang.color } as React.CSSProperties}
                        >
                            <div className="lang-icon">{lang.icon}</div>
                            <h2 className="lang-name">{lang.name}</h2>
                            <p className="lang-desc">{lang.desc}</p>
                            <div className="lang-topics-count">{lang.topics} Topics · {lang.topics * 5} Questions</div>
                            <div className="lang-select-btn" style={{ color: lang.color }}>Explore Topics →</div>
                            <div className="lang-card-glow" style={{ background: lang.color }} />
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}
