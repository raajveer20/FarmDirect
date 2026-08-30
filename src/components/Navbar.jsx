import React from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, Search, ShoppingCart, User, Cpu, MapPin, Truck, ShieldCheck, Sparkles, Menu, X, ArrowRight } from 'lucide-react';

export const Navbar = () => {
  const { 
    userRole, 
    switchRole, 
    activeView, 
    navigateTo, 
    cart, 
    setIsAuthModalOpen,
    triggerDemoScenario,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const totalCartItems = cart.reduce((acc, item) => acc + item.qty, 0);

  const roles = [
    { id: 'Guest', label: 'Visitor' },
    { id: 'Farmer', label: 'Farmer / FPO' },
    { id: 'Buyer', label: 'Buyer' },
    { id: 'Logistics', label: 'Logistics' },
    { id: 'Admin', label: 'Admin' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* SIH Demo Banner / Quick Role Switcher */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/30 text-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-400/30">
              SIH 2024 / 2025 PROTOTYPE
            </span>
            <span className="hidden sm:inline text-slate-200">Quick Switch Persona:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {roles.map(r => (
              <button
                key={r.id}
                onClick={() => switchRole(r.id)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  userRole === r.id 
                    ? 'bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-300' 
                    : 'bg-white/10 hover:bg-white/20 text-slate-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <button
            onClick={triggerDemoScenario}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-full text-xs transition-transform transform active:scale-95 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Interactive Demo Flow</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => navigateTo('home')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">Farm</span>
              <span className="font-extrabold text-xl tracking-tight text-emerald-600">Direct</span>
            </div>
            <p className="text-[10px] text-slate-500 -mt-1 font-medium">Direct Farm Marketplace & AI Supply Chain</p>
          </div>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-xs relative">
          <input
            type="text"
            placeholder="Search tomatoes, onions, wheat..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeView !== 'marketplace') navigateTo('marketplace');
            }}
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Navigation Links - Desktop */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button 
            onClick={() => navigateTo('home')}
            className={`hover:text-emerald-600 transition-colors ${activeView === 'home' ? 'text-emerald-600 font-semibold' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => navigateTo('marketplace')}
            className={`hover:text-emerald-600 transition-colors ${activeView === 'marketplace' ? 'text-emerald-600 font-semibold' : ''}`}
          >
            Marketplace
          </button>
          <button 
            onClick={() => navigateTo('how-it-works')}
            className={`hover:text-emerald-600 transition-colors ${activeView === 'how-it-works' ? 'text-emerald-600 font-semibold' : ''}`}
          >
            How It Works
          </button>
          <button 
            onClick={() => navigateTo('ai-demand')}
            className={`hover:text-emerald-600 transition-colors flex items-center gap-1 ${activeView === 'ai-demand' ? 'text-emerald-600 font-semibold' : ''}`}
          >
            <Cpu className="w-4 h-4 text-emerald-500" />
            <span>AI Insights</span>
          </button>
          <button 
            onClick={() => navigateTo('route-opt')}
            className={`hover:text-emerald-600 transition-colors flex items-center gap-1 ${activeView === 'route-opt' ? 'text-emerald-600 font-semibold' : ''}`}
          >
            <Truck className="w-4 h-4 text-emerald-500" />
            <span>Logistics AI</span>
          </button>
          
          {/* Dynamic Dashboard Link based on Role */}
          {userRole === 'Farmer' && (
            <button 
              onClick={() => navigateTo('farmer-dash')}
              className="text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 hover:bg-emerald-100"
            >
              Farmer Dashboard
            </button>
          )}
          {userRole === 'Buyer' && (
            <button 
              onClick={() => navigateTo('buyer-dash')}
              className="text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 hover:bg-emerald-100"
            >
              Buyer Dashboard
            </button>
          )}
          {userRole === 'Logistics' && (
            <button 
              onClick={() => navigateTo('logistics-dash')}
              className="text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 hover:bg-emerald-100"
            >
              Logistics Dashboard
            </button>
          )}
          {userRole === 'Admin' && (
            <button 
              onClick={() => navigateTo('admin-dash')}
              className="text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 hover:bg-emerald-100"
            >
              Admin Panel
            </button>
          )}
        </nav>

        {/* Right Action Icons & Buttons */}
        <div className="flex items-center gap-3">
          {/* Shopping Cart Button */}
          <button
            onClick={() => navigateTo('buyer-dash')}
            className="relative p-2 text-slate-700 hover:text-emerald-600 rounded-full hover:bg-slate-100 transition-colors"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {totalCartItems}
              </span>
            )}
          </button>

          {/* Quick CTA Buttons */}
          <button
            onClick={() => navigateTo('marketplace')}
            className="hidden sm:inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors"
          >
            <span>Marketplace</span>
          </button>

          <button
            onClick={() => {
              if (userRole !== 'Farmer') switchRole('Farmer');
              navigateTo('farmer-dash');
            }}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm shadow-emerald-600/30 transition-colors"
          >
            <span>List Produce</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3">
          <input
            type="text"
            placeholder="Search produce..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              navigateTo('marketplace');
            }}
            className="w-full px-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
          />

          <div className="grid grid-cols-2 gap-2 text-sm">
            <button 
              onClick={() => { navigateTo('home'); setIsMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700"
            >
              Home
            </button>
            <button 
              onClick={() => { navigateTo('marketplace'); setIsMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-semibold text-emerald-600"
            >
              Marketplace
            </button>
            <button 
              onClick={() => { navigateTo('how-it-works'); setIsMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700"
            >
              How It Works
            </button>
            <button 
              onClick={() => { navigateTo('ai-demand'); setIsMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700"
            >
              AI Forecast
            </button>
            <button 
              onClick={() => { navigateTo('route-opt'); setIsMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700"
            >
              Logistics AI
            </button>
            <button 
              onClick={() => { navigateTo('order-tracking'); setIsMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700"
            >
              Track Order
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => { switchRole('Farmer'); setIsMobileMenuOpen(false); }}
              className="w-full text-center py-2 bg-emerald-600 text-white rounded-lg font-semibold text-sm"
            >
              Open Farmer Dashboard
            </button>
            <button
              onClick={() => { switchRole('Buyer'); setIsMobileMenuOpen(false); }}
              className="w-full text-center py-2 bg-slate-900 text-white rounded-lg font-semibold text-sm"
            >
              Open Buyer Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
