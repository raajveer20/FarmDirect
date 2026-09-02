import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  QrCode, 
  Camera, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check, 
  Sparkles, 
  Smartphone, 
  Award,
  Truck
} from 'lucide-react';

export const EscrowSettlementModal = () => {
  const { 
    isEscrowModalOpen, 
    closeEscrowModal, 
    escrowModalData, 
    setEscrowModalData, 
    settleEscrowHandover, 
    navigateTo, 
    t 
  } = useApp();

  const [enteredOtp, setEnteredOtp] = useState('2026');
  const [isScanning, setIsScanning] = useState(false);
  const [copiedUtr, setCopiedUtr] = useState(false);

  if (!isEscrowModalOpen || !escrowModalData?.order) return null;

  const { order, mode, receipt } = escrowModalData;
  const payoutAmount = order.totalPrice || 4800;

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      settleEscrowHandover(order.id, enteredOtp);
    }, 1200);
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedUtr(true);
      setTimeout(() => setCopiedUtr(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/80">
                SIH 2026 • DIRECT ESCROW HANDOVER
              </span>
              <h2 className="text-base font-extrabold text-white mt-0.5">
                {t('escrow_modal_title')}
              </h2>
            </div>
          </div>

          <button
            onClick={closeEscrowModal}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher (Buyer QR vs Logistics Scanner vs Payout Voucher) */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold p-1.5 gap-1.5">
          <button
            onClick={() => setEscrowModalData(prev => ({ ...prev, mode: 'qr' }))}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'qr' ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200 font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span>{t('escrow_buyer_qr_tab')}</span>
          </button>

          <button
            onClick={() => setEscrowModalData(prev => ({ ...prev, mode: 'scan' }))}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'scan' ? 'bg-white text-amber-800 shadow-xs border border-amber-200 font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4 text-amber-600" />
            <span>{t('escrow_scan_tab')}</span>
          </button>

          {(receipt || order.status === 'Delivered & Escrow Settled') && (
            <button
              onClick={() => setEscrowModalData(prev => ({ ...prev, mode: 'receipt' }))}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mode === 'receipt' ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200 font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4 text-emerald-600" />
              <span>{t('escrow_receipt_tab')}</span>
            </button>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* MODE 1: BUYER PRESENT QR & OTP */}
          {mode === 'qr' && (
            <div className="space-y-6 text-center">
              <div className="max-w-md mx-auto space-y-1">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wide">
                  Consignment Token #{order.id}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-2">
                  {order.productName} ({order.quantity} {order.unit || 'kg'})
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t('escrow_present_buyer_desc')}
                </p>
              </div>

              {/* Styled SVG QR Code */}
              <div className="relative inline-block p-5 bg-white rounded-3xl border-2 border-emerald-500/30 shadow-xl shadow-emerald-500/10">
                <svg className="w-48 h-48 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Outer Frame */}
                  <rect width="100" height="100" rx="8" fill="#F8FAFC" />
                  
                  {/* Top-Left Finder Box */}
                  <rect x="10" y="10" width="24" height="24" rx="4" fill="#047857" />
                  <rect x="14" y="14" width="16" height="16" rx="2" fill="#FFFFFF" />
                  <rect x="18" y="18" width="8" height="8" rx="1" fill="#047857" />

                  {/* Top-Right Finder Box */}
                  <rect x="66" y="10" width="24" height="24" rx="4" fill="#047857" />
                  <rect x="70" y="14" width="16" height="16" rx="2" fill="#FFFFFF" />
                  <rect x="74" y="18" width="8" height="8" rx="1" fill="#047857" />

                  {/* Bottom-Left Finder Box */}
                  <rect x="10" y="66" width="24" height="24" rx="4" fill="#047857" />
                  <rect x="14" y="70" width="16" height="16" rx="2" fill="#FFFFFF" />
                  <rect x="18" y="74" width="8" height="8" rx="1" fill="#047857" />

                  {/* Data Pixel Matrix Simulation */}
                  <rect x="40" y="12" width="6" height="6" rx="1" fill="#0F172A" />
                  <rect x="50" y="16" width="6" height="6" rx="1" fill="#0F172A" />
                  <rect x="42" y="24" width="12" height="6" rx="1" fill="#047857" />
                  <rect x="12" y="42" width="6" height="12" rx="1" fill="#0F172A" />
                  <rect x="24" y="40" width="8" height="8" rx="1" fill="#0F172A" />
                  <rect x="40" y="40" width="20" height="20" rx="3" fill="#047857" />
                  <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
                  <rect x="68" y="42" width="16" height="6" rx="1" fill="#0F172A" />
                  <rect x="76" y="52" width="12" height="8" rx="1" fill="#047857" />
                  <rect x="42" y="68" width="8" height="8" rx="1" fill="#0F172A" />
                  <rect x="54" y="76" width="16" height="6" rx="1" fill="#0F172A" />
                  <rect x="76" y="70" width="10" height="10" rx="1" fill="#047857" />
                  <rect x="88" y="84" width="4" height="4" rx="0.5" fill="#0F172A" />
                </svg>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded-md border border-emerald-600 shadow-md text-[9px] font-black text-emerald-800">
                  FD-SECURE
                </div>
              </div>

              {/* 4-Digit Delivery Handover OTP */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl max-w-sm mx-auto space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t('escrow_otp_label')}
                </span>
                <div className="flex items-center justify-center gap-2 font-mono text-2xl font-black text-slate-900 tracking-widest">
                  <span className="w-11 h-12 rounded-xl bg-white border border-slate-300 shadow-xs flex items-center justify-center">2</span>
                  <span className="w-11 h-12 rounded-xl bg-white border border-slate-300 shadow-xs flex items-center justify-center">0</span>
                  <span className="w-11 h-12 rounded-xl bg-white border border-slate-300 shadow-xs flex items-center justify-center">2</span>
                  <span className="w-11 h-12 rounded-xl bg-white border border-slate-300 shadow-xs flex items-center justify-center text-emerald-600">6</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Share this OTP or scan QR to disburse locked escrow of ₹{payoutAmount} to {order.farmerName}.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setEscrowModalData(prev => ({ ...prev, mode: 'scan' }))}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Switch to Logistics Camera Scanner View →</span>
                </button>
              </div>
            </div>
          )}

          {/* MODE 2: LOGISTICS SCANNER VIEW */}
          {mode === 'scan' && (
            <div className="space-y-6">
              
              {/* Animated Scanner Viewfinder Box */}
              <div className="relative w-full h-56 bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center shadow-inner">
                {/* Viewfinder Target Reticle */}
                <div className="relative w-40 h-40 border-2 border-dashed border-emerald-400/60 rounded-2xl flex items-center justify-center">
                  <div className="w-32 h-32 border-2 border-emerald-400 rounded-xl relative">
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-300" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-300" />
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-300" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-300" />

                    {/* Laser Scanner Beam */}
                    <div className={`absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] ${isScanning ? 'animate-bounce duration-300' : 'animate-pulse'}`} />
                  </div>
                </div>

                <div className="absolute bottom-3 text-center">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-wider flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    {isScanning ? t('escrow_releasing_funds') : "ALIGN CONSIGNMENT QR IN VIEWFINDER"}
                  </span>
                </div>
              </div>

              {/* Consignment Verification Details */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Order Consignment:</span>
                  <span className="text-slate-900">#{order.id} • {order.productName} ({order.quantity} kg)</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Recipient Buyer:</span>
                  <span className="text-slate-900">{order.destination?.name || order.buyerName}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Farmer Direct Escrow Payout:</span>
                  <span className="text-emerald-700 font-extrabold text-sm">₹{payoutAmount}</span>
                </div>
              </div>

              {/* Handover OTP Input */}
              <div className="flex items-center gap-3">
                <div className="flex-1 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">{t('escrow_otp_label')}</label>
                  <input
                    type="text"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    maxLength={4}
                    className="w-full text-center tracking-widest font-mono font-extrabold text-lg p-2 bg-white border border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-none"
                    placeholder="2026"
                  />
                </div>

                <button
                  type="button"
                  disabled={isScanning}
                  onClick={handleSimulateScan}
                  className="flex-2 mt-5 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isScanning ? t('escrow_releasing_funds') : t('escrow_scan_btn')}</span>
                </button>
              </div>

            </div>
          )}

          {/* MODE 3: OFFICIAL NPCI / UPI SETTLEMENT VOUCHER */}
          {mode === 'receipt' && (
            <div className="space-y-6">
              
              {/* Success Badge */}
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/25">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase border border-emerald-200">
                  {t('escrow_settled_badge')}
                </span>
                <p className="text-xs text-slate-600 font-medium pt-1">
                  Physical delivery confirmed. Locked escrow has been automatically disbursed directly to the farmer.
                </p>
              </div>

              {/* Settlement Receipt Details */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3.5 shadow-xs text-xs">
                
                {/* UTR Reference Row */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{t('escrow_utr_label')}</span>
                    <p className="font-mono font-bold text-slate-900 text-sm">
                      {receipt?.utr || order.utrNumber || 'UPI/NPCI/2026/090288421'}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(receipt?.utr || order.utrNumber || 'UPI/NPCI/2026/090288421')}
                    className="p-2 text-slate-500 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                    title="Copy UTR"
                  >
                    {copiedUtr ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[10px] font-bold">{copiedUtr ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Farmer Beneficiary & Amount */}
                <div className="grid grid-cols-2 gap-3 py-1">
                  <div>
                    <span className="text-slate-400 text-[10px] block">{t('escrow_farmer_beneficiary')}</span>
                    <span className="font-bold text-slate-900 text-xs">{receipt?.farmerName || order.farmerName || 'Verified Farmer'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] block">{t('escrow_farmer_upi')}</span>
                    <span className="font-mono font-extrabold text-blue-700 text-xs">{receipt?.farmerUpi || 'farmer@upi'}</span>
                  </div>
                </div>

                {/* Rupee-Split Breakdown (Zero Commission Proof) */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>{t('escrow_gross_val')}</span>
                    <span className="font-bold text-slate-900">₹{payoutAmount}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>{t('escrow_middleman_cut')}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full">
                      {t('escrow_zero_cut_note')}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-slate-900">
                    <span>{t('escrow_credited_to')}</span>
                    <span className="text-emerald-700 text-base">₹{payoutAmount}</span>
                  </div>
                </div>

                {/* Simulated Farmer Mobile SMS */}
                <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px]">
                    <Smartphone className="w-3.5 h-3.5 text-amber-700" />
                    <span>{t('escrow_sms_sim_label')}</span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-800 bg-white p-2.5 rounded-lg border border-amber-200/60 leading-relaxed">
                    "Dear {receipt?.farmerName || order.farmerName || 'Farmer'}, your A/c XX3492 has been credited with Rs.{payoutAmount} on {new Date().toLocaleDateString()} via UPI (Ref: {receipt?.utr || 'UPI/NPCI/2026/0902'}). Zero middleman deduction. - FarmDirect Escrow Clearing"
                  </p>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    closeEscrowModal();
                    navigateTo('farmer-dash');
                  }}
                  className="w-full sm:flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Verify in Farmer Payouts Tab →</span>
                </button>

                <button
                  onClick={closeEscrowModal}
                  className="w-full sm:w-auto py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Close Voucher
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
export default EscrowSettlementModal;
