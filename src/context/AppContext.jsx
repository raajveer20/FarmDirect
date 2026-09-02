import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { initialProducts, initialOrders, aiDemandForecasts, routeOptimizationData, impactStats, resolveLocationCoordinates, generateInterpolatedRoute } from '../data/mockData';
import { translations, entityTranslations } from '../data/translations';
import { RealtimeSync } from '../utils/realtimeSync';
import confetti from 'canvas-confetti';

const AppContext = createContext();

const API_BASE = '/api';

// Realistic Indian Agricultural Mandi Economics Calculator
export const calculateMiddlemenBreakdown = (product, qty = 10) => {
  if (!product) return null;
  const quantity = Math.max(1, Number(qty) || 10);
  const farmDirectPrice = product.pricePerKg || 25; // Farmer receives directly
  const traditionalRetailPrice = product.traditionalPrice || Math.round(farmDirectPrice * 1.65); // Consumer pays in conventional mandi/retail
  const consumerPrice = product.consumerPrice || Math.round(farmDirectPrice * 1.18); // Consumer pays on FarmDirect

  // Traditional Mandi Rupee Distribution (per kg)
  // In traditional mandis, farmers only receive ~32-35% of the consumer rupee
  const tradFarmerReceived = Math.max(1, Math.round(traditionalRetailPrice * 0.35));
  const tradVillageBroker = Math.max(1, Math.round(traditionalRetailPrice * 0.12));
  const tradApmcAgent = Math.max(1, Math.round(traditionalRetailPrice * 0.10));
  const tradWholesaler = Math.max(2, Math.round(traditionalRetailPrice * 0.16));
  const tradRetailer = Math.max(3, traditionalRetailPrice - tradFarmerReceived - tradVillageBroker - tradApmcAgent - tradWholesaler);
  const tradMiddlemenTotal = traditionalRetailPrice - tradFarmerReceived;

  // FarmDirect Transparent Rupee Distribution (per kg)
  const fdFarmerReceived = farmDirectPrice;
  const fdPlatformFee = 1;
  const fdLogisticsFee = Math.max(2, consumerPrice - farmDirectPrice - fdPlatformFee);
  const fdMiddlemenFee = 0; // 100% eliminated!

  // Aggregated Impact for the specified Quantity
  const totalTraditionalCost = traditionalRetailPrice * quantity;
  const totalFarmDirectCost = consumerPrice * quantity;
  const totalBuyerSavings = totalTraditionalCost - totalFarmDirectCost;
  const buyerSavingsPercent = Math.round((totalBuyerSavings / totalTraditionalCost) * 100);

  const totalFarmerTraditional = tradFarmerReceived * quantity;
  const totalFarmerFarmDirect = fdFarmerReceived * quantity;
  const totalFarmerExtraGain = totalFarmerFarmDirect - totalFarmerTraditional;
  const farmerGainPercent = Math.round((totalFarmerExtraGain / totalFarmerTraditional) * 100);

  const totalMiddlemenMarginCut = Math.max(0, (tradMiddlemenTotal - (fdLogisticsFee + fdPlatformFee))) * quantity;
  const transitLossPreventedKg = Math.max(1, Math.round(quantity * 0.18)); // ~18% post-harvest spoilage saved

  return {
    cropName: product.name,
    category: product.category,
    image: product.image,
    quantity,
    perKg: {
      traditionalRetailPrice,
      consumerPrice,
      farmDirectPrice,
      tradFarmerReceived,
      tradVillageBroker,
      tradApmcAgent,
      tradWholesaler,
      tradRetailer,
      tradMiddlemenTotal,
      fdFarmerReceived,
      fdLogisticsFee,
      fdPlatformFee,
      fdMiddlemenFee,
      buyerSavingsPerKg: traditionalRetailPrice - consumerPrice,
      farmerExtraPerKg: fdFarmerReceived - tradFarmerReceived,
    },
    totals: {
      totalTraditionalCost,
      totalFarmDirectCost,
      totalBuyerSavings,
      buyerSavingsPercent,
      totalFarmerTraditional,
      totalFarmerFarmDirect,
      totalFarmerExtraGain,
      farmerGainPercent,
      totalMiddlemenMarginCut,
      transitLossPreventedKg,
    }
  };
};

