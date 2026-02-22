import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import type { PenqMessage } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import './PenqWidget.css';

// Technical Knowledge Base for Penq AI
const LANGUAGE_KNOWLEDGE: Record<string, { summary: string; facts: string[]; questions: { q: string; a: string }[] }> = {
    'javascript': {
        summary: "JavaScript is the engine of the web, enabling interactive interfaces and full-stack development with Node.js.",
        facts: [
            "JS was created in 10 days in 1995.",
            "Functions are first-class citizens in JS, meaning they can be passed as arguments.",
            "Modern JS uses V8 engine, which compiles code to machine code for speed."
        ],
        questions: [
            { q: "What is a Closure?", a: "A function that retains access to its lexical scope even when called outside that scope." },
            { q: "Difference between let and var?", a: "let is block-scoped, while var is function-scoped and hoisted." }
        ]
    },
    'python': {
        summary: "Python is a versatile, high-level language known for its readability and dominance in AI and Data Science.",
        facts: [
            "Python doesn't use braces; it uses indentation for logic blocks.",
            "It was named after Monty Python's Flying Circus, not the snake.",
            "Python is interpreted, making it great for rapid prototyping."
        ],
        questions: [
            { q: "What is a list comprehension?", a: "A concise way to create lists using a single line of code." },
            { q: "What does __init__ do?", a: "It's a constructor method that initializes an object's properties." }
        ]
    },
    'cpp': {
        summary: "C++ is a powerful system language that provides low-level memory control and high-level abstractions.",
        facts: [
            "C++ was developed by Bjarne Stroustrup as 'C with Classes'.",
            "It powers most high-end game engines like Unreal Engine.",
            "C++ supports multiple inheritance, unlike many modern languages."
        ],
        questions: [
            { q: "What is a pointer?", a: "A variable that stores the memory address of another variable." },
            { q: "What is RAII?", a: "Resource Acquisition Is Initialization—a pattern for resource management." }
        ]
    },
    'go': {
        summary: "Go (Golang) is built for cloud infrastructure, featuring simple syntax and native concurrency.",
        facts: [
            "Go was created at Google to solve complex distributed system issues.",
            "Goroutines are extremely lightweight, allowing millions of concurrent tasks.",
            "Go handles errors as values rather than using exceptions."
        ],
        questions: [
            { q: "What is a Goroutine?", a: "A lightweight thread managed by the Go runtime." },
            { q: "What is a Channel?", a: "A pipe that allows Goroutines to communicate safely." }
        ]
    },
    'rust': {
        summary: "Rust is a modern system language focused on memory safety without a garbage collector.",
        facts: [
            "Rust has been the 'most loved' language on Stack Overflow for years.",
            "The 'Borrow Checker' ensures memory safety at compile time.",
            "Rust compiles to highly efficient machine code via LLVM."
        ],
        questions: [
            { q: "What is Ownership?", a: "A set of rules that governs how Rust manages memory." },
            { q: "What is a Trait?", a: "A way to define shared behavior across different types." }
        ]
    }
};

