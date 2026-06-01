import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Play, Award, Trophy, Users, Settings, Sparkles, Send } from 'lucide-react';
import { Drawer } from 'vaul';
import { motion } from 'framer-motion';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi Arjun! I am FORGE, your AI mentor. Do you need help with your current simulation or learning path?' }
  ]);
  const [input, setInput] = useState('');

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: BookOpen, label: "My Learning Path", path: "/dashboard?tab=path" },
    { icon: Play, label: "Simulations", path: "/simulations" },
    { icon: Award, label: "My Credentials", path: "/credentials" },
    { icon: Trophy, label: "Leaderboard", path: "/leaderboard" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: Settings, label: "Settings", path: "/settings" }
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', text: "I'm analyzing your request. Since this is a demo, I don't have full intelligence wired yet, but keep up the great work in the Machine Learning track!" }]);
    }, 800);
  };

  return (
    <aside style={{ width: 240, position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 40, backgroundColor: '#111318', borderRight: '1px solid #1E2530', display: 'flex', flexDirection: 'column' }}>
      <div className="p-5 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-[#F97316] text-white flex items-center justify-center font-bold text-sm">FL</div>
        <span className="font-display font-bold text-white text-lg tracking-wide">FirstLight</span>
      </div>

      <div className="px-4 py-3 border-b border-[#1E2530]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F97316] text-white font-display font-bold flex items-center justify-center">AS</div>
          <div>
            <div className="text-white text-sm font-semibold">Arjun Sharma</div>
            <div className="text-[10px] uppercase font-mono-data text-[#F97316] bg-[rgba(249,115,22,0.1)] px-2 py-0.5 rounded-full inline-block mt-0.5">ML Student</div>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between items-center text-[10px] font-mono-data text-[#64748B] mb-1">
            <span>Level 4 — 2,340 XP</span>
          </div>
          <div className="w-full h-1 bg-[#1E2530] rounded-full overflow-hidden">
            <div className="h-full bg-[#F97316]" style={{ width: '78%' }} />
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <div
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm ${isActive ? 'bg-[rgba(249,115,22,0.06)] text-white border-l-[3px] border-[#F97316]' : 'text-[#64748B] hover:bg-[#181C23] hover:text-white border-l-[3px] border-transparent'}`}
            >
              <item.icon className="w-4 h-4" color={isActive ? '#F97316' : 'currentColor'} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#1E2530]">
        <Drawer.Root>
          <Drawer.Trigger asChild>
            <button className="w-full flex items-center justify-center gap-2 bg-[#181C23] hover:bg-[#1E2530] border border-[#1E2530] rounded-xl py-2.5 text-sm text-white transition-all cursor-pointer">
              <div className="w-2 h-2 rounded-full bg-[#22D3EE] pulse-cyan" />
              Ask FORGE
            </button>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
            <Drawer.Content className="bg-[#111318] border-t border-[#1E2530] flex flex-col rounded-t-[20px] h-[500px] mt-24 fixed bottom-0 left-0 right-0 z-50 focus:outline-none">
              <div className="p-4 bg-[#111318] border-b border-[#1E2530] rounded-t-[20px] flex items-center justify-center relative">
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-[#1E2530] mb-4" />
                <div className="absolute left-4 top-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#22D3EE] pulse-cyan" />
                  <span className="font-display font-semibold text-white">FORGE Assistant</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {messages.map((m, i) => (
                  <div key={i} className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${m.role === 'user' ? 'bg-[#F97316]/10 border border-[#F97316]/20 text-white self-end rounded-tr-sm' : 'bg-[#181C23] border border-[#1E2530] text-gray-200 self-start rounded-tl-sm'}`}>
                    {m.text}
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-[#1E2530] bg-[#0A0C0F]">
                <form onSubmit={handleSend} className="flex gap-2 max-w-3xl mx-auto">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask FORGE a question..."
                    className="flex-1 bg-[#111318] border border-[#1E2530] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#22D3EE]"
                  />
                  <button type="submit" className="bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-black px-4 py-2.5 rounded-lg flex items-center justify-center transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    </aside>
  );
}