const DEFAULT_DEMO_USERS = {
  Farmer: {
    name: 'Kisan Demo (Guest Preview)',
    email: 'preview.demo@farmdirect.in',
    phone: '+91 00000 00000',
    role: 'Farmer',
    location: 'Agricultural Demo Zone',
    fpoName: 'Demo Agricultural Cooperative',
    verificationStatus: 'UNVERIFIED_DEMO',
    verificationMethod: 'DEMO_PREVIEW',
    verificationDocNumber: 'DEMO-PREVIEW-000',
    landSizeAcres: 2.0,
    primaryCrops: 'Sample Produce (Demo)',
    bankUpiId: 'demo.farmer@upi',
    isLoggedIn: false
  },
  Buyer: {
    name: 'Pooja Agarwal',
    email: 'pooja.buyer@greengrocers.in',
    phone: '+91 98230 45678',
    role: 'Buyer',
    location: 'Indore, Madhya Pradesh',
    buyerType: 'B2B_WHOLESALE',
    businessName: 'FreshBasket Supermarkets Ltd.',
    gstin: '23AABCF1234M1Z5',
    isLoggedIn: true
  },
  Logistics: {
    name: 'Gurpreet Singh',
    email: 'admin.fleet@farmdirect.in',
    phone: '+91 98112 33445',
    role: 'Logistics / Admin',
    location: 'Bhopal Hub & Agri Command',
    vehicleType: 'TRUCK_3T',
    vehicleRcNumber: 'MP-04-FD-2024',
    vehicleCapacityTons: 3.5,
    adminId: 'ADM-8821',
    isLoggedIn: true
  },
  Admin: {
    name: 'Gurpreet Singh',
    email: 'admin.fleet@farmdirect.in',
    phone: '+91 98112 33445',
    role: 'Logistics / Admin',
    location: 'Bhopal Hub & Agri Command',
    vehicleType: 'TRUCK_3T',
    vehicleRcNumber: 'MP-04-FD-2024',
    vehicleCapacityTons: 3.5,
    adminId: 'ADM-8821',
    isLoggedIn: true
  },
  'Logistics / Admin': {
    name: 'Gurpreet Singh',
    email: 'admin.fleet@farmdirect.in',
    phone: '+91 98112 33445',
    role: 'Logistics / Admin',
    location: 'Bhopal Hub & Agri Command',
    vehicleType: 'TRUCK_3T',
    vehicleRcNumber: 'MP-04-FD-2024',
    vehicleCapacityTons: 3.5,
    adminId: 'ADM-8821',
    isLoggedIn: true
  }
};

