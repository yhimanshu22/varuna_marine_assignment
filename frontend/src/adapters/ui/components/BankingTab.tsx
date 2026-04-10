import { useState } from "react";
import { apiClient } from "../../infrastructure/AxiosApiClient";

export function BankingTab() {
  const [shipId, setShipId] = useState("");
  const [year, setYear] = useState(2025);
  const [cbData, setCbData] = useState<{ shipId: string, year: number, adjustedCb: number } | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  
  const [targetShipId, setTargetShipId] = useState("");
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

  const fetchCB = async () => {
    try {
      setMessage(null);
      const data = await apiClient.getAdjustedCB(shipId, year);
      setCbData(data);
      const recs = await apiClient.getBankingRecords(shipId, year);
      setRecords(recs);
    } catch (e: any) {
      setMessage({ text: e.response?.data?.error || "Error fetching CB", type: 'error' });
    }
  };

  const handleBank = async () => {
    try {
      setMessage(null);
      await apiClient.bankSurplus(shipId, year);
      setMessage({ text: "Successfully banked surplus!", type: 'success' });
      fetchCB();
    } catch (e: any) {
      setMessage({ text: e.response?.data?.error || "Error banking surplus", type: 'error' });
    }
  };

  const handleApply = async () => {
    try {
      setMessage(null);
      await apiClient.applySurplus(targetShipId, shipId, year, amount);
      setMessage({ text: `Successfully applied ${amount} surplus to ${targetShipId}!`, type: 'success' });
      fetchCB();
    } catch (e: any) {
      setMessage({ text: e.response?.data?.error || "Error applying surplus", type: 'error' });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="border-b border-teal-500/10 pb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Banking Operations</h2>
        <p className="text-sm text-slate-500">Manage surplus compliance balances under FuelEU Article 20.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Search CB */}
        <div className="bg-white dark:bg-slate-900/40 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
              <span className="text-teal-600 font-bold text-xs">01</span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">Verify Compliance Balance</h3>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Vessel ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. R001" 
                  value={shipId} 
                  onChange={e => setShipId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Target Year</label>
                <input 
                  type="number" 
                  value={year} 
                  onChange={e => setYear(Number(e.target.value))}
                   className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                />
              </div>
            </div>
            <button 
              onClick={fetchCB} 
              className="w-full bg-slate-900 dark:bg-teal-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-teal-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Check Balance
            </button>
          </div>
          
          {cbData && (
            <div className="mt-8 p-6 bg-teal-50/30 dark:bg-teal-900/10 border border-teal-500/10 rounded-2xl animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-start mb-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">Financial Status for <span className="text-teal-600">{cbData.shipId}</span></p>
                <span className="text-[10px] font-mono text-slate-400">{cbData.year}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                 <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                    <span className="block text-[9px] uppercase font-bold text-slate-400 mb-1">cb_before</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{(cbData.adjustedCb - records.reduce((s, r) => s + r.amountGco2eq, 0)).toLocaleString()}</span>
                 </div>
                 <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                    <span className="block text-[9px] uppercase font-bold text-slate-400 mb-1">applied</span>
                    <span className="text-xs font-bold text-teal-600">{records.reduce((s, r) => s + r.amountGco2eq, 0).toLocaleString()}</span>
                 </div>
                 <div className="p-2 bg-slate-900 rounded-lg shadow-md border border-slate-800">
                    <span className="block text-[9px] uppercase font-bold text-teal-400 mb-1">cb_after</span>
                    <span className="text-xs font-bold text-white">{cbData.adjustedCb.toLocaleString()}</span>
                 </div>
              </div>

              <div className="flex items-baseline gap-2 mb-6 justify-center">
                <span className={`text-3xl font-black ${cbData.adjustedCb >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                  {cbData.adjustedCb.toLocaleString(undefined, {maximumFractionDigits: 0})}
                </span>
                <span className="text-[10px] font-medium text-slate-400">NET CB</span>
              </div>

              {cbData.adjustedCb > 0 && (
                <button 
                  onClick={handleBank} 
                  className="w-full bg-emerald-500 text-white text-[11px] font-black uppercase tracking-widest py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600"
                >
                  BANK SURPLUS FOR ARTICLE 20
                </button>
              )}
            </div>
          )}
        </div>

        {/* Apply banked CB */}
        <div className="bg-white dark:bg-slate-900/40 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
          {!cbData && (
             <div className="absolute inset-0 z-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center p-12 text-center text-slate-400 italic">
               Select a vessel and check balance to enable transfer operations.
             </div>
          )}
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
              <span className="text-teal-600 font-bold text-xs">02</span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">Apply Banked Surplus</h3>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
               <span className="text-[10px] font-bold text-slate-400 uppercase">Transfer From</span>
               <p className="font-bold text-teal-600 truncate">{shipId || "N/A"}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Recipient Ship ID</label>
                <input 
                  type="text" 
                  placeholder="Target Ship ID" 
                  value={targetShipId} 
                  onChange={e => setTargetShipId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Allocation Amount (gCO₂eq)</label>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={e => setAmount(Number(e.target.value))}
                   className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all font-mono font-bold"
                />
              </div>

              <button 
                 onClick={handleApply} 
                 disabled={!shipId || !targetShipId || amount <= 0 || !cbData || cbData.adjustedCb <= 0}
                 className="w-full bg-teal-600 text-white font-bold py-4 rounded-2xl disabled:opacity-30 disabled:grayscale transition-all hover:shadow-xl hover:shadow-teal-500/20"
              >
                 AUTHORIZE TRANSFER
              </button>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-5 rounded-2xl text-sm font-bold border animate-in slide-in-from-bottom-4 duration-500 ${message.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-900/10 dark:border-rose-900/20' : 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-900/10 dark:border-emerald-900/20'}`}>
          <div className="flex items-center gap-3">
             <div className={`w-2 h-2 rounded-full ${message.type === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
             {message.text}
          </div>
        </div>
      )}
    </div>
  );
}
