import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, MessageSquare, CheckCircle, ShieldAlert, Sparkles, Copy, ExternalLink, Zap } from 'lucide-react';

export const DepositModal = () => {
  const { 
    currentUser, 
    depositModalOpen, 
    setDepositModalOpen, 
    submitDepositRequest,
    adminApproveDeposit,
    showToast 
  } = useApp();

  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [createdReq, setCreatedReq] = useState(null);

  if (!depositModalOpen) return null;

  const presetAmounts = [500, 1000, 2000, 5000];
  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  // Formatted WhatsApp message string
  const adminWhatsAppNumber = "919876543210";
  const rawMessage = `Hi Admin, I want to DEPOSIT money into my StakePro account.
Username: ${currentUser?.username || 'Guest'}
User ID: ${currentUser?.id || 'USR-0000'}
Deposit Amount: ₹${finalAmount}
Please send QR / UPI ID for payment.`;

  const waLink = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(rawMessage)}`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(rawMessage);
    setCopied(true);
    showToast('WhatsApp deposit message copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProceedWhatsApp = () => {
    const req = submitDepositRequest(finalAmount);
    setCreatedReq(req);
    window.open(waLink, '_blank');
    showToast(`Redirecting to WhatsApp chat for ₹${finalAmount} deposit!`);
  };

  const handleSimulateAdminApproval = () => {
    const req = createdReq || submitDepositRequest(finalAmount);
    adminApproveDeposit(req.id);
    setDepositModalOpen(false);
    setCreatedReq(null);
  };

  return (
    <div className="modal-overlay" onClick={() => setDepositModalOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(37, 211, 102, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(37, 211, 102, 0.3)'
            }}>
              <MessageSquare size={20} color="#25D366" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Deposit via WhatsApp</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Manual instant payment confirmation</p>
            </div>
          </div>
          <button className="modal-close" onClick={() => setDepositModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          
          {/* Quick Select Amounts */}
          <div className="form-group">
            <label className="form-label">
              <span>Select Deposit Amount</span>
              <span style={{ color: 'var(--primary-green)' }}>Min: ₹100</span>
            </label>
            <div className="grid-4" style={{ marginBottom: '10px' }}>
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amt);
                    setCustomAmount('');
                  }}
                  style={{
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: (selectedAmount === amt && !customAmount) ? '2px solid var(--primary-green)' : '1px solid var(--bg-accent)',
                    background: (selectedAmount === amt && !customAmount) ? 'rgba(0, 231, 1, 0.15)' : 'var(--bg-input)',
                    color: (selectedAmount === amt && !customAmount) ? 'var(--primary-green)' : '#fff',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '0.95rem'
                  }}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            {/* Custom input */}
            <input
              type="number"
              className="form-input"
              placeholder="Or enter custom amount (e.g. 1500)"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
            />
          </div>

          {/* WhatsApp Message Preview Box */}
          <div style={{
            background: 'var(--bg-input)',
            border: '1px dashed var(--bg-accent)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            marginBottom: '20px',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                WhatsApp Chat Preview:
              </span>
              <button
                type="button"
                onClick={handleCopyMessage}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: copied ? 'var(--primary-green)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Copy size={12} /> {copied ? 'Copied!' : 'Copy Text'}
              </button>
            </div>
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

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              className="btn btn-lg glow-active"
              onClick={handleProceedWhatsApp}
              style={{
                backgroundColor: '#25D366',
                color: '#fff',
                width: '100%'
              }}
            >
              <MessageSquare size={20} />
              Open WhatsApp Chat (₹{finalAmount})
              <ExternalLink size={16} />
            </button>

            {/* Admin Quick Simulation Button for Demo */}
            <button
              className="btn btn-gold btn-sm"
              onClick={handleSimulateAdminApproval}
              style={{ width: '100%', marginTop: '4px' }}
            >
              <Zap size={16} />
              Simulate Instant Admin Balance Credit (Demo Test)
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', marginTop: '14px', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
            <ShieldAlert size={14} color="var(--accent-gold)" />
            Admin will update your account balance upon WhatsApp payment confirmation.
          </div>

        </div>

      </div>
    </div>
  );
};
