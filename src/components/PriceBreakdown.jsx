import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, ShieldAlert, Sparkles, DollarSign } from 'lucide-react';

export const PriceBreakdown = ({ farmerPrice = 25, traditionalRetailPrice = 45, consumerPrice = 30, cropName = "Red Tomatoes" }) => {
  const farmerBoostPercent = Math.round(((farmerPrice - 20) / 20) * 100);
  const consumerSavings = traditionalRetailPrice - consumerPrice;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            PRICE TRANSPARENCY INDEX
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 mt-2">
            Why FarmDirect Pricing Wins
          </h3>
          <p className="text-xs text-slate-500">
            Comparative breakdown for <span className="font-semibold text-slate-700">{cropName}</span> (per kg)
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-3 rounded-xl shadow-md text-right shrink-0">
          <p className="text-[10px] text-emerald-200 uppercase font-semibold">Net Consumer Savings</p>
          <p className="text-2xl font-black">₹{consumerSavings} / kg</p>
          <p className="text-[10px] text-emerald-100 font-medium">Farmer earns +{farmerBoostPercent}% more</p>
        </div>
      </div>

      {/* Visual Flow Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Traditional Supply Chain Box */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Traditional Supply Chain</span>
            <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">5 Intermediaries</span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-600 font-medium">1. Farmer Received:</span>
              <span className="font-bold text-slate-800">₹20 / kg</span>
            </div>
            <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-200 text-slate-500">
              <span>2. Local Mandi Trader Cut:</span>
              <span>+ ₹6 / kg</span>
            </div>
            <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-200 text-slate-500">
              <span>3. Wholesale Agent Cut:</span>
              <span>+ ₹6 / kg</span>
            </div>
            <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-200 text-slate-500">
              <span>4. Retailer Markup:</span>
              <span>+ ₹13 / kg</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between font-bold text-sm">
            <span className="text-slate-700">Consumer Final Price:</span>
            <span className="text-rose-600 text-lg">₹{traditionalRetailPrice} / kg</span>
          </div>
        </div>

        {/* FarmDirect Model Box */}
        <div className="bg-emerald-50/60 rounded-xl p-5 border border-emerald-200 space-y-4 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              FarmDirect Model
            </span>
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              Direct & AI Optimized
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-emerald-200 shadow-sm">
              <span className="text-emerald-800 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                1. Farmer / FPO Earnings:
              </span>
              <span className="font-extrabold text-emerald-700 text-sm">₹{farmerPrice} / kg (+25%)</span>
            </div>
            <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-emerald-200 text-slate-600">
              <span>2. FarmDirect AI Cold Logistics & Fee:</span>
              <span className="font-medium">+ ₹5 / kg</span>
            </div>
            <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-emerald-200 text-slate-400 line-through">
              <span>3. Middlemen Commission:</span>
              <span>₹0 / kg</span>
            </div>
          </div>

          <div className="pt-3 border-t border-emerald-200 flex items-center justify-between font-bold text-sm">
            <span className="text-slate-800">Consumer Final Price:</span>
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
            <p className="font-bold text-sm text-white">Direct Win-Win Supply Chain</p>
            <p className="text-slate-300">Farmers receive higher earnings directly while consumers pay significantly lower prices.</p>
          </div>
        </div>
        <div className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs shrink-0 shadow-md">
          Zero Middlemen Hidden Fees
        </div>
      </div>
    </div>
  );
};
