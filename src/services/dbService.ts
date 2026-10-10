import type { AuthChangeEvent, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { BoardItem } from '../types/miro';
import { UserProfile, UserPlan } from '../types/auth';
import { loadBoards, saveBoards } from '../utils/storage';

const BOARDS_TABLE = 'boards';
const PROFILES_TABLE = 'profiles';

// --- Helpers ---

function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (m.includes('already registered')) return 'Este e-mail já está cadastrado. Faça login.';
  if (m.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar (verifique sua caixa de entrada).';
  if (m.includes('password should be')) return 'A senha deve conter pelo menos 6 caracteres.';
  if (m.includes('rate limit')) return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
  return message;
}

function defaultAvatar(name: string): string {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
}

function profileFromRow(row: any): UserProfile {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar: row.avatar || defaultAvatar(row.name),
    plan: row.plan,
    billingCycle: row.billing_cycle,
    company: row.company || '',
    createdAt: String(row.created_at).split('T')[0],
  };
}

function profileToRow(profile: UserProfile) {
  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    avatar: profile.avatar || null,
    company: profile.company || null,
    plan: profile.plan,
    billing_cycle: profile.billingCycle || 'monthly',
    updated_at: new Date().toISOString(),
  };
}

// Loads the profile row for a Supabase user, creating it on first login
async function getOrCreateProfile(user: SupabaseUser, fallbackPlan: UserPlan = 'pro'): Promise<UserProfile> {
  const meta = user.user_metadata || {};
  const name = meta.full_name || meta.name || user.email?.split('@')[0] || 'Usuário Diorfy';
  const fallback: UserProfile = {
    id: user.id,
    name,
    email: (user.email || '').toLowerCase(),
    avatar: meta.avatar_url || meta.picture || defaultAvatar(name),
    plan: (meta.plan as UserPlan) || fallbackPlan,
    billingCycle: 'monthly',
    company: 'Workspace Pessoal',
    createdAt: new Date().toISOString().split('T')[0],
  };

  if (!supabase) return fallback;

  const { data, error } = await supabase.from(PROFILES_TABLE).select('*').eq('id', user.id).maybeSingle();
  if (data) return profileFromRow(data);
  if (error) console.warn('Supabase profile fetch note:', error.message);

  const { error: insertError } = await supabase.from(PROFILES_TABLE).upsert(profileToRow(fallback));
  if (insertError) console.warn('Supabase profile create note:', insertError.message);
  return fallback;
}

function localOnlyProfile(email: string, name: string | undefined, plan: UserPlan): UserProfile {
  const displayName = name || email.split('@')[0] || 'Usuário Diorfy';
  return {
    id: `usr-${Date.now()}`,
    name: displayName,
    email: email.trim().toLowerCase(),
    avatar: defaultAvatar(displayName),
    plan,
    billingCycle: 'monthly',
    company: 'Workspace Diorfy',
    createdAt: new Date().toISOString().split('T')[0],
  };
}

// --- Authentication Services ---

export async function loginWithGoogle(): Promise<UserProfile> {
  if (!supabase) {
    throw new Error('Login com Google indisponível: Supabase não configurado.');
  }
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
  if (error) throw new Error(translateAuthError(error.message));

  // The browser is now redirecting to Google; after returning, subscribeToAuthChanges
  // picks up the session. Never resolve so the caller doesn't act in the meantime.
  return new Promise<UserProfile>(() => {});
}

export async function loginWithEmailOrGuest(
  email: string,
  password?: string,
  name?: string,
  isRegister: boolean = false,
  selectedPlan: UserPlan = 'pro'
): Promise<UserProfile> {
  const cleanEmail = email.trim().toLowerCase();

  if (!supabase) {
    return localOnlyProfile(cleanEmail, name, selectedPlan);
  }
  if (!password) {
    throw new Error('Informe sua senha.');
  }

  if (isRegister) {
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { full_name: name, plan: selectedPlan },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw new Error(translateAuthError(error.message));
    if (!data.session || !data.user) {
      throw new Error('Conta criada! Enviamos um link de confirmação para o seu e-mail. Confirme e depois faça login.');
    }
    return getOrCreateProfile(data.user, selectedPlan);
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
  if (error) throw new Error(translateAuthError(error.message));
  return getOrCreateProfile(data.user, selectedPlan);
}

export async function signOutUser(): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) console.warn('Logout note:', error.message);
}

