import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { DOMAINS } from '../data/questionBank';
import { supabase } from '../lib/supabase';

/* ═══════════ Types ═══════════ */

export interface UserProfile {
    name: string;
    goal: string;
    blocker: string;
    onboardingDone: boolean;
    isPremium: boolean;
    language?: string;
}

export interface PentagonData {
    [domainId: string]: number; // 0-100 scale
}

export interface PentagonTheta {
    [domainId: string]: number; // -3 to +3
}

export interface EconomyState {
    balance: number;
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string | null;
    xp: number;
    level: number;
}

export interface ModuleProgress {
    moduleId: string;
    status: 'not_started' | 'in_progress' | 'completed';
    score?: number;
}

export interface PenqMessage {
    id: string;
    trigger: string;
    message: string;
    suggestedAction?: string;
    suggestedRoute?: string;
    emotion: 'neutral' | 'happy' | 'concerned' | 'proud' | 'curious';
    dismissed: boolean;
    timestamp: number;
}

export interface ActivityRecord {
    id: string;
    icon: string;
    text: string;
    time: string;
    timestamp: number;
    color: string;
}

export interface AppState {
    user: UserProfile;
    pentagon: PentagonData;
    pentagonTheta: PentagonTheta;
    economy: EconomyState;
    moduleProgress: ModuleProgress[];
    penqMessages: PenqMessage[];
    activityRecords: ActivityRecord[];
    calibrationDone: boolean;
    focusSession: {
        active: boolean;
        score: number;
        status: 'idle' | 'loading' | 'ready' | 'error';
        startTime: number | null;
        history: { time: string; score: number }[];
    };
    loading: boolean;
    syncStatus: 'idle' | 'syncing' | 'error' | 'offline';
}

/* ═══════════ Actions ═══════════ */

type Action =
    | { type: 'SET_USER'; payload: Partial<UserProfile> }
    | { type: 'COMPLETE_ONBOARDING' }
    | { type: 'SET_PENTAGON'; payload: PentagonData }
    | { type: 'SET_PENTAGON_THETA'; payload: PentagonTheta }
    | { type: 'UPDATE_PENTAGON_DOMAIN'; payload: { domainId: string; level: number; theta: number } }
    | { type: 'ADD_COINS'; payload: { amount: number; reason: string } }
    | { type: 'ADD_XP'; payload: { amount: number } }
    | { type: 'SPEND_COINS'; payload: { amount: number; reason: string } }
    | { type: 'INCREMENT_STREAK' }
    | { type: 'BREAK_STREAK' }
    | { type: 'SET_MODULE_PROGRESS'; payload: ModuleProgress }
    | { type: 'ADD_PENQ_MESSAGE'; payload: PenqMessage }
    | { type: 'DISMISS_PENQ_MESSAGE'; payload: string }
    | { type: 'ADD_ACTIVITY'; payload: Omit<ActivityRecord, 'id' | 'time' | 'timestamp'> }
    | { type: 'SET_CALIBRATION_DONE' }
    | { type: 'SET_LANGUAGE'; payload: string }
    | { type: 'START_FOCUS_SESSION' }
    | { type: 'STOP_FOCUS_SESSION' }
    | { type: 'UPDATE_FOCUS_SCORE'; payload: number }
    | { type: 'SET_FOCUS_STATUS'; payload: AppState['focusSession']['status'] }
    | { type: 'SET_SYNC_STATUS'; payload: AppState['syncStatus'] }
    | { type: 'FINISH_LOADING' };

/* ═══════════ Initial State ═══════════ */

const initialPentagon: PentagonData = {};
const initialTheta: PentagonTheta = {};
DOMAINS.forEach((d) => {
    initialPentagon[d.id] = 0;
    initialTheta[d.id] = 0;
});

const initialState: AppState = {
    user: {
        name: '',
        goal: '',
        blocker: '',
        onboardingDone: false,
        isPremium: false,
    },
    pentagon: initialPentagon,
    pentagonTheta: initialTheta,
    economy: {
        balance: 50, // starter bonus
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: null,
        xp: 0,
        level: 1,
    },
    moduleProgress: [],
    penqMessages: [],
    activityRecords: [],
    calibrationDone: false,
    focusSession: {
        active: false,
        score: 100,
        status: 'idle',
        startTime: null,
        history: [],
    },
    loading: true,
    syncStatus: 'idle',
};

const STORAGE_KEY = 'penq_app_state';

const getInitialState = (): AppState => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Robust migration merge
            return {
                ...initialState,
                ...parsed,
                user: { ...initialState.user, ...parsed.user },
                economy: { ...initialState.economy, ...parsed.economy },
                // Explicitly check for new nested objects
                focusSession: parsed.focusSession || initialState.focusSession,
                pentagon: parsed.pentagon || initialState.pentagon,
                pentagonTheta: parsed.pentagonTheta || initialState.pentagonTheta
            };
        } catch (e) {
            console.error('Failed to parse saved state', e);
        }
    }
    return initialState;
};

/* ═══════════ Reducer ═══════════ */

function appReducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: { ...state.user, ...action.payload } };
        case 'COMPLETE_ONBOARDING':
            return { ...state, user: { ...state.user, onboardingDone: true } };
        case 'SET_PENTAGON':
            return { ...state, pentagon: action.payload };
        case 'SET_PENTAGON_THETA':
            return { ...state, pentagonTheta: action.payload };
        case 'UPDATE_PENTAGON_DOMAIN':
            return {
                ...state,
                pentagon: { ...state.pentagon, [action.payload.domainId]: action.payload.level },
                pentagonTheta: { ...state.pentagonTheta, [action.payload.domainId]: action.payload.theta },
            };
        case 'ADD_COINS': {
            const newBalance = state.economy.balance + action.payload.amount;
            return { ...state, economy: { ...state.economy, balance: newBalance } };
        }
        case 'ADD_XP': {
            const newXp = state.economy.xp + action.payload.amount;
            let newLevel = state.economy.level;
            if (newXp >= 2000) newLevel = 5;
            else if (newXp >= 1000) newLevel = 4;
            else if (newXp >= 500) newLevel = 3;
            else if (newXp >= 200) newLevel = 2;
            else newLevel = 1;

            const hasLeveledUp = newLevel > state.economy.level;
            let penqMessages = state.penqMessages;
            if (hasLeveledUp) {
                const levelMsg: PenqMessage = {
                    id: `levelup-${Date.now()}`,
                    trigger: 'level_up',
                    message: `🌟 Level Up! You've reached Level ${newLevel}! Keep pushing your boundaries.`,
                    emotion: 'proud',
                    dismissed: false,
                    timestamp: Date.now(),
                };
                penqMessages = [levelMsg, ...penqMessages];
            }

            return {
                ...state,
                economy: { ...state.economy, xp: newXp, level: newLevel },
                penqMessages
            };
        }
        case 'SPEND_COINS': {
            const newBalance = Math.max(0, state.economy.balance - action.payload.amount);
            return { ...state, economy: { ...state.economy, balance: newBalance } };
        }
        case 'INCREMENT_STREAK': {
            const newStreak = state.economy.currentStreak + 1;
            return {
                ...state,
                economy: {
                    ...state.economy,
                    currentStreak: newStreak,
                    longestStreak: Math.max(state.economy.longestStreak, newStreak),
                    lastActiveDate: new Date().toISOString().split('T')[0],
                },
            };
        }
        case 'BREAK_STREAK':
            return { ...state, economy: { ...state.economy, currentStreak: 0 } };
        case 'SET_MODULE_PROGRESS': {
            const existing = state.moduleProgress.findIndex(
                (m) => m.moduleId === action.payload.moduleId
            );
            const newProgress = [...state.moduleProgress];
            if (existing >= 0) {
                newProgress[existing] = action.payload;
            } else {
                newProgress.push(action.payload);
            }
            return { ...state, moduleProgress: newProgress };
        }
        case 'ADD_PENQ_MESSAGE':
            return { ...state, penqMessages: [action.payload, ...state.penqMessages] };
        case 'DISMISS_PENQ_MESSAGE':
            return {
                ...state,
                penqMessages: state.penqMessages.map((m) =>
                    m.id === action.payload ? { ...m, dismissed: true } : m
                ),
            };
        case 'ADD_ACTIVITY': {
            const now = Date.now();
            const newActivity: ActivityRecord = {
                ...action.payload,
                id: Math.random().toString(36).substr(2, 9),
                time: 'Just now',
                timestamp: now,
            };
            return {
                ...state,
                activityRecords: [newActivity, ...state.activityRecords].slice(0, 20)
            };
        }
        case 'SET_CALIBRATION_DONE':
            return { ...state, calibrationDone: true };
        case 'SET_LANGUAGE':
            return { ...state, user: { ...state.user, language: action.payload } };
        case 'START_FOCUS_SESSION':
            return {
                ...state,
                focusSession: { active: true, score: 100, status: 'loading', startTime: Date.now(), history: [] }
            };
        case 'STOP_FOCUS_SESSION':
            return {
                ...state,
                focusSession: { ...state.focusSession, active: false, status: 'idle', startTime: null }
            };
        case 'SET_FOCUS_STATUS':
            return {
                ...state,
                focusSession: { ...state.focusSession, status: action.payload }
            };
        case 'UPDATE_FOCUS_SCORE': {
            const newHistory = [
                ...state.focusSession.history,
                { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), score: action.payload }
            ].slice(-20); // Keep last 20 points
            return {
                ...state,
                focusSession: { ...state.focusSession, score: action.payload, history: newHistory }
            };
        }
        case 'SET_SYNC_STATUS':
            return { ...state, syncStatus: action.payload };
        case 'FINISH_LOADING':
            return { ...state, loading: false };
        default:
            return state;
    }
}

/* ═══════════ Context ═══════════ */

interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, getInitialState());

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    // Initial Load / Sync
    useEffect(() => {
        const init = async () => {
            // Give system time to settle
            await new Promise(r => setTimeout(r, 500));
            dispatch({ type: 'FINISH_LOADING' });
        };
        init();
    }, []);

    useEffect(() => {
        const sync = async () => {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) {
                dispatch({ type: 'SET_SYNC_STATUS', payload: 'idle' });
                // We could set loading to false here if no saved state
                return;
            }

            // Sync with backend if possible
            try {
                const { data: { user: sbUser } } = await supabase.auth.getUser();
                if (sbUser) {
                    dispatch({ type: 'SET_SYNC_STATUS', payload: 'syncing' });
                    const { error } = await supabase
                        .from('profiles')
                        .upsert({
                            id: sbUser.id,
                            name: state.user.name,
                            goal: state.user.goal,
                            coins: state.economy.balance,
                            streak: state.economy.currentStreak,
                            xp: state.economy.xp,
                            level: state.economy.level,
                            pentagon: state.pentagon,
                            updated_at: new Date().toISOString(),
                        });

                    if (error) throw error;
                    dispatch({ type: 'SET_SYNC_STATUS', payload: 'idle' });
                }
            } catch (e) {
                console.error('Sync failed', e);
                dispatch({ type: 'SET_SYNC_STATUS', payload: 'error' });
            }
        };

        // Sync every 30 seconds if state changed meaningfully
        const interval = setInterval(sync, 30000);
        return () => clearInterval(interval);
    }, [state.user, state.economy.balance, state.pentagon]);

    return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
}
