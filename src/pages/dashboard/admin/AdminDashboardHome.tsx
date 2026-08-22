import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../app/store';
import { getAdminOverview } from '../../../features/admin/adminSlice';
import { Users, Home, Calendar, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';

const revenueData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

const propertiesData = [
  { name: 'Jan', added: 40, sold: 24 },
  { name: 'Feb', added: 30, sold: 13 },
  { name: 'Mar', added: 20, sold: 98 },
  { name: 'Apr', added: 27, sold: 39 },
  { name: 'May', added: 18, sold: 48 },
  { name: 'Jun', added: 23, sold: 38 },
  { name: 'Jul', added: 34, sold: 43 },
];

const recentActivities = [
  { id: 1, text: 'New user "John Doe" registered', time: '2 mins ago', type: 'user' },
  { id: 2, text: 'Property "Luxury Villa" was sold', time: '1 hour ago', type: 'property' },
  { id: 3, text: 'Agent "Sarah Smith" requested approval', time: '3 hours ago', type: 'agent' },
  { id: 4, text: 'Payment of $5,000 received for Booking #TRX-998', time: '5 hours ago', type: 'payment' },
];

export default function AdminDashboardHome() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { overview, isLoading } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(getAdminOverview());
  }, [dispatch]);

  const stats = [
    { title: 'Total Users', value: overview?.totalUsers || 0, change: '+12%', isPositive: true, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Total Properties', value: overview?.totalProperties || 0, change: '+5%', isPositive: true, icon: Home, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { title: 'Total Agents', value: overview?.totalAgents || 0, change: '+2%', isPositive: true, icon: Users, color: 'text-orange-500', bg: 'bg-orange-50' },
    { title: 'Total Revenue', value: overview?.totalRevenue || '$0', change: '+24%', isPositive: true, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Admin'}! 👋</h1>
          <p className="text-blue-100 max-w-lg text-lg">
            Here's what's happening on your platform today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={idx} 
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} strokeWidth={2.5} />
                </div>
                <span className={`flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-full ${
                  stat.isPositive ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
                }`}>
                  {stat.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Revenue Overview</h2>
              <p className="text-sm text-gray-500">Monthly platform earnings</p>
            </div>
            <button className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-blue-700 transition-colors">
              <TrendingUp className="w-4 h-4" /> View Report
            </button>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`$${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-6 flex-1">
            {recentActivities.map((activity, idx) => (
              <div key={activity.id} className="flex gap-4 relative">
                {idx !== recentActivities.length - 1 && (
                  <div className="absolute top-8 left-4 w-px h-full bg-gray-100 -ml-px"></div>
                )}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white ${
                  activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'property' ? 'bg-green-100 text-green-600' :
                  activity.type === 'agent' ? 'bg-orange-100 text-orange-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  <div className="w-2 h-2 rounded-full bg-current"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{activity.text}</p>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold rounded-xl text-sm transition-colors border border-gray-100">
            View All Activity
          </button>
        </div>
      </div>

      {/* Properties Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Properties Analytics</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={propertiesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="added" name="Added" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="sold" name="Sold" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