export function subscribeToAuthChanges(
  callback: (user: UserProfile | null, event: AuthChangeEvent) => void
): () => void {
  if (!supabase) return () => {};

  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    // Supabase recommends not awaiting other Supabase calls inside this callback
    setTimeout(async () => {
      if (!session?.user) {
        callback(null, event);
        return;
      }
      callback(await getOrCreateProfile(session.user), event);
    }, 0);
  });

  return () => data.subscription.unsubscribe();
}

// --- Board Data Services ---

function boardToRow(board: BoardItem, userId: string) {
  return {
    owner_id: userId,
    id: board.id,
    title: (board.title || 'Sem título').slice(0, 200),
    data: board,
    updated_at: new Date().toISOString(),
  };
}

async function currentUserId(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

export function subscribeToUserBoards(
  userId: string,
  onBoardsUpdated: (boards: BoardItem[]) => void
): () => void {
  if (!supabase || !userId) {
    onBoardsUpdated(loadBoards());
    return () => {};
  }
  const client = supabase;
  let cancelled = false;

  const fetchBoards = async () => {
    const { data, error } = await client
      .from(BOARDS_TABLE)
      .select('data')
      .eq('owner_id', userId)
      .order('updated_at', { ascending: false });
    if (cancelled) return;

    if (error) {
      console.warn('Supabase boards fetch fallback to local storage:', error.message);
      onBoardsUpdated(loadBoards());
      return;
    }

    if (data.length === 0) {
      // First login for this user: upload the local boards (examples or work done offline) once
      const seededKey = `diorfy_seeded_${userId}`;
      const local = loadBoards();
      onBoardsUpdated(local);
      if (!localStorage.getItem(seededKey)) {
        localStorage.setItem(seededKey, '1');
        const { error: seedError } = await client.from(BOARDS_TABLE).upsert(local.map((b) => boardToRow(b, userId)));
        if (seedError) console.warn('Supabase seed note:', seedError.message);
      }
      return;
    }

    const remoteBoards = data.map((row: any) => row.data as BoardItem);
    saveBoards(remoteBoards);
    onBoardsUpdated(remoteBoards);
  };

  fetchBoards();

  const channel = client
    .channel(`boards-${userId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: BOARDS_TABLE, filter: `owner_id=eq.${userId}` },
      () => { fetchBoards(); }
    )
    .subscribe();

  return () => {
    cancelled = true;
    client.removeChannel(channel);
  };
}

export async function saveBoardToDb(board: BoardItem, userId?: string): Promise<void> {
  // 1. Update local storage instantly for zero-latency UX
  const localBoards = loadBoards();
  const existingIdx = localBoards.findIndex((b) => b.id === board.id);
  if (existingIdx !== -1) {
    localBoards[existingIdx] = board;
  } else {
    localBoards.unshift(board);
  }
  saveBoards(localBoards);

  // 2. Persist to Supabase (owner always comes from the real session, RLS enforces it)
  if (!supabase) return;
  const uid = await currentUserId();
  if (!uid) return;
  if (userId && userId !== uid) {
    console.warn('saveBoardToDb: userId diferente da sessão ativa, usando a sessão.');
  }

  const { error } = await supabase.from(BOARDS_TABLE).upsert(boardToRow(board, uid));
  if (error) console.warn('Supabase saveBoardToDb note:', error.message);
}

export async function deleteBoardFromDb(boardId: string): Promise<void> {
  saveBoards(loadBoards().filter((b) => b.id !== boardId));

  if (!supabase) return;
  const uid = await currentUserId();
  if (!uid) return;

  const { error } = await supabase.from(BOARDS_TABLE).delete().eq('owner_id', uid).eq('id', boardId);
  if (error) console.warn('Supabase deleteBoardFromDb note:', error.message);
}

export async function saveUserProfileToDb(profile: UserProfile): Promise<void> {
  if (!supabase) return;
  const uid = await currentUserId();
  if (!uid) return;

  const { error } = await supabase.from(PROFILES_TABLE).upsert(profileToRow({ ...profile, id: uid }));
  if (error) console.warn('Supabase saveUserProfileToDb note:', error.message);
}