export default function PenqWidget() {
    const { state, dispatch } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const [isChat, setIsChat] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [chatHistory, setChatHistory] = useState<{ type: 'ai' | 'user'; text: string }[]>([
        { type: 'ai', text: "Ready to master code today? I'm watching your progress in real-time. Ask me anything about your current session!" }
    ]);
    const navigate = useNavigate();
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    // Focus Nudge Logic
    useEffect(() => {
        if (state?.focusSession?.active && state?.focusSession?.score < 40) {
            const hasFocusNudge = state.penqMessages.some((m: PenqMessage) => m.trigger === 'low_focus' && !m.dismissed);
            if (!hasFocusNudge) {
                dispatch({
                    type: 'ADD_PENQ_MESSAGE',
                    payload: {
                        id: `focus-${Date.now()}`,
                        trigger: 'low_focus',
                        message: "Hey! You're drifting away. Focus back on the screen to keep your streak! 🐧👁️",
                        emotion: 'concerned',
                        dismissed: false,
                        timestamp: Date.now()
                    }
                });
            }
        }
    }, [state.focusSession.active, state.focusSession.score, state.penqMessages, dispatch]);

    const latestMessage = state.penqMessages.find((m: PenqMessage) => !m.dismissed);

    const handleDismiss = () => {
        if (latestMessage) {
            dispatch({ type: 'DISMISS_PENQ_MESSAGE', payload: latestMessage.id });
        }
        setIsOpen(false);
        setIsChat(false);
    };

    const handleAction = () => {
        if (latestMessage?.suggestedRoute) {
            navigate(latestMessage.suggestedRoute);
        }
        handleDismiss();
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMsg = inputValue.trim();
        setChatHistory((prev: { type: 'ai' | 'user'; text: string }[]) => [...prev, { type: 'user', text: userMsg }]);
        setInputValue('');

        // AI Response Logic
        setTimeout(() => {
            let aiText = "I see you're working hard! Keep going.";
            const q = userMsg.toLowerCase();
            const currentLang = state.user.language?.toLowerCase() || 'javascript';
            const langData = LANGUAGE_KNOWLEDGE[currentLang];

            // 1. Language Knowledge Queries
            if (q.includes('tell me about') || q.includes('what is') || q.includes('explain')) {
                if (q.includes('javascript') || (q.includes('this') && currentLang === 'javascript')) {
                    aiText = LANGUAGE_KNOWLEDGE['javascript'].summary;
                } else if (q.includes('python') || (q.includes('this') && currentLang === 'python')) {
                    aiText = LANGUAGE_KNOWLEDGE['python'].summary;
                } else if (q.includes('cpp') || q.includes('c++') || (q.includes('this') && currentLang === 'cpp')) {
                    aiText = LANGUAGE_KNOWLEDGE['cpp'].summary;
                } else if (q.includes('go') || (q.includes('this') && currentLang === 'go')) {
                    aiText = LANGUAGE_KNOWLEDGE['go'].summary;
                } else if (q.includes('rust') || (q.includes('this') && currentLang === 'rust')) {
                    aiText = LANGUAGE_KNOWLEDGE['rust'].summary;
                }
            }

            // 2. Quiz/Challenge Requests
            else if (q.includes('quiz') || q.includes('test') || q.includes('challenge') || q.includes('question')) {
                const randomQ = langData.questions[Math.floor(Math.random() * langData.questions.length)];
                aiText = `Challenge time! 🐧 **Question:** ${randomQ.q}\n\n*Thinking... (Tip: Answer: ${randomQ.a})*`;
            }

            // 3. Fun Facts
            else if (q.includes('fact') || q.includes('knowledge')) {
                const fact = langData.facts[Math.floor(Math.random() * langData.facts.length)];
                aiText = `Did you know? ${fact}`;
            }

            // 4. State & Focus Queries
            else if (q.includes('focus') || q.includes('doing') || q.includes('score')) {
                const score = state.focusSession.score;
                if (score > 80) aiText = `Your focus is rock solid at ${score}%! You're in the flow zone. ⚡`;
                else if (score > 50) aiText = `You're doing okay (${score}%), but I see a bit of distraction. Try to center your gaze! 👁️`;
                else aiText = `Honestly? You're struggling to stay focused (${score}%). Maybe take a breather? ☕`;
            } else if (q.includes('progress') || q.includes('stats')) {
                aiText = `You've got ${state.economy.balance} Penq coins and a ${state.economy.currentStreak} day streak. Your ${state.user.language} journey is looking promising!`;
            } else if (q.includes('hi') || q.includes('hello')) {
                aiText = `Greetings, Code Master! I'm your technical guide. Ask me for a **quiz**, a **fun fact**, or details about **${currentLang}**!`;
            }

            setChatHistory((prev: { type: 'ai' | 'user'; text: string }[]) => [...prev, { type: 'ai', text: aiText }]);
        }, 600);
    };

    const getEmotionEmoji = (emotion: string) => {
        switch (emotion) {
            case 'happy': return '😊';
            case 'proud': return '⭐';
            case 'concerned': return '🤔';
            case 'curious': return '❄️';
            default: return '🐧';
        }
    };

    const hasUnread = !!latestMessage && !isOpen;

    return (
        <div className="penq-widget-container">
            <AnimatePresence>
                {(isOpen || hasUnread) && (
                    <motion.div
                        className="penq-bubble glass-card-static"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    >
                        <div className="penq-bubble-header">
                            <span className="penq-bubble-emoji">
                                {isChat ? '🤖' : getEmotionEmoji(latestMessage?.emotion || 'default')}
                            </span>
                            <span className="penq-bubble-name">{isChat ? 'Penq AI' : 'Penq'}</span>
                            <button className="penq-bubble-close" onClick={handleDismiss}>✕</button>
                        </div>

                        {!isChat && latestMessage ? (
                            <>
                                <p className="penq-bubble-message">{latestMessage.message}</p>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {latestMessage.suggestedAction && (
                                        <button className="btn btn-secondary penq-bubble-action" onClick={handleAction}>
                                            {latestMessage.suggestedAction}
                                        </button>
                                    )}
                                    <button className="btn btn-ghost penq-bubble-action" onClick={() => setIsChat(true)}>
                                        Chat with AI
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="penq-chat-container">
                                <div className="penq-chat-history">
                                    {chatHistory.map((msg: { type: 'ai' | 'user'; text: string }, i: number) => (
                                        <div key={i} className={`chat-msg ${msg.type}`}>
                                            {msg.text}
                                        </div>
                                    ))}
                                    <div ref={chatEndRef} />
                                </div>
                                <div className="penq-chat-input-area">
                                    <input
                                        type="text"
                                        className="penq-input"
                                        placeholder="Ask Penq..."
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    />
                                    <button className="penq-send-btn" onClick={handleSend}>
                                        🏹
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                className={`penq-fab ${hasUnread ? 'has-notification' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <span className="penq-fab-emoji">🐧</span>
                {hasUnread && <span className="penq-fab-dot" />}
            </motion.button>
        </div>
    );
}
