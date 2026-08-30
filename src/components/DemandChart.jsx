import React from 'react';
import { TrendingUp, Cpu, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const DemandChart = ({ forecast }) => {
  const data = forecast.weeklyData || [];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      
      {/* Forecast Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              AI DEMAND ENGINE
            </span>
            <span className="text-xs text-slate-500 font-medium">Confidence Score: {forecast.confidenceScore || 94}%</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 mt-1">
            7-Day Crop Demand Forecast — {forecast.crop}
          </h3>
          <p className="text-xs text-slate-500">Region: <span className="font-semibold text-slate-700">{forecast.region}</span></p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-right">
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Predicted Demand</p>
            <p className="text-xl font-black text-emerald-700">{forecast.predictedDemand} kg</p>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-0.5">
              <TrendingUp className="w-3 h-3" />
              ↑ {forecast.trendPercent}% Trend
            </p>
          </div>
        </div>
      </div>

      {/* Recharts Chart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
              itemStyle={{ color: '#38bdf8', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Line 
              type="monotone" 
              dataKey="demand" 
              name="Predicted Demand (kg)" 
              stroke="#16a34a" 
              strokeWidth={3} 
              dot={{ r: 5, fill: '#16a34a' }}
              activeDot={{ r: 8 }}
            />
            <Line 
              type="monotone" 
              dataKey="supply" 
              name="Estimated Local Supply (kg)" 
              stroke="#94a3b8" 
              strokeWidth={2} 
              strokeDasharray="5 5"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* AI Smart Recommendation Card */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-5 rounded-xl space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-amber-400 text-xs font-bold flex items-center gap-1.5 uppercase tracking-wide">
            <Sparkles className="w-4 h-4" />
            AI Recommendation for Farmers
          </span>
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
            Optimal Selling Price: {forecast.recommendedPrice}
          </span>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed font-medium">
          “{forecast.actionTip}”
        </p>

        {/* AI Factor Tags */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2 text-[11px]">
          <span className="text-slate-400 font-semibold">Key AI Drivers:</span>
          {forecast.factors?.map((f, i) => (
            <span key={i} className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
              {f.name} ({f.impact})
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};
