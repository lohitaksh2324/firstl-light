import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Play, Award, Trophy, Users, Settings, Send, LogOut } from 'lucide-react';
import { Drawer } from 'vaul';
import { getSession, logout } from '@/lib/auth';

const TRACK_LABELS: Record<string, string> = {
  ml: 'ML Student', swe: 'SWE Student', ee: 'EE Student',
  ce: 'Civil Student', biz: 'Biz Student', data: 'Data Analyst',
};

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = getSession();

  const displayName = session?.name ?? 'Learner';
  const initials = displayName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const trackLabel = session?.track ? (TRACK_LABELS[session.track] ?? 'Student') : 'Student';
  const xp = 2340;
  const level = 4;

  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Hi ${displayName.split(' ')[0]}! I'm FORGE, your AI mentor. Ask me anything about your simulations or learning path.` }
  ]);
  const [input, setInput] = useState('');

  const navItems = [
    { icon: Home,     label: 'Dashboard',        path: '/dashboard' },
    { icon: BookOpen, label: 'My Learning Path',  path: '/dashboard?tab=path' },
    { icon: Play,     label: 'Simulations',       path: '/simulations' },
    { icon: Award,    label: 'My Credentials',    path: '/credentials' },
    { icon: Trophy,   label: 'Leaderboard',       path: '/leaderboard' },
    { icon: Users,    label: 'Community',          path: '/community' },
    { icon: Settings, label: 'Settings',           path: '/settings' },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', text: "Good question! Check the hints panel in your active simulation for targeted help. Keep pushing — you're doing great!" }]);
    }, 800);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside style={{ width: 240, position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 40, display: 'flex', flexDirection: 'column' }}
      className="bg-sidebar border-r border-sidebar-border">
      <div className="p-5 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">FL</div>
        <span className="font-display font-bold text-sidebar-foreground text-lg tracking-wide">FirstLight</span>
      </div>

      <div className="px-4 py-3 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-display font-bold flex items-center justify-center">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-sidebar-foreground text-sm font-semibold truncate">{displayName}</div>
            <div className="text-[10px] uppercase font-mono-data text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block mt-0.5">{trackLabel}</div>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between items-center text-[10px] font-mono-data text-muted-foreground mb-1">
            <span>Level {level} — {xp.toLocaleString()} XP</span>
          </div>
          <div className="w-full h-1 bg-sidebar-border rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: '78%' }} />
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = location.pathname === item.path.split('?')[0] ||
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path.split('?')[0]));
          return (
            <div key={item.label} onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm border-l-[3px] ${
                isActive
                  ? 'bg-primary/06 text-sidebar-foreground border-primary'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground border-transparent'}`}>
              <item.icon className="w-4 h-4" style={{ color: isActive ? 'hsl(var(--primary))' : 'currentColor' }} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Drawer.Root>
          <Drawer.Trigger asChild>
            <button className="w-full flex items-center justify-center gap-2 bg-sidebar-accent hover:bg-sidebar-accent/80 border border-sidebar-border rounded-xl py-2.5 text-sm text-sidebar-foreground transition-all cursor-pointer">
              <div className="w-2 h-2 rounded-full bg-[#22D3EE] pulse-cyan" />
              Ask FORGE
            </button>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
            <Drawer.Content className="bg-card border-t border-border flex flex-col rounded-t-[20px] h-[500px] mt-24 fixed bottom-0 left-0 right-0 z-50 focus:outline-none">
              <div className="p-4 bg-card border-b border-border rounded-t-[20px] flex items-center justify-center relative">
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-border mb-4" />
                <div className="absolute left-4 top-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#22D3EE] pulse-cyan" />
                  <span className="font-display font-semibold text-foreground">FORGE Assistant</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {messages.map((m, i) => (
                  <div key={i} className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${
                    m.role === 'user'
                      ? 'bg-primary/10 border border-primary/20 text-foreground self-end rounded-tr-sm'
                      : 'bg-muted border border-border text-foreground self-start rounded-tl-sm'}`}>
                    {m.text}
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border bg-background">
                <form onSubmit={handleSend} className="flex gap-2 max-w-3xl mx-auto">
                  <input type="text" value={input} onChange={e => setInput(e.target.value)}
                    placeholder="Ask FORGE a question..."
                    className="flex-1 bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors" />
                  <button type="submit" className="bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-black px-4 py-2.5 rounded-lg flex items-center justify-center transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>

        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl py-2 text-xs transition-colors">
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
