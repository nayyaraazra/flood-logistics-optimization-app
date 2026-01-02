import React from 'react';
import { 
  MapIcon, Droplets, AlertTriangle, CheckCircle, 
  Navigation, Play 
} from 'lucide-react';

const LOCATIONS = [
  { id: 'TG_PRIOK', name: 'Pelabuhan Tg. Priok', zone: 'North', type: 'Warehouse', typical_risk: 'Low' },
  { id: 'PLUIT', name: 'Pluit/Muara Karang', zone: 'North', type: 'Flood Prone', typical_risk: 'High' },
  { id: 'CLINCING', name: 'Cilincing', zone: 'North', type: 'District', typical_risk: 'Medium' },
  { id: 'CENGKARENG', name: 'Cengkareng', zone: 'West', type: 'District', typical_risk: 'Low' },
  { id: 'GROGOL', name: 'Grogol/Trisakti', zone: 'West', type: 'Flood Prone', typical_risk: 'High' },
  { id: 'MONAS', name: 'Monas/Gambir', zone: 'Central', type: 'District', typical_risk: 'Medium' },
  { id: 'TN_ABANG', name: 'Tanah Abang', zone: 'Central', type: 'Destination', typical_risk: 'Medium' },
  { id: 'MANGGARAI', name: 'Pintu Air Manggarai', zone: 'Central', type: 'Flood Prone', typical_risk: 'High' },
  { id: 'KELAPA_GD', name: 'Kelapa Gading', zone: 'East', type: 'Flood Prone', typical_risk: 'High' },
  { id: 'CAKUNG', name: 'Cakung/Pulo Gadung', zone: 'East', type: 'District', typical_risk: 'Medium' },
  { id: 'JATINEGARA', name: 'Jatinegara/Kp. Melayu', zone: 'East', type: 'Flood Prone', typical_risk: 'High' },
  { id: 'BLOK_M', name: 'Blok M', zone: 'South', type: 'District', typical_risk: 'Low' },
  { id: 'CILANDAK', name: 'Cilandak/Kemang', zone: 'South', type: 'Flood Prone', typical_risk: 'Medium' },
  { id: 'PS_MINGGU', name: 'Pasar Minggu', zone: 'South', type: 'District', typical_risk: 'Medium' }
];

