import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Trash2, Sparkles, QrCode, ShieldCheck, Lock } from 'lucide-react';

export const BuyerDashboard = () => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQty, 
    clearCart, 
    placeOrder, 
    orders, 
    setTrackedOrderId, 
    navigateTo, 
    openMiddlemenModal,
    openEscrowModal,
    openPaymentModal
  } = useApp();
  const [deliveryAddress, setDeliveryAddress] = useState('102 Royal Palm Enclave, Bhopal MP');

  const totalCartPrice = cart.reduce((acc, item) => acc + (item.product.pricePerKg * item.qty), 0);
  const totalTraditionalPrice = cart.reduce((acc, item) => acc + ((item.product.traditionalPrice || 45) * item.qty), 0);
  const totalSaved = Math.max(0, totalTraditionalPrice - totalCartPrice);

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    openPaymentModal({
      deliveryAddress,
      totalCartPrice,
      totalSaved
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="glass-dark-card text-white rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
        <div className="space-y-1.5">
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 backdrop-blur-md">
            BUYER PORTAL & CART
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Consumer & Bulk Buyer Dashboard</h1>
          <p className="text-xs text-slate-300">
            Direct farmer purchasing with zero retail markup.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="bg-white/10 backdrop-blur-xl p-3.5 rounded-2xl border border-white/15 text-center">
            <p className="text-[10px] text-emerald-300 font-semibold uppercase">Total Saved</p>
            <p className="text-xl font-black text-emerald-400">₹4,850</p>
          </div>
          <button
            onClick={() => navigateTo('marketplace')}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
          >
            + Browse Produce
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Shopping Cart Items List */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 tracking-tight">
              <ShoppingCart className="w-5 h-5 text-emerald-600" />
              <span>Shopping Cart ({cart.length} items)</span>
            </h2>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-rose-600 hover:underline font-bold"
              >
                Clear Cart
              </button>
            )}
          </div>

          {cart.length > 0 ? (
            <div className="space-y-4">
              {cart.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-slate-200/80 bg-white/70 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.product.name}</h4>
                      <p className="text-xs text-slate-500">{item.product.farmer}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-extrabold text-emerald-700">₹{item.product.pricePerKg} / kg</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">Min 10 kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 text-xs font-bold">
                      <button
                        onClick={() => {
                          if (item.qty <= 10) {
                            removeFromCart(item.product.id);
                          } else {
                            updateCartQty(item.product.id, Math.max(10, item.qty - 5));
                          }
                        }}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-200/60 rounded-l-lg transition-colors cursor-pointer"
                        title={item.qty <= 10 ? "Remove item" : "Decrease by 5 kg"}
                      >
                        -
                      </button>
                      <span className="px-3 py-1 font-mono">{item.qty} kg</span>
                      <button
                        onClick={() => updateCartQty(item.product.id, item.qty + 5)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-200/60 rounded-r-lg transition-colors cursor-pointer"
                        title="Increase by 5 kg"
                      >
                        +
                      </button>
                    </div>

                    <p className="font-black text-slate-900 text-sm">₹{item.product.pricePerKg * item.qty}</p>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
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
                className="bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs"
              >
                Go to Marketplace
              </button>
            </div>
          )}
        </div>

        {/* Order Summary & Delivery Address Checkout Form */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] space-y-6 h-fit">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Order Summary & Delivery</h3>

          <form onSubmit={handleCheckout} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Delivery Address *</label>
              <textarea
                required
                rows="2"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full p-2.5 bg-white/90 border border-slate-200/80 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-medium"
              />
            </div>

            <div className="bg-slate-50/70 p-4 rounded-2xl space-y-2 border border-slate-200/80">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Subtotal ({cart.reduce((a, c) => a + c.qty, 0)} kg):</span>
                <span className="font-bold text-slate-900">₹{totalCartPrice}</span>
              </div>

              <div className="flex justify-between text-slate-600 font-medium">
                <span>FarmDirect Direct Shipping:</span>
                <span className="font-bold text-emerald-600">FREE (AI Pooled)</span>
              </div>

              <div className="flex justify-between text-emerald-700 font-bold border-t border-slate-200/80 pt-2">
                <span>You Save vs Traditional Mandi:</span>
                <span>₹{totalSaved}</span>
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200/80">
                <span>Total Amount Payable:</span>
                <span className="text-emerald-700">₹{totalCartPrice}</span>
              </div>

              {totalSaved > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-amber-900 font-extrabold text-[11px]">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Middleman Cut Slashed:</span>
                    </span>
                    <span className="text-amber-800 font-black">₹{totalSaved}</span>
                  </div>
                  <p className="text-[10px] text-amber-700/90 leading-tight">
                    By bypassing 5 mandi intermediaries, you saved ₹{totalSaved} while farmers received direct fair price payments.
                  </p>
                  <button
                    type="button"
                    onClick={() => openMiddlemenModal(cart[0]?.product)}
                    className="text-[10px] font-bold text-amber-800 underline hover:text-amber-950 pt-0.5 block cursor-pointer"
                  >
                    View Complete Rupee-Split Audit →
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={cart.length === 0}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:opacity-40 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-emerald-600/25 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Lock className="w-4 h-4" />
              <span>Proceed to Escrow Payment (₹{totalCartPrice.toLocaleString()}) →</span>
            </button>
          </form>

          {/* Active Orders List */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Recent Orders History</h4>
            {orders.map((ord, idx) => (
              <div 
                key={idx} 
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div 
                  onClick={() => {
                    setTrackedOrderId(ord.id);
                    navigateTo('order-tracking');
                  }}
                  className="cursor-pointer flex-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-700">#{ord.id}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      ord.status.includes('Settled') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                  <p className="font-bold text-slate-800 mt-1">{ord.productName} ({ord.quantity} kg)</p>
                  <p className="text-[11px] text-slate-500">Track Cargo Telemetry →</p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                  <p className="font-extrabold text-slate-900 text-sm">₹{ord.totalPrice}</p>
                  
                  {ord.status.includes('Settled') ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEscrowModal(ord, 'receipt');
                      }}
                      className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-black rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <ShieldCheck className="w-3 h-3" />
                      <span>UPI Voucher</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEscrowModal(ord, 'qr');
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-[10px] font-black rounded-lg transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                    >
                      <QrCode className="w-3 h-3 text-emerald-600" />
                      <span>Show QR / OTP</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
