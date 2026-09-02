import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sprout, 
  Search, 
  ShoppingCart, 
  User, 
  Cpu, 
  Truck, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  CheckCircle2, 
  ShoppingBag, 
  ExternalLink,
  MapPin,
  Languages
} from 'lucide-react';

export const Navbar = () => {
  const { 
    userRole, 
    currentUser,
    activeView, 
    navigateTo, 
    cart, 
    openAuthModal,
    logoutUser,
    searchQuery,
    setSearchQuery,
    language,
    toggleLanguage,
    t
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const profileRef = useRef(null);

  const totalCartItems = cart.reduce((acc, item) => acc + item.qty, 0);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="glass-nav sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => {
            if (currentUser && currentUser.isLoggedIn) {
              if (userRole === 'Farmer') navigateTo('farmer-dash');
              else if (userRole === 'Buyer') navigateTo('buyer-dash');
              else navigateTo('admin-dash');
            } else {
              navigateTo('home');
            }
          }}
          className="flex items-center gap-2 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">Farm</span>
              <span className="font-extrabold text-xl tracking-tight text-emerald-600">Direct</span>
            </div>
            <p className="text-[10px] text-slate-500 -mt-1 font-medium hidden sm:block">{t('brand_sub')}</p>
          </div>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-xs relative">
          <input
            type="text"
            placeholder={t('nav_search_placeholder')}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeView !== 'marketplace') navigateTo('marketplace');
            }}
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Navigation Links - Desktop (Sleek Glass Segmented Bar) */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100/70 p-1 rounded-full border border-slate-200/70 backdrop-blur-md">
          {(!currentUser || !currentUser.isLoggedIn) && (
            <button 
              onClick={() => navigateTo('home')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${activeView === 'home' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'hover:text-slate-900 hover:bg-white/60'}`}
            >
              {t('nav_home')}
            </button>
          )}
          <button 
            onClick={() => navigateTo('marketplace')}
            className={`px-3.5 py-1.5 rounded-full transition-all ${activeView === 'marketplace' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'hover:text-slate-900 hover:bg-white/60'}`}
          >
            {t('nav_marketplace')}
          </button>
          <button 
            onClick={() => navigateTo('how-it-works')}
            className={`px-3.5 py-1.5 rounded-full transition-all ${activeView === 'how-it-works' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'hover:text-slate-900 hover:bg-white/60'}`}
          >
            {t('nav_how_it_works')}
          </button>
          {currentUser && (userRole === 'Farmer' || userRole?.includes('Logistics') || userRole?.includes('Admin')) && (
            <button 
              onClick={() => navigateTo('ai-demand')}
              className={`px-3.5 py-1.5 rounded-full flex items-center gap-1 transition-all ${activeView === 'ai-demand' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'hover:text-slate-900 hover:bg-white/60'}`}
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t('nav_ai_insights')}</span>
            </button>
          )}
          {currentUser && (userRole?.includes('Logistics') || userRole?.includes('Admin')) && (
            <button 
              onClick={() => navigateTo('route-opt')}
              className={`px-3.5 py-1.5 rounded-full flex items-center gap-1 transition-all ${activeView === 'route-opt' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'hover:text-slate-900 hover:bg-white/60'}`}
            >
              <Truck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t('nav_logistics_ai')}</span>
            </button>
          )}
          {currentUser && (userRole?.includes('Logistics') || userRole?.includes('Admin')) && (
            <button 
              onClick={() => navigateTo('admin-dash')}
              className={`px-3.5 py-1.5 rounded-full flex items-center gap-1 transition-all ${activeView === 'admin-dash' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'hover:text-slate-900 hover:bg-white/60'}`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t('nav_logistics_admin')}</span>
            </button>
          )}
          {currentUser && (userRole?.includes('Logistics') || userRole?.includes('Admin')) && (
            <button 
              onClick={() => navigateTo('order-tracking')}
              className={`px-3.5 py-1.5 rounded-full flex items-center gap-1 transition-all ${activeView === 'order-tracking' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'hover:text-slate-900 hover:bg-white/60'}`}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t('nav_track_orders')}</span>
            </button>
          )}
        </nav>

        {/* Right Action Icons & User Profile Dropdown */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Switcher Pill Button (EN / हिन्दी) */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-200 hover:border-emerald-500 bg-white hover:bg-slate-50 shadow-2xs text-xs font-bold text-slate-700 transition-all cursor-pointer active:scale-95 shrink-0"
            title={language === 'en' ? 'हिन्दी में बदलें (Switch to Hindi)' : 'Switch to English'}
          >
            <Languages className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-[11px] font-black text-emerald-800 tracking-wide">
              {language === 'en' ? 'हिन्दी' : 'EN'}
            </span>
          </button>

          {/* Shopping Cart Button - only available to the buyer */}
          {userRole === 'Buyer' && (
            <button
              onClick={() => navigateTo('buyer-dash')}
              className="relative p-2 text-slate-700 hover:text-emerald-600 rounded-full hover:bg-slate-100 transition-colors"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse shadow-md">
                  {totalCartItems}
                </span>
              )}
            </button>
          )}

          {/* User Account / Profile Menu */}
          {currentUser && currentUser.isLoggedIn ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border border-slate-200 hover:border-emerald-500 bg-white hover:bg-slate-50 shadow-sm transition-all text-xs"
              >
                {/* Avatar with Role Color */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                  userRole === 'Farmer' ? 'bg-emerald-600' :
                  userRole === 'Buyer' ? 'bg-blue-600' :
                  'bg-amber-600'
                }`}>
                  {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                </div>

                <div className="text-left hidden sm:block">
                  <div className="font-extrabold text-slate-900 leading-tight flex items-center gap-1">
                    <span>{currentUser.name ? currentUser.name.split(' ')[0] : 'User'}</span>
                    {currentUser.verificationStatus === 'VERIFIED_FARMER' && (
                      <span className="text-[10px] text-emerald-600" title="Verified Farmer">⭐</span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">{userRole}</div>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* User Info Header */}
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-md ${
                        userRole === 'Farmer' ? 'bg-emerald-600 shadow-emerald-600/30' :
                        userRole === 'Buyer' ? 'bg-blue-600 shadow-blue-600/30' :
                        'bg-amber-600 shadow-amber-600/30'
                      }`}>
                        {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-extrabold text-xs text-slate-900 truncate">{currentUser.name}</h4>
                        <p className="text-[10px] text-slate-500 truncate">{currentUser.email || currentUser.phone}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {userRole}
                          </span>
                          {currentUser.verificationStatus === 'VERIFIED_FARMER' ? (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                            </span>
                          ) : userRole === 'Farmer' ? (
                            <button
                              onClick={() => {
                                openAuthModal('Farmer', 'register');
                                setIsProfileDropdownOpen(false);
                              }}
                              className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 hover:underline"
                            >
                              Get Verified
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Shortcuts */}
                  <div className="px-2 py-2 space-y-0.5 text-xs font-semibold text-slate-700">
                    <button
                      onClick={() => {
                        if (userRole === 'Farmer') navigateTo('farmer-dash');
                        else if (userRole === 'Buyer') navigateTo('buyer-dash');
                        else navigateTo('admin-dash');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Sprout className="w-4 h-4 text-emerald-600" />
                        <span>{t('nav_my_dashboard')}</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        navigateTo('marketplace');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-blue-600" />
                      <span>Browse Marketplace</span>
                    </button>
                  </div>

                  {/* Logout Button (Sole Action) */}
                  <div className="px-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        logoutUser();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('nav_logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out State: Login and Register Options */
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('Farmer', 'login')}
                className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 hover:text-emerald-700 border border-slate-300 font-bold text-xs px-3 py-1.5 rounded-xl transition-all shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Login</span>
              </button>
              <button
                onClick={() => openAuthModal('Farmer', 'register')}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-3.5 py-1.5 rounded-xl shadow-md shadow-emerald-600/30 transition-all hover:scale-105"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            </div>
          )}

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

          <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
            {(!currentUser || !currentUser.isLoggedIn) && (
              <button 
                onClick={() => { navigateTo('home'); setIsMobileMenuOpen(false); }}
                className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700"
              >
                {t('nav_home')}
              </button>
            )}
            <button 
              onClick={() => { navigateTo('marketplace'); setIsMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-emerald-600"
            >
              {t('nav_marketplace')}
            </button>
            <button 
              onClick={() => { navigateTo('how-it-works'); setIsMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700"
            >
              {t('nav_how_it_works')}
            </button>
            {currentUser && (userRole === 'Farmer' || userRole?.includes('Logistics') || userRole?.includes('Admin')) && (
              <button 
                onClick={() => { navigateTo('ai-demand'); setIsMobileMenuOpen(false); }}
                className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-1.5"
              >
                <Cpu className="w-4 h-4 text-emerald-500" />
                <span>{t('nav_ai_insights')}</span>
              </button>
            )}
            {currentUser && (userRole?.includes('Logistics') || userRole?.includes('Admin')) && (
              <button 
                onClick={() => { navigateTo('route-opt'); setIsMobileMenuOpen(false); }}
                className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-1.5"
              >
                <Truck className="w-4 h-4 text-emerald-500" />
                <span>{t('nav_logistics_ai')}</span>
              </button>
            )}
            {currentUser && (userRole?.includes('Logistics') || userRole?.includes('Admin')) && (
              <button 
                onClick={() => { navigateTo('admin-dash'); setIsMobileMenuOpen(false); }}
                className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>{t('nav_logistics_admin')}</span>
              </button>
            )}
            {currentUser && (userRole?.includes('Logistics') || userRole?.includes('Admin')) && (
              <button 
                onClick={() => { navigateTo('order-tracking'); setIsMobileMenuOpen(false); }}
                className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-1.5"
              >
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>{t('nav_track_orders')}</span>
              </button>
            )}
          </div>

          {/* Mobile Auth & Gateway Controls */}
          {currentUser && currentUser.isLoggedIn ? (
            <div className="pt-2 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center gap-2 px-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                  userRole === 'Farmer' ? 'bg-emerald-600' :
                  userRole === 'Buyer' ? 'bg-blue-600' :
                  'bg-amber-600'
                }`}>
                  {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <span className="text-[10px] font-bold text-slate-500">{userRole}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  logoutUser();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('nav_logout')}</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex gap-2">
                <button 
                  onClick={() => openAuthModal('Farmer', 'login')}
                  className="text-xs font-bold text-slate-700 hover:text-emerald-700 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {t('nav_login')}
                </button>
                <button 
                  onClick={() => openAuthModal('Farmer', 'register')}
                  className="text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-1.5 rounded-full shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
                >
                  {t('nav_register')}
                </button>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase pt-1">Portal Access</div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => { openAuthModal('Farmer', 'otp'); setIsMobileMenuOpen(false); }}
                  className="p-2 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 text-center cursor-pointer"
                >
                  🌾 Farmer
                </button>
                <button
                  onClick={() => { openAuthModal('Buyer', 'otp'); setIsMobileMenuOpen(false); }}
                  className="p-2 bg-blue-50 text-blue-800 rounded-xl text-xs font-bold border border-blue-200 text-center cursor-pointer"
                >
                  🛒 Buyer
                </button>
                <button
                  onClick={() => { openAuthModal('Logistics', 'otp'); setIsMobileMenuOpen(false); }}
                  className="p-2 bg-amber-50 text-amber-800 rounded-xl text-xs font-bold border border-amber-200 text-center cursor-pointer"
                >
                  🚚 Logistics / Admin
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
