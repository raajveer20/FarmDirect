import React from 'react';
import { useApp } from '../context/AppContext';
import { TrackingTimeline } from '../components/TrackingTimeline';
import { Truck, MapPin, CheckCircle2, ShieldCheck, PhoneCall, Navigation, ArrowLeft } from 'lucide-react';

export const OrderTrackingPage = () => {
  const { orders, trackedOrderId, navigateTo } = useApp();

  const currentOrder = orders.find(o => o.id === trackedOrderId) || orders[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Button */}
      <button
        onClick={() => navigateTo('buyer-dash')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-600 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Buyer Dashboard</span>
      </button>

      {/* Main Tracking Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="bg-emerald-500/30 text-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
            REAL-TIME SUPPLY CHAIN TRACKING
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">Tracking Order #{currentOrder?.id}</h1>
          <p className="text-xs text-slate-300">
            Live cold-chain telemetry & driver route progress.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0">
          <p className="text-[10px] text-emerald-200 uppercase font-bold">Estimated Arrival</p>
          <p className="text-2xl font-black text-white">45 Mins</p>
          <p className="text-[10px] text-slate-300">Direct Route Active</p>
        </div>
      </div>

      {/* Status Timeline Milestone Component (Requirement #11) */}
      <TrackingTimeline order={currentOrder} />

      {/* Live Map Telemetry Simulation Visualizer */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5" /> LIVE GPS ROUTE SIMULATION
            </span>
            <h3 className="text-xl font-black text-white mt-1">
              Driver Transit Stream: Bhopal Metro Hub
            </h3>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Speed: <span className="text-emerald-400 font-bold">42 km/h</span> • Temp: <span className="text-emerald-400 font-bold">4°C Cold Storage</span>
          </div>
        </div>

        {/* Interactive Map Visual Box */}
        <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 h-64 relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />

          <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-emerald-500/50 stroke-2">
            <path d="M 100 180 C 250 50, 450 250, 700 120" fill="none" className="animate-pulse" />
          </svg>

          {/* Animated Truck Icon on Map */}
          <div className="relative z-10 flex flex-col items-center gap-2 animate-bounce">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-xl shadow-emerald-500/40">
              <Truck className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold bg-slate-900/90 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/40">
              In Transit • 3.2 km to Destination
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 pt-2">
          <span>Pickup: {currentOrder?.farmerName}</span>
          <span className="text-emerald-400 font-semibold">✓ Guaranteed Cold-Chain Freshness</span>
          <span>Delivery: {currentOrder?.deliveryAddress}</span>
        </div>
      </div>

    </div>
  );
};
