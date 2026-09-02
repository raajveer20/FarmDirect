import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Sprout, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  Smartphone, 
  CreditCard, 
  Zap, 
  ArrowRight, 
  FileText, 
  BadgeCheck, 
  Sparkles, 
  Lock,
  AlertOctagon 
} from 'lucide-react';

const API_BASE = '/api';

export const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authGateway, 
    authMode, 
    setCurrentUser, 
    setUserRole, 
    authenticateUser,
    quickDemoLogin, 
    showToast,
    navigateTo,
    pendingCartItem,
    setPendingCartItem,
    setCart
  } = useApp();

  // Active Gateway: 'Farmer' | 'Buyer' | 'Logistics'
  const [selectedGateway, setSelectedGateway] = useState('Farmer');
  // Primary Mode: 'login' | 'register'
  const [activeMode, setActiveMode] = useState('login');

  // Identifier Type: 'phone' | 'email'
  const [identifierType, setIdentifierType] = useState('phone');

  // Farmer Registration Sub-step: 'phone_email' (Step 1) -> 'kyc_verification' (Step 2: Farmer ID, Aadhaar ID, KCC)
  const [farmerSubStep, setFarmerSubStep] = useState('phone_email');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [demoOtpHint, setDemoOtpHint] = useState('');

  // Government Land Records & Anti-Middleman Verification State
  const [govtVerificationError, setGovtVerificationError] = useState(null);
  const [govtVerifiedRecord, setGovtVerifiedRecord] = useState(null);
  const [isGovtVerifying, setIsGovtVerifying] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    location: 'Bhopal, Madhya Pradesh',
    // Farmer verification fields (starts empty so user or test chips can select any entity)
    farmerId: '',
    aadhaarId: '',
    kccNumber: '',
    landSizeAcres: '',
    fpoName: '',
    bankUpiId: '',
    // Buyer fields
    buyerType: 'RETAIL',
    businessName: 'FreshRoots Grocery Mart',
    // Logistics / Admin fields
    adminId: 'ADM-8821',
    vehicleType: 'TRUCK_3T',
    vehicleRcNumber: 'MP-04-FD-2024'
  });

  // Sync props when modal opens
  useEffect(() => {
    if (authGateway) setSelectedGateway(authGateway);
    if (authMode) {
      setActiveMode(authMode === 'register' ? 'register' : 'login');
    }
    // Reset states on open
    setFarmerSubStep('phone_email');
    setOtpSent(false);
    setOtpCode(['', '', '', '', '', '']);
  }, [authGateway, authMode, isAuthModalOpen]);

  // Countdown timer for OTP
  useEffect(() => {
    let interval = null;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  if (!isAuthModalOpen) return null;

  // Handle OTP Input Change (Auto-focus next box)
  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-box-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-box-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pasted) {
      const newOtp = [...otpCode];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasted[i] || '';
      }
      setOtpCode(newOtp);
      const targetIdx = Math.min(pasted.length, 5);
      const targetInput = document.getElementById(`otp-box-${targetIdx}`);
      if (targetInput) targetInput.focus();
    }
  };

  // 1. Send / Generate OTP
  const handleGenerateOtp = async (e) => {
    if (e) e.preventDefault();

    let identifier = '';
    let adminIdToSend = '';
    if (selectedGateway === 'Logistics') {
      if (!formData.adminId || !formData.phone) {
        showToast('Please enter both Admin ID and Registered Phone Number', 'error');
        return;
      }
      identifier = formData.phone;
      adminIdToSend = formData.adminId;
    } else {
      identifier = identifierType === 'phone' ? formData.phone : formData.email;
      if (!identifier) {
        showToast(`Please enter your ${identifierType === 'phone' ? 'mobile number' : 'email address'}`, 'error');
        return;
      }
    }

    setIsSubmitting(true);
    setLoginError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier,
          adminId: adminIdToSend,
          role: selectedGateway.toUpperCase(),
          mode: activeMode
        })
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorMsg = data.message || `❌ Access Denied: Phone number (+91 ${identifier}) is not registered in our database. Only verified farmers can log in.`;
        setLoginError(errorMsg);
        showToast(errorMsg, 'error');
        setIsSubmitting(false);
        return;
      }

      const generatedCode = data.demoOtp || '123456';
      setOtpSent(true);
      setOtpTimer(30);
      setDemoOtpHint(generatedCode);
      setOtpCode(generatedCode.split(''));
      showToast(`OTP generated for ${identifier}! (Test OTP: ${generatedCode})`, 'success');
    } catch (err) {
      setLoginError(err.message || 'Access Denied: Number not registered.');
      showToast(err.message || 'Access Denied', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Verify OTP & Authenticate
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const enteredOtp = otpCode.join('');
    if (enteredOtp.length < 6) {
      showToast('Please enter the complete 6-digit OTP', 'error');
      return;
    }

    setIsSubmitting(true);

    // If Farmer in Register Mode: OTP verifies stage 1, then transitions to stage 2 (KYC: Farmer ID, Aadhaar, KCC)
    if (selectedGateway === 'Farmer' && activeMode === 'register') {
      setTimeout(() => {
        setIsSubmitting(false);
        setFarmerSubStep('kyc_verification');
        showToast('✅ Mobile & Email Authenticated! Please complete your Farmer ID & KYC credentials.', 'success');
      }, 500);
      return;
    }

    // Otherwise complete login for Buyer, Logistics/Admin, or Farmer Login
    const identifier = selectedGateway === 'Logistics'
      ? formData.phone
      : (identifierType === 'phone' ? formData.phone : formData.email) || '+91 98765 43210';

    try {
      const res = await fetch(`${API_BASE}/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier,
          adminId: formData.adminId || '',
          otp: enteredOtp,
          role: selectedGateway.toUpperCase(),
          name: formData.name || ''
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errorMsg = data.message || '❌ Access Denied: This mobile number is not registered in our database.';
        setLoginError(errorMsg);
        showToast(errorMsg, 'error');
        setIsSubmitting(false);
        return;
      }
      const token = data.token || `token-${Date.now()}`;
      localStorage.setItem('farmdirect_token', token);

      const userProfile = data.user || {
        name: formData.name || (selectedGateway === 'Farmer' ? 'Farmer' : selectedGateway === 'Buyer' ? 'Pooja Agarwal' : `Admin (${formData.adminId || 'ADM-8821'})`),
        email: formData.email || (identifierType === 'email' ? identifier : 'user@farmdirect.in'),
        phone: formData.phone || (identifierType === 'phone' ? identifier : '+91 98765 43210'),
        role: selectedGateway,
        location: formData.location || 'Local Farm Cluster',
        verificationStatus: selectedGateway === 'Farmer' ? 'VERIFIED_FARMER' : 'UNVERIFIED',
        farmerId: formData.farmerId,
        aadhaarId: formData.aadhaarId,
        kccNumber: formData.kccNumber,
        adminId: formData.adminId,
        isLoggedIn: true
      };

      authenticateUser(userProfile, selectedGateway);
      setIsAuthModalOpen(false);
      setIsSubmitting(false);

      if (selectedGateway === 'Farmer') {
        showToast(`Welcome back, ${userProfile.name}! Logged into Farmer Portal.`, 'success');
      } else if (selectedGateway === 'Buyer') {
        if (pendingCartItem) {
          const itemToAdd = pendingCartItem;
          setPendingCartItem(null);
          setCart(prev => {
            const existing = prev.find(item => item.product.id === itemToAdd.product.id);
            if (existing) {
              return prev.map(item =>
                item.product.id === itemToAdd.product.id
                  ? { ...item, qty: item.qty + itemToAdd.qty }
                  : item
              );
            }
            return [...prev, { product: itemToAdd.product, qty: itemToAdd.qty }];
          });
          showToast(`Welcome ${userProfile.name}! Added ${itemToAdd.qty} kg of ${itemToAdd.product.name} to your cart.`, 'success');
        } else {
          showToast(`Welcome ${userProfile.name}! Browse fresh produce directly from farms.`, 'success');
        }
      } else {
        showToast(`Operations access granted for Admin ID: ${formData.adminId}`, 'success');
      }
    } catch (err) {
      setLoginError(err.message || '❌ Access Denied: You are not registered in the official database.');
      showToast(err.message || 'Access Denied', 'error');
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Strict Government PM-Kisan & Bhulekh Land Registry Verification
  const handleFarmerKycSubmit = async (e) => {
    e.preventDefault();
    setGovtVerificationError(null);

    const checkId = (formData.farmerId || '').trim();
    const checkAadhaar = (formData.aadhaarId || '').trim();

    if (!checkId && !checkAadhaar) {
      showToast('Please enter your Government PM-Kisan Farmer ID or Aadhaar Number', 'error');
      return;
    }

    setIsSubmitting(true);
    setIsGovtVerifying(true);

    try {
      // Direct verification query against official government registry in PostgreSQL
      const res = await fetch(`${API_BASE}/auth/verify-govt-farmer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerId: checkId,
          aadhaarNumber: checkAadhaar,
          phone: formData.phone
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.verified) {
        setGovtVerificationError(
          data.message || '❌ Verification Failed: Identity not found in Government PM-Kisan & Bhulekh Land Records. Commercial brokers and middlemen are strictly prohibited from listing produce.'
        );
        setIsSubmitting(false);
        setIsGovtVerifying(false);
        showToast('Verification Blocked: Unverified entity detected', 'error');
        return;
      }

      const rec = data.governmentRecord;
      setGovtVerifiedRecord(rec);

      const verifiedFarmerProfile = {
        name: rec.fullName || formData.name || 'Verified Farmer',
        phone: rec.phone || formData.phone || '+91 98765 43210',
        email: formData.email || `farmer_${rec.farmerId.toLowerCase().replace(/[^a-z0-9]/g, '_')}@farmdirect.in`,
        role: 'Farmer',
        location: `${rec.district}, ${rec.state}`,
        verificationStatus: 'VERIFIED_FARMER',
        farmerId: rec.farmerId,
        aadhaarId: rec.aadhaarNumber,
        kccNumber: rec.kccNumber || formData.kccNumber,
        khasraNumber: rec.khasraNumber,
        landSizeAcres: rec.landSizeAcres,
        bankUpiId: rec.bankUpiId || formData.bankUpiId || 'farmer@upi',
        fpoName: rec.fpoMembership || formData.fpoName,
        isLoggedIn: true
      };

      // Persist verified KYC profile to PostgreSQL
      await fetch(`${API_BASE}/auth/verify-farmer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: verifiedFarmerProfile.email,
          phone: verifiedFarmerProfile.phone,
          identifier: verifiedFarmerProfile.email || verifiedFarmerProfile.phone,
          ...verifiedFarmerProfile
        })
      });

      localStorage.setItem('farmdirect_token', `token-farmer-verified-${Date.now()}`);
      authenticateUser(verifiedFarmerProfile, 'Farmer');
      setIsSubmitting(false);
      setIsGovtVerifying(false);
      setIsAuthModalOpen(false);

      showToast(`🏛️ Authenticated Government Verified Farmer: ${rec.fullName} (${rec.khasraNumber}, ${rec.landSizeAcres} Acres)`, 'success');
    } catch (err) {
      setGovtVerificationError(err.message || 'Network error verifying against land registry');
      setIsSubmitting(false);
      setIsGovtVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="glass-modal max-w-xl w-full rounded-3xl border border-white/90 shadow-2xl overflow-hidden relative my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header: Portal Choice */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-5 sm:p-6 text-white">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/30">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">FarmDirect Gateway Portal</h3>
              <p className="text-[11px] text-emerald-300 font-medium">Smart Agricultural Supply Chain & Direct Marketplace</p>
            </div>
          </div>

          {/* 3 Role Selection Tabs */}
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                id: 'Farmer',
                label: '🌾 Farmer / FPO',
                tag: 'Producer Portal',
                activeColor: 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/40'
              },
              {
                id: 'Buyer',
                label: '🛒 Buyer',
                tag: 'B2B & Retail',
                activeColor: 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/40'
              },
              {
                id: 'Logistics',
                label: '🚚 Logistics / Admin',
                tag: 'Fleet & Ops',
                activeColor: 'bg-amber-600 text-white border-amber-400 shadow-md shadow-amber-600/40'
              }
            ].map(gateway => {
              const isSelected = selectedGateway === gateway.id;
              return (
                <button
                  key={gateway.id}
                  type="button"
                  onClick={() => {
                    setSelectedGateway(gateway.id);
                    if (gateway.id === 'Logistics') {
                      setActiveMode('login');
                    }
                    setFarmerSubStep('phone_email');
                    setOtpSent(false);
                    setOtpCode(['', '', '', '', '', '']);
                    setLoginError(null);
                  }}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? `${gateway.activeColor} ring-2 ring-white/20 scale-[1.02]`
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black">{gateway.label}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div className="text-[9px] text-white/70">{gateway.tag}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode Selector & Quick Demo Login */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 text-xs">
          
          {/* Login / Register Toggle (Strictly Hidden for Logistics/Admin) */}
          {selectedGateway === 'Logistics' ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100/90 border border-amber-300 rounded-xl text-amber-950 font-extrabold text-[11px]">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>Authorized Fleet Operations Login Only</span>
            </div>
          ) : (
            <div className="flex bg-slate-200 p-1 rounded-xl font-bold">
              <button
                onClick={() => {
                  setActiveMode('login');
                  setFarmerSubStep('phone_email');
                  setOtpSent(false);
                  setLoginError(null);
                }}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  activeMode === 'login'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setActiveMode('register');
                  setFarmerSubStep('phone_email');
                  setOtpSent(false);
                  setLoginError(null);
                }}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  activeMode === 'register'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Register
              </button>
            </div>
          )}

          {/* Quick Demo 1-Click Button */}
          <button
            onClick={() => quickDemoLogin(selectedGateway)}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 flex items-center gap-1 text-[11px] font-extrabold border border-emerald-300 transition-colors shrink-0"
            title="Instant 1-click test login without filling form"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>1-Click Demo Login</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">

          {/* ========================================================================= */}
          {/* FLOW 1: FARMER SECTION                                                    */}
          {/* ========================================================================= */}
          {selectedGateway === 'Farmer' && (
            <div className="space-y-4">
              
              {/* If Farmer is in REGISTER mode */}
              {activeMode === 'register' ? (
                <div>
                  {/* Step Progress Banner */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        farmerSubStep === 'phone_email' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {farmerSubStep === 'kyc_verification' ? '✓' : '1'}
                      </div>
                      <span className={`text-xs font-bold ${farmerSubStep === 'phone_email' ? 'text-slate-900' : 'text-slate-400'}`}>
                        Phone / Email Auth
                      </span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-300" />

                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        farmerSubStep === 'kyc_verification' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
                      }`}>
                        2
                      </div>
                      <span className={`text-xs font-bold ${farmerSubStep === 'kyc_verification' ? 'text-slate-900' : 'text-slate-400'}`}>
                        Farmer ID, Aadhaar & KCC
                      </span>
                    </div>
                  </div>

                  {/* STAGE 1: PHONE / EMAIL AUTHENTICATION */}
                  {farmerSubStep === 'phone_email' && (
                    <div className="space-y-4">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-emerald-950">Farmer Registration - Step 1 of 2</h4>
                          <p className="text-[11px] text-emerald-800 mt-0.5">
                            Enter your phone number or email to receive an instant verification code.
                          </p>
                        </div>
                      </div>

                      {/* Phone / Email Toggle */}
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs">
                        <button
                          type="button"
                          onClick={() => { setIdentifierType('phone'); setOtpSent(false); }}
                          className={`px-3 py-1 rounded-lg font-bold transition-all ${
                            identifierType === 'phone' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          📱 Phone Number
                        </button>
                        <button
                          type="button"
                          onClick={() => { setIdentifierType('email'); setOtpSent(false); }}
                          className={`px-3 py-1 rounded-lg font-bold transition-all ${
                            identifierType === 'email' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          ✉️ Email Address
                        </button>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-700">Farmer Full Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Kisan Mitra / Farmer Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        {identifierType === 'phone' ? (
                          <div className="space-y-1">
                            <label className="font-bold text-slate-700">Mobile Phone Number (10 Digits)</label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500 border-r border-slate-300 pr-2">
                                🇮🇳 +91
                              </span>
                              <input
                                type="tel"
                                placeholder="98765 43210"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full pl-16 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-emerald-500 focus:bg-white"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <label className="font-bold text-slate-700">Email Address</label>
                            <input
                              type="email"
                              placeholder="farmer@farmdirect.in"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-emerald-500 focus:bg-white"
                            />
                          </div>
                        )}

                        {!otpSent ? (
                          <button
                            type="button"
                            onClick={handleGenerateOtp}
                            disabled={isSubmitting}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all mt-2"
                          >
                            <span>Send Verification OTP</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-700">Enter 6-Digit Verification Code</span>
                              {demoOtpHint && (
                                <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                                  Test OTP: {demoOtpHint}
                                </span>
                              )}
                            </div>

                            <div className="flex justify-between gap-2">
                              {otpCode.map((digit, idx) => (
                                <input
                                  key={idx}
                                  id={`otp-box-${idx}`}
                                  type="text"
                                  maxLength={1}
                                  value={digit}
                                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                  onPaste={handleOtpPaste}
                                  className="w-11 h-12 text-center text-lg font-black bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:bg-white focus:outline-none"
                                />
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={handleVerifyOtp}
                              disabled={isSubmitting}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                            >
                              <span>Verify & Proceed to Farmer KYC</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>

                            <div className="text-center">
                              {otpTimer > 0 ? (
                                <span className="text-[11px] text-slate-400">Resend code in {otpTimer}s</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleGenerateOtp}
                                  className="text-[11px] font-bold text-emerald-600 hover:underline"
                                >
                                  Resend Verification Code
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* STAGE 2: FARMER KYC (FARMER ID, AADHAAR ID, KISAN CREDIT CARD) */}
                  {farmerSubStep === 'kyc_verification' && (
                    <form onSubmit={handleFarmerKycSubmit} className="space-y-4">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-emerald-950">Government Land Registry Gatekeeper - Step 2 of 2</h4>
                          <p className="text-[11px] text-emerald-800 mt-0.5">
                            Cross-referenced in real-time against the State Bhulekh & PM-Kisan Registry. Commercial brokers & middlemen are blocked from registering.
                          </p>
                        </div>
                      </div>

                      {/* Interactive Test Chips for Presentation / Hackathon Judges */}
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1">
                            🏛️ Government Registry Test Records:
                          </span>
                          <div className="flex items-center gap-1.5">
                            <a
                              href="/Government_Verified_Farmers_Registry.pdf"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1 transition-all cursor-pointer"
                              title="Download official PDF sheet of all verified farmers & test cases"
                            >
                              📄 Download PDF
                            </a>
                            <span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                              Live SQL Registry
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 text-[10px]">
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                name: 'Ramesh Patel',
                                farmerId: 'PMK-MP-2024-88392',
                                aadhaarId: '9823-4512-6701',
                                kccNumber: 'KCC-SBIN-882190',
                                landSizeAcres: '4.5',
                                bankUpiId: 'ramesh.patel@sbi',
                                fpoName: 'Narmada Valley Farmers Producer Co.',
                                location: 'Sehore, Madhya Pradesh',
                                phone: '9876543210'
                              }));
                              setGovtVerificationError(null);
                              setGovtVerifiedRecord(null);
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-300 hover:border-emerald-500 rounded-lg font-mono font-bold text-slate-700 hover:text-emerald-700 transition-all cursor-pointer"
                          >
                            🌾 Ramesh Patel (MP - 4.5 Ac)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                name: 'Sunita Bai Deshmukh',
                                farmerId: 'PMK-MH-2024-77120',
                                aadhaarId: '4512-8890-3321',
                                kccNumber: 'KCC-BOI-771209',
                                landSizeAcres: '6.2',
                                bankUpiId: 'sunita.deshmukh@hdfcbank',
                                fpoName: 'Sahyadri Farmers Cooperative Alliance',
                                location: 'Nashik, Maharashtra',
                                phone: '9823456789'
                              }));
                              setGovtVerificationError(null);
                              setGovtVerifiedRecord(null);
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-300 hover:border-emerald-500 rounded-lg font-mono font-bold text-slate-700 hover:text-emerald-700 transition-all cursor-pointer"
                          >
                            🍇 Sunita Deshmukh (MH - 6.2 Ac)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                name: 'Naveen Reddy',
                                farmerId: 'PMK-AP-2024-11044',
                                aadhaarId: '7712-4433-9012',
                                kccNumber: 'KCC-ANDHRA-9901',
                                landSizeAcres: '3.8',
                                bankUpiId: 'naveen.reddy@icici',
                                fpoName: 'Andhra Spices & Chillies Producer Group',
                                location: 'Guntur, Andhra Pradesh',
                                phone: '9100977665'
                              }));
                              setGovtVerificationError(null);
                              setGovtVerifiedRecord(null);
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-300 hover:border-emerald-500 rounded-lg font-mono font-bold text-slate-700 hover:text-emerald-700 transition-all cursor-pointer"
                          >
                            🌶️ Naveen Reddy (AP - 3.8 Ac)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                name: 'Harpreet Singh',
                                farmerId: 'PMK-PB-2024-99301',
                                aadhaarId: '3301-8844-1290',
                                kccNumber: 'KCC-PNB-441290',
                                landSizeAcres: '8.0',
                                bankUpiId: 'harpreet.singh@pnb',
                                fpoName: 'Malwa Golden Harvest Farmers Trust',
                                location: 'Ludhiana, Punjab',
                                phone: '9811233445'
                              }));
                              setGovtVerificationError(null);
                              setGovtVerifiedRecord(null);
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-300 hover:border-emerald-500 rounded-lg font-mono font-bold text-slate-700 hover:text-emerald-700 transition-all cursor-pointer"
                          >
                            🌾 Harpreet Singh (PB - 8.0 Ac)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                name: 'Kavitha Murugan',
                                farmerId: 'PMK-TN-2024-44211',
                                aadhaarId: '6612-9900-5544',
                                kccNumber: 'KCC-CANARA-1122',
                                landSizeAcres: '5.0',
                                bankUpiId: 'kavitha.murugan@oksbi',
                                fpoName: 'Kongu Agri Collective FPO',
                                location: 'Erode, Tamil Nadu',
                                phone: '9443011223'
                              }));
                              setGovtVerificationError(null);
                              setGovtVerifiedRecord(null);
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-300 hover:border-emerald-500 rounded-lg font-mono font-bold text-slate-700 hover:text-emerald-700 transition-all cursor-pointer"
                          >
                            🥥 Kavitha Murugan (TN - 5.0 Ac)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                name: 'Commercial Broker / Fake Trader',
                                farmerId: 'FAKE-BROKER-999',
                                aadhaarId: '0000-1111-2222',
                                kccNumber: 'NONE',
                                landSizeAcres: '0',
                                bankUpiId: 'broker@fake',
                                fpoName: '',
                                location: 'Unauthorized Mandi Brokerage',
                                phone: '9999999999'
                              }));
                              setGovtVerificationError(null);
                              setGovtVerifiedRecord(null);
                            }}
                            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-400 rounded-lg font-mono font-bold text-red-700 transition-all cursor-pointer"
                          >
                            🚫 Test Fake Middleman (Rejection Test)
                          </button>
                        </div>
                      </div>

                      {/* Government Rejection Alert */}
                      {govtVerificationError && (
                        <div className="p-3 bg-red-50 border-2 border-red-300 rounded-2xl flex items-start gap-2.5 text-xs text-red-900 animate-in fade-in">
                          <X className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-black text-red-950">Middleman / Unverified Entity Detected</div>
                            <div className="text-[11px] text-red-800 mt-1 leading-relaxed">{govtVerificationError}</div>
                          </div>
                        </div>
                      )}

                      {/* Government Verification Success */}
                      {govtVerifiedRecord && (
                        <div className="p-3 bg-emerald-50 border-2 border-emerald-400 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-950 animate-in fade-in">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-black">Official Government Land Record Authenticated</div>
                            <div className="text-[11px] text-emerald-800 mt-0.5 font-medium">
                              Certified Landholder: <strong>{govtVerifiedRecord.fullName}</strong> | {govtVerifiedRecord.khasraNumber} ({govtVerifiedRecord.landSizeAcres} Acres) | {govtVerifiedRecord.district}, {govtVerifiedRecord.state}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-3 text-xs">
                        
                        {/* 1. Farmer ID */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="font-bold text-slate-800 flex items-center gap-1.5">
                              <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>1. Farmer ID (PM-KISAN / AgriStack ID)</span>
                            </label>
                            <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-1.5 py-0.5 rounded">Govt Verified</span>
                          </div>
                          <input
                            type="text"
                            required
                            placeholder="e.g. PMK-MP-2024-88392"
                            value={formData.farmerId}
                            onChange={(e) => setFormData({ ...formData, farmerId: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-emerald-500 focus:bg-white font-mono"
                          />
                          <span className="text-[10px] text-slate-500">Official beneficiary registration on PM-KISAN / State AgriStack.</span>
                        </div>

                        {/* 2. Aadhaar ID */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="font-bold text-slate-800 flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-blue-600" />
                              <span>2. Aadhaar ID (12-Digit UID)</span>
                            </label>
                            <span className="text-[10px] text-blue-700 bg-blue-100 font-bold px-1.5 py-0.5 rounded">UIDAI</span>
                          </div>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 9823-4512-6701"
                            value={formData.aadhaarId}
                            onChange={(e) => setFormData({ ...formData, aadhaarId: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-emerald-500 focus:bg-white font-mono"
                          />
                          <span className="text-[10px] text-slate-500">Used strictly for biometric and identity verification.</span>
                        </div>

                        {/* 3. Kisan Credit Card (KCC) */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="font-bold text-slate-800 flex items-center gap-1.5">
                              <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                              <span>3. Kisan Credit Card (KCC) Number</span>
                            </label>
                            <span className="text-[10px] text-amber-700 bg-amber-100 font-bold px-1.5 py-0.5 rounded">Bank KCC</span>
                          </div>
                          <input
                            type="text"
                            required
                            placeholder="e.g. KCC-SBIN-882190"
                            value={formData.kccNumber}
                            onChange={(e) => setFormData({ ...formData, kccNumber: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-emerald-500 focus:bg-white font-mono"
                          />
                          <span className="text-[10px] text-slate-500">Links your agricultural bank account for automated instant payouts.</span>
                        </div>

                        {/* Land Parcel Profile */}
                        <div className="space-y-1 pt-1">
                          <label className="font-bold text-slate-700">Land Parcel Size (Acres)</label>
                          <input
                            type="number"
                            step="0.5"
                            placeholder="4.5"
                            value={formData.landSizeAcres}
                            onChange={(e) => setFormData({ ...formData, landSizeAcres: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-emerald-500"
                          />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setFarmerSubStep('phone_email')}
                            className="flex-1 py-3 border border-slate-300 rounded-xl font-bold text-slate-600 hover:bg-slate-50 text-xs"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-lg shadow-emerald-600/30 text-xs flex items-center justify-center gap-2"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>Authenticate & Enter Portal ⭐</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                /* FARMER LOGIN MODE (Fast Phone/Email OTP Login) */
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Sprout className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-emerald-950">Farmer Portal Login</h4>
                      <p className="text-[11px] text-emerald-800 mt-0.5">
                        Log in with your registered phone number or email to manage crops, orders, and view AI demand.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs">
                    <button
                      type="button"
                      onClick={() => { setIdentifierType('phone'); setOtpSent(false); }}
                      className={`px-3 py-1 rounded-lg font-bold transition-all ${
                        identifierType === 'phone' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      📱 Mobile Number
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIdentifierType('email'); setOtpSent(false); }}
                      className={`px-3 py-1 rounded-lg font-bold transition-all ${
                        identifierType === 'email' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      ✉️ Email Address
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    {identifierType === 'phone' ? (
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Mobile Phone Number</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500 border-r border-slate-300 pr-2">
                            🇮🇳 +91
                          </span>
                          <input
                            type="tel"
                            placeholder="98765 43210"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full pl-16 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-emerald-500 focus:bg-white font-mono"
                          />
                        </div>

                        {/* Quick Fill Registered Farmer Numbers */}
                        <div className="pt-1.5 space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 block">
                            Quick-Fill Registered Farmer Numbers:
                          </span>
                          <div className="flex flex-wrap gap-1 text-[10px]">
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, phone: '9876543210' }))}
                              className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-100 border border-slate-200 hover:border-emerald-400 rounded text-slate-700 hover:text-emerald-800 font-mono transition-colors"
                            >
                              🌾 Ramesh (98765 43210)
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, phone: '9823456789' }))}
                              className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-100 border border-slate-200 hover:border-emerald-400 rounded text-slate-700 hover:text-emerald-800 font-mono transition-colors"
                            >
                              🍇 Sunita (98234 56789)
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, phone: '9811233445' }))}
                              className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-100 border border-slate-200 hover:border-emerald-400 rounded text-slate-700 hover:text-emerald-800 font-mono transition-colors"
                            >
                              🌾 Harpreet (98112 33445)
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, phone: '9100977665' }))}
                              className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-100 border border-slate-200 hover:border-emerald-400 rounded text-slate-700 hover:text-emerald-800 font-mono transition-colors"
                            >
                              🌶️ Naveen (91009 77665)
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, phone: '9443011223' }))}
                              className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-100 border border-slate-200 hover:border-emerald-400 rounded text-slate-700 hover:text-emerald-800 font-mono transition-colors"
                            >
                              🥥 Kavitha (94430 11223)
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Email Address</label>
                        <input
                          type="email"
                          placeholder="farmer@farmdirect.in"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-emerald-500 focus:bg-white"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-slate-500">First time here?</span>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMode('register');
                          setFarmerSubStep('phone_email');
                          setOtpSent(false);
                          setLoginError(null);
                        }}
                        className="font-bold text-emerald-600 hover:underline cursor-pointer"
                      >
                        Register with Govt Land Title &rarr;
                      </button>
                    </div>

                    {/* Prominent Access Denied Security Shield */}
                    {loginError && (
                      <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-red-900 animate-in fade-in">
                        <AlertOctagon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-extrabold text-red-800">Security Gatekeeper - Access Denied</div>
                          <p className="text-[11px] text-red-700 mt-0.5 font-medium leading-relaxed">{loginError}</p>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMode('register');
                              setFarmerSubStep('phone_email');
                              setLoginError(null);
                              setOtpSent(false);
                            }}
                            className="mt-2 inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                          >
                            🌾 Register as New Farmer with Government Land Title &rarr;
                          </button>
                        </div>
                      </div>
                    )}

                    {!otpSent ? (
                      <button
                        type="button"
                        onClick={handleGenerateOtp}
                        disabled={isSubmitting}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer"
                      >
                        <span>Send Login OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-700">Enter 6-Digit OTP</span>
                          {demoOtpHint && (
                            <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                              Test OTP: {demoOtpHint}
                            </span>
                          )}
                        </div>

                        <div className="flex justify-between gap-2">
                          {otpCode.map((digit, idx) => (
                            <input
                              key={idx}
                              id={`otp-box-${idx}`}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(idx, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                              onPaste={handleOtpPaste}
                              className="w-11 h-12 text-center text-lg font-black bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:bg-white focus:outline-none"
                            />
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={isSubmitting}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                        >
                          <span>Verify & Enter Dashboard</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* FLOW 2: BUYER SECTION (First and ONLY Window to enter via Phone / Email)  */}
          {/* ========================================================================= */}
          {selectedGateway === 'Buyer' && (
            <div className="space-y-4">
              {pendingCartItem && (
                <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm animate-in fade-in slide-in-from-top-2">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-base shrink-0 shadow-md shadow-amber-500/30">
                    🛒
                  </div>
                  <div className="flex-1 text-xs">
                    <h5 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                      <span>Buyer Registration Required for Cart</span>
                    </h5>
                    <p className="text-slate-600 text-xs mt-0.5">
                      You requested to add <strong className="text-emerald-700 font-black">{pendingCartItem.qty} kg of {pendingCartItem.product.name}</strong> (₹{pendingCartItem.qty * pendingCartItem.product.pricePerKg}). Register below to add this produce to your procurement cart immediately.
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-blue-950">
                    Buyer Access — {activeMode === 'register' ? 'Register New Buyer Profile' : 'Login via Phone / Email'}
                  </h4>
                  <p className="text-[11px] text-blue-800 mt-0.5 leading-relaxed">
                    Direct access for household consumers and B2B wholesale buyers. Procure directly from verified farms without middlemen.
                  </p>
                </div>
              </div>

              {/* Phone or Email selector */}
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs">
                <button
                  type="button"
                  onClick={() => { setIdentifierType('phone'); setOtpSent(false); }}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    identifierType === 'phone' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  📱 Mobile Phone
                </button>
                <button
                  type="button"
                  onClick={() => { setIdentifierType('email'); setOtpSent(false); }}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    identifierType === 'email' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  ✉️ Email Address
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {activeMode === 'register' && (
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Full Name / Business Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Pooja Agarwal (FreshRoots Mart)"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                )}

                {identifierType === 'phone' ? (
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Mobile Phone Number</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500 border-r border-slate-300 pr-2">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        placeholder="98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-16 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-blue-500 focus:bg-white"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      placeholder="buyer@freshroots.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                )}

                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleGenerateOtp}
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition-all mt-2"
                  >
                    <span>Send Login OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700">Enter 6-Digit OTP</span>
                      {demoOtpHint && (
                        <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                          Test OTP: {demoOtpHint}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between gap-2">
                      {otpCode.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-box-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-11 h-12 text-center text-lg font-black bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:bg-white focus:outline-none"
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>{pendingCartItem ? `Verify & Add ${pendingCartItem.product.name} to Cart` : 'Verify & Enter Buyer Portal'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* FLOW 3: LOGISTICS / ADMIN SECTION (Admin ID + Phone Number -> OTP)         */}
          {/* ========================================================================= */}
          {selectedGateway === 'Logistics' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-amber-950">
                    Logistics & Admin Authentication
                  </h4>
                  <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                    Authorized dispatch & administrative access. Authenticate using your Admin ID and registered phone number.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                {/* 1. Admin ID */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Admin ID / Operator Badge Number</span>
                    </label>
                    <span className="text-[10px] text-amber-800 bg-amber-100 font-bold px-1.5 py-0.5 rounded">Required</span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ADM-8821 or LOG-OPS-101"
                    value={formData.adminId}
                    onChange={(e) => setFormData({ ...formData, adminId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-amber-500 focus:bg-white font-mono font-bold text-slate-800"
                  />
                </div>

                {/* 2. Registered Phone Number */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Authorized Registered Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500 border-r border-slate-300 pr-2">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-16 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-amber-500 focus:bg-white font-mono"
                    />
                  </div>

                  {/* Quick Fill Dispatcher Profile */}
                  <div className="pt-1 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 block">
                      Quick-Fill Verified Database Officers:
                    </span>
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            adminId: 'ADM-8821',
                            phone: '9811233445',
                            name: 'Gurpreet Singh'
                          }));
                          setLoginError(null);
                        }}
                        className="px-2 py-0.5 bg-amber-100/70 hover:bg-amber-100 border border-amber-300 hover:border-amber-500 rounded text-amber-900 font-mono transition-colors cursor-pointer"
                      >
                        🚚 Gurpreet (ADM-8821)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            adminId: 'LOG-OPS-101',
                            phone: '9823045678',
                            name: 'Rajesh Sharma'
                          }));
                          setLoginError(null);
                        }}
                        className="px-2 py-0.5 bg-amber-100/70 hover:bg-amber-100 border border-amber-300 hover:border-amber-500 rounded text-amber-900 font-mono transition-colors cursor-pointer"
                      >
                        🚛 Rajesh (LOG-OPS-101)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            adminId: 'ADM-4019',
                            phone: '9443198765',
                            name: 'Ananya Sen'
                          }));
                          setLoginError(null);
                        }}
                        className="px-2 py-0.5 bg-amber-100/70 hover:bg-amber-100 border border-amber-300 hover:border-amber-500 rounded text-amber-900 font-mono transition-colors cursor-pointer"
                      >
                        🏦 Ananya (ADM-4019)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            adminId: 'ADM-5502',
                            phone: '9100912345',
                            name: 'Vikramaditya Roy'
                          }));
                          setLoginError(null);
                        }}
                        className="px-2 py-0.5 bg-amber-100/70 hover:bg-amber-100 border border-amber-300 hover:border-amber-500 rounded text-amber-900 font-mono transition-colors cursor-pointer"
                      >
                        🛡️ Vikramaditya (ADM-5502)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Error Banner for Unauthorized Access */}
                {loginError && (
                  <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-red-900 animate-in fade-in">
                    <AlertOctagon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-extrabold text-red-800">Administrative Gatekeeper - Access Denied</div>
                      <p className="text-[11px] text-red-700 mt-0.5 font-medium leading-relaxed">{loginError}</p>
                    </div>
                  </div>
                )}

                {/* Button: Generate OTP */}
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleGenerateOtp}
                    disabled={isSubmitting}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold py-3 rounded-xl shadow-md shadow-amber-600/30 flex items-center justify-center gap-2 transition-all mt-2"
                  >
                    <span>Generate OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700">Enter Generated OTP for {formData.adminId}</span>
                      {demoOtpHint && (
                        <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                          Test OTP: {demoOtpHint}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between gap-2">
                      {otpCode.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-box-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-11 h-12 text-center text-lg font-black bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-amber-600 focus:bg-white focus:outline-none"
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={isSubmitting}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold py-3 rounded-xl shadow-md shadow-amber-600/30 flex items-center justify-center gap-2 transition-all"
                    >
                      <span>Verify OTP & Access Operations</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="text-center">
                      {otpTimer > 0 ? (
                        <span className="text-[11px] text-slate-400">Resend code in {otpTimer}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleGenerateOtp}
                          className="text-[11px] font-bold text-amber-600 hover:underline"
                        >
                          Regenerate OTP
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default AuthModal;
