import React, { useState, useEffect, useRef } from 'react';
import { 
  Truck, Bike, Map as MapIcon, Calculator, 
  Navigation, AlertTriangle, Droplets, 
  ChevronRight, Info, CheckCircle2, XCircle,
  Wifi, RefreshCw, Sliders, Play, Zap, List,
  Pause, SkipBack, SkipForward, Search, Cloud, Home
} from 'lucide-react';
import { floodDataService } from './services/floodDataService';
import toast, { Toaster } from 'react-hot-toast';
import Dashboard from './Dashboard';

// --- DATA GEOGRAFIS (JAKARTA) - JANGAN UBAH ---
const LOCATIONS = [
  // UTARA
  { id: 'TG_PRIOK', name: 'Pelabuhan Tg. Priok', x: 700, y: 50, type: 'warehouse', zone: 'North' },
  { id: 'PLUIT', name: 'Pluit/Muara Karang', x: 200, y: 60, type: 'flood_prone', zone: 'North' },
  { id: 'CLINCING', name: 'Cilincing', x: 800, y: 80, type: 'district', zone: 'North' },
  // BARAT
  { id: 'CENGKARENG', name: 'Cengkareng', x: 80, y: 150, type: 'district', zone: 'West' },
  { id: 'GROGOL', name: 'Grogol/Trisakti', x: 250, y: 200, type: 'flood_prone', zone: 'West' },
  // PUSAT
  { id: 'MONAS', name: 'Monas/Gambir', x: 450, y: 200, type: 'district', zone: 'Central' },
  { id: 'TN_ABANG', name: 'Tanah Abang', x: 380, y: 250, type: 'destination', zone: 'Central' },
  { id: 'MANGGARAI', name: 'Pintu Air Manggarai', x: 550, y: 280, type: 'flood_prone', zone: 'Central' },
  // TIMUR
  { id: 'KELAPA_GD', name: 'Kelapa Gading', x: 650, y: 150, type: 'flood_prone', zone: 'East' },
  { id: 'CAKUNG', name: 'Cakung/Pulo Gadung', x: 750, y: 180, type: 'district', zone: 'East' },
  { id: 'JATINEGARA', name: 'Jatinegara/Kp. Melayu', x: 600, y: 250, type: 'flood_prone', zone: 'East' },
  // SELATAN
  { id: 'BLOK_M', name: 'Blok M', x: 400, y: 400, type: 'district', zone: 'South' },
  { id: 'CILANDAK', name: 'Cilandak/Kemang', x: 420, y: 480, type: 'flood_prone', zone: 'South' },
  { id: 'PS_MINGGU', name: 'Pasar Minggu', x: 500, y: 450, type: 'district', zone: 'South' }
];

const CONNECTIONS = [
  ['TG_PRIOK', 'PLUIT', 12], ['TG_PRIOK', 'CLINCING', 8], ['TG_PRIOK', 'KELAPA_GD', 10],
  ['PLUIT', 'GROGOL', 8], ['PLUIT', 'MONAS', 10],
  ['CLINCING', 'CAKUNG', 6],
  ['CENGKARENG', 'GROGOL', 10], ['CENGKARENG', 'BLOK_M', 18],
  ['GROGOL', 'TN_ABANG', 5], ['GROGOL', 'MONAS', 4],
  ['MONAS', 'TN_ABANG', 3], ['MONAS', 'MANGGARAI', 4], ['MONAS', 'KELAPA_GD', 9],
  ['TN_ABANG', 'BLOK_M', 8], ['TN_ABANG', 'JATINEGARA', 7],
  ['KELAPA_GD', 'CAKUNG', 5], ['KELAPA_GD', 'JATINEGARA', 8],
  ['CAKUNG', 'JATINEGARA', 9],
  ['MANGGARAI', 'JATINEGARA', 3], ['MANGGARAI', 'PS_MINGGU', 10], ['MANGGARAI', 'TN_ABANG', 5],
  ['JATINEGARA', 'PS_MINGGU', 11],
  ['BLOK_M', 'CILANDAK', 5], ['BLOK_M', 'PS_MINGGU', 7],
  ['CILANDAK', 'PS_MINGGU', 6]
];

// --- KONSTANTA BIAYA ---
const COST_PARAMS = {
  TRUCK: { base: 5000, capacity: 100, floodPenalty: 2.5, maxFloodLevel: 2 },
  BIKE: { base: 2000, capacity: 20, floodPenalty: 1.5, maxFloodLevel: 3 }
};