const Dashboard = ({ onStartApp }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-3 rounded-xl">
                <Droplets className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Jakarta Flood Logistics System
                </h1>
                <p className="text-slate-600 mt-1 text-sm md:text-base">
                  Real-time route optimization during flood conditions
                </p>
              </div>
            </div>
            <button
              onClick={onStartApp}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              <Play size={20} fill="currentColor" />
              Launch App
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Image */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Hero Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/30 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm font-semibold">Real-Time Monitoring Active</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Intelligent Routing for Flood-Prone Areas
              </h2>
              
              <p className="text-blue-100 text-lg mb-6">
                Optimize logistics delivery routes using real-time flood data from satellite 
                and ground sensors. Never get stuck in flooded areas again.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-400" />
                  <span className="text-sm">Real-time API Integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-400" />
                  <span className="text-sm">Smart Algorithm</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-400" />
                  <span className="text-sm">Cost Optimization</span>
                </div>
              </div>
              
              <button
                onClick={onStartApp}
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-xl hover:shadow-2xl inline-flex items-center gap-3"
              >
                <Play size={24} fill="currentColor" />
                Try Live Demo
              </button>
            </div>

            {/* Right: Image/Illustration Space */}
            <div className="relative">
              {/* Placeholder for your image */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/20">
                {/* Option 1: Add your own image here */}
                <img 
                  src="./image.png" 
                  alt="Jakarta Flood Logistics"
                  className="w-full h-auto rounded-xl shadow-2xl"
                /> 
                
                {/* Option 2: Temporary placeholder with icon (remove when you add image) */}
                <div className="aspect-video bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-xl flex items-center justify-center border-2 border-dashed border-white/30">
                  <div className="text-center">
                    <MapIcon size={64} className="mx-auto mb-4 text-white/50" />
                    <p className="text-white/70 text-sm font-medium">
                      Add your hero image here<br />
                      (Jakarta map, flood illustration, or app screenshot)
                    </p>
                    <p className="text-white/50 text-xs mt-2">
                      Recommended: 800x600px or 16:9 ratio
                    </p>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full blur-2xl opacity-20"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-green-400 rounded-full blur-2xl opacity-20"></div>
              </div>

              {/* Floating stats badges */}
              <div className="absolute -left-4 top-1/4 bg-white rounded-lg shadow-xl p-3 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="text-2xl font-bold text-blue-600">14</div>
                <div className="text-xs text-slate-600">Locations</div>
              </div>
              
              <div className="absolute -right-4 bottom-1/4 bg-white rounded-lg shadow-xl p-3 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                <div className="text-2xl font-bold text-green-600">95%</div>
                <div className="text-xs text-slate-600">Accurate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Problem Overview Section */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="text-orange-500" size={28} />
              The Problem
            </h2>
            <div className="prose max-w-none">
              <p className="text-slate-700 text-base md:text-lg mb-4">
                Jakarta experiences severe flooding during monsoon season, creating significant 
                challenges for logistics operations. Traditional routing systems optimize for 
                distance and traffic but <strong>fail to account for rapidly changing flood conditions</strong>.
              </p>
              <div className="grid md:grid-cols-3 gap-4 md:gap-6 mt-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-bold text-red-900 mb-2">Current Limitation</h3>
                  <p className="text-red-700 text-sm">
                    Static route planning without real-time flood data integration
                  </p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-bold text-orange-900 mb-2">The Impact</h3>
                  <p className="text-orange-700 text-sm">
                    Delivery delays, increased costs, and safety risks during floods
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-bold text-green-900 mb-2">The Solution</h3>
                  <p className="text-green-700 text-sm">
                    Real-time flood data + intelligent pathfinding = optimal routes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">System Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <StatsCard
              title="Locations"
              value="14"
              subtitle="Monitored"
              icon={<MapIcon size={24} />}
              color="blue"
            />
            <StatsCard
              title="High Risk"
              value="6"
              subtitle="Flood Zones"
              icon={<Droplets size={24} />}
              color="red"
            />
            <StatsCard
              title="Routes"
              value="25"
              subtitle="Connections"
              icon={<CheckCircle size={24} />}
              color="green"
            />
            <StatsCard
              title="Vehicles"
              value="2"
              subtitle="Types"
              icon={<Navigation size={24} />}
              color="purple"
            />
          </div>
        </section>

        {/* Location Table */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">Monitored Locations</h2>
              <p className="text-sm text-slate-600 mt-1">
                14 key locations across Jakarta with typical flood risk assessment
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Zone
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden md:table-cell">
                      Type
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Risk
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {LOCATIONS.map((location) => (
                    <tr key={location.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 md:mr-3 ${
                            location.typical_risk === 'High' ? 'bg-red-500' :
                            location.typical_risk === 'Medium' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}></div>
                          <span className="font-medium text-slate-900 text-sm md:text-base">{location.name}</span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className="text-slate-700 text-sm md:text-base">{location.zone}</span>
                      </td>
                      <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                          {location.type}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className={`px-2 md:px-3 py-1 text-xs font-semibold rounded-full ${
                          location.typical_risk === 'High' 
                            ? 'bg-red-100 text-red-700' 
                            : location.typical_risk === 'Medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {location.typical_risk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Features Overview */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <FeatureCard
              title="Real-Time Data"
              description="Live flood monitoring from Open-Meteo API with river discharge measurements"
              icon="🌊"
            />
            <FeatureCard
              title="Smart Routing"
              description="Modified Dijkstra algorithm with flood-level penalties and vehicle constraints"
              icon="🧮"
            />
            <FeatureCard
              title="Visual Playback"
              description="Step-by-step algorithm execution with interactive map visualization"
              icon="🎬"
            />
            <FeatureCard
              title="Cost Analysis"
              description="Detailed breakdown of route costs considering flood penalties"
              icon="💰"
            />
            <FeatureCard
              title="Multi-Vehicle"
              description="Support for trucks and motorcycles with different flood tolerances"
              icon="🚛"
            />
            <FeatureCard
              title="Live Updates"
              description="Automatic route recalculation when flood conditions change"
              icon="🔄"
            />
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-6 md:p-8 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Optimize Routes?</h2>
            <p className="text-blue-100 mb-6 text-base md:text-lg">
              Experience intelligent flood-aware logistics routing in action
            </p>
            <button
              onClick={onStartApp}
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-3"
            >
              <Play size={24} fill="currentColor" />
              Launch Application
            </button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-slate-600 text-sm">
          <p>Built with React, TypeScript, Tailwind CSS, and Open-Meteo API</p>
          <p className="mt-2">
            <a href="https://github.com/yourusername" className="text-blue-600 hover:underline">
              View on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

// Reusable Components

const StatsCard = ({ title, value, subtitle, icon, color }) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white mb-3 md:mb-4`}>
        {icon}
      </div>
      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">{value}</h3>
      <p className="font-semibold text-slate-700 text-sm md:text-base">{title}</p>
      <p className="text-xs md:text-sm text-slate-500">{subtitle}</p>
    </div>
  );
};

const FeatureCard = ({ title, description, icon }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="text-3xl md:text-4xl mb-3">{icon}</div>
      <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>
  );
};

export default Dashboard;