import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../app/store';
import { Box, Calendar, PieChart, Users, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAgentOverview } from '../../../features/agent/agentSlice';

export default function AgentDashboardHome() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { overview, isLoading } = useSelector((state: RootState) => state.agent);

  useEffect(() => {
    dispatch(getAgentOverview());
  }, [dispatch]);

  const stats = [
    { title: 'My Properties', value: overview?.totalListings || 0, icon: Box, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { title: 'Active Listings', value: overview?.activeListings || 0, icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-50' },
    { title: 'Pending Bookings', value: overview?.pendingBookings || 0, icon: Users, color: 'text-green-500', bg: 'bg-green-50' },
    { title: 'Profile Views', value: overview?.totalViews || 0, icon: PieChart, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-900 to-indigo-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Agent Overview, {user?.name || 'Agent'}! 🏡</h1>
          <p className="text-indigo-100 max-w-lg text-lg">
            Manage your property listings, track client requests, and analyze your performance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <Icon className={`w-7 h-7 ${stat.color}`} strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link to="/dashboard/agent/properties/add" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
             <Box className="w-6 h-6 text-gray-600 mb-2" />
             <span className="text-sm font-medium text-gray-700">Add Property</span>
          </Link>
          <Link to="/dashboard/agent/properties" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
             <Box className="w-6 h-6 text-gray-600 mb-2" />
             <span className="text-sm font-medium text-gray-700">My Listings</span>
          </Link>
          <Link to="/dashboard/agent/requests" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
             <Calendar className="w-6 h-6 text-gray-600 mb-2" />
             <span className="text-sm font-medium text-gray-700">View Requests</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
