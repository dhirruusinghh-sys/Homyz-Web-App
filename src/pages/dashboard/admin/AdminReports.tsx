import { Download, Calendar as CalendarIcon, TrendingUp, Users, Home } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const growthData = [
  { name: 'Jan', users: 400, properties: 240, agents: 24 },
  { name: 'Feb', users: 500, properties: 310, agents: 35 },
  { name: 'Mar', users: 700, properties: 450, agents: 48 },
  { name: 'Apr', users: 1100, properties: 580, agents: 60 },
  { name: 'May', users: 1500, properties: 720, agents: 85 },
  { name: 'Jun', users: 2100, properties: 910, agents: 112 },
  { name: 'Jul', users: 2800, properties: 1200, agents: 145 },
];

const revenueByCity = [
  { name: 'New York', value: 450000 },
  { name: 'Los Angeles', value: 380000 },
  { name: 'Austin', value: 210000 },
  { name: 'Miami', value: 320000 },
  { name: 'Chicago', value: 150000 },
];

const propertyTypes = [
  { name: 'Villas', value: 45 },
  { name: 'Apartments', value: 35 },
  { name: 'Penthouses', value: 15 },
  { name: 'Condos', value: 5 },
];

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];

export default function AdminReports() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Reports & Analytics</h1>
          <p className="text-sm text-gray-500">In-depth insights into platform growth and revenue</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm">
            <CalendarIcon className="w-4 h-4" />
            Last 7 Months
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Export Full Report
          </button>
        </div>
      </div>

      {/* Main Growth Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Platform Growth</h2>
            <p className="text-sm text-gray-500">Users, Properties, and Agents acquisition</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-xs text-gray-500">Users</span></div>
             <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-xs text-gray-500">Properties</span></div>
             <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-yellow-500"></div><span className="text-xs text-gray-500">Agents</span></div>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              <Area type="monotone" dataKey="properties" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProps)" />
              <Area type="monotone" dataKey="agents" stroke="#f59e0b" strokeWidth={3} fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by City Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Revenue by City</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByCity} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4b5563', fontWeight: 500 }} />
                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="value" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={24}>
                  {revenueByCity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Property Types Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Property Types Distribution</h2>
          <div className="h-72 w-full flex-1 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={propertyTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {propertyTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => [`${value}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-3xl font-bold text-gray-900">4</span>
               <span className="text-sm text-gray-500">Categories</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
             {propertyTypes.map((type, idx) => (
               <div key={idx} className="flex items-center gap-1.5">
                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                 <span className="text-xs font-medium text-gray-600">{type.name}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
