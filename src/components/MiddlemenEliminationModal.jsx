import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  ShoppingBag,
  Scissors,
  TrendingUp,
  ShieldCheck,
  Sprout
} from 'lucide-react';

export const MiddlemenEliminationModal = () => {
  const { 
    isMiddlemenModalOpen, 
    setIsMiddlemenModalOpen, 
    selectedBreakdownCrop, 
    setSelectedBreakdownCrop, 
    products,
    calculateMiddlemenBreakdown,
    addToCart,
    t
  } = useApp();

  const [quantity, setQuantity] = useState(25); // Default 25 kg for demo

  // Resolve current active product
  const activeProduct = selectedBreakdownCrop || products[0];

  // Calculate economics using the formula engine
  const breakdown = useMemo(() => {
    if (!activeProduct) return null;
    return calculateMiddlemenBreakdown(activeProduct, quantity);
  }, [activeProduct, quantity, calculateMiddlemenBreakdown]);

  if (!isMiddlemenModalOpen || !activeProduct || !breakdown) return null;

  const { perKg, totals } = breakdown;

  const handleQuickAdd = () => {
    addToCart(activeProduct, quantity);
    setIsMiddlemenModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200/80 overflow-hidden my-auto">
        
        {/* Header with SIH Problem Statement Alignment */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-5 sm:p-6 relative shrink-0">
          <button 
            onClick={() => setIsMiddlemenModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-black tracking-widest bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 shadow-xs">
              <Award className="w-3 h-3" />
              {t('modal_sih_badge')}
            </span>
            <span className="text-[10px] font-bold bg-white/15 px-2.5 py-0.5 rounded-full text-emerald-100">
              {t('modal_audit_badge')}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {t('modal_title')}
          </h2>
          <p className="text-xs text-emerald-100/90 max-w-2xl mt-1 leading-relaxed">
            {t('modal_sub')}
          </p>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* Crop Switcher Tabs & Quantity Controls */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                {t('modal_select_crop')}
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {products.slice(0, 5).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedBreakdownCrop(p)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      activeProduct.id === p.id 
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' 
                        : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {p.name.split(' ')[p.name.includes('Red') ? 2 : 0] || p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Slider / Presets */}
            <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">{t('modal_batch_qty')}</span>
                <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 shadow-2xs">
                  <input 
                    type="number"
                    min="10"
                    max="5000"
                    step="5"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-16 text-center font-black text-sm text-slate-900 focus:outline-none"
                  />
                  <span className="text-xs font-bold text-slate-500">kg</span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-500">Presets:</span>
                {[10, 25, 50, 100, 250].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuantity(q)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      quantity === q 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-300'
                    }`}
                  >
                    {q} kg
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Big 4 Impact Summary KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* KPI 1: Middlemen Cut Slashed */}
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wide">
                Middleman Margin Slashed
              </span>
              <div className="text-xl sm:text-2xl font-black text-rose-900">
                ₹{totals.totalMiddlemenMarginCut.toLocaleString('en-IN')}
              </div>
              <p className="text-[10px] text-rose-600 font-semibold">100% Intermediary cut deleted</p>
            </div>

            {/* KPI 2: Farmer Extra Income */}
            <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-rose-700 tracking-wider">{t('modal_kpi_margin_slashed')}</span>
                <Scissors className="w-4 h-4 text-rose-600" />
              </div>
              <p className="text-xl font-black text-rose-900">₹{totals.totalMiddlemenCut.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-rose-600/90 font-semibold">{t('modal_kpi_margin_sub')}</p>
            </div>

            {/* KPI 2: Farmer Extra Profit */}
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider">{t('modal_kpi_farmer_gain')}</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xl font-black text-emerald-900">
                +₹{totals.totalFarmerExtraGain.toLocaleString('en-IN')}{' '}
                <span className="text-xs font-bold text-emerald-700">({breakdown.farmerGainPercent >= 0 ? '+' : ''}{breakdown.farmerGainPercent}%)</span>
              </p>
              <p className="text-[10px] text-emerald-600/90 font-semibold">{t('modal_kpi_farmer_sub')}</p>
            </div>

            {/* KPI 3: Buyer Cost Savings */}
            <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider">{t('modal_kpi_buyer_saved')}</span>
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xl font-black text-blue-900">
                -₹{totals.totalBuyerSavings.toLocaleString('en-IN')}{' '}
                <span className="text-xs font-bold text-blue-700">(-{breakdown.buyerSavingsPercent}%)</span>
              </p>
              <p className="text-[10px] text-blue-600/90 font-semibold">{t('modal_kpi_buyer_sub')}</p>
            </div>

            {/* KPI 4: Transit Food Spoilage Saved */}
            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">{t('modal_kpi_waste_saved')}</span>
                <Sprout className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-xl font-black text-amber-900">~{totals.spoilagePreventedKg} kg</p>
              <p className="text-[10px] text-amber-700/90 font-semibold">{t('modal_kpi_waste_sub')}</p>
            </div>
          </div>

          {/* Visual Side-by-Side Waterfall Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* LEFT COLUMN: Traditional Mandi 5-Tier Supply Chain */}
            <div className="rounded-2xl p-5 border-2 border-rose-200 bg-rose-50/40 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-rose-200">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                    Traditional APMC Supply Chain
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 mt-1">
                    5 Intermediaries (Extractive)
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-bold block">Consumer Pays</span>
                  <span className="text-lg font-black text-rose-700">₹{perKg.traditionalRetailPrice} / kg</span>
                </div>
              </div>

              {/* Price Flow Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-rose-200 font-bold">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px]">1</span>
                    Farmer Farm-Gate Realization:
                  </span>
                  <span className="text-slate-900">₹{perKg.tradFarmerReceived} / kg <span className="text-[10px] text-slate-400 font-normal">(35%)</span></span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-white/80 border border-slate-200 text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px]">2</span>
                    Village Aggregator / Broker:
                  </span>
                  <span className="font-semibold text-rose-600">+ ₹{perKg.tradVillageBroker} / kg</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-white/80 border border-slate-200 text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px]">3</span>
                    APMC Commission Agent (Arhtiya):
                  </span>
                  <span className="font-semibold text-rose-600">+ ₹{perKg.tradApmcAgent} / kg</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-white/80 border border-slate-200 text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px]">4</span>
                    Mandi Secondary Wholesaler:
                  </span>
                  <span className="font-semibold text-rose-600">+ ₹{perKg.tradWholesaler} / kg</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-white/80 border border-slate-200 text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px]">5</span>
                    City Retail Vendor Markup:
                  </span>
                  <span className="font-semibold text-rose-600">+ ₹{perKg.tradRetailer} / kg</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-rose-100/70 text-rose-900 text-[11px] font-semibold flex items-center justify-between">
                <span>Middlemen Pocket:</span>
                <span className="font-black text-rose-700">₹{perKg.tradMiddlemenTotal} / kg (65% of Rupee)</span>
              </div>
            </div>

            {/* RIGHT COLUMN: FarmDirect Direct Model */}
            <div className="rounded-2xl p-5 border-2 border-emerald-300 bg-emerald-50/50 space-y-4 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1 w-fit">
                    <Sparkles className="w-3 h-3 text-emerald-700" />
                    FarmDirect Disintermediated
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 mt-1">
                    Direct Farm-to-Fork Platform
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-700 font-bold block">Consumer Pays</span>
                  <span className="text-lg font-black text-emerald-700">₹{perKg.consumerPrice} / kg</span>
                </div>
              </div>

              {/* Price Flow Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-600 text-white font-bold shadow-xs">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    1. Farmer Direct Escrow Payout:
                  </span>
                  <span className="text-sm font-black">₹{perKg.fdFarmerReceived} / kg <span className="text-emerald-200 text-xs font-semibold">(+{totals.farmerGainPercent}%)</span></span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-emerald-200 text-slate-700">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">2</span>
                    AI Milk-Run Pooled Transport:
                  </span>
                  <span className="font-semibold text-emerald-700">+ ₹{perKg.fdLogisticsFee} / kg</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-emerald-200 text-slate-700">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">3</span>
                    FarmDirect Platform Maintenance:
                  </span>
                  <span className="font-semibold text-emerald-700">+ ₹{perKg.fdPlatformFee} / kg</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-emerald-200 text-slate-400 line-through">
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[10px]">4</span>
                    5 Middlemen Cuts & Broker Fees:
                  </span>
                  <span>₹0 / kg (ELIMINATED)</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-emerald-200 text-slate-400 line-through">
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[10px]">5</span>
                    Unorganized Mandi Spoilage Waste:
                  </span>
                  <span>₹0 / kg (PREVENTED)</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-900 text-[11px] font-semibold flex items-center justify-between">
                <span>Farmer Rupee Share:</span>
                <span className="font-black text-emerald-800 text-xs">85% of Consumer Rupee (vs 35% Mandi)</span>
              </div>
            </div>

          </div>

          {/* Visual Percentage Distribution Comparison Bar */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Consumer Rupee Distribution Comparison (%):</span>
              <span className="text-[11px] text-slate-500">For {breakdown.cropName}</span>
            </div>

            {/* Traditional Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-600">
                <span>Traditional Mandi:</span>
                <span>Farmer gets only 35% | Middlemen take 65%</span>
              </div>
              <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex">
                <div style={{ width: '35%' }} className="bg-amber-500" title="Farmer (35%)" />
                <div style={{ width: '12%' }} className="bg-rose-400" title="Village Broker (12%)" />
                <div style={{ width: '10%' }} className="bg-rose-500" title="APMC Commission Agent (10%)" />
                <div style={{ width: '16%' }} className="bg-rose-600" title="Wholesaler (16%)" />
                <div style={{ width: '27%' }} className="bg-rose-700" title="Retail Markup (27%)" />
              </div>
            </div>

            {/* FarmDirect Bar */}
            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-[10px] font-bold text-slate-600">
                <span className="text-emerald-700">FarmDirect Model:</span>
                <span className="text-emerald-700">Farmer gets 85% | Logistics 12% | Tech 3%</span>
              </div>
              <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex">
                <div style={{ width: '85%' }} className="bg-emerald-600" title="Farmer Direct (85%)" />
                <div style={{ width: '12%' }} className="bg-teal-500" title="AI Pooled Logistics (12%)" />
                <div style={{ width: '3%' }} className="bg-slate-700" title="Platform Tech (3%)" />
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-100/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600 font-medium">
            Buying <strong className="text-slate-900">{quantity} kg</strong> of {activeProduct.name} transfers <strong className="text-emerald-700 font-bold">+₹{totals.totalFarmerExtraGain.toLocaleString('en-IN')}</strong> directly to farmer <span className="font-semibold">{activeProduct.farmer}</span>.
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setIsMiddlemenModalOpen(false)}
              className="px-4 py-2.5 bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition-colors cursor-pointer flex-1 sm:flex-initial"
            >
              {t('modal_close')}
            </button>
            <button
              onClick={handleQuickAdd}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer flex-1 sm:flex-initial"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t('modal_add_cart')}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
