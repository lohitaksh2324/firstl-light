import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, GraduationCap, Briefcase, Users, Building2, Wallet, AlertCircle } from 'lucide-react';
import { PageTransition } from '@/components/shared/PageTransition';
import { register, login, getSession } from '@/lib/auth';

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [currentStat, setCurrentStat] = useState(0);
  const [activeTab, setActiveTab] = useState<'Sign In' | 'Sign Up'>('Sign In');
  const [selectedRole, setSelectedRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const stats = ["12,400+ Credentials Minted", "48 Industry Simulations", "Verified on Polygon Blockchain"];
  const tagline = "Where Skills Are Forged";

  useEffect(() => {
    const session = getSession();
    if (session?.authed) {
      navigate(session.onboarded ? '/dashboard' : '/onboarding', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentStat(p => (p + 1) % stats.length), 2500);
    return () => clearInterval(timer);
  }, [stats.length]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 300));

    if (activeTab === 'Sign Up') {
      if (!name.trim()) { setError('Full name is required.'); setLoading(false); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return; }
      const result = register(name.trim(), email, password, selectedRole);
      if (!result.success) { setError(result.error ?? 'Registration failed.'); setLoading(false); return; }
      navigate('/onboarding');
    } else {
      const result = login(email, password);
      if (!result.success) { setError(result.error ?? 'Login failed.'); setLoading(false); return; }
      const session = getSession();
      navigate(session?.onboarded ? '/dashboard' : '/onboarding');
    }
    setLoading(false);
  };

  const roles = [
    { id: "student", label: "Student", icon: GraduationCap },
    { id: "employer", label: "Employer", icon: Briefcase },
    { id: "mentor", label: "Mentor", icon: Users },
    { id: "institution", label: "Institution", icon: Building2 }
  ];

  return (
    <PageTransition>
      <div className="flex min-h-screen bg-[var(--fl-bg,#0A0C0F)]">
        <div className="hidden lg:flex w-[55%] relative overflow-hidden flex-col justify-center px-16">
          <div className="forge-blob w-[600px] h-[600px] -top-[100px] -left-[200px]" />
          <div className="circuit-blob w-[400px] h-[400px] -bottom-[100px] -right-[100px]" />
          <div className="bg-dot-grid absolute inset-0 opacity-50 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center">
              <Flame className="w-9 h-9 text-primary" />
              <h1 className="font-display font-bold text-[68px] text-foreground ml-3 leading-none">FirstLight</h1>
            </div>
            <div className="mt-4 flex flex-wrap text-[26px] font-display text-primary">
              {tagline.split('').map((char, i) => (
                <motion.span key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </div>
            <div className="mt-8 h-10">
              <AnimatePresence mode="wait">
                <motion.div key={currentStat} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="inline-block rounded-full border border-primary/30 bg-primary/06 px-5 py-2 font-mono-data text-sm text-foreground">
                  {stats[currentStat]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className="absolute bottom-8 left-16">
            <div className="uppercase tracking-widest text-xs text-muted-foreground mb-3">Trusted By Institutions</div>
            <div className="flex items-center gap-3">
              {[1,2,3,4].map(i => <div key={i} className="w-24 h-9 bg-white/4 border border-white/8 rounded-md" />)}
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-12 relative z-20">
          <div className="max-w-md w-full bg-card/88 backdrop-blur-[24px] border border-border rounded-2xl p-10">
            <div className="flex relative border-b border-border mb-6">
              {(['Sign In', 'Sign Up'] as const).map((tab) => (
                <button key={tab} className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === tab ? 'text-foreground' : 'text-muted-foreground'}`}
                  onClick={() => { setActiveTab(tab); setError(''); }}>
                  {tab}
                </button>
              ))}
              <motion.div className="absolute bottom-0 left-0 w-1/2 h-[2px] bg-primary"
                animate={{ x: activeTab === 'Sign In' ? 0 : '100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }} />
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleAuth}>
              {activeTab === 'Sign Up' && (
                <input type="text" placeholder="Full Name" required value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-background border border-border focus:border-primary rounded-lg px-4 py-3 text-foreground outline-none mb-3 transition-colors" />
              )}
              <input type="email" placeholder="Email address" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-background border border-border focus:border-primary rounded-lg px-4 py-3 text-foreground outline-none mb-3 transition-colors" />
              <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-background border border-border focus:border-primary rounded-lg px-4 py-3 text-foreground outline-none transition-colors" />

              {activeTab === 'Sign In' && (
                <div className="text-right mt-1">
                  <button type="button" className="text-primary text-sm hover:underline">Forgot password?</button>
                </div>
              )}

              {activeTab === 'Sign Up' && (
                <div className="mt-4">
                  <div className="text-sm text-muted-foreground mb-2">Select your role</div>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map(role => (
                      <div key={role.id} onClick={() => setSelectedRole(role.id)}
                        className={`p-3 rounded-lg border cursor-pointer flex flex-col items-center gap-1 transition-all ${selectedRole === role.id ? 'border-primary bg-primary/06 text-foreground' : 'border-border text-muted-foreground hover:border-primary/50'}`}>
                        <role.icon className="w-6 h-6" />
                        <span className="text-xs">{role.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading}
                className="w-full mt-6 bg-primary text-primary-foreground font-display font-semibold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60 transition-opacity">
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  activeTab === 'Sign In' ? 'Enter the Forge →' : 'Create Account →'
                )}
              </motion.button>
            </form>

            <div className="flex items-center gap-3 mt-6">
              <hr className="flex-1 border-border" />
              <span className="text-xs text-muted-foreground">or continue with</span>
              <hr className="flex-1 border-border" />
            </div>

            <div className="flex gap-2 mt-4">
              <button type="button" className="flex-1 py-2 rounded-lg border border-border hover:bg-muted flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors">
                <GoogleIcon /><span>Google</span>
              </button>
              <button type="button" className="flex-1 py-2 rounded-lg border border-border hover:bg-muted flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors">
                <LinkedInIcon /><span>LinkedIn</span>
              </button>
              <button type="button" className="flex-1 py-2 rounded-lg border border-primary/40 text-primary hover:bg-primary/10 flex items-center justify-center gap-2 text-sm transition-all">
                <Wallet className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
