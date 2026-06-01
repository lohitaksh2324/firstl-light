import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Trophy, Medal } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageTransition } from '@/components/shared/PageTransition';
import { LEADERBOARD } from '@/data';

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState('All Time');

  const top3 = [LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]];

  return (
    <AppLayout>
      <PageTransition>
        <div className="pb-12">
          
          <div className="px-6 py-5 border-b border-[#1E2530] bg-[#0A0C0F] sticky top-0 z-30">
            <h1 className="font-display text-2xl font-bold text-white">Global Leaderboard</h1>
            <p className="text-sm text-[#64748B] mt-1">Ranked by total XP earned across all verified simulations.</p>
          </div>

          <div className="px-6 pt-5">
            <div className="flex gap-2">
              {['Global', 'By Track', 'This Week', 'All Time'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setTimeframe(tab)}
                  className={`px-4 py-1.5 rounded-lg text-sm transition-colors border ${
                    timeframe === tab 
                      ? 'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/30 font-medium' 
                      : 'border-transparent text-[#64748B] hover:text-white hover:bg-[#111318]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Podium */}
          <div className="flex justify-center items-end gap-4 px-6 py-12 mt-4">
            
            {/* 2nd Place */}
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className="bg-[#111318] border border-[#1E2530] rounded-2xl p-6 flex flex-col items-center text-center w-48 mb-4 shadow-lg relative">
              <div className="absolute -top-4 bg-[#94A3B8] text-black w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-4 border-[#0A0C0F] shadow-sm z-10">2</div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-white shadow-inner" style={{ backgroundColor: top3[0].avatarColor }}>
                {top3[0].initials}
              </div>
              <div className="font-display font-semibold mt-3 text-white truncate w-full">{top3[0].name}</div>
              <div className="text-[10px] text-[#64748B] uppercase tracking-wider mb-2">{top3[0].track}</div>
              <div className="font-mono-data text-[#F97316] font-semibold">{top3[0].xp.toLocaleString()} XP</div>
              <div className="text-xs text-[#64748B] mt-0.5">{top3[0].credentials} creds</div>
            </motion.div>

            {/* 1st Place */}
            <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="bg-[#181C23] border border-[#F59E0B]/40 glow-orange rounded-2xl p-6 pb-8 flex flex-col items-center text-center w-56 relative z-10 shadow-xl">
              <div className="absolute -top-5 bg-[#F59E0B] text-black w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#0A0C0F] shadow-md z-10">
                <Trophy className="w-5 h-5 text-black" />
              </div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center font-display font-bold text-2xl text-white shadow-inner ring-4 ring-[#181C23]" style={{ backgroundColor: top3[1].avatarColor }}>
                {top3[1].initials}
              </div>
              <div className="font-display font-bold mt-4 text-white text-lg truncate w-full">{top3[1].name}</div>
              <div className="text-[10px] text-[#64748B] uppercase tracking-wider mb-2">{top3[1].track}</div>
              <div className="font-mono-data text-[#F59E0B] font-bold text-lg">{top3[1].xp.toLocaleString()} XP</div>
              <div className="text-xs text-[#64748B] mt-1">{top3[1].credentials} credentials</div>
            </motion.div>

            {/* 3rd Place */}
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.3}} className="bg-[#111318] border border-[#1E2530] rounded-2xl p-6 flex flex-col items-center text-center w-48 mb-4 shadow-lg relative">
              <div className="absolute -top-4 bg-[#B45309] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-4 border-[#0A0C0F] shadow-sm z-10">3</div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-white shadow-inner" style={{ backgroundColor: top3[2].avatarColor }}>
                {top3[2].initials}
              </div>
              <div className="font-display font-semibold mt-3 text-white truncate w-full">{top3[2].name}</div>
              <div className="text-[10px] text-[#64748B] uppercase tracking-wider mb-2">{top3[2].track}</div>
              <div className="font-mono-data text-[#F97316] font-semibold">{top3[2].xp.toLocaleString()} XP</div>
              <div className="text-xs text-[#64748B] mt-0.5">{top3[2].credentials} creds</div>
            </motion.div>

          </div>

          {/* Table */}
          <div className="mx-6 border border-[#1E2530] rounded-xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-[60px_2fr_1fr_120px_100px_80px] bg-[#181C23] border-b border-[#1E2530] px-5 py-3">
              <div className="text-[10px] uppercase tracking-widest text-[#64748B]">Rank</div>
              <div className="text-[10px] uppercase tracking-widest text-[#64748B]">Apprentice</div>
              <div className="text-[10px] uppercase tracking-widest text-[#64748B]">Track</div>
              <div className="text-[10px] uppercase tracking-widest text-[#64748B] text-right">Total XP</div>
              <div className="text-[10px] uppercase tracking-widest text-[#64748B] text-right">Creds</div>
              <div className="text-[10px] uppercase tracking-widest text-[#64748B] text-right">7D Chg</div>
            </div>

            <div className="divide-y divide-[#1E2530]">
              {LEADERBOARD.map((user, i) => {
                const isSeparator = i === 8 && user.rank > 10;
                
                return (
                  <div key={i}>
                    {isSeparator && (
                      <div className="py-2 text-center text-[#64748B] text-xs font-bold tracking-widest bg-[#0A0C0F]">· · ·</div>
                    )}
                    
                    <div className={`grid grid-cols-[60px_2fr_1fr_120px_100px_80px] items-center px-5 py-3 text-sm transition-colors ${
                      user.isCurrentUser 
                        ? 'bg-[#F97316]/5 border-l-4 border-l-[#F97316] pl-4' 
                        : 'bg-[#111318] hover:bg-[#181C23] border-l-4 border-l-transparent'
                    }`}>
                      <div className="font-mono-data text-[#94A3B8]">{user.rank}</div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-xs text-white" style={{ backgroundColor: user.avatarColor }}>
                          {user.initials}
                        </div>
                        <span className={`font-medium ${user.isCurrentUser ? 'text-[#F97316]' : 'text-white'}`}>
                          {user.name} {user.isCurrentUser && <span className="text-[10px] ml-1 text-[#64748B] font-normal">(You)</span>}
                        </span>
                      </div>
                      
                      <div className="text-xs text-[#94A3B8]">{user.track}</div>
                      
                      <div className={`text-right font-mono-data font-medium ${user.isCurrentUser ? 'text-[#F97316]' : 'text-[#D1D5DB]'}`}>
                        {user.xp.toLocaleString()}
                      </div>
                      
                      <div className="text-right text-[#94A3B8] font-mono-data">{user.credentials}</div>
                      
                      <div className="text-right flex items-center justify-end font-mono-data text-xs">
                        {user.change > 0 ? (
                          <span className="text-[#4ADE80] flex items-center gap-0.5"><ArrowUp className="w-3 h-3" /> {user.change}</span>
                        ) : user.change < 0 ? (
                          <span className="text-[#F87171] flex items-center gap-0.5"><ArrowDown className="w-3 h-3" /> {Math.abs(user.change)}</span>
                        ) : (
                          <span className="text-[#64748B]">--</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </PageTransition>
    </AppLayout>
  );
}
