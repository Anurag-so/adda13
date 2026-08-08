import React from 'react';
import { Flame, Sparkles, Gamepad2, TrendingUp } from 'lucide-react';

export const MobileCategoryBar = ({ activeCategory, setActiveCategory }) => {
  const categories = [
    { id: 'all', label: 'All Games', icon: Flame },
    { id: 'originals', label: 'Stake Originals', icon: Gamepad2 },
    { id: 'slots', label: 'Slots & Mega', icon: Sparkles },
    { id: 'instant', label: 'Instant Crash', icon: TrendingUp },
  ];

  return (
    <div className="mobile-category-bar">
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
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <Icon size={14} />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};
