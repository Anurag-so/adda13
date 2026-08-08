import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  User, 
  ShieldCheck, 
  LogOut, 
  Coins, 
  IndianRupee,
  Gamepad2,
  Trophy,
  Flame
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
      height: '72px',
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      justifyConstraint: 'space-between'
    }}>
      {/* Brand & Main Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <div 
          onClick={() => setActiveView('dashboard')} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00e701 0%, #008801 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px var(--primary-green-glow)'
          }}>
            <Gamepad2 size={24} color="#0f212e" />
          </div>
          <div>
            <span style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '1.4rem', 
              fontWeight: '900', 
              letterSpacing: '-0.5px',
              color: '#fff' 
            }}>
              STAKE<span style={{ color: 'var(--primary-green)' }}>.PRO</span>
            </span>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '-4px' }}>
              WhatsApp Gaming
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav style={{ display: 'flex', gap: '8px', alignItems: 'center' }} className="mobile-hide">
          <button 
            className={`btn ${activeView === 'dashboard' ? 'btn-secondary' : 'btn-outline'}`}
            onClick={() => setActiveView('dashboard')}
            style={{ fontSize: '0.85rem', padding: '8px 14px' }}
          >
            <Flame size={16} color="var(--primary-green)" />
            Casino & Games
          </button>

          <button 
            className="btn btn-outline"
            onClick={() => setActiveView('dashboard')}
            style={{ fontSize: '0.85rem', padding: '8px 14px' }}
          >
            <Trophy size={16} color="var(--accent-gold)" />
            VIP Rewards
          </button>

          {/* Admin Panel Toggle Switch Button */}
          <button 
            className={`btn ${activeView === 'admin' ? 'btn-gold' : 'btn-outline'}`}
            onClick={() => setActiveView(activeView === 'admin' ? 'dashboard' : 'admin')}
            style={{ 
              fontSize: '0.85rem', 
              padding: '8px 14px',
              borderColor: activeView === 'admin' ? 'var(--accent-gold)' : 'rgba(255, 199, 0, 0.4)'
            }}
          >
            <ShieldCheck size={16} />
            {activeView === 'admin' ? 'User Dashboard' : 'Admin Panel'}
          </button>
        </nav>
      </div>

      {/* Right Controls: Balance + Currency Switcher + Actions + Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
        
        {currentUser ? (
          <>
            {/* Currency Selector (INR vs TOKENS) */}
            <div style={{
              display: 'flex',
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              padding: '3px',
              border: '1px solid var(--bg-accent)'
            }}>
              <button
                onClick={() => setCurrency('INR')}
                style={{
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: currency === 'INR' ? 'var(--bg-accent)' : 'transparent',
                  color: currency === 'INR' ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <IndianRupee size={12} />
                INR ₹
              </button>
              <button
                onClick={() => setCurrency('TOKENS')}
                style={{
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: currency === 'TOKENS' ? 'var(--bg-accent)' : 'transparent',
                  color: currency === 'TOKENS' ? 'var(--accent-gold)' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Coins size={12} />
                Tokens
              </button>
            </div>

            {/* Balance Card Container */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-green)',
              borderRadius: 'var(--radius-md)',
              padding: '4px 6px 4px 14px',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                  Available Balance
                </span>
                <span style={{ 
                  fontSize: '1.05rem', 
                  fontWeight: '800', 
                  fontFamily: 'var(--font-heading)',
                  color: currency === 'INR' ? 'var(--primary-green)' : 'var(--accent-gold)',
                  lineHeight: 1.1
                }}>
                  {currency === 'INR' ? `₹${currentUser.balance.toLocaleString()}` : `${currentUser.tokens.toLocaleString()} 🪙`}
                </span>
              </div>

              {/* Deposit Action Button (Prominent Green Glow) */}
              <button 
                className="btn btn-primary btn-sm glow-active"
                onClick={() => setDepositModalOpen(true)}
                style={{ height: '36px' }}
              >
                <Plus size={16} />
                Deposit
              </button>

              {/* Withdraw Button */}
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setWithdrawModalOpen(true)}
                style={{ height: '36px' }}
              >
                <ArrowUpRight size={16} />
                Withdraw
              </button>
            </div>

            {/* Profile Dropdown / Logged User info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 12px',
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--bg-accent)'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1475e1 0%, #00f0ff 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: '800',
                fontSize: '0.85rem'
              }}>
                {currentUser.username.substring(0, 2).toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }} className="mobile-hide">
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>
                  {currentUser.username}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  ID: {currentUser.id}
                </span>
              </div>
              <button 
                onClick={logoutUser}
                title="Logout"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn btn-outline"
              onClick={() => setAuthModalOpen(true)}
            >
              <User size={16} />
              Login / Sign Up
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => setAuthModalOpen(true)}
            >
              Join Now
            </button>
          </div>
        )}

      </div>
    </header>
  );
};
