import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Initial Mock State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('stakepro_user');
    return saved ? JSON.parse(saved) : {
      id: 'USR-8942',
      username: 'PlayerOne',
      email: 'player@stake.com',
      balance: 1500,
      tokens: 1500,
      role: 'user'
    };
  });

  const [currency, setCurrency] = useState('INR'); // 'INR' or 'TOKENS'
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'game', 'admin'
  const [selectedGameId, setSelectedGameId] = useState('mines');
  
  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState(null);

  // Admin Data State
  const [usersList, setUsersList] = useState([
    { id: 'USR-8942', username: 'PlayerOne', email: 'player@stake.com', balance: 1500, status: 'Active', joined: '2026-08-01' },
    { id: 'USR-1092', username: 'CryptoKing', email: 'king@crypto.com', balance: 12500, status: 'Active', joined: '2026-07-28' },
    { id: 'USR-4811', username: 'VipRoller', email: 'vip@roller.org', balance: 45000, status: 'Active', joined: '2026-08-05' },
    { id: 'USR-6623', username: 'LuckyRider', email: 'lucky@gmail.com', balance: 320, status: 'Active', joined: '2026-08-08' }
  ]);

  const [depositRequests, setDepositRequests] = useState([
    { id: 'DEP-101', userId: 'USR-8942', username: 'PlayerOne', amount: 1000, status: 'Approved', time: '10 mins ago' },
    { id: 'DEP-102', userId: 'USR-1092', username: 'CryptoKing', amount: 5000, status: 'Pending', time: '5 mins ago' }
  ]);

  const [withdrawRequests, setWithdrawRequests] = useState([
    { id: 'WTH-501', userId: 'USR-4811', username: 'VipRoller', amount: 2000, upi: 'vip@upi', status: 'Pending', time: '2 mins ago' }
  ]);

  const [games, setGames] = useState([
    {
      id: 'mines',
      name: 'Mines',
      category: 'Stake Originals',
      image: '💣',
      badge: 'Popular',
      color: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      minBet: 10,
      entryFee: 10,
      payoutRate: '99%',
      active: true,
      players: 1420
    },
    {
      id: 'dice',
      name: 'Dice',
      category: 'Stake Originals',
      image: '🎲',
      badge: 'Hot',
      color: 'linear-gradient(135deg, #e65c00 0%, #F9D423 100%)',
      minBet: 5,
      entryFee: 5,
      payoutRate: '98.5%',
      active: true,
      players: 980
    },
    {
      id: 'wheel',
      name: 'Spin Wheel',
      category: 'Casino',
      image: '🎡',
      badge: 'New',
      color: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
      minBet: 20,
      entryFee: 20,
      payoutRate: '97%',
      active: true,
      players: 750
    },
    {
      id: 'plinko',
      name: 'Plinko Balls',
      category: 'Stake Originals',
      image: '🟢',
      badge: 'Trending',
      color: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      minBet: 10,
      entryFee: 10,
      payoutRate: '99%',
      active: true,
      players: 2100
    },
    {
      id: 'slots',
      name: 'Mega Slots',
      category: 'Slots',
      image: '🎰',
      badge: 'Jackpot',
      color: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)',
      minBet: 50,
      entryFee: 50,
      payoutRate: '96.5%',
      active: true,
      players: 3400
    },
    {
      id: 'crash',
      name: 'Aviator Crash',
      category: 'Instant Games',
      image: '🚀',
      badge: 'Live',
      color: 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)',
      minBet: 25,
      entryFee: 25,
      payoutRate: '98%',
      active: true,
      players: 4890
    }
  ]);

  // Save current user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('stakepro_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Helper to show toasts
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Modify user balance (wins, bets, admin top-up)
  const updateBalance = (amount, isAddition = true) => {
    setCurrentUser(prev => {
      if (!prev) return prev;
      const newBal = isAddition ? prev.balance + amount : Math.max(0, prev.balance - amount);
      const newTokens = isAddition ? prev.tokens + amount : Math.max(0, prev.tokens - amount);
      
      // Update in usersList too
      setUsersList(users => users.map(u => u.id === prev.id ? { ...u, balance: newBal } : u));
      
      return {
        ...prev,
        balance: newBal,
        tokens: newTokens
      };
    });
  };

  // Login handler
  const loginUser = (username, email) => {
    const newUser = {
      id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      username: username || 'PlayerOne',
      email: email || 'user@stake.com',
      balance: 1000,
      tokens: 1000,
      role: 'user'
    };
    setCurrentUser(newUser);
    
    // Add to users list if not existing
    setUsersList(prev => [newUser, ...prev]);
    showToast(`Welcome back, ${newUser.username}!`);
    setAuthModalOpen(false);
  };

  // Logout handler
  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('stakepro_user');
    showToast('Logged out successfully', 'info');
  };

  // Admin Balance update handler
  const adminUpdateUserBalance = (userId, newAmount) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, balance: parseFloat(newAmount) };
      }
      return u;
    }));

    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, balance: parseFloat(newAmount), tokens: parseFloat(newAmount) }));
    }
    showToast(`Updated balance for user ${userId} to ₹${newAmount}`);
  };

  // Admin approve deposit
  const adminApproveDeposit = (reqId) => {
    setDepositRequests(prev => prev.map(req => {
      if (req.id === reqId) {
        // Add balance to user
        updateBalance(req.amount, true);
        return { ...req, status: 'Approved' };
      }
      return req;
    }));
    showToast(`Deposit #${reqId} Approved! Balance Credited.`);
  };

  // Admin approve withdrawal
  const adminApproveWithdrawal = (reqId) => {
    setWithdrawRequests(prev => prev.map(req => {
      if (req.id === reqId) {
        return { ...req, status: 'Approved & Sent' };
      }
      return req;
    }));
    showToast(`Withdrawal #${reqId} Approved! Payment dispatched.`);
  };

  // User submits WhatsApp deposit request
  const submitDepositRequest = (amount) => {
    const newReq = {
      id: 'DEP-' + Math.floor(100 + Math.random() * 900),
      userId: currentUser?.id || 'USR-8942',
      username: currentUser?.username || 'Guest',
      amount: parseFloat(amount),
      status: 'Pending WhatsApp Verification',
      time: 'Just now'
    };
    setDepositRequests(prev => [newReq, ...prev]);
    return newReq;
  };

  // User submits WhatsApp withdraw request
  const submitWithdrawRequest = (amount, upi) => {
    if ((currentUser?.balance || 0) < amount) {
      showToast('Insufficient balance for withdrawal!', 'error');
      return false;
    }
    // Deduct immediately as pending lock
    updateBalance(amount, false);
    
    const newReq = {
      id: 'WTH-' + Math.floor(500 + Math.random() * 900),
      userId: currentUser?.id || 'USR-8942',
      username: currentUser?.username || 'Guest',
      amount: parseFloat(amount),
      upi,
      status: 'Pending Admin Verification',
      time: 'Just now'
    };
    setWithdrawRequests(prev => [newReq, ...prev]);
    return newReq;
  };

  // Toggle game active state in Admin panel
  const toggleGameStatus = (gameId) => {
    setGames(prev => prev.map(g => g.id === gameId ? { ...g, active: !g.active } : g));
    showToast(`Game state updated`);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      currency,
      setCurrency,
      activeView,
      setActiveView,
      selectedGameId,
      setSelectedGameId,
      authModalOpen,
      setAuthModalOpen,
      depositModalOpen,
      setDepositModalOpen,
      withdrawModalOpen,
      setWithdrawModalOpen,
      toast,
      showToast,
      updateBalance,
      loginUser,
      logoutUser,
      usersList,
      adminUpdateUserBalance,
      depositRequests,
      withdrawRequests,
      submitDepositRequest,
      submitWithdrawRequest,
      adminApproveDeposit,
      adminApproveWithdrawal,
      games,
      toggleGameStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
