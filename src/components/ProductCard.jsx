import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, ShoppingCart, Award, Zap, Sparkles } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { navigateTo, addToCart, cart, openMiddlemenModal, t } = useApp();

  const isOrganic = product.isOrganic || product.qualityGrade?.includes('Organic');
  const savingsPerKg = (product.traditionalPrice || (product.pricePerKg * 1.6)) - product.pricePerKg;

  const isInCart = cart.some(item => item.product.id === product.id);

  return (
    <div className="group glass-card rounded-3xl border border-white/80 hover:border-emerald-500/40 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_36px_-8px_rgba(16,185,129,0.14)] transition-all duration-300 flex flex-col overflow-hidden">
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
          <span className="bg-slate-950/75 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10 shadow-xs">
            <Award className="w-3 h-3 text-amber-400" />
            {t(product.qualityGrade || 'Grade A')}
          </span>
          {isOrganic && (
            <span className="bg-emerald-600/85 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20 shadow-xs">
              <Zap className="w-3 h-3 text-emerald-200" />
              {t('mkt_organic_badge')}
            </span>
          )}
        </div>

        {/* Distance Badge */}
        <div className="absolute bottom-3 right-3 glass-pill text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs border border-white/80">
          <MapPin className="w-3 h-3 text-emerald-600" />
          {product.distanceKm ? `${product.distanceKm} ${t('card_km_away')}` : t('card_direct_delivery')}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* FPO / Farmer Info */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="truncate max-w-[180px] font-medium">{t(product.farmer)}</span>
            <span className="text-amber-600 font-semibold flex items-center gap-0.5">
              ★ {product.farmerRating || '4.9'}
            </span>
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => navigateTo('product-detail', product)}
            className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors cursor-pointer line-clamp-1"
          >
            {t(product.name)}
          </h3>

          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-slate-400" />
            {t(product.farmerLocation)}
          </p>
        </div>

        {/* Stock & Price Highlights */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">{t('card_min_order')}:</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 text-[11px]">
              {Math.max(10, product.moq || 10)} {product.unit || 'kg'}
            </span>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-emerald-700">₹{product.pricePerKg}</span>
                <span className="text-xs font-semibold text-slate-500">{t('per_kg')}</span>
              </div>
              <p className="text-[10px] text-slate-400 line-through">
                {t('card_traditional_mandi')}: ₹{product.traditionalPrice || Math.round(product.pricePerKg * 1.6)}{t('per_kg')}
              </p>
            </div>

            <div className="text-right">
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block">
                {t('card_save')} ₹{Math.round(savingsPerKg)}{t('per_kg')}
              </span>
            </div>
          </div>

          {/* Direct Middlemen Elimination Trigger Badge */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openMiddlemenModal(product);
            }}
            className="w-full py-1 px-2.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-xl text-[10px] font-bold text-emerald-800 flex items-center justify-between transition-all cursor-pointer group/split shadow-2xs"
            title="View direct farmer earnings vs intermediary deductions"
          >
            <span className="flex items-center gap-1 truncate">
              <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>{t('card_zero_middlemen')}</span>
            </span>
            <span className="text-emerald-700 font-extrabold underline group-hover/split:text-emerald-900 shrink-0 ml-1">
              {t('card_audit_split')}
            </span>
          </button>
        </div>

        {/* Actions */}
        <div className="pt-1 flex items-center gap-2">
          <button
            onClick={() => navigateTo('product-detail', product)}
            className="flex-1 bg-slate-100/90 hover:bg-slate-200/90 text-slate-800 text-xs font-bold py-2 px-3 rounded-xl transition-all text-center border border-slate-200/60 shadow-2xs cursor-pointer"
          >
            {t('card_view_details')}
          </button>

          <button
            onClick={() => addToCart(product, Math.max(10, product.moq || 10))}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
              isInCart
                ? 'bg-emerald-800 text-white shadow-emerald-800/20'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25 hover:scale-[1.02]'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{isInCart ? t('card_in_cart') : `${t('card_add_cart')} (${Math.max(10, product.moq || 10)}kg)`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