export const AppProvider = ({ children }) => {
  // Saved products and orders (Starts completely clean - only real listings created by logged-in farmers appear)
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('farmdirect_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out dummy mock products, keeping only real listings
          return parsed.filter(p => p.id && !p.id.match(/^prod-[1-8]$/));
        }
      } catch (e) {}
    }
    return [];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('farmdirect_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        let list = parsed.map(ord => {
          const matched = initialOrders.find(io => io.id === ord.id);
          const defaultImg = ord.productName?.toLowerCase().includes('orange')
            ? '/images/oranges.jpg'
            : (matched?.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80');

          if (ord.origin && ord.destination && ord.routePoints) {
            return { ...ord, image: ord.image || defaultImg };
          }
          if (matched) {
            return { 
              ...matched, 
              ...ord, 
              image: ord.image || matched.image || defaultImg,
              origin: matched.origin, 
              destination: matched.destination, 
              routePoints: matched.routePoints, 
              telemetry: matched.telemetry 
            };
          }
          const originCoord = resolveLocationCoordinates(ord.farmerLocation || 'Bhopal');
          const destCoord = resolveLocationCoordinates(ord.deliveryAddress || 'MP Nagar, Bhopal');
          return {
            ...ord,
            image: ord.image || defaultImg,
            origin: {
              title: "Order Placed At (Farm Origin)",
              name: ord.farmerName || "Local Farm Producer",
              farmLocation: ord.farmerLocation || "Farm Direct Hub, Bhopal",
              address: `${originCoord.label}, MP`,
              lat: originCoord.lat,
              lng: originCoord.lng,
              contact: "+91 98765 43210",
              placedAt: ord.orderDate || "Today"
            },
            destination: {
              title: "Delivery Destination",
              name: ord.buyerName || "Buyer Location",
              address: ord.deliveryAddress || `${destCoord.label}, MP`,
              lat: destCoord.lat,
              lng: destCoord.lng,
              contact: "+91 98230 45678",
              estArrival: "Within 2 Hours"
            },
            routePoints: generateInterpolatedRoute(originCoord, destCoord, 5),
            telemetry: {
              currentLat: originCoord.lat,
              currentLng: originCoord.lng,
              currentCheckpoint: "Pickup Dispatched",
              speed: "35 km/h",
              temp: "4°C Cold Storage",
              distanceTotalKm: 14.0,
              distanceRemainingKm: 14.0,
              etaMinutes: 40,
              progressPercent: 10,
              co2SavedKg: 2.1
            }
          };
        });

        // Ensure FD1025 (Oranges) is present in the orders list
        if (!list.some(o => o.id === 'FD1025')) {
          const orangeOrder = initialOrders.find(io => io.id === 'FD1025');
          if (orangeOrder) list.push(orangeOrder);
        }
        return list;
      } catch (e) {}
    }
    return initialOrders;
  });

  // Current authenticated user
  // Current authenticated user (null by default before login, enabling guest marketplace preview)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('farmdirect_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isLoggedIn) return parsed;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [userRole, setUserRole] = useState(() => {
    const savedProfile = localStorage.getItem('farmdirect_user_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed && parsed.isLoggedIn && parsed.role) return parsed.role;
      } catch (e) {}
    }
    const savedRole = localStorage.getItem('farmdirect_role');
    return savedRole || 'Guest';
  });

  // Stores produce user clicked 'Add to Cart' on before registering as a Buyer
  const [pendingCartItem, setPendingCartItem] = useState(null);

  const [activeView, setActiveView] = useState('home');
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
  const [authGateway, setAuthGateway] = useState('Farmer'); // 'Farmer' | 'Buyer' | 'Logistics'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'otp'
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState(false);
  const [demoStep, setDemoStep] = useState(1);
  const [toastMessage, setToastMessage] = useState(null);

  // Middlemen Elimination Calculator Modal State
  const [isMiddlemenModalOpen, setIsMiddlemenModalOpen] = useState(false);
  const [selectedBreakdownCrop, setSelectedBreakdownCrop] = useState(null);

  // Escrow Settlement & Proof-of-Delivery Handover Modal State
  const [isEscrowModalOpen, setIsEscrowModalOpen] = useState(false);
  const [escrowModalData, setEscrowModalData] = useState({
    order: null,
    mode: 'scan', // 'scan' | 'qr' | 'receipt'
    receipt: null
  });

  // Buyer Payment Gateway Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [pendingCheckoutData, setPendingCheckoutData] = useState(null);

  const openPaymentModal = (checkoutPayload) => {
    setPendingCheckoutData(checkoutPayload);
    setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  const [farmerEarnings, setFarmerEarnings] = useState(() => {
    const saved = localStorage.getItem('farmdirect_farmer_earnings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      totalSettled: 124500,
      inEscrow: 18400,
      middlemanSaved: 22410
    };
  });

  const [payoutHistory, setPayoutHistory] = useState(() => {
    const saved = localStorage.getItem('farmdirect_payouts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'PAY-1001',
        orderId: 'FD1020',
        utr: 'UPI/NPCI/2026/082811409',
        farmerName: 'Ramesh Patel',
        farmerUpi: 'ramesh.patel@okhdfcbank',
        cropName: 'Malwa Sharbati Wheat (500 kg)',
        amount: 22000,
        zeroMiddlemenDeduction: 0,
        settledAt: 'Aug 28, 2026, 04:15 PM',
        status: 'SUCCESSFUL_SETTLED',
        bankName: 'HDFC Bank Ltd.',
        buyerName: 'Pooja Agarwal (Wholesale)'
      },
      {
        id: 'PAY-1002',
        orderId: 'FD1021',
        utr: 'UPI/NPCI/2026/083074211',
        farmerName: 'Vidarbha Citrus Growers',
        farmerUpi: 'vidarbha.citrus@sbi',
        cropName: 'Organic Nagpur Sweet Oranges (200 kg)',
        amount: 9600,
        zeroMiddlemenDeduction: 0,
        settledAt: 'Aug 30, 2026, 02:45 PM',
        status: 'SUCCESSFUL_SETTLED',
        bankName: 'State Bank of India',
        buyerName: 'Green Valley Supermarket'
      },
      {
        id: 'PAY-1003',
        orderId: 'FD1023',
        utr: 'UPI/NPCI/2026/090155230',
        farmerName: 'Sahyadri Farmer Co-op',
        farmerUpi: 'sahyadri.fpo@sbi',
        cropName: 'Fresh Nashik Red Onions (350 kg)',
        amount: 9800,
        zeroMiddlemenDeduction: 0,
        settledAt: 'Sep 01, 2026, 11:10 AM',
        status: 'SUCCESSFUL_SETTLED',
        bankName: 'State Bank of India',
        buyerName: 'Annapurna Institutional Kitchen'
      }
    ];
  });

  // Localization Engine State (en / hi)
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('farmdirect_lang') || 'en';
  });

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = (key, fallback = '') => {
    if (!key) return '';
    return (
      translations[language]?.[key] ||
      entityTranslations[language]?.[key] ||
      translations['en']?.[key] ||
      fallback ||
      key
    );
  };

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('farmdirect_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('farmdirect_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('farmdirect_user_profile', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('farmdirect_user_profile');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('farmdirect_role', userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('farmdirect_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('farmdirect_farmer_earnings', JSON.stringify(farmerEarnings));
  }, [farmerEarnings]);

  useEffect(() => {
    localStorage.setItem('farmdirect_payouts', JSON.stringify(payoutHistory));
  }, [payoutHistory]);

  const realtimeSyncRef = useRef(null);

  // Connect to PostgreSQL Backend API & Real-Time Sync Engine
  useEffect(() => {
    // 1. Initial hydration from PostgreSQL
    async function hydrateFromPostgres() {
      try {
        const prodRes = await fetch('/api/products');
        if (prodRes.ok) {
          const prods = await prodRes.json();
          if (Array.isArray(prods)) {
            setProducts(prods);
          }
        }

        const ordRes = await fetch('/api/orders');
        if (ordRes.ok) {
          const ords = await ordRes.json();
          if (Array.isArray(ords) && ords.length > 0) {
            setOrders(ords);
          }
        }

        const payRes = await fetch('/api/payouts');
        if (payRes.ok) {
          const pays = await payRes.json();
          if (Array.isArray(pays) && pays.length > 0) {
            setPayoutHistory(pays);
          }
        }
      } catch (e) {
        console.warn('PostgreSQL API offline or using local cache:', e);
      }
    }

    hydrateFromPostgres();

    // 2. Real-Time Cross-Laptop & Cross-Tab Sync
    const sync = new RealtimeSync({
      onProduceAdded: (newProd) => {
        setProducts(prev => {
          if (prev.some(p => p.id === newProd.id)) return prev;
          return [newProd, ...prev];
        });
        showToast(`🌱 New Produce Listed: ${newProd.name} by ${newProd.farmer || 'Farmer'}!`, 'info');
      },
      onOrderPlaced: (newOrder) => {
        setOrders(prev => {
          if (prev.some(o => o.id === newOrder.id)) return prev;
          return [newOrder, ...prev];
        });
        setFarmerEarnings(prev => ({
          ...prev,
          inEscrow: prev.inEscrow + (newOrder.totalPrice || 0)
        }));
        showToast(`🔔 New Order Received: ${newOrder.quantity} ${newOrder.unit || 'kg'} of ${newOrder.productName}!`, 'success');
      },
      onOrderUpdated: (updatedOrder) => {
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o));
      },
      onPayoutSettled: (newPayout) => {
        setPayoutHistory(prev => {
          if (prev.some(p => p.id === newPayout.id || p.utr === newPayout.utr)) return prev;
          return [newPayout, ...prev];
        });
        setFarmerEarnings(prev => ({
          ...prev,
          totalSettled: prev.totalSettled + (newPayout.amount || 0),
          inEscrow: Math.max(0, prev.inEscrow - (newPayout.amount || 0))
        }));
        showToast(`💰 Instant UPI Payout Credited: ₹${newPayout.amount?.toLocaleString()}!`, 'success');
      }
    });

    realtimeSyncRef.current = sync;

    return () => {
      sync.destroy();
    };
  }, []);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const authenticateUser = (profile, role) => {
    const rawRole = role || profile?.role || 'Farmer';
    const normalizedRole = rawRole.toLowerCase().startsWith('farmer') 
      ? 'Farmer' 
      : rawRole.toLowerCase().startsWith('buyer') 
        ? 'Buyer' 
        : 'Logistics / Admin';

    const finalProfile = {
      ...profile,
      role: normalizedRole,
      isLoggedIn: true
    };

    setCurrentUser(finalProfile);
    setUserRole(normalizedRole);
    try {
      localStorage.setItem('farmdirect_user_profile', JSON.stringify(finalProfile));
      localStorage.setItem('farmdirect_role', normalizedRole);
    } catch (e) {}

    if (normalizedRole === 'Farmer') {
      setActiveView('farmer-dash');
    } else if (normalizedRole === 'Buyer') {
      setActiveView('buyer-dash');
    } else {
      setActiveView('admin-dash');
    }
  };

  const switchRole = (role) => {
    // If a user is already authenticated, prevent gateway hopping without logging out first
    if (currentUser && currentUser.isLoggedIn) {
      showToast(`Active ${userRole} session locked. Please logout to change gateways.`, 'info');
      return;
    }
    const targetRole = (role === 'Logistics' || role === 'Admin' || role === 'Logistics / Admin')
      ? 'Logistics / Admin'
      : role;
    setUserRole(targetRole);
    if (DEFAULT_DEMO_USERS[targetRole]) {
      setCurrentUser(DEFAULT_DEMO_USERS[targetRole]);
    } else if (DEFAULT_DEMO_USERS[role]) {
      setCurrentUser(DEFAULT_DEMO_USERS[role]);
    }
    showToast(`Switched view to ${targetRole} perspective`);
    if (targetRole === 'Farmer') {
      setActiveView('farmer-dash');
    } else if (targetRole === 'Buyer') {
      setActiveView('buyer-dash');
    } else {
      setActiveView('admin-dash');
    }
  };

  const navigateTo = (view, product = null) => {
    let targetView = view;
    const effectiveRole = (currentUser?.role || userRole || '').toLowerCase();
    const isFarmer = effectiveRole.includes('farmer');
    const isBuyer = effectiveRole.includes('buyer');
    const isLogistics = effectiveRole.includes('logistics') || effectiveRole.includes('admin');

    // The home feature and other gateway portals are strictly locked after login
    if (currentUser && currentUser.isLoggedIn) {
      if (view === 'home') {
        if (isFarmer) targetView = 'farmer-dash';
        else if (isBuyer) targetView = 'buyer-dash';
        else targetView = 'admin-dash';
      }

      // Strictly lock gateway boundaries
      if (isFarmer) {
        if (view === 'buyer-dash' || view === 'admin-dash' || view === 'logistics-dash') {
          showToast('Portal restricted: Active Farmer session. Please logout to change gateways.', 'info');
          targetView = 'farmer-dash';
        }
      } else if (isBuyer) {
        if (view === 'farmer-dash' || view === 'add-produce' || view === 'admin-dash' || view === 'logistics-dash') {
          showToast('Portal restricted: Active Buyer session. Please logout to change gateways.', 'info');
          targetView = 'buyer-dash';
        }
      } else if (isLogistics) {
        if (view === 'farmer-dash' || view === 'add-produce' || view === 'buyer-dash') {
          showToast('Portal restricted: Active Logistics session. Please logout to change gateways.', 'info');
          targetView = 'admin-dash';
        }
      }
    }
    setActiveView(targetView);
    if (product) setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAuthModal = (gateway = 'Farmer', mode = 'login') => {
    setAuthGateway(gateway);
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const openMiddlemenModal = (crop = null) => {
    if (crop) {
      setSelectedBreakdownCrop(crop);
    } else if (!selectedBreakdownCrop && products.length > 0) {
      setSelectedBreakdownCrop(products[0]);
    }
    setIsMiddlemenModalOpen(true);
  };

  // Quick 1-Click Persona Login
  const quickDemoLogin = (role) => {
    const targetRole = (role === 'Logistics' || role === 'Admin' || role === 'Logistics / Admin')
      ? 'Logistics / Admin'
      : role;
    const profile = DEFAULT_DEMO_USERS[targetRole] || DEFAULT_DEMO_USERS[role] || DEFAULT_DEMO_USERS.Farmer;
    setCurrentUser(profile);
    setUserRole(targetRole);
    localStorage.setItem('farmdirect_token', `demo-token-${targetRole.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`);
    localStorage.setItem('farmdirect_role', targetRole);
    localStorage.setItem('farmdirect_user_profile', JSON.stringify(profile));
    setIsAuthModalOpen(false);

    // If there was a pending cart item waiting for Buyer registration
    if (targetRole === 'Buyer' && pendingCartItem) {
      const itemToAdd = pendingCartItem;
      setPendingCartItem(null);
      setCart(prev => {
        const existing = prev.find(item => item.product.id === itemToAdd.product.id);
        if (existing) {
          return prev.map(item =>
            item.product.id === itemToAdd.product.id
              ? { ...item, qty: item.qty + itemToAdd.qty }
              : item
          );
        }
        return [...prev, { product: itemToAdd.product, qty: itemToAdd.qty }];
      });
      showToast(`Welcome ${profile.name}! Added ${itemToAdd.qty} kg of ${itemToAdd.product.name} to your cart.`);
      setActiveView('buyer-dash');
      return;
    }

    showToast(`Logged in as ${profile.name} (${targetRole})`);
    
    if (targetRole === 'Farmer') setActiveView('farmer-dash');
    else if (targetRole === 'Buyer') setActiveView('buyer-dash');
    else setActiveView('admin-dash');
  };

  // Logout - Returns to guest preview mode
  const logoutUser = () => {
    localStorage.removeItem('farmdirect_token');
    localStorage.removeItem('farmdirect_user_profile');
    localStorage.setItem('farmdirect_role', 'Guest');
    setCurrentUser(null);
    setUserRole('Guest');
    setCart([]);
    setPendingCartItem(null);
    showToast('Logged out successfully. Marketplace is now in preview mode.');
    navigateTo('marketplace');
  };

  // Update Farmer Verification
  const submitFarmerVerification = async (verificationData) => {
    const updated = {
      ...currentUser,
      ...verificationData,
      verificationStatus: 'VERIFIED_FARMER'
    };
    setCurrentUser(updated);

    // Try backend if token exists
    const token = localStorage.getItem('farmdirect_token');
    if (token) {
      try {
        await fetch(`${API_BASE}/auth/verify-farmer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(verificationData)
        });
      } catch (err) {
        console.warn('Backend offline, farmer verification saved locally');
      }
    }

    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}

    showToast('Farmer Profile & Land Verification verified successfully!', 'success');
  };

  // Add new produce listing (Farmer Action)
  const addProduce = async (newProduct) => {
    const createdItem = {
      id: `prod-${Date.now()}`,
      ...newProduct,
      farmer: currentUser?.fpoName || currentUser?.name || "Demo Farmer (Unauthenticated)",
      farmerContact: currentUser?.phone || "+91 00000 00000",
      farmerRating: 4.9,
      farmerLocation: currentUser?.location || "Bhopal, MP",
      state: "Madhya Pradesh",
      distanceKm: 8.5,
      estimatedDelivery: "Same Day (4 Hours)",
      traditionalPrice: Math.round(Number(newProduct.pricePerKg) * 1.7),
      consumerPrice: Math.round(Number(newProduct.pricePerKg) * 1.2),
      image: newProduct.image || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80"
    };

    setProducts(prev => [createdItem, ...prev]);

    // Persist to PostgreSQL backend & broadcast live
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createdItem)
      });
      realtimeSyncRef.current?.broadcast('PRODUCE_ADDED', createdItem);
    } catch (e) {}

    showToast(`Successfully listed ${createdItem.name} at ₹${createdItem.pricePerKg}/kg!`);
    
    if (demoStep === 2) {
      setDemoStep(3);
    }
  };

  // Cart operations (Enforcing minimum 10 kg for every product, consecutive 5 kg steps)
  const addToCart = (product, qty = 10) => {
    const rawQty = Number(qty);
    const validQty = Math.max(10, isNaN(rawQty) || rawQty <= 0 ? 10 : rawQty);

    // If user is not logged in as a Buyer (e.g. previewing marketplace before login)
    const isBuyer = currentUser && currentUser.isLoggedIn && userRole === 'Buyer';
    if (!isBuyer) {
      setPendingCartItem({ product, qty: validQty });
      showToast(`Please register as a Buyer to add ${product.name} to cart`, 'info');
      openAuthModal('Buyer', 'register');
      return false;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, qty: item.qty + validQty }
            : item
        );
      }
      return [...prev, { product, qty: validQty }];
    });
    showToast(`Added ${validQty} kg of ${product.name} to cart (Min. 10 kg)`);
    return true;
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQty = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    // Minimum cart quantity is 10 kg
    const safeQty = Math.max(10, Number(newQty));
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, qty: safeQty } : item
    ));
  };

  const clearCart = () => setCart([]);

  // Place order (Buyer Action with Escrow Payment Guarantee)
  const placeOrder = (deliveryAddress = "102 Royal Palm Enclave, Bhopal MP", paymentDetails = {}) => {
    if (cart.length === 0) return;

    const newOrders = cart.map((cartItem, idx) => {
      const totalAmt = cartItem.product.pricePerKg * cartItem.qty;
      const traditionalTotal = cartItem.product.traditionalPrice * cartItem.qty;
      const saved = traditionalTotal - totalAmt;
      const orderId = `FD${1025 + orders.length + idx}`;
      const originCoord = resolveLocationCoordinates(cartItem.product.farmerLocation || 'Bhopal');
      const destCoord = resolveLocationCoordinates(deliveryAddress);
      const routePoints = generateInterpolatedRoute(originCoord, destCoord, 6);
      const txnId = paymentDetails.txnId || `TXN-FD-UPI-${Math.floor(100000 + Math.random() * 900000)}`;

      return {
        id: orderId,
        productName: cartItem.product.name,
        productId: cartItem.product.id,
        image: cartItem.product.image || "/images/oranges.jpg",
        farmerName: cartItem.product.farmer,
        buyerName: currentUser?.name ? `${currentUser.name} (${currentUser.role})` : "Rahul Sharma (Buyer)",
        quantity: cartItem.qty,
        unit: cartItem.product.unit || "kg",
        totalPrice: totalAmt,
        savedAmount: Math.max(saved, 150),
        orderDate: new Date().toLocaleString(),
        deliveryAddress,
        status: "Order Placed & Escrow Funded",
        currentStep: 1,
        payment: {
          method: paymentDetails.method || "UPI Instant (Dynamic QR)",
          txnId,
          status: "ESCROW_LOCKED",
          amount: totalAmt,
          bankName: paymentDetails.bankName || "State Bank of India (Escrow Trust)",
          vpa: paymentDetails.vpa || "buyer@okhdfcbank"
        },
        origin: {
          title: "Order Placed At (Farm Origin)",
          name: cartItem.product.farmer,
          farmLocation: cartItem.product.farmerLocation || originCoord.label,
          address: `${cartItem.product.farmerLocation || originCoord.label}, Farm Gate #1`,
          lat: originCoord.lat,
          lng: originCoord.lng,
          contact: cartItem.product.farmerContact || "+91 98765 43210",
          placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          harvestDate: cartItem.product.harvestDate || "Fresh Harvest",
          qualityGrade: cartItem.product.qualityGrade || "Grade A",
          batchCode: `BATCH-${orderId}`
        },
        destination: {
          title: "Delivery Destination",
          name: currentUser?.name || "Rahul Sharma",
          address: deliveryAddress,
          lat: destCoord.lat,
          lng: destCoord.lng,
          contact: currentUser?.phone || "+91 98230 45678",
          instructions: "Contactless doorstep fresh delivery",
          estArrival: "Est. in 2 Hours (Direct Express)"
        },
        routePoints,
        telemetry: {
          currentLat: originCoord.lat,
          currentLng: originCoord.lng,
          currentCheckpoint: "Order Placed at Farm",
          speed: "0 km/h (Preparing)",
          temp: "4°C Cold Storage",
          distanceTotalKm: cartItem.product.distanceKm || 12.5,
          distanceRemainingKm: cartItem.product.distanceKm || 12.5,
          etaMinutes: 60,
          progressPercent: 5,
          co2SavedKg: 2.1
        },
        trackingSteps: [
          { title: "Order Placed", time: "Just now", completed: true, current: true, detail: `Order placed at ${cartItem.product.farmer}` },
          { title: "Farmer Confirmed", time: "Pending", completed: false, detail: "Farmer prepping fresh harvest" },
          { title: "Produce Packed", time: "Pending", completed: false, detail: "Quality grading & crate tagging" },
          { title: "Picked Up", time: "Pending", completed: false, detail: "EV Cargo loading" },
          { title: "In Transit", time: "Pending", completed: false, detail: "Route optimization corridor" },
          { title: "Delivered", time: "Est. 2 Hours", completed: false, detail: `Deliver to ${deliveryAddress}` }
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
    setIsPaymentModalOpen(false);
    setPendingCheckoutData(null);

    // Persist orders to PostgreSQL backend & broadcast live
    for (const ord of newOrders) {
      try {
        fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ord)
        });
        realtimeSyncRef.current?.broadcast('ORDER_PLACED', ord);
      } catch (e) {}
    }

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    showToast(`Order #${firstId} placed! Payment locked securely in Escrow Trust.`, 'success');
    navigateTo('buyer-dash');

    if (demoStep === 4) {
      setDemoStep(5);
    }
  };

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

  const updateOrderStatus = async (orderId, newStatus, currentStep = 3) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status: newStatus,
          currentStep,
          trackingSteps: ord.trackingSteps ? ord.trackingSteps.map((s, idx) => ({
            ...s,
            completed: idx < currentStep,
            current: idx === currentStep - 1,
            time: idx < currentStep ? (s.time === "Pending" ? "Confirmed" : s.time) : s.time
          })) : []
        };
      }
      return ord;
    }));

    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, currentStep })
      });
      realtimeSyncRef.current?.broadcast('ORDER_UPDATED', { id: orderId, status: newStatus, currentStep });
    } catch (e) {}

    showToast(`Order #${orderId}: ${newStatus}`, 'success');
  };

  const openEscrowModal = (order = null, mode = 'scan') => {
    const targetOrder = order || orders.find(o => o.id === trackedOrderId) || orders[0];
    const existingPayout = payoutHistory.find(p => p.orderId === targetOrder?.id);
    setEscrowModalData({
      order: targetOrder,
      mode: existingPayout ? 'receipt' : mode,
      receipt: existingPayout || null
    });
    setIsEscrowModalOpen(true);
  };

  const closeEscrowModal = () => {
    setIsEscrowModalOpen(false);
  };

  const settleEscrowHandover = (orderId, _otp = '2026') => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    const payoutAmount = targetOrder.totalPrice || 4800;
    const utr = `UPI/NPCI/2026/0902${Math.floor(100000 + Math.random() * 900000)}`;
    const newReceipt = {
      id: `PAY-${Date.now().toString().slice(-4)}`,
      orderId: targetOrder.id,
      utr,
      farmerName: targetOrder.farmerName || targetOrder.origin?.name || 'Demo Farmer',
      farmerUpi: targetOrder.farmerUpi || 'demo.farmer@upi',
      cropName: `${targetOrder.productName} (${targetOrder.quantity} ${targetOrder.unit || 'kg'})`,
      amount: payoutAmount,
      zeroMiddlemenDeduction: 0,
      settledAt: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      status: 'SUCCESSFUL_SETTLED',
      bankName: 'State Bank of India',
      buyerName: targetOrder.buyerName || 'Rahul Sharma'
    };

    // 1. Update Order Status
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status: "Delivered & Escrow Settled",
          currentStep: 6,
          deliveredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          utrNumber: utr,
          escrowSettled: true,
          trackingSteps: ord.trackingSteps ? ord.trackingSteps.map(step => ({
            ...step,
            completed: true,
            current: false,
            time: step.time === "Pending" ? "Confirmed" : step.time
          })) : []
        };
      }
      return ord;
    }));

    // 2. Add to Payout History
    setPayoutHistory(prev => [newReceipt, ...prev]);

    // 3. Update Farmer Earnings
    setFarmerEarnings(prev => ({
      totalSettled: prev.totalSettled + payoutAmount,
      inEscrow: Math.max(0, prev.inEscrow - payoutAmount),
      middlemanSaved: prev.middlemanSaved + Math.round(payoutAmount * 0.28)
    }));

    // 4. Update modal to receipt view
    setEscrowModalData({
      order: {
        ...targetOrder,
        status: "Delivered & Escrow Settled"
      },
      mode: 'receipt',
      receipt: newReceipt
    });

    // Persist to PostgreSQL backend & broadcast live
    try {
      fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: "Delivered & Escrow Settled",
          currentStep: 6,
          utrNumber: utr,
          escrowSettled: true
        })
      });
      fetch('/api/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReceipt)
      });
      realtimeSyncRef.current?.broadcast('ORDER_UPDATED', {
        id: orderId,
        status: "Delivered & Escrow Settled",
        currentStep: 6,
        utrNumber: utr,
        escrowSettled: true
      });
      realtimeSyncRef.current?.broadcast('PAYOUT_SETTLED', newReceipt);
    } catch (e) {}

    // 5. Visual Confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    showToast(`Escrow Handover Confirmed! ₹${payoutAmount.toLocaleString()} credited to Farmer via UPI.`, 'success');
  };

  const triggerDemoScenario = () => {
    setIsDemoGuideOpen(true);
    setDemoStep(1);
  };

  return (
    <AppContext.Provider value={{
      products,
      orders,
      userRole,
      currentUser,
      setCurrentUser,
      activeView,
      selectedProduct,
      trackedOrderId,
      searchQuery,
      selectedCategory,
      selectedGrade,
      isOrganicOnly,
      maxPrice,
      cart,
      setCart,
      pendingCartItem,
      setPendingCartItem,
      isAuthModalOpen,
      authGateway,
      setAuthGateway,
      authMode,
      setAuthMode,
      openAuthModal,
      isDemoGuideOpen,
      demoStep,
      toastMessage,
      aiDemandForecasts,
      routeOptimizationData,
      impactStats,
      switchRole,
      authenticateUser,
      quickDemoLogin,
      logoutUser,
      submitFarmerVerification,
      navigateTo,
      addProduce,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      placeOrder,
      acceptDelivery,
      updateOrderStatus,
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
      showToast,
      isMiddlemenModalOpen,
      setIsMiddlemenModalOpen,
      selectedBreakdownCrop,
      setSelectedBreakdownCrop,
      openMiddlemenModal,
      calculateMiddlemenBreakdown,
      isEscrowModalOpen,
      setIsEscrowModalOpen,
      escrowModalData,
      setEscrowModalData,
      openEscrowModal,
      closeEscrowModal,
      settleEscrowHandover,
      isPaymentModalOpen,
      setIsPaymentModalOpen,
      pendingCheckoutData,
      openPaymentModal,
      closePaymentModal,
      farmerEarnings,
      payoutHistory,
      language,
      setLanguage,
      toggleLanguage,
      t
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
