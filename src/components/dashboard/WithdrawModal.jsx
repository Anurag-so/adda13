import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ArrowUpRight, ShieldCheck, Copy, ExternalLink, Zap, AlertCircle } from 'lucide-react';

export const WithdrawModal = () => {
  const { 
    currentUser, 
    withdrawModalOpen, 
    setWithdrawModalOpen, 
    submitWithdrawRequest,
    adminApproveWithdrawal,
    showToast 
  } = useApp();

  const [amount, setAmount] = useState(500);
  const [upi, setUpi] = useState('player@upi');
  const [createdReq, setCreatedReq] = useState(null);

  if (!withdrawModalOpen) return null;

  const currentBal = currentUser?.balance || 0;
  const isBalanceValid = amount <= currentBal && amount >= 100;

  const adminWhatsAppNumber = "919876543210";
  const rawMessage = `Hi Admin, I request a WITHDRAWAL from my StakePro account.
Username: ${currentUser?.username || 'Guest'}
User ID: ${currentUser?.id || 'USR-0000'}
Withdrawal Amount: ₹${amount}
Payout UPI / Bank: ${upi}
Please verify & dispatch payment.`;

  const waLink = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(rawMessage)}`;

  const handleProceedWhatsApp = () => {
    if (!upi) {
      showToast('Please enter your UPI ID or Bank details!', 'error');
      return;
    }
    const req = submitWithdrawRequest(amount, upi);
    if (req) {
      setCreatedReq(req);
      window.open(waLink, '_blank');
      showToast(`Withdrawal request submitted! Opening WhatsApp chat.`);
    }
  };

  const handleSimulateAdminPayout = () => {
    if (!upi) {
      showToast('Please enter your UPI ID or Bank details!', 'error');
      return;
    }
    const req = createdReq || submitWithdrawRequest(amount, upi);
    if (req) {
      adminApproveWithdrawal(req.id);
      setWithdrawModalOpen(false);
      setCreatedReq(null);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setWithdrawModalOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(255, 199, 0, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 199, 0, 0.3)'
            }}>
              <ArrowUpRight size={20} color="var(--accent-gold)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Withdraw Winnings</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Direct payout to your UPI or Bank</p>
            </div>
          </div>
          <button className="modal-close" onClick={() => setWithdrawModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          
          {/* Current Balance Display */}
          <div style={{
            background: 'var(--bg-input)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            border: '1px solid var(--bg-accent)'
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Withdrawable Balance:</span>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-green)', fontFamily: 'var(--font-heading)' }}>
              ₹{currentBal.toLocaleString()}
            </span>
          </div>

          {/* Amount input */}
          <div className="form-group">
            <div className="form-label">
              <span>Withdrawal Amount (₹)</span>
              <button 
                type="button" 
                onClick={() => setAmount(currentBal)}
                style={{ background: 'none', border: 'none', color: 'var(--primary-green)', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
              >
                Max (₹{currentBal})
              </button>
            </div>
            <input
              type="number"
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              min={100}
              max={currentBal}
            />
          </div>

          {/* UPI ID input */}
          <div className="form-group">
            <label className="form-label">UPI ID / GPay / PhonePe / Bank AC</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. username@paytm or 9876543210@ybl"
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
            />
          </div>

          {/* WhatsApp Message Preview Box */}
          <div style={{
            background: 'var(--bg-input)',
            border: '1px dashed var(--bg-accent)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              WhatsApp Withdrawal Request Text:
            </span>
            <pre style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.82rem',
              color: '#fff',
              whiteSpace: 'pre-wrap',
              margin: 0,
              lineHeight: 1.4
            }}>
              {rawMessage}
            </pre>
          </div>

          {!isBalanceValid && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-red)', fontSize: '0.8rem', marginBottom: '14px' }}>
              <AlertCircle size={16} />
              Amount must be between ₹100 and your balance ₹{currentBal}.
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              className="btn btn-lg"
              disabled={!isBalanceValid}
              onClick={handleProceedWhatsApp}
              style={{
                backgroundColor: '#25D366',
                color: '#fff',
                width: '100%',
                opacity: isBalanceValid ? 1 : 0.5
              }}
            >
              <ArrowUpRight size={20} />
              Send Withdrawal Request via WhatsApp
            </button>

            {/* Demo Simulation Action */}
            <button
              className="btn btn-gold btn-sm"
              disabled={!isBalanceValid}
              onClick={handleSimulateAdminPayout}
              style={{ width: '100%' }}
            >
              <Zap size={16} />
              Simulate Instant Admin Approval & Payout (Demo Test)
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
