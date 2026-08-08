import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  ShieldCheck, 
  Wallet, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Search, 
  Gamepad2, 
  ArrowDownLeft, 
  ArrowUpRight, 
  TrendingUp,
  DollarSign,
  Plus
} from 'lucide-react';

export const AdminDashboard = () => {
  const { 
    usersList, 
    adminUpdateUserBalance, 
    depositRequests, 
    withdrawRequests, 
    adminApproveDeposit, 
    adminApproveWithdrawal,
    games,
    toggleGameStatus,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'deposits' | 'withdrawals' | 'games'
  const [userSearch, setUserSearch] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [newBalanceInput, setNewBalanceInput] = useState('');

  // Metrics
  const totalUsers = usersList.length;
  const totalDepositsSum = depositRequests.filter(r => r.status.includes('Approved')).reduce((sum, r) => sum + r.amount, 6000);
  const totalWithdrawalsSum = withdrawRequests.filter(r => r.status.includes('Approved')).reduce((sum, r) => sum + r.amount, 2000);
  const platformProfit = totalDepositsSum - totalWithdrawalsSum;

  const filteredUsers = usersList.filter(u => 
    u.username.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.id.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleSaveBalance = (userId) => {
    if (!newBalanceInput || isNaN(newBalanceInput)) {
      showToast('Enter valid balance amount', 'error');
      return;
    }
    adminUpdateUserBalance(userId, newBalanceInput);
    setEditingUserId(null);
    setNewBalanceInput('');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Top Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={28} color="var(--accent-gold)" />
            <h1 style={{ fontSize: '1.8rem', color: '#fff' }}>Admin Panel & User Control</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Manage user accounts, balances, WhatsApp payment requests, and game rules.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className={`btn ${activeTab === 'users' ? 'btn-gold' : 'btn-outline'}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={16} /> User Balances ({totalUsers})
          </button>
          <button 
            className={`btn ${activeTab === 'deposits' ? 'btn-gold' : 'btn-outline'}`}
            onClick={() => setActiveTab('deposits')}
          >
            <ArrowDownLeft size={16} /> WhatsApp Deposits
          </button>
          <button 
            className={`btn ${activeTab === 'withdrawals' ? 'btn-gold' : 'btn-outline'}`}
            onClick={() => setActiveTab('withdrawals')}
          >
            <ArrowUpRight size={16} /> Withdrawals
          </button>
          <button 
            className={`btn ${activeTab === 'games' ? 'btn-gold' : 'btn-outline'}`}
            onClick={() => setActiveTab('games')}
          >
            <Gamepad2 size={16} /> Game Settings
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
            Total Registered Users
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', marginTop: '4px' }}>
            {totalUsers}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
            Total WhatsApp Deposits
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--primary-green)', marginTop: '4px' }}>
            ₹{totalDepositsSum.toLocaleString()}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
            Total Withdrawals Payout
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--accent-gold)', marginTop: '4px' }}>
            ₹{totalWithdrawalsSum.toLocaleString()}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
            Net House Revenue
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--accent-cyan)', marginTop: '4px' }}>
            ₹{platformProfit.toLocaleString()}
          </div>
        </div>
      </div>

      {/* TAB 1: User Management & Balance Editor */}
      {activeTab === 'users' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>User Accounts & Balances</h3>
            
            {/* Search Input */}
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search by username or ID..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                style={{ paddingLeft: '38px', height: '38px', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>User ID</th>
                  <th style={{ padding: '12px' }}>Username</th>
                  <th style={{ padding: '12px' }}>Email</th>
                  <th style={{ padding: '12px' }}>Balance (₹)</th>
                  <th style={{ padding: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '12px', fontFamily: 'monospace', color: 'var(--accent-gold)' }}>{user.id}</td>
                    <td style={{ padding: '12px', fontWeight: '700', color: '#fff' }}>{user.username}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{user.email}</td>
                    <td style={{ padding: '12px' }}>
                      {editingUserId === user.id ? (
                        <input
                          type="number"
                          className="form-input"
                          value={newBalanceInput}
                          onChange={(e) => setNewBalanceInput(e.target.value)}
                          style={{ width: '110px', height: '32px', fontSize: '0.85rem', padding: '4px 8px' }}
                          autoFocus
                        />
                      ) : (
                        <strong style={{ color: 'var(--primary-green)', fontSize: '1rem' }}>
                          ₹{user.balance.toLocaleString()}
                        </strong>
                      )}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {editingUserId === user.id ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleSaveBalance(user.id)}
                          >
                            Save
                          </button>
                          <button 
                            className="btn btn-outline btn-sm"
                            onClick={() => setEditingUserId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setEditingUserId(user.id);
                            setNewBalanceInput(user.balance.toString());
                          }}
                        >
                          <Edit3 size={14} /> Update Balance
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: WhatsApp Deposit Requests */}
      {activeTab === 'deposits' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px' }}>
            Pending WhatsApp Deposit Verification Queue
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>Req ID</th>
                  <th style={{ padding: '12px' }}>User</th>
                  <th style={{ padding: '12px' }}>Amount</th>
                  <th style={{ padding: '12px' }}>Time</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {depositRequests.map((req) => (
                  <tr key={req.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '12px', fontFamily: 'monospace', color: 'var(--accent-gold)' }}>{req.id}</td>
                    <td style={{ padding: '12px', fontWeight: '700', color: '#fff' }}>{req.username} ({req.userId})</td>
                    <td style={{ padding: '12px', fontWeight: '800', color: 'var(--primary-green)' }}>₹{req.amount}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{req.time}</td>
                    <td style={{ padding: '12px' }}>
                      <span className={`badge ${req.status.includes('Approved') ? 'badge-green' : 'badge-gold'}`}>
                        {req.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {!req.status.includes('Approved') ? (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => adminApproveDeposit(req.id)}
                        >
                          <CheckCircle2 size={14} /> Approve & Credit ₹{req.amount}
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Confirmed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: WhatsApp Withdrawal Requests */}
      {activeTab === 'withdrawals' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px' }}>
            Pending Manual Withdrawal Requests Queue
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>Req ID</th>
                  <th style={{ padding: '12px' }}>User</th>
                  <th style={{ padding: '12px' }}>Amount</th>
                  <th style={{ padding: '12px' }}>UPI / Bank Details</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {withdrawRequests.map((req) => (
                  <tr key={req.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '12px', fontFamily: 'monospace', color: 'var(--accent-gold)' }}>{req.id}</td>
                    <td style={{ padding: '12px', fontWeight: '700', color: '#fff' }}>{req.username}</td>
                    <td style={{ padding: '12px', fontWeight: '800', color: 'var(--accent-gold)' }}>₹{req.amount}</td>
                    <td style={{ padding: '12px', color: 'var(--accent-cyan)' }}>{req.upi}</td>
                    <td style={{ padding: '12px' }}>
                      <span className={`badge ${req.status.includes('Approved') ? 'badge-green' : 'badge-gold'}`}>
                        {req.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {!req.status.includes('Approved') ? (
                        <button
                          className="btn btn-gold btn-sm"
                          onClick={() => adminApproveWithdrawal(req.id)}
                        >
                          <CheckCircle2 size={14} /> Confirm Sent Payout
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Dispatched</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Game Management */}
      {activeTab === 'games' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px' }}>
            Platform Game Settings & Rules
          </h3>
          <div className="grid-3">
            {games.map((g) => (
              <div
                key={g.id}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--bg-accent)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.6rem' }}>{g.image}</span>
                    <strong style={{ fontSize: '1.05rem', color: '#fff' }}>{g.name}</strong>
                  </div>
                  <span className={`badge ${g.active ? 'badge-green' : 'badge-gold'}`}>
                    {g.active ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <div>Entry Fee: ₹{g.entryFee}</div>
                  <div>RTP Payout Rate: {g.payoutRate}</div>
                  <div>Active Players: {g.players}</div>
                </div>

                <button
                  className={`btn btn-sm ${g.active ? 'btn-danger' : 'btn-primary'}`}
                  onClick={() => toggleGameStatus(g.id)}
                  style={{ marginTop: 'auto' }}
                >
                  {g.active ? 'Disable Game' : 'Enable Game'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
