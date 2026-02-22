import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

interface FloatingReward {
    id: string;
    text: string;
    color: string;
}

export default function RewardVisualizer() {
    const { state } = useApp();
    const [rewards, setRewards] = useState<FloatingReward[]>([]);
    const [lastBalance, setLastBalance] = useState(state.economy.balance);
    const [lastXp, setLastXp] = useState(state.economy.xp);

    useEffect(() => {
        // Detect Coin changes
        if (state.economy.balance > lastBalance) {
            const diff = state.economy.balance - lastBalance;
            addReward(`+${diff} 💰`, 'var(--amber)');
        }
        setLastBalance(state.economy.balance);

        // Detect XP changes
        if (state.economy.xp > lastXp) {
            const diff = state.economy.xp - lastXp;
            addReward(`+${diff} XP`, 'var(--cyan)');
        }
        setLastXp(state.economy.xp);
    }, [state.economy.balance, state.economy.xp]);

    const addReward = (text: string, color: string) => {
        const id = Math.random().toString(36).substr(2, 9);
        setRewards(prev => [...prev, { id, text, color }]);
        setTimeout(() => {
            setRewards(prev => prev.filter(r => r.id !== id));
        }, 1500);
    };

    return (
        <div className="reward-visualizer-container" style={{ position: 'fixed', bottom: '150px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: 9999 }}>
            <AnimatePresence>
                {rewards.map(reward => (
                    <motion.div
                        key={reward.id}
                        initial={{ opacity: 0, y: 0, scale: 0.5 }}
                        animate={{ opacity: 1, y: -100, scale: 1.2 }}
                        exit={{ opacity: 0, y: -150 }}
                        className="reward-float"
                        style={{ color: reward.color, textAlign: 'center' }}
                    >
                        {reward.text}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
