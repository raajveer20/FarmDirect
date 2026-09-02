import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Search, Filter, RotateCcw, Sprout, Sparkles } from 'lucide-react';

export const MarketplacePage = () => {
  const { 
    products, 
    searchQuery, 
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedGrade,
    setSelectedGrade,
    isOrganicOnly,
    setIsOrganicOnly,
    maxPrice,
    setMaxPrice,
    currentUser,
    userRole,
    openAuthModal,
    openMiddlemenModal,
    t
  } = useApp();

  const [selectedState, setSelectedState] = React.useState('All');
  const [sortBy, setSortBy] = React.useState('featured'); // 'featured' | 'price-low' | 'price-high' | 'distance'

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Spices'];
  const grades = ['All', 'Grade A', 'Premium Organic'];
  const states = ['All', 'Madhya Pradesh', 'Maharashtra', 'Andhra Pradesh', 'Tamil Nadu'];

  // Filter products based on user criteria
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.farmerLocation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesGrade = selectedGrade === 'All' || product.qualityGrade === selectedGrade;
    const matchesState = selectedState === 'All' || product.state === selectedState;
    const matchesOrganic = !isOrganicOnly || product.isOrganic;
    const matchesPrice = product.pricePerKg <= maxPrice;

    return matchesSearch && matchesCategory && matchesGrade && matchesState && matchesOrganic && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.pricePerKg - b.pricePerKg;
    if (sortBy === 'price-high') return b.pricePerKg - a.pricePerKg;
    if (sortBy === 'distance') return (a.distanceKm || 0) - (b.distanceKm || 0);
    return 0;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedGrade('All');
    setSelectedState('All');
    setIsOrganicOnly(false);
    setMaxPrice(200);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-dark-card text-white rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
        <div className="space-y-2 text-center md:text-left">
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/30 backdrop-blur-md">
            {t('mkt_header_badge')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{t('mkt_header_title')}</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {t('mkt_header_sub')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            onClick={() => openMiddlemenModal()}
            className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black px-4 py-3 rounded-2xl shadow-lg shadow-amber-500/20 transition-all text-xs flex items-center gap-2 cursor-pointer border border-amber-300 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{t('mkt_calc_btn')}</span>
          </button>

          <div className="bg-white/10 backdrop-blur-xl p-3.5 rounded-2xl border border-white/15 text-center shrink-0 min-w-[100px]">
            <p className="text-[10px] text-emerald-300 uppercase font-bold">{t('mkt_active_listings')}</p>
            <p className="text-2xl font-black">{filteredProducts.length} Crops</p>
            <p className="text-[10px] text-slate-300">{t('mkt_ready_dispatch')}</p>
          </div>
        </div>
      </div>
 
      {/* Guest Marketplace Preview Banner */}
      {(!currentUser || !currentUser.isLoggedIn || userRole !== 'Buyer') && (
        <div className="bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-teal-500/10 border border-blue-400/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-blue-600 text-white font-bold text-sm shrink-0">🛒</span>
            <div>
              <span className="font-extrabold text-slate-900">{t('mkt_preview_badge')}: </span>
              <span className="text-slate-600">{t('mkt_preview_desc')}</span>
            </div>
          </div>
          <button
            onClick={() => openAuthModal('Buyer', 'register')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2 rounded-xl shadow-md shadow-blue-600/20 transition-all shrink-0 cursor-pointer"
          >
            {t('mkt_register_buyer')}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT SIDEBAR FILTERS */}
        <div className="lg:col-span-1 glass-card p-6 rounded-3xl border border-white/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] space-y-6 h-fit sticky top-24">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-emerald-600" />
              {t('mkt_filter_title')}
            </span>
            <button
              onClick={resetFilters}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              {t('mkt_reset')}
            </button>
          </div>

          {/* Search Bar */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">{t('mkt_search_label')}</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Vegetables, fruits, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white/80 hover:bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">{t('mkt_category_label')}</label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white font-bold shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t('cat_' + cat.toLowerCase())}
                </button>
              ))}
            </div>
          </div>

          {/* State / Region Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Location / State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
            >
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Quality Grade Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">{t('mkt_grade_label')}</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
            >
              {grades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-700">{t('mkt_max_price')}: ₹{maxPrice}/kg</label>
            </div>
            <input
              type="range"
              min="10"
              max="250"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          {/* Organic Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-slate-100">
            <input
              type="checkbox"
              checked={isOrganicOnly}
              onChange={(e) => setIsOrganicOnly(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <span className="text-xs font-bold text-slate-800">{t('mkt_organic_label')}</span>
          </label>
        </div>

        {/* MAIN PRODUCT GRID & SORTING */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Sorting Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              Showing <span className="font-bold text-slate-900">{sortedProducts.length}</span> of {products.length} products
            </p>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">{t('mkt_sort_by')}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
              >
                <option value="featured">{t('mkt_sort_featured')}</option>
                <option value="price-low">{t('mkt_sort_price_low')}</option>
                <option value="price-high">{t('mkt_sort_price_high')}</option>
                <option value="distance">{t('mkt_sort_distance')}</option>
              </select>
            </div>
          </div>

          {/* Grid of Product Cards */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white/90 rounded-3xl p-12 text-center border border-slate-200/80 space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <Sprout className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900">No Produce Listed in Marketplace Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                FarmDirect is a live verified marketplace. Only real crops listed directly by authenticated Farmers or FPOs appear here in real-time.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => openAuthModal('Farmer', 'login')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  🌾 Login as Farmer to List Produce →
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
              <Sprout className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No produce matching filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try resetting your search keywords, price range, or category filter to view available produce.
              </p>
              <button
                onClick={resetFilters}
                className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Clear All Filters
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
