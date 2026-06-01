import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Share2, ExternalLink, ArrowUp, ArrowDown } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageTransition } from '@/components/shared/PageTransition';
import { SkillRadar } from '@/components/shared/SkillRadar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { USER, CREDENTIALS, ACTIVITY_LOG } from '@/data';
import SettingsPage from './SettingsPage';

export default function CredentialsPage() {
  const [selectedCred, setSelectedCred] = useState(CREDENTIALS[0]);

  return (
    <AppLayout>
      <PageTransition>
        <div className="pb-12">
          
          {/* Hero Banner */}
          <div className="relative overflow-hidden bg-[#111318] border-b border-[#1E2530] p-8">
            <div className="forge-blob absolute -top-[100px] -right-[50px] w-72 h-72" />
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #fff 10px, #fff 11px)' }} />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              
              {/* Profile */}
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-[#F97316] flex items-center justify-center font-display font-bold text-2xl text-white shadow-lg">
                  {USER.initials}
                </div>
                <div>
                  <h1 className="font-display text-3xl font-bold text-white">{USER.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-[#F97316]/10 text-[#F97316] px-2 py-0.5 rounded-full border border-[#F97316]/20">ML Student</span>
                    <span className="text-sm text-[#64748B]">{USER.institution}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {USER.topSkills.slice(0,3).map(s => (
                      <span key={s} className="bg-[rgba(249,115,22,0.08)] border border-[rgba(249,115,22,0.2)] rounded-full px-3 py-0.5 text-[11px] font-mono-data text-[#F97316]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-center gap-10">
                <div className="text-center">
                  <div className="font-display text-3xl font-bold text-white">{USER.credentials}</div>
                  <div className="text-[10px] text-[#64748B] uppercase tracking-wider mt-1">Credentials</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-3xl font-bold text-white">{USER.xp.toLocaleString()}</div>
                  <div className="text-[10px] text-[#64748B] uppercase tracking-wider mt-1">Total XP</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-3xl font-bold text-white">#{USER.globalRank.toLocaleString()}</div>
                  <div className="text-[10px] text-[#64748B] uppercase tracking-wider mt-1">Global Rank</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-end gap-3">
                <button className="border border-[#1E2530] hover:bg-[#181C23] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors">
                  <Share2 className="w-4 h-4" /> Share Profile
                </button>
                <div className="flex items-center gap-2 bg-[#0A0C0F] border border-[#1E2530] rounded-lg px-3 py-1.5">
                  <span className="font-mono-data text-xs text-[#64748B]">Wallet:</span>
                  <span className="font-mono-data text-xs text-white">{USER.walletAddress.substring(0, 6)}...{USER.walletAddress.substring(USER.walletAddress.length - 4)}</span>
                  <button className="text-[#22D3EE] hover:text-white transition-colors ml-1" title="Copy Address">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>

          <Tabs defaultValue="credentials" className="w-full">
            <div className="px-6 pt-4 border-b border-[#1E2530]">
              <TabsList className="bg-transparent border-none p-0 flex justify-start gap-6">
                <TabsTrigger value="credentials" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#F97316] data-[state=active]:text-white rounded-none border-b-2 border-transparent px-0 pb-3 text-sm text-[#64748B]">
                  My Credentials
                </TabsTrigger>
                <TabsTrigger value="skillDNA" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#F97316] data-[state=active]:text-white rounded-none border-b-2 border-transparent px-0 pb-3 text-sm text-[#64748B]">
                  Skill DNA
                </TabsTrigger>
                <TabsTrigger value="activity" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#F97316] data-[state=active]:text-white rounded-none border-b-2 border-transparent px-0 pb-3 text-sm text-[#64748B]">
                  Activity Log
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#F97316] data-[state=active]:text-white rounded-none border-b-2 border-transparent px-0 pb-3 text-sm text-[#64748B]">
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="credentials" className="m-0 p-6 pt-6 outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {CREDENTIALS.map((cred, i) => (
                  <Dialog key={cred.id}>
                    <DialogTrigger asChild>
                      <motion.div 
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -2 }}
                        onClick={() => setSelectedCred(cred)}
                        className="bg-[#111318] border border-[#1E2530] hover:border-[#F97316]/50 rounded-xl p-5 holo-card relative overflow-hidden cursor-pointer"
                      >
                        <div className="absolute -top-2 -right-4 font-display font-bold text-[80px] opacity-[0.03] -rotate-[20deg] text-white pointer-events-none select-none">FL</div>
                        
                        <div className="inline-block bg-[#F97316]/15 text-[#F97316] rounded-full px-2 py-0.5 text-[10px] font-mono-data border border-[#F97316]/20">
                          {cred.track}
                        </div>
                        
                        <h3 className="font-display font-bold text-lg mt-2 text-white leading-tight">{cred.simulation}</h3>
                        <div className="font-mono-data text-xs text-[#64748B] mt-1">{cred.dateEarned}</div>
                        
                        <div className="mt-4 flex items-baseline">
                          <span className="font-display text-[40px] font-bold text-[#F97316] leading-none">{cred.score}</span>
                          <span className="text-lg text-[#64748B] ml-1">/100</span>
                        </div>

                        <div className="mt-5 space-y-2">
                          {cred.skills.map((skill, j) => (
                            <div key={j}>
                              <div className="flex justify-between text-[10px] mb-1">
                                <span className="text-[#94A3B8] uppercase tracking-wider">{skill.name}</span>
                                <span className="text-[#64748B] font-mono-data">{skill.score}%</span>
                              </div>
                              <div className="w-full h-1 bg-[#1E2530] rounded-full overflow-hidden">
                                <div className="h-full bg-[#F97316]" style={{ width: `${skill.score}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-5 pt-4 border-t border-[#1E2530] flex items-center justify-between text-[#22D3EE] text-xs font-medium">
                          <span>Verify on Chain</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                      </motion.div>
                    </DialogTrigger>

                    {/* Dialog Content */}
                    <DialogContent className="bg-[#111318] border border-[#1E2530] text-white sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="font-display font-bold text-xl text-white">Credential Verification</DialogTitle>
                      </DialogHeader>
                      
                      <div className="mt-4 space-y-6">
                        <div className="bg-[#0A0C0F] border border-[#1E2530] rounded-xl p-4">
                          <div className="text-[10px] text-[#64748B] uppercase tracking-widest mb-1.5">Transaction Hash</div>
                          <div className="flex items-center justify-between">
                            <span className="font-mono-data text-xs text-[#22D3EE] break-all">{selectedCred.txHash}</span>
                            <button className="text-[#64748B] hover:text-white transition-colors ml-2 flex-shrink-0">
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                          <a href="#" className="inline-flex items-center gap-1 text-xs text-[#F97316] hover:underline mt-3">
                            View on Polygonscan <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="w-24 h-24 bg-white p-1 rounded-lg flex-shrink-0">
                            {/* Fake QR pattern */}
                            <div className="w-full h-full bg-black relative">
                               <div className="absolute inset-0 opacity-80" style={{backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 4px, #fff 4px, #fff 5px), repeating-linear-gradient(90deg, transparent, transparent 4px, #fff 4px, #fff 5px)'}} />
                            </div>
                          </div>
                          <div>
                            <div className="font-display font-semibold text-white">{selectedCred.simulation}</div>
                            <div className="text-sm text-[#94A3B8] mt-1">Issued to {USER.name}</div>
                            <div className="text-xs text-[#64748B] font-mono-data mt-1">{selectedCred.dateEarned}</div>
                          </div>
                        </div>

                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="metadata" className="border-[#1E2530]">
                            <AccordionTrigger className="text-sm hover:no-underline text-gray-300 py-3">View Credential Metadata</AccordionTrigger>
                            <AccordionContent>
                              <pre className="bg-[#0A0C0F] border border-[#1E2530] p-3 rounded-lg text-[10px] font-mono-data text-[#94A3B8] overflow-x-auto">
{JSON.stringify({
  id: selectedCred.id,
  simulation: selectedCred.simulation,
  track: selectedCred.track,
  score: selectedCred.score,
  dateEarned: selectedCred.dateEarned,
  txHash: selectedCred.txHash,
  blockchain: "Polygon",
  issuer: "FirstLight Inc."
}, null, 2)}
                              </pre>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="skillDNA" className="m-0 p-6 pt-6 outline-none">
              <h2 className="font-display font-bold text-xl text-white mb-6">Skill DNA Analysis</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#111318] border border-[#1E2530] rounded-xl p-6">
                  <SkillRadar data={USER.skillDNA} height={350} />
                </div>
                <div className="bg-[#111318] border border-[#1E2530] rounded-xl p-6">
                  <h3 className="font-semibold text-white mb-6">Proficiency Breakdown</h3>
                  <div className="space-y-4">
                    {USER.skillDNA.map((item, i) => (
                      <div key={item.skill} className="flex items-center gap-4">
                        <div className="text-sm text-[#94A3B8] w-36 flex-shrink-0 truncate" title={item.fullName}>{item.fullName}</div>
                        <div className="flex-1 h-2 bg-[#1E2530] rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.value}%` }}
                            transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                            className="h-full bg-[#F97316] rounded-full"
                          />
                        </div>
                        <div className="text-xs font-mono-data text-[#F97316] w-10 text-right">{item.value}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="m-0 p-6 pt-6 outline-none">
              <div className="max-w-3xl mx-auto">
                <h2 className="font-display font-bold text-xl text-white mb-8">Activity Timeline</h2>
                
                <div className="relative pl-8 border-l-2 border-dashed border-[#1E2530] py-2">
                  {ACTIVITY_LOG.map((log, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative mb-8 last:mb-0 pl-4"
                    >
                      <div className={`absolute -left-[41px] top-0.5 w-4 h-4 rounded-full border-4 border-[#0A0C0F] ${
                        log.type === 'credential' ? 'bg-[#F97316]' :
                        log.type === 'simulation_complete' ? 'bg-[#4ADE80]' :
                        log.type === 'level_up' ? 'bg-[#F59E0B]' :
                        'bg-[#22D3EE]'
                      }`} />
                      
                      <div className="font-medium text-sm text-white flex items-center flex-wrap gap-2">
                        {log.text}
                        {log.xp && (
                          <span className="bg-[#F97316]/10 text-[#F97316] font-mono-data text-[10px] rounded px-1.5 py-0.5 border border-[#F97316]/20">
                            +{log.xp} XP
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#64748B] font-mono-data mt-1">{log.date}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="m-0 p-0 outline-none">
              {/* Reuse Settings component implicitly or redirect */}
              <div className="p-6">
                <SettingsPage isInline={true} />
              </div>
            </TabsContent>

          </Tabs>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
