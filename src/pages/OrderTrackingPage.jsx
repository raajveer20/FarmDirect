import React from 'react';
import { useApp } from '../context/AppContext';
import { TrackingTimeline } from '../components/TrackingTimeline';
import { OrderRouteMap } from '../components/OrderRouteMap';
import { 
  MapPin, 
  ArrowLeft,
  Truck,
  ShieldCheck,
  QrCode,
  Camera,
  Award
} from 'lucide-react';

export const OrderTrackingPage = () => {
  const { 
    orders, 
    trackedOrderId, 
    setTrackedOrderId, 
    navigateTo, 
    currentUser, 
    userRole, 
    openAuthModal,
    openEscrowModal,
    t
  } = useApp();

  const isLogisticsUser = currentUser && (userRole?.includes('Logistics') || userRole?.includes('Admin'));

  if (!isLogisticsUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-md">
          <Truck className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider">
          Logistics / Admin Portal Only
        </span>
        <h2 className="text-2xl font-black text-slate-900">Cargo Route Tracking Restricted</h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Live GPS multi-hop dispatch maps and fleet tracking are reserved exclusively for the <strong>Logistics / Admin</strong> operations console.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button 
            onClick={() => openAuthModal('Logistics', 'login')} 
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all cursor-pointer"
          >
            Login as Logistics / Admin
          </button>
          <button 
            onClick={() => navigateTo('marketplace')} 
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const currentOrder = orders?.find(o => o.id === trackedOrderId) || orders?.[0];

  if (!currentOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-900">No Active Order Found</h2>
        <p className="text-sm text-slate-500">No active cargo dispatch orders currently assigned to the fleet.</p>
        <button 
          onClick={() => navigateTo('admin-dash')} 
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all cursor-pointer"
        >
          Return to Operations Center
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Navigation & Order Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigateTo('admin-dash')}
          className="glass-pill inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-amber-700 px-3.5 py-2 rounded-xl transition-all shadow-2xs w-fit cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Operations Center</span>
        </button>

        {/* Order Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 hidden md:inline">
            Active Orders:
          </span>
          {orders.map((ord) => {
            const ordImage = ord.image || (ord.productName?.toLowerCase().includes('orange') 
              ? '/images/oranges.jpg' 
              : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80');
            const shortName = ord.productName.toLowerCase().includes('orange') 
              ? 'Oranges' 
              : ord.productName.split(' ')[ord.productName.includes('Red') ? 2 : 0];

            return (
              <button
                key={ord.id}
                onClick={() => setTrackedOrderId(ord.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center gap-2.5 border cursor-pointer ${
                  (currentOrder?.id === ord.id)
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                }`}
              >
                <img 
                  src={ordImage} 
                  alt="" 
                  className="w-5 h-5 rounded-md object-cover border border-white/30 shrink-0" 
                />
                <span>#{ord.id}</span>
                <span className="text-[11px] opacity-80 font-normal">({shortName})</span>
                <span className={`w-2 h-2 rounded-full shrink-0 ${ord.status === 'Delivered' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tracking Header Banner */}
      <div className="glass-dark-card text-white rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10 relative overflow-hidden">
        {/* Subtle glowing ambient blur */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left z-10">
          {/* Produce Image Card */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-emerald-400/40 shadow-xl shadow-emerald-500/10 bg-slate-900 ring-4 ring-emerald-500/10 group-hover:scale-105 transition-all duration-300">
              <img 
                src={currentOrder?.image || (currentOrder?.productName?.toLowerCase().includes('orange') ? '/images/oranges.jpg' : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80')} 
                alt={currentOrder?.productName} 
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" 
              />
            </div>
            <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-md shadow-md border border-emerald-300">
              {currentOrder?.quantity} {currentOrder?.unit}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-emerald-500/30 text-emerald-200 text-[10px] font-bold px-3 py-0.5 rounded-full border border-emerald-400/30 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>REAL-TIME SUPPLY CHAIN & ROUTE VISUALIZATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span>Order #{currentOrder?.id}:</span>
              <span className="text-emerald-400">{currentOrder?.productName}</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              Freshly harvested produce traced directly from <strong className="text-white">{currentOrder?.origin?.name || currentOrder?.farmerName}</strong> to your delivery address.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs text-slate-300">
              <span className="bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700/80">
                Grade: <strong className="text-emerald-400">{currentOrder?.origin?.qualityGrade || 'Grade A Certified'}</strong>
              </span>
              <span className="bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700/80">
                Harvest: <strong className="text-white">{currentOrder?.origin?.harvestDate || 'Fresh Harvest'}</strong>
              </span>
              <span className="bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700/80 font-mono">
                Batch: <strong className="text-amber-400">{currentOrder?.origin?.batchCode || 'BATCH-771'}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/15 text-center shrink-0 min-w-[130px]">
            <p className="text-[10px] text-emerald-300 uppercase font-bold">Estimated Arrival</p>
            <p className="text-2xl font-black text-white">
              {currentOrder?.destination?.estArrival?.split(' ')[0] || '45 Mins'}
            </p>
            <p className="text-[10px] text-slate-300">Direct Route Active</p>
          </div>

          <button
            onClick={() => navigateTo('marketplace')}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-3.5 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 hidden lg:block cursor-pointer"
          >
            + Buy More Produce
          </button>
        </div>
      </div>

      {/* Interactive Leaflet Origin-to-Destination Map Component */}
      <OrderRouteMap order={currentOrder} />

      {/* Status Timeline Milestone Component */}
      <TrackingTimeline order={currentOrder} />

      {/* Escrow Handover & Instant Payout Action Box */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 border border-emerald-500/30 shadow-[0_8px_30px_-6px_rgba(16,185,129,0.12)] bg-gradient-to-r from-emerald-50/80 via-white to-teal-50/80 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/30 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-0.5 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {currentOrder?.status === 'Delivered & Escrow Settled' ? 'ESCROW SETTLED' : 'LOCKED ESCROW POOL'}
              </span>
              <span className="text-xs font-black text-slate-900">
                Consignment Escrow Value: ₹{currentOrder?.totalPrice || 4800}
              </span>
            </div>
            <p className="text-xs text-slate-600">
              {currentOrder?.status === 'Delivered & Escrow Settled'
                ? `Physical handover confirmed. ₹${currentOrder?.totalPrice || 4800} settled directly to ${currentOrder?.origin?.name || currentOrder?.farmerName}'s bank account via UPI.`
                : `Locked funds will be instantly released to farmer ${currentOrder?.origin?.name || currentOrder?.farmerName} upon delivery QR scan.`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0 w-full md:w-auto">
          {currentOrder?.status === 'Delivered & Escrow Settled' ? (
            <button
              onClick={() => openEscrowModal(currentOrder, 'receipt')}
              className="w-full sm:w-auto py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Award className="w-4 h-4" />
              <span>{t('escrow_view_receipt')}</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => openEscrowModal(currentOrder, 'qr')}
                className="py-2.5 px-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <QrCode className="w-4 h-4 text-slate-600" />
                <span>{t('escrow_show_qr')}</span>
              </button>
              <button
                onClick={() => openEscrowModal(currentOrder, 'scan')}
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>{t('escrow_scan_btn')}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Origin vs Destination Detailed Inspection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Origin Detailed Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <img 
                src={currentOrder?.image || (currentOrder?.productName?.toLowerCase().includes('orange') ? '/images/oranges.jpg' : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80')} 
                alt={currentOrder?.productName} 
                className="w-11 h-11 rounded-xl object-cover border border-emerald-200 shadow-sm shrink-0" 
              />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Origin Source</span>
                <h3 className="text-sm font-extrabold text-slate-900">Where Order Was Placed</h3>
              </div>
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
              Harvest Point
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Producer / Farm:</span>
              <span className="font-extrabold text-slate-900 text-right">{currentOrder?.origin?.name || currentOrder?.farmerName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Farm Location:</span>
              <span className="font-medium text-slate-800 text-right max-w-[220px]">{currentOrder?.origin?.address || currentOrder?.origin?.farmLocation}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Coordinates:</span>
              <span className="font-mono text-emerald-700 font-bold">
                {currentOrder?.origin?.lat?.toFixed(4)}, {currentOrder?.origin?.lng?.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Order Placed Timestamp:</span>
              <span className="font-bold text-slate-900">{currentOrder?.origin?.placedAt || currentOrder?.orderDate}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Farmer Contact:</span>
              <span className="font-bold text-slate-800">{currentOrder?.origin?.contact || '+91 98765 43210'}</span>
            </div>
          </div>
        </div>

        {/* Destination Detailed Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Target Endpoint</span>
                <h3 className="text-sm font-extrabold text-slate-900">Where To Be Delivered</h3>
              </div>
            </div>
            <span className="bg-sky-50 text-sky-700 text-xs font-bold px-2.5 py-1 rounded-full border border-sky-200">
              Delivery Point
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Recipient / Business:</span>
              <span className="font-extrabold text-slate-900 text-right">{currentOrder?.destination?.name || currentOrder?.buyerName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Delivery Address:</span>
              <span className="font-medium text-slate-800 text-right max-w-[220px]">{currentOrder?.destination?.address || currentOrder?.deliveryAddress}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Coordinates:</span>
              <span className="font-mono text-sky-700 font-bold">
                {currentOrder?.destination?.lat?.toFixed(4)}, {currentOrder?.destination?.lng?.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Delivery Instructions:</span>
              <span className="font-bold text-slate-800 text-right">{currentOrder?.destination?.instructions || 'Standard Doorstep Delivery'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Recipient Phone:</span>
              <span className="font-bold text-slate-800">{currentOrder?.destination?.contact || '+91 98230 45678'}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
export default OrderTrackingPage;
