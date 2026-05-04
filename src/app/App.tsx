import { Outlet } from 'react-router-dom';
import { BottomNav } from '../components/layout/BottomNav';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export function App() {
  const init = useAuth((s) => s.init);
  useEffect(() => { void init(); }, [init]);
  return <div className="max-w-md mx-auto min-h-screen pb-16"><Outlet /><BottomNav /></div>;
}
