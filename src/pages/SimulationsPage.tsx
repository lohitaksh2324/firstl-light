import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Clock, Zap, CheckCircle, Lock, Users } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageTransition } from '@/components/shared/PageTransition';
import { SIMULATIONS } from '@/data';
import { getSession } from '@/lib/auth';

const TRACK_ID_TO_SIM_TRACK: Record<string, string[]> = {
  ml:   ['Machine Learning', 'Machine Learning & AI'],
  swe:  ['Software Engineering'],
  ee:   ['Electrical Engineering'],
  ce:   ['Civil Engineering', 'Civil & Structural'],
  biz:  ['Business & Finance', 'Business'],
  data: ['Data Visualization', 'Data Analytics'],
};

export default function SimulationsPage() {
  const navigate = useNavigate();
  const session = getSession();

  const defaultTrack = useMemo(() => {
    if (!session?.track) return 'All';
    const trackId = session.track;
    const mapped = TRACK_ID_TO_SIM_TRACK[trackId];
    if (!mapped) return 'All';
    const simNames: Record<string, string> = {
      ml: 'ML', swe: 'SWE', ee: 'Electrical', ce: 'Civil', biz: 'Business', data: 'Analytics'
    };
    return simNames[trackId] ?? 'All';
  }, [session?.track]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTrack, setActiveTrack] = useState(defaultTrack);
  const [activeDifficulty, setActiveDifficulty] = useState('All');
  const [activeStatus, setActiveStatus] = useState('All');

  const filteredSims = SIMULATIONS.filter((sim) => {
    const matchesSearch =
      sim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sim.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const trackMap: Record<string, string[]> = {
      'ML':        ['Machine Learning', 'Machine Learning & AI'],
      'Business':  ['Business & Finance', 'Business'],
      'Electrical':['Electrical Engineering'],
      'SWE':       ['Software Engineering'],
      'Civil':     ['Civil Engineering', 'Civil & Structural'],
      'Analytics': ['Data Visualization', 'Data Analytics'],
    };

    const matchesTrack =
      activeTrack === 'All' ||
      (trackMap[activeTrack] ?? []).some(t => sim.track.includes(t));

    const matchesDiff = activeDifficulty === 'All' || sim.difficulty === activeDifficulty;

    let matchesStatus = true;
    if (activeStatus === 'Available')   matchesStatus = sim.status === 'available';
    if (activeStatus === 'In Progress') matchesStatus = sim.status === 'in-progress';
    if (activeStatus === 'Locked')      matchesStatus = sim.status === 'locked';
    if (activeStatus === 'Completed')   matchesStatus = sim.status === 'completed';

    return matchesSearch && matchesTrack && matchesDiff && matchesStatus;
  });

  const tracks = ['All', 'ML', 'Business', 'Electrical', 'SWE', 'Civil', 'Analytics'];

  return (
    <AppLayout>
      <PageTransition>
        <div className="pb-12">
          <div className="px-6 py-6 border-b border-border bg-background sticky top-0 z-30">
            <div className="flex items-center justify-between">
              <h1 className="font-display text-2xl font-bold text-foreground">Simulations Catalog</h1>
              {session?.track && (
                <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
                  Showing your track first
                </span>
              )}
            </div>

            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-[18px] h-[18px]" />
              <input type="text" placeholder="Search by title, skill, or tool..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card border border-border focus:border-primary rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors" />
            </div>

            <div className="mt-5 flex flex-col gap-4">
              {[
                { label: 'Track', items: tracks, active: activeTrack, set: setActiveTrack },
                { label: 'Difficulty', items: ['All', 'Beginner', 'Intermediate', 'Advanced'], active: activeDifficulty, set: setActiveDifficulty },
                { label: 'Status', items: ['All', 'Available', 'In Progress', 'Completed', 'Locked'], active: activeStatus, set: setActiveStatus },
              ].map(({ label, items, active, set }) => (
                <div key={label} className="flex flex-wrap items-center gap-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-widest mr-2 w-20">{label}</span>
                  {items.map(t => (
                    <button key={t} onClick={() => set(t)}
                      className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                        active === t ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:border-primary/50'
                      }`}>
                      {t}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">
            {filteredSims.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-muted-foreground mb-2">No simulations found matching your criteria.</div>
                <button onClick={() => { setSearchQuery(''); setActiveTrack('All'); setActiveDifficulty('All'); setActiveStatus('All'); }}
                  className="text-primary text-sm hover:underline">Clear filters</button>
              </div>
            ) : (
              <motion.div initial="hidden" animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredSims.map((sim) => (
                  <motion.div key={sim.id}
                    variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                    whileHover={{ y: -4 }}
                    className="bg-card border border-border hover:border-primary/50 rounded-xl overflow-hidden relative group flex flex-col h-full transition-colors">
                    <div className="h-1 w-full" style={{ backgroundColor: sim.trackColor }} />
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono-data border"
                          style={{ backgroundColor: `${sim.trackColor}15`, color: sim.trackColor, borderColor: `${sim.trackColor}30` }}>
                          {sim.track}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                          sim.difficulty === 'Beginner' ? 'bg-[#4ADE80]/10 text-[#4ADE80]' :
                          sim.difficulty === 'Intermediate' ? 'bg-[#F97316]/10 text-[#F97316]' :
                          'bg-[#F59E0B]/10 text-[#F59E0B]'}`}>
                          {sim.difficulty}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-lg mt-3 text-foreground leading-tight">{sim.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed flex-1">{sim.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {sim.skills.map(skill => (
                          <span key={skill} className="bg-muted border border-border px-2 py-0.5 text-[10px] font-mono-data rounded text-muted-foreground">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-end mt-5 pt-4 border-t border-border">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {sim.durationHours}h</span>
                            <span className="flex items-center gap-1 text-primary font-mono-data"><Zap className="w-3.5 h-3.5" /> {sim.xpReward} XP</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
                            <span className="text-[10px] text-[#4ADE80]">{sim.activeStudents} active</span>
                          </div>
                        </div>
                        <div>
                          {(sim.status === 'in-progress' || sim.status === 'available') && (
                            <button onClick={() => navigate(`/simulations/${sim.id}`)}
                              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                              {sim.status === 'in-progress' ? 'Resume →' : 'Start →'}
                            </button>
                          )}
                          {sim.status === 'completed' && (
                            <button className="bg-[#4ADE80]/10 border border-[#4ADE80]/20 text-[#4ADE80] text-xs font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-default">
                              <CheckCircle className="w-3.5 h-3.5" /> Completed
                            </button>
                          )}
                          {sim.status === 'locked' && (
                            <button className="bg-muted border border-border text-muted-foreground text-xs font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-not-allowed">
                              <Lock className="w-3.5 h-3.5" /> Locked
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
