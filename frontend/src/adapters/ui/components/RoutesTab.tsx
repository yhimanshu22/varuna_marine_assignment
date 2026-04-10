import { useEffect, useState } from "react";
import { apiClient } from "../../infrastructure/AxiosApiClient";
import type { Route } from "../../../core/domain/Entities";

export function RoutesTab() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filterType, setFilterType] = useState<string>("");
  const [filterFuel, setFilterFuel] = useState<string>("");
  const [filterYear, setFilterYear] = useState<string>("");

  const fetchRoutes = async () => {
    try {
      const data = await apiClient.getRoutes();
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

  const filteredRoutes = routes.filter(r => {
    const matchType = filterType ? r.vesselType === filterType : true;
    const matchFuel = filterFuel ? r.fuelType === filterFuel : true;
    const matchYear = filterYear ? r.year.toString() === filterYear : true;
    return matchType && matchFuel && matchYear;
  });

  const vesselTypes = Array.from(new Set(routes.map(r => r.vesselType)));
  const fuelTypes = Array.from(new Set(routes.map(r => r.fuelType)));
  const years = Array.from(new Set(routes.map(r => r.year.toString())));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-teal-500/10 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Maritime Routes</h2>
          <p className="text-sm text-slate-500">Overview of vessel performance and FuelEU compliance telemetry.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2 mr-2">Vessel</label>
            <select 
              value={filterType} 
              onChange={e => setFilterType(e.target.value)} 
              className="bg-transparent border-none text-xs font-bold focus:ring-0 cursor-pointer text-teal-700 dark:text-teal-400"
            >
              <option value="">All</option>
              {vesselTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1"></div>
          <div className="flex items-center">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mr-2">Fuel</label>
            <select 
              value={filterFuel} 
              onChange={e => setFilterFuel(e.target.value)} 
              className="bg-transparent border-none text-xs font-bold focus:ring-0 cursor-pointer text-teal-700 dark:text-teal-400"
            >
              <option value="">All</option>
              {fuelTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1"></div>
          <div className="flex items-center">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mr-2">Year</label>
            <select 
              value={filterYear} 
              onChange={e => setFilterYear(e.target.value)} 
              className="bg-transparent border-none text-xs font-bold focus:ring-0 cursor-pointer text-teal-700 dark:text-teal-400"
            >
              <option value="">All</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em]">
              <th className="px-4 py-2">Vessel/Route</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Fuel Spec</th>
              <th className="px-4 py-2 text-center">Year</th>
              <th className="px-4 py-2">GHG Intensity</th>
              <th className="px-4 py-2">Consumption</th>
              <th className="px-4 py-2">Emissions (t)</th>
              <th className="px-4 py-2 text-right">Operations</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoutes.map(r => (
              <tr key={r.id} className="group bg-white dark:bg-slate-800/20 hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-colors border border-slate-100 dark:border-slate-800">
                <td className="px-4 py-4 rounded-l-2xl border-y border-l border-transparent group-hover:border-teal-500/20">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{r.routeId}</span>
                    <span className="text-[10px] text-slate-400 font-mono">DIST: {r.distance.toLocaleString()} km</span>
                  </div>
                </td>
                <td className="px-4 py-4 border-y border-transparent group-hover:border-teal-500/20">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    {r.vesselType}
                  </span>
                </td>
                <td className="px-4 py-4 border-y border-transparent group-hover:border-teal-500/20">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{r.fuelType}</span>
                </td>
                <td className="px-4 py-4 text-center border-y border-transparent group-hover:border-teal-500/20 text-slate-500 text-sm">
                  {r.year}
                </td>
                <td className="px-4 py-4 border-y border-transparent group-hover:border-teal-500/20">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-teal-600 dark:text-teal-400">{r.ghgIntensity}</span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-tighter">gCO₂e/MJ</span>
                  </div>
                </td>
                <td className="px-4 py-4 border-y border-transparent group-hover:border-teal-500/20">
                   <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{r.fuelConsumption.toLocaleString()} t</span>
                </td>
                <td className="px-4 py-4 border-y border-transparent group-hover:border-teal-500/20">
                   <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{r.totalEmissions.toLocaleString()}</span>
                </td>
                <td className="px-4 py-4 rounded-r-2xl border-y border-r border-transparent group-hover:border-teal-500/20 text-right">
                  <div className="flex items-center justify-end gap-3">
                    {r.isBaseline ? (
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[9px] font-bold uppercase tracking-widest rounded-full border border-amber-500/20">
                        Baseline ⭐
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleSetBaseline(r.routeId)}
                        className="opacity-0 group-hover:opacity-100 px-4 py-1.5 bg-slate-900 dark:bg-teal-600 text-white text-[10px] font-bold rounded-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/5"
                      >
                        SET BASELINE
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredRoutes.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-400 italic">No routes found matching your criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
