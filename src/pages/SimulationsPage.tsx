import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Clock, Zap, CheckCircle, Lock, Users } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageTransition } from '@/components/shared/PageTransition';
import { SIMULATIONS, Simulation } from '@/data';

export default function SimulationsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTrack, setActiveTrack] = useState('All');
  const [activeDifficulty, setActiveDifficulty] = useState('All');
  const [activeStatus, setActiveStatus] = useState('All');

  const filteredSims = SIMULATIONS.filter((sim) => {
    const matchesSearch = sim.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sim.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Map internal track names if needed, or exact match
    const trackMap: Record<string, string> = {
      "ML": "Machine Learning",
      "Business": "Business & Finance",
      "Electrical": "Electrical Engineering",
      "SWE": "Software Engineering",
      "Civil": "Civil Engineering"
    };
    
    const matchesTrack = activeTrack === 'All' || sim.track.includes(trackMap[activeTrack] || activeTrack);
    const matchesDiff = activeDifficulty === 'All' || sim.difficulty === activeDifficulty;
    
    let matchesStatus = true;
    if (activeStatus === 'Available') matchesStatus = sim.status === 'available';
    if (activeStatus === 'In Progress') matchesStatus = sim.status === 'in-progress';
    if (activeStatus === 'Locked') matchesStatus = sim.status === 'locked';
    if (activeStatus === 'Completed') matchesStatus = sim.status === 'completed';

    return matchesSearch && matchesTrack && matchesDiff && matchesStatus;
  });

  return (
    <AppLayout>
      <PageTransition>
        <div className="pb-12">
          
          {/* Header & Filters */}
          <div className="px-6 py-6 border-b border-[#1E2530] bg-[#0A0C0F] sticky top-0 z-30">
            <h1 className="font-display text-2xl font-bold text-white">Simulations Catalog</h1>
            
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] w-[18px] h-[18px]" />
              <input
                type="text"
                placeholder="Search by title, skill, or tool..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111318] border border-[#1E2530] focus:border-[#F97316] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#64748B] outline-none transition-colors"
              />
            </div>

            <div className="mt-5 flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-[#64748B] uppercase tracking-widest mr-2 w-20">Track</span>
                {["All", "ML", "Business", "Electrical", "SWE", "Civil"].map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTrack(t)}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                      activeTrack === t 
                        ? 'bg-[#F97316] text-white' 
                        : 'bg-[#111318] border border-[#1E2530] text-[#94A3B8] hover:border-[#F97316]/50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-[#64748B] uppercase tracking-widest mr-2 w-20">Difficulty</span>
                {["All", "Beginner", "Intermediate", "Advanced"].map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveDifficulty(t)}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                      activeDifficulty === t 
                        ? 'bg-[#F97316] text-white' 
                        : 'bg-[#111318] border border-[#1E2530] text-[#94A3B8] hover:border-[#F97316]/50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-[#64748B] uppercase tracking-widest mr-2 w-20">Status</span>
                {["All", "Available", "In Progress", "Completed", "Locked"].map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveStatus(t)}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                      activeStatus === t 
                        ? 'bg-[#F97316] text-white' 
                        : 'bg-[#111318] border border-[#1E2530] text-[#94A3B8] hover:border-[#F97316]/50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="p-6">
            {filteredSims.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-[#64748B] mb-2">No simulations found matching your criteria.</div>
                <button onClick={() => {setSearchQuery(''); setActiveTrack('All'); setActiveDifficulty('All'); setActiveStatus('All');}} className="text-[#F97316] text-sm hover:underline">Clear filters</button>
              </div>
            ) : (
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {filteredSims.map((sim) => (
                  <motion.div
                    key={sim.id}
                    variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                    whileHover={{ y: -4 }}
                    className="bg-[#111318] border border-[#1E2530] hover:border-[#F97316]/50 rounded-xl overflow-hidden relative group flex flex-col h-full"
                  >
                    <div className="h-1 w-full" style={{ backgroundColor: sim.trackColor }} />
                    
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono-data border" style={{ backgroundColor: `${sim.trackColor}15`, color: sim.trackColor, borderColor: `${sim.trackColor}30` }}>
                          {sim.track}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                          sim.difficulty === 'Beginner' ? 'bg-[#4ADE80]/10 text-[#4ADE80]' : 
                          sim.difficulty === 'Intermediate' ? 'bg-[#F97316]/10 text-[#F97316]' : 
                          'bg-[#F59E0B]/10 text-[#F59E0B]'
                        }`}>
                          {sim.difficulty}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-lg mt-3 text-white leading-tight">{sim.title}</h3>
                      <p className="text-sm text-[#94A3B8] mt-2 line-clamp-2 leading-relaxed flex-1">{sim.description}</p>

                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {sim.skills.map(skill => (
                          <span key={skill} className="bg-[#181C23] border border-[#1E2530] px-2 py-0.5 text-[10px] font-mono-data rounded text-[#94A3B8]">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-between items-end mt-5 pt-4 border-t border-[#1E2530]">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-3 text-xs text-[#64748B]">
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {sim.durationHours}h</span>
                            <span className="flex items-center gap-1 text-[#F97316] font-mono-data"><Zap className="w-3.5 h-3.5" /> {sim.xpReward} XP</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
                            <span className="text-[10px] text-[#4ADE80]">{sim.activeStudents} active</span>
                          </div>
                        </div>

                        <div>
                          {sim.status === 'in-progress' && (
                            <button onClick={() => navigate(`/simulations/${sim.id}`)} className="bg-[#F97316] hover:bg-[#F97316]/90 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                              Resume →
                            </button>
                          )}
                          {sim.status === 'available' && (
                            <button onClick={() => navigate(`/simulations/${sim.id}`)} className="bg-[#F97316] hover:bg-[#F97316]/90 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                              Start →
                            </button>
                          )}
                          {sim.status === 'completed' && (
                            <button className="bg-[#4ADE80]/10 border border-[#4ADE80]/20 text-[#4ADE80] text-xs font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-default">
                              <CheckCircle className="w-3.5 h-3.5" /> Completed
                            </button>
                          )}
                          {sim.status === 'locked' && (
                            <button className="bg-[#181C23] border border-[#1E2530] text-[#64748B] text-xs font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-not-allowed">
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
