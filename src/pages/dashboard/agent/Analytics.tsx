import { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, TrendingUp, Users, Box, Calendar } from 'lucide-react';

export default function Analytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/agent/analytics`, { withCredentials: true });
        setData(res.data);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading analytics...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Failed to load data</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-indigo-50">
             <Box className="w-7 h-7 text-indigo-500" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Properties</p>
            <h3 className="text-2xl font-bold text-gray-900">{data.overview.totalProperties}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-orange-50">
             <Calendar className="w-7 h-7 text-orange-500" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Pending Requests</p>
            <h3 className="text-2xl font-bold text-gray-900">{data.overview.pendingRequests}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-green-50">
             <TrendingUp className="w-7 h-7 text-green-500" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900">{data.overview.totalRevenue}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-blue-50">
             <Users className="w-7 h-7 text-blue-500" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Leads</p>
            <h3 className="text-2xl font-bold text-gray-900">{data.overview.totalLeads}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" /> Revenue (Last 6 Months)
          </h2>
          <div className="flex items-end gap-2 h-64">
            {data.charts.revenueData.map((item: any, idx: number) => {
              const height = (item.revenue / 35000) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col justify-end group">
                  <div className="relative w-full flex justify-center">
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs py-1 px-2 rounded transition-opacity">
                      ${item.revenue.toLocaleString()}
                    </div>
                    <div 
                      className="w-full bg-indigo-500 rounded-t-sm transition-all duration-500 group-hover:bg-indigo-600"
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                  <div className="text-center text-xs text-gray-500 mt-2">{item.month}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Views Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-500" /> Profile & Property Views
          </h2>
          <div className="flex items-end gap-2 h-64">
            {data.charts.viewsData.map((item: any, idx: number) => {
              const height = (item.views / 2100) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col justify-end group">
                  <div className="relative w-full flex justify-center">
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs py-1 px-2 rounded transition-opacity">
                      {item.views.toLocaleString()}
                    </div>
                    <div 
                      className="w-full bg-blue-500 rounded-t-sm transition-all duration-500 group-hover:bg-blue-600"
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                  <div className="text-center text-xs text-gray-500 mt-2">{item.month}</div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
