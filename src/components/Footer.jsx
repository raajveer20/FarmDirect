import React from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, PhoneCall, ShieldCheck, Heart, ArrowUpRight, Award } from 'lucide-react';

export const Footer = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Farm<span className="text-emerald-400">Direct</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering Indian agricultural producers with direct consumer connection, transparent mandi prices, and AI-driven supply chain route optimization.
            </p>

            <div className="flex items-center gap-2 text-xs bg-slate-800/80 p-3 rounded-xl border border-slate-700 max-w-sm">
              <Award className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Smart India Hackathon (SIH) Innovation Project</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigateTo('marketplace')} className="hover:text-emerald-400 transition-colors">
                  Crop Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('how-it-works')} className="hover:text-emerald-400 transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('ai-demand')} className="hover:text-emerald-400 transition-colors">
                  AI Demand Forecast
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('route-opt')} className="hover:text-emerald-400 transition-colors">
                  Route Optimization
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('order-tracking')} className="hover:text-emerald-400 transition-colors">
                  Live Order Tracking
                </button>
              </li>
            </ul>
          </div>

          {/* Solutions for Personas */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Stakeholders</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigateTo('farmer-dash')} className="hover:text-emerald-400 transition-colors">
                  For Farmers & FPOs
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('buyer-dash')} className="hover:text-emerald-400 transition-colors">
                  For Bulk Buyers & Retailers
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('logistics-dash')} className="hover:text-emerald-400 transition-colors">
                  Logistics Partners
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('admin-dash')} className="hover:text-emerald-400 transition-colors">
                  Platform Admin
                </button>
              </li>
            </ul>
          </div>

          {/* Helpline & Support */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Farmer Support</h4>
            <div className="space-y-3 text-sm">
              <div className="bg-emerald-950/60 border border-emerald-800/60 p-3 rounded-xl">
                <p className="text-xs text-emerald-300 font-medium">Toll-Free Farmer Helpline</p>
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-base mt-1">
                  <PhoneCall className="w-4 h-4" />
                  <span>1800-123-FARM</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">24/7 Assistance in Hindi, English, Marathi, Punjabi</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Middleman Commission Policy</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 FarmDirect. Smart Agricultural Supply Chain Initiative.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Mandi Price Index</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
