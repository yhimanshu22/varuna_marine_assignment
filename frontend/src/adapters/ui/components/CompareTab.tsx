import { useEffect, useState } from "react";
import { apiClient } from "../../infrastructure/AxiosApiClient";
import { Route } from "../../../core/domain/Entities";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";

export function CompareTab() {
  const [data, setData] = useState<Route[]>([]);
  
  useEffect(() => {
    apiClient.getComparison().then(setData);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Baseline vs Target Comparison</h2>
      <div className="mb-8 overflow-x-auto">
        <table className="w-full text-left border min-w-max">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-2">Route ID</th>
              <th className="p-2">GHG Int (gCO₂e/MJ)</th>
              <th className="p-2">% Difference (from Baseline)</th>
              <th className="p-2">Compliant (Target 89.33)</th>
            </tr>
          </thead>
          <tbody>
            {data.map(r => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                 <td className="p-2 font-mono">{r.routeId} {r.isBaseline && "⭐"}</td>
                 <td className="p-2">{r.ghgIntensity}</td>
                 <td className={`p-2 font-bold ${Number(r.percentDiff) > 0 ? "text-red-500" : "text-green-500"}`}>
                   {Number(r.percentDiff) > 0 ? "+" : ""}{r.percentDiff}%
                 </td>
                 <td className="p-2">{r.isCompliant ? "✅ Yes" : "❌ No"}</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan={4} className="p-4 text-center text-gray-500">No data found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      
      {data.length > 0 && (
        <div className="h-80 w-full mt-8 bg-blue-50/20 p-4 rounded-md border border-blue-100">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="routeId" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Legend />
              {/* Target Intensity Line for FuelEU 2025 */}
              <ReferenceLine y={89.3368} label="2025 Target (89.33)" stroke="green" strokeDasharray="4 4" strokeWidth={2} />
              <Bar dataKey="ghgIntensity" fill="#3b82f6" name="GHG Intensity" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
