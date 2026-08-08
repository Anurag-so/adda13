import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Users, Search, Sparkles, Trophy } from 'lucide-react';

export const GameGrid = ({ activeCategory, onSelectGame }) => {
  const { games } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter games based on search and category
  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeCategory === 'all') return matchesSearch;
    if (activeCategory === 'originals') return matchesSearch && game.category === 'Stake Originals';
    if (activeCategory === 'slots') return matchesSearch && (game.category === 'Slots' || game.category === 'Casino');
    if (activeCategory === 'instant') return matchesSearch && game.category === 'Instant Games';
    return matchesSearch;
  });

  return (
    <div>
      {/* Header bar with title and search */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={22} color="var(--primary-green)" />
          <h2 style={{ fontSize: '1.4rem', color: '#fff' }}>Available Games</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-accent)', padding: '2px 8px', borderRadius: '12px' }}>
            {filteredGames.length} Games
          </span>
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search game..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '38px', height: '40px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Game Cards Grid */}
      <div className="grid-3">
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
              opacity: game.active ? 1 : 0.6
            }}
            onClick={() => game.active && onSelectGame(game.id)}
          >
            {/* Visual Thumbnail Banner */}
            <div style={{
              height: '150px',
              background: game.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4.5rem',
              position: 'relative',
              userSelect: 'none'
            }}>
              <span>{game.image}</span>

              {/* Badge top-right */}
              <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                <span className={`badge ${game.badge === 'Popular' ? 'badge-green' : game.badge === 'Hot' ? 'badge-gold' : 'badge-purple'}`}>
                  {game.badge}
                </span>
              </div>

              {/* Live Players count bottom-left */}
              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '12px',
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                padding: '3px 8px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                color: '#fff'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-green)' }}></span>
                <Users size={12} /> {game.players} playing
              </div>
            </div>

            {/* Game Info Details */}
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>{game.name}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: '700' }}>
                  {game.payoutRate} RTP
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Entry Fee: <strong style={{ color: '#fff' }}>₹{game.minBet}</strong></span>
                <span>Category: {game.category}</span>
              </div>

              {/* Play Button */}
              <button
                className="btn btn-primary"
                style={{ marginTop: 'auto', width: '100%', padding: '10px' }}
              >
                <Play size={16} fill="#0f212e" />
                Play Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
