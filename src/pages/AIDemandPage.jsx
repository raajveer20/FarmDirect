import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DemandChart } from '../components/DemandChart';
import { Cpu, TrendingUp, Sparkles, MapPin, Calendar, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export const AIDemandPage = () => {
  const { aiDemandForecasts, navigateTo, switchRole } = useApp();
  const [selectedCrop, setSelectedCrop] = useState('Tomato');

  const currentForecast = aiDemandForecasts.find(f => f.crop.toLowerCase() === selectedCrop.toLowerCase()) || aiDemandForecasts[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>AI DEMAND FORECASTING ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">7-Day Predictive Crop Demand & Price Intelligence</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Helping farmers list produce at optimal prices and preventing market glut with predictive machine learning algorithms.
          </p>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-center shrink-0">
          <p className="text-[10px] text-emerald-400 font-mono uppercase font-bold">Accuracy Index</p>
          <p className="text-3xl font-black text-white">94.2%</p>
          <p className="text-[10px] text-slate-400">Validated across 12 Mandis</p>
        </div>
      </div>

      {/* 3 Crop Trend Cards (Requirement #7) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {aiDemandForecasts.map(fc => (
          <div
            key={fc.crop}
            onClick={() => setSelectedCrop(fc.crop)}
            className={`p-6 rounded-2xl border transition-all cursor-pointer space-y-3 relative ${
              selectedCrop.toLowerCase() === fc.crop.toLowerCase()
                ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
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

            <h3 className="text-2xl font-black text-slate-900">{fc.crop}</h3>

            <div className="flex items-baseline gap-2">
              <span className="text-slate-500 text-xs">Predicted Demand:</span>
              <span className="text-xl font-extrabold text-emerald-700">{fc.predictedDemand} kg</span>
            </div>

            <p className="text-[11px] text-slate-500 line-clamp-2">{fc.actionTip}</p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-600 font-bold">Price: {fc.recommendedPrice}</span>
              <span className="text-slate-400 font-semibold">{fc.region.split(' ')[0]}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Interactive Recharts Graph Component */}
      <DemandChart forecast={currentForecast} />

      {/* AI Factors & Data Source Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Data Factors Used by FarmDirect AI</h3>
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
