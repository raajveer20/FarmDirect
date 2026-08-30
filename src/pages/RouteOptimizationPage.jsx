import React from 'react';
import { useApp } from '../context/AppContext';
import { RouteMap } from '../components/RouteMap';
import { Truck, MapPin, CheckCircle2, ShieldCheck, Zap, ArrowRight, UserCheck } from 'lucide-react';

export const RouteOptimizationPage = () => {
  const { routeOptimizationData, acceptDelivery, navigateTo, showToast } = useApp();

  const handleAcceptDelivery = () => {
    acceptDelivery('KC1024');
    showToast('Delivery Partner Accepted Pickup Route #KC1024!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>AI LOGISTICS & ROUTE OPTIMIZATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Smart Multi-Hop Route Bundling</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Combining smaller farmer produce loads into single optimized truck dispatches, cutting fuel costs by 22% and transport times by 45 mins.
          </p>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-center shrink-0">
          <p className="text-[10px] text-emerald-400 font-mono uppercase font-bold">Fuel Efficiency Gain</p>
          <p className="text-3xl font-black text-white">+31%</p>
          <p className="text-[10px] text-slate-400">19 km saved per route</p>
        </div>
      </div>

      {/* Interactive SVG Route Map Component (Requirement #8) */}
      <RouteMap 
        stops={routeOptimizationData.stops}
        unoptimized={routeOptimizationData.unoptimized}
        optimized={routeOptimizationData.optimized}
        savings={routeOptimizationData.savings}
      />

      {/* Logistics Partner Pickup Dispatch Cards (Requirement #10) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              LOGISTICS PARTNER DISPATCH
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">Available Pickup Requests</h2>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Vehicle Capacity: <span className="font-bold text-slate-800">Tata Ace EV (850 kg / 1000 kg load)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Delivery Card 1 */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 relative">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-500">Pickup #KC1024</span>
              <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">Ready for Dispatch</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-slate-900">Pickup: ABC Farmer (Bhopal)</p>
                  <p className="text-slate-500">100 kg Grade A Tomatoes</p>
                </div>
              </div>

              <div className="text-center text-slate-400 font-bold text-sm">↓</div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-start gap-2">
                <Truck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-slate-900">Delivery: XYZ Restaurant & Caterers</p>
                  <p className="text-slate-500">MP Nagar Zone 1, Bhopal</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="text-xs">
                <span className="text-slate-400">Total Route: </span>
                <span className="font-bold text-slate-800">12.5 km</span>
              </div>

              <button
                onClick={handleAcceptDelivery}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all"
              >
                Accept Delivery Route
              </button>
            </div>
          </div>

          {/* Delivery Card 2 */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 relative">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-500">Pickup #KC1025</span>
              <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">AI Bundled</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-slate-900">Pickup: Maharashtra Farmers Coop (Nashik)</p>
                  <p className="text-slate-500">200 kg Fresh Nashik Onions</p>
                </div>
              </div>

              <div className="text-center text-slate-400 font-bold text-sm">↓</div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-start gap-2">
                <Truck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-slate-900">Delivery: Green Valley Supermarket</p>
                  <p className="text-slate-500">New Market, Bhopal</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="text-xs">
                <span className="text-slate-400">Total Route: </span>
                <span className="font-bold text-slate-800">18.0 km</span>
              </div>

              <button
                onClick={() => {
                  acceptDelivery('KC1025');
                  navigateTo('order-tracking');
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all"
              >
                Accept & Track Delivery
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
