import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, X, ArrowRight, CheckCircle2, User, ShoppingBag, Truck, Cpu, BarChart3 } from 'lucide-react';

export const DemoGuideModal = () => {
  const { 
    isDemoGuideOpen, 
    setIsDemoGuideOpen, 
    demoStep, 
    setDemoStep, 
    switchRole, 
    navigateTo,
    products,
    addProduce,
    addToCart,
    placeOrder,
    acceptDelivery
  } = useApp();

  if (!isDemoGuideOpen) return null;

  const steps = [
    {
      step: 1,
      role: 'Farmer',
      title: 'Farmer Persona — Add Produce Listing',
      desc: 'Switch to Farmer Dashboard and list 500 kg Red Tomatoes at ₹25/kg.',
      actionLabel: 'Go to Add Produce Form',
      onExecute: () => {
        switchRole('Farmer');
        navigateTo('farmer-dash');
        setDemoStep(2);
      }
    },
    {
      step: 2,
      role: 'Marketplace',
      title: 'Produce Appears in Live Marketplace',
      desc: 'Verify that the new harvest listing is now visible to all consumers and bulk buyers with price transparency breakdown.',
      actionLabel: 'View Marketplace',
      onExecute: () => {
        switchRole('Guest');
        navigateTo('marketplace');
        setDemoStep(3);
      }
    },
    {
      step: 3,
      role: 'Buyer',
      title: 'Buyer Persona — Search & Add to Cart',
      desc: 'Simulate a buyer ordering 100 kg of fresh tomatoes directly from the FPO.',
      actionLabel: 'Add 100 kg Tomatoes to Cart',
      onExecute: () => {
        switchRole('Buyer');
        if (products.length > 0) {
          addToCart(products[0], 100);
        }
        navigateTo('buyer-dash');
        setDemoStep(4);
      }
    },
    {
      step: 4,
      role: 'Checkout',
      title: 'Place Order & Calculate Direct Savings',
      desc: 'Complete buyer checkout to save ₹1,500 compared to traditional retail pricing.',
      actionLabel: 'Place Order Now',
      onExecute: () => {
        placeOrder("Green Valley Supermarket, Bhopal");
        setDemoStep(5);
      }
    },
    {
      step: 5,
      role: 'Logistics',
      title: 'AI Route Optimization & Pickup Dispatch',
      desc: 'Logistics partner accepts the pickup request. AI bundles farmer locations, saving 19 km and ₹170 fuel.',
      actionLabel: 'View AI Route Optimization',
      onExecute: () => {
        switchRole('Logistics');
        navigateTo('route-opt');
        acceptDelivery('KC1025');
        setDemoStep(6);
      }
    },
    {
      step: 6,
      role: 'Analytics',
      title: 'Earnings Updated & AI Demand Forecast Surge',
      desc: 'Farmer dashboard shows updated revenue (+18%) and AI Demand Engine predicts next week regional crop trends.',
      actionLabel: 'Inspect AI Demand Insights',
      onExecute: () => {
        switchRole('Admin');
        navigateTo('ai-demand');
      }
    }
  ];

  const currentScenario = steps.find(s => s.step === demoStep) || steps[0];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full glass-modal text-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-white/20 animate-float">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-xs">
            SIH
          </span>
          <span className="text-xs font-bold text-emerald-400">Interactive Demo Flow (Scenario 18)</span>
        </div>
        <button 
          onClick={() => setIsDemoGuideOpen(false)}
          className="text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="py-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30">
            Step {currentScenario.step} of 6
          </span>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
            {currentScenario.role}
          </span>
        </div>

        <h4 className="text-sm font-extrabold text-white leading-snug">{currentScenario.title}</h4>
        <p className="text-xs text-slate-300 leading-relaxed">{currentScenario.desc}</p>

        {/* Step Progress Pills */}
        <div className="flex items-center gap-1.5 pt-1">
          {steps.map(s => (
            <div
              key={s.step}
              onClick={() => setDemoStep(s.step)}
              className={`h-1.5 flex-1 rounded-full cursor-pointer transition-all ${
                s.step === demoStep
                  ? 'bg-amber-400 ring-2 ring-amber-400/40'
                  : s.step < demoStep
                  ? 'bg-emerald-500'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
        <button
          onClick={() => setDemoStep(prev => Math.max(1, prev - 1))}
          disabled={demoStep === 1}
          className="text-xs text-slate-400 hover:text-white disabled:opacity-30"
        >
          Previous Step
        </button>

        <button
          onClick={currentScenario.onExecute}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
        >
          <span>{currentScenario.actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
