import React, { useState } from 'react';
import { Truck, MapPin, CheckCircle, Navigation, Shield, Zap, RefreshCw } from 'lucide-react';

export const RouteMap = ({ stops, unoptimized, optimized, savings }) => {
  const [activeTab, setActiveTab] = useState('optimized');
  const [selectedStop, setSelectedStop] = useState(stops[0]);

  return (
    <div className="glass-dark-card text-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              AI ROUTE OPTIMIZATION ENGINE
            </span>
          </div>
          <h3 className="text-xl font-black text-white mt-1 tracking-tight">
            Smart Logistics Route & Bundling
          </h3>

        </div>

        {/* Toggle Optimized vs Unoptimized */}
        <div className="flex items-center bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('optimized')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activeTab === 'optimized' 
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            AI Optimized Route
          </button>
          <button
            onClick={() => setActiveTab('unoptimized')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activeTab === 'unoptimized' 
                ? 'bg-slate-700 text-slate-200 font-bold' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Unoptimized Baseline
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
          <p className="text-[11px] text-slate-400 uppercase font-semibold">Total Distance</p>
          <p className="text-2xl font-black text-white mt-0.5">
            {activeTab === 'optimized' ? `${optimized.distanceKm} km` : `${unoptimized.distanceKm} km`}
          </p>
          <p className="text-[10px] text-emerald-400 font-medium mt-0.5">
            {activeTab === 'optimized' ? `Saved ${savings.distanceKm} km (${savings.distancePercent}%)` : 'Baseline'}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
          <p className="text-[11px] text-slate-400 uppercase font-semibold">Fuel Cost</p>
          <p className="text-2xl font-black text-emerald-400 mt-0.5">
            ₹{activeTab === 'optimized' ? optimized.fuelCost : unoptimized.fuelCost}
          </p>
          <p className="text-[10px] text-emerald-300 font-medium mt-0.5">
            {activeTab === 'optimized' ? `Saved ₹${savings.fuelSaved} per trip` : 'Higher Consumption'}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
          <p className="text-[11px] text-slate-400 uppercase font-semibold">Estimated Time</p>
          <p className="text-2xl font-black text-amber-400 mt-0.5">
            {activeTab === 'optimized' ? optimized.travelTime : unoptimized.travelTime}
          </p>
          <p className="text-[10px] text-amber-300 font-medium mt-0.5">
            {activeTab === 'optimized' ? `Saved ${savings.timeSaved}` : 'Delayed Delivery'}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
          <p className="text-[11px] text-slate-400 uppercase font-semibold">Carbon Reduction</p>
          <p className="text-2xl font-black text-teal-300 mt-0.5">
            {activeTab === 'optimized' ? optimized.co2Emissions : unoptimized.co2Emissions}
          </p>
          <p className="text-[10px] text-teal-400 font-medium mt-0.5">Eco-Friendly Transit</p>
        </div>
      </div>

      {/* Map Canvas Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Visual Map Representation (SVG Diagram) */}
        <div className="lg:col-span-2 bg-slate-950 rounded-xl p-4 border border-slate-800 relative min-h-[320px] flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Map Nodes Diagram */}
          <div className="relative z-10 w-full h-full flex flex-col justify-around py-4">
            
            {/* SVG Connecting Path */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-emerald-500/40 stroke-2 stroke-dasharray-4">
              <path d="M 60 70 Q 180 40 300 80 T 520 70 T 680 150" fill="none" className="animate-pulse" />
            </svg>

            {/* Nodes Row */}
            <div className="flex items-center justify-between px-4 z-20">
              
              {/* Farmer Nodes */}
              <div 
                onClick={() => setSelectedStop(stops[0])}
                className="cursor-pointer group flex flex-col items-center gap-1"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                  F1
                </div>
                <span className="text-[10px] text-slate-300 font-medium bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                  Farmer A (120kg)
                </span>
              </div>

              <div 
                onClick={() => setSelectedStop(stops[1])}
                className="cursor-pointer group flex flex-col items-center gap-1"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                  F2
                </div>
                <span className="text-[10px] text-slate-300 font-medium bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                  Farmer B (200kg)
                </span>
              </div>

              {/* Central Micro-Hub */}
              <div 
                onClick={() => setSelectedStop(stops[3])}
                className="cursor-pointer group flex flex-col items-center gap-1"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                  HUB
                </div>
                <span className="text-[10px] text-amber-300 font-semibold bg-slate-900/80 px-2 py-0.5 rounded border border-amber-500/30">
                  Kisan Hub
                </span>
              </div>

              {/* Buyer Endpoints */}
              <div 
                onClick={() => setSelectedStop(stops[4])}
                className="cursor-pointer group flex flex-col items-center gap-1"
              >
                <div className="w-10 h-10 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-sky-500/30 group-hover:scale-110 transition-transform">
                  B1
                </div>
                <span className="text-[10px] text-slate-300 font-medium bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                  Supermarket
                </span>
              </div>

            </div>

            {/* AI Vehicle Simulation Icon */}
            <div className="mt-8 flex items-center justify-center gap-3 bg-emerald-950/80 border border-emerald-800 p-3 rounded-xl z-20">
              <Truck className="w-5 h-5 text-emerald-400 animate-bounce" />
              <div className="text-xs">
                <span className="text-emerald-300 font-bold">Optimized Sequence: </span>
                <span className="text-slate-300">Farmer A → Farmer B → Farmer C → Micro-Hub → Buyer</span>
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 z-20">
            <span>Location: Bhopal Metro Zone</span>
            <span className="text-emerald-400 font-medium">✓ AI Route Live Updated</span>
          </div>
        </div>

        {/* Selected Node Details Card */}
        <div className="bg-slate-800/90 rounded-xl p-4 border border-slate-700 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="uppercase font-semibold tracking-wider">Waypoints & Details</span>
              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">
                {selectedStop.status}
              </span>
            </div>

            <h4 className="text-base font-bold text-white mb-1">{selectedStop.name}</h4>
            <p className="text-xs text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {selectedStop.produce}
            </p>
          </div>

          {/* List of stops */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {stops.map(st => (
              <div
                key={st.id}
                onClick={() => setSelectedStop(st)}
                className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors flex items-center justify-between ${
                  selectedStop.id === st.id
                    ? 'bg-emerald-950/80 border-emerald-500 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                    {st.id}
                  </span>
                  <span className="truncate max-w-[140px]">{st.name}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{st.status}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-700 text-center">
            <span className="text-[11px] text-slate-400">
              AI optimized this route to reduce transportation cost by 31% & delivery time by 45 mins.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
