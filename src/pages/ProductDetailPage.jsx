import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PriceBreakdown } from '../components/PriceBreakdown';
import { 
  MapPin, 
  Calendar, 
  Truck, 
  ShoppingCart, 
  ArrowLeft, 
  Sparkles,
  UserCheck
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { selectedProduct, navigateTo, addToCart, placeOrder } = useApp();

  const product = selectedProduct || {
    id: "prod-1",
    name: "Grade A Red Tomatoes",
    category: "Vegetables",
    farmer: "ABC Farmers Producer Organization",
    farmerContact: "+91 98765 43210",
    farmerRating: 4.9,
    farmerLocation: "Bhopal, Madhya Pradesh",
    qualityGrade: "Grade A",
    isOrganic: true,
    availableQty: 500,
    unit: "kg",
    moq: 10,
    pricePerKg: 25,
    traditionalPrice: 45,
    consumerPrice: 30,
    harvestDate: "2026-08-29",
    distanceKm: 12.5,
    estimatedDelivery: "Same Day (4 Hours)",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
    description: "Farm-fresh, naturally ripened vine tomatoes grown using organic bio-fertilizers. Ideal for domestic consumption, restaurants, and retail processing."
  };

  const minAllowed = Math.max(10, product.moq || 10);
  const [quantity, setQuantity] = useState(minAllowed);

  const totalPrice = product.pricePerKg * quantity;
  const traditionalTotal = (product.traditionalPrice || 45) * quantity;
  const totalSavings = traditionalTotal - totalPrice;

  const handleBuyNow = () => {
    const validQty = Math.max(minAllowed, quantity);
    const added = addToCart(product, validQty);
    if (added) {
      placeOrder("Green Valley Supermarket, Bhopal");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Button */}
      <button
        onClick={() => navigateTo('marketplace')}
        className="glass-pill inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 px-3.5 py-2 rounded-xl transition-all shadow-2xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Marketplace</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Image & Farmer Profile */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="glass-card p-3 rounded-3xl border border-white/80 shadow-md relative overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-2xl"
            />

            <div className="absolute top-6 left-6 flex gap-2">
              <span className="bg-slate-900/80 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md border border-white/10 shadow-xs">
                {product.qualityGrade}
              </span>
              {product.isOrganic && (
                <span className="bg-emerald-600/85 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md border border-white/20 shadow-xs">
                  Certified Organic
                </span>
              )}
            </div>
          </div>

          {/* Verified Farmer Profile Card */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-white/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center font-bold text-lg border border-emerald-200/50">
                  <UserCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 tracking-tight">{product.farmer}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {product.farmerLocation}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200">
                  ★ {product.farmerRating || '4.9'} Verified FPO
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Contact: {product.farmerContact || '+91 98765 43210'}</span>
              <span className="text-emerald-600 font-bold">100% Direct Payout</span>
            </div>
          </div>

        </div>

        {/* Right Details & Quantity Purchase Selector */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] space-y-6">
            
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wide">
                <span>{product.category}</span> • <span>Direct FPO Listing</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{product.name}</h1>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{product.description}</p>
            </div>

            {/* Product Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-400 font-medium">Harvest Date:</span>
                <p className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  {product.harvestDate}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Available Qty:</span>
                <p className="font-bold text-slate-800 mt-0.5">{product.availableQty} {product.unit || 'kg'}</p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Delivery Speed:</span>
                <p className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  {product.estimatedDelivery}
                </p>
              </div>
            </div>

            {/* Price Per Kg */}
            <div className="flex items-end justify-between border-t border-b border-slate-100 py-4">
              <div>
                <span className="text-xs font-semibold text-slate-500">Direct FarmDirect Rate</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-700">₹{product.pricePerKg}</span>
                  <span className="text-xs font-bold text-slate-500">/ {product.unit || 'kg'}</span>
                </div>
                <p className="text-xs text-slate-400 line-through">Traditional Retail: ₹{product.traditionalPrice || 45}/kg</p>
              </div>

              <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-200 text-right">
                <span className="text-[10px] uppercase font-bold block">You Save</span>
                <span className="text-base font-extrabold">₹{(product.traditionalPrice || 45) - product.pricePerKg} / kg</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Select Order Quantity (Min Order: {minAllowed} {product.unit || 'kg'}):</span>
                <span className="text-emerald-700 font-extrabold">Total: ₹{totalPrice}</span>
              </label>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity(prev => Math.max(minAllowed, prev - 5))}
                    className="px-3.5 py-2 text-slate-700 hover:bg-slate-200 font-bold transition-colors cursor-pointer"
                    title="Decrease by 5 kg"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={minAllowed}
                    step="5"
                    value={quantity}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setQuantity(val > 0 ? val : minAllowed);
                    }}
                    onBlur={() => {
                      if (quantity < minAllowed) {
                        setQuantity(minAllowed);
                      }
                    }}
                    className="w-16 text-center text-sm font-bold bg-transparent focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(prev => prev + 5)}
                    className="px-3.5 py-2 text-slate-700 hover:bg-slate-200 font-bold transition-colors cursor-pointer"
                    title="Increase by 5 kg"
                  >
                    +
                  </button>
                </div>

                <div className="text-xs text-slate-500">
                  Min order: <span className="font-bold text-emerald-700">{minAllowed} kg</span> • <span className="text-slate-500 font-semibold">+5 kg per step</span> • Saved: <span className="font-bold text-emerald-600">₹{totalSavings}</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => addToCart(product, Math.max(minAllowed, quantity))}
                className="w-full sm:w-1/2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart ({Math.max(minAllowed, quantity)} kg)</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full sm:w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Buy Now (Express Checkout)</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* PRICE TRANSPARENCY DETAILED BREAKDOWN */}
      <PriceBreakdown 
        farmerPrice={product.pricePerKg}
        traditionalRetailPrice={product.traditionalPrice || 45}
        consumerPrice={product.consumerPrice || 30}
        cropName={product.name}
        quantity={quantity}
      />

    </div>
  );
};
