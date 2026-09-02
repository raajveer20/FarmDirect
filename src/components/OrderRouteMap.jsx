import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Truck, 
  MapPin, 
  Play, 
  Pause, 
  RotateCcw, 
  Navigation, 
  Maximize2, 
  ShieldCheck, 
  Thermometer, 
  LocateFixed,
  Sprout,
  Compass,
  Map as MapIcon,
  Activity
} from 'lucide-react';

const TILE_LAYERS = {
  voyager: {
    name: 'Carto Voyager (Sleek Modern)',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO &copy; OpenStreetMap'
  },
  dark: {
    name: 'Carto Dark Matter (Night Mode)',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO &copy; OpenStreetMap'
  },
  light: {
    name: 'Carto Positron (Clean Light)',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO &copy; OpenStreetMap'
  }
};

export const OrderRouteMap = ({ order }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const routePolylineRef = useRef(null);
  const routeGlowRef = useRef(null);
  const originMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const vehicleMarkerRef = useRef(null);
  const progressRef = useRef(order?.telemetry?.progressPercent ? order.telemetry.progressPercent / 100 : 0.65);

  const [activeTileKey, setActiveTileKey] = useState('voyager');
  const [displayMode, setDisplayMode] = useState('map'); // 'map' | 'schematic'
  const [isPlaying, setIsPlaying] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(
    order?.telemetry?.progressPercent ? order.telemetry.progressPercent / 100 : 0.65
  );
  const [simSpeed, setSimSpeed] = useState(1);
  const [activeViewMode, setActiveViewMode] = useState('fit'); // 'fit' | 'origin' | 'dest' | 'driver'

  // Stable Memoized Locations & Coordinates
  const origin = useMemo(() => {
    return order?.origin || {
      title: 'Order Placed At (Farm Origin)',
      name: order?.farmerName || 'ABC Farmers Co-op',
      farmLocation: 'Raisen Road Agro Hub, East Bhopal',
      address: 'Kisan Organic Farm, Raisen Road, East Bhopal, MP 462021',
      lat: 23.2715,
      lng: 77.4690,
      contact: '+91 98765 43210',
      placedAt: order?.orderDate || 'Today, 14:30',
      qualityGrade: 'Grade A Certified Organic',
      batchCode: 'BATCH-892'
    };
  }, [order?.origin, order?.farmerName, order?.orderDate]);

  const destination = useMemo(() => {
    return order?.destination || {
      title: 'Delivery Destination',
      name: order?.buyerName || 'Buyer Location',
      address: order?.deliveryAddress || 'MP Nagar Zone 1, Bhopal, MP 462011',
      lat: 23.2329,
      lng: 77.4327,
      contact: '+91 98230 45678',
      instructions: 'Direct delivery to customer address',
      estArrival: '45 mins (Same Day)'
    };
  }, [order?.destination, order?.buyerName, order?.deliveryAddress]);

  const routePoints = useMemo(() => {
    if (order?.routePoints && order.routePoints.length >= 2) {
      return order.routePoints;
    }
    return [
      [origin.lat, origin.lng],
      [origin.lat - 0.015, origin.lng - 0.010],
      [origin.lat - 0.025, origin.lng - 0.020],
      [destination.lat, destination.lng]
    ];
  }, [order?.routePoints, origin.lat, origin.lng, destination.lat, destination.lng]);

  // Keep progressRef synced
  useEffect(() => {
    progressRef.current = simulationProgress;
  }, [simulationProgress]);

  // Interpolate position along route points
  const getInterpolatedPosition = useCallback((progress) => {
    if (!routePoints || routePoints.length < 2) {
      return [origin.lat, origin.lng];
    }
    const totalSegments = routePoints.length - 1;
    const scaledProgress = Math.max(0, Math.min(1, progress)) * totalSegments;
    const segmentIndex = Math.min(Math.floor(scaledProgress), totalSegments - 1);
    const segmentT = scaledProgress - segmentIndex;

    const p1 = routePoints[segmentIndex];
    const p2 = routePoints[segmentIndex + 1];

    const lat = p1[0] + (p2[0] - p1[0]) * segmentT;
    const lng = p1[1] + (p2[1] - p1[1]) * segmentT;
    return [lat, lng];
  }, [routePoints, origin.lat, origin.lng]);

  // Render or update route layers on a map instance
  const drawRouteLayers = useCallback((map) => {
    if (!map) return;

    if (routeGlowRef.current) map.removeLayer(routeGlowRef.current);
    if (routePolylineRef.current) map.removeLayer(routePolylineRef.current);
    if (originMarkerRef.current) map.removeLayer(originMarkerRef.current);
    if (destMarkerRef.current) map.removeLayer(destMarkerRef.current);
    if (vehicleMarkerRef.current) map.removeLayer(vehicleMarkerRef.current);

    // Custom Origin DivIcon
    const originIcon = L.divIcon({
      className: 'custom-map-marker-origin',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%);">
          <div style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: rgba(16, 185, 129, 0.3); animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
          <div style="width: 38px; height: 38px; border-radius: 12px; background: #059669; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(5, 150, 105, 0.4); border: 2.5px solid #ffffff; z-index: 10;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>
          </div>
          <div style="margin-top: 4px; background: #0f172a; color: #34d399; font-weight: 800; font-size: 10px; padding: 2px 8px; border-radius: 9999px; border: 1px solid rgba(16, 185, 129, 0.4); white-space: nowrap; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);">
            🌾 Order Placed At: Farm Origin
          </div>
        </div>
      `,
      iconSize: [40, 60],
      iconAnchor: [20, 30]
    });

    // Custom Destination DivIcon
    const destIcon = L.divIcon({
      className: 'custom-map-marker-dest',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%);">
          <div style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: rgba(2, 132, 199, 0.3); animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
          <div style="width: 38px; height: 38px; border-radius: 12px; background: #0284c7; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(2, 132, 199, 0.4); border: 2.5px solid #ffffff; z-index: 10;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div style="margin-top: 4px; background: #0f172a; color: #38bdf8; font-weight: 800; font-size: 10px; padding: 2px 8px; border-radius: 9999px; border: 1px solid rgba(56, 189, 248, 0.4); white-space: nowrap; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);">
            📍 Delivery Destination
          </div>
        </div>
      `,
      iconSize: [40, 60],
      iconAnchor: [20, 30]
    });

    // Custom Vehicle DivIcon
    const currentPos = getInterpolatedPosition(progressRef.current);
    const vehicleIcon = L.divIcon({
      className: 'custom-map-marker-vehicle',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%);">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: #0f172a; color: #10b981; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4); border: 2px solid #10b981; z-index: 12;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
          </div>
          <div style="margin-top: 3px; background: #0f172a; color: white; font-weight: 700; font-size: 9px; padding: 1px 6px; border-radius: 6px; border: 1px solid rgba(16, 185, 129, 0.5); white-space: nowrap;">
            ${order?.telemetry?.speed || '42 km/h'} • ${order?.telemetry?.temp || '4°C'}
          </div>
        </div>
      `,
      iconSize: [36, 50],
      iconAnchor: [18, 25]
    });

    // Add Route Polyline
    routeGlowRef.current = L.polyline(routePoints, {
      color: '#10b981',
      weight: 8,
      opacity: 0.3,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    routePolylineRef.current = L.polyline(routePoints, {
      color: '#059669',
      weight: 4,
      opacity: 0.95,
      dashArray: '8, 6',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Add Origin Marker
    const originProductImage = order?.image || (order?.productName?.toLowerCase().includes('orange') 
      ? '/images/oranges.jpg' 
      : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80');

    originMarkerRef.current = L.marker([origin.lat, origin.lng], { icon: originIcon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: inherit; min-width: 230px; padding: 2px;">
          <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px;">
            <img src="${originProductImage}" alt="${order?.productName || ''}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover; border: 1.5px solid #10b981; flex-shrink: 0;" />
            <div>
              <div style="color: #059669; font-weight: 800; font-size: 10px;">🌾 ORDER PLACED AT (FARM)</div>
              <div style="font-weight: 800; font-size: 13px; color: #0f172a; line-height: 1.2;">${origin.name}</div>
            </div>
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${origin.address}</div>
          <div style="font-size: 10px; color: #334155; margin-top: 6px; border-top: 1px solid #e2e8f0; padding-top: 4px;">
            <div>Produce: <strong style="color: #059669;">${order?.productName || 'Fresh Produce'}</strong></div>
            <div>Contact: <strong>${origin.contact}</strong></div>
            <div>Harvest: <strong>${origin.harvestDate || 'Fresh'}</strong></div>
          </div>
        </div>
      `);

    // Add Destination Marker
    destMarkerRef.current = L.marker([destination.lat, destination.lng], { icon: destIcon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: inherit; min-width: 210px; padding: 2px;">
          <div style="color: #0284c7; font-weight: 800; font-size: 11px; margin-bottom: 2px;">📍 DELIVERY DESTINATION</div>
          <div style="font-weight: 800; font-size: 13px; color: #0f172a;">${destination.name}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${destination.address}</div>
          <div style="font-size: 10px; color: #334155; margin-top: 6px; border-top: 1px solid #e2e8f0; padding-top: 4px;">
            <div>Contact: <strong>${destination.contact}</strong></div>
            <div>Arrival: <strong style="color: #0284c7;">${destination.estArrival}</strong></div>
          </div>
        </div>
      `);

    // Add Vehicle Marker
    vehicleMarkerRef.current = L.marker(currentPos, { icon: vehicleIcon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: inherit; min-width: 190px; padding: 2px;">
          <div style="color: #d97706; font-weight: 800; font-size: 11px; margin-bottom: 2px;">🚚 LIVE DELIVERY CARRIER</div>
          <div style="font-weight: 800; font-size: 13px; color: #0f172a;">${order?.driver?.vehicle || 'Tata Ace EV'}</div>
          <div style="font-size: 11px; color: #64748b;">Driver: ${order?.driver?.name || 'Rajesh Kumar'}</div>
          <div style="font-size: 10px; color: #334155; margin-top: 6px; border-top: 1px solid #e2e8f0; padding-top: 4px;">
            <div>Speed: <strong>${order?.telemetry?.speed || '42 km/h'}</strong></div>
            <div>Temp: <strong style="color: #059669;">${order?.telemetry?.temp || '4°C'}</strong></div>
          </div>
        </div>
      `);

    // Invalidate size & fit bounds smoothly
    map.invalidateSize();
    const bounds = L.latLngBounds(routePoints);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [routePoints, origin, destination, getInterpolatedPosition, order?.driver, order?.telemetry]);

  // 1. Initialize Map Instance Once on Mount
  useEffect(() => {
    if (displayMode !== 'map') return;
    const container = mapContainerRef.current;
    if (!container) return;

    if (container._leaflet_id) {
      delete container._leaflet_id;
    }

    try {
      const map = L.map(container, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true,
        fadeAnimation: true
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const tileCfg = TILE_LAYERS[activeTileKey] || TILE_LAYERS.voyager;
      const tileLayer = L.tileLayer(tileCfg.url, {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: tileCfg.attribution
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      mapInstanceRef.current = map;

      // Draw initial route layers
      drawRouteLayers(map);

      const timer = setTimeout(() => {
        if (map) {
          map.invalidateSize();
        }
      }, 150);

      const handleResize = () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      };
      window.addEventListener('resize', handleResize);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
        if (container) {
          delete container._leaflet_id;
        }
      };
    } catch (err) {
      console.warn('Leaflet init error:', err);
    }
  }, [displayMode]); // Runs when mounting or changing display mode

  // 2. Tile Layer Swapping without destroying map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || displayMode !== 'map') return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileCfg = TILE_LAYERS[activeTileKey] || TILE_LAYERS.voyager;
    tileLayerRef.current = L.tileLayer(tileCfg.url, {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution: tileCfg.attribution
    }).addTo(map);
  }, [activeTileKey, displayMode]);

  // 3. Update route layers when order changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || displayMode !== 'map') return;
    drawRouteLayers(map);
  }, [order?.id, drawRouteLayers, displayMode]);

  // 4. Update Vehicle Marker Position smoothly along the route (No layer redraw!)
  useEffect(() => {
    if (!vehicleMarkerRef.current || displayMode !== 'map') return;
    const newPos = getInterpolatedPosition(simulationProgress);
    vehicleMarkerRef.current.setLatLng(newPos);

    if (activeViewMode === 'driver' && mapInstanceRef.current) {
      mapInstanceRef.current.panTo(newPos, { animate: true });
    }
  }, [simulationProgress, activeViewMode, displayMode, getInterpolatedPosition]);

  // 5. Live Simulation Timer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSimulationProgress((prev) => {
        const step = 0.006 * simSpeed;
        if (prev >= 1.0) {
          setIsPlaying(false);
          return 1.0;
        }
        return Math.min(1.0, prev + step);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, simSpeed]);

  // Camera Actions
  const fitRouteBounds = () => {
    setActiveViewMode('fit');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize();
      const bounds = L.latLngBounds(routePoints);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  };

  const focusOrigin = () => {
    setActiveViewMode('origin');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([origin.lat, origin.lng], 14, { duration: 1 });
      if (originMarkerRef.current) originMarkerRef.current.openPopup();
    }
  };

  const focusDestination = () => {
    setActiveViewMode('dest');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([destination.lat, destination.lng], 14, { duration: 1 });
      if (destMarkerRef.current) destMarkerRef.current.openPopup();
    }
  };

  const focusVehicle = () => {
    setActiveViewMode('driver');
    const pos = getInterpolatedPosition(simulationProgress);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(pos, 15, { duration: 0.8 });
      if (vehicleMarkerRef.current) vehicleMarkerRef.current.openPopup();
    }
  };

  const resetSimulation = () => {
    setIsPlaying(false);
    setSimulationProgress(0);
    setActiveViewMode('origin');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([origin.lat, origin.lng], 14);
    }
  };

  // Telemetry numbers
  const totalKm = order?.telemetry?.distanceTotalKm || 12.5;
  const currentKmRemaining = Math.max(0, (totalKm * (1 - simulationProgress))).toFixed(1);
  const currentEtaMins = Math.max(1, Math.round(45 * (1 - simulationProgress)));

  return (
    <div className="glass-dark-card text-white rounded-3xl p-5 sm:p-7 border border-white/10 shadow-2xl space-y-5 relative overflow-hidden">
      
      {/* Map Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 backdrop-blur-md flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-emerald-400" />
              <span>LIVE GPS SUPPLY CHAIN MAP</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Order #{order?.id}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
            Order Origin & Delivery Route
          </h3>
          <p className="text-xs text-slate-300">
            Traces the entire farm harvest origin to buyer doorstep delivery.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* View Mode (Map vs Schematic) */}
          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-1 text-xs">
            <button
              onClick={() => setDisplayMode('map')}
              className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                displayMode === 'map' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Interactive Map</span>
            </button>
            <button
              onClick={() => setDisplayMode('schematic')}
              className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                displayMode === 'schematic' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Pipeline View</span>
            </button>
          </div>

          {/* Tile Layer Selector (when map mode active) */}
          {displayMode === 'map' && (
            <div className="flex items-center bg-slate-900/90 border border-slate-700/80 rounded-xl p-1 text-xs">
              <button
                onClick={() => setActiveTileKey('voyager')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTileKey === 'voyager' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
                title="Modern Clean Map"
              >
                Modern
              </button>
              <button
                onClick={() => setActiveTileKey('dark')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTileKey === 'dark' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
                title="Night Mode"
              >
                Dark
              </button>
              <button
                onClick={() => setActiveTileKey('light')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTileKey === 'light' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
                title="Light Positron"
              >
                Light
              </button>
            </div>
          )}

          {/* Camera Buttons */}
          {displayMode === 'map' && (
            <>
              <button
                onClick={fitRouteBounds}
                className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-300 hover:bg-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Fit Entire Route"
              >
                <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Fit Route</span>
              </button>

              <button
                onClick={focusOrigin}
                className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900/80 text-emerald-300 hover:bg-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Focus on Order Placement Farm Origin"
              >
                <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                <span>Origin</span>
              </button>

              <button
                onClick={focusDestination}
                className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900/80 text-sky-300 hover:bg-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Focus on Delivery Destination"
              >
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>Destination</span>
              </button>

              <button
                onClick={focusVehicle}
                className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900/80 text-amber-300 hover:bg-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Follow Transit Vehicle"
              >
                <LocateFixed className="w-3.5 h-3.5 text-amber-400" />
                <span>Vehicle</span>
              </button>
            </>
          )}

        </div>
      </div>

      {/* Origin vs Destination Information Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Origin Card (Where Order Was Placed) */}
        <div 
          onClick={focusOrigin}
          className="bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-500/30 rounded-2xl p-4 transition-all cursor-pointer group shadow-sm flex items-start gap-3.5"
        >
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-emerald-500/40 bg-slate-900 shrink-0 shadow-md">
            <img 
              src={order?.image || (order?.productName?.toLowerCase().includes('orange') ? '/images/oranges.jpg' : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80')} 
              alt={order?.productName} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Sprout className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>FROM: ORDER PLACED (FARM)</span>
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-md border border-emerald-500/30">
                Farm Pickup
              </span>
            </div>

            <h4 className="font-extrabold text-white text-sm group-hover:text-emerald-300 transition-colors truncate">
              {origin.name}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
              {origin.address}
            </p>

            <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400 border-t border-emerald-500/20 pt-1.5">
              <span>Item: <strong className="text-emerald-300">{order?.productName || 'Fresh Harvest'}</strong></span>
              <span>•</span>
              <span>Batch: <span className="text-emerald-400 font-mono font-bold">{origin.batchCode}</span></span>
            </div>
          </div>
        </div>

        {/* Destination Card (Where To Deliver) */}
        <div 
          onClick={focusDestination}
          className="bg-sky-950/40 hover:bg-sky-950/60 border border-sky-500/30 rounded-2xl p-4 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="flex items-center gap-1.5 text-sky-400">
              <MapPin className="w-4 h-4 text-sky-400" />
              <span>TO: DELIVERING TO (DESTINATION)</span>
            </span>
            <span className="bg-sky-500/20 text-sky-300 text-[10px] px-2 py-0.5 rounded-md border border-sky-500/30">
              Drop-off Point
            </span>
          </div>

          <h4 className="font-extrabold text-white text-sm group-hover:text-sky-300 transition-colors">
            {destination.name}
          </h4>
          <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
            {destination.address}
          </p>

          <div className="mt-2.5 flex items-center gap-3 text-[11px] text-slate-400 border-t border-sky-500/20 pt-2">
            <span>📞 {destination.contact}</span>
            <span>•</span>
            <span>Arrival: <span className="text-sky-300 font-bold">{destination.estArrival}</span></span>
          </div>
        </div>

      </div>

      {/* Map Canvas / Schematic Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-inner bg-slate-950">
        
        {displayMode === 'map' ? (
          /* Leaflet Real GPS Map Container with explicit inline dimensions */
          <div 
            ref={mapContainerRef} 
            style={{ width: '100%', height: '420px', minHeight: '400px' }}
            className="z-10 bg-slate-950" 
          />
        ) : (
          /* High-Contrast Interactive Schematic Transit View */
          <div className="w-full h-[420px] p-6 flex flex-col justify-between relative bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />

            <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                <Compass className="w-4 h-4" /> DIRECT SUPPLY CHAIN HIGHWAY CORRIDOR
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Total Distance: <strong className="text-white">{totalKm} km</strong>
              </span>
            </div>

            {/* Pipeline Nodes */}
            <div className="relative z-10 my-auto py-8">
              {/* Connecting line */}
              <div className="absolute top-1/2 left-12 right-12 h-1.5 -translate-y-1/2 bg-slate-800 rounded-full">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500 transition-all duration-300"
                  style={{ width: `${simulationProgress * 100}%` }}
                />
              </div>

              {/* Waypoints */}
              <div className="flex items-center justify-between px-6 relative">
                
                {/* Node 1: Origin Farm */}
                <div className="flex flex-col items-center gap-2 z-10">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-xl shadow-emerald-600/30 border-2 border-white ring-4 ring-emerald-500/20 overflow-hidden">
                    <img 
                      src={order?.image || (order?.productName?.toLowerCase().includes('orange') ? '/images/oranges.jpg' : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80')} 
                      alt="" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <span className="text-xs font-bold text-emerald-300 bg-slate-900/90 px-3 py-1 rounded-full border border-emerald-500/30">
                    🌾 Order Origin (Farm)
                  </span>
                  <span className="text-[11px] text-slate-400 max-w-[140px] text-center">
                    {origin.name}
                  </span>
                </div>

                {/* Node 2: Intermediate Cold-Chain Hub */}
                <div className="flex flex-col items-center gap-2 z-10">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center font-bold border border-slate-700 shadow-lg">
                    <Thermometer className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-amber-300 bg-slate-900/90 px-3 py-1 rounded-full border border-amber-500/30">
                    Cold-Storage Hub
                  </span>
                  <span className="text-[11px] text-slate-400">
                    4°C Temp Monitored
                  </span>
                </div>

                {/* Node 3: Destination */}
                <div className="flex flex-col items-center gap-2 z-10">
                  <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-black shadow-xl shadow-sky-600/30 border-2 border-white ring-4 ring-sky-500/20">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold text-sky-300 bg-slate-900/90 px-3 py-1 rounded-full border border-sky-500/30">
                    📍 Delivery Destination
                  </span>
                  <span className="text-[11px] text-slate-400 max-w-[140px] text-center">
                    {destination.name}
                  </span>
                </div>

              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
              <span>Origin Coordinates: {origin.lat.toFixed(3)}, {origin.lng.toFixed(3)}</span>
              <span className="text-emerald-400 font-bold">✓ Active Farm-Direct Logistics Track</span>
              <span>Destination Coordinates: {destination.lat.toFixed(3)}, {destination.lng.toFixed(3)}</span>
            </div>
          </div>
        )}

        {/* Telemetry Floating Badge */}
        {displayMode === 'map' && (
          <div className="absolute top-4 left-4 z-20 pointer-events-none hidden sm:flex flex-col gap-2">
            <div className="bg-slate-950/92 backdrop-blur-md p-3 rounded-xl border border-slate-800 shadow-xl pointer-events-auto space-y-1.5 min-w-[200px]">
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-emerald-400" />
                <span>Cold-Chain Telemetry</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Storage Temp:</span>
                <span className="font-mono font-black text-emerald-400">{order?.telemetry?.temp || '4°C'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Vehicle Speed:</span>
                <span className="font-mono font-black text-white">{order?.telemetry?.speed || '42 km/h'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Carrier:</span>
                <span className="text-slate-200 font-bold truncate max-w-[120px]">{order?.driver?.vehicle || 'Tata Ace EV'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Simulation Control Strip at bottom of map */}
        <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-950/94 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause Transit' : 'Simulate GPS Route'}</span>
            </button>

            <button
              onClick={resetSimulation}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
              title="Reset Route Position"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Speed Multiplier */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-[11px] font-bold">
              {[1, 2, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => setSimSpeed(s)}
                  className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                    simSpeed === s ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Progress Slider */}
          <div className="flex items-center gap-3 w-full sm:flex-1 max-w-md">
            <span className="text-[10px] font-bold text-emerald-400 uppercase shrink-0">
              Farm Origin
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={simulationProgress}
              onChange={(e) => {
                setIsPlaying(false);
                setSimulationProgress(parseFloat(e.target.value));
              }}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] font-bold text-sky-400 uppercase shrink-0">
              Delivery
            </span>
          </div>

          {/* Telemetry Stats */}
          <div className="flex items-center gap-3 text-xs font-mono text-slate-300 shrink-0">
            <div>
              <span className="text-slate-500">Left: </span>
              <span className="font-bold text-white">{currentKmRemaining} km</span>
            </div>
            <div>
              <span className="text-slate-500">ETA: </span>
              <span className="font-bold text-emerald-400">~{currentEtaMins}m</span>
            </div>
          </div>

        </div>

      </div>

      {/* Driver and Quality Assurance Details Card */}
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-emerald-400">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="font-extrabold text-white text-sm">
              Driver: {order?.driver?.name || 'Rajesh Kumar'}
            </p>
            <p className="text-slate-400">
              Vehicle: {order?.driver?.vehicle || 'Tata Ace EV (MP-04-FD-2024)'} • Phone: {order?.driver?.phone || '+91 98930 11223'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Farm-to-Door Direct Chain Verified</span>
          </div>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400">Zero Middleman Spoilage</span>
        </div>
      </div>

    </div>
  );
};

export default OrderRouteMap;
