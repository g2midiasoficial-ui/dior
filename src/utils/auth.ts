import { UserProfile, UserPlan } from '../types/auth';

const USER_SESSION_KEY = 'diorfy_user_session_v2';

export function getCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.id && parsed.email) {
      return parsed;
    }
    return null;
  } catch (e) {
    return null;
  }
}

export function saveCurrentUser(user: UserProfile | null): void {
  try {
    if (!user) {
      localStorage.removeItem(USER_SESSION_KEY);
    } else {
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    }
  } catch (e) {
    console.error('Failed to save user session', e);
  }
}

export function logoutUser(): void {
  try {
    localStorage.removeItem(USER_SESSION_KEY);
  } catch (e) {
    console.error('Failed to clear user session', e);
  }
}

export function updateUserPlan(plan: UserPlan, billingCycle: 'monthly' | 'annual' = 'monthly'): UserProfile | null {
  const current = getCurrentUser();
  if (!current) return null;
  const updated: UserProfile = {
    ...current,
    plan,
    billingCycle,
  };
  saveCurrentUser(updated);
  return updated;
}