// --- HELPER FUNCTIONS ---
const getDistance = (id1, id2) => {
  const conn = CONNECTIONS.find(c => (c[0] === id1 && c[1] === id2) || (c[0] === id2 && c[1] === id1));
  return conn ? conn[2] : Infinity;
};

// Algoritma Dijkstra / Branch & Bound yang Diperkaya (Capture All Steps)
const calculateOptimalPath = (startId, endId, floodLevels, vehicleType) => {
  const params = COST_PARAMS[vehicleType];
  const queue = [{ id: startId, path: [startId], g: 0, logs: [] }];
  const visited = new Map();
  
  let bestPath = null;
  let minCost = Infinity;
  let fullLogs = []; 
  let stepId = 0;

  fullLogs.push({
    id: stepId++,
    type: 'START',
    nodeId: startId,
    description: `🚀 Memulai pencarian dari ${LOCATIONS.find(l => l.id === startId)?.name}`
  });

  while (queue.length > 0) {
    queue.sort((a, b) => a.g - b.g);
    const current = queue.shift();

    fullLogs.push({
        id: stepId++,
        type: 'EXPLORE',
        nodeId: current.id,
        description: `📍 Mengunjungi ${LOCATIONS.find(l => l.id === current.id)?.name} (Total Cost: ${current.g.toFixed(1)})`
    });

    if (current.g >= minCost) {
       fullLogs.push({
          id: stepId++,
          type: 'PRUNE',
          nodeId: current.id,
          description: `✂️ Pruning: Jalur ini (${current.g}) > Best Found (${minCost}).`,
       });
       continue;
    }

    if (current.id === endId) {
      if (current.g < minCost) {
        minCost = current.g;
        bestPath = current;
        fullLogs.push({
            id: stepId++,
            type: 'FOUND_GOAL',
            nodeId: current.id,
            cost: current.g,
            description: `🏁 Tujuan tercapai! Solusi terbaik baru: ${minCost.toFixed(1)}`,
        });
      }
      continue;
    }

    if (visited.has(current.id) && visited.get(current.id) <= current.g) {
         fullLogs.push({
          id: stepId++,
          type: 'SKIP',
          nodeId: current.id,
          description: `⏭️ Skip: Node ini sudah dikunjungi dengan cost lebih efisien.`,
       });
       continue;
    }
    visited.set(current.id, current.g);

    const neighbors = CONNECTIONS
      .filter(c => c[0] === current.id || c[1] === current.id)
      .map(c => (c[0] === current.id ? c[1] : c[0]));

    for (const neighborId of neighbors) {
      const dist = getDistance(current.id, neighborId);
      const floodLvl = floodLevels[neighborId] || 0;
      
      let multiplier = 1;
      let isPassable = true;
      let note = "Normal";
      let status = 'OK';

      if (floodLvl > 0) {
        if (floodLvl > params.maxFloodLevel) {
          isPassable = false;
          status = 'BLOCKED';
          note = `Banjir Lvl ${floodLvl} > Max`;
        } else {
          multiplier = 1 + (floodLvl * 0.5); 
          note = `Banjir Lvl ${floodLvl}`;
        }
      }

      const edgeCost = dist * multiplier;
      const newCost = current.g + edgeCost;

      const neighborName = LOCATIONS.find(l => l.id === neighborId)?.name;
      
      fullLogs.push({
        id: stepId++,
        type: 'CHECK_NEIGHBOR',
        from: current.id,
        to: neighborId,
        status: status,
        edgeCost: edgeCost,
        description: `🔍 Cek ${neighborName}: ${status === 'BLOCKED' ? '⛔ Terblokir' : '✅ OK'} (+${edgeCost.toFixed(1)})`
      });

      if (isPassable) {
        const pathLog = {
            from: current.id,
            to: neighborId,
            baseDist: dist,
            floodLevel: floodLvl,
            multiplier: multiplier,
            edgeCost: edgeCost,
            totalCostSoFar: newCost,
            note: note
        };

        if (!visited.has(neighborId) || visited.get(neighborId) > newCost) {
            queue.push({
                id: neighborId,
                path: [...current.path, neighborId],
                g: newCost,
                logs: [...current.logs, pathLog]
            });
        }
      }
    }
  }

  return { path: bestPath ? bestPath.path : [], cost: minCost, logs: bestPath ? bestPath.logs : [], allExplorations: fullLogs };
};

