import { Sidebar } from './Sidebar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0C0F' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 240, minHeight: '100vh', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
