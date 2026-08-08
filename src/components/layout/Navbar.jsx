import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plus, 
  ArrowUpRight, 
  ShieldCheck, 
  LogOut, 
  Coins, 
  IndianRupee,
  Gamepad2,
  Trophy,
  Flame,
  User
} from 'lucide-react';

export const Navbar = () => {
  const { 
    currentUser, 
    currency, 
    setCurrency, 
    activeView, 
    setActiveView, 
    setAuthModalOpen, 
    setDepositModalOpen, 
    setWithdrawModalOpen,
    logoutUser
  } = useApp();

  return (
    <header style={{
      height: '64px',
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      padding: '0 14px',
      justifyContent: 'space-between'
    }}>
      {/* Brand & Main Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div 
          onClick={() => setActiveView('dashboard')} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #00e701 0%, #008801 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 10px var(--primary-green-glow)'
          }}>
            <Gamepad2 size={20} color="#0f212e" />
          </div>
          <div>
            <span style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '1.25rem', 
              fontWeight: '900', 
              letterSpacing: '-0.5px',
              color: '#fff' 
            }}>
              STAKE<span style={{ color: 'var(--primary-green)' }}>.PRO</span>
            </span>
          </div>
        </div>

        {/* Desktop Nav items */}
        <nav style={{ display: 'flex', gap: '8px', alignItems: 'center' }} className="mobile-hide">
          <button 
            className={`btn ${activeView === 'dashboard' ? 'btn-secondary' : 'btn-outline'}`}
            onClick={() => setActiveView('dashboard')}
            style={{ fontSize: '0.85rem', padding: '8px 14px' }}
          >
            <Flame size={16} color="var(--primary-green)" />
            Casino
          </button>

          <button 
            className={`btn ${activeView === 'admin' ? 'btn-gold' : 'btn-outline'}`}
            onClick={() => setActiveView(activeView === 'admin' ? 'dashboard' : 'admin')}
            style={{ 
              fontSize: '0.85rem', 
              padding: '8px 14px'
            }}
          >
            <ShieldCheck size={16} />
            {activeView === 'admin' ? 'User Dashboard' : 'Admin Panel'}
          </button>
        </nav>
      </div>

      {/* Right Controls: Balance + Currency Switcher + Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        
        {currentUser ? (
          <>
            {/* Currency Selector */}
            <div style={{
              display: 'flex',
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              padding: '2px',
              border: '1px solid var(--bg-accent)'
            }}>
              <button
                onClick={() => setCurrency('INR')}
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: currency === 'INR' ? 'var(--bg-accent)' : 'transparent',
                  color: currency === 'INR' ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                ₹
              </button>
              <button
                onClick={() => setCurrency('TOKENS')}
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: currency === 'TOKENS' ? 'var(--bg-accent)' : 'transparent',
                  color: currency === 'TOKENS' ? 'var(--accent-gold)' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                🪙
              </button>
            </div>

            {/* Balance Card Container */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-green)',
              borderRadius: 'var(--radius-md)',
              padding: '3px 8px',
              gap: '8px'
            }}>
              <span style={{ 
                fontSize: '0.95rem', 
                fontWeight: '800', 
                fontFamily: 'var(--font-heading)',
                color: currency === 'INR' ? 'var(--primary-green)' : 'var(--accent-gold)'
              }}>
                {currency === 'INR' ? `₹${currentUser.balance.toLocaleString()}` : `${currentUser.tokens.toLocaleString()} 🪙`}
              </span>

              {/* Deposit Action Button */}
              <button 
                className="btn btn-primary btn-sm glow-active"
                onClick={() => setDepositModalOpen(true)}
                style={{ height: '30px', padding: '0 10px', fontSize: '0.8rem' }}
              >
                <Plus size={14} />
                <span className="mobile-hide">Deposit</span>
              </button>
            </div>

            {/* Logout button */}
            <button 
              onClick={logoutUser}
              title="Logout"
              className="mobile-hide"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '6px' }}>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setAuthModalOpen(true)}
            >
              <User size={14} />
              Login
            </button>
          </div>
        )}

      </div>
    </header>
  );
};
