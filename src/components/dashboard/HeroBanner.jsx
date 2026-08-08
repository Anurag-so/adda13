import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageCircle, Play, Users, Trophy, Zap } from 'lucide-react';

export const HeroBanner = ({ onQuickPlay }) => {
  const { setDepositModalOpen } = useApp();
  const [jackpot, setJackpot] = useState(1284950);

  useEffect(() => {
    const interval = setInterval(() => {
      setJackpot(prev => prev + Math.floor(Math.random() * 15) + 5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Hero Container */}
      <div 
        className="glass-panel" 
        style={{
          background: 'linear-gradient(135deg, #112233 0%, #1a2c38 50%, #0f212e 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '20px 24px',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(0, 231, 1, 0.2)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          
          <div style={{ maxWidth: '580px', flex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }} className="badge badge-green">
              <Zap size={12} /> Instant WhatsApp Deposits
            </div>

            <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.3rem)', color: '#fff', lineHeight: 1.2, marginBottom: '10px' }}>
              Play Casino Games & Win <span style={{ color: 'var(--primary-green)' }}>Real Money</span>
            </h1>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '18px' }}>
              Deposit via WhatsApp chat in 1 min. Play Mines, Dice & Wheel. Get instant 24/7 manual payouts.
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-primary glow-active"
                onClick={() => setDepositModalOpen(true)}
                style={{ flex: '1 1 180px' }}
              >
                <MessageCircle size={18} />
                WhatsApp Deposit
              </button>

              <button 
                className="btn btn-gold"
                onClick={onQuickPlay}
                style={{ flex: '1 1 140px' }}
              >
                <Play size={18} />
                Play Mines
              </button>
            </div>
          </div>

          {/* Jackpot Card */}
          <div style={{
            background: 'rgba(15, 33, 46, 0.85)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            width: '100%',
            maxWidth: '300px',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--accent-gold)', marginBottom: '4px' }}>
              <Trophy size={16} />
              <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Mega Jackpot
              </span>
            </div>

            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.8rem',
              fontWeight: '900',
              color: 'var(--accent-gold)'
            }}>
              ₹{jackpot.toLocaleString()}
            </div>
          </div>

        </div>
      </div>

      {/* Realtime Stats Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '10px',
        marginTop: '12px'
      }}>
        <div className="glass-panel" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={18} color="var(--primary-green)" />
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#fff' }}>12,840+</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Online Players</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={18} color="var(--accent-gold)" />
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#fff' }}>₹4,92,500</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Won Today</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={18} color="var(--accent-cyan)" />
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#fff' }}>&lt; 2 Mins</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>WhatsApp Deposit</div>
          </div>
        </div>
      </div>
    </div>
  );
};
