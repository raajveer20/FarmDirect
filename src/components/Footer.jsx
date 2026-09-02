import React from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, PhoneCall, ShieldCheck, Award } from 'lucide-react';

export const Footer = () => {
  const { navigateTo, currentUser, userRole, t } = useApp();

  return (
    <footer className="glass-dark-card text-slate-300 pt-16 pb-8 border-t border-white/10 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20">
                <Sprout className="w-5 h-5 text-slate-950" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Farm<span className="text-emerald-400">Direct</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              {t('footer_tagline')}
            </p>

            <div className="flex items-center gap-2 text-xs bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 max-w-sm">
              <Award className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('footer_sih_project')}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('footer_platform')}</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigateTo('marketplace')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  {t('footer_crop_mkt')}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('how-it-works')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  {t('footer_how_works')}
                </button>
              </li>
              {currentUser && (userRole === 'Farmer' || userRole === 'Logistics' || userRole === 'Admin') && (
                <li>
                  <button onClick={() => navigateTo('ai-demand')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                    {t('footer_ai_demand')}
                  </button>
                </li>
              )}
              <li>
                <button onClick={() => navigateTo('route-opt')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  {t('footer_route_opt')}
                </button>
              </li>
              {currentUser && (userRole?.includes('Logistics') || userRole?.includes('Admin')) && (
                <li>
                  <button onClick={() => navigateTo('order-tracking')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                    {t('nav_track_orders')}
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Solutions for Personas / Portals */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('footer_portals')}</h4>
            <ul className="space-y-2.5 text-sm">
              {(!currentUser || !currentUser.isLoggedIn) ? (
                <>
                  <li>
                    <button onClick={() => navigateTo('farmer-dash')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                      {t('footer_farmer_gate')}
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigateTo('buyer-dash')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                      {t('footer_buyer_gate')}
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigateTo('admin-dash')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                      {t('footer_logistics_gate')}
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <button 
                    onClick={() => {
                      if (userRole === 'Farmer') navigateTo('farmer-dash');
                      else if (userRole === 'Buyer') navigateTo('buyer-dash');
                      else navigateTo('admin-dash');
                    }} 
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-emerald-400 font-bold"
                  >
                    {userRole === 'Farmer' ? t('footer_farmer_gate') : userRole === 'Buyer' ? t('footer_buyer_gate') : t('footer_logistics_gate')} ({t('nav_my_dashboard')})
                  </button>
                </li>
              )}
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
          <p>© 2026 {t('footer_rights')}</p>
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
