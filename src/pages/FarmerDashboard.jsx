import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sprout, 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  DollarSign, 
  PlusCircle, 
  Cpu, 
  Truck, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Clock,
  Sparkles,
  AlertCircle,
  FileText,
  UserCheck
} from 'lucide-react';

export const FarmerDashboard = () => {
  const { products, orders, addProduce, userProfile, navigateTo, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'my-produce' | 'add-produce' | 'orders' | 'earnings' | 'ai-forecast'

  // Form State for Add Produce
  const [formData, setFormData] = useState({
    name: 'Grade A Red Tomatoes',
    category: 'Vegetables',
    availableQty: 500,
    unit: 'kg',
    pricePerKg: 25,
    location: 'Bhopal, Madhya Pradesh',
    harvestDate: '2026-08-29',
    qualityGrade: 'Grade A',
    isOrganic: true,
    description: 'Fresh organic tomatoes directly harvested from Sehore farm.',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addProduce(formData);
    setActiveTab('my-produce');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner / Weather & Mandi Tip */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/30 text-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
              FARMER & FPO DASHBOARD
            </span>
            <span className="text-xs text-slate-300">Location: {userProfile.location}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Welcome back, {userProfile.name}</h1>
          <p className="text-xs text-slate-300">
            {userProfile.fpoName} • Verified Producer ID: <span className="font-mono text-emerald-400">#FPO-MP-2024-88</span>
          </p>
        </div>

        <button
          onClick={() => setActiveTab('add-produce')}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg transition-transform transform active:scale-95 flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ List New Crop Produce</span>
        </button>
      </div>

      {/* Main Dashboard Stats Cards (Requirement #5) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Total Direct Sales</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">₹1,24,500</p>
          <p className="text-[11px] text-emerald-600 font-bold">✓ 100% Payout Received</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Active Orders</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">24 Orders</p>
          <p className="text-[11px] text-amber-600 font-bold">4 Pending Pickup</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Products Listed</span>
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{products.length} Crops</p>
          <p className="text-[11px] text-teal-600 font-bold">In Marketplace</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Earnings Boost</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-700">+18%</p>
          <p className="text-[11px] text-slate-500">vs Traditional Mandi Commission</p>
        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-2 text-xs font-bold">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'my-produce', label: 'My Listed Produce' },
          { id: 'add-produce', label: '+ Add New Produce' },
          { id: 'orders', label: 'Customer Orders' },
          { id: 'earnings', label: 'Earnings & Bank' },
          { id: 'ai-forecast', label: 'AI Demand Forecast' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Orders List */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Recent Customer Orders</h3>
            <div className="space-y-3">
              {orders.map((ord, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-mono font-bold text-emerald-700">#{ord.id}</span>
                    <h4 className="font-bold text-slate-900 text-sm mt-0.5">{ord.productName} ({ord.quantity} kg)</h4>
                    <p className="text-slate-500">Buyer: {ord.buyerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-slate-900 text-sm">₹{ord.totalPrice}</p>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1">
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Local Weather & AI Crop Recommendation */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-6 rounded-2xl border border-slate-800 space-y-4 shadow-lg">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
              <Sparkles className="w-4 h-4" />
              <span>AI Crop Recommendation</span>
            </div>

            <h4 className="text-lg font-black text-white">High Demand Forecast: Tomatoes</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              AI analytics predicts a 25% demand surge for Grade A Tomatoes in the Bhopal-Sehore region next week. Expected price point: ₹26-₹28/kg.
            </p>

            <button
              onClick={() => setActiveTab('add-produce')}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs py-3 rounded-xl transition-all"
            >
              List Additional Tomato Inventory
            </button>
          </div>

        </div>
      )}

      {/* TAB CONTENT 2: MY LISTED PRODUCE */}
      {activeTab === 'my-produce' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Active Crop Listings ({products.length})</h3>
            <button
              onClick={() => setActiveTab('add-produce')}
              className="bg-emerald-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl"
            >
              + Add Produce
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <th className="p-3">Crop Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Grade</th>
                  <th className="p-3">Price / kg</th>
                  <th className="p-3">Available Stock</th>
                  <th className="p-3">Harvest Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                      <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                      <span>{p.name}</span>
                    </td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {p.qualityGrade || 'Grade A'}
                      </span>
                    </td>
                    <td className="p-3 font-extrabold text-emerald-700">₹{p.pricePerKg}</td>
                    <td className="p-3 font-bold">{p.availableQty} {p.unit || 'kg'}</td>
                    <td className="p-3">{p.harvestDate}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => navigateTo('product-detail', p)}
                        className="text-emerald-600 font-bold hover:underline"
                      >
                        View in Store
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: ADD PRODUCE FORM (Requirement #6) */}
      {activeTab === 'add-produce' && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          <div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              PRODUCER FORM
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">List New Farm Produce</h2>
            <p className="text-xs text-slate-500">Direct listing to consumers and bulk buyers with 0% middleman fees.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500"
                >
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Grains">Grains</option>
                  <option value="Spices">Spices</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Available Quantity *</label>
                <input
                  type="number"
                  required
                  value={formData.availableQty}
                  onChange={(e) => setFormData({ ...formData, availableQty: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Unit *</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500"
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="quintal">Quintal</option>
                  <option value="ton">Ton</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Price per kg (₹) *</label>
                <input
                  type="number"
                  required
                  value={formData.pricePerKg}
                  onChange={(e) => setFormData({ ...formData, pricePerKg: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Farm Location *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Harvest Date *</label>
                <input
                  type="date"
                  required
                  value={formData.harvestDate}
                  onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Quality Grade *</label>
                <select
                  value={formData.qualityGrade}
                  onChange={(e) => setFormData({ ...formData, qualityGrade: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500"
                >
                  <option value="Grade A">Grade A (Premium)</option>
                  <option value="Grade B">Grade B (Standard)</option>
                  <option value="Premium Organic">Premium Organic</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="organic-check"
                  checked={formData.isOrganic}
                  onChange={(e) => setFormData({ ...formData, isOrganic: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="organic-check" className="font-bold text-slate-800">Certified Organic Crop</label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Product Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Description</label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-sm"
            >
              List Produce Now
            </button>
          </form>
        </div>
      )}

      {/* TAB CONTENT 6: AI DEMAND FORECAST */}
      {activeTab === 'ai-forecast' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900">AI Regional Crop Demand Forecast</h3>
          <p className="text-xs text-slate-500">
            Powered by FarmDirect ML engine analyzing weather, historical sales, and wholesale mandi price indices.
          </p>
          <button
            onClick={() => navigateTo('ai-demand')}
            className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            Open Full AI Demand Analytics Dashboard →
          </button>
        </div>
      )}

    </div>
  );
};
