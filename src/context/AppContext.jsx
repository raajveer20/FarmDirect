import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts, initialOrders, aiDemandForecasts, routeOptimizationData, impactStats } from '../data/mockData';
import confetti from 'canvas-confetti';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Saved state from localStorage if available
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('farmdirect_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('farmdirect_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [userRole, setUserRole] = useState('Guest'); // 'Farmer' | 'Buyer' | 'Logistics' | 'Admin' | 'Guest'
  const [userProfile, setUserProfile] = useState({
    name: 'Ramesh Patel',
    role: 'Farmer / FPO Lead',
    location: 'Bhopal, MP',
    phone: '+91 98765 43210',
    fpoName: 'ABC Farmers Producer Organization'
  });

  const [activeView, setActiveView] = useState('home'); // 'home' | 'marketplace' | 'product-detail' | 'farmer-dash' | 'add-produce' | 'ai-demand' | 'route-opt' | 'buyer-dash' | 'logistics-dash' | 'order-tracking' | 'admin-dash' | 'how-it-works'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [trackedOrderId, setTrackedOrderId] = useState('FD1024');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [isOrganicOnly, setIsOrganicOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(200);

  // Cart State
  const [cart, setCart] = useState([]);
  
  // Interactive UI Modals & Toasts
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState(false);
  const [demoStep, setDemoStep] = useState(1);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync products and orders to localStorage
  useEffect(() => {
    localStorage.setItem('farmdirect_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('farmdirect_orders', JSON.stringify(orders));
  }, [orders]);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const switchRole = (role) => {
    setUserRole(role);
    showToast(`Switched view to ${role} perspective`);
    if (role === 'Farmer') {
      setActiveView('farmer-dash');
    } else if (role === 'Buyer') {
      setActiveView('buyer-dash');
    } else if (role === 'Logistics') {
      setActiveView('logistics-dash');
    } else if (role === 'Admin') {
      setActiveView('admin-dash');
    }
  };

  const navigateTo = (view, product = null) => {
    setActiveView(view);
    if (product) setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add new produce listing (Farmer Action)
  const addProduce = (newProduct) => {
    const createdItem = {
      id: `prod-${Date.now()}`,
      ...newProduct,
      farmer: userProfile.fpoName || "Ramesh Patel (Farmer)",
      farmerContact: userProfile.phone,
      farmerRating: 4.9,
      farmerLocation: userProfile.location,
      state: "Madhya Pradesh",
      distanceKm: 8.5,
      estimatedDelivery: "Same Day (4 Hours)",
      traditionalPrice: Math.round(Number(newProduct.pricePerKg) * 1.7),
      consumerPrice: Math.round(Number(newProduct.pricePerKg) * 1.2),
      image: newProduct.image || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80"
    };

    setProducts(prev => [createdItem, ...prev]);
    showToast(`Successfully listed ${createdItem.name} at ₹${createdItem.pricePerKg}/kg!`);
    
    // Auto update demo step if active
    if (demoStep === 2) {
      setDemoStep(3);
    }
  };

  // Cart operations
  const addToCart = (product, qty = 10) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, qty: item.qty + Number(qty) }
            : item
        );
      }
      return [...prev, { product, qty: Number(qty) }];
    });
    showToast(`Added ${qty} kg of ${product.name} to cart`);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQty = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, qty: Number(newQty) } : item
    ));
  };

  const clearCart = () => setCart([]);

  // Place order (Buyer Action - completes portion of demo flow)
  const placeOrder = (deliveryAddress = "102 Royal Palm Enclave, Bhopal MP") => {
    if (cart.length === 0) return;

    const newOrders = cart.map((cartItem, idx) => {
      const totalAmt = cartItem.product.pricePerKg * cartItem.qty;
      const traditionalTotal = cartItem.product.traditionalPrice * cartItem.qty;
      const saved = traditionalTotal - totalAmt;
      const orderId = `FD${1025 + orders.length + idx}`;

      return {
        id: orderId,
        productName: cartItem.product.name,
        farmerName: cartItem.product.farmer,
        buyerName: "Rahul Sharma (Buyer)",
        quantity: cartItem.qty,
        unit: cartItem.product.unit || "kg",
        totalPrice: totalAmt,
        savedAmount: Math.max(saved, 150),
        orderDate: new Date().toLocaleString(),
        deliveryAddress,
        status: "Order Placed",
        currentStep: 1,
        trackingSteps: [
          { title: "Order Placed", time: "Just now", completed: true, current: true },
          { title: "Farmer Confirmed", time: "Pending", completed: false },
          { title: "Produce Packed", time: "Pending", completed: false },
          { title: "Picked Up", time: "Pending", completed: false },
          { title: "In Transit", time: "Pending", completed: false },
          { title: "Delivered", time: "Est. 2 Hours", completed: false }
        ],
        driver: {
          name: "Rajesh Kumar",
          phone: "+91 98930 11223",
          vehicle: "Tata Ace EV (MP-04-FD-2024)",
          capacity: "850 kg / 1000 kg"
        }
      };
    });

    setOrders(prev => [...newOrders, ...prev]);
    const firstId = newOrders[0].id;
    setTrackedOrderId(firstId);
    clearCart();

    // Trigger visual confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti triggered');
    }

    showToast(`Order #${firstId} placed successfully! You saved direct middleman costs.`);
    navigateTo('order-tracking');

    if (demoStep === 4) {
      setDemoStep(5);
    }
  };

  // Logistics Accept Delivery Action
  const acceptDelivery = (orderId) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status: "In Transit",
          currentStep: 4,
          trackingSteps: ord.trackingSteps.map((step, idx) => ({
            ...step,
            completed: idx <= 4,
            current: idx === 4,
            time: idx <= 4 ? (step.time === "Pending" ? "Confirmed" : step.time) : step.time
          }))
        };
      }
      return ord;
    }));
    showToast(`Delivery route accepted for Order #${orderId}`);
  };

  // Step demo scenario helper
  const triggerDemoScenario = () => {
    setIsDemoGuideOpen(true);
    setDemoStep(1);
  };

  return (
    <AppContext.Provider value={{
      products,
      orders,
      userRole,
      userProfile,
      activeView,
      selectedProduct,
      trackedOrderId,
      searchQuery,
      selectedCategory,
      selectedGrade,
      isOrganicOnly,
      maxPrice,
      cart,
      isAuthModalOpen,
      isDemoGuideOpen,
      demoStep,
      toastMessage,
      aiDemandForecasts,
      routeOptimizationData,
      impactStats,
      switchRole,
      navigateTo,
      addProduce,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      placeOrder,
      acceptDelivery,
      setTrackedOrderId,
      setSearchQuery,
      setSelectedCategory,
      setSelectedGrade,
      setIsOrganicOnly,
      setMaxPrice,
      setIsAuthModalOpen,
      setIsDemoGuideOpen,
      setDemoStep,
      triggerDemoScenario,
      showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
