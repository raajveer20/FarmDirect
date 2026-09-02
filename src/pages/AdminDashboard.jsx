import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  Truck, 
  ShieldCheck, 
  DollarSign,
  Recycle
} from 'lucide-react';

export const AdminDashboard = () => {
  const { products, orders, navigateTo, openEscrowModal, setTrackedOrderId } = useApp();
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
      <div className="glass-dark-card text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>LOGISTICS & PLATFORM ADMIN CONSOLE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Logistics / Admin Operations Center</h1>
          <p className="text-xs text-slate-300">
            Real-time supply chain telemetry monitoring farmer payouts, logistics fleet dispatch, AI route efficiency, and quality compliance.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigateTo('route-opt')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>AI Route Optimizer</span>
          </button>
          <div className="bg-white/10 backdrop-blur-xl p-3.5 rounded-2xl border border-white/15 text-center">
            <p className="text-[10px] uppercase font-bold text-emerald-300">System Health</p>
            <p className="text-lg font-black text-white">100% Operational</p>
          </div>
        </div>
      </div>

      {/* Admin Stat Cards Grid (Requirement #12) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {adminStats.map((st, i) => (
          <div key={i} className="glass-card p-4 rounded-2xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04)] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span className="truncate">{st.label}</span>
              <st.icon className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{st.value}</p>
            <p className="text-[10px] text-emerald-600 font-bold">{st.change}</p>
          </div>
        ))}
      </div>

      {/* Management Tables Section */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] space-y-6">
        
        {/* Table Selector Tabs (Segmented Pill Bar) */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/70 border border-slate-200/70 rounded-2xl backdrop-blur-md overflow-x-auto text-xs font-bold">
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
                  ? 'bg-emerald-700 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
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
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Escrow Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-emerald-700">
                      <button
                        onClick={() => {
                          setTrackedOrderId(o.id);
                          navigateTo('order-tracking');
                        }}
                        className="hover:underline cursor-pointer"
                        title="Track live cargo"
                      >
                        #{o.id}
                      </button>
                    </td>
                    <td className="p-3 font-bold text-slate-900">{o.productName} ({o.quantity} kg)</td>
                    <td className="p-3">{o.farmerName}</td>
                    <td className="p-3">{o.buyerName}</td>
                    <td className="p-3 font-bold">₹{o.totalPrice}</td>
                    <td className="p-3 font-bold">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                        o.status.includes('Settled') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {o.status.includes('Settled') ? (
                        <button
                          onClick={() => openEscrowModal(o, 'receipt')}
                          className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                        >
                          UPI Receipt
                        </button>
                      ) : (
                        <button
                          onClick={() => openEscrowModal(o, 'scan')}
                          className="text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 rounded-lg cursor-pointer shadow-xs transition-colors"
                        >
                          Scan & Release
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Buyers Table */}
        {activeTab === 'buyers' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <th className="p-3">Buyer / Business Name</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Procurement Type</th>
                  <th className="p-3">Total Purchased</th>
                  <th className="p-3 text-right">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: "Pooja Agarwal (FreshBasket Supermarkets)", loc: "Indore, MP", type: "B2B Wholesale", spent: "₹4,85,000", status: "Verified Buyer" },
                  { name: "Green Valley Supermarket", loc: "Bhopal, MP", type: "B2B Retail Chain", spent: "₹2,40,000", status: "Verified Buyer" },
                  { name: "Annapurna Bhojnalaya", loc: "Ujjain, MP", type: "Institutional Kitchen", spent: "₹1,65,000", status: "Verified Buyer" },
                  { name: "Kisan Mandi Aggregators", loc: "Nagpur, MH", type: "Distribution Hub", spent: "₹6,10,000", status: "Verified Buyer" }
                ].map((b, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{b.name}</td>
                    <td className="p-3">{b.loc}</td>
                    <td className="p-3 font-semibold text-blue-700">{b.type}</td>
                    <td className="p-3 font-extrabold text-emerald-700">{b.spent}</td>
                    <td className="p-3 text-right">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Deliveries & Logistics Fleets */}
        {activeTab === 'deliveries' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-600" />
                  <span>Logistics Fleet Cargo Dispatches & AI Bundling</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Multi-hop pickup routes consolidated to maximize payload and reduce agricultural transit emissions.
                </p>
              </div>
              <button
                onClick={() => navigateTo('route-opt')}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
              >
                Launch AI Route Optimizer Map →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                    <th className="p-3">Order Cargo</th>
                    <th className="p-3">Farmer Origin</th>
                    <th className="p-3">Destination</th>
                    <th className="p-3">Payload</th>
                    <th className="p-3">Dispatch Status</th>
                    <th className="p-3 text-right">Live Tracking</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">
                        #{o.id} • {o.productName} ({o.quantity} kg)
                      </td>
                      <td className="p-3 text-slate-600">{o.farmerLocation || o.farmerName}</td>
                      <td className="p-3 text-slate-600">{o.deliveryAddress || 'Bhopal Central Hub'}</td>
                      <td className="p-3 font-mono text-emerald-700 font-bold">
                        {o.quantity} / 1000 kg
                      </td>
                      <td className="p-3">
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => navigateTo('order-tracking')}
                          className="text-emerald-700 font-bold hover:underline cursor-pointer"
                        >
                          View Map →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
