import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import './LanguageSelect.css';

const LANGUAGES = [
    { id: 'javascript', name: 'JavaScript', icon: '🟨', desc: 'The backbone of the web and modern apps.' },
    { id: 'python', name: 'Python', icon: '🟦', desc: 'Powering AI, data science, and backend systems.' },
    { id: 'cpp', name: 'C++', icon: '⚙️', desc: 'High-performance systems and game development.' },
    { id: 'go', name: 'Go', icon: '🐹', desc: 'Efficient, cloud-native backend engineering.' },
];

export default function LanguageSelect() {
    const { dispatch } = useApp();
    const navigate = useNavigate();

    const selectLanguage = (langId: string) => {
        dispatch({ type: 'SET_LANGUAGE', payload: langId });
        navigate('/dashboard');
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
                        <h1 className="section-title">Choose Your Path</h1>
                        <p className="section-subtitle">Select the primary language you want to master. We'll tailor your daily labs and skill pentagon growth to this choice.</p>
                    </motion.div>
                </header>

                <div className="language-grid">
                    {LANGUAGES.map((lang, idx) => (
                        <motion.div
                            key={lang.id}
                            className="language-card glass-card h-clickable"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => selectLanguage(lang.id)}
                        >
                            <div className="lang-icon">{lang.icon}</div>
                            <h2 className="lang-name">{lang.name}</h2>
                            <p className="lang-desc">{lang.desc}</p>
                            <div className="lang-select-btn">Select Path →</div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}
