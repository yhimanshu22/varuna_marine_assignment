import { useState } from "react";
import { apiClient } from "../../infrastructure/AxiosApiClient";
import { Pool } from "../../../core/domain/Entities";

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
      setMessage({ text: `Pool created successfully! Created At: ${new Date(newPool.createdAt).toLocaleString()}`, type: 'success' });
    } catch (e: any) {
      setMessage({ text: e.response?.data?.error || "Error creating pool", type: 'error' });
      setPool(null);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Pooling (Article 21)</h2>
      
      <div className="bg-gray-50 p-4 rounded border max-w-xl">
         <h3 className="font-semibold mb-3">Create a new Pool</h3>
         
         <div className="flex flex-col space-y-3">
           <div>
             <label className="block text-sm font-medium mb-1">Year</label>
             <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="border p-2 rounded w-full"/>
           </div>
           
           <div>
             <label className="block text-sm font-medium mb-1">Ship IDs (comma separated)</label>
             <input 
               type="text" 
               placeholder="e.g. R001, R002, R003" 
               value={membersInput} 
               onChange={e => setMembersInput(e.target.value)} 
               className="border p-2 rounded w-full"
             />
             <p className="text-xs text-gray-500 mt-1">Requires at least one surplus ship if there are deficits.</p>
           </div>

           <button onClick={handleCreatePool} className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
             Create Pool
           </button>
         </div>

         {message && (
          <div className={`mt-4 p-4 rounded ${message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {message.text}
          </div>
        )}
      </div>

      {pool && pool.members && (
        <div className="mt-8">
          <h3 className="text-lg font-bold">Pool Allocation Details</h3>
          <table className="w-full text-left border mt-4">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-2">Ship ID</th>
                <th className="p-2">CB Before Pool</th>
                <th className="p-2">CB After Pool</th>
              </tr>
            </thead>
            <tbody>
              {pool.members.map(m => (
                <tr key={m.shipId} className="border-b">
                  <td className="p-2 font-mono">{m.shipId}</td>
                  <td className="p-2">{m.cbBefore.toLocaleString()} gCO₂eq</td>
                  <td className="p-2 font-bold">{m.cbAfter.toLocaleString()} gCO₂eq</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-sm text-gray-600 mt-2 font-medium">
            Pool Total CB Before: {pool.members.reduce((sum, m) => sum + m.cbBefore, 0).toLocaleString()} | 
            Pool Total CB After: {pool.members.reduce((sum, m) => sum + m.cbAfter, 0).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
