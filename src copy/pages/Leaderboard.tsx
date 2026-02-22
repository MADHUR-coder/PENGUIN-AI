import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';
import PenqWidget from '../components/PenqWidget';
import './Leaderboard.css';

export default function Leaderboard() {
    const { state } = useApp();
    const [leaders, setLeaders] = useState<any[]>([]);
    const [userRank, setUserRank] = useState<number | string>('...');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaders = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('coins', { ascending: false })
                .limit(10);

            if (!error && data) {
                setLeaders(data);
            }

            // Calculate current user's rank
            try {
                const { data: { user: sbUser } } = await supabase.auth.getUser();
                if (sbUser) {
                    const { count, error: countError } = await supabase
                        .from('profiles')
                        .select('*', { count: 'exact', head: true })
                        .gt('coins', state.economy.balance);

                    if (!countError) {
                        setUserRank((count || 0) + 1);
                    }
                }
            } catch (err) {
                console.error('Error fetching rank:', err);
            }

            setLoading(false);
        };
        fetchLeaders();
    }, [state.economy.balance]);

    const getRankIcon = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return rank;
    };

    const currentUser = {
        rank: userRank,
        name: state.user.name || 'You',
        streak: state.economy.currentStreak,
        balance: state.economy.balance,
        avatar: '🐧',
        isYou: true
    };

    return (
        <div className="page-layout">
            <Sidebar />
            <main className="main-content">
                <header className="page-header">
                    <h1 className="section-title">Global Leaderboard</h1>
                    <p className="section-subtitle">Compete with the top learners in the Penq ecosystem.</p>
                </header>

                <div className="leaderboard-container glass-card-static">
                    <div className="leaderboard-header">
                        <span className="col-rank">Rank</span>
                        <span className="col-user">User</span>
                        <span className="col-streak">Streak</span>
                        <span className="col-balance">Penq</span>
                    </div>

                    <div className="leaderboard-list">
                        {loading ? (
                            <div className="glass-card-static" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                                Syncing Global Ranks...
                            </div>
                        ) : (
                            leaders.map((user, idx) => (
                                <motion.div
                                    key={user.id}
                                    className={`leaderboard-row ${idx < 3 ? `top-${idx + 1}` : ''}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <span className="col-rank">{getRankIcon(idx + 1)}</span>
                                    <div className="col-user">
                                        <span className="user-avatar">{user.avatar || '👤'}</span>
                                        <span className="user-name">{user.name}</span>
                                    </div>
                                    <span className="col-streak">🔥 {user.streak || 0}</span>
                                    <span className="col-balance">💰 {user.coins || 0}</span>
                                </motion.div>
                            ))
                        )}

                        <div className="leaderboard-divider">•••</div>

                        <motion.div
                            className="leaderboard-row current-user"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <span className="col-rank">{currentUser.rank}</span>
                            <div className="col-user">
                                <span className="user-avatar">{currentUser.avatar}</span>
                                <span className="user-name">{currentUser.name} (You)</span>
                            </div>
                            <span className="col-streak">🔥 {currentUser.streak}</span>
                            <span className="col-balance">💰 {currentUser.balance}</span>
                        </motion.div>
                    </div>
                </div>

                <div className="leaderboard-info glass-card-static">
                    <h2 className="info-title">How rankings work?</h2>
                    <p className="info-text">Rankings are calculated based on a weighted score of your total Penq earned and your current daily streak. Keep learning to climb the ranks!</p>
                </div>
            </main>
            <PenqWidget />
        </div>
    );
}
