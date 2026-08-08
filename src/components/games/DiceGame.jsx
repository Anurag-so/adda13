import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { Dices, ArrowLeft, ShieldCheck } from 'lucide-react';

export const DiceGame = ({ onBack }) => {
  const { currentUser, updateBalance, showToast, setDepositModalOpen } = useApp();

  const [betAmount, setBetAmount] = useState(100);
  const [targetValue, setTargetValue] = useState(50);
  const [isRollOver, setIsRollOver] = useState(true);

  const [rolling, setRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [history, setHistory] = useState([
    { roll: 64.21, win: true, amount: 198 },
    { roll: 23.10, win: false, amount: -100 }
  ]);

  const winChance = isRollOver ? (100 - targetValue) : targetValue;
  const multiplier = winChance > 0 ? parseFloat((99 / winChance).toFixed(2)) : 0;
  const potentialPayout = Math.round(betAmount * multiplier);

  const handleRollDice = () => {
    if (!currentUser) {
      showToast('Please login to play!', 'error');
      return;
    }
    if (currentUser.balance < betAmount) {
      showToast('Insufficient balance! Deposit funds via WhatsApp.', 'error');
      setDepositModalOpen(true);
      return;
    }

    updateBalance(betAmount, false);
    setRolling(true);
    setLastRoll(null);
    setLastResult(null);

    setTimeout(() => {
      const rolledNumber = parseFloat((Math.random() * 100).toFixed(2));
      const won = isRollOver ? (rolledNumber > targetValue) : (rolledNumber < targetValue);

      setLastRoll(rolledNumber);
      setRolling(false);

      if (won) {
        setLastResult('win');
        updateBalance(potentialPayout, true);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        showToast(`🎉 WON ₹${potentialPayout.toLocaleString()}! Rolled ${rolledNumber}`);
        setHistory(prev => [{ roll: rolledNumber, win: true, amount: potentialPayout }, ...prev.slice(0, 7)]);
      } else {
        setLastResult('loss');
        showToast(`Loss! Rolled ${rolledNumber}`, 'error');
        setHistory(prev => [{ roll: rolledNumber, win: false, amount: -betAmount }, ...prev.slice(0, 7)]);
      }
    }, 600);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button className="btn btn-outline btn-sm" onClick={onBack}>
          <ArrowLeft size={14} /> Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Dices size={20} color="var(--accent-gold)" />
          <h2 style={{ fontSize: '1.3rem', color: '#fff' }}>Stake Dice</h2>
        </div>
        <div className="badge badge-gold mobile-hide">
          <ShieldCheck size={12} /> Fair
        </div>
      </div>

      <div className="glass-panel game-layout-grid" style={{ padding: '16px', borderRadius: 'var(--radius-xl)' }}>
        
        {/* Controls */}
        <div style={{
          background: 'var(--bg-dark)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          gap: '16px'
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
                disabled={rolling}
                onChange={(e) => setBetAmount(Math.max(10, parseInt(e.target.value) || 0))}
              />
            </div>

            <div className="form-group">
              <div className="form-label">
                <span>Condition</span>
                <span style={{ color: 'var(--accent-gold)' }}>
                  {isRollOver ? `Over > ${targetValue}` : `Under < ${targetValue}`}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                <button
                  className={`btn btn-sm ${isRollOver ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setIsRollOver(true)}
                  style={{ flex: 1 }}
                >
                  Over (&gt;)
                </button>
                <button
                  className={`btn btn-sm ${!isRollOver ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setIsRollOver(false)}
                  style={{ flex: 1 }}
                >
                  Under (&lt;)
                </button>
              </div>

              <input
                type="range"
                min="2"
                max="98"
                step="1"
                value={targetValue}
                onChange={(e) => setTargetValue(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary-green)' }}
              />
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg glow-active"
            disabled={rolling}
            onClick={handleRollDice}
            style={{ width: '100%' }}
          >
            {rolling ? 'Rolling...' : `Roll Dice (Win ₹${potentialPayout})`}
          </button>
        </div>

        {/* Visualizer */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justify: 'center'
        }}>
          <div style={{
            width: '160px',
            height: '110px',
            borderRadius: 'var(--radius-xl)',
            background: lastResult === 'win' 
              ? 'rgba(0, 231, 1, 0.15)' 
              : lastResult === 'loss' 
              ? 'rgba(255, 77, 77, 0.15)' 
              : 'var(--bg-dark)',
            border: lastResult === 'win' ? '2px solid var(--primary-green)' : lastResult === 'loss' ? '2px solid var(--accent-red)' : '1px solid var(--bg-accent)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justify: 'center',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {rolling ? 'ROLLING...' : lastRoll !== null ? (lastResult === 'win' ? 'WIN!' : 'MISS') : 'READY'}
            </span>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.5rem',
              fontWeight: '900',
              color: lastResult === 'win' ? 'var(--primary-green)' : lastResult === 'loss' ? 'var(--accent-red)' : '#fff'
            }}>
              {rolling ? '??.??' : lastRoll !== null ? lastRoll.toFixed(2) : '50.00'}
            </span>
          </div>

          {/* Probability Bar */}
          <div style={{ width: '100%', maxWidth: '400px', marginBottom: '20px' }}>
            <div style={{ height: '14px', borderRadius: '8px', background: 'var(--bg-accent)', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute',
                left: isRollOver ? `${targetValue}%` : '0',
                width: isRollOver ? `${100 - targetValue}%` : `${targetValue}%`,
                height: '100%',
                background: 'var(--primary-green)'
              }} />
            </div>
          </div>

          {/* History */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', maxWidth: '100%', padding: '4px' }}>
            {history.map((item, idx) => (
              <div key={idx} style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                background: item.win ? 'rgba(0, 231, 1, 0.15)' : 'rgba(255, 77, 77, 0.15)',
                border: item.win ? '1px solid var(--primary-green)' : '1px solid var(--accent-red)',
                color: item.win ? 'var(--primary-green)' : 'var(--accent-red)',
                fontSize: '0.75rem',
                fontWeight: '700'
              }}>
                {item.roll.toFixed(2)}
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
