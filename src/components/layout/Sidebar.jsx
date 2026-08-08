import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Flame, 
  Sparkles, 
  Gamepad2, 
  Gift, 
  MessageSquare, 
  TrendingUp, 
  ShieldCheck
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
    <>
      {/* Desktop Left Sidebar (Hidden on mobile via CSS class .desktop-sidebar) */}
      <aside className="desktop-sidebar">
        
        {/* Category List */}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <Icon size={18} color={isActive ? 'var(--primary-green)' : 'var(--text-muted)'} />
                  <span style={{ flex: 1 }}>{cat.label}</span>
                  {isActive && (
                    <span style={{
                      width: '4px',
                      height: '16px',
                      borderRadius: '2px',
                      background: 'var(--primary-green)',
                      position: 'absolute',
                      left: '0'
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* WhatsApp Help Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.12) 0%, rgba(18, 140, 126, 0.12) 100%)',
          border: '1px solid rgba(37, 211, 102, 0.3)',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          marginTop: 'auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <MessageSquare size={18} color="#25D366" />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#25D366' }}>
              24/7 WhatsApp Admin
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Instant WhatsApp manual deposits & payouts
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

      </aside>

      {/* Mobile Horizontal Category Pills Filter Bar (Appears ONLY on screen <= 768px via CSS) */}
      <div className="mobile-category-chips">
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
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '20px',
                border: isActive ? '1px solid var(--primary-green)' : '1px solid var(--bg-accent)',
                background: isActive ? 'rgba(0, 231, 1, 0.15)' : 'var(--bg-card)',
                color: isActive ? 'var(--primary-green)' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: '700',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              <Icon size={14} />
              {cat.label}
            </button>
          );
        })}
      </div>
    </>
  );
};
