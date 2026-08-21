import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import Footer from './Footer';

export function AppShell() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Navbar />
      <main className="flex-1 w-full">
        <div className="py-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}