import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, TrendingUp, Award, CheckCircle, Trophy, Flame, ExternalLink, Lock } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageTransition } from '@/components/shared/PageTransition';
import { SkillRadar } from '@/components/shared/SkillRadar';
import { USER } from '@/data';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [expandedNode, setExpandedNode] = useState<string | null>("sim-001");

  return (
    <AppLayout>
      <PageTransition>
        <div className="pb-12">
          {/* Top Bar */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-[#1E2530] sticky top-0 bg-[#0A0C0F]/95 backdrop-blur z-30">
            <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
            <div className="flex items-center gap-3">
              <button className="text-[#64748B] hover:text-white transition-colors p-2">
                <Bell className="w-[22px] h-[22px]" />
              </button>
              <button className="text-[#64748B] hover:text-white transition-colors p-2">
                <Search className="w-[22px] h-[22px]" />
              </button>
              <div className="flex items-center gap-1.5 bg-[rgba(249,115,22,0.12)] border border-[rgba(249,115,22,0.2)] rounded-full px-3 py-1 ml-2">
                <Flame className="w-3.5 h-3.5 text-[#F97316]" />
                <span className="text-sm text-[#F97316] font-mono-data">{USER.streak} day streak</span>
              </div>
            </div>
          </div>

          {/* Hero Card */}
          <div className="mx-6 mt-5 relative overflow-hidden rounded-2xl border border-[#1E2530] p-6 bg-[#111318]">
            <div className="forge-blob absolute w-72 h-72 -top-[60px] -right-[40px]" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[rgba(249,115,22,0.04)] pointer-events-none" />
            
            <div className="relative z-10">
              <div className="uppercase text-xs tracking-widest text-[#64748B] mb-1">Continue Where You Left Off</div>
              <h2 className="font-display text-2xl font-bold text-white">Patient Readmission Predictor</h2>
              
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-[#F97316]/10 text-[#F97316] px-2 py-0.5 rounded-full border border-[#F97316]/20">Machine Learning</span>
                <span className="text-xs bg-[#1E2530] text-[#94A3B8] px-2 py-0.5 rounded-full border border-white/5">42% complete</span>
              </div>

              <div className="mt-4 max-w-md">
                <div className="w-full h-1.5 bg-[#1E2530] rounded-full overflow-hidden">
                  <div className="h-full bg-[#F97316] w-[42%] rounded-full" />
                </div>
                <div className="text-xs text-[#64748B] mt-2">Last active 2 hours ago</div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/simulations/sim-001')}
                className="mt-5 bg-[#F97316] hover:bg-[#F97316]/90 text-white font-display font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
              >
                Resume Simulation →
              </motion.button>
            </div>
          </div>

          {/* Stats Row */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mx-6 mt-5"
          >
            {[
              { val: "2,340", label: "Total XP", icon: TrendingUp, color: "#F97316" },
              { val: "3", label: "Credentials", icon: Award, color: "#4ADE80" },
              { val: "5", label: "Simulations", icon: CheckCircle, color: "#22D3EE" },
              { val: "#1,204", label: "Global Rank", icon: Trophy, color: "#F8FAFC" }
            ].map((stat, i) => (
              <motion.div key={i} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} className="bg-[#111318] border border-[#1E2530] rounded-xl p-5 flex justify-between items-start">
                <div>
                  <div className="font-display text-3xl font-bold" style={{ color: stat.color }}>{stat.val}</div>
                  <div className="text-sm text-[#64748B] mt-1">{stat.label}</div>
                </div>
                <div className="p-2 rounded-lg" style={{ backgroundColor: `rgba(${stat.color === '#F8FAFC' ? '255,255,255' : stat.color === '#F97316' ? '249,115,22' : stat.color === '#4ADE80' ? '74,222,128' : '34,211,238'},0.1)` }}>
                  <stat.icon className="w-[22px] h-[22px]" color={stat.color} />
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mx-6 mt-6">
            {/* Left Col */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-end mb-4">
                <h3 className="font-display font-semibold text-lg text-white">My Learning Path</h3>
                <button className="text-sm text-[#22D3EE] hover:underline">View all →</button>
              </div>

              <div className="relative border-l-2 border-[#1E2530] ml-3 pl-6 space-y-1 py-2">
                {[
                  { id: "pre", name: "Data Preprocessing Fundamentals", status: "completed" },
                  { id: "eda", name: "Exploratory Data Analysis", status: "completed" },
                  { id: "sim-001", name: "Patient Readmission Predictor", status: "current" },
                  { id: "feat", name: "Feature Engineering Expert", status: "locked" },
                  { id: "eval", name: "Model Evaluation Mastery", status: "locked" }
                ].map((node) => (
                  <div key={node.id} className="relative pb-6 last:pb-0">
                    <div className="absolute -left-[38px] top-1">
                      {node.status === 'completed' && <div className="w-6 h-6 rounded-full bg-[#4ADE80] flex items-center justify-center"><CheckCircle className="w-3 h-3 text-[#0A0C0F]" /></div>}
                      {node.status === 'current' && <div className="w-6 h-6 rounded-full border-2 border-[#F97316] flex items-center justify-center pulse-ring bg-[#0A0C0F]"><div className="w-2 h-2 rounded-full bg-[#F97316]" /></div>}
                      {node.status === 'locked' && <div className="w-6 h-6 rounded-full border-2 border-[#1E2530] flex items-center justify-center bg-[#0A0C0F]"><Lock className="w-3 h-3 text-[#64748B]" /></div>}
                    </div>
                    
                    <div 
                      className={`cursor-pointer transition-colors ${node.status === 'locked' ? 'pointer-events-none' : ''}`}
                      onClick={() => setExpandedNode(expandedNode === node.id ? null : node.id)}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`font-medium text-sm ${node.status === 'completed' ? 'text-[#94A3B8] line-through' : node.status === 'locked' ? 'text-[#64748B]' : 'text-white'}`}>
                          {node.name}
                        </span>
                        {node.status === 'current' && <span className="text-[10px] bg-[#F97316]/10 text-[#F97316] px-2 py-0.5 rounded-full border border-[#F97316]/20 font-mono-data tracking-wide">IN PROGRESS</span>}
                        {node.status === 'locked' && <span className="text-[10px] bg-[#1E2530] text-[#64748B] px-2 py-0.5 rounded-full font-mono-data tracking-wide">LOCKED</span>}
                      </div>
                      
                      <AnimatePresence>
                        {expandedNode === node.id && node.status !== 'locked' && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-2 pl-2 space-y-1.5">
                              {node.status === 'completed' ? (
                                <div className="text-xs text-[#64748B] flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-[#4ADE80]" /> Completed with 94% score</div>
                              ) : (
                                <>
                                  <div className="text-xs text-[#94A3B8] flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-[#4ADE80]" /> Explore Dataset</div>
                                  <div className="text-xs text-[#94A3B8] flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-[#4ADE80]" /> Handle Missing Values</div>
                                  <div className="text-xs text-white flex items-center gap-1.5"><div className="w-3 h-3 rounded-full border border-[#F97316] flex items-center justify-center"><div className="w-1.5 h-1.5 bg-[#F97316] rounded-full" /></div> Encode Features</div>
                                  <div className="text-xs text-[#64748B] flex items-center gap-1.5"><div className="w-3 h-3 rounded-full border border-[#64748B]" /> Train Random Forest</div>
                                </>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-[#111318] border border-[rgba(249,115,22,0.25)] rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F97316]/5 blur-3xl rounded-full" />
                <div className="text-xs text-[#F97316] uppercase tracking-widest font-semibold mb-2">Recommended Next</div>
                <h4 className="font-display font-semibold text-white text-lg">Feature Engineering Expert</h4>
                <div className="flex gap-2 mt-2 mb-3">
                  <span className="text-[10px] bg-[#F97316]/10 text-[#F97316] px-2 py-0.5 rounded border border-[#F97316]/20">Intermediate</span>
                  <span className="text-[10px] bg-[#1E2530] text-[#94A3B8] px-2 py-0.5 rounded border border-[#1E2530]">2 hrs</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {['Encoding', 'Scaling', 'Feature Selection'].map(s => (
                    <span key={s} className="text-xs font-mono-data bg-[#0A0C0F] border border-[#1E2530] text-[#94A3B8] px-2 py-0.5 rounded">{s}</span>
                  ))}
                </div>
                <motion.button whileTap={{ scale: 0.98 }} className="w-full bg-[#F97316] text-white font-display font-semibold py-2.5 rounded-lg text-sm transition-colors hover:bg-[#F97316]/90">
                  Start Simulation →
                </motion.button>
              </div>
            </div>

            {/* Right Col */}
            <div className="lg:col-span-2">
              <h3 className="font-display font-semibold text-lg text-white mb-4">Skill DNA</h3>
              <div className="bg-[#111318] border border-[#1E2530] rounded-xl p-4">
                <SkillRadar data={USER.skillDNA} height={220} />
              </div>

              <h3 className="font-display font-semibold text-lg text-white mt-6 mb-4">Recent Credentials</h3>
              <div className="space-y-3">
                {[
                  { name: "Feature Engineering Expert", date: "Apr 10, 2024" },
                  { name: "EDA Practitioner", date: "Mar 28, 2024" }
                ].map((cred, i) => (
                  <div key={i} className="bg-[#111318] border border-[#1E2530] rounded-xl p-4 holo-card flex justify-between items-center cursor-pointer group">
                    <div>
                      <div className="font-medium text-sm text-white group-hover:text-[#F97316] transition-colors">{cred.name}</div>
                      <div className="text-xs text-[#64748B] font-mono-data mt-1">{cred.date}</div>
                    </div>
                    <div className="text-sm text-[#22D3EE] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      View <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="mx-6 mt-8 mb-6">
            <h3 className="font-display font-semibold text-lg text-white mb-4">Live Simulation Activity</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
              {[
                { title: "Patient Readmission Predictor", diff: "Intermediate", active: 234 },
                { title: "Startup Financial Model", diff: "Beginner", active: 189 },
                { title: "Circuit Fault Diagnosis", diff: "Intermediate", active: 97 },
                { title: "Python REST API Builder", diff: "Beginner", active: 312 },
              ].map((sim, i) => (
                <div key={i} className="min-w-[220px] bg-[#111318] border border-[#1E2530] rounded-xl p-4 flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
                    <span className="text-[10px] text-[#4ADE80] uppercase tracking-widest">{sim.active} active now</span>
                  </div>
                  <div className="font-medium text-sm text-white mt-2 truncate">{sim.title}</div>
                  <div className="text-xs text-[#64748B] mt-1">{sim.diff}</div>
                  <button className="mt-3 text-xs border border-[#F97316] text-[#F97316] hover:bg-[#F97316]/10 px-3 py-1.5 rounded-lg transition-colors w-full">
                    Join →
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </PageTransition>
    </AppLayout>
  );
}
