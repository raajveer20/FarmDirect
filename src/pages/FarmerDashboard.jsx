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
  UserCheck,
  ShieldCheck,
  CreditCard,
  Building2,
  Camera,
  Award
} from 'lucide-react';

export const FarmerDashboard = () => {
  const { 
    products, 
    orders, 
    addProduce, 
    currentUser, 
    userProfile, 
    openAuthModal, 
    navigateTo, 
    showToast,
    farmerEarnings,
    payoutHistory,
    openEscrowModal,
    updateOrderStatus
  } = useApp();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'my-produce' | 'add-produce' | 'orders' | 'earnings' | 'verification'

  const user = currentUser || userProfile;

  // Form State for Add Produce
  const [formData, setFormData] = useState({
    name: 'Grade A Red Tomatoes',
    category: 'Vegetables',
    availableQty: 500,
    unit: 'kg',
    pricePerKg: 25,
    location: user.location || 'Bhopal, Madhya Pradesh',
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
      
      {/* Top Banner / Farmer Identity & Verification Status */}
      <div className="glass-dark-card text-white rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30 backdrop-blur-md">
              GATEWAY 1: FARMER & FPO PRODUCER
            </span>
            {user.verificationStatus === 'VERIFIED_FARMER' ? (
              <span className="bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <CheckCircle2 className="w-3 h-3 text-slate-950" />
                <span>⭐ Verified Farmer (Govt ID Linked)</span>
              </span>
            ) : (
              <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>Basic Account (KYC Incomplete)</span>
              </span>
            )}
            <span className="text-xs text-slate-300 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{user.location || 'Bhopal, Madhya Pradesh'}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Welcome back, {user.name}</h1>
          <p className="text-xs text-slate-300">
            {user.fpoName || 'Narmada Valley Farmers Producer Co.'} • Registry Ref: <span className="font-mono text-emerald-400 font-bold">{user.verificationDocNumber || '#PMK-MP-2024-88392'}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {user.verificationStatus !== 'VERIFIED_FARMER' && (
            <button
              onClick={() => openAuthModal('Farmer', 'register')}
              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-xs font-bold px-4 py-3 rounded-xl transition-all backdrop-blur-md"
            >
              Verify Farmer ID
            </button>
          )}
          <button
            onClick={() => setActiveTab('add-produce')}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-5 py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ List New Produce</span>
          </button>
        </div>
      </div>

      {/* Main Dashboard Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 sm:p-6 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04)] space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Total Direct Sales</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center font-black border border-emerald-200/50">
              ₹
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">₹1,24,500</p>
          <p className="text-[11px] text-emerald-600 font-bold">✓ 100% Direct Escrow Settled</p>
        </div>

        <div className="glass-card p-5 sm:p-6 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04)] space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Active Orders</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center font-bold border border-amber-200/50">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">24 Orders</p>
          <p className="text-[11px] text-amber-600 font-bold">4 Scheduled For Pickup</p>
        </div>

        <div className="glass-card p-5 sm:p-6 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04)] space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Crops in Store</span>
            <div className="w-8 h-8 rounded-xl bg-teal-100/80 text-teal-700 flex items-center justify-center font-bold border border-teal-200/50">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{products.length} Listings</p>
          <p className="text-[11px] text-teal-600 font-bold">Live in Marketplace</p>
        </div>

        <div className="glass-card p-5 sm:p-6 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04)] space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Earnings Boost</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center font-bold border border-indigo-200/50">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">+18%</p>
          <p className="text-[11px] text-slate-500">vs APMC Mandi Middlemen</p>
        </div>

      </div>

      {/* Tabs Navigation (Segmented Pill Bar) */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-100/70 border border-slate-200/70 rounded-2xl backdrop-blur-md text-xs font-bold">
        {[
          { id: 'overview', label: 'Overview & Verification' },
          { id: 'my-produce', label: 'My Listed Produce' },
          { id: 'add-produce', label: '+ Add New Produce' },
          { id: 'orders', label: 'Customer Orders' },
          { id: 'earnings', label: 'Escrow Payouts & Bank' },
          { id: 'ai-forecast', label: 'AI Demand Forecast' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
              activeTab === tab.id
                ? 'bg-emerald-700 text-white shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT 1: OVERVIEW & VERIFICATION */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Orders List */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Real Farmer Verification Card */}
            <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/30">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Farmer Verification & Land Credentials</h3>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                        ACTIVE ⭐
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Verified under PM-KISAN beneficiary database & State Land Registry.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => openAuthModal('Farmer', 'register')}
                  className="text-xs font-bold text-emerald-700 bg-white/90 hover:bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-300 transition-all shadow-2xs shrink-0"
                >
                  Edit KYC Docs
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-white/90 p-3 rounded-2xl border border-emerald-100/80 shadow-2xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Verification Method</div>
                  <div className="text-xs font-extrabold text-slate-900 mt-0.5">{user.verificationMethod || 'PM-KISAN / AgriStack'}</div>
                </div>

                <div className="bg-white/90 p-3 rounded-2xl border border-emerald-100/80 shadow-2xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Document / ID No.</div>
                  <div className="text-xs font-extrabold text-emerald-800 font-mono mt-0.5 truncate">{user.verificationDocNumber || 'PMK-MP-2024-88392'}</div>
                </div>

                <div className="bg-white/90 p-3 rounded-2xl border border-emerald-100/80 shadow-2xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Cultivated Land</div>
                  <div className="text-xs font-extrabold text-slate-900 mt-0.5">{user.landSizeAcres || 4.5} Acres</div>
                </div>

                <div className="bg-white/90 p-3 rounded-2xl border border-emerald-100/80 shadow-2xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Instant Payout UPI</div>
                  <div className="text-xs font-extrabold text-blue-700 font-mono mt-0.5 truncate">{user.bankUpiId || 'farmer@upi'}</div>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="glass-card p-6 sm:p-7 rounded-3xl border border-white/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] space-y-4">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Recent Customer & Wholesale Orders</h3>
              <div className="space-y-3">
                {orders.map((ord, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-slate-200/80 bg-white/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-emerald-300 transition-colors shadow-2xs">
                    <div>
                      <span className="font-mono font-bold text-emerald-700">#{ord.id}</span>
                      <h4 className="font-bold text-slate-900 text-sm mt-0.5">{ord.productName} ({ord.quantity} kg)</h4>
                      <p className="text-slate-500">Buyer: {ord.buyerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-slate-900 text-sm">₹{ord.totalPrice}</p>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block mt-1">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Local Weather & AI Crop Recommendation */}
          <div className="glass-dark-card text-white p-6 sm:p-7 rounded-3xl border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
              <Sparkles className="w-4 h-4" />
              <span>AI Crop Recommendation</span>
            </div>

            <h4 className="text-lg font-black text-white tracking-tight">High Demand Forecast: Tomatoes</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              AI analytics predicts a 25% demand surge for Grade A Tomatoes in the Bhopal-Sehore region next week. Expected price point: ₹26-₹28/kg.
            </p>

            <div className="bg-white/10 rounded-2xl p-3.5 text-xs space-y-1.5 backdrop-blur-md border border-white/10">
              <div className="flex justify-between text-slate-300">
                <span>Optimal Harvest Window:</span>
                <span className="font-bold text-emerald-300">Next 48 Hours</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Direct Buyer Inquiries:</span>
                <span className="font-bold text-amber-300">6 Wholesale Buyers</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('add-produce')}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs py-3 rounded-xl transition-all shadow-md"
            >
              List Additional Tomato Inventory
            </button>
          </div>

        </div>
      )}

      {/* TAB CONTENT 2: MY LISTED PRODUCE */}
      {activeTab === 'my-produce' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
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

      {/* TAB CONTENT 3: ADD PRODUCE FORM */}
      {activeTab === 'add-produce' && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          <div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              PRODUCER LISTING FORM
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
                  <option value="Grains">Grains & Pulses</option>
                  <option value="Spices">Spices & Herbs</option>
                  <option value="Dairy">Farm Dairy</option>
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

      {/* TAB CONTENT 4: CUSTOMER ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">Direct Buyer & Wholesale Orders</h3>
          <div className="space-y-3">
            {orders.map((ord, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-700">#{ord.id}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {ord.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">{ord.productName} ({ord.quantity} kg)</h4>
                  <p className="text-slate-500">Destination: {ord.deliveryAddress}</p>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                  <p className="font-extrabold text-slate-900 text-sm">₹{ord.totalPrice}</p>
                  
                  {ord.status === 'Order Placed & Escrow Funded' ? (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'Produce Packed & Awaiting Logistics Pickup', 3)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Accept & Pack for Pickup</span>
                    </button>
                  ) : ord.status.includes('Settled') ? (
                    <button
                      onClick={() => openEscrowModal(ord, 'receipt')}
                      className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-black rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>UPI Voucher</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold">
                      {ord.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: ESCROW PAYOUTS & BANK */}
      {activeTab === 'earnings' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">Escrow Payout Settlement & Bank Account</h3>
            <p className="text-xs text-slate-500">
              Payments from buyers are locked in escrow and released directly to your verified bank account via UPI the moment physical delivery is verified. Zero broker commissions deducted.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-slate-900">Registered Escrow UPI ID</div>
                <div className="text-sm font-bold text-blue-700 font-mono">{user?.bankUpiId || 'demo.farmer@upi'}</div>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Instant NPCI / UPI Auto-Credit Active
            </span>
          </div>

          {/* Dynamic Earnings Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl border border-slate-200 bg-emerald-50/40">
              <div className="text-slate-500 font-bold uppercase text-[10px]">Total Settled Earnings</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                ₹{farmerEarnings?.totalSettled?.toLocaleString() || '1,24,500'}
              </div>
              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Directly credited to your bank account</p>
            </div>
            
            <div className="p-4 rounded-2xl border border-slate-200 bg-amber-50/40">
              <div className="text-slate-500 font-bold uppercase text-[10px]">In Escrow (In Transit)</div>
              <div className="text-2xl font-black text-amber-600 mt-1">
                ₹{farmerEarnings?.inEscrow?.toLocaleString() || '18,400'}
              </div>
              <p className="text-[10px] text-amber-700 font-semibold mt-0.5">Releases upon delivery QR scan</p>
            </div>
            
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
              <div className="text-slate-500 font-bold uppercase text-[10px]">Middleman Commission Saved</div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                ₹{farmerEarnings?.middlemanSaved?.toLocaleString() || '22,410'}
              </div>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Retained by you (0% commission model)</p>
            </div>
          </div>

          {/* Real-Time UPI Settlement Transactions Table */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-slate-900">
                Live UPI Settlement History & Bank Vouchers
              </h4>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                {payoutHistory?.length || 0} Transactions
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                    <th className="p-3">Reference / UTR</th>
                    <th className="p-3">Crop Consignment</th>
                    <th className="p-3">Buyer</th>
                    <th className="p-3">Middleman Cut</th>
                    <th className="p-3">Settlement Date</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3 text-right">Voucher</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {payoutHistory.map((p, idx) => {
                    const matchedOrder = orders.find(o => o.id === p.orderId) || {
                      id: p.orderId,
                      productName: p.cropName,
                      totalPrice: p.amount,
                      farmerName: p.farmerName,
                      farmerUpi: p.farmerUpi,
                      utrNumber: p.utr,
                      status: 'Delivered & Escrow Settled'
                    };

                    return (
                      <tr key={p.id || idx} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-slate-800 text-[11px] truncate max-w-[150px]">
                          {p.utr}
                        </td>
                        <td className="p-3 font-bold text-slate-900">{p.cropName}</td>
                        <td className="p-3 text-slate-600">{p.buyerName || 'Procurement Buyer'}</td>
                        <td className="p-3">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                            ₹0 (0% Cut)
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 text-[11px]">{p.settledAt}</td>
                        <td className="p-3 font-black text-emerald-700 text-sm">₹{p.amount.toLocaleString()}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => openEscrowModal(matchedOrder, 'receipt')}
                            className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                          >
                            <Award className="w-3 h-3 text-emerald-600" />
                            <span>Voucher</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT 6: AI DEMAND FORECAST */}
      {activeTab === 'ai-forecast' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
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
