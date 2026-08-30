import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal, MapPin, Award, CheckCircle2, RotateCcw, Sprout } from 'lucide-react';

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
    navigateTo
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
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/30">
            DIRECT AGRICULTURAL MARKETPLACE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">Browse Fresh Produce Directly from Farmers</h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
            Verified FPOs and smallholders. Guaranteed zero middleman commissions with full price transparency.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0">
          <p className="text-[10px] text-emerald-200 uppercase font-bold">Active Listings</p>
          <p className="text-3xl font-black">{filteredProducts.length} Crops</p>
          <p className="text-[10px] text-slate-300">Ready for Express Dispatch</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT SIDEBAR FILTERS */}
        <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6 h-fit sticky top-24">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-emerald-600" />
              Filter Produce
            </span>
            <button
              onClick={resetFilters}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Search Bar */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Search Keywords</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Vegetables, fruits, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Category</label>
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
                  {cat}
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
            <label className="text-xs font-bold text-slate-700">Quality Grade</label>
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
              <label className="font-bold text-slate-700">Max Price: ₹{maxPrice}/kg</label>
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
            <span className="text-xs font-bold text-slate-800">Show Certified Organic Only</span>
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
              <span className="text-slate-500 font-medium">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
              >
                <option value="featured">Featured / Relevant</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="distance">Distance: Nearest First</option>
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
