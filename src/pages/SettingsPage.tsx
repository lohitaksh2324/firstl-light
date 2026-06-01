import { useState, useEffect } from 'react';
import { Palette, User, Bell, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageTransition } from '@/components/shared/PageTransition';
import { Switch } from '@/components/ui/switch';
import { getSession, updateSession, logout } from '@/lib/auth';
import { getThemePrefs, saveThemePrefs, applyTheme, type AccentHex, type ThemeMode } from '@/lib/theme';

const ACCENTS: { hex: AccentHex; label: string }[] = [
  { hex: '#F97316', label: 'Forge Orange' },
  { hex: '#22D3EE', label: 'Circuit Cyan' },
  { hex: '#4ADE80', label: 'Verify Green' },
  { hex: '#8B5CF6', label: 'Deep Purple' },
];

export default function SettingsPage({ isInline = false }: { isInline?: boolean }) {
  const navigate = useNavigate();
  const session = getSession();
  const [activeSection, setActiveSection] = useState('Appearance');
  const [themePrefs, setThemePrefs] = useState(getThemePrefs());
  const [name, setName] = useState(session?.name ?? '');
  const [email] = useState(session?.email ?? '');
  const [institution, setInstitution] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    applyTheme(themePrefs);
  }, [themePrefs]);

  const setMode = (mode: ThemeMode) => {
    const next = { ...themePrefs, mode };
    setThemePrefs(next);
    saveThemePrefs(next);
    applyTheme(next);
  };

  const setAccent = (accent: AccentHex) => {
    const next = { ...themePrefs, accent };
    setThemePrefs(next);
    saveThemePrefs(next);
    applyTheme(next);
  };

  const handleSaveAccount = () => {
    updateSession({ name: name.trim() || session?.name });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { icon: Palette, label: 'Appearance' },
    { icon: User, label: 'Account' },
    { icon: Bell, label: 'Notifications' },
    { icon: Shield, label: 'Privacy' },
  ];

  const content = (
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 ${isInline ? '' : 'p-6'}`}>
      <div className="md:col-span-1 bg-card border border-border rounded-xl p-2 h-fit space-y-1">
        {navItems.map(item => {
          const isActive = activeSection === item.label;
          return (
            <div key={item.label} onClick={() => setActiveSection(item.label)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-sm font-medium ${
                isActive ? 'bg-primary/08 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </div>
          );
        })}
        <div onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-sm font-medium text-destructive hover:bg-destructive/10 mt-2">
          <LogOut className="w-4 h-4" />
          Sign Out
        </div>
      </div>

      <div className="md:col-span-3 bg-card border border-border rounded-xl p-6 md:p-8 min-h-[400px]">
        <h2 className="font-display font-bold text-xl text-foreground mb-6">{activeSection}</h2>

        {activeSection === 'Appearance' && (
          <div className="space-y-8 max-w-lg">
            <div className="flex justify-between items-center pb-6 border-b border-border">
              <div>
                <div className="font-medium text-foreground text-sm">Light Mode</div>
                <div className="text-xs text-muted-foreground mt-1">Switch between dark and light themes.</div>
              </div>
              <Switch
                checked={themePrefs.mode === 'light'}
                onCheckedChange={(v) => setMode(v ? 'light' : 'dark')}
              />
            </div>

            <div>
              <div className="font-medium text-foreground text-sm mb-1">Accent Color</div>
              <div className="text-xs text-muted-foreground mb-4">Changes the primary action color throughout the app.</div>
              <div className="flex gap-4 flex-wrap">
                {ACCENTS.map(({ hex, label }) => (
                  <button key={hex} onClick={() => setAccent(hex)}
                    title={label}
                    className={`relative w-8 h-8 rounded-full transition-all hover:scale-110 ${themePrefs.accent === hex ? 'ring-2 ring-offset-2 ring-offset-card scale-110' : ''}`}
                    style={{ backgroundColor: hex, '--tw-ring-color': hex } as React.CSSProperties}>
                    {themePrefs.accent === hex && (
                      <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: themePrefs.accent }} />
                <span className="text-xs text-muted-foreground">{ACCENTS.find(a => a.hex === themePrefs.accent)?.label ?? 'Custom'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="text-xs text-muted-foreground mb-3">Preview</div>
              <div className="flex gap-3 flex-wrap">
                <button className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-lg transition-colors">Primary Button</button>
                <button className="border border-primary text-primary text-xs font-semibold px-4 py-2 rounded-lg transition-colors">Outline</button>
                <span className="text-xs px-3 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20">Badge</span>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'Account' && (
          <div className="space-y-5 max-w-lg">
            <div>
              <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full bg-background border border-border focus:border-primary rounded-lg px-4 py-2.5 text-sm text-foreground outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">Email Address</label>
              <input type="email" value={email} readOnly
                className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-sm text-muted-foreground outline-none cursor-not-allowed" />
              <p className="text-[10px] text-muted-foreground mt-1">Email cannot be changed.</p>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">Institution / Company</label>
              <input type="text" value={institution} onChange={e => setInstitution(e.target.value)} placeholder="e.g. IIT Bombay"
                className="w-full bg-background border border-border focus:border-primary rounded-lg px-4 py-2.5 text-sm text-foreground outline-none transition-colors" />
            </div>
            <button onClick={handleSaveAccount}
              className={`mt-2 font-display font-semibold px-6 py-2.5 rounded-lg text-sm transition-all ${saved ? 'bg-[#4ADE80] text-white' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}>
              {saved ? '✓ Saved!' : 'Save Changes'}
            </button>
          </div>
        )}

        {activeSection === 'Notifications' && (
          <div className="space-y-0 max-w-lg divide-y divide-border">
            {[
              { label: 'Simulation updates', desc: 'When new stages are unlocked or graded', checked: true },
              { label: 'Credential minting', desc: 'When a new credential is confirmed on-chain', checked: true },
              { label: 'Leaderboard alerts', desc: 'When your global rank changes significantly', checked: false },
              { label: 'Community mentions', desc: 'When someone replies to your comment', checked: true },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-4">
                <div>
                  <div className="font-medium text-foreground text-sm">{item.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{item.desc}</div>
                </div>
                <Switch defaultChecked={item.checked} />
              </div>
            ))}
          </div>
        )}

        {activeSection === 'Privacy' && (
          <div className="space-y-6 max-w-lg">
            <div className="bg-background border border-border rounded-xl p-5">
              <div className="font-display font-semibold text-foreground mb-1">Wallet Connection</div>
              <div className="text-xs text-muted-foreground mb-4">Your connected Web3 wallet for receiving credentials.</div>
              <div className="flex justify-between items-center bg-card border border-border rounded-lg px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#4ADE80] shadow-[0_0_8px_#4ADE80]" />
                  <span className="font-mono-data text-sm text-foreground">0x1a2b...abcd</span>
                </div>
                <button className="border border-destructive/50 text-destructive hover:bg-destructive/10 text-xs px-3 py-1.5 rounded transition-colors font-medium">
                  Disconnect
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center py-4 border-b border-border">
              <div>
                <div className="font-medium text-foreground text-sm">Public Profile</div>
                <div className="text-xs text-muted-foreground mt-1">Allow others to see your credentials and rank.</div>
              </div>
              <Switch defaultChecked={true} />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isInline) return content;

  return (
    <AppLayout>
      <PageTransition>
        <div className="pb-12">
          <div className="px-6 py-5 border-b border-border bg-background sticky top-0 z-30">
            <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
          </div>
          {content}
        </div>
      </PageTransition>
    </AppLayout>
  );
}
