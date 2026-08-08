import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { HeroBanner } from './components/dashboard/HeroBanner';
import { GameGrid } from './components/dashboard/GameGrid';
import { DepositModal } from './components/dashboard/DepositModal';
import { WithdrawModal } from './components/dashboard/WithdrawModal';
import { AuthModal } from './components/auth/AuthModal';
import { MinesGame } from './components/games/MinesGame';
import { DiceGame } from './components/games/DiceGame';
import { WheelGame } from './components/games/WheelGame';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

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
      {/* Toast Notification Alert */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '84px',
          right: '24px',
          zIndex: 9999,
          background: toast.type === 'error' ? 'var(--accent-red)' : 'linear-gradient(135deg, #00e701 0%, #00a801 100%)',
          color: toast.type === 'error' ? '#fff' : '#0f212e',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontFamily: 'var(--font-heading)',
          fontWeight: '800',
          fontSize: '0.95rem',
          animation: 'slideUp 0.3s ease'
        }}>
          {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          {toast.message}
        </div>
      )}

      {/* Main Navbar */}
      <Navbar />

      {/* Page Body */}
      <div className="main-content">
        
        {/* Render Dashboard View */}
        {activeView === 'dashboard' && (
          <>
            <Sidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
            <main className="page-wrapper">
              <HeroBanner onQuickPlay={() => handleSelectGame('mines')} />
              <GameGrid activeCategory={activeCategory} onSelectGame={handleSelectGame} />
            </main>
          </>
        )}

        {/* Render Playable Game View */}
        {activeView === 'game' && (
          <main className="page-wrapper" style={{ padding: '32px 24px' }}>
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

        {/* Render Admin Panel View */}
        {activeView === 'admin' && (
          <main className="page-wrapper" style={{ padding: '32px 24px' }}>
            <AdminDashboard />
          </main>
        )}

      </div>

      {/* Modals */}
      <AuthModal />
      <DepositModal />
      <WithdrawModal />
    </div>
  );
}
