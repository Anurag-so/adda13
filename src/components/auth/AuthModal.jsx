import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export const AuthModal = () => {
  const { authModalOpen, setAuthModalOpen, loginUser } = useApp();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(username || (tab === 'register' ? 'NewGamer' : 'PlayerOne'), email || 'player@stake.com');
  };

  return (
    <div className="modal-overlay" onClick={() => setAuthModalOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        
        {/* Header Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)' }}>
          <button
            style={{
              flex: 1,
              padding: '16px',
              border: 'none',
              background: tab === 'login' ? 'var(--bg-card)' : 'var(--bg-dark)',
              color: tab === 'login' ? '#fff' : 'var(--text-muted)',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              borderBottom: tab === 'login' ? '2px solid var(--primary-green)' : 'none'
            }}
            onClick={() => setTab('login')}
          >
            Sign In
          </button>
          <button
            style={{
              flex: 1,
              padding: '16px',
              border: 'none',
              background: tab === 'register' ? 'var(--bg-card)' : 'var(--bg-dark)',
              color: tab === 'register' ? '#fff' : 'var(--text-muted)',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              borderBottom: tab === 'register' ? '2px solid var(--primary-green)' : 'none'
            }}
            onClick={() => setTab('register')}
          >
            Register
          </button>
          <button className="modal-close" onClick={() => setAuthModalOpen(false)} style={{ margin: '12px 16px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-body">
          
          {tab === 'register' && (
            <div className="form-group">
              <label className="form-label">Username</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Choose username (e.g. AlexWinner)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                className="form-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '38px' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '38px' }}
                required
              />
            </div>
          </div>

          {tab === 'register' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <CheckCircle2 size={16} color="var(--primary-green)" />
              <span>Get ₹500 Welcome Bonus Tokens on Registration</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '8px' }}>
            {tab === 'login' ? 'Sign In to Account' : 'Create Free Account'}
          </button>

          {/* Quick Demo Fill Buttons */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-light)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '10px' }}>
              Quick One-Click Demo Login
            </span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ flex: 1 }}
                onClick={() => loginUser('PlayerOne', 'player@stake.com')}
              >
                Demo Gamer (₹1,500)
              </button>
              <button
                type="button"
                className="btn btn-gold btn-sm"
                style={{ flex: 1 }}
                onClick={() => loginUser('VipRoller', 'vip@roller.org')}
              >
                VIP Roller (₹45,000)
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
