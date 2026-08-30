import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sprout, ShieldCheck, ArrowRight } from 'lucide-react';

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, switchRole, showToast } = useApp();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState('Farmer');

  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: ''
  });

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    switchRole(selectedRole);
    setIsAuthModalOpen(false);
    showToast(`Logged in as ${selectedRole}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative animate-pulse-slow">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-6 right-6 p-1 text-slate-400 hover:text-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">FarmDirect</h3>
            <p className="text-[10px] text-slate-500 font-medium">Direct Agricultural Platform Access</p>
          </div>
        </div>

        {/* Login / Register Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Role Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Select Stakeholder Persona:</label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { id: 'Farmer', label: 'Farmer / FPO' },
              { id: 'Buyer', label: 'Consumer / Buyer' },
              { id: 'Logistics', label: 'Logistics Partner' },
              { id: 'Admin', label: 'Platform Admin' }
            ].map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRole(r.id)}
                className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                  selectedRole === r.id
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Mobile Phone Number *</label>
            <input
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Email Address</label>
            <input
              type="email"
              placeholder="user@kisanconnect.in"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-xs"
          >
            {mode === 'login' ? 'Login to Dashboard' : 'Register New Account'}
          </button>
        </form>

      </div>
    </div>
  );
};
