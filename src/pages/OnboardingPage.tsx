import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Code, Zap, Building2, TrendingUp, BarChart3, Briefcase, BookOpen, CheckCircle, Lock, Star } from 'lucide-react';
import { PageTransition } from '@/components/shared/PageTransition';
import { TRACK_SKILL_QUESTIONS, TRACK_PATHS } from '@/data';
import { updateSession } from '@/lib/auth';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const tracks = [
    { id: "ml", icon: Brain, label: "Machine Learning & AI", desc: "Build intelligent systems that learn from data", color: "#F97316" },
    { id: "swe", icon: Code, label: "Software Engineering", desc: "Craft production-grade software and systems", color: "#A78BFA" },
    { id: "ee", icon: Zap, label: "Electrical Engineering", desc: "Design circuits, power and control systems", color: "#22D3EE" },
    { id: "ce", icon: Building2, label: "Civil & Structural", desc: "Engineer real-world infrastructure at scale", color: "#FB923C" },
    { id: "biz", icon: TrendingUp, label: "Business & Finance", desc: "Drive commercial decisions with data models", color: "#4ADE80" },
    { id: "data", icon: BarChart3, label: "Data Analytics", desc: "Turn raw data into actionable business insight", color: "#F472B6" },
  ];

  const goals = [
    { id: "job", icon: Briefcase, label: "Get a Job / Internship", desc: "Land your first industry role with real proof of work" },
    { id: "upskill", icon: TrendingUp, label: "Upskill for Current Role", desc: "Advance within your organisation with verified skills" },
    { id: "academic", icon: BookOpen, label: "Academic Project", desc: "Excel in coursework and build your portfolio" },
  ];

  const trackQuestions = selectedTrack ? TRACK_SKILL_QUESTIONS[selectedTrack] ?? [] : [];
  const trackPath = selectedTrack ? TRACK_PATHS[selectedTrack] ?? [] : [];
  const currentTrack = tracks.find(t => t.id === selectedTrack);

  const finishOnboarding = () => {
    updateSession({ onboarded: true, track: selectedTrack ?? undefined, goal: selectedGoal ?? undefined });
    navigate('/dashboard');
  };

  const handleNext = () => {
    if (step === 1 && !selectedTrack) return;
    if (step === 2 && answers.length < 5) return;
    if (step === 3 && !selectedGoal) return;
    if (step < 4) setStep(s => s + 1);
  };

  const handleAnswer = (val: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = val;
    setAnswers(newAnswers);
    if (currentQ < 4) {
      setCurrentQ(q => q + 1);
    } else {
      setStep(3);
    }
  };

  const levelLabels = ["Just starting out", "Some exposure", "Can do independently", "Could teach this"];
  const levelColors = ["#64748B", "#F59E0B", "#22D3EE", "#4ADE80"];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <div className="w-full h-1 bg-border">
          <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${(step / 4) * 100}%` }} />
        </div>
        <div className="text-center text-xs text-muted-foreground pt-2">Step {step} of 4</div>

        <div className="flex-1 flex flex-col relative pb-24">

          {step === 1 && (
            <div className="max-w-4xl mx-auto pt-16 px-8 w-full">
              <h1 className="font-display text-4xl font-bold text-center text-foreground">Choose Your Track</h1>
              <p className="text-muted-foreground text-center mt-2 mb-10">Select the domain you want to master — your simulations will be tailored to it</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {tracks.map(t => {
                  const isSelected = selectedTrack === t.id;
                  return (
                    <motion.div key={t.id} whileHover={{ y: -4 }} onClick={() => setSelectedTrack(t.id)}
                      className={`relative bg-card rounded-xl p-7 flex flex-col items-center text-center cursor-pointer transition-all border ${isSelected ? '' : 'border-border hover:border-muted-foreground/30'}`}
                      style={isSelected ? { borderColor: t.color, backgroundColor: `${t.color}08` } : {}}>
                      {isSelected && <CheckCircle className="absolute top-4 right-4 w-4 h-4 text-[#4ADE80]" />}
                      <t.icon className="w-11 h-11" style={{ color: isSelected ? t.color : '#64748B' }} />
                      <div className="font-display font-semibold mt-3 text-sm text-foreground">{t.label}</div>
                      <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{t.desc}</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-xl mx-auto pt-16 px-8 w-full">
              <div className="flex items-center justify-center gap-2 mb-4">
                {currentTrack && <currentTrack.icon className="w-5 h-5" style={{ color: currentTrack.color }} />}
                <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: currentTrack?.color ?? '#F97316' }}>
                  Assess Your {currentTrack?.label} Skills
                </span>
              </div>
              <div className="h-20 flex items-center justify-center mb-6">
                <AnimatePresence mode="wait">
                  <motion.h2 key={currentQ} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} transition={{ duration: 0.2 }}
                    className="font-display text-xl font-semibold text-center text-foreground">
                    {trackQuestions[currentQ]?.question}
                  </motion.h2>
                </AnimatePresence>
              </div>
              <div className="space-y-3">
                <AnimatePresence mode="wait">
                  {trackQuestions[currentQ]?.options.map((opt, i) => (
                    <motion.button key={`${currentQ}-${i}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                      onClick={() => handleAnswer(i + 1)}
                      className="w-full p-4 rounded-xl border border-border bg-card text-left hover:border-primary hover:bg-primary/06 transition-all group flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center border text-xs font-mono-data flex-shrink-0 transition-colors"
                        style={{ borderColor: levelColors[i], color: levelColors[i] }}>
                        {i + 1}
                      </div>
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{opt}</span>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
              <div className="flex justify-center gap-2 mt-8">
                {[0,1,2,3,4].map(q => (
                  <div key={q} className={`transition-all rounded-full ${q === currentQ ? 'w-6 h-2' : 'w-2 h-2'} ${q < currentQ ? 'bg-[#4ADE80]' : q === currentQ ? 'bg-primary' : 'bg-border'}`} />
                ))}
              </div>
              <div className="text-center text-xs text-muted-foreground mt-2">Question {currentQ + 1} of 5</div>
              <div className="mt-8 flex justify-center gap-4 flex-wrap">
                {levelLabels.map((l, i) => (
                  <div key={l} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <div className="w-2 h-2 rounded-full" style={{ background: levelColors[i] }} />
                    {l}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-4xl mx-auto pt-16 px-8 w-full">
              <h1 className="font-display text-4xl font-bold text-center text-foreground">What is Your Primary Goal?</h1>
              <p className="text-muted-foreground text-center mt-2 mb-12">Your path will be optimised for your objective</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {goals.map(g => {
                  const isSelected = selectedGoal === g.id;
                  return (
                    <motion.div key={g.id} whileHover={{ y: -4 }}
                      onClick={() => setSelectedGoal(g.id)}
                      className={`relative bg-card rounded-xl p-8 flex flex-col items-center text-center cursor-pointer transition-all border ${isSelected ? 'border-primary bg-primary/05' : 'border-border'}`}>
                      {isSelected && <CheckCircle className="absolute top-4 right-4 w-4 h-4 text-[#4ADE80]" />}
                      <g.icon className={`w-12 h-12 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div className="font-display font-semibold mt-4 text-lg text-foreground">{g.label}</div>
                      <div className="text-sm text-muted-foreground mt-2 leading-relaxed">{g.desc}</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="max-w-2xl mx-auto pt-16 px-8 w-full">
              <div className="flex items-center justify-center gap-2 mb-2">
                {currentTrack && <currentTrack.icon className="w-6 h-6" style={{ color: currentTrack.color }} />}
                <span className="text-sm font-mono-data uppercase tracking-widest" style={{ color: currentTrack?.color ?? '#F97316' }}>{currentTrack?.label}</span>
              </div>
              <h1 className="font-display text-4xl font-bold text-center text-foreground">Your Path is Ready</h1>
              <p className="text-muted-foreground text-center mt-2">Personalised to your track, skill level, and goal</p>

              <div className="relative max-w-lg mx-auto mt-12">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 opacity-30" style={{ background: currentTrack?.color ?? '#F97316' }} />
                <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }} className="space-y-0">
                  {trackPath.map((node: any, i: number) => (
                    <motion.div key={i} variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                      className="flex items-start gap-4 relative pl-12 pb-8">
                      <div className="absolute left-0 flex items-center justify-center w-8 h-8 rounded-full z-10 bg-background">
                        {node.state === 'completed' && <div className="w-full h-full rounded-full bg-[#4ADE80] flex items-center justify-center"><CheckCircle className="w-4 h-4 text-white" /></div>}
                        {node.state === 'current' && (
                          <div className="w-full h-full rounded-full flex items-center justify-center pulse-ring bg-background"
                            style={{ border: `2px solid ${currentTrack?.color ?? '#F97316'}` }}>
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: currentTrack?.color ?? '#F97316' }} />
                          </div>
                        )}
                        {node.state === 'locked' && <div className="w-full h-full rounded-full border-2 border-border flex items-center justify-center bg-background"><Lock className="w-3.5 h-3.5 text-muted-foreground" /></div>}
                        {node.state === 'final' && <div className="w-full h-full rounded-full bg-[#F59E0B] flex items-center justify-center"><Star className="w-4 h-4 text-white" /></div>}
                      </div>
                      <div className={`pt-0.5 ${node.state === 'final' ? 'pt-1' : ''}`}>
                        <div className={`font-display font-semibold text-sm ${node.state === 'locked' ? 'text-muted-foreground' : node.state === 'final' ? 'text-[#F59E0B]' : 'text-foreground'}`}>{node.title}</div>
                        {node.time && (
                          <div className="flex items-center gap-2 mt-0.5">
                            {node.diff && <span className="text-[10px] font-mono-data px-1.5 py-0.5 rounded" style={
                              node.diff === 'Beginner' ? { background: 'rgba(74,222,128,0.1)', color: '#4ADE80' } :
                              node.diff === 'Intermediate' ? { background: 'rgba(249,115,22,0.1)', color: '#F97316' } :
                              { background: 'rgba(248,113,113,0.1)', color: '#F87171' }
                            }>{node.diff}</span>}
                            <span className="text-xs text-muted-foreground">{node.time}</span>
                          </div>
                        )}
                        {node.state === 'current' && (
                          <div className="mt-1 text-[10px] font-mono-data px-2 py-0.5 rounded border inline-block" style={{ borderColor: `${currentTrack?.color ?? '#F97316'}40`, color: currentTrack?.color ?? '#F97316', background: `${currentTrack?.color ?? '#F97316'}10` }}>
                            ← You are here
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {answers.length > 0 && (
                <div className="mt-4 bg-card border border-border rounded-xl p-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Your Skill Snapshot</div>
                  <div className="space-y-2">
                    {trackQuestions.slice(0, 5).map((q: any, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="text-[10px] text-muted-foreground flex-1 truncate">{q.question.split(' ').slice(0,5).join(' ')}…</div>
                        <div className="flex gap-1">
                          {[1,2,3,4].map(l => (
                            <div key={l} className="w-4 h-1.5 rounded-full" style={{ background: (answers[i] ?? 0) >= l ? (levelColors[l-1]) : '#1E2530' }} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border px-8 py-4 flex justify-between items-center">
          {step > 1 && step < 4 && (
            <button onClick={() => { setStep(s => s - 1); if (step === 3) { setCurrentQ(0); setAnswers([]); } }}
              className="border border-border hover:bg-muted text-muted-foreground hover:text-foreground font-display px-6 py-2.5 rounded-xl text-sm transition-colors">
              ← Back
            </button>
          )}
          {step === 1 && <div />}

          {step < 3 && (
            <button onClick={handleNext} disabled={step === 1 && !selectedTrack}
              className={`ml-auto font-display font-semibold px-8 py-2.5 rounded-xl text-sm transition-all ${(step === 1 && !selectedTrack) ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}>
              {step === 1 ? 'Continue →' : 'Next →'}
            </button>
          )}
          {step === 3 && (
            <button onClick={handleNext} disabled={!selectedGoal}
              className={`ml-auto font-display font-semibold px-8 py-2.5 rounded-xl text-sm transition-all ${!selectedGoal ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}>
              Build My Path →
            </button>
          )}
          {step === 4 && (
            <button onClick={finishOnboarding} className="ml-auto bg-primary hover:bg-primary/90 text-primary-foreground font-display font-semibold px-10 py-3 rounded-xl text-sm transition-colors">
              Enter the Forge →
            </button>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
