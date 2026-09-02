import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { PriceBreakdown } from '../components/PriceBreakdown';
import { 
  Sprout, 
  ArrowRight, 
  Truck, 
  ShoppingBag, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Sparkles,
  BarChart3
} from 'lucide-react';

export const LandingPage = () => {
  const { navigateTo, products, triggerDemoScenario, openAuthModal, t } = useApp();

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-20 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950 text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-emerald-300 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{t('hero_badge')}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                {t('hero_title_1')} <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                  {t('hero_title_2')}
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
                {t('hero_desc')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => openAuthModal('Farmer', 'register')}
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sprout className="w-4 h-4" />
                  <span>{t('hero_cta_farmer')}</span>
                </button>

                <button
                  onClick={() => navigateTo('marketplace')}
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-6 py-3.5 rounded-2xl border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-blue-400" />
                  <span>{t('hero_cta_buyer')}</span>
                </button>

                <button
                  onClick={triggerDemoScenario}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm px-5 py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>{t('hero_cta_demo')}</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> {t('hero_trust_verified')}
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-400" /> {t('hero_trust_escrow')}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {t('hero_trust_zero_cut')}
                </span>
              </div>
            </div>

            {/* Right Hero Visual Banner */}
            <div className="lg:col-span-5 relative">
              <div className="bg-gradient-to-tr from-emerald-600/20 to-teal-500/20 rounded-3xl p-2 border border-white/10 backdrop-blur-sm shadow-2xl">
                <div className="bg-slate-900/90 rounded-2xl p-6 space-y-6 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{t('hero_mandi_vs_direct')}</span>
                    <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      {t('hero_active_mkt')}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
                      <div>
                        <p className="text-slate-400 text-[10px]">{t('hero_harvest_batch')}</p>
                        <p className="font-extrabold text-white text-sm">{t('Nagpur Sweet Oranges')}</p>
                      </div>
                      <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
                        {t('hero_direct_farm')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                        <span className="text-slate-400 text-[10px] block">{t('hero_mandi_price')}</span>
                        <span className="text-slate-400 line-through font-bold">₹75 / kg</span>
                      </div>
                      <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/40">
                        <span className="text-emerald-400 text-[10px] font-bold block">{t('hero_fd_rate')}</span>
                        <span className="text-emerald-400 text-base font-black">₹48 / kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-950/50 rounded-xl border border-emerald-500/20 text-[11px] text-emerald-200 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t('hero_buyer_seller_benefit')}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* GATEWAY PORTALS ARCHITECTURE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
            {t('portal_badge')}
          </span>
          <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
            {t('portal_title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {t('portal_sub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Gateway 1: Farmer & FPO */}
          <div className="glass-card rounded-3xl p-7 border border-white/80 hover:border-emerald-500/40 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.08)] hover:shadow-[0_20px_40px_-12px_rgba(16,185,129,0.18)] transition-all space-y-6 flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/25 group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black tracking-widest text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full uppercase border border-emerald-200/50">
                {t('portal_tag_farmer')}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{t('portal_farmer_title')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {t('portal_farmer_desc')}
              </p>
              <ul className="text-xs text-slate-700 space-y-2.5 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('portal_farmer_feat1')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('portal_farmer_feat2')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('portal_farmer_feat3')}</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <button
                onClick={() => openAuthModal('Farmer', 'register')}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('portal_farmer_btn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Gateway 2: Buyer & Wholesale */}
          <div className="glass-card rounded-3xl p-7 border border-white/80 hover:border-blue-500/40 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.08)] hover:shadow-[0_20px_40px_-12px_rgba(37,99,235,0.18)] transition-all space-y-6 flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-500 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/25 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black tracking-widest text-blue-800 bg-blue-100/80 px-2.5 py-1 rounded-full uppercase border border-blue-200/50">
                {t('portal_tag_buyer')}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{t('portal_buyer_title')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {t('portal_buyer_desc')}
              </p>
              <ul className="text-xs text-slate-700 space-y-2.5 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{t('portal_buyer_feat1')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{t('portal_buyer_feat2')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{t('portal_buyer_feat3')}</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <button
                onClick={() => openAuthModal('Buyer', 'login')}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('portal_buyer_btn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Gateway 3: Logistics / Admin */}
          <div className="glass-card rounded-3xl p-7 border border-white/80 hover:border-amber-500/40 shadow-[0_10px_30px_-10px_rgba(245,158,11,0.08)] hover:shadow-[0_20px_40px_-12px_rgba(245,158,11,0.18)] transition-all space-y-6 flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-600/25 group-hover:scale-105 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black tracking-widest text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-full uppercase border border-amber-200/50">
                {t('portal_tag_logistics')}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{t('portal_logistics_title')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {t('portal_logistics_desc')}
              </p>
              <ul className="text-xs text-slate-700 space-y-2.5 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{t('portal_logistics_feat1')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{t('portal_logistics_feat2')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{t('portal_logistics_feat3')}</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <button
                onClick={() => openAuthModal('Logistics', 'login')}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('portal_logistics_btn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS PROCESS BREAKDOWN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{t('how_lifecycle_badge')}</span>
          <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">{t('how_title')}</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {t('how_sub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Step 1 */}
          <div className="glass-card rounded-3xl p-6 border border-white/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04)] space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 border border-emerald-200/60 text-emerald-700 flex items-center justify-center font-black text-lg shadow-2xs">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">{t('step1_title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {t('step1_desc')}
            </p>
            <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <span>{t('step1_pill')}</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass-card rounded-3xl p-6 border border-white/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04)] space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/80 border border-amber-200/60 text-amber-700 flex items-center justify-center font-black text-lg shadow-2xs">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">{t('step2_title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {t('step2_desc')}
            </p>
            <div className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
              <span>{t('step2_pill')}</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass-card rounded-3xl p-6 border border-white/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04)] space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-teal-100/80 border border-teal-200/60 text-teal-700 flex items-center justify-center font-black text-lg shadow-2xs">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">{t('step3_title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {t('step3_desc')}
            </p>
            <div className="text-[11px] font-bold text-teal-600 flex items-center gap-1">
              <span>{t('step3_pill')}</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="glass-card rounded-3xl p-6 border border-white/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04)] space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100/80 border border-indigo-200/60 text-indigo-700 flex items-center justify-center font-black text-lg shadow-2xs">
              04
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">{t('step4_title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {t('step4_desc')}
            </p>
            <div className="text-[11px] font-bold text-indigo-600 flex items-center gap-1">
              <span>{t('step4_pill')}</span>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURED PRODUCE MARKETPLACE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{t('feat_badge')}</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{t('feat_title')}</h2>
          </div>

          <button
            onClick={() => navigateTo('marketplace')}
            className="text-emerald-700 font-bold text-sm hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>{t('feat_view_all')} ({products.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* PRICE TRANSPARENCY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PriceBreakdown 
          farmerPrice={25}
          traditionalRetailPrice={45}
          consumerPrice={30}
          cropName="Grade A Red Tomatoes"
        />
      </section>

      {/* SIH PRESENTATION FEATURES — OUR IMPACT & POWERED BY AI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="glass-dark-card text-white rounded-3xl p-8 lg:p-12 relative overflow-hidden space-y-10 shadow-2xl">
          
          <div className="max-w-3xl space-y-3">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-extrabold px-3 py-1 rounded-full inline-block backdrop-blur-md">
              {t('innov_badge')}
            </span>
            <h2 className="text-3xl font-black text-white sm:text-4xl tracking-tight">
              {t('innov_title')}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {t('innov_sub')}
            </p>
          </div>

          {/* Impact & AI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-emerald-400/50 hover:bg-white/[0.08] transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{t('innov_card1_title')}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t('innov_card1_desc')}
              </p>
              <button 
                onClick={() => navigateTo('ai-demand')}
                className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{t('innov_card1_btn')}</span> <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2 */}
            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-amber-400/50 hover:bg-white/[0.08] transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{t('innov_card2_title')}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t('innov_card2_desc')}
              </p>
              <button 
                onClick={() => navigateTo('route-opt')}
                className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{t('innov_card2_btn')}</span> <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 3 */}
            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-sky-400/50 hover:bg-white/[0.08] transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{t('innov_card3_title')}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t('innov_card3_desc')}
              </p>
              <button 
                onClick={() => navigateTo('marketplace')}
                className="text-xs font-bold text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{t('innov_card3_btn')}</span> <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