// --- YOUR FLOOD LOGISTICS APP (RENAMED FROM App) ---
const FloodLogisticsApp = ({ onBackToDashboard }) => {
  const [activeTab, setActiveTab] = useState('map'); 
  const [floodLevels, setFloodLevels] = useState({});
  const [vehicleType, setVehicleType] = useState('TRUCK');
  const [startNode, setStartNode] = useState('TG_PRIOK');
  const [endNode, setEndNode] = useState('BLOK_M');
  const [selectedNodeId, setSelectedNodeId] = useState(null); 
  const [isSimulatingData, setIsSimulatingData] = useState(false);
  
  const [isLoadingRealData, setIsLoadingRealData] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState('');
  const [dataSource, setDataSource] = useState('manual');
  const [detailedFloodData, setDetailedFloodData] = useState([]);
  
  const [calculationResult, setCalculationResult] = useState({ path: [], cost: 0, logs: [], allExplorations: [] });
  const [algoStepIndex, setAlgoStepIndex] = useState(-1);
  const [isAlgoPlaying, setIsAlgoPlaying] = useState(false);
  const playbackTimerRef = useRef(null);

  const fetchRealFloodData = async () => {
    setIsLoadingRealData(true);
    
    try {
      toast.loading('Mengambil data banjir real...', { id: 'flood-fetch' });
      
      const realFloodData = await floodDataService.getAllFloodLevels();
      const detailedData = await floodDataService.getDetailedFloodData();
      
      setFloodLevels(realFloodData);
      setDetailedFloodData(detailedData);
      setDataSource('real');
      setLastUpdateTime(new Date().toLocaleTimeString('id-ID'));
      
      toast.success('Data banjir real berhasil dimuat! 🌊', { id: 'flood-fetch' });
      
    } catch (error) {
      console.error('Gagal mengambil data banjir:', error);
      toast.error('Gagal memuat data real', { id: 'flood-fetch' });
    } finally {
      setIsLoadingRealData(false);
    }
  };

  const handleOptimize = () => {
    const result = calculateOptimalPath(startNode, endNode, floodLevels, vehicleType);
    setCalculationResult(result);
    setAlgoStepIndex(-1);
    setIsAlgoPlaying(false);
  };

  useEffect(() => {
    handleOptimize();
  }, [floodLevels, vehicleType, startNode, endNode]);

  useEffect(() => {
    if (isAlgoPlaying) {
      playbackTimerRef.current = setInterval(() => {
        setAlgoStepIndex(prev => {
          if (prev >= calculationResult.allExplorations.length - 1) {
            setIsAlgoPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
    } else {
      clearInterval(playbackTimerRef.current);
    }
    return () => clearInterval(playbackTimerRef.current);
  }, [isAlgoPlaying, calculationResult]);

  const simulateLiveApi = () => {
    setIsSimulatingData(true);
    setTimeout(() => {
      const newLevels = {};
      LOCATIONS.forEach(loc => {
        const rand = Math.random();
        let lvl = 0;
        if (rand > 0.9) lvl = 4;
        else if (rand > 0.8) lvl = 3;
        else if (rand > 0.6) lvl = 2;
        else if (rand > 0.3) lvl = 1;
        newLevels[loc.id] = lvl;
      });
      setFloodLevels(newLevels);
      setDetailedFloodData([]);
      setDataSource('simulation');
      setIsSimulatingData(false);
      toast.success('Data simulasi berhasil dibuat!');
    }, 800);
  };

  const handleFloodSliderChange = (e) => {
    if (selectedNodeId) {
      const val = parseInt(e.target.value);
      setFloodLevels(prev => ({
        ...prev,
        [selectedNodeId]: val
      }));
      setDataSource('manual');
    }
  };

  const getNodeColor = (id) => {
    const level = floodLevels[id] || 0;
    if (level === 1) 
      return 'bg-blue-400 border-blue-500';
    if (level === 2) 
      return 'bg-yellow-400 border-yellow-500';
    if (level === 3) 
      return 'bg-orange-500 border-orange-600';
    if (level >= 4) 
      return 'bg-red-600 border-red-700';

    const location = LOCATIONS.find(l => l.id === id);
    const zone = location ? location.zone : 'Central';
    switch (zone) {
      case 'North': 
        return 'bg-cyan-500 border-cyan-700';
      case 'West': 
        return 'bg-amber-500 border-amber-700';
      case 'Central': 
        return 'bg-violet-500 border-violet-700';
      case 'East': 
        return 'bg-emerald-500 border-emerald-700';
      case 'South': 
        return 'bg-rose-500 border-rose-700';
      default: 
        return 'bg-slate-500 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Toaster position="top-right" />
      
      {/* ALL YOUR ORIGINAL JSX - Keep everything exactly as it was */}
      <header className="bg-slate-900 text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Navigation className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Flood Logistic App</h1>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <Wifi size={10} className="text-green-400"/> System Online • Graph & Cost Analysis
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Back to Dashboard Button */}
            <button
              onClick={onBackToDashboard}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-medium transition-all"
              title="Back to Dashboard"
            >
              <Home size={16} />
              <span className="hidden md:inline">Dashboard</span>
            </button>
            
            <div className="flex bg-slate-800 rounded-lg p-1">
              <button 
                onClick={() => setActiveTab('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'map' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MapIcon size={16} /> Peta & Kontrol
              </button>
              <button 
                onClick={() => setActiveTab('cost')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'cost' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calculator size={16} /> Analisis Biaya
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-6">
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            
            <div className="md:col-span-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Armada</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setVehicleType('TRUCK')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-lg border transition-all text-xs font-bold ${
                    vehicleType === 'TRUCK' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Truck size={16} /> TRUK
                </button>
                <button 
                  onClick={() => setVehicleType('BIKE')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-lg border transition-all text-xs font-bold ${
                    vehicleType === 'BIKE' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Bike size={16} /> MOTOR
                </button>
              </div>
            </div>

            <div className="md:col-span-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block flex items-center gap-1">
                <Droplets size={12}/> Sumber Data Banjir
              </label>
              <div className="flex gap-2">
                <button 
                  onClick={fetchRealFloodData}
                  disabled={isLoadingRealData}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-all text-xs font-bold"
                >
                  {isLoadingRealData ? (
                    <>
                      <RefreshCw className="animate-spin" size={14}/>
                      Loading...
                    </>
                  ) : (
                    <>
                      <Cloud size={14}/>
                      Real Data
                    </>
                  )}
                </button>
                
                <button 
                  onClick={simulateLiveApi}
                  disabled={isSimulatingData}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-lg bg-slate-600 text-white hover:bg-slate-700 disabled:opacity-50 transition-all text-xs font-bold"
                >
                  {isSimulatingData ? (
                    <>
                      <RefreshCw className="animate-spin" size={14}/>
                      ...
                    </>
                  ) : (
                    <>
                      <Zap size={14}/>
                      Simulasi
                    </>
                  )}
                </button>
              </div>
              
              {dataSource !== 'manual' && (
                <div className="mt-2 text-[10px] text-center">
                  {dataSource === 'real' ? (
                    <div className="flex items-center justify-center gap-1 text-green-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                      Live Flood API
                    </div>
                  ) : dataSource === 'simulation' ? (
                    <div className="flex items-center justify-center gap-1 text-blue-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      Simulated Data
                    </div>
                  ) : null}
                </div>
              )}
              
              {lastUpdateTime && (
                <div className="text-[9px] text-center text-slate-400 mt-1">
                  Update: {lastUpdateTime}
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex gap-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-200">
               <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-400 block mb-1">DARI</label>
                <select 
                  value={startNode} 
                  onChange={(e) => setStartNode(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-slate-700 outline-none"
                >
                  {LOCATIONS.map(loc => <option key={loc.id} value={loc.id} disabled={loc.id === endNode}>{loc.name}</option>)}
                </select>
               </div>
               <ChevronRight className="text-slate-300" />
               <div className="flex-1 text-right">
                <label className="text-[10px] font-bold text-slate-400 block mb-1">KE</label>
                <select 
                  value={endNode} 
                  onChange={(e) => setEndNode(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-slate-700 outline-none text-right"
                >
                  {LOCATIONS.map(loc => <option key={loc.id} value={loc.id} disabled={loc.id === startNode}>{loc.name}</option>)}
                </select>
               </div>
               <button 
                onClick={handleOptimize}
                className="ml-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-transform active:scale-95"
                title="Cari Rute Optimal"
               >
                 <Play size={20} fill="currentColor" />
               </button>
            </div>
          </div>
        </div>

        {activeTab === 'map' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            <div className="lg:col-span-1 space-y-4 order-2 lg:order-1">
               
               <div className={`bg-white p-4 rounded-xl shadow-sm border border-slate-200 transition-all ${algoStepIndex !== -1 ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="flex items-center gap-2 mb-4 text-slate-700">
                    <Sliders size={18} />
                    <h3 className="font-bold">Manual Intensity</h3>
                  </div>
                  
                  {selectedNodeId ? (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="text-xs text-slate-500 mb-1">Lokasi Terpilih:</div>
                      <div className="font-bold text-slate-800 mb-4 text-lg leading-tight">
                        {LOCATIONS.find(l => l.id === selectedNodeId)?.name}
                      </div>

                      {dataSource === 'real' && detailedFloodData.find(d => d.locationId === selectedNodeId) && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="text-xs font-bold text-blue-800 mb-2 flex items-center gap-1">
                            <Cloud size={12}/> Live Data
                          </div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-slate-600">River Discharge:</span>
                              <span className="font-mono font-bold text-blue-700">
                                {detailedFloodData.find(d => d.locationId === selectedNodeId)?.riverDischarge.toFixed(1)} m³/s
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Confidence:</span>
                              <span className="font-mono font-bold text-slate-700">
                                {(detailedFloodData.find(d => d.locationId === selectedNodeId)?.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 italic mt-2">
                              Data from satellite & ground sensors
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
                            <span>Ketinggian Air</span>
                            <span className={`px-2 py-0.5 rounded ${
                              (floodLevels[selectedNodeId] || 0) === 0 ? 'bg-emerald-100 text-emerald-700' :
                              (floodLevels[selectedNodeId] || 0) < 3 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>Level {floodLevels[selectedNodeId] || 0}</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" max="4" step="1"
                            value={floodLevels[selectedNodeId] || 0}
                            onChange={handleFloodSliderChange}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            disabled={dataSource === 'real'}
                          />
                          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                            <span>Aman</span>
                            <span>Siaga 1</span>
                          </div>
                          {dataSource === 'real' && (
                            <div className="text-[10px] text-amber-600 mt-2 italic">
                              ⚠️ Slider disabled when using real data
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                      <MapIcon className="mx-auto mb-2 opacity-50" size={24}/>
                      <p className="text-xs">Klik titik pada peta untuk {dataSource === 'real' ? 'melihat detail data real-time' : 'mengatur level banjir secara manual'}.</p>
                    </div>
                  )}
               </div>

               <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                 <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2">
                   <Search size={16} className="text-blue-500"/> Simulasi Algoritma
                 </h3>
                 
                 {calculationResult.path.length > 0 || calculationResult.allExplorations.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-slate-100 rounded-lg p-2">
                         <button 
                           onClick={() => { setAlgoStepIndex(0); setIsAlgoPlaying(false); }} 
                           className="p-1.5 hover:bg-slate-200 rounded text-slate-600" 
                           title="Reset"
                         >
                           <SkipBack size={16}/>
                         </button>
                         
                         <button 
                           onClick={() => {
                             if(algoStepIndex === -1) setAlgoStepIndex(0);
                             setIsAlgoPlaying(!isAlgoPlaying);
                           }} 
                           className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold text-white transition-all ${isAlgoPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                         >
                           {isAlgoPlaying ? <><Pause size={12}/> PAUSE</> : <><Play size={12}/> PLAY STEPS</>}
                         </button>

                         <button 
                           onClick={() => { setAlgoStepIndex(calculationResult.allExplorations.length - 1); setIsAlgoPlaying(false); }} 
                           className="p-1.5 hover:bg-slate-200 rounded text-slate-600" 
                           title="Skip to End"
                         >
                           <SkipForward size={16}/>
                         </button>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs font-mono min-h-[80px] flex flex-col justify-center">
                        {algoStepIndex === -1 ? (
                          <div className="text-center">
                             <div className="text-2xl font-bold text-blue-600 mb-1">{calculationResult.cost.toFixed(1)} <span className="text-xs font-normal text-slate-500">pts</span></div>
                             <div className="text-slate-500">Total Cost Final</div>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between text-slate-400 mb-1 font-bold uppercase tracking-wider">
                              <span>Step {algoStepIndex + 1}/{calculationResult.allExplorations.length}</span>
                              <span>{calculationResult.allExplorations[algoStepIndex]?.type}</span>
                            </div>
                            <div className="text-slate-800 font-medium leading-relaxed">
                              {calculationResult.allExplorations[algoStepIndex]?.description}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                 ) : (
                   <div className="text-xs text-red-500 font-medium">Rute tidak tersedia.</div>
                 )}
               </div>

               <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-xs">
                  <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <List size={14}/> Legenda Status
                  </h4>
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-500 mb-1 text-[10px] uppercase">Sumber Data</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Live API Data</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Simulated Data</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-400"></div> Manual Input</div>
                    
                    <div className="font-semibold text-slate-500 mt-3 mb-1 text-[10px] uppercase">Simulasi Algoritma</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border-2 border-yellow-500 bg-transparent"></div> Sedang Dicek</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-100 border border-red-500"></div> Blocked/Pruned</div>
                  </div>
               </div>

            </div>

            <div className="lg:col-span-3 order-1 lg:order-2">
              <MapView 
                locations={LOCATIONS} 
                connections={CONNECTIONS} 
                floodLevels={floodLevels}
                selectedNodeId={selectedNodeId}
                setSelectedNodeId={setSelectedNodeId}
                pathResult={calculationResult}
                getNodeColor={getNodeColor}
                algoStepIndex={algoStepIndex}
                algoLogs={calculationResult.allExplorations}
                dataSource={dataSource}
                detailedFloodData={detailedFloodData}
              />
            </div>
          </div>
        ) : (
          <CostAnalysis 
            pathResult={calculationResult} 
            vehicleType={vehicleType}
            floodLevels={floodLevels}
            params={COST_PARAMS[vehicleType]}
          />
        )}
      </main>
    </div>
  );
};

// --- SUB-COMPONENT: MAP VISUALIZATION ---
const MapView = ({ locations, connections, floodLevels, selectedNodeId, setSelectedNodeId, pathResult, getNodeColor, algoStepIndex, algoLogs, dataSource, detailedFloodData }) => {
  const viewBoxW = 900;
  const viewBoxH = 550;

  const isPlaybackActive = algoStepIndex !== -1;
  const currentLog = isPlaybackActive ? algoLogs[algoStepIndex] : null;
  
  const getDetailedInfo = (locationId) => {
    return detailedFloodData?.find(d => d.locationId === locationId);
  };

  const getEdgeStyle = (id1, id2) => {
    if (isPlaybackActive && currentLog) {
      if (currentLog.type === 'CHECK_NEIGHBOR') {
        if ((currentLog.from === id1 && currentLog.to === id2) || (currentLog.from === id2 && currentLog.to === id1)) {
          if (currentLog.status === 'BLOCKED') return { stroke: '#ef4444', width: 4, dash: '5,5' };
          return { stroke: '#fbbf24', width: 4, dash: 'none' };
        }
      }
      return { stroke: '#e2e8f0', width: 2, dash: 'none' };
    }

    const p = pathResult.path;
    if (!p || p.length < 2) return { stroke: '#cbd5e1', width: 2, dash: '5,5' };
    
    for (let i = 0; i < p.length - 1; i++) {
      if ((p[i] === id1 && p[i+1] === id2) || (p[i] === id2 && p[i+1] === id1)) {
        return { stroke: '#3b82f6', width: 5, dash: 'none', active: true };
      }
    }
    return { stroke: '#cbd5e1', width: 2, dash: '5,5' };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative h-full min-h-[500px]">
      {dataSource === 'real' && (
        <div className="absolute top-4 left-4 z-10 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-bold flex items-center gap-2">
          <Cloud size={14}/>
          LIVE FLOOD DATA
          <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
        </div>
      )}
      
      {dataSource === 'real' && detailedFloodData && detailedFloodData.length > 0 && (
        <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-200 max-w-xs">
          <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-2">
            <Droplets size={14} className="text-blue-500"/>
            Real-Time Flood Status
          </div>
          <div className="space-y-1 text-[10px]">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Locations Monitored:</span>
              <span className="font-bold text-slate-800">{detailedFloodData.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Active Floods:</span>
              <span className="font-bold text-red-600">
                {detailedFloodData.filter(d => d.floodLevel > 0).length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">High Risk (Lvl 3+):</span>
              <span className="font-bold text-orange-600">
                {detailedFloodData.filter(d => d.floodLevel >= 3).length}
              </span>
            </div>
            <div className="pt-2 mt-2 border-t border-slate-200 text-slate-500 italic">
              📊 River discharge shown below nodes
            </div>
          </div>
        </div>
      )}
      
      <svg viewBox={`0 0 ${viewBoxW} ${viewBoxH}`} className="w-full h-full bg-slate-50 cursor-crosshair">
        {connections.map((conn, idx) => {
          const start = locations.find(l => l.id === conn[0]);
          const end = locations.find(l => l.id === conn[1]);
          const style = getEdgeStyle(conn[0], conn[1]);
          
          return (
            <g key={idx}>
              <line 
                x1={start.x} y1={start.y} 
                x2={end.x} y2={end.y} 
                stroke={style.stroke} 
                strokeWidth={style.width}
                strokeDasharray={style.dash}
                className="transition-all duration-300"
              />
              {style.active && (
                 <circle r="4" fill="#60a5fa">
                   <animateMotion dur="1.5s" repeatCount="indefinite" path={`M${start.x},${start.y} L${end.x},${end.y}`} />
                 </circle>
              )}
              {!isPlaybackActive && (
                <text 
                  x={(start.x + end.x) / 2} 
                  y={(start.y + end.y) / 2 - 5} 
                  className="text-[10px] fill-slate-400 font-mono text-center"
                  textAnchor="middle"
                >
                  {conn[2]}
                </text>
              )}
            </g>
          );
        })}

        {locations.map(loc => {
          const level = floodLevels[loc.id] || 0;
          const isSelected = selectedNodeId === loc.id;
          const detailedInfo = getDetailedInfo(loc.id);
          
          let isCurrentAlgoNode = false;
          let isCheckingAlgoNode = false;
          
          if (isPlaybackActive && currentLog) {
             if (currentLog.nodeId === loc.id || currentLog.from === loc.id) isCurrentAlgoNode = true;
             if (currentLog.type === 'CHECK_NEIGHBOR' && currentLog.to === loc.id) isCheckingAlgoNode = true;
          }

          const isStart = pathResult.path[0] === loc.id;
          const isEnd = pathResult.path[pathResult.path.length - 1] === loc.id;

          return (
            <g 
              key={loc.id} 
              onClick={() => setSelectedNodeId(loc.id)}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              {isSelected && (
                 <circle 
                   cx={loc.x} cy={loc.y} r="28" 
                   className="fill-none stroke-blue-600 stroke-2 opacity-50 animate-ping"
                   style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
                 />
              )}

              {isCurrentAlgoNode && (
                <circle cx={loc.x} cy={loc.y} r="22" className="fill-none stroke-yellow-500 stroke-[3px]" strokeDasharray="4,2" />
              )}
              {isCheckingAlgoNode && (
                 <circle cx={loc.x} cy={loc.y} r="22" className="fill-none stroke-indigo-500 stroke-[3px]" />
              )}

              {level > 0 && !isSelected && (
                <circle cx={loc.x} cy={loc.y} r="25" className="fill-blue-500 opacity-20 animate-pulse" style={{ transformOrigin: 'center', transformBox: 'fill-box' }} />
              )}
              
              <circle 
                cx={loc.x} cy={loc.y} r="14" 
                className={`${getNodeColor(loc.id)} stroke-2 transition-colors duration-300 ${isSelected ? 'stroke-slate-900 stroke-[3px]' : ''}`} 
              />
              
              {level > 0 ? (
                <Droplets x={loc.x - 7} y={loc.y - 7} size={14} className="text-white" />
              ) : (
                <circle cx={loc.x} cy={loc.y} r="4" className="fill-white" />
              )}

              {isStart && !isPlaybackActive && (
                <g transform={`translate(${loc.x - 15}, ${loc.y - 35})`}>
                  <rect width="30" height="16" rx="4" fill="#1e293b" />
                  <text x="15" y="11" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">START</text>
                </g>
              )}
              {isEnd && !isPlaybackActive && (
                 <g transform={`translate(${loc.x - 15}, ${loc.y - 35})`}>
                 <rect width="30" height="16" rx="4" fill="#dc2626" />
                 <text x="15" y="11" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">GOAL</text>
               </g>
              )}

              <text 
                x={loc.x} y={loc.y + 28} 
                textAnchor="middle" 
                className={`text-[10px] font-medium bg-white ${isSelected ? 'fill-blue-700 font-bold' : 'fill-slate-600'}`}
              >
                {loc.name}
              </text>
              
              {level > 0 && dataSource === 'real' && detailedInfo && (
                <g>
                  <text x={loc.x} y={loc.y + 40} textAnchor="middle" className="text-[9px] fill-red-500 font-bold">
                    Lvl {level}
                  </text>
                  <text x={loc.x} y={loc.y + 50} textAnchor="middle" className="text-[8px] fill-slate-600 font-mono">
                    {detailedInfo.riverDischarge.toFixed(1)} m³/s
                  </text>
                </g>
              )}
              
              {level > 0 && dataSource !== 'real' && (
                <text x={loc.x} y={loc.y + 40} textAnchor="middle" className="text-[9px] fill-red-500 font-bold">
                  Lvl {level}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// --- SUB-COMPONENT: COST BREAKDOWN ---
const CostAnalysis = ({ pathResult, vehicleType, floodLevels, params }) => {
  const currencyFormatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' });
  const estimatedCostIDR = params.base + (pathResult.cost * 1500); 

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Calculator size={18} className="text-blue-500"/> Parameter Kalkulasi
          </h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
              <span className="text-slate-600">Kendaraan</span>
              <span className="font-bold text-slate-800">{vehicleType === 'TRUCK' ? 'Truk Logistik' : 'Motor Kurir'}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
              <span className="text-slate-600">Base Cost</span>
              <span className="font-mono text-slate-800">{currencyFormatter.format(params.base)}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
              <span className="text-slate-600">Max Flood Level</span>
              <span className="font-mono text-red-600 font-bold">Level {params.maxFloodLevel}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
              <span className="text-slate-600">Flood Penalty</span>
              <span className="font-mono text-slate-800">+{((params.floodPenalty - 1) * 100)}% / level</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
          <h4 className="text-blue-800 font-bold text-sm mb-2">Rumus Biaya Edge (Bobot)</h4>
          <code className="block bg-white p-3 rounded border border-blue-200 text-xs font-mono text-blue-900 mb-2">
            Cost = Jarak × (1 + (LevelBanjir × 0.5))
          </code>
          <p className="text-xs text-blue-600 leading-relaxed">
            Jika Level Banjir &gt; Max Level kendaraan (batas toleransi ketinggian banjir yang masih bisa dilewati oleh jenis kendaraan), jalur dianggap <strong>Infinity</strong> (terputus).
          </p>
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Step-by-Step Breakdown</h3>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
            Optimal Path
          </span>
        </div>

        {pathResult.path.length === 0 ? (
           <div className="p-8 text-center text-slate-400">
             <XCircle className="mx-auto mb-2" size={32}/>
             Tidak ada rute yang tersedia.
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-4">Segmen</th>
                  <th className="p-4 text-center">Jarak (km)</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Multiplier</th>
                  <th className="p-4 text-right">Sub-Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pathResult.logs.map((log, idx) => {
                  const fromName = LOCATIONS.find(l => l.id === log.from)?.name;
                  const toName = LOCATIONS.find(l => l.id === log.to)?.name;
                  
                  return (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800">{fromName}</span>
                          <span className="text-xs text-slate-400">↓ ke {toName}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center font-mono">{log.baseDist}</td>
                      <td className="p-4 text-center">
                        {log.floodLevel === 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                            <CheckCircle2 size={12}/> Aman
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                            <AlertTriangle size={12}/> Banjir Lvl {log.floodLevel}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center font-mono text-slate-600">
                        x{log.multiplier.toFixed(1)}
                      </td>
                      <td className="p-4 text-right font-bold text-slate-800">
                        {log.edgeCost.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200">
                <tr>
                  <td colSpan={4} className="p-4 text-right font-bold text-slate-600">Total Bobot Cost:</td>
                  <td className="p-4 text-right font-black text-blue-600 text-lg">{pathResult.cost.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={4} className="p-4 text-right font-bold text-slate-600">Estimasi Biaya (IDR):</td>
                  <td className="p-4 text-right font-bold text-slate-800">{currencyFormatter.format(estimatedCostIDR)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// --- WRAPPER COMPONENT (NEW - THIS INTEGRATES EVERYTHING) ---
const App = () => {
  const [showDashboard, setShowDashboard] = useState(true);

  return (
    <>
      {showDashboard ? (
        <Dashboard onStartApp={() => setShowDashboard(false)} />
      ) : (
        <FloodLogisticsApp onBackToDashboard={() => setShowDashboard(true)} />
      )}
    </>
  );
};

export default App;

