import { useState } from 'react'
import { RoutesTab } from './adapters/ui/components/RoutesTab'
import { CompareTab } from './adapters/ui/components/CompareTab'
import { BankingTab } from './adapters/ui/components/BankingTab'
import { PoolingTab } from './adapters/ui/components/PoolingTab'

function App() {
  const [activeTab, setActiveTab] = useState<'routes' | 'compare' | 'banking' | 'pooling'>('routes')

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#0b1a1e] flex flex-col font-sans grain">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)]">
        <div className="mx-auto max-w-[1600px] flex items-center justify-between px-4 sm:px-6 lg:px-10 h-[68px]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0f766e] to-[#14b8a6] flex items-center justify-center shadow-lg shadow-teal-500/20">
              <span className="text-white font-bold">V</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none text-[var(--text-h)]">Varuna Marine Services</span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold uppercase tracking-wider">Compliance Dashboard</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-1">
              <button className="px-4 py-2 text-sm font-medium text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 rounded-lg">Overview</button>
              <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-200">Reports</button>
              <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-200">Settings</button>
            </nav>
            <button className="px-5 py-2 text-sm font-semibold text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/25 bg-gradient-to-r from-[#0f766e] to-[#14b8a6]">
              Client Portal
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 py-8">
        {/* Side-by-side Layout or Tabs? Let's use clean Glass Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-2">
            <nav className="flex flex-col gap-2">
              <button 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'routes' ? 'bg-white dark:bg-slate-800 shadow-sm border border-[var(--border)] text-teal-700 dark:text-teal-400 font-bold' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
                onClick={() => setActiveTab('routes')}
              >
                <div className={`w-2 h-2 rounded-full ${activeTab === 'routes' ? 'bg-teal-500' : 'bg-slate-300'}`}></div>
                Routes
              </button>
              <button 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'compare' ? 'bg-white dark:bg-slate-800 shadow-sm border border-[var(--border)] text-teal-700 dark:text-teal-400 font-bold' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
                onClick={() => setActiveTab('compare')}
              >
                <div className={`w-2 h-2 rounded-full ${activeTab === 'compare' ? 'bg-teal-500' : 'bg-slate-300'}`}></div>
                Analytics
              </button>
              <button 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'banking' ? 'bg-white dark:bg-slate-800 shadow-sm border border-[var(--border)] text-teal-700 dark:text-teal-400 font-bold' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
                onClick={() => setActiveTab('banking')}
              >
                <div className={`w-2 h-2 rounded-full ${activeTab === 'banking' ? 'bg-teal-500' : 'bg-slate-300'}`}></div>
                Banking
              </button>
              <button 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'pooling' ? 'bg-white dark:bg-slate-800 shadow-sm border border-[var(--border)] text-teal-700 dark:text-teal-400 font-bold' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
                onClick={() => setActiveTab('pooling')}
              >
                <div className={`w-2 h-2 rounded-full ${activeTab === 'pooling' ? 'bg-teal-500' : 'bg-slate-300'}`}></div>
                Pooling
              </button>
            </nav>
            
            <div className="mt-12 p-4 rounded-2xl bg-gradient-to-br from-teal-500/5 to-teal-500/10 border border-teal-500/10">
              <h4 className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-widest mb-2">Platform Status</h4>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Connected to API
              </div>
            </div>
          </aside>

          <section className="lg:col-span-10">
            <div className="bg-white dark:bg-slate-800/50 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-[var(--border)] min-h-[600px]">
              {activeTab === 'routes' && <RoutesTab />}
              {activeTab === 'compare' && <CompareTab />}
              {activeTab === 'banking' && <BankingTab />}
              {activeTab === 'pooling' && <PoolingTab />}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
