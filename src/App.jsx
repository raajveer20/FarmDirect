import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DemoGuideModal } from './components/DemoGuideModal';
import { AuthModal } from './components/AuthModal';
import { MiddlemenEliminationModal } from './components/MiddlemenEliminationModal';
import { EscrowSettlementModal } from './components/EscrowSettlementModal';
import { BuyerPaymentModal } from './components/BuyerPaymentModal';

import { LandingPage } from './pages/LandingPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { AIDemandPage } from './pages/AIDemandPage';
import { RouteOptimizationPage } from './pages/RouteOptimizationPage';
import { BuyerDashboard } from './pages/BuyerDashboard';
import { LogisticsDashboard } from './pages/LogisticsDashboard';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { HowItWorksPage } from './pages/HowItWorksPage';

const MainContent = () => {
  const { activeView, toastMessage, currentUser, userRole } = useApp();

  const renderView = () => {
    const effRole = (currentUser?.role || userRole || '').toLowerCase();
    // The home feature is not available after login through any of the three gateways
    if (currentUser && currentUser.isLoggedIn && (activeView === 'home' || !activeView)) {
      if (effRole.includes('farmer')) return <FarmerDashboard />;
      if (effRole.includes('buyer')) return <BuyerDashboard />;
      return <AdminDashboard />;
    }

    switch (activeView) {
      case 'home':
        return <LandingPage />;
      case 'marketplace':
        return <MarketplacePage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'farmer-dash':
      case 'add-produce':
        return <FarmerDashboard />;
      case 'ai-demand':
        return <AIDemandPage />;
      case 'route-opt':
        return <RouteOptimizationPage />;
      case 'buyer-dash':
        return <BuyerDashboard />;
      case 'logistics-dash':
        return <LogisticsDashboard />;
      case 'order-tracking':
        return <OrderTrackingPage />;
      case 'admin-dash':
        return <AdminDashboard />;
      case 'how-it-works':
        return <HowItWorksPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="light-mode min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage.message}</span>
        </div>
      )}

      <div>
        <Navbar />
        <main>
          {renderView()}
        </main>
      </div>

      <Footer />
      <DemoGuideModal />
      <AuthModal />
      <MiddlemenEliminationModal />
      <EscrowSettlementModal />
      <BuyerPaymentModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
