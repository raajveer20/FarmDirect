import React from 'react';
import { CheckCircle2, Clock, Truck, Package, MapPin, ShieldCheck, User } from 'lucide-react';

export const TrackingTimeline = ({ order }) => {
  if (!order) return null;

  const steps = order.trackingSteps || [
    { title: "Order Placed", time: "14:30", completed: true },
    { title: "Farmer Confirmed", time: "14:35", completed: true },
    { title: "Produce Packed", time: "15:10", completed: true },
    { title: "Picked Up", time: "15:45", completed: true },
    { title: "In Transit", time: "16:15", completed: true, current: true },
    { title: "Delivered", time: "Est. 17:00", completed: false }
  ];

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] space-y-6">
      
      {/* Order Header Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">ORDER #{order.id}</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
              {order.status}
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 mt-1">
            {order.productName} ({order.quantity} {order.unit || 'kg'})
          </h3>
          <p className="text-xs text-slate-500">
            From: <span className="font-semibold text-slate-700">{order.farmerName}</span> • To: <span className="font-semibold text-slate-700">{order.deliveryAddress}</span>
          </p>
        </div>

        <div className="text-right bg-slate-50 p-3 rounded-xl border border-slate-200">
          <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Amount</p>
          <p className="text-xl font-extrabold text-emerald-700">₹{order.totalPrice}</p>
          <p className="text-[10px] text-emerald-600 font-bold">You Saved ₹{order.savedAmount || 450}</p>
        </div>
      </div>

      {/* Horizontal / Vertical Timeline */}
      <div className="py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center relative z-10">
              
              {/* Step Icon Node */}
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-sm mb-2 transition-all ${
                  step.completed
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                    : step.current
                    ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {step.completed ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : step.current ? (
                  <Truck className="w-5 h-5 animate-bounce" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              {/* Step Title & Timestamp */}
              <p className={`text-xs font-bold ${step.completed || step.current ? 'text-slate-900' : 'text-slate-400'}`}>
                {step.title}
              </p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                {step.time}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Driver & Delivery Information Card */}
      {order.driver && (
        <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Assigned Delivery Partner</p>
              <p className="text-sm font-bold text-white">{order.driver.name} • {order.driver.phone}</p>
              <p className="text-[11px] text-emerald-400 font-mono mt-0.5">{order.driver.vehicle} ({order.driver.capacity})</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
              Call Driver
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700">
              Live Map View
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
