import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import PenqWidget from '../components/PenqWidget';
import './Labs.css';

export default function Labs() {
    const navigate = useNavigate();
    const [labs, setLabs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLabs = async () => {
            const { data, error } = await supabase
                .from('labs')
                .select('*');

            if (!error && data && data.length > 0) {
                setLabs(data);
            } else {
                // Professional Seed Data if DB is empty
                setLabs([
                    { id: 'lab-1', title: 'Neural Network from Scratch', desc: 'Build a percerptron and train it on XOR data. No libraries, just math.', icon: '🧠', difficulty: 'Intermediate', reward: 500 },
                    { id: 'lab-2', title: 'Distributed Key-Value Store', desc: 'Implement Raft consensus algorithm for a basic KV store.', icon: '🛰️', difficulty: 'Advanced', reward: 1200 },
                    { id: 'lab-3', title: 'Zero-Copy Buffer Management', desc: 'Master memory efficiency by building a high-performance buffer pool.', icon: '⚡', difficulty: 'Beginner', reward: 350 },
                ]);
            }
            setLoading(false);
        };
        fetchLabs();
    }, []);
    return (
        <div className="page-layout">
            <Sidebar />
            <main className="main-content">
                <header className="page-header">
                    <h1 className="section-title">Technological Labs</h1>
                    <p className="section-subtitle">Real-world simulations. No theory, just action.</p>
                </header>

                <div className="labs-grid">
                    {loading ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 'var(--space-12)' }}>
                            Downloading Lab Simulations...
                        </div>
                    ) : (
                        labs.map((lab, idx) => (
                            <motion.div
                                key={lab.id}
                                className="lab-card glass-card h-clickable"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <div className="lab-badge">{lab.difficulty}</div>
                                <div className="lab-icon">{lab.icon}</div>
                                <h2 className="lab-title">{lab.title}</h2>
                                <p className="lab-desc">{lab.desc}</p>
                                <div className="lab-footer">
                                    <span className="lab-reward">💰 {lab.reward} Penq</span>
                                    <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/lab/${lab.id}`)}>Join Lab</button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                <div className="labs-cta glass-card-static">
                    <div className="cta-content">
                        <h3>Run Private Labs?</h3>
                        <p>Unlock custom labs for team-based training and private environments.</p>
                    </div>
                    <button className="btn btn-amber">Go Pro</button>
                </div>
            </main>
            <PenqWidget />
        </div>
    );
}
