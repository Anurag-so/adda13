import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Flame, 
  Sparkles, 
  Gamepad2, 
  Gift, 
  MessageSquare, 
  TrendingUp, 
  ShieldCheck, 
  HelpCircle,
  Award
} from 'lucide-react';

export const Sidebar = ({ activeCategory, setActiveCategory }) => {
  const { setDepositModalOpen } = useApp();

  const categories = [
    { id: 'all', label: 'All Games', icon: Flame, badge: 'Hot' },
    { id: 'originals', label: 'Stake Originals', icon: Gamepad2, badge: 'Popular' },
    { id: 'slots', label: 'Slots & Mega', icon: Sparkles },
    { id: 'instant', label: 'Instant Crash', icon: TrendingUp },
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--bg-dark)',
      borderRight: '1px solid var(--border-light)',
      padding: '20px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      height: 'calc(100vh - 72px)',
      position: 'sticky',
      top: '72px',
      overflowY: 'auto'
    }} className="mobile-hide">
      
      {/* Categories */}
      <div>
        <div style={{ 
          fontSize: '0.75rem', 
          fontWeight: '700', 
          color: 'var(--text-dim)', 
          textTransform: 'uppercase', 
          letterSpacing: '1px',
          marginBottom: '12px',
          paddingLeft: '8px'
        }}>
          Game Categories
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: isActive ? 'var(--bg-accent)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? '700' : '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={18} color={isActive ? 'var(--primary-green)' : 'var(--text-muted)'} />
                <span style={{ flex: 1 }}>{cat.label}</span>
                {cat.badge && (
                  <span className={`badge ${cat.badge === 'Hot' ? 'badge-green' : 'badge-gold'}`}>
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Promos & Rewards Card */}
      <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Gift size={20} color="var(--accent-gold)" />
          <h4 style={{ fontSize: '0.95rem', color: '#fff' }}>200% Welcome Bonus</h4>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Deposit money via WhatsApp chat and receive instant 2x bonus tokens!
        </p>
        <button 
          className="btn btn-gold btn-sm"
          onClick={() => setDepositModalOpen(true)}
          style={{ width: '100%' }}
        >
          Claim Bonus
        </button>
      </div>

      {/* WhatsApp Help Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.15) 0%, rgba(18, 140, 126, 0.15) 100%)',
        border: '1px solid rgba(37, 211, 102, 0.3)',
        padding: '14px',
        borderRadius: 'var(--radius-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <MessageSquare size={18} color="#25D366" />
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#25D366' }}>
            24/7 WhatsApp Support
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
          Need instant deposit/withdrawal help or manual verification?
        </p>
        <a 
          href="https://wa.me/919876543210?text=Hi%20Admin%2C%20I%20need%20support"
          target="_blank"
          rel="noreferrer"
          className="btn btn-sm"
          style={{ 
            width: '100%', 
            backgroundColor: '#25D366', 
            color: '#fff',
            textDecoration: 'none'
          }}
        >
          Chat with Admin
        </a>
      </div>

      {/* Platform Security Badge */}
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
        <ShieldCheck size={16} color="var(--primary-green)" />
        <span>100% Provably Fair & Secure</span>
      </div>

    </aside>
  );
};
