export interface User {
  name: string;
  email: string;
  password: string;
  role: string;
  track?: string;
  goal?: string;
  onboarded: boolean;
  authed?: boolean;
}

function getUsers(): User[] {
  return JSON.parse(localStorage.getItem('fl_users') || '[]');
}

function saveUsers(users: User[]): void {
  localStorage.setItem('fl_users', JSON.stringify(users));
}

export function register(
  name: string,
  email: string,
  password: string,
  role: string
): { success: boolean; error?: string } {
  const users = getUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: 'An account with this email already exists.' };
  }
  const user: User = { name, email, password, role, onboarded: false };
  users.push(user);
  saveUsers(users);
  setSession(user);
  return { success: true };
}

export function login(
  email: string,
  password: string
): { success: boolean; error?: string } {
  const users = getUsers();
  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) {
    return { success: false, error: 'Invalid email or password.' };
  }
  setSession(user);
  return { success: true };
}

export function getSession(): (User & { authed: boolean }) | null {
  const s = localStorage.getItem('fl_auth');
  if (!s) return null;
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

export function setSession(user: User): void {
  localStorage.setItem('fl_auth', JSON.stringify({ ...user, authed: true }));
}

export function updateSession(updates: Partial<User>): void {
  const session = getSession();
  if (!session) return;
  const newSession = { ...session, ...updates };
  localStorage.setItem('fl_auth', JSON.stringify(newSession));
  const users = getUsers();
  const idx = users.findIndex(u => u.email === session.email);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updates };
    saveUsers(users);
  }
}

export function logout(): void {
  localStorage.removeItem('fl_auth');
}
