import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { PriceBreakdown } from '../components/PriceBreakdown';
import { 
  Sprout, 
  ArrowRight, 
  TrendingUp, 
  Truck, 
  Users, 
  ShoppingBag, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Sparkles,
  BarChart3,
  MapPin,
  HeartHandshake
} from 'lucide-react';

export const LandingPage = () => {
  const { navigateTo, products, impactStats, triggerDemoScenario, switchRole } = useApp();

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
                <span>SIH Smart Agricultural Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                From Farm to You, <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                  Without the Middlemen.
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
                Connect directly with farmers and FPOs, get better prices, and build a smarter agricultural supply chain powered by AI demand forecasting and route optimization.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => navigateTo('marketplace')}
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm px-7 py-4 rounded-xl shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    switchRole('Farmer');
                    navigateTo('farmer-dash');
                  }}
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-7 py-4 rounded-xl border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2"
                >
                  <Sprout className="w-4 h-4 text-emerald-400" />
                  <span>Join as Farmer / FPO</span>
                </button>

                <button
                  onClick={triggerDemoScenario}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm px-5 py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Run Interactive Demo Flow</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> 0% Middleman Fees
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-400" /> AI Route Bundling
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Verified FPO Quality
                </span>
              </div>
            </div>

            {/* Right Hero Visual Banner */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-2xl opacity-30 animate-pulse-slow" />
                
                <div className="relative bg-slate-800 rounded-3xl p-3 border border-slate-700 shadow-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80"
                    alt="Indian Farmer Tech"
                    className="w-full h-80 object-cover rounded-2xl"
                  />

                  {/* Floating Stat Card 1 */}
                  <div className="absolute top-6 left-6 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-float">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      +18%
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Farmer Earnings</p>
                      <p className="text-xs font-bold text-white">Direct Trade Advantage</p>
                    </div>
                  </div>

                  {/* Floating Stat Card 2 */}
                  <div className="absolute bottom-6 right-6 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-float" style={{ animationDelay: '2s' }}>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                      -22%
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Logistics Cost</p>
                      <p className="text-xs font-bold text-white">AI Route Bundling</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* IMPACT STATISTICS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-emerald-500/5 grid grid-cols-2 lg:grid-cols-5 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          {impactStats.map((stat, idx) => (
            <div key={idx} className={`pt-4 lg:pt-0 ${idx !== 0 ? 'lg:pl-6' : ''} space-y-1`}>
              <p className="text-3xl font-black text-emerald-700 tracking-tight">{stat.value}</p>
              <p className="text-xs font-extrabold text-slate-900">{stat.label}</p>
              <p className="text-[11px] text-slate-500 leading-tight">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS — 4-STEP VISUAL PROCESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            TRANSPARENT 4-STEP PROCESS
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
            How FarmDirect Eliminates Middlemen
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            From listing produce to AI-optimized cold-chain delivery in four seamless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900">Farmer Lists Produce</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Farmer adds crop, harvest date, expected price, quality grade (Grade A/Organic), location, and available quantity.
            </p>
            <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <span>Zero Mandi Fee</span> • <span>Instant Listing</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-lg">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900">Buyer Places Order</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Consumers, restaurants, and wholesale bulk buyers purchase direct with complete price transparency comparison.
            </p>
            <div className="text-[11px] font-semibold text-amber-600 flex items-center gap-1">
              <span>Save ₹15-₹30/kg</span> • <span>Fresh Harvest</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-black text-lg">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900">AI Optimizes Logistics</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              AI algorithm pools nearby farmer pickups, optimizes delivery routes, and calculates shortest fuel path.
            </p>
            <div className="text-[11px] font-semibold text-teal-600 flex items-center gap-1">
              <span>-22% Transport Cost</span> • <span>Eco Delivery</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-lg">
              04
            </div>
            <h3 className="text-lg font-bold text-slate-900">Direct Delivery</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Fresh produce reaches consumers with live map tracking, and farmer receives instant bank payout.
            </p>
            <div className="text-[11px] font-semibold text-indigo-600 flex items-center gap-1">
              <span>Live Tracking</span> • <span>Direct Bank Credit</span>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURED PRODUCE MARKETPLACE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">FRESH DIRECT MARKETPLACE</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Available Fresh Produce</h2>
          </div>

          <button
            onClick={() => navigateTo('marketplace')}
            className="text-emerald-700 font-bold text-sm hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All Marketplace Items ({products.length})</span>
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
        <div className="bg-slate-900 text-white rounded-3xl p-8 lg:p-12 border border-slate-800 relative overflow-hidden space-y-10">
          
          <div className="max-w-3xl space-y-3">
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold px-3 py-1 rounded-full inline-block">
              SIH SPECIAL FEATURE HIGHLIGHTS
            </span>
            <h2 className="text-3xl font-black text-white sm:text-4xl">
              Engineered for National Agricultural Impact
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Combining farmer financial empowerment with state-of-the-art AI machine learning modules.
            </p>
          </div>

          {/* Impact & AI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">🤖 Demand Forecasting</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                7-day predictive AI crop demand algorithms analyzing historical sales, weather patterns, mandi price indices, and festival surges.
              </p>
              <button 
                onClick={() => navigateTo('ai-demand')}
                className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
              >
                View Demand Insights <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">🚚 Route Optimization</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Multi-hop logistics route bundling connecting micro-hub collection centers to reduce transit times by 45 mins & fuel costs by 22%.
              </p>
              <button 
                onClick={() => navigateTo('route-opt')}
                className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
              >
                View Route Optimization <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">📊 Market Intelligence</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Real-time price transparency engine matching Mandi rates with direct consumer purchasing power to guarantee fair farmer income.
              </p>
              <button 
                onClick={() => navigateTo('marketplace')}
                className="text-xs font-bold text-sky-400 hover:underline flex items-center gap-1"
              >
                Explore Marketplace <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
