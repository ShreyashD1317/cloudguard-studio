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
  X,
  Link2
} from 'lucide-react';

// Icon mapping for serialization and rendering
const ICON_MAP = {
  ShieldCheck: ShieldCheck,
  Network: Network,
  Key: Key,
  Cpu: Cpu,
  HardDrive: HardDrive
};

const App = () => {
  const [activeScreen, setActiveScreen] = useState('Dashboard');
  const [showGrid, setShowGrid] = useState(false);
  const userName = "Shreyash";

  // Simulation State
  const [selectedProvider, setSelectedProvider] = useState('GCP');
  const [selectedEnv, setSelectedEnv] = useState('Testing');
  const [simOptions, setSimOptions] = useState({
    highRisk: true,
    dependency: true,
    compare: false
  });

  // Designer State (Nodes on the whiteboard)
  const [nodes, setNodes] = useState([
    { id: 'n1', type: 'Network', label: 'Firewall Rule', x: 240, y: 300, iconName: 'ShieldCheck' },
    { id: 'n2', type: 'Network', label: 'VPC Network', x: 600, y: 450, iconName: 'Network' },
  ]);
  const [selectedNodeId, setSelectedNodeId] = useState('n1');

  const FRAME_WIDTH = "1920px";
  const FRAME_HEIGHT = "1080px";

  const screens = [
    'Dashboard',
    'Policy Designer',
    'Simulation Setup',
    'Simulation Results',
    'Deployment Preview'
  ];

  // --- UI COMPONENTS ---
  const PrimaryButton = ({ label, icon: Icon, onClick }) => (
    <button 
      onClick={onClick}
      className="w-[160px] h-[48px] bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
    >
      {Icon && <Icon size={18} />}
      {label}
    </button>
  );

  const SecondaryButton = ({ label, onClick }) => (
    <button 
      onClick={onClick}
      className="w-[160px] h-[48px] border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-lg font-semibold flex items-center justify-center transition-all active:scale-95"
    >
      {label}
    </button>
  );

  const TopNav = () => (
    <div className="h-[72px] w-full bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-md">
          <ShieldCheck className="text-white" size={20} />
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Hardhat CloudGuard Studio</h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {screens.map(s => (
            <button 
              key={s} 
              onClick={() => setActiveScreen(s)}
              className={`px-3 py-1.5 text-[12px] font-bold rounded-md transition-all ${activeScreen === s ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 border-l pl-6 border-slate-200">
          <Bell size={20} className="text-slate-400 cursor-pointer hover:text-blue-600" />
          <div className="flex items-center gap-3 cursor-pointer group">
            <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{userName}</span>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm group-hover:border-blue-200">
              <User size={18} className="text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Sidebar = () => (
    <div className="w-[240px] bg-slate-50 border-r border-slate-200 h-full p-6 flex flex-col">
      <div className="space-y-1">
        {[
          { name: 'Dashboard', icon: LayoutDashboard, target: 'Dashboard' },
          { name: 'Policies', icon: ShieldCheck, target: 'Policy Designer' },
          { name: 'Simulations', icon: PlayCircle, target: 'Simulation Setup' },
          { name: 'Deployments', icon: Send, target: 'Deployment Preview' },
          { name: 'Settings', icon: Settings, target: 'Dashboard' },
        ].map((item) => (
          <div 
            key={item.name}
            onClick={() => setActiveScreen(item.target)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer font-medium text-sm transition-all ${
              activeScreen === item.target ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50'
            }`}
          >
            <item.icon size={18} />
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );

  // --- SCREEN COMPONENTS ---

  const Dashboard = () => (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1 p-10 overflow-y-auto bg-white relative">
        <div className="h-[160px] bg-blue-50 border border-blue-100 rounded-2xl p-10 flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome back, {userName}</h2>
            <p className="text-slate-600">Design, simulate, and deploy cloud policies with confidence.</p>
          </div>
          <PrimaryButton label="Create New Policy" icon={Plus} onClick={() => setActiveScreen('Policy Designer')} />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Policies</h3>
        <div className="grid grid-cols-3 gap-8 mb-12">
          {[
            { name: "Zero Trust VPC", status: "Simulated", date: "2 mins ago" },
            { name: "Global IAM Standard", status: "Deployed", date: "1 hour ago" },
            { name: "Production S3 Shield", status: "Draft", date: "Yesterday" },
          ].map((policy, i) => (
            <div key={i} className="min-w-[320px] h-[180px] bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer">
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-800">{policy.name}</h4>
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
                    policy.status === 'Deployed' ? 'bg-green-100 text-green-700' : 
                    policy.status === 'Simulated' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {policy.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Last Modified: {policy.date}</p>
              </div>
              <button onClick={() => setActiveScreen('Policy Designer')} className="w-full py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">Open</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PolicyDesigner = () => {
    const [draggingNode, setDraggingNode] = useState(null);
    const canvasRef = useRef(null);

    const libraryItems = [
      { type: "Network", label: "Firewall Rule", iconName: "ShieldCheck" },
      { type: "Network", label: "VPC Network", iconName: "Network" },
      { type: "IAM", label: "Service Account", iconName: "Key" },
      { type: "IAM", label: "IAM Policy", iconName: "ShieldCheck" },
      { type: "Compute", label: "VM Instance", iconName: "Cpu" },
      { type: "Storage", label: "Cloud Bucket", iconName: "HardDrive" },
    ];

    const onDragStartSidebar = (e, item) => {
      e.dataTransfer.setData("application/json", JSON.stringify(item));
    };

    const onDropCanvas = (e) => {
      e.preventDefault();
      try {
        const data = JSON.parse(e.dataTransfer.getData("application/json"));
        const rect = canvasRef.current.getBoundingClientRect();
        let x = Math.round((e.clientX - rect.left - 70) / 24) * 24;
        let y = Math.round((e.clientY - rect.top - 30) / 24) * 24;
        const newNode = { id: `node-${Date.now()}`, ...data, x, y };
        setNodes([...nodes, newNode]);
        setSelectedNodeId(newNode.id);
      } catch (err) {}
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
      let newX = Math.round((e.clientX - canvasRect.left - draggingNode.offsetX) / 24) * 24;
      let newY = Math.round((e.clientY - canvasRect.top - draggingNode.offsetY) / 24) * 24;
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

    const deleteNode = (id) => {
      setNodes(nodes.filter(n => n.id !== id));
      if (selectedNodeId === id) setSelectedNodeId(null);
    };

    const selectedNode = nodes.find(n => n.id === selectedNodeId);

    return (
      <div className="flex h-full">
        <div className="w-[260px] border-r border-slate-200 bg-white p-6 z-10 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Components</h3>
          <p className="text-[10px] text-slate-400 mb-4 italic">Drag components to whiteboard</p>
          <div className="space-y-6 flex-1 overflow-y-auto pr-2">
            {['Network', 'IAM', 'Compute', 'Storage'].map(cat => (
              <div key={cat}>
                <div className="text-xs font-bold text-slate-900 mb-3">{cat}</div>
                <div className="space-y-2">
                  {libraryItems.filter(i => i.type === cat).map(item => {
                    const Icon = ICON_MAP[item.iconName] || ShieldCheck;
                    return (
                      <div 
                        key={item.label}
                        draggable
                        onDragStart={(e) => onDragStartSidebar(e, item)}
                        className="h-12 w-full border border-slate-100 rounded-lg bg-slate-50 flex items-center px-3 gap-3 cursor-grab hover:border-blue-400 hover:bg-blue-50 transition-all active:cursor-grabbing group shadow-sm"
                      >
                        <Icon size={16} className="text-slate-400 group-hover:text-blue-500" />
                        <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div 
          ref={canvasRef}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDropCanvas}
          className="flex-1 bg-slate-50 relative overflow-hidden select-none" 
          style={{ backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 0)', backgroundSize: '24px 24px' }}
        >
          <svg className="absolute inset-0 pointer-events-none w-full h-full">
            {nodes.length >= 2 && nodes.slice(0, -1).map((node, i) => {
              const next = nodes[i + 1];
              const startX = node.x + 140;
              const startY = node.y + 30;
              const endX = next.x;
              const endY = next.y + 30;
              const cp1x = startX + (endX - startX) / 2;
              return (
                <path 
                  key={`path-${i}`}
                  d={`M ${startX} ${startY} C ${cp1x} ${startY}, ${cp1x} ${endY}, ${endX} ${endY}`} 
                  stroke="#3b82f6" 
                  strokeWidth="2" 
                  fill="transparent" 
                  strokeDasharray="6,4" 
                  className="opacity-40"
                />
              );
            })}
          </svg>

          {nodes.map(node => {
            const Icon = ICON_MAP[node.iconName] || ShieldCheck;
            return (
              <div 
                key={node.id}
                onMouseDown={(e) => handleMouseDown(node.id, e)}
                style={{ left: node.x, top: node.y }}
                className={`absolute w-[140px] h-[60px] bg-white border-2 rounded-xl flex flex-col items-center justify-center shadow-lg transition-all z-10 ${
                  selectedNodeId === node.id ? 'border-blue-600 shadow-blue-100 scale-105' : 'border-slate-300 hover:border-slate-400'
                } ${draggingNode?.id === node.id ? 'cursor-grabbing opacity-80' : 'cursor-grab'}`}
              >
                <div className="flex items-center gap-2">
                  <Icon size={16} className={selectedNodeId === node.id ? 'text-blue-600' : 'text-slate-400'} />
                  <span className="text-[11px] font-bold text-slate-700">{node.label}</span>
                </div>
                <GripHorizontal size={12} className="text-slate-200 mt-1" />
                {selectedNodeId === node.id && (
                  <button 
                    onMouseDown={(e) => { e.stopPropagation(); deleteNode(node.id); }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-sm"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            );
          })}
          
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white px-5 py-3 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-5 z-20">
            <Undo2 size={18} className="text-slate-300 cursor-pointer" />
            <Redo2 size={18} className="text-slate-300 cursor-pointer" />
            <div className="w-px h-6 bg-slate-200" />
            <ZoomIn size={18} className="text-slate-400 cursor-pointer hover:text-blue-600" />
            <span className="text-xs font-bold text-slate-600">100%</span>
            <ZoomOut size={18} className="text-slate-400 cursor-pointer hover:text-blue-600" />
          </div>
        </div>

        <div className="w-[300px] border-l border-slate-200 bg-white p-6 flex flex-col justify-between z-10 shadow-sm">
          {selectedNode ? (
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Properties</h3>
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="text-sm font-bold text-slate-800">{selectedNode.label}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">Resource ID: {selectedNode.id.split('-')[1] || selectedNode.id}</div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Resource Name</label>
                    <input type="text" className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-blue-500 outline-none" defaultValue={selectedNode.label.toLowerCase().replace(" ", "-")} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Priority</label>
                    <input type="number" className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold" defaultValue="1000" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-300">
              <Activity size={48} className="mb-4 opacity-20" />
              <p className="text-xs font-bold uppercase tracking-widest leading-relaxed text-slate-400">Select a component<br/>on whiteboard to edit</p>
            </div>
          )}
          <PrimaryButton label="Run Simulation" onClick={() => setActiveScreen('Simulation Setup')} />
        </div>
      </div>
    );
  };

  const SimulationSetup = () => (
    <div className="h-full bg-slate-50 p-10 flex flex-col items-center justify-center">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Run Simulation</h2>
        <p className="text-slate-500">Configure parameters for impact analysis on {userName}'s policies.</p>
      </div>
      <div className="w-[800px] bg-white rounded-3xl shadow-2xl border border-slate-100 p-12 space-y-10">
        <section>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Cloud Provider</h4>
          <div className="grid grid-cols-3 gap-4">
            {['GCP', 'AWS', 'Azure'].map(p => (
              <div 
                key={p} 
                onClick={() => setSelectedProvider(p)}
                className={`p-6 border-2 rounded-2xl text-center font-bold transition-all cursor-pointer ${
                  selectedProvider === p 
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.2)]' 
                  : 'border-slate-100 text-slate-400 hover:border-slate-200'
                }`}
              >
                {p}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Target Environment</h4>
          <div className="flex gap-8">
            {['Development', 'Testing', 'Production'].map(env => (
              <label key={env} className="flex items-center gap-3 cursor-pointer group">
                <div 
                  onClick={() => setSelectedEnv(env)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedEnv === env ? 'border-blue-600 bg-white' : 'border-slate-300 group-hover:border-slate-400'
                  }`}
                >
                  {selectedEnv === env && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
                </div>
                <span className={`text-sm font-semibold transition-colors ${selectedEnv === env ? 'text-slate-900' : 'text-slate-400'}`} onClick={() => setSelectedEnv(env)}>
                  {env}
                </span>
              </label>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Simulation Options</h4>
          <div className="space-y-4">
            {[
              { id: 'highRisk', label: 'Show high-risk changes only' },
              { id: 'dependency', label: 'Include dependency analysis' },
              { id: 'compare', label: 'Compare with previous version' }
            ].map(opt => (
              <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                <div 
                  onClick={() => setSimOptions({...simOptions, [opt.id]: !simOptions[opt.id]})}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                    simOptions[opt.id] ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-slate-400'
                  }`}
                >
                  {simOptions[opt.id] && <CheckCircle2 size={14} className="text-white" />}
                </div>
                <span className={`text-sm font-semibold transition-colors ${simOptions[opt.id] ? 'text-slate-900' : 'text-slate-400'}`} onClick={() => setSimOptions({...simOptions, [opt.id]: !simOptions[opt.id]})}>
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </section>

        <div className="flex gap-4 pt-4">
          <button className="flex-1 h-[64px] bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition-all" onClick={() => setActiveScreen('Simulation Results')}>
            Run Simulation
          </button>
          <button className="flex-1 h-[64px] bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 active:scale-95 transition-all" onClick={() => setActiveScreen('Dashboard')}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const SimulationResults = () => (
    <div className="h-full bg-white flex flex-col">
      <div className="h-[120px] bg-slate-50 border-b border-slate-200 px-10 flex items-center justify-center gap-8">
        {[
          { l: "Risk Score", v: "Medium", c: "text-amber-500", bg: "bg-amber-50" },
          { l: "Impacted Services", v: "3", c: "text-blue-600", bg: "bg-blue-50" },
          { l: "Potential Issues", v: "2", c: "text-red-500", bg: "bg-red-50" },
        ].map((m, i) => (
          <div key={i} className="w-[300px] h-[80px] bg-white border border-slate-200 rounded-xl px-6 flex items-center justify-between shadow-sm">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">{m.l}</div>
              <div className={`text-xl font-bold ${m.c}`}>{m.v}</div>
            </div>
            <div className={`w-10 h-10 rounded-lg ${m.bg} flex items-center justify-center`}><Activity size={20} className={m.c} /></div>
          </div>
        ))}
      </div>
      <div className="flex-1 p-16 bg-slate-50 flex flex-col items-center overflow-y-auto">
        <div className="w-full max-w-[1000px] mb-12 flex justify-between items-end">
          <h3 className="text-3xl font-black text-slate-900">Architecture Diff</h3>
          <div className="flex bg-white p-2 rounded-2xl border border-slate-200 text-xs font-black gap-2">
            <div className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl">Legacy</div>
            <div className="px-5 py-2.5 bg-green-50 text-green-600 rounded-xl">Optimized</div>
          </div>
        </div>
        <div className="flex gap-12 items-center w-full max-w-[1000px]">
          <div className="flex-1 bg-white border rounded-[40px] p-12 h-[500px] opacity-40">
             <div className="font-mono text-sm space-y-4">
                <div className="text-slate-800 font-bold underline">vpc-ingress:</div>
                <div className="pl-4">source: "0.0.0.0/0"</div>
                <div className="pl-4">ports: ["*"]</div>
             </div>
          </div>
          <ArrowRight size={48} className="text-blue-200" />
          <div className="flex-1 bg-white border-2 border-blue-600 rounded-[40px] p-12 h-[500px] shadow-2xl">
             <div className="font-mono text-sm space-y-4">
                <div className="text-blue-700 font-black">hardened-ingress:</div>
                <div className="line-through text-slate-300">source: "0.0.0.0/0"</div>
                <div className="text-green-700 font-bold bg-green-50 px-2 rounded">source: "10.0.0.0/8"</div>
                <div className="line-through text-slate-300">ports: ["*"]</div>
                <div className="text-green-700 font-bold bg-green-50 px-2 rounded">ports: ["443", "80"]</div>
             </div>
          </div>
        </div>
        <button onClick={() => setActiveScreen('Deployment Preview')} className="mt-12 bg-blue-600 text-white px-12 py-6 rounded-[32px] font-black text-2xl shadow-xl hover:bg-blue-700 transition-all">
          Approve for Deployment
        </button>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className="w-[480px] border-r border-slate-200 p-8 overflow-y-auto">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Impact Analysis</h3>
          <div className="space-y-4">
            {[
              { s: "Service A", m: "External access removed", i: AlertTriangle },
              { s: "Service B", m: "Port 443 blocked", i: Activity },
              { s: "Service C", m: "New IAM role required", i: Key },
            ].map((item, i) => (
              <div key={i} className="w-full h-[80px] border border-slate-100 rounded-xl p-4 flex items-center gap-4 hover:border-blue-300 transition-all cursor-pointer group">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-blue-500"><item.i size={20} /></div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">{item.s}</div>
                  <div className="text-xs text-slate-500">{item.m}</div>
                </div>
                <ChevronRight size={16} className="ml-auto text-slate-300" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-8 bg-slate-50 overflow-y-auto">
          <div className="flex gap-6 justify-center mt-10">
            <div className="w-[400px] h-[500px] bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase mb-4">Before Simulation</div>
              <div className="p-4 bg-slate-50 rounded border border-slate-200 h-full opacity-50 flex items-center justify-center text-slate-400 font-bold">Standard Network Stack</div>
            </div>
            <div className="w-[400px] h-[500px] bg-white border border-blue-200 rounded-xl p-8 shadow-md relative">
              <div className="text-xs font-bold text-blue-600 uppercase mb-4">Post Simulation</div>
              <div className="p-4 bg-blue-50 rounded border border-blue-100 h-full flex items-center justify-center text-blue-600 font-bold text-center">Optimized Security Architecture</div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[100px] border-t border-slate-200 px-10 flex items-center justify-between bg-white">
        <SecondaryButton label="Adjust Policy" onClick={() => setActiveScreen('Policy Designer')} />
        <PrimaryButton label="Approve Deployment" onClick={() => setActiveScreen('Deployment Preview')} />
      </div>
    </div>
  );

  const DeploymentPreview = () => (
    <div className="h-full bg-white flex flex-col p-10 overflow-y-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Deployment Preview</h2>
        <p className="text-slate-500">Review generated policy-as-code for {selectedProvider} / {selectedEnv}.</p>
      </div>
      <div className="flex gap-10 flex-1 min-h-[600px]">
        <div className="w-[1000px] bg-slate-900 rounded-2xl p-8 overflow-y-auto shadow-inner border border-slate-800">
          <pre className="font-mono text-sm leading-relaxed text-blue-300">
{`# Generated by CloudGuard Studio for ${userName}
# Provider: ${selectedProvider} | Env: ${selectedEnv}

resource "cloud_network_policy" "main" {
  name = "prod-vpc-shield"
  
  rules {
    priority = 1000
    action   = "allow"
    ports    = ["443", "80"]
    source   = "internal_vpc"
  }
}`}
          </pre>
        </div>
        <div className="w-[360px] flex flex-col gap-8">
          <PrimaryButton label="Send to CI/CD" icon={Send} onClick={() => setActiveScreen('Dashboard')} />
          <p className="text-xs text-slate-400 leading-relaxed">By sending to CI/CD, your architecture will be validated against enterprise compliance benchmarks automatically.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-8 font-sans selection:bg-blue-100 overflow-auto">
      <div className="relative bg-white shadow-[0_40px_100px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden" style={{ width: "1920px", height: "1080px" }}>
        <TopNav />
        <div className="flex flex-col h-[1008px] overflow-hidden">
          {activeScreen === 'Dashboard' && <Dashboard />}
          {activeScreen === 'Policy Designer' && <PolicyDesigner />}
          {activeScreen === 'Simulation Setup' && <SimulationSetup />}
          {activeScreen === 'Simulation Results' && <SimulationResults />}
          {activeScreen === 'Deployment Preview' && <DeploymentPreview />}
        </div>
      </div>
    </div>
  );
};

export default App;
