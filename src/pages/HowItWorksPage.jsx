import React from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, ArrowRight, CheckCircle2, ShieldCheck, Truck, ShoppingBag, Cpu } from 'lucide-react';

export const HowItWorksPage = () => {
  const { navigateTo, triggerDemoScenario, switchRole } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3.5 py-1 rounded-full border border-emerald-200 uppercase tracking-widest">
          HOW KISANCONNECT WORKS
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Direct Agricultural Trade Architecture
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          FarmDirect replaces traditional multi-tier mandis with direct FPO-to-Consumer contracts, supported by AI route optimization and demand prediction engines.
        </p>
      </div>

      {/* 4 Steps Detailed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Step 1 */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl">
            01
          </div>
          <h3 className="text-xl font-bold text-slate-900">1. Farmer / FPO Lists Produce</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Registered farmers enter crop parameters: quantity, unit, price per kg, harvest date, location, quality grade (Grade A/Organic), and produce photographs. Zero mandi listing fees applied.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                switchRole('Farmer');
                navigateTo('farmer-dash');
              }}
              className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
            >
              Try Farmer Dashboard →
            </button>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl">
            02
          </div>
          <h3 className="text-xl font-bold text-slate-900">2. Buyer Places Direct Purchase Order</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Retail consumers, restaurant chains, and bulk distributors search crops, review harvest freshness timestamps, and purchase with transparent pricing breakdown showing net savings.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('marketplace')}
              className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1"
            >
              Explore Marketplace →
            </button>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-xl">
            03
          </div>
          <h3 className="text-xl font-bold text-slate-900">3. AI Route & Load Optimization</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            KisanConnect AI groups pickup locations across nearby farms, calculates optimal cold-chain vehicle paths, and minimizes fuel costs by 22%.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('route-opt')}
              className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1"
            >
              View Route AI Engine →
            </button>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl">
            04
          </div>
          <h3 className="text-xl font-bold text-slate-900">4. Direct Delivery & Payout</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Produce reaches consumers with live map telemetry tracking. Payments are instantly transferred to the farmer's bank account with zero middleman deductions.
          </p>
          <div className="pt-2">
            <button
              onClick={triggerDemoScenario}
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              Run Interactive Demo Scenario →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
