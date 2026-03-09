import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MapPin, 
  Shield, 
  CheckCircle2, 
  Info, 
  HelpCircle, 
  BarChart3, 
  ChevronRight,
  LayoutDashboard,
  Scale,
  Search
} from 'lucide-react';
import { INITIAL_DATA } from './data';
import { Region, TeamMember, Role, RACIType } from './types';

const RACI_LEGEND = [
  { key: 'R', label: 'Responsável', description: 'Quem executa a tarefa.', color: 'bg-blue-500' },
  { key: 'A', label: 'Accountable (Dono)', description: 'Garante a execução e eficiência.', color: 'bg-emerald-500' },
  { key: 'C', label: 'Consultado', description: 'Pode ser consultado para auxiliar.', color: 'bg-amber-500' },
  { key: 'I', label: 'Informado', description: 'Deve ser informado sobre o andamento.', color: 'bg-slate-500' },
];

export default function App() {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const regions = INITIAL_DATA;

  const selectedRegion = useMemo(() => 
    regions.find(r => r.id === selectedRegionId), 
    [selectedRegionId, regions]
  );

  const stats = useMemo(() => {
    const totalMunicipalities = regions.reduce((acc, r) => acc + r.municipalities.length, 0);
    const totalAdvogados = new Set(regions.flatMap(r => r.team.filter(m => m.role === 'Advogado').map(m => m.id))).size;
    const avgMunPerRegion = (totalMunicipalities / regions.length).toFixed(1);
    
    // Calculate workload per person
    const workloadMap: Record<string, { name: string, role: Role, count: number, regions: string[] }> = {};
    
    regions.forEach(region => {
      region.team.forEach(member => {
        if (!workloadMap[member.id]) {
          workloadMap[member.id] = { 
            name: member.name, 
            role: member.role, 
            count: 0, 
            regions: [] 
          };
        }
        workloadMap[member.id].count += region.municipalities.length;
        workloadMap[member.id].regions.push(region.name);
      });
    });

    const workloadData = Object.values(workloadMap).sort((a, b) => b.count - a.count);
    
    return { totalMunicipalities, totalAdvogados, avgMunPerRegion, workloadData };
  }, [regions]);

  const filteredRegions = regions.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.municipalities.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-bottom border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Scale size={20} />
            </div>
            <h1 className="font-bold text-lg tracking-tight">Jurídico RACI</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Gestão de Demandas</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <button
            onClick={() => setSelectedRegionId(null)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              selectedRegionId === null 
                ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard Geral</span>
          </button>
          
          <div className="pt-4 pb-2 px-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Regiões</p>
          </div>

          {regions.map(region => (
            <button
              key={region.id}
              onClick={() => setSelectedRegionId(region.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                selectedRegionId === region.id 
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin size={18} className={selectedRegionId === region.id ? 'text-indigo-600' : 'text-slate-400'} />
                <span className="truncate">{region.name}</span>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                {region.municipalities.length}
              </span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <Info size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Período de Teste</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Avaliação de 30-60 dias para validar carga operacional.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar região ou município..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 rounded-xl transition-all outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Usuário</p>
              <p className="text-sm font-semibold text-slate-700">Gestor Geral</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-700 font-bold">
              GG
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {selectedRegionId === null ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard 
                    icon={<MapPin className="text-indigo-600" />} 
                    label="Total de Municípios" 
                    value={stats.totalMunicipalities} 
                    subtext="Distribuídos em 6 regiões"
                  />
                  <StatCard 
                    icon={<Users className="text-emerald-600" />} 
                    label="Advogados Gestores" 
                    value={stats.totalAdvogados} 
                    subtext="Responsáveis (Accountable)"
                  />
                  <StatCard 
                    icon={<BarChart3 className="text-amber-600" />} 
                    label="Média Mun. / Região" 
                    value={stats.avgMunPerRegion} 
                    subtext="Carga operacional média"
                  />
                </div>

                {/* Regions Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-slate-800">Visão Geral por Região</h2>
                      <div className="flex gap-2">
                        {RACI_LEGEND.map(item => (
                          <div key={item.key} className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-md shadow-sm">
                            <div className={`w-2 h-2 rounded-full ${item.color}`} />
                            <span className="text-[10px] font-bold text-slate-600">{item.key}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {filteredRegions.map(region => (
                        <RegionCard 
                          key={region.id} 
                          region={region} 
                          onClick={() => setSelectedRegionId(region.id)} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Workload Heatmap */}
                  <div className="xl:col-span-1 space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-slate-800">Carga de Trabalho</h2>
                      <BarChart3 size={20} className="text-slate-400" />
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                      <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                        Total de municípios sob responsabilidade direta ou indireta de cada integrante.
                      </p>
                      
                      <div className="space-y-6">
                        {stats.workloadData.map(person => (
                          <div key={person.name} className="space-y-2">
                            <div className="flex justify-between items-end">
                              <div>
                                <p className="text-sm font-bold text-slate-800">{person.name}</p>
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{person.role}</p>
                              </div>
                              <p className="text-sm font-black text-indigo-600">{person.count} <span className="text-[10px] text-slate-400 font-normal">Mun.</span></p>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(person.count / stats.totalMunicipalities) * 100}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full rounded-full ${
                                  person.role === 'Advogado' ? 'bg-emerald-500' : 
                                  person.role === 'Revisor' ? 'bg-blue-500' : 'bg-slate-400'
                                }`}
                              />
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {person.regions.map((reg, idx) => (
                                <span key={idx} className="text-[8px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-100">
                                  {reg}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="region-detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Region Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <button 
                      onClick={() => setSelectedRegionId(null)}
                      className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2 hover:underline flex items-center gap-1"
                    >
                      <ChevronRight size={14} className="rotate-180" /> Voltar ao Dashboard
                    </button>
                    <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                      {selectedRegion?.name}
                      <span className="text-sm font-normal text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                        {selectedRegion?.municipalities.length} Municípios
                      </span>
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Team Section */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Users size={16} /> Equipe Designada
                      </h3>
                      <div className="space-y-4">
                        {selectedRegion?.team.map(member => (
                          <div key={member.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white ${
                                member.raci === 'A' ? 'bg-emerald-500' : 'bg-blue-500'
                              }`}>
                                {member.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-800">{member.name}</p>
                                <p className="text-xs text-slate-500">{member.role}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                                member.raci === 'A' 
                                  ? 'bg-emerald-100 text-emerald-700' 
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {member.raci}
                              </span>
                              <span className="text-[8px] text-slate-400 mt-1 uppercase font-bold">
                                {member.raci === 'A' ? 'Accountable' : 'Responsible'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
                      <div className="relative z-10">
                        <h3 className="text-sm font-bold opacity-60 uppercase tracking-widest mb-4">Lembrete RACI</h3>
                        <div className="space-y-3">
                          {RACI_LEGEND.map(item => (
                            <div key={item.key} className="flex gap-3">
                              <span className="font-black text-indigo-300 w-4">{item.key}</span>
                              <p className="text-xs leading-relaxed">
                                <span className="font-bold">{item.label}:</span> {item.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="absolute -right-8 -bottom-8 opacity-10">
                        <Shield size={120} />
                      </div>
                    </div>
                  </div>

                  {/* Municipalities Section */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <MapPin size={16} /> Listagem de Municípios
                        </h3>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {selectedRegion?.municipalities.map((mun, idx) => (
                          <div key={mun.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                              <span className="text-xs font-mono text-slate-300 w-6">{String(idx + 1).padStart(2, '0')}</span>
                              <p className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">{mun.name}</p>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                <CheckCircle2 size={16} />
                              </button>
                              <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                <ChevronRight size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, subtext }: { icon: React.ReactNode, label: string, value: string | number, subtext: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 bg-slate-50 rounded-xl">
          {icon}
        </div>
        <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-black text-slate-900 mb-1">{value}</p>
        <p className="text-xs text-slate-500">{subtext}</p>
      </div>
    </div>
  );
}

interface RegionCardProps {
  region: Region;
  onClick: () => void;
  key?: string;
}

function RegionCard({ region, onClick }: RegionCardProps) {
  const gestores = region.team.filter(m => m.role === 'Advogado');
  
  return (
    <button 
      onClick={onClick}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-left hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50 transition-all group"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{region.name}</h3>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
            <MapPin size={12} /> {region.municipalities.length} municípios sob gestão
          </p>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
          <ChevronRight size={20} />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Equipe Gestora (A)</p>
          <div className="flex flex-wrap gap-2">
            {gestores.map(g => (
              <div key={g.id} className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100">
                <div className="w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                  {g.name.charAt(0)}
                </div>
                <span className="text-xs font-bold">{g.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex -space-x-2">
            {region.team.map((m, i) => (
              <div 
                key={m.id} 
                className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${
                  m.role === 'Advogado' ? 'bg-emerald-500' : m.role === 'Revisor' ? 'bg-blue-500' : 'bg-slate-400'
                }`}
                style={{ zIndex: 10 - i }}
              >
                {m.name.charAt(0)}
              </div>
            ))}
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {region.team.length} Integrantes
          </span>
        </div>
      </div>
    </button>
  );
}
