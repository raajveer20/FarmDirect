import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  QrCode, 
  Building2, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Smartphone,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const BuyerPaymentModal = () => {
  const { 
    isPaymentModalOpen, 
    closePaymentModal, 
    pendingCheckoutData, 
    cart, 
    placeOrder, 
    t 
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'netbanking' | 'cards' | 'pod'
  const [selectedUpiApp, setSelectedUpiApp] = useState('GPay');
  const [customVpa, setCustomVpa] = useState('rahul.sharma@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('SBI');
  const [cardData, setCardData] = useState({
    number: '4532 •••• •••• 8921',
    name: 'Rahul Sharma',
    expiry: '08/29',
    cvv: '•••'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionData, setTransactionData] = useState(null);

  if (!isPaymentModalOpen) return null;

  const totalCartPrice = pendingCheckoutData?.totalCartPrice || cart.reduce((acc, item) => acc + (item.product.pricePerKg * item.qty), 0);
  const totalSaved = pendingCheckoutData?.totalSaved || 650;
  const deliveryAddress = pendingCheckoutData?.deliveryAddress || '102 Royal Palm Enclave, Bhopal MP';

  const upiApps = [
    { name: 'GPay', label: 'Google Pay', color: 'border-blue-500 bg-blue-50/60 text-blue-700' },
    { name: 'PhonePe', label: 'PhonePe', color: 'border-purple-500 bg-purple-50/60 text-purple-700' },
    { name: 'Paytm', label: 'Paytm UPI', color: 'border-sky-500 bg-sky-50/60 text-sky-700' },
    { name: 'BHIM', label: 'BHIM UPI', color: 'border-emerald-500 bg-emerald-50/60 text-emerald-700' },
    { name: 'CRED', label: 'CRED UPI', color: 'border-slate-800 bg-slate-50/60 text-slate-900' }
  ];

  const banks = [
    { code: 'SBI', name: 'State Bank of India', tag: 'Primary Escrow Partner' },
    { code: 'HDFC', name: 'HDFC Bank Ltd.', tag: 'Popular B2B' },
    { code: 'ICICI', name: 'ICICI Bank Ltd.', tag: 'Corporate NetBanking' },
    { code: 'AXIS', name: 'Axis Bank', tag: 'Agri Credit' },
    { code: 'PNB', name: 'Punjab National Bank', tag: 'Kisan Mandi Link' },
    { code: 'KOTAK', name: 'Kotak Mahindra Bank', tag: 'Fast IMPS' }
  ];

  const handlePayAndDepositEscrow = () => {
    setIsProcessing(true);
    setProcessingStage('Connecting to NPCI UPI Clearing Gateway...');

    setTimeout(() => {
      setProcessingStage(`Locking ₹${totalCartPrice.toLocaleString()} into RBI-Regulated Escrow Pool...`);
    }, 600);

    setTimeout(() => {
      setProcessingStage('Generating Dispatch Order & Handover Token...');
    }, 1200);

    setTimeout(() => {
      const txnId = `TXN-FD-UPI-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const payload = {
        method: paymentMethod === 'upi' ? `UPI (${selectedUpiApp})` : paymentMethod === 'netbanking' ? `NetBanking (${selectedBank})` : paymentMethod === 'cards' ? 'Corporate Agri Card' : 'Pay on Handover (Doorstep UPI)',
        txnId,
        vpa: customVpa,
        bankName: selectedBank === 'SBI' ? 'State Bank of India (Escrow Trust)' : selectedBank,
        status: 'ESCROW_LOCKED',
        amount: totalCartPrice
      };
      setTransactionData(payload);
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      // Complete order creation in context
      placeOrder(deliveryAddress, payload);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
              <Lock className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/80">
                  {t('pay_escrow_badge')}
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">• RBI & NPCI Compliant</span>
              </div>
              <h2 className="text-base font-extrabold text-white mt-0.5">
                {t('pay_modal_title')}
              </h2>
            </div>
          </div>

          {!isProcessing && !paymentSuccess && (
            <button
              onClick={closePaymentModal}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Reassurance Escrow Strip */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-b border-emerald-200/80 p-3.5 px-6 flex items-center gap-3 text-xs">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
          <p className="text-[11px] text-emerald-900 leading-tight">
            <strong>{t('pay_escrow_sub')}</strong>
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* PROCESSING STATE */}
          {isProcessing && (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin mx-auto shadow-md" />
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900">
                  Securing Escrow Deposit...
                </h3>
                <p className="text-xs font-mono text-emerald-700 font-bold animate-pulse">
                  {processingStage}
                </p>
              </div>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Please do not refresh or close this window. Your funds are being transferred directly into the FarmDirect Escrow Clearing Trust.
              </p>
            </div>
          )}

          {/* SUCCESS STATE */}
          {paymentSuccess && (
            <div className="py-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30 animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                  PAYMENT LOCKED IN ESCROW
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  {t('pay_success_title')}
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  {t('pay_success_sub')}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="font-mono font-bold text-slate-900">{transactionData?.txnId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Escrow Amount:</span>
                  <span className="font-black text-emerald-700">₹{totalCartPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Beneficiary:</span>
                  <span className="font-bold text-slate-800">Direct Farmer Pool (₹0 Middlemen Cut)</span>
                </div>
              </div>

              <button
                onClick={closePaymentModal}
                className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/25 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>{t('pay_btn_track')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* MAIN PAYMENT FORM */}
          {!isProcessing && !paymentSuccess && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Column: Payment Rail Selector */}
              <div className="md:col-span-7 space-y-5">
                
                {/* Payment Method Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'upi' ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px]">{t('pay_tab_upi')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'netbanking' ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px]">{t('pay_tab_netbanking')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cards')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'cards' ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px]">{t('pay_tab_cards')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pod')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'pod' ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px]">{t('pay_tab_pod')}</span>
                  </button>
                </div>

                {/* TAB 1 CONTENT: UPI / DYNAMIC QR */}
                {paymentMethod === 'upi' && (
                  <div className="space-y-4 border border-slate-200 rounded-2xl p-4 bg-white shadow-2xs">
                    
                    {/* Quick App Badges */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Select Preferred UPI App:
                      </span>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                        {upiApps.map(app => (
                          <button
                            key={app.name}
                            type="button"
                            onClick={() => setSelectedUpiApp(app.name)}
                            className={`p-2 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                              selectedUpiApp === app.name ? `${app.color} shadow-xs ring-2 ring-emerald-500/20` : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span className="block text-[11px] font-extrabold">{app.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic QR Code View */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
                      <div className="relative inline-block p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <svg className="w-32 h-32 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="100" height="100" rx="6" fill="#F8FAFC" />
                          <rect x="8" y="8" width="22" height="22" rx="3" fill="#047857" />
                          <rect x="12" y="12" width="14" height="14" rx="2" fill="#FFFFFF" />
                          <rect x="15" y="15" width="8" height="8" rx="1" fill="#047857" />
                          <rect x="70" y="8" width="22" height="22" rx="3" fill="#047857" />
                          <rect x="74" y="12" width="14" height="14" rx="2" fill="#FFFFFF" />
                          <rect x="77" y="15" width="8" height="8" rx="1" fill="#047857" />
                          <rect x="8" y="70" width="22" height="22" rx="3" fill="#047857" />
                          <rect x="12" y="74" width="14" height="14" rx="2" fill="#FFFFFF" />
                          <rect x="15" y="77" width="8" height="8" rx="1" fill="#047857" />
                          <rect x="36" y="12" width="8" height="8" rx="1" fill="#0F172A" />
                          <rect x="50" y="16" width="14" height="6" rx="1" fill="#0F172A" />
                          <rect x="38" y="38" width="24" height="24" rx="3" fill="#047857" />
                          <circle cx="50" cy="50" r="5" fill="#FFFFFF" />
                          <rect x="12" y="38" width="18" height="6" rx="1" fill="#0F172A" />
                          <rect x="70" y="38" width="18" height="8" rx="1" fill="#0F172A" />
                          <rect x="38" y="70" width="12" height="18" rx="1" fill="#0F172A" />
                          <rect x="58" y="76" width="24" height="12" rx="1" fill="#0F172A" />
                        </svg>
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1.5 py-0.5 rounded text-[8px] font-black text-emerald-800 shadow-xs border border-emerald-600">
                          NPCI
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {t('pay_scan_upi_qr')}
                      </p>
                    </div>

                    {/* Or Custom VPA Input */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">
                        {t('pay_or_enter_upi')}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customVpa}
                          onChange={(e) => setCustomVpa(e.target.value)}
                          placeholder={t('pay_enter_vpa_placeholder')}
                          className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-emerald-500 focus:bg-white focus:outline-none font-mono font-medium"
                        />
                        <button
                          type="button"
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Verify VPA
                        </button>
                      </div>
                    </div>

                  </div>
                )}

                {/* TAB 2 CONTENT: NET BANKING */}
                {paymentMethod === 'netbanking' && (
                  <div className="space-y-3 border border-slate-200 rounded-2xl p-4 bg-white shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      {t('pay_select_bank')}
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {banks.map(b => (
                        <button
                          key={b.code}
                          type="button"
                          onClick={() => setSelectedBank(b.code)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            selectedBank === b.code ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="font-extrabold text-xs">{b.name}</div>
                          <div className="text-[10px] text-slate-400 font-medium">{b.tag}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3 CONTENT: AGRI CARDS */}
                {paymentMethod === 'cards' && (
                  <div className="space-y-3 border border-slate-200 rounded-2xl p-4 bg-white shadow-2xs text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Commercial / Kisan Credit Card Number</label>
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Valid Thru</label>
                        <input
                          type="text"
                          value={cardData.expiry}
                          onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">CVV</label>
                        <input
                          type="password"
                          value={cardData.cvv}
                          maxLength={3}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Name on Card</label>
                      <input
                        type="text"
                        value={cardData.name}
                        onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 4 CONTENT: PAY ON HANDOVER */}
                {paymentMethod === 'pod' && (
                  <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-2xs space-y-3 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                      <Truck className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Doorstep UPI Payment on Physical Verification
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                      Our cold-chain delivery vehicle will arrive at your address. Verify the crate quality, scan the driver's dynamic UPI QR, and your escrow payment will clear instantly.
                    </p>
                  </div>
                )}

              </div>

              {/* Right Column: Order & Escrow Rupee Breakdown */}
              <div className="md:col-span-5 space-y-4">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3.5 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                    <span className="font-bold text-slate-900 text-sm">{t('pay_order_summary')}</span>
                    <span className="text-[11px] text-slate-500 font-semibold">{cart.length} Commodities</span>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-slate-700">
                        <span className="font-medium truncate max-w-[160px]">{item.product.name} ({item.qty} kg)</span>
                        <span className="font-bold">₹{item.product.pricePerKg * item.qty}</span>
                      </div>
                    ))}
                  </div>

                  {/* Charges & Middlemen Savings */}
                  <div className="border-t border-slate-200 pt-2 space-y-1.5">
                    <div className="flex justify-between text-slate-500">
                      <span>FarmDirect Pooled EV Shipping:</span>
                      <span className="text-emerald-700 font-bold">FREE (₹0)</span>
                    </div>

                    <div className="flex justify-between text-emerald-700 font-extrabold bg-emerald-100/60 p-2 rounded-xl">
                      <span>Middleman Markup Avoided:</span>
                      <span>₹{totalSaved.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Total Payable */}
                  <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                    <span className="font-extrabold text-slate-900 text-sm">{t('pay_total_payable')}</span>
                    <span className="font-black text-xl text-emerald-700">₹{totalCartPrice.toLocaleString()}</span>
                  </div>

                  {/* Delivery Destination Snippet */}
                  <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500">
                    <span className="font-bold text-slate-700 block">Deliver To:</span>
                    <span className="line-clamp-1">{deliveryAddress}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handlePayAndDepositEscrow}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Lock className="w-4 h-4" />
                  <span>{t('pay_btn_lock')} (₹{totalCartPrice.toLocaleString()})</span>
                </button>

                <p className="text-[10px] text-center text-slate-400">
                  Protected by 256-bit SSL & NPCI Certified Escrow Pipeline.
                </p>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
export default BuyerPaymentModal;
