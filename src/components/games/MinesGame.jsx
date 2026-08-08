import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { Bomb, Gem, ArrowLeft, RefreshCw, Volume2, ShieldCheck, DollarSign } from 'lucide-react';

export const MinesGame = ({ onBack }) => {
  const { currentUser, updateBalance, showToast, setDepositModalOpen } = useApp();

  const GRID_SIZE = 25; // 5x5 grid
  const [mineCount, setMineCount] = useState(3);
  const [betAmount, setBetAmount] = useState(50);
  
  // Game states
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'playing' | 'busted' | 'cashed_out'
  const [tiles, setTiles] = useState(Array(GRID_SIZE).fill({ revealed: false, isMine: false }));
  const [revealedCount, setRevealedCount] = useState(0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [minesPositions, setMinesPositions] = useState([]);

  // Calculate next multiplier based on revealed gem count & total mines
  const calculateMultiplier = (revealed) => {
    if (revealed === 0) return 1.0;
    // Formula approximation for Stake Mines: combination math
    let totalCombinations = 1;
    for (let i = 0; i < revealed; i++) {
      totalCombinations *= (GRID_SIZE - i) / (GRID_SIZE - mineCount - i);
    }
    return Math.max(1.05, parseFloat((totalCombinations * 0.99).toFixed(2)));
  };

  // Start new Mines Game
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

    // Deduct bet amount
    updateBalance(betAmount, false);

    // Randomly place mines
    const positions = new Set();
    while (positions.size < mineCount) {
      positions.add(Math.floor(Math.random() * GRID_SIZE));
    }
    setMinesPositions(Array.from(positions));

    // Reset grid
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

  // Click Grid Tile
  const handleTileClick = (index) => {
    if (gameState !== 'playing' || tiles[index].revealed) return;

    // Check if clicked mine or gem
    if (tiles[index].isMine) {
      // BUSTED! Reveal all mines
      setTiles(prev => prev.map(t => ({ ...t, revealed: true })));
      setGameState('busted');
      showToast(`BOOM! You hit a mine. Lost ₹${betAmount}`, 'error');
    } else {
      // GEM REVEALED!
      const nextRevealed = revealedCount + 1;
      const nextMult = calculateMultiplier(nextRevealed);

      setTiles(prev => prev.map((t, idx) => idx === index ? { ...t, revealed: true } : t));
      setRevealedCount(nextRevealed);
      setCurrentMultiplier(nextMult);

      // Auto check if all gems revealed
      if (nextRevealed === GRID_SIZE - mineCount) {
        handleCashout(nextMult);
      }
    }
  };

  // Cash out current winnings
  const handleCashout = (multToUse) => {
    const mult = multToUse || currentMultiplier;
    const winnings = Math.round(betAmount * mult);
    updateBalance(winnings, true);

    // Trigger celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Reveal full grid
    setTiles(prev => prev.map(t => ({ ...t, revealed: true })));
    setGameState('cashed_out');
    showToast(`🎉 CASHED OUT! Won ₹${winnings.toLocaleString()} (${mult}x multiplier)`);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Top Game Navbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button className="btn btn-outline" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Games
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bomb size={24} color="var(--primary-green)" />
          <h2 style={{ fontSize: '1.6rem', color: '#fff' }}>Stake Mines</h2>
        </div>
        <div className="badge badge-green">
          <ShieldCheck size={14} /> Provably Fair
        </div>
      </div>

      {/* Main Game Interface Container */}
      <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', padding: '24px', borderRadius: 'var(--radius-xl)' }}>
        
        {/* Left Side: Bet Controls Panel */}
        <div style={{
          background: 'var(--bg-dark)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between'
        }}>
          <div>
            {/* Bet Amount Input */}
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

            {/* Mines Count Selector */}
            <div className="form-group" style={{ marginTop: '16px' }}>
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

            {/* Live Stats */}
            <div style={{
              background: 'var(--bg-input)',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              margin: '20px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Next Tile Multiplier:</span>
                <strong style={{ color: 'var(--primary-green)' }}>
                  {calculateMultiplier(revealedCount + 1)}x
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Current Profit:</span>
                <strong style={{ color: 'var(--accent-gold)' }}>
                  ₹{Math.round(betAmount * currentMultiplier - betAmount)}
                </strong>
              </div>
            </div>
          </div>

          {/* Action Button: Start or Cash Out */}
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

        {/* Right Side: 5x5 Mines Grid */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justify: 'center'
        }}>
          {/* Multiplier Banner */}
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.8rem',
            fontWeight: '800',
            color: gameState === 'busted' ? 'var(--accent-red)' : 'var(--primary-green)',
            marginBottom: '16px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {gameState === 'playing' && (
              <span>{currentMultiplier}x Multiplier ({revealedCount} Gems)</span>
            )}
            {gameState === 'cashed_out' && (
              <span style={{ color: 'var(--accent-gold)' }}>CASHED OUT: {currentMultiplier}x Multiplier!</span>
            )}
            {gameState === 'busted' && (
              <span>BOOM! Hit a Mine</span>
            )}
            {gameState === 'idle' && (
              <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Click "Bet & Play" to reveal Gems</span>
            )}
          </div>

          {/* 5x5 Grid Tiles */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '12px',
            width: '100%',
            maxWidth: '450px',
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
                  fontSize: '2rem',
                  transition: 'transform 0.15s ease, background 0.2s ease',
                  boxShadow: tile.revealed && !tile.isMine ? '0 0 15px var(--primary-green-glow)' : 'none'
                }}
              >
                {tile.revealed ? (
                  tile.isMine ? '💣' : '💎'
                ) : (
                  <span style={{ opacity: 0.15, fontSize: '1rem', color: '#fff' }}>●</span>
                )}
              </button>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
