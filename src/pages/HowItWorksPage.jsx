import React from 'react';
import { useApp } from '../context/AppContext';

export const HowItWorksPage = () => {
  const { navigateTo, triggerDemoScenario, switchRole, t } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="glass-pill text-emerald-800 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest border border-emerald-200/60 shadow-2xs">
          {t('how_lifecycle_badge')}
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          {t('how_title')}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {t('how_sub')}
        </p>
      </div>

      {/* 4 Steps Detailed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Step 1 */}
        <div className="glass-card p-8 rounded-3xl border border-white/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] hover:-translate-y-1 transition-all duration-300 space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-700/20">
            01
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">1. {t('step1_title')}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('step1_desc')}
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                switchRole('Farmer');
                navigateTo('farmer-dash');
              }}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              {t('hiw_btn_farmer')}
            </button>
          </div>
        </div>

        {/* Step 2 */}
        <div className="glass-card p-8 rounded-3xl border border-white/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] hover:-translate-y-1 transition-all duration-300 space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-md shadow-amber-500/20">
            02
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">2. {t('step2_title')}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('step2_desc')}
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('marketplace')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              {t('hiw_btn_buyer')}
            </button>
          </div>
        </div>

        {/* Step 3 */}
        <div className="glass-card p-8 rounded-3xl border border-white/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] hover:-translate-y-1 transition-all duration-300 space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-teal-700/20">
            03
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">3. {t('step3_title')}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('step3_desc')}
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('route-opt')}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              {t('hiw_btn_route')}
            </button>
          </div>
        </div>

        {/* Step 4 */}
        <div className="glass-card p-8 rounded-3xl border border-white/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] hover:-translate-y-1 transition-all duration-300 space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-indigo-700/20">
            04
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">4. {t('step4_title')}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('step4_desc')}
          </p>
          <div className="pt-2">
            <button
              onClick={triggerDemoScenario}
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              {t('hiw_btn_demo')}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
