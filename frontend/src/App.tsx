import { useState } from 'react'
import { RoutesTab } from './adapters/ui/components/RoutesTab'
import { CompareTab } from './adapters/ui/components/CompareTab'
import { BankingTab } from './adapters/ui/components/BankingTab'
import { PoolingTab } from './adapters/ui/components/PoolingTab'

function App() {
  const [activeTab, setActiveTab] = useState<'routes' | 'compare' | 'banking' | 'pooling'>('routes')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <header className="w-full bg-blue-900 text-white p-6 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wider">FuelEU Maritime Dashboard</h1>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl p-6 mt-4">
        {/* Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-t-lg shadow-sm border-b mb-6">
          <button 
            className={`px-6 py-3 font-semibold rounded-md ${activeTab === 'routes' ? 'bg-blue-100 text-blue-800' : 'text-gray-500 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('routes')}
          >
            Routes
          </button>
          <button 
            className={`px-6 py-3 font-semibold rounded-md ${activeTab === 'compare' ? 'bg-blue-100 text-blue-800' : 'text-gray-500 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('compare')}
          >
            Compare
          </button>
          <button 
            className={`px-6 py-3 font-semibold rounded-md ${activeTab === 'banking' ? 'bg-blue-100 text-blue-800' : 'text-gray-500 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('banking')}
          >
            Banking
          </button>
          <button 
            className={`px-6 py-3 font-semibold rounded-md ${activeTab === 'pooling' ? 'bg-blue-100 text-blue-800' : 'text-gray-500 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('pooling')}
          >
            Pooling
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white p-6 rounded-b-lg shadow-md border-x border-b min-h-[500px]">
          {activeTab === 'routes' && <RoutesTab />}
          {activeTab === 'compare' && <CompareTab />}
          {activeTab === 'banking' && <BankingTab />}
          {activeTab === 'pooling' && <PoolingTab />}
        </div>
      </main>
    </div>
  )
}

export default App
