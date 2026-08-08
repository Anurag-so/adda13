import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Users, Search, Sparkles } from 'lucide-react';

export const GameGrid = ({ activeCategory, onSelectGame }) => {
  const { games } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeCategory === 'all') return matchesSearch;
    if (activeCategory === 'originals') return matchesSearch && game.category === 'Stake Originals';
    if (activeCategory === 'slots') return matchesSearch && (game.category === 'Slots' || game.category === 'Casino');
    if (activeCategory === 'instant') return matchesSearch && game.category === 'Instant Games';
    return matchesSearch;
  });

  return (
    <div style={{ marginTop: '20px' }}>
      {/* Header bar with title and search */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="var(--primary-green)" />
          <h2 style={{ fontSize: '1.25rem', color: '#fff' }}>Available Games</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-accent)', padding: '2px 8px', borderRadius: '12px' }}>
            {filteredGames.length}
          </span>
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', width: '220px' }}>
          <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '34px', height: '36px', fontSize: '0.8rem' }}
          />
        </div>
      </div>

      {/* Game Cards Grid */}
      <div className="grid-4">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="glass-panel card-hover"
            style={{
              padding: '0',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              cursor: game.active ? 'pointer' : 'not-allowed',
              opacity: game.active ? 1 : 0.6,
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)'
            }}
            onClick={() => game.active && onSelectGame(game.id)}
          >
            {/* Thumbnail Banner */}
            <div style={{
              height: '140px',
              background: game.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3.5rem',
              position: 'relative',
              userSelect: 'none'
            }}>
              <span>{game.image}</span>

              {/* Badge top-right */}
              <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                <span className={`badge ${game.badge === 'Popular' ? 'badge-green' : game.badge === 'Hot' ? 'badge-gold' : 'badge-purple'}`}>
                  {game.badge}
                </span>
              </div>

              {/* Live Players count bottom-left */}
              <div style={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                background: 'rgba(15, 33, 46, 0.75)',
                backdropFilter: 'blur(4px)',
                padding: '2px 8px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.7rem',
                color: '#fff'
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--primary-green)' }}></span>
                <Users size={10} /> {game.players}
              </div>
            </div>

            {/* Game Info Details */}
            <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1rem', color: '#fff', fontWeight: '800' }}>{game.name}</h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: '700' }}>
                  {game.payoutRate}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                <span>Fee: <strong style={{ color: '#fff' }}>₹{game.minBet}</strong></span>
                <span>{game.category}</span>
              </div>

              {/* Play Button */}
              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: 'auto', width: '100%', padding: '8px', fontSize: '0.85rem' }}
              >
                <Play size={14} fill="#0f212e" />
                Play Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
