import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  Truck, 
  ShieldCheck, 
  BarChart3, 
  DollarSign,
  Recycle,
  Sparkles
} from 'lucide-react';

export const AdminDashboard = () => {
  const { products, orders, navigateTo } = useApp();
  const [activeTab, setActiveTab] = useState('farmers');

  const adminStats = [
    { label: "Total Farmers / FPOs", value: "10,420", change: "+14% this month", icon: Users, color: "emerald" },
    { label: "Registered Buyers", value: "2,680", change: "+22% this month", icon: ShoppingBag, color: "sky" },
    { label: "Active Orders", value: "142", change: "Live dispatches", icon: Truck, color: "amber" },
    { label: "Total Trade Value", value: "₹1.84 Cr", change: "Direct payout", icon: DollarSign, color: "indigo" },
    { label: "Logistics Savings", value: "₹34.2 Lakhs", change: "-22% transport cost", icon: TrendingUp, color: "teal" },
    { label: "Food Waste Reduced", value: "14.5 Tons", change: "Cold chain efficiency", icon: Recycle, color: "green" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
            PLATFORM MANAGEMENT CONSOLE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">FarmDirect National Admin Panel</h1>
          <p className="text-xs text-slate-300">
            Real-time telemetry monitoring farmer income, trade volume, AI route efficiency, and crop distribution.
          </p>
        </div>

        <div className="bg-emerald-500 text-slate-950 p-4 rounded-2xl font-bold text-center shrink-0 shadow-lg">
          <p className="text-[10px] uppercase font-extrabold">System Health</p>
          <p className="text-xl font-black">100% Operational</p>
        </div>
      </div>

      {/* Admin Stat Cards Grid (Requirement #12) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {adminStats.map((st, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span className="truncate">{st.label}</span>
              <st.icon className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>
            <p className="text-2xl font-black text-slate-900">{st.value}</p>
            <p className="text-[10px] text-emerald-600 font-bold">{st.change}</p>
          </div>
        ))}
      </div>

      {/* Management Tables Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        {/* Table Selector Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto text-xs font-bold">
          {[
            { id: 'farmers', label: 'Farmers & FPOs Directory' },
            { id: 'buyers', label: 'Registered Buyers List' },
            { id: 'products', label: 'Active Crop Listings' },
            { id: 'orders', label: 'Platform Orders' },
            { id: 'deliveries', label: 'Logistics Fleets' }
          ].map(tb => (
            <button
              key={tb.id}
              onClick={() => setActiveTab(tb.id)}
              className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
                activeTab === tb.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>

        {/* Farmers Table */}
        {activeTab === 'farmers' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <th className="p-3">FPO / Farmer Name</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Total Sales</th>
                  <th className="p-3">Verification</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: "ABC Farmers Producer Org", loc: "Bhopal, MP", rating: "4.9 ★", sales: "₹3,45,000", status: "Verified FPO" },
                  { name: "Maharashtra Farmers Coop", loc: "Nashik, MH", rating: "4.8 ★", sales: "₹5,12,000", status: "Verified FPO" },
                  { name: "Vidarbha FPO Alliance", loc: "Nagpur, MH", rating: "5.0 ★", sales: "₹2,88,000", status: "Verified FPO" },
                  { name: "Malwa Annadata FPO", loc: "Sehore, MP", rating: "4.9 ★", sales: "₹4,20,000", status: "Verified FPO" }
                ].map((f, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{f.name}</td>
                    <td className="p-3">{f.loc}</td>
                    <td className="p-3 text-amber-600 font-bold">{f.rating}</td>
                    <td className="p-3 font-extrabold text-emerald-700">{f.sales}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {f.status}
                      </span>
                    </td>
                    <td className="p-3 text-right text-emerald-600 font-bold">Active</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Products Table */}
        {activeTab === 'products' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <th className="p-3">Product Name</th>
                  <th className="p-3">FPO</th>
                  <th className="p-3">Price / kg</th>
                  <th className="p-3">Available Stock</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{p.name}</td>
                    <td className="p-3">{p.farmer}</td>
                    <td className="p-3 font-bold text-emerald-700">₹{p.pricePerKg}</td>
                    <td className="p-3 font-semibold">{p.availableQty} kg</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => navigateTo('product-detail', p)}
                        className="text-emerald-600 font-bold hover:underline"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders Table */}
        {activeTab === 'orders' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Product</th>
                  <th className="p-3">Farmer</th>
                  <th className="p-3">Buyer</th>
                  <th className="p-3">Total</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-emerald-700">#{o.id}</td>
                    <td className="p-3 font-bold text-slate-900">{o.productName} ({o.quantity} kg)</td>
                    <td className="p-3">{o.farmerName}</td>
                    <td className="p-3">{o.buyerName}</td>
                    <td className="p-3 font-bold">₹{o.totalPrice}</td>
                    <td className="p-3 text-right font-bold text-emerald-600">{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};
