import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { MobileCategoryBar } from './components/layout/MobileCategoryBar';
import { HeroBanner } from './components/dashboard/HeroBanner';
import { GameGrid } from './components/dashboard/GameGrid';
import { DepositModal } from './components/dashboard/DepositModal';
import { WithdrawModal } from './components/dashboard/WithdrawModal';
import { AuthModal } from './components/auth/AuthModal';
import { MinesGame } from './components/games/MinesGame';
import { DiceGame } from './components/games/DiceGame';
import { WheelGame } from './components/games/WheelGame';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AlertCircle, CheckCircle } from 'lucide-react';

export function AppContent() {
  const { 
    activeView, 
    setActiveView, 
    selectedGameId, 
    setSelectedGameId, 
    toast 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState('all');

  const handleSelectGame = (gameId) => {
    setSelectedGameId(gameId);
    if (['mines', 'dice', 'wheel'].includes(gameId)) {
      setActiveView('game');
    }
  };

  return (
    <div className="app-container">
      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '72px',
          right: '14px',
          left: '14px',
          maxWidth: '400px',
          marginLeft: 'auto',
          zIndex: 9999,
          background: toast.type === 'error' ? 'var(--accent-red)' : 'linear-gradient(135deg, #00e701 0%, #00a801 100%)',
          color: toast.type === 'error' ? '#fff' : '#0f212e',
          padding: '10px 16px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'var(--font-heading)',
          fontWeight: '800',
          fontSize: '0.85rem'
        }}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          {toast.message}
        </div>
      )}

      {/* Main Top Navbar */}
      <Navbar />

      {/* Main Body */}
      <div className="main-layout">
        
        {activeView === 'dashboard' && (
          <>
            <Sidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
            <main className="page-wrapper">
              <MobileCategoryBar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
              <HeroBanner onQuickPlay={() => handleSelectGame('mines')} />
              <GameGrid activeCategory={activeCategory} onSelectGame={handleSelectGame} />
            </main>
          </>
        )}

        {activeView === 'game' && (
          <main className="page-wrapper">
            {selectedGameId === 'mines' && (
              <MinesGame onBack={() => setActiveView('dashboard')} />
            )}
            {selectedGameId === 'dice' && (
              <DiceGame onBack={() => setActiveView('dashboard')} />
            )}
            {selectedGameId === 'wheel' && (
              <WheelGame onBack={() => setActiveView('dashboard')} />
            )}
          </main>
        )}

        {activeView === 'admin' && (
          <main className="page-wrapper">
            <AdminDashboard />
          </main>
        )}

      </div>

      {/* Mobile Bottom Navigation (Visible ONLY on mobile screens via CSS) */}
      <MobileNav />

      {/* Modals */}
      <AuthModal />
      <DepositModal />
      <WithdrawModal />
    </div>
  );
}
