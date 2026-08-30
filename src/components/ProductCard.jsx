import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, ShoppingCart, CheckCircle2, ShieldCheck, ArrowUpRight, Award, Zap } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { navigateTo, addToCart, cart } = useApp();

  const isOrganic = product.isOrganic || product.qualityGrade?.includes('Organic');
  const savingsPerKg = (product.traditionalPrice || (product.pricePerKg * 1.6)) - product.pricePerKg;

  const isInCart = cart.some(item => item.product.id === product.id);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/50 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image Container */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quality Grade & Organic Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Award className="w-3 h-3 text-amber-400" />
            {product.qualityGrade || 'Grade A'}
          </span>
          {isOrganic && (
            <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Zap className="w-3 h-3 text-emerald-200" />
              Organic
            </span>
          )}
        </div>

        {/* Distance Badge */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-slate-200">
          <MapPin className="w-3 h-3 text-emerald-600" />
          {product.distanceKm ? `${product.distanceKm} km away` : 'Direct Delivery'}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* FPO / Farmer Info */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="truncate max-w-[180px] font-medium">{product.farmer}</span>
            <span className="text-amber-600 font-semibold flex items-center gap-0.5">
              ★ {product.farmerRating || '4.9'}
            </span>
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => navigateTo('product-detail', product)}
            className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-slate-400" />
            {product.farmerLocation}
          </p>
        </div>

        {/* Stock & Price Highlights */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Available Qty:</span>
            <span className="font-semibold text-slate-800">{product.availableQty} {product.unit || 'kg'}</span>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-emerald-700">₹{product.pricePerKg}</span>
                <span className="text-xs font-semibold text-slate-500">/ {product.unit || 'kg'}</span>
              </div>
              <p className="text-[10px] text-slate-400 line-through">
                Traditional Mandi: ₹{product.traditionalPrice || Math.round(product.pricePerKg * 1.6)}/kg
              </p>
            </div>

            <div className="text-right">
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block">
                Save ₹{Math.round(savingsPerKg)}/kg
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-1 flex items-center gap-2">
          <button
            onClick={() => navigateTo('product-detail', product)}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2 px-3 rounded-xl transition-colors text-center"
          >
            View Details
          </button>

          <button
            onClick={() => addToCart(product, product.moq || 10)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              isInCart
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{isInCart ? 'Added' : '+ Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
