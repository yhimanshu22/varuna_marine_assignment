import { useState } from "react";
import { apiClient } from "../../infrastructure/AxiosApiClient";
import type { Pool } from "../../../core/domain/Entities";

export function PoolingTab() {
  const [year, setYear] = useState(2025);
  const [membersInput, setMembersInput] = useState("");
  const [pool, setPool] = useState<Pool | null>(null);
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

  const handleCreatePool = async () => {
    try {
      setMessage(null);
      const members = membersInput.split(",").map(id => id.trim()).filter(id => id);
      if (members.length < 2) {
         setMessage({ text: "Please enter at least 2 ship IDs for a pool.", type: 'error' });
         return;
      }
      
      const newPool = await apiClient.createPool(year, members);
      setPool(newPool);
      setMessage({ text: `Pool created successfully for ${members.length} vessels.`, type: 'success' });
    } catch (e: any) {
      setMessage({ text: e.response?.data?.error || "Error creating pool", type: 'error' });
      setPool(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="border-b border-teal-500/10 pb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Compliance Pooling</h2>
        <p className="text-sm text-slate-500">Form a compliance pool (Article 21) to aggregate and distribute compliance balances.</p>
      </div>
      
      <div className="bg-white dark:bg-slate-900/40 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm max-w-2xl">
         <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
              <span className="text-teal-600 font-bold text-xs">NEW</span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">Initialize Compliance Pool</h3>
         </div>
         
         <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Year</label>
                <input 
                  type="number" 
                  value={year} 
                  onChange={e => setYear(Number(e.target.value))} 
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                />
              </div>
              <div className="col-span-3 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Ship IDs (Member List)</label>
                <input 
                  type="text" 
                  placeholder="e.g. R001, R002, R003" 
                  value={membersInput} 
                  onChange={e => setMembersInput(e.target.value)} 
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                />
              </div>
            </div>
            
            <p className="text-[11px] text-slate-500 leading-relaxed italic bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              Note: Articles 21(1) and 21(2) allow companies to form a pool where ships with compliant balances can offset ships with deficits.
            </p>

            <button 
              onClick={handleCreatePool} 
              className="w-full bg-gradient-to-r from-teal-600 to-teal-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-teal-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              GENERATE ALLOCATION MAP
            </button>
         </div>

         {message && (
          <div className={`mt-6 p-4 rounded-xl text-xs font-bold border ${message.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-900/10 dark:border-rose-900/20' : 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-900/10 dark:border-emerald-900/20'}`}>
            {message.text}
          </div>
        )}
      </div>

      {pool && pool.members && (
        <div className="mt-8 animate-in slide-in-from-top-4 duration-500">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Allocation Distribution List</h3>
            <span className="text-[10px] text-slate-400 font-mono uppercase">POOLED CB: {pool.members.reduce((sum, m) => sum + m.cbAfter, 0).toLocaleString()} gCO₂eq</span>
          </div>
          
          <div className="bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">
                  <th className="px-6 py-4">Vessel ID</th>
                  <th className="px-6 py-4">Initial Balance</th>
                  <th className="px-6 py-4">Pooled Balance</th>
                  <th className="px-6 py-4 text-right">Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {pool.members.map(m => (
                  <tr key={m.shipId} className="hover:bg-teal-50/10 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{m.shipId}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-mono">{m.cbBefore.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-bold text-teal-600 dark:text-teal-400 font-mono">{m.cbAfter.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                       <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${m.cbAfter > m.cbBefore ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                         {m.cbAfter > m.cbBefore ? "SURPLUS GAIN" : "DEFICIT OFFSET"}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
