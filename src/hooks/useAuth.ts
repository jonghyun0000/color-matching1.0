import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

type State = { userId: string | null; role: 'user' | 'admin' | null; loading: boolean; init: () => Promise<void>; logout: () => Promise<void> };
export const useAuth = create<State>((set) => ({
  userId: null, role: null, loading: true,
  init: async () => {
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id ?? null;
    if (!userId) return set({ userId: null, role: null, loading: false });
    const { data: p } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle();
    set({ userId, role: (p?.role as 'user' | 'admin') ?? 'user', loading: false });
  },
  logout: async () => { await supabase.auth.signOut(); set({ userId: null, role: null }); }
}));
