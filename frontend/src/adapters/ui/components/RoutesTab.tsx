import { useEffect, useState } from "react";
import { apiClient } from "../../infrastructure/AxiosApiClient";
import type { Route } from "../../../core/domain/Entities";

export function RoutesTab() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filterType, setFilterType] = useState<string>("");

  const fetchRoutes = async () => {
    try {
      console.log("Fetching routes from:", import.meta.env.VITE_API_BASE_URL || "http://localhost:3001");
      const data = await apiClient.getRoutes();
      console.log("Received routes:", data);
      setRoutes(data);
    } catch (error) {
      console.error("Failed to fetch routes:", error);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleSetBaseline = async (routeId: string) => {
    await apiClient.setBaseline(routeId);
    fetchRoutes();
  };

  const filteredRoutes = routes.filter(r => filterType ? r.vesselType === filterType : true);
  const vesselTypes = Array.from(new Set(routes.map(r => r.vesselType)));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Routes Data</h2>
        <div>
          <label className="mr-2 font-medium">Filter Vessel Type:</label>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border p-1 rounded">
            <option value="">All</option>
            {vesselTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-2">Route ID</th>
            <th className="p-2">Vessel Type</th>
            <th className="p-2">Fuel Type</th>
            <th className="p-2">Year</th>
            <th className="p-2">GHG Int (gCO₂e/MJ)</th>
            <th className="p-2">Fuel (t)</th>
            <th className="p-2">Dist (km)</th>
            <th className="p-2">Baseline</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredRoutes.map(r => (
            <tr key={r.id} className="border-b hover:bg-gray-50">
              <td className="p-2 font-mono">{r.routeId}</td>
              <td className="p-2">{r.vesselType}</td>
              <td className="p-2">{r.fuelType}</td>
              <td className="p-2">{r.year}</td>
              <td className="p-2 font-semibold text-blue-800">{r.ghgIntensity}</td>
              <td className="p-2">{r.fuelConsumption}</td>
              <td className="p-2">{r.distance}</td>
              <td className="p-2">{r.isBaseline ? "⭐" : ""}</td>
              <td className="p-2">
                {!r.isBaseline && (
                  <button 
                    onClick={() => handleSetBaseline(r.routeId)}
                    className="bg-blue-600 text-white px-3 py-1 text-xs rounded shadow hover:bg-blue-700"
                  >
                    Set Baseline
                  </button>
                )}
              </td>
            </tr>
          ))}
          {filteredRoutes.length === 0 && (
            <tr>
              <td colSpan={9} className="p-4 text-center text-gray-500">No routes found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
