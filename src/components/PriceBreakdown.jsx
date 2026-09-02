import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Sparkles, Award } from 'lucide-react';

export const PriceBreakdown = ({ farmerPrice = 25, traditionalRetailPrice = 45, consumerPrice = 30, cropName = "Red Tomatoes", quantity = 10 }) => {
  const { openMiddlemenModal, products, t } = useApp();
  const currentProduct = products.find(p => p.name === cropName) || products[0];

  const farmerGainPerKg = farmerPrice - Math.round(traditionalRetailPrice * 0.35);
  const farmerBoostPercent = Math.round((farmerGainPerKg / Math.max(1, Math.round(traditionalRetailPrice * 0.35))) * 100);
  const consumerSavings = traditionalRetailPrice - consumerPrice;
  const totalSavings = consumerSavings * quantity;
  const totalFarmerGain = farmerGainPerKg * quantity;

  return (
    <div className="glass-card rounded-3xl border border-white/80 p-6 sm:p-8 shadow-[0_8px_30px_-6px_rgba(15,23,42,0.05)] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {t('pb_index_badge')}
            </span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 uppercase tracking-wide">
              {t('pb_zero_margin_badge')}
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 mt-2">
            {t('pb_title')}
          </h3>
          <p className="text-xs text-slate-500">
            {t('pb_sub')} <span className="font-semibold text-slate-700">{t(cropName)}</span> ({quantity} kg {t('pb_batch')})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-3.5 rounded-2xl shadow-md text-right shrink-0">
            <p className="text-[10px] text-emerald-200 uppercase font-semibold">{t('pb_net_savings')}</p>
            <p className="text-2xl font-black">₹{consumerSavings} <span className="text-xs font-normal">/ kg</span></p>
            <p className="text-[10px] text-emerald-100 font-bold">{t('pb_total_save')}: ₹{totalSavings} • {t('pb_farmer_gain')} +{farmerBoostPercent}% (+₹{totalFarmerGain})</p>
          </div>

          <button
            onClick={() => openMiddlemenModal(currentProduct)}
            className="hidden md:flex flex-col items-center justify-center p-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl shadow-md text-xs transition-all cursor-pointer border border-amber-300 active:scale-95"
          >
            <Award className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">{t('pb_audit_split_btn')}</span>
          </button>
        </div>
      </div>

      {/* Visual Flow Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Traditional Supply Chain Box */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t('pb_trad_title')}</span>
            <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{t('pb_trad_intermediaries')}</span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-600 font-medium">{t('pb_trad_farmer')}</span>
              <span className="font-bold text-slate-800">₹20 / kg</span>
            </div>
            <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-200 text-slate-500">
              <span>{t('pb_trad_mandi')}</span>
              <span>+ ₹6 / kg</span>
            </div>
            <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-200 text-slate-500">
              <span>{t('pb_trad_wholesale')}</span>
              <span>+ ₹6 / kg</span>
            </div>
            <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-200 text-slate-500">
              <span>{t('pb_trad_retail')}</span>
              <span>+ ₹13 / kg</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between font-bold text-sm">
            <span className="text-slate-700">{t('pb_trad_final')}</span>
            <span className="text-rose-600 text-lg">₹{traditionalRetailPrice} / kg</span>
          </div>
        </div>

        {/* FarmDirect Model Box */}
        <div className="bg-emerald-50/60 rounded-xl p-5 border border-emerald-200 space-y-4 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {t('pb_fd_title')}
            </span>
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              {t('pb_fd_badge')}
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-emerald-200 shadow-sm">
              <span className="text-emerald-800 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {t('pb_fd_farmer')}
              </span>
              <span className="font-extrabold text-emerald-700 text-sm">₹{farmerPrice} / kg (+25%)</span>
            </div>
            <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-emerald-200 text-slate-600">
              <span>{t('pb_fd_logistics')}</span>
              <span className="font-medium">+ ₹5 / kg</span>
            </div>
            <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-emerald-200 text-slate-400 line-through">
              <span>{t('pb_fd_middlemen')}</span>
              <span>₹0 / kg</span>
            </div>
          </div>

          <div className="pt-3 border-t border-emerald-200 flex items-center justify-between font-bold text-sm">
            <span className="text-slate-800">{t('pb_fd_final')}</span>
            <span className="text-emerald-700 text-xl font-extrabold">₹{consumerPrice} / kg</span>
          </div>
        </div>

      </div>

      {/* Summary Highlight */}
      <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            ✓
          </div>
          <div>
            <p className="font-bold text-sm text-white">{t('pb_summary_title')}</p>
            <p className="text-slate-300">{t('pb_summary_desc')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => openMiddlemenModal(currentProduct)}
            className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <Award className="w-4 h-4 text-slate-950" />
            <span>{t('pb_audit_all_btn')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
