import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isRealUrl = (url: string) => url.startsWith('http');

export const supabase = (isRealUrl(supabaseUrl) && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createClient('https://placeholder-url.supabase.co', 'placeholder-key'); // Fallback to prevent crash

if (!isRealUrl(supabaseUrl) || !supabaseAnonKey) {
    console.warn('Supabase credentials missing or invalid. App will run in offline mode.');
}

export interface UserProfileDB {
    id: string;
    name: string;
    goal: string;
    coins: number;
    streak: number;
    pentagon: any;
    updated_at: string;
}
