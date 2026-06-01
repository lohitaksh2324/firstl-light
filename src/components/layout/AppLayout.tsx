import { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { getThemePrefs, applyTheme } from '@/lib/theme';

export function AppLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyTheme(getThemePrefs());
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }} className="bg-background">
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 240, minHeight: '100vh', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
