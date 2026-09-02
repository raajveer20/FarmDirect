import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DemandChart } from '../components/DemandChart';
import { Cpu, TrendingUp, Sparkles, MapPin, Calendar, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export const AIDemandPage = () => {
  const { aiDemandForecasts, navigateTo, currentUser, userRole, openAuthModal } = useApp();
  const [selectedCrop, setSelectedCrop] = useState('Tomato');

  const currentForecast = aiDemandForecasts.find(f => f.crop.toLowerCase() === selectedCrop.toLowerCase()) || aiDemandForecasts[0];

  // Access Guard: AI Insights only available to Farmer & Logistics, and only after login
  if (!currentUser) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/80 shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-600 border border-amber-500/30 flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200">
              Restricted Access • Authentication Required
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              AI Insights & Demand Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Real-time predictive crop demand and price intelligence are exclusively available to authenticated <strong>Farmers & FPOs</strong> and <strong>Logistics Partners</strong> to safeguard fair agricultural trade.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => openAuthModal('Farmer', 'login')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4" />
              <span>Login as Farmer / FPO</span>
            </button>
            <button
              onClick={() => openAuthModal('Logistics', 'login')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Login as Logistics Partner</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (userRole !== 'Farmer' && userRole !== 'Logistics' && userRole !== 'Admin' && userRole !== 'Logistics / Admin') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/80 shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/15 text-rose-600 border border-rose-500/30 flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="bg-rose-100 text-rose-900 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-rose-200">
              Farmer & Logistics Portal Only
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Access Reserved for Producers & Fleet Operators
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              You are currently logged in as a <strong>Buyer</strong>. AI market demand curves and price elasticity forecasts are protected producer tools.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('marketplace')}
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition-all"
            >
              Browse Fresh Crops in Marketplace →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-dark-card text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 backdrop-blur-md">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>AI DEMAND FORECASTING ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">7-Day Predictive Crop Demand & Price Intelligence</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Helping farmers list produce at optimal prices and preventing market glut with predictive machine learning algorithms.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/15 text-center shrink-0">
          <p className="text-[10px] text-emerald-300 font-mono uppercase font-bold">Accuracy Index</p>
          <p className="text-3xl font-black text-white">94.2%</p>
          <p className="text-[10px] text-slate-300">Validated across 12 Mandis</p>
        </div>
      </div>

      {/* 3 Crop Trend Cards (Requirement #7) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {aiDemandForecasts.map(fc => (
          <div
            key={fc.crop}
            onClick={() => setSelectedCrop(fc.crop)}
            className={`glass-card p-6 sm:p-7 rounded-3xl border transition-all cursor-pointer space-y-3.5 relative ${
              selectedCrop.toLowerCase() === fc.crop.toLowerCase()
                ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-xl shadow-emerald-500/10'
                : 'border-white/80 hover:border-slate-300 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Next 7 Days Forecast</span>
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                fc.isSurge ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
              }`}>
                <TrendingUp className="w-3.5 h-3.5" />
                ↑ {fc.trendPercent}% Trend
              </span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{fc.crop}</h3>

            <div className="flex items-baseline gap-2">
              <span className="text-slate-500 text-xs font-medium">Predicted Demand:</span>
              <span className="text-xl font-black text-emerald-700">{fc.predictedDemand} kg</span>
            </div>

            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{fc.actionTip}</p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-emerald-600 font-bold">Price: {fc.recommendedPrice}</span>
              <span className="text-slate-400 font-semibold">{fc.region.split(' ')[0]}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Interactive Recharts Graph Component */}
      <DemandChart forecast={currentForecast} />

      {/* AI Factors & Data Source Breakdown */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] space-y-4">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Data Factors Used by FarmDirect AI</h3>
        <p className="text-xs text-slate-500">
          Our Machine Learning models synthesize multi-modal real-time inputs to calculate region-wise demand curves.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {[
            { title: "Historical Sales", desc: "Past 3-year seasonal sales velocity" },
            { title: "Seasonal Weather", desc: "Monsoon & rainfall moisture telemetry" },
            { title: "Mandi Prices", desc: "Agmarknet wholesale price indices" },
            { title: "Festival Demand", desc: "Regional cultural & holiday spikes" },
            { title: "Logistics Latency", desc: "Cold-chain route availability" },
            { title: "Market Trends", desc: "Consumer & restaurant order volume" }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="font-extrabold text-slate-800">{item.title}</p>
              <p className="text-[10px] text-slate-500 leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
