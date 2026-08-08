import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { Dices, ArrowLeft, RefreshCw, ShieldCheck, Zap } from 'lucide-react';

export const DiceGame = ({ onBack }) => {
  const { currentUser, updateBalance, showToast, setDepositModalOpen } = useApp();

  const [betAmount, setBetAmount] = useState(100);
  const [targetValue, setTargetValue] = useState(50);
  const [isRollOver, setIsRollOver] = useState(true);

  const [rolling, setRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState(null);
  const [lastResult, setLastResult] = useState(null); // 'win' | 'loss' | null
  const [history, setHistory] = useState([
    { roll: 64.21, win: true, amount: 198 },
    { roll: 23.10, win: false, amount: -100 },
    { roll: 88.50, win: true, amount: 198 }
  ]);

  // Win chance calculations
  const winChance = isRollOver ? (100 - targetValue) : targetValue;
  const multiplier = winChance > 0 ? parseFloat((99 / winChance).toFixed(2)) : 0;
  const potentialPayout = Math.round(betAmount * multiplier);

  // Roll execution handler
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

    // Deduct bet
    updateBalance(betAmount, false);
    setRolling(true);
    setLastRoll(null);
    setLastResult(null);

    // Roll animation sequence
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
        showToast(`Loss! Rolled ${rolledNumber} (Needed ${isRollOver ? '>' : '<'} ${targetValue})`, 'error');
        setHistory(prev => [{ roll: rolledNumber, win: false, amount: -betAmount }, ...prev.slice(0, 7)]);
      }
    }, 600);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Game Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button className="btn btn-outline" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Games
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Dices size={24} color="var(--accent-gold)" />
          <h2 style={{ fontSize: '1.6rem', color: '#fff' }}>Stake Dice</h2>
        </div>
        <div className="badge badge-gold">
          <ShieldCheck size={14} /> 99% Provably Fair
        </div>
      </div>

      {/* Main Game Card */}
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
                disabled={rolling}
                onChange={(e) => setBetAmount(Math.max(10, parseInt(e.target.value) || 0))}
              />
            </div>

            {/* Target Value Slider */}
            <div className="form-group" style={{ marginTop: '16px' }}>
              <div className="form-label">
                <span>Roll Condition</span>
                <span style={{ color: 'var(--accent-gold)' }}>
                  {isRollOver ? `Roll Over > ${targetValue}` : `Roll Under < ${targetValue}`}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <button
                  className={`btn btn-sm ${isRollOver ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setIsRollOver(true)}
                  style={{ flex: 1 }}
                >
                  Roll Over (&gt;)
                </button>
                <button
                  className={`btn btn-sm ${!isRollOver ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setIsRollOver(false)}
                  style={{ flex: 1 }}
                >
                  Roll Under (&lt;)
                </button>
              </div>

              <input
                type="range"
                min="2"
                max="98"
                step="1"
                value={targetValue}
                onChange={(e) => setTargetValue(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary-green)', cursor: 'pointer' }}
              />
            </div>

            {/* Calculations Box */}
            <div style={{
              background: 'var(--bg-input)',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              margin: '20px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Multiplier:</span>
                <strong style={{ color: 'var(--primary-green)' }}>{multiplier}x</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Win Chance:</span>
                <strong style={{ color: '#fff' }}>{winChance.toFixed(2)}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Profit on Win:</span>
                <strong style={{ color: 'var(--accent-gold)' }}>₹{potentialPayout - betAmount}</strong>
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg glow-active"
            disabled={rolling}
            onClick={handleRollDice}
            style={{ width: '100%' }}
          >
            {rolling ? 'Rolling Dice...' : `Roll Dice (Win ₹${potentialPayout})`}
          </button>
        </div>

        {/* Right Side: Roll Visualizer */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justify: 'center',
          position: 'relative'
        }}>
          {/* Roll Result Display Box */}
          <div style={{
            width: '200px',
            height: '140px',
            borderRadius: 'var(--radius-xl)',
            background: lastResult === 'win' 
              ? 'rgba(0, 231, 1, 0.15)' 
              : lastResult === 'loss' 
              ? 'rgba(255, 77, 77, 0.15)' 
              : 'var(--bg-dark)',
            border: lastResult === 'win'
              ? '2px solid var(--primary-green)'
              : lastResult === 'loss'
              ? '2px solid var(--accent-red)'
              : '1px solid var(--bg-accent)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justify: 'center',
            marginBottom: '28px',
            boxShadow: lastResult === 'win' ? '0 0 30px var(--primary-green-glow)' : 'none',
            transition: 'all 0.3s ease'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {rolling ? 'ROLLING...' : lastRoll !== null ? (lastResult === 'win' ? 'VICTORY!' : 'MISSED') : 'READY'}
            </span>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '3.2rem',
              fontWeight: '900',
              color: lastResult === 'win' ? 'var(--primary-green)' : lastResult === 'loss' ? 'var(--accent-red)' : '#fff'
            }}>
              {rolling ? '??.??' : lastRoll !== null ? lastRoll.toFixed(2) : '50.00'}
            </span>
          </div>

          {/* Probability Track Bar */}
          <div style={{ width: '100%', maxWidth: '500px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <span>0.00</span>
              <span>25.00</span>
              <span>50.00</span>
              <span>75.00</span>
              <span>100.00</span>
            </div>
            <div style={{
              height: '16px',
              borderRadius: '8px',
              background: 'var(--bg-accent)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                left: isRollOver ? `${targetValue}%` : '0',
                width: isRollOver ? `${100 - targetValue}%` : `${targetValue}%`,
                height: '100%',
                background: 'var(--primary-green)',
                boxShadow: '0 0 10px var(--primary-green-glow)'
              }} />
            </div>
          </div>

          {/* Roll History Ticker */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', maxWidth: '100%', padding: '4px' }}>
            {history.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: item.win ? 'rgba(0, 231, 1, 0.15)' : 'rgba(255, 77, 77, 0.15)',
                  border: item.win ? '1px solid var(--primary-green)' : '1px solid var(--accent-red)',
                  color: item.win ? 'var(--primary-green)' : 'var(--accent-red)',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  whiteSpace: 'nowrap'
                }}
              >
                {item.roll.toFixed(2)}
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
