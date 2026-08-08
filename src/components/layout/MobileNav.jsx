import React from 'react';
import { useApp } from '../../context/AppContext';
import { Gamepad2, Plus, ArrowUpRight, ShieldCheck, User } from 'lucide-react';

export const MobileNav = () => {
  const { 
    currentUser, 
    activeView, 
    setActiveView, 
    setAuthModalOpen, 
    setDepositModalOpen, 
    setWithdrawModalOpen 
  } = useApp();

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '65px',
      backgroundColor: 'var(--bg-card)',
      borderTop: '1px solid var(--border-light)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 999,
      padding: '0 8px',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.4)'
    }} className="mobile-only">
      
      {/* Casino Games button */}
      <button
        onClick={() => setActiveView('dashboard')}
        style={{
          background: 'none',
          border: 'none',
          color: activeView === 'dashboard' ? 'var(--primary-green)' : 'var(--text-muted)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          fontSize: '0.7rem',
          fontWeight: '700',
          cursor: 'pointer'
        }}
      >
        <Gamepad2 size={20} />
        <span>Games</span>
      </button>

      {/* Admin Panel Toggle */}
      <button
        onClick={() => setActiveView(activeView === 'admin' ? 'dashboard' : 'admin')}
        style={{
          background: 'none',
          border: 'none',
          color: activeView === 'admin' ? 'var(--accent-gold)' : 'var(--text-muted)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          fontSize: '0.7rem',
          fontWeight: '700',
          cursor: 'pointer'
        }}
      >
        <ShieldCheck size={20} />
        <span>Admin</span>
      </button>

      {/* Center Big Deposit Action Button */}
      <button
        onClick={() => setDepositModalOpen(true)}
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00e701 0%, #00b301 100%)',
          color: '#0f212e',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px var(--primary-green-glow)',
          marginTop: '-18px',
          cursor: 'pointer'
        }}
      >
        <Plus size={24} color="#0f212e" strokeWidth={3} />
      </button>

      {/* Withdraw Button */}
      <button
        onClick={() => setWithdrawModalOpen(true)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          fontSize: '0.7rem',
          fontWeight: '700',
          cursor: 'pointer'
        }}
      >
        <ArrowUpRight size={20} />
        <span>Withdraw</span>
      </button>

      {/* User Profile / Auth */}
      <button
        onClick={() => currentUser ? setActiveView('dashboard') : setAuthModalOpen(true)}
        style={{
          background: 'none',
          border: 'none',
          color: currentUser ? 'var(--accent-cyan)' : 'var(--text-muted)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          fontSize: '0.7rem',
          fontWeight: '700',
          cursor: 'pointer'
        }}
      >
        <User size={20} />
        <span>{currentUser ? currentUser.username.substring(0, 6) : 'Login'}</span>
      </button>

    </nav>
  );
};
