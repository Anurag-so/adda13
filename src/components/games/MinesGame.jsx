import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { Bomb, ArrowLeft, ShieldCheck } from 'lucide-react';

export const MinesGame = ({ onBack }) => {
  const { currentUser, updateBalance, showToast, setDepositModalOpen } = useApp();

  const GRID_SIZE = 25;
  const [mineCount, setMineCount] = useState(3);
  const [betAmount, setBetAmount] = useState(50);
  
  const [gameState, setGameState] = useState('idle');
  const [tiles, setTiles] = useState(Array(GRID_SIZE).fill({ revealed: false, isMine: false }));
  const [revealedCount, setRevealedCount] = useState(0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);

  const calculateMultiplier = (revealed) => {
    if (revealed === 0) return 1.0;
    let totalCombinations = 1;
    for (let i = 0; i < revealed; i++) {
      totalCombinations *= (GRID_SIZE - i) / (GRID_SIZE - mineCount - i);
    }
    return Math.max(1.05, parseFloat((totalCombinations * 0.99).toFixed(2)));
  };

  const handleStartGame = () => {
    if (!currentUser) {
      showToast('Please login to play!', 'error');
      return;
    }
    if (currentUser.balance < betAmount) {
      showToast('Insufficient balance! Please deposit money.', 'error');
      setDepositModalOpen(true);
      return;
    }

    updateBalance(betAmount, false);

    const positions = new Set();
    while (positions.size < mineCount) {
      positions.add(Math.floor(Math.random() * GRID_SIZE));
    }

    const newGrid = Array(GRID_SIZE).fill(null).map((_, idx) => ({
      id: idx,
      revealed: false,
      isMine: positions.has(idx)
    }));

    setTiles(newGrid);
    setRevealedCount(0);
    setCurrentMultiplier(1.0);
    setGameState('playing');
  };

  const handleTileClick = (index) => {
    if (gameState !== 'playing' || tiles[index].revealed) return;

    if (tiles[index].isMine) {
      setTiles(prev => prev.map(t => ({ ...t, revealed: true })));
      setGameState('busted');
      showToast(`BOOM! You hit a mine. Lost ₹${betAmount}`, 'error');
    } else {
      const nextRevealed = revealedCount + 1;
      const nextMult = calculateMultiplier(nextRevealed);

      setTiles(prev => prev.map((t, idx) => idx === index ? { ...t, revealed: true } : t));
      setRevealedCount(nextRevealed);
      setCurrentMultiplier(nextMult);

      if (nextRevealed === GRID_SIZE - mineCount) {
        handleCashout(nextMult);
      }
    }
  };

  const handleCashout = (multToUse) => {
    const mult = multToUse || currentMultiplier;
    const winnings = Math.round(betAmount * mult);
    updateBalance(winnings, true);

    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    setTiles(prev => prev.map(t => ({ ...t, revealed: true })));
    setGameState('cashed_out');
    showToast(`🎉 CASHED OUT! Won ₹${winnings.toLocaleString()} (${mult}x multiplier)`);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Top Game Navbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button className="btn btn-outline btn-sm" onClick={onBack}>
          <ArrowLeft size={14} /> Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Bomb size={20} color="var(--primary-green)" />
          <h2 style={{ fontSize: '1.3rem', color: '#fff' }}>Stake Mines</h2>
        </div>
        <div className="badge badge-green mobile-hide">
          <ShieldCheck size={12} /> Fair
        </div>
      </div>

      {/* Main Game Grid Container */}
      <div className="glass-panel game-layout-grid" style={{ padding: '16px', borderRadius: 'var(--radius-xl)' }}>
        
        {/* Bet Controls Panel */}
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
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="number"
                  className="form-input"
                  value={betAmount}
                  disabled={gameState === 'playing'}
                  onChange={(e) => setBetAmount(Math.max(10, parseInt(e.target.value) || 0))}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={gameState === 'playing'}
                  onClick={() => setBetAmount(prev => Math.max(10, Math.floor(prev / 2)))}
                >
                  ½
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={gameState === 'playing'}
                  onClick={() => setBetAmount(prev => prev * 2)}
                >
                  2x
                </button>
              </div>
            </div>

            <div className="form-group">
              <div className="form-label">
                <span>Mines Count ({mineCount} Mines)</span>
                <span>Gems: {GRID_SIZE - mineCount}</span>
              </div>
              <select
                className="form-input"
                value={mineCount}
                disabled={gameState === 'playing'}
                onChange={(e) => setMineCount(parseInt(e.target.value))}
              >
                {[1, 2, 3, 5, 10, 15, 20, 24].map(n => (
                  <option key={n} value={n}>{n} Mines ({GRID_SIZE - n} Gems)</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Button */}
          {gameState === 'playing' ? (
            <button
              className="btn btn-primary btn-lg glow-active"
              disabled={revealedCount === 0}
              onClick={() => handleCashout()}
              style={{ width: '100%' }}
            >
              Cash Out (₹{Math.round(betAmount * currentMultiplier)})
            </button>
          ) : (
            <button
              className="btn btn-primary btn-lg"
              onClick={handleStartGame}
              style={{ width: '100%' }}
            >
              Bet & Play (₹{betAmount})
            </button>
          )}
        </div>

        {/* 5x5 Mines Grid */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justify: 'center'
        }}>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.4rem',
            fontWeight: '800',
            color: gameState === 'busted' ? 'var(--accent-red)' : 'var(--primary-green)',
            marginBottom: '12px',
            minHeight: '32px',
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            {gameState === 'playing' && <span>{currentMultiplier}x ({revealedCount} Gems)</span>}
            {gameState === 'cashed_out' && <span style={{ color: 'var(--accent-gold)' }}>CASHED OUT: {currentMultiplier}x!</span>}
            {gameState === 'busted' && <span>BOOM! Hit a Mine</span>}
            {gameState === 'idle' && <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Click "Bet & Play" to start</span>}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '8px',
            width: '100%',
            maxWidth: '380px',
            aspectRatio: '1/1'
          }}>
            {tiles.map((tile, idx) => (
              <button
                key={idx}
                disabled={gameState !== 'playing' || tile.revealed}
                onClick={() => handleTileClick(idx)}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 'var(--radius-md)',
                  border: tile.revealed 
                    ? (tile.isMine ? '2px solid var(--accent-red)' : '2px solid var(--primary-green)')
                    : '1px solid var(--bg-accent)',
                  background: tile.revealed
                    ? (tile.isMine ? 'rgba(255, 77, 77, 0.2)' : 'rgba(0, 231, 1, 0.2)')
                    : 'var(--bg-accent)',
                  cursor: (gameState === 'playing' && !tile.revealed) ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  touchAction: 'manipulation'
                }}
              >
                {tile.revealed ? (tile.isMine ? '💣' : '💎') : <span style={{ opacity: 0.15, fontSize: '0.8rem', color: '#fff' }}>●</span>}
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
