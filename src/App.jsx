import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  PlayCircle, 
  Send, 
  Settings, 
  Bell, 
  User, 
  Plus, 
  Network, 
  Key, 
  HardDrive, 
  Cpu, 
  Undo2, 
  Redo2, 
  ZoomIn, 
  ZoomOut, 
  Maximize,
  ChevronRight,
  AlertTriangle,
  Activity,
  FileCode,
  CheckCircle2,
  Columns,
  GripHorizontal,
  Trash2,
  ArrowRight,
  TrendingUp,
  Fingerprint
} from 'lucide-react';

/**
 * Hardhat CloudGuard Studio - Final Version
 * Student: Shreyash
 * Resolution: 1920x1080 (Full HD)
 */

// Define Layout Constants globally
const FRAME_WIDTH = "1920px";
const FRAME_HEIGHT = "1080px";

// Icon mapping for rendering safety
const ICON_MAP = {
  ShieldCheck: ShieldCheck,
  Network: Network,
  Key: Key,
  Cpu: Cpu,
  HardDrive: HardDrive
};

// --- SHARED COMPONENTS ---

const Sidebar = ({ activeScreen, setActiveScreen }) => (
  <div className="w-[240px] bg-slate-50 border-r border-slate-200 h-full p-6 flex flex-col">
    <div className="space-y-1">
      {[
        { name: 'Dashboard', icon: LayoutDashboard, target: 'Dashboard' },
        { name: 'Policies', icon: ShieldCheck, target: 'Policy Designer' },
        { name: 'Simulations', icon: PlayCircle, target: 'Simulation Setup' },
        { name: 'Deployments', icon: Send, target: 'Deployment Preview' },
        { name: 'Settings', icon: Settings, target: 'Dashboard' },
      ].map((item) => (
        <div key={item.name} onClick={() => setActiveScreen(item.target)}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer font-medium text-sm transition-all ${
            activeScreen === item.target || (activeScreen === 'Simulation Results' && item.name === 'Simulations') ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50'
          }`}>
          <item.icon size={18} />
          {item.name}
        </div>
      ))}
    </div>
  </div>
);

const App = () => {
  const [activeScreen, setActiveScreen] = useState('Dashboard');
  const [showGrid, setShowGrid] = useState(false);
  const userName = "Shreyash";

  // --- STATE: Simulation ---
  const [selectedProvider, setSelectedProvider] = useState('GCP');
  const [selectedEnv, setSelectedEnv] = useState('Testing');
  const [simOptions, setSimOptions] = useState({
    highRisk: true,
    dependency: true,
    compare: false
  });

  // --- STATE: Designer ---
  const [nodes, setNodes] = useState([
    { id: 'n1', type: 'Network', label: 'Firewall Rule', x: 300, y: 300, iconName: 'ShieldCheck' },
    { id: 'n2', type: 'Network', label: 'VPC Network', x: 650, y: 400, iconName: 'Network' },
  ]);
  const [selectedNodeId, setSelectedNodeId] = useState('n1');
  const [draggingNode, setDraggingNode] = useState(null);
  const canvasRef = useRef(null);

  // --- LOGIC: Canvas Interactions ---
  const onDragStartSidebar = (e, item) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
  };

  const onDropCanvas = (e) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.round((e.clientX - rect.left - 90) / 24) * 24;
      const y = Math.round((e.clientY - rect.top - 40) / 24) * 24;
      const newNode = { id: `node-${Date.now()}`, ...data, x, y };
      setNodes(prev => [...prev, newNode]);
      setSelectedNodeId(newNode.id);
    } catch (err) {
      console.error("DND Error", err);
    }
  };

  const handleMouseDown = (id, e) => {
    e.stopPropagation();
    setSelectedNodeId(id);
    const rect = e.currentTarget.getBoundingClientRect();
    setDraggingNode({ id, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top });
  };

  const handleMouseMove = (e) => {
    if (!draggingNode) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = Math.round((e.clientX - canvasRect.left - draggingNode.offsetX) / 24) * 24;
    const newY = Math.round((e.clientY - canvasRect.top - draggingNode.offsetY) / 24) * 24;
    setNodes(prev => prev.map(n => n.id === draggingNode.id ? { ...n, x: newX, y: newY } : n));
  };

  const handleMouseUp = () => setDraggingNode(null);

  useEffect(() => {
    if (draggingNode) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingNode]);

  // --- RENDER HELPERS ---

  const TopNav = () => (
    <div className="h-[72px] w-full bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-lg shadow-blue-200">
          <ShieldCheck className="text-white" size={20} />
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Hardhat CloudGuard Studio</h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-inner">
          {['Dashboard', 'Policy Designer', 'Simulation Setup', 'Simulation Results', 'Deployment Preview'].map(s => (
            <button key={s} onClick={() => setActiveScreen(s)}
              className={`px-4 py-1.5 text-[12px] font-bold rounded-md transition-all ${activeScreen === s ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 border-l pl-6 border-slate-200">
          <Bell size={20} className="text-slate-400 cursor-pointer hover:text-blue-600 transition-colors" />
          <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <span className="text-sm font-bold text-slate-700">{userName}</span>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200 shadow-sm">
              <User size={18} className="text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="flex h-full">
      <Sidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      <div className="flex-1 p-12 overflow-y-auto bg-white">
        <div className="h-[220px] bg-gradient-to-br from-blue-600 to-blue-700 rounded-[40px] p-12 flex justify-between items-center mb-12 shadow-2xl shadow-blue-200">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-2 tracking-tight">Welcome back, {userName}</h2>
            <p className="text-blue-100 text-xl font-medium opacity-90">Design secure architectures and simulate policy impacts instantly.</p>
          </div>
          <button onClick={() => setActiveScreen('Policy Designer')} className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-xl flex items-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
            <Plus size={28} /> New Architecture
          </button>
        </div>

        <div className="flex justify-between items-center mb-10 px-4">
           <h3 className="text-2xl font-bold text-slate-900">Active Architecture Projects</h3>
        </div>

        <div className="grid grid-cols-3 gap-10">
          {[
            { name: "Main VPC Cluster", status: "Simulated", date: "Now", desc: "Enterprise production cluster with zero-trust networking." },
            { name: "Global IAM Standard", status: "Deployed", date: "2h ago", desc: "Corporate wide role standard for AWS & GCP." },
            { name: "Compliance Sandbox", status: "Draft", date: "Yesterday", desc: "Experimenting with strict outbound egress rules." },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-[32px] p-10 hover:shadow-2xl transition-all group border-b-4 border-b-blue-600/5 hover:border-b-blue-600 cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-2xl text-slate-800 tracking-tight">{item.name}</h4>
                <span className={`text-[10px] uppercase font-black px-4 py-1.5 rounded-full ${
                  item.status === 'Deployed' ? 'bg-green-100 text-green-700' : 
                  item.status === 'Simulated' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                }`}>{item.status}</span>
              </div>
              <p className="text-slate-500 mb-8 font-medium leading-relaxed">{item.desc}</p>
              <p className="text-xs text-slate-400 font-bold mb-10 tracking-widest uppercase flex items-center gap-2">
                <Activity size={14} className="text-blue-500" /> LAST MODIFIED: {item.date}
              </p>
              <button onClick={() => setActiveScreen('Policy Designer')} className="w-full py-5 bg-slate-50 text-slate-600 rounded-2xl font-black group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                Open Designer
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDesigner = () => {
    const libraryItems = [
      { type: "Network", label: "Firewall Rule", iconName: "ShieldCheck" },
      { type: "Network", label: "VPC Network", iconName: "Network" },
      { type: "IAM", label: "Service Account", iconName: "Key" },
      { type: "Compute", label: "VM Instance", iconName: "Cpu" },
      { type: "Storage", label: "Cloud Bucket", iconName: "HardDrive" },
    ];
    const selectedNode = nodes.find(n => n.id === selectedNodeId);

    return (
      <div className="flex h-full">
        <div className="w-[300px] border-r border-slate-200 bg-white p-8 z-10 flex flex-col shadow-sm">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10">Library Components</h3>
          <div className="space-y-10 flex-1 overflow-y-auto">
            {['Network', 'IAM', 'Compute'].map(cat => (
              <div key={cat}>
                <div className="text-[11px] font-black text-slate-900 mb-5 uppercase tracking-tighter flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" /> {cat}
                </div>
                <div className="space-y-3">
                  {libraryItems.filter(i => i.type === cat).map(item => {
                    const IconComp = ICON_MAP[item.iconName] || ShieldCheck;
                    return (
                      <div key={item.label} draggable onDragStart={(e) => onDragStartSidebar(e, item)}
                        className="h-16 w-full border border-slate-100 rounded-2xl bg-white flex items-center px-4 gap-4 cursor-grab hover:border-blue-400 hover:shadow-lg transition-all group">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                          <IconComp size={20} className="text-slate-400 group-hover:text-blue-500" />
                        </div>
                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div ref={canvasRef} onDragOver={(e) => e.preventDefault()} onDrop={onDropCanvas}
          className="flex-1 bg-slate-50 relative overflow-hidden select-none" 
          style={{ backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 0)', backgroundSize: '24px 24px' }}>
          
          <svg className="absolute inset-0 pointer-events-none w-full h-full opacity-30">
            {nodes.length >= 2 && nodes.slice(0, -1).map((node, i) => {
              const next = nodes[i + 1];
              const startX = node.x + 180;
              const startY = node.y + 40;
              const endX = next.x;
              const endY = next.y + 40;
              const cp1x = startX + (endX - startX) / 2;
              return <path key={i} d={`M ${startX} ${startY} C ${cp1x} ${startY}, ${cp1x} ${endY}, ${endX} ${endY}`} stroke="#3b82f6" strokeWidth="4" fill="transparent" strokeDasharray="12,8" />;
            })}
          </svg>

          {nodes.map(node => {
            const NodeIcon = ICON_MAP[node.iconName] || ShieldCheck;
            return (
              <div key={node.id} onMouseDown={(e) => handleMouseDown(node.id, e)} style={{ left: node.x, top: node.y }}
                className={`absolute w-[200px] h-[90px] bg-white border-2 rounded-[28px] flex flex-col items-center justify-center shadow-2xl transition-all z-10 ${
                  selectedNodeId === node.id ? 'border-blue-600 ring-[16px] ring-blue-600/5 scale-105' : 'border-slate-200 hover:border-slate-400 shadow-slate-200/50'
                }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${selectedNodeId === node.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>
                    <NodeIcon size={24} />
                  </div>
                  <span className="text-sm font-black text-slate-800 tracking-tight">{node.label}</span>
                </div>
                <GripHorizontal size={14} className="text-slate-200 mt-2" />
                {selectedNodeId === node.id && (
                  <button onMouseDown={(e) => { e.stopPropagation(); setNodes(nodes.filter(n => n.id !== node.id)); setSelectedNodeId(null); }}
                    className="absolute -top-4 -right-4 bg-red-500 text-white p-2.5 rounded-full shadow-lg hover:bg-red-600 transition-all hover:rotate-90">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="w-[380px] border-l border-slate-200 bg-white p-10 flex flex-col justify-between z-10 shadow-lg">
          {selectedNode ? (
            <div className="space-y-12">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Resource Config</h3>
              <div className="p-8 bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-[32px] shadow-sm">
                <div className="text-2xl font-black text-slate-800 mb-2">{selectedNode.label}</div>
                <div className="text-[10px] text-blue-500 font-mono font-bold tracking-widest flex items-center gap-2">
                  <Fingerprint size={12} /> ID: {selectedNode.id}
                </div>
              </div>
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Custom Identifier</label>
                  <input type="text" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[22px] font-bold text-sm focus:border-blue-500 focus:bg-white outline-none transition-all" defaultValue={selectedNode.label.toLowerCase().replace(/\s/g, "_")} />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Priority Index</label>
                  <input type="number" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[22px] font-bold text-sm focus:border-blue-500 focus:bg-white outline-none transition-all" defaultValue="1000" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-center px-10">
              <Activity size={48} className="text-slate-300 animate-pulse mb-8" />
              <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] leading-relaxed">Select component<br/>to edit logic</p>
            </div>
          )}
          <button onClick={() => setActiveScreen('Simulation Setup')} className="w-full py-6 bg-blue-600 text-white rounded-[28px] font-black text-xl shadow-[0_20px_50px_-10px_rgba(37,99,235,0.4)] hover:bg-blue-700 active:scale-95 transition-all">
            Proceed to Simulation
          </button>
        </div>
      </div>
    );
  };

  const renderSimSetup = () => (
    <div className="h-full bg-slate-50 p-20 flex flex-col items-center justify-center">
      <div className="text-center mb-20">
        <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-blue-200">Simulation Engine v4.0</div>
        <h2 className="text-6xl font-black text-slate-900 mb-6 tracking-tighter">Test Infrastructure Integrity</h2>
        <p className="text-slate-500 text-2xl font-medium max-w-[800px]">CloudGuard will analyze {userName}'s architecture against compliance rules for {selectedProvider}.</p>
      </div>
      <div className="w-[1000px] bg-white rounded-[60px] shadow-[0_60px_150px_-20px_rgba(0,0,0,0.1)] p-20 space-y-16 border border-slate-100">
        <section>
          <div className="flex justify-between items-end mb-10 border-b border-slate-50 pb-6">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">1. Targeted Provider</h4>
          </div>
          <div className="grid grid-cols-3 gap-10">
            {['GCP', 'AWS', 'Azure'].map(p => (
              <div key={p} onClick={() => setSelectedProvider(p)}
                className={`p-12 border-2 rounded-[40px] text-center font-black text-3xl transition-all cursor-pointer ${
                  selectedProvider === p ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-[0_0_50px_rgba(37,99,235,0.2)] scale-105' : 'border-slate-100 text-slate-400 hover:border-slate-200'
                }`}>
                {p}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-10 text-center">2. Target Deployment Tier</h4>
          <div className="flex gap-20 justify-center">
            {['Development', 'Testing', 'Production'].map(env => (
              <label key={env} className="flex items-center gap-5 cursor-pointer group">
                <div onClick={() => setSelectedEnv(env)}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedEnv === env ? 'border-blue-600 bg-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'border-slate-300 group-hover:border-slate-400 bg-slate-50'
                  }`}>
                  {selectedEnv === env && <div className="w-6 h-6 bg-blue-600 rounded-full shadow-inner animate-pulse" />}
                </div>
                <span className={`text-2xl font-black transition-colors tracking-tight ${selectedEnv === env ? 'text-slate-900' : 'text-slate-400'}`}>{env}</span>
              </label>
            ))}
          </div>
        </section>

        <div className="flex gap-10 pt-10">
          <button onClick={() => setActiveScreen('Simulation Results')} className="flex-1 h-[90px] bg-blue-600 text-white rounded-[32px] font-black text-3xl shadow-[0_30px_60px_-15px_rgba(37,99,235,0.5)] active:scale-95 flex items-center justify-center gap-5 transition-all hover:bg-blue-700">
            Run Analysis <PlayCircle size={36} />
          </button>
          <button onClick={() => setActiveScreen('Dashboard')} className="flex-1 h-[90px] bg-slate-100 text-slate-600 rounded-[32px] font-black text-2xl active:scale-95 transition-all hover:bg-slate-200">
            Discard
          </button>
        </div>
      </div>
    </div>
  );

  const renderSimResults = () => (
    <div className="h-full bg-white flex flex-col">
      <div className="h-[160px] bg-slate-50 border-b border-slate-200 px-24 flex items-center justify-center gap-20">
        {[
          { l: "Security Integrity", v: "98.2%", c: "text-green-500", bg: "bg-green-50", icon: ShieldCheck },
          { l: "Cloud Resource Impact", v: "14", c: "text-blue-600", bg: "bg-blue-50", icon: TrendingUp },
          { l: "Identified Conflicts", v: "0", c: "text-slate-400", bg: "bg-slate-100", icon: Activity },
        ].map((m, i) => (
          <div key={i} className="w-[380px] h-[100px] bg-white border border-slate-200 rounded-[32px] px-10 flex items-center justify-between shadow-sm border-b-4 border-b-blue-600/5">
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{m.l}</div>
              <div className={`text-4xl font-black ${m.c} tracking-tighter`}>{m.v}</div>
            </div>
            <div className={`w-14 h-14 rounded-2xl ${m.bg} flex items-center justify-center`}><m.icon size={32} className={m.c} /></div>
          </div>
        ))}
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-[560px] border-r border-slate-200 p-16 overflow-y-auto bg-slate-50/30">
          <div className="flex justify-between items-center mb-12">
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Impact Analysis</h3>
          </div>
          <div className="space-y-6">
            {[
              { s: "Cloud Firewall v2", m: "Global ingress rules hardened", risk: "Secure", detail: "Transitioned from 0.0.0.0/0 to internal subnet 10.0.0.0/8" },
              { s: "Internal DB Gateway", m: "TLS 1.3 enforced by default", risk: "Optimized", detail: "Legacy SSL versions deprecated automatically." },
              { s: "Auth0 Service Link", m: "IAM permissions restricted", risk: "Secure", detail: "Permissions reduced from Admin to NetworkAdmin." },
            ].map((item, i) => (
              <div key={i} className="w-full bg-white border border-slate-100 rounded-[36px] p-8 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <div className="font-black text-slate-800 text-xl tracking-tight">{item.s}</div>
                  <span className={`text-[10px] font-black uppercase px-4 py-1.5 ${item.risk === 'Secure' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'} rounded-full`}>{item.risk}</span>
                </div>
                <div className="text-sm text-slate-600 font-bold mb-3">{item.m}</div>
                <div className="text-xs text-slate-400 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 p-16 bg-slate-50 overflow-y-auto flex flex-col items-center">
          <div className="w-full max-w-[1100px] mb-14 flex justify-between items-end">
            <div>
              <h3 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">Simulation Visualizer</h3>
              <p className="text-slate-500 text-xl font-bold">Hardening results for {userName}'s project</p>
            </div>
            <div className="flex bg-white p-2.5 rounded-[24px] border border-slate-200 text-xs font-black gap-2 shadow-lg">
              <div className="px-6 py-3 bg-red-50 text-red-600 rounded-xl">Original State</div>
              <div className="px-6 py-3 bg-green-50 text-green-600 rounded-xl">CloudGuard AI</div>
            </div>
          </div>

          <div className="flex gap-14 items-center justify-center w-full max-w-[1100px]">
            <div className="flex-1 bg-white border border-slate-200 rounded-[50px] p-14 h-[600px] opacity-40">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12">Initial Vulnerable State</div>
              <div className="font-mono text-sm space-y-8 text-slate-400">
                <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100">
                  <div className="text-slate-800 font-black mb-4">vpc-ingress-all:</div>
                  <div className="pl-6 space-y-2 font-bold bg-red-50 px-2">source_range: "0.0.0.0/0"</div>
                </div>
              </div>
            </div>

            <ArrowRight size={56} className="text-blue-300" />

            <div className="flex-1 bg-white border-4 border-blue-600 rounded-[50px] p-14 shadow-2xl h-[600px] relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-[11px] font-black px-10 py-4 rounded-bl-[32px]">CIS COMPLIANT</div>
              <div className="text-[11px] font-black text-blue-600 uppercase tracking-[0.3em] mb-12">Hardened AI Config</div>
              <div className="font-mono text-sm space-y-10">
                <div className="bg-blue-50 p-10 rounded-[40px] border border-blue-100">
                  <div className="text-blue-700 font-black mb-8 flex items-center gap-3 text-lg">
                    <ShieldCheck size={28} /> cloudguard-secure-ingress:
                  </div>
                  <div className="space-y-6 font-bold">
                    <div className="flex justify-between items-center bg-red-100/40 px-4 py-1.5 line-through text-slate-400 rounded-lg">source: "0.0.0.0/0"</div>
                    <div className="flex justify-between items-center bg-green-100 px-4 py-3 text-green-700 rounded-2xl border border-green-200">source: "10.0.0.0/8"</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[150px] border-t border-slate-200 px-24 flex items-center justify-between bg-white shadow-lg">
        <button onClick={() => setActiveScreen('Policy Designer')} className="px-12 py-7 border-2 border-slate-200 text-slate-600 rounded-[28px] font-black text-xl hover:bg-slate-50">
          Re-Design Architecture
        </button>
        <button onClick={() => setActiveScreen('Deployment Preview')} className="bg-blue-600 text-white px-20 py-7 rounded-[36px] font-black text-3xl shadow-xl hover:bg-blue-700 transition-all">
          Review Blueprint
        </button>
      </div>
    </div>
  );

  const renderDeployment = () => (
    <div className="h-full bg-white flex flex-col p-24 overflow-y-auto">
      <div className="mb-20">
        <h2 className="text-7xl font-black text-slate-900 mb-6 tracking-tighter">Final Blueprint</h2>
        <p className="text-slate-500 text-3xl font-medium leading-relaxed max-w-[1100px]">Review the optimized code for {userName}'s cluster.</p>
      </div>
      <div className="flex gap-20 flex-1 min-h-[600px]">
        <div className="w-[1250px] bg-slate-900 rounded-[70px] p-24 overflow-y-auto shadow-2xl border border-slate-800">
          <pre className="font-mono text-2xl leading-[2.8] text-blue-300">
{`# ------------------------------------------------------------------
# CLOUDGUARD STUDIO v4.2 - OPTIMIZED FOR ${userName.toUpperCase()}
# PROVIDER: ${selectedProvider} | ENV: ${selectedEnv.toUpperCase()}
# ------------------------------------------------------------------

resource "cloud_optimized_stack" "main" {
  name    = "hardhat-cg-ingress"
  source_ranges = ["10.0.0.0/8"]
  target_tags   = ["secure-web-tier"]
}`}
          </pre>
        </div>
        <div className="w-[520px] flex flex-col gap-14 pt-16">
          <button onClick={() => setActiveScreen('Dashboard')} className="w-full h-[120px] bg-blue-600 text-white rounded-[44px] font-black text-4xl shadow-2xl hover:bg-blue-700 transition-all">
            Deploy Now
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8 font-sans">
      <div className="relative bg-white shadow-2xl rounded-[70px] overflow-hidden border border-white/10" style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT }}>
        <TopNav />
        <div className="flex flex-col h-[1008px] overflow-hidden">
          {activeScreen === 'Dashboard' && renderDashboard()}
          {activeScreen === 'Policy Designer' && renderDesigner()}
          {activeScreen === 'Simulation Setup' && renderSimSetup()}
          {activeScreen === 'Simulation Results' && renderSimResults()}
          {activeScreen === 'Deployment Preview' && renderDeployment()}
        </div>
        
        <div className="fixed bottom-12 right-12 flex flex-col gap-4 z-[100]">
          <button onClick={() => setShowGrid(!showGrid)} 
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all ${showGrid ? 'bg-red-500 text-white' : 'bg-white text-slate-900 border-2 border-slate-100'}`}>
            <Columns size={32} />
          </button>
          <div className="bg-black/90 backdrop-blur-md px-8 py-3 rounded-full text-[13px] font-black font-mono text-white text-center border border-white/20 shadow-2xl uppercase tracking-[0.2em]">
             SHREYASH_FHD_v2.0
          </div>
        </div>

        {showGrid && (
          <div className="absolute inset-0 pointer-events-none z-[99] px-[80px] flex gap-[24px] opacity-10">
            {[...Array(12)].map((_, i) => <div key={i} className="flex-1 bg-red-500 h-full" />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
