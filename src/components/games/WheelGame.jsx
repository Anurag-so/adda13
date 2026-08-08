import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { Disc, ArrowLeft, ShieldCheck, Trophy, Sparkles } from 'lucide-react';

export const WheelGame = ({ onBack }) => {
  const { currentUser, updateBalance, showToast, setDepositModalOpen } = useApp();

  const [betAmount, setBetAmount] = useState(100);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [lastWin, setLastWin] = useState(null);

  const segments = [
    { label: '0x', mult: 0, color: '#2f4553' },
    { label: '1.5x', mult: 1.5, color: '#1475e1' },
    { label: '1.2x', mult: 1.2, color: '#00f0ff' },
    { label: '2.0x', mult: 2.0, color: '#00e701' },
    { label: '0x', mult: 0, color: '#2f4553' },
    { label: '3.0x', mult: 3.0, color: '#9d4edd' },
    { label: '1.5x', mult: 1.5, color: '#1475e1' },
    { label: '5.0x', mult: 5.0, color: '#ffc700' },
    { label: '0x', mult: 0, color: '#2f4553' },
    { label: '10.0x', mult: 10.0, color: '#ff4d4d' }
  ];

  const handleSpinWheel = () => {
    if (!currentUser) {
      showToast('Please login to play!', 'error');
      return;
    }
    if (currentUser.balance < betAmount) {
      showToast('Insufficient balance! Deposit via WhatsApp.', 'error');
      setDepositModalOpen(true);
      return;
    }

    updateBalance(betAmount, false);
    setSpinning(true);
    setLastWin(null);

    // Pick random winning segment
    const winningIndex = Math.floor(Math.random() * segments.length);
    const winningSegment = segments[winningIndex];

    // Calculate rotation degree (360 / 10 = 36 deg per segment)
    const segmentAngle = 360 / segments.length;
    const targetAngle = 3600 + (360 - (winningIndex * segmentAngle + segmentAngle / 2));
    
    setRotation(prev => prev + targetAngle);

    setTimeout(() => {
      setSpinning(false);
      const payout = Math.round(betAmount * winningSegment.mult);

      if (winningSegment.mult > 0) {
        updateBalance(payout, true);
        setLastWin(payout);
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        showToast(`🎉 WON ₹${payout.toLocaleString()}! (${winningSegment.mult}x multiplier)`);
      } else {
        showToast(`No luck! Wheel landed on 0x`, 'error');
      }
    }, 3000);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button className="btn btn-outline" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Games
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Disc size={24} color="var(--accent-cyan)" />
          <h2 style={{ fontSize: '1.6rem', color: '#fff' }}>Spin Wheel Casino</h2>
        </div>
        <div className="badge badge-purple">
          <ShieldCheck size={14} /> Instant Payouts
        </div>
      </div>

      {/* Main Container */}
      <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', padding: '24px', borderRadius: 'var(--radius-xl)' }}>
        
        {/* Left Side: Bet Controls */}
        <div style={{
          background: 'var(--bg-dark)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between'
        }}>
          <div>
            <div className="form-group">
              <div className="form-label">
                <span>Bet Amount (₹)</span>
                <span>Bal: ₹{currentUser?.balance || 0}</span>
              </div>
              <input
                type="number"
                className="form-input"
                value={betAmount}
                disabled={spinning}
                onChange={(e) => setBetAmount(Math.max(10, parseInt(e.target.value) || 0))}
              />
            </div>

            {/* Segment Payout Legend */}
            <div style={{ margin: '20px 0' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '10px' }}>
                Wheel Payout Multipliers:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <div style={{ background: 'var(--bg-input)', padding: '8px', borderRadius: '6px', fontSize: '0.8rem', color: '#00f0ff', fontWeight: '700' }}>
                  1.2x & 1.5x (Safe)
                </div>
                <div style={{ background: 'var(--bg-input)', padding: '8px', borderRadius: '6px', fontSize: '0.8rem', color: '#00e701', fontWeight: '700' }}>
                  2.0x & 3.0x (Medium)
                </div>
                <div style={{ background: 'var(--bg-input)', padding: '8px', borderRadius: '6px', fontSize: '0.8rem', color: '#ffc700', fontWeight: '700' }}>
                  5.0x (High)
                </div>
                <div style={{ background: 'var(--bg-input)', padding: '8px', borderRadius: '6px', fontSize: '0.8rem', color: '#ff4d4d', fontWeight: '700' }}>
                  10.0x (Jackpot)
                </div>
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg glow-active"
            disabled={spinning}
            onClick={handleSpinWheel}
            style={{ width: '100%' }}
          >
            {spinning ? 'Spinning Wheel...' : `Spin Wheel (₹${betAmount})`}
          </button>
        </div>

        {/* Right Side: Animated Wheel Canvas/SVG */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justify: 'center',
          position: 'relative'
        }}>
          
          {/* Wheel Pointer Arrow */}
          <div style={{
            width: 0,
            height: 0,
            borderLeft: '14px solid transparent',
            borderRight: '14px solid transparent',
            borderTop: '24px solid var(--accent-gold)',
            zIndex: 10,
            marginBottom: '-10px',
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))'
          }} />

          {/* Rotating SVG Wheel */}
          <div style={{
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            position: 'relative',
            transition: 'transform 3s cubic-bezier(0.15, 0.9, 0.2, 1)',
            transform: `rotate(${rotation}deg)`,
            boxShadow: '0 0 30px rgba(0, 240, 255, 0.2), 0 0 10px rgba(0,0,0,0.8)'
          }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', borderRadius: '50%' }}>
              {segments.map((seg, i) => {
                const angle = 360 / segments.length;
                const startAngle = i * angle;
                const endAngle = (i + 1) * angle;
                
                const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);

                const d = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                return (
                  <g key={i}>
                    <path d={d} fill={seg.color} stroke="var(--bg-dark)" strokeWidth="0.8" />
                    <text
                      x="50"
                      y="18"
                      fill="#fff"
                      fontSize="5"
                      fontWeight="bold"
                      textAnchor="middle"
                      transform={`rotate(${startAngle + angle / 2}, 50, 50)`}
                    >
                      {seg.label}
                    </text>
                  </g>
                );
              })}
              {/* Wheel Center Cap */}
              <circle cx="50" cy="50" r="12" fill="var(--bg-dark)" stroke="var(--border-light)" strokeWidth="1" />
              <text x="50" y="52" fill="var(--primary-green)" fontSize="6" fontWeight="bold" textAnchor="middle">SPIN</text>
            </svg>
          </div>

        </div>

      </div>

    </div>
  );
};
