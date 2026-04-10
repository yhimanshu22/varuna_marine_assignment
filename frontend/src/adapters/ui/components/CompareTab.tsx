import { useEffect, useState } from "react";
import { apiClient } from "../../infrastructure/AxiosApiClient";
import type { Route } from "../../../core/domain/Entities";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";

export function CompareTab() {
  const [data, setData] = useState<Route[]>([]);
  
  useEffect(() => {
    apiClient.getComparison().then(setData);
  }, []);

  return (
    <div className="space-y-8">
      <div className="border-b border-teal-500/10 pb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Compliance Analytics</h2>
        <p className="text-sm text-slate-500">Benchmark vessel performance against the FuelEU 2025 intensity target.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 overflow-x-auto bg-white dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800 p-1">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">
                <th className="px-6 py-4">Vessel Identifier</th>
                <th className="px-6 py-4">GHG Intensity</th>
                <th className="px-6 py-4">Dev. from Baseline (% Diff)</th>
                <th className="px-6 py-4 text-right">Status (Compliant)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {data.map(r => (
                <tr key={r.id} className="hover:bg-teal-50/30 dark:hover:bg-teal-900/5 transition-colors">
                   <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                     {r.routeId} 
                     {r.isBaseline && <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 text-[9px] px-2 py-0.5 rounded-full">BASE</span>}
                   </td>
                   <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                     {r.ghgIntensity.toFixed(2)}
                   </td>
                   <td className={`px-6 py-4 text-sm font-bold ${Number((r as any).percentDiff) > 0 ? "text-rose-500" : "text-emerald-500"}`}>
                     {Number((r as any).percentDiff) > 0 ? "+" : ""}{(r as any).percentDiff}%
                   </td>
                   <td className="px-6 py-4 text-right">
                     {(r as any).compliant ? (
                       <span className="text-emerald-500 font-bold text-xs">Compliant ✅</span>
                     ) : (
                       <span className="text-rose-500 font-bold text-xs">Non-Compliant ❌</span>
                     )}
                   </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">Analytical data pending...</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Target Benchmark</h4>
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200/50 shadow-sm">
                <p className="text-[10px] text-slate-400 font-bold uppercase">2025 Target Intensity</p>
                <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">89.34 <span className="text-[10px] font-medium text-slate-400">gCO₂e/MJ</span></p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                The FuelEU Maritime regulation enforces a gradual reduction in GHG intensity. Vessels exceeding the target must apply banking, pooling, or pay penalties.
              </p>
            </div>
        </div>
      </div>
      
      {data.length > 0 && (
        <div className="bg-white dark:bg-slate-900/10 p-8 rounded-3xl border border-teal-500/10 mt-8 h-[450px]">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 text-center italic">Vessel Intensity vs Regulatory Cap</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="routeId" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
              <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
              <Tooltip 
                 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', background: '#fff' }} 
                 cursor={{ fill: 'rgba(15, 118, 110, 0.05)' }}
              />
              <Legend verticalAlign="top" height={36}/>
              <ReferenceLine y={89.3368} stroke="#f43f5e" strokeDasharray="5 5" label={{ value: 'Regulation CAP', position: 'insideTopRight', fill: '#f43f5e', fontSize: 10, fontWeight: 'bold' }} strokeWidth={2} />
              <Bar dataKey="ghgIntensity" fill="#0f766e" name="Actual GHG Intensity" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
