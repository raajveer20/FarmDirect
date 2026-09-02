import React from 'react';
import { useApp } from '../context/AppContext';
import { Truck, MapPin, CheckCircle2, ShieldCheck, Zap, ArrowRight, User } from 'lucide-react';

export const LogisticsDashboard = () => {
  const { orders, acceptDelivery, navigateTo, showToast } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="glass-dark-card text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 backdrop-blur-md">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>LOGISTICS PARTNER CONSOLE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Driver & Dispatch Dashboard</h1>
          <p className="text-xs text-slate-300">
            Accept AI-optimized pickup routes to maximize payload capacity.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/15 text-center shrink-0">
          <p className="text-[10px] text-emerald-300 font-mono uppercase font-bold">Vehicle Capacity</p>
          <p className="text-2xl font-black text-white">850 kg / 1000 kg</p>
          <p className="text-[10px] text-slate-300">Tata Ace EV (MP-04-KC-2024)</p>
        </div>
      </div>

      {/* Active Orders for Pickup */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Active Cargo Pickups & Routes</h2>
          <button
            onClick={() => navigateTo('route-opt')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all"
          >
            View AI Route Optimizer Map →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((ord, idx) => (
            <div key={idx} className="bg-white/70 rounded-2xl p-5 border border-slate-200/80 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">Order #{ord.id}</span>
                <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">{ord.status}</span>
              </div>

              <div className="space-y-2 text-xs">
                <p className="font-black text-slate-900 text-sm">{ord.productName} ({ord.quantity} {ord.unit || 'kg'})</p>
                <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200/80">
                  <p className="text-slate-500 font-semibold">Pickup From:</p>
                  <p className="font-bold text-slate-800">{ord.farmerName}</p>
                </div>
                <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200/80">
                  <p className="text-slate-500 font-semibold">Deliver To:</p>
                  <p className="font-bold text-slate-800">{ord.deliveryAddress}</p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-emerald-700 font-extrabold">Payout Fee: ₹480</span>
                <button
                  onClick={() => {
                    acceptDelivery(ord.id);
                    navigateTo('order-tracking');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Accept Delivery Route
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
