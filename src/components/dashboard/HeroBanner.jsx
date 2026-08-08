import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, MessageCircle, Play, Shield, Users, Trophy, Zap } from 'lucide-react';

export const HeroBanner = ({ onQuickPlay }) => {
  const { setDepositModalOpen } = useApp();
  const [jackpot, setJackpot] = useState(1284950);

  // Increment jackpot counter continuously
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpot(prev => prev + Math.floor(Math.random() * 15) + 5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ marginBottom: '28px' }}>
      {/* Hero Banner Container */}
      <div 
        className="glass-panel" 
        style={{
          background: 'linear-gradient(135deg, #112233 0%, #1a2c38 50%, #0f212e 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '32px 36px',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(0, 231, 1, 0.2)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Decorative background glow */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(0, 231, 1, 0.18) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          
          <div style={{ maxWidth: '580px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }} className="badge badge-green">
              <Zap size={14} /> Instant WhatsApp Deposits & Cashouts
            </div>

            <h1 style={{ fontSize: '2.4rem', color: '#fff', lineHeight: 1.15, marginBottom: '14px' }}>
              Play Casino Games & Win <span style={{ color: 'var(--primary-green)' }}>Real Money</span>
            </h1>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
              Deposit via WhatsApp chat within 1 minute. Play provably fair Mines, Dice & Wheel games. Get 24/7 instant manual withdrawals.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-primary btn-lg glow-active"
                onClick={() => setDepositModalOpen(true)}
              >
                <MessageCircle size={20} />
                Deposit via WhatsApp
              </button>

              <button 
                className="btn btn-gold btn-lg"
                onClick={onQuickPlay}
              >
                <Play size={20} />
                Play Mines Game
              </button>
            </div>
          </div>

          {/* Jackpot Display Card */}
          <div style={{
            background: 'rgba(15, 33, 46, 0.85)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            minWidth: '280px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--accent-gold)', marginBottom: '8px' }}>
              <Trophy size={20} />
              <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Mega Progressive Jackpot
              </span>
            </div>

            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.1rem',
              fontWeight: '900',
              color: 'var(--accent-gold)',
              textShadow: '0 0 15px rgba(255, 199, 0, 0.4)',
              letterSpacing: '1px'
            }}>
              ₹{jackpot.toLocaleString()}
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '8px' }}>
              Triggered randomly on Mines & Dice bets!
            </div>
          </div>

        </div>
      </div>

      {/* Realtime Stats Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginTop: '16px'
      }}>
        <div className="glass-panel" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Users size={24} color="var(--primary-green)" />
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>12,840+</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Online Players</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Trophy size={24} color="var(--accent-gold)" />
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>₹4,92,500</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Won Today</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Zap size={24} color="var(--accent-cyan)" />
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>&lt; 2 Mins</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>WhatsApp Deposit Speed</div>
          </div>
        </div>
      </div>
    </div>
  );
};
