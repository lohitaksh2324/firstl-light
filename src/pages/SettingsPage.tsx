import { useState } from 'react';
import { Palette, User, Bell, Shield } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageTransition } from '@/components/shared/PageTransition';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage({ isInline = false }: { isInline?: boolean }) {
  const [activeSection, setActiveSection] = useState('Appearance');

  const navItems = [
    { icon: Palette, label: "Appearance" },
    { icon: User, label: "Account" },
    { icon: Bell, label: "Notifications" },
    { icon: Shield, label: "Privacy" }
  ];

  const content = (
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 ${isInline ? '' : 'p-6'}`}>
      
      {/* Left Nav */}
      <div className="md:col-span-1 bg-[#111318] border border-[#1E2530] rounded-xl p-2 h-fit space-y-1">
        {navItems.map(item => {
          const isActive = activeSection === item.label;
          return (
            <div
              key={item.label}
              onClick={() => setActiveSection(item.label)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-sm font-medium ${
                isActive 
                  ? 'bg-[rgba(249,115,22,0.08)] text-[#F97316]' 
                  : 'text-[#94A3B8] hover:bg-[#181C23] hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </div>
          );
        })}
      </div>

      {/* Right Content */}
      <div className="md:col-span-3 bg-[#111318] border border-[#1E2530] rounded-xl p-6 md:p-8 min-h-[400px]">
        <h2 className="font-display font-bold text-xl text-white mb-6">{activeSection}</h2>

        {activeSection === 'Appearance' && (
          <div className="space-y-6 max-w-lg">
            <div className="flex justify-between items-center pb-6 border-b border-[#1E2530]">
              <div>
                <div className="font-medium text-white text-sm">Dark Mode</div>
                <div className="text-xs text-[#64748B] mt-1">FirstLight is designed for dark environments.</div>
              </div>
              <Switch checked={true} disabled />
            </div>

            <div>
              <div className="font-medium text-white text-sm mb-3">Accent Color</div>
              <div className="flex gap-4">
                {['#F97316', '#22D3EE', '#4ADE80', '#8B5CF6'].map(color => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded-full transition-transform ${color === '#F97316' ? 'ring-2 ring-offset-2 ring-offset-[#111318]' : 'hover:scale-110'}`}
                    style={{ backgroundColor: color, '--tw-ring-color': color } as React.CSSProperties}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'Account' && (
          <div className="space-y-5 max-w-lg">
            <div>
              <label className="block text-xs text-[#64748B] uppercase tracking-wider mb-2">Full Name</label>
              <input type="text" defaultValue="Arjun Sharma" className="w-full bg-[#0A0C0F] border border-[#1E2530] focus:border-[#F97316] rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-[#64748B] uppercase tracking-wider mb-2">Email Address</label>
              <input type="email" defaultValue="arjun@example.com" className="w-full bg-[#0A0C0F] border border-[#1E2530] focus:border-[#F97316] rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-[#64748B] uppercase tracking-wider mb-2">Institution / Company</label>
              <input type="text" defaultValue="IIT Bombay" className="w-full bg-[#0A0C0F] border border-[#1E2530] focus:border-[#F97316] rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-colors" />
            </div>
            
            <button className="mt-6 bg-[#F97316] hover:bg-[#F97316]/90 text-white font-display font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">
              Save Changes
            </button>
          </div>
        )}

        {activeSection === 'Notifications' && (
          <div className="space-y-0 max-w-lg divide-y divide-[#1E2530]">
            {[
              { label: "Simulation updates", desc: "When new stages are unlocked or graded", checked: true },
              { label: "Credential minting", desc: "When a new credential is confirmed on-chain", checked: true },
              { label: "Leaderboard alerts", desc: "When your global rank changes significantly", checked: false },
              { label: "Community mentions", desc: "When someone replies to your comment", checked: true }
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-4">
                <div>
                  <div className="font-medium text-white text-sm">{item.label}</div>
                  <div className="text-xs text-[#64748B] mt-1">{item.desc}</div>
                </div>
                <Switch checked={item.checked} />
              </div>
            ))}
          </div>
        )}

        {activeSection === 'Privacy' && (
          <div className="space-y-6 max-w-lg">
            <div className="bg-[#0A0C0F] border border-[#1E2530] rounded-xl p-5">
              <div className="font-display font-semibold text-white mb-1">Wallet Connection</div>
              <div className="text-xs text-[#64748B] mb-4">Your connected Web3 wallet for receiving credentials.</div>
              
              <div className="flex justify-between items-center bg-[#111318] border border-[#1E2530] rounded-lg px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#4ADE80] shadow-[0_0_8px_#4ADE80]" />
                  <span className="font-mono-data text-sm text-white">0x1a2b...abcd</span>
                </div>
                <button className="border border-[#F87171]/50 text-[#F87171] hover:bg-[#F87171]/10 text-xs px-3 py-1.5 rounded transition-colors font-medium">
                  Disconnect
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center py-4 border-b border-[#1E2530]">
              <div>
                <div className="font-medium text-white text-sm">Public Profile</div>
                <div className="text-xs text-[#64748B] mt-1">Allow others to see your credentials and rank.</div>
              </div>
              <Switch checked={true} />
            </div>
          </div>
        )}

      </div>
    </div>
  );

  if (isInline) {
    return content;
  }

  return (
    <AppLayout>
      <PageTransition>
        <div className="pb-12">
          <div className="px-6 py-5 border-b border-[#1E2530] bg-[#0A0C0F] sticky top-0 z-30">
            <h1 className="font-display text-2xl font-bold text-white">Settings</h1>
          </div>
          {content}
        </div>
      </PageTransition>
    </AppLayout>
  );
}
