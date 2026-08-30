import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, DollarSign, Truck, ShoppingCart, Trash2, ArrowRight, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

export const BuyerDashboard = () => {
  const { cart, removeFromCart, updateCartQty, clearCart, placeOrder, orders, navigateTo } = useApp();
  const [deliveryAddress, setDeliveryAddress] = useState('102 Royal Palm Enclave, Bhopal MP');

  const totalCartPrice = cart.reduce((acc, item) => acc + (item.product.pricePerKg * item.qty), 0);
  const totalTraditionalPrice = cart.reduce((acc, item) => acc + ((item.product.traditionalPrice || 45) * item.qty), 0);
  const totalSaved = Math.max(0, totalTraditionalPrice - totalCartPrice);

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    placeOrder(deliveryAddress);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
            BUYER PORTAL & CART
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">Consumer & Bulk Buyer Dashboard</h1>
          <p className="text-xs text-slate-300">
            Direct farmer purchasing with zero retail markup.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 text-center">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Saved</p>
            <p className="text-xl font-black text-emerald-400">₹4,850</p>
          </div>
          <button
            onClick={() => navigateTo('marketplace')}
            className="bg-emerald-500 text-slate-950 font-extrabold text-xs px-4 py-3 rounded-xl"
          >
            + Browse Produce
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Shopping Cart Items List */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-emerald-600" />
              <span>Shopping Cart ({cart.length} items)</span>
            </h2>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-rose-600 hover:underline font-semibold"
              >
                Clear Cart
              </button>
            )}
          </div>

          {cart.length > 0 ? (
            <div className="space-y-4">
              {cart.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.product.name}</h4>
                      <p className="text-xs text-slate-500">{item.product.farmer}</p>
                      <p className="text-xs font-bold text-emerald-700 mt-0.5">₹{item.product.pricePerKg} / kg</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 text-xs font-bold">
                      <button
                        onClick={() => updateCartQty(item.product.id, item.qty - 10)}
                        className="px-2.5 py-1 text-slate-600"
                      >
                        -
                      </button>
                      <span className="px-3 py-1">{item.qty} kg</span>
                      <button
                        onClick={() => updateCartQty(item.product.id, item.qty + 10)}
                        className="px-2.5 py-1 text-slate-600"
                      >
                        +
                      </button>
                    </div>

                    <p className="font-extrabold text-slate-900 text-sm">₹{item.product.pricePerKg * item.qty}</p>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700 text-sm">Your cart is currently empty</p>
              <button
                onClick={() => navigateTo('marketplace')}
                className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Go to Marketplace
              </button>
            </div>
          )}
        </div>

        {/* Order Summary & Delivery Address Checkout Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 h-fit">
          <h3 className="text-base font-bold text-slate-900">Order Summary & Delivery</h3>

          <form onSubmit={handleCheckout} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Delivery Address *</label>
              <textarea
                required
                rows="2"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cart.reduce((a, c) => a + c.qty, 0)} kg):</span>
                <span className="font-bold">₹{totalCartPrice}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>FarmDirect Direct Shipping:</span>
                <span className="font-bold text-emerald-600">FREE (AI Pooled)</span>
              </div>

              <div className="flex justify-between text-emerald-700 font-bold border-t border-slate-200 pt-2">
                <span>You Save vs Traditional Mandi:</span>
                <span>₹{totalSaved}</span>
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount Payable:</span>
                <span className="text-emerald-700">₹{totalCartPrice}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={cart.length === 0}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-xs"
            >
              Place Order & Track Live Delivery
            </button>
          </form>

          {/* Active Orders List */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Recent Orders History</h4>
            {orders.map((ord, idx) => (
              <div 
                key={idx} 
                onClick={() => navigateTo('order-tracking')}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/60 cursor-pointer transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-emerald-700">#{ord.id}</span>
                  <p className="font-bold text-slate-800">{ord.productName} ({ord.quantity} kg)</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">₹{ord.totalPrice}</p>
                  <span className="text-[10px] font-bold text-emerald-600">{ord.status} →</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
