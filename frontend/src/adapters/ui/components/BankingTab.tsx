import { useState } from "react";
import { apiClient } from "../../infrastructure/AxiosApiClient";

export function BankingTab() {
  const [shipId, setShipId] = useState("");
  const [year, setYear] = useState(2025);
  const [cbData, setCbData] = useState<{ shipId: string, year: number, adjustedCb: number } | null>(null);
  
  const [targetShipId, setTargetShipId] = useState("");
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

  const fetchCB = async () => {
    try {
      setMessage(null);
      const data = await apiClient.getAdjustedCB(shipId, year);
      setCbData(data);
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
    <div className="space-y-8">
      <h2 className="text-xl font-bold">Banking Operations (Article 20)</h2>
      
      {/* Search CB */}
      <div className="bg-gray-50 p-4 rounded border">
        <h3 className="font-semibold mb-3">1. Check Vessel Compliance Balance</h3>
        <div className="flex space-x-2">
          <input 
            type="text" 
            placeholder="Ship/Route ID (e.g. R001)" 
            value={shipId} 
            onChange={e => setShipId(e.target.value)}
            className="border p-2 rounded w-48"
          />
          <input 
            type="number" 
            placeholder="Year" 
            value={year} 
            onChange={e => setYear(Number(e.target.value))}
            className="border p-2 rounded w-24"
          />
          <button onClick={fetchCB} className="bg-blue-600 text-white px-4 py-2 rounded">Select Ship</button>
        </div>
        
        {cbData && (
          <div className="mt-4 p-4 bg-white border rounded">
            <p className="text-lg">Current Adjusted CB for <strong>{cbData.shipId}</strong> in <strong>{cbData.year}</strong></p>
            <p className={`text-2xl font-bold mt-2 ${cbData.adjustedCb >= 0 ? "text-green-600" : "text-red-600"}`}>
              {cbData.adjustedCb.toLocaleString(undefined, {maximumFractionDigits: 2})} gCO₂eq
              {cbData.adjustedCb >= 0 ? " (Surplus)" : " (Deficit)"}
            </p>
            {cbData.adjustedCb > 0 && (
              <button onClick={handleBank} className="mt-2 bg-green-500 text-white px-3 py-1 rounded">Bank Surplus</button>
            )}
          </div>
        )}
      </div>

      {/* Apply banked CB */}
      <div className="bg-gray-50 p-4 rounded border">
        <h3 className="font-semibold mb-3">2. Apply Banked Surplus to another vessel</h3>
        <div className="flex items-center space-x-2">
          <span>From <strong>{shipId || "[Select Ship]"}</strong></span>
          <span>to:</span>
          <input 
            type="text" 
            placeholder="Target Ship ID" 
            value={targetShipId} 
            onChange={e => setTargetShipId(e.target.value)}
            className="border p-2 rounded w-32"
          />
          <span>Amount:</span>
          <input 
            type="number" 
            value={amount} 
            onChange={e => setAmount(Number(e.target.value))}
            className="border p-2 rounded w-32"
          />
          <button 
             onClick={handleApply} 
             disabled={!shipId || !targetShipId || amount <= 0 || !cbData || cbData.adjustedCb <= 0}
             className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
             Apply
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded ${message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
