import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../app/store';
import { getNewsletters, deleteNewsletter } from '../../../features/admin/adminSlice';
import { Mail, Users, Trash2 } from 'lucide-react';

export default function AdminNewsletters() {
  const dispatch = useDispatch<AppDispatch>();
  const { newsletters, isLoading } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(getNewsletters());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this subscriber?')) {
      dispatch(deleteNewsletter(id));
    }
  };

  const stats = [
    { label: 'Total Subscribers', value: newsletters?.length || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
          <p className="text-sm text-gray-500">Manage your newsletter subscribers list</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Subscribers List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                <th className="py-4 px-6 font-semibold">Email</th>
                <th className="py-4 px-6 font-semibold">Subscribed Date</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {newsletters?.map((sub) => (
                <tr key={sub._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-gray-900 text-sm">
                    {sub.email}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                     <button 
                       onClick={() => handleDelete(sub._id)}
                       className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded"
                     >
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </td>
                </tr>
              ))}
              {(!newsletters || newsletters.length === 0) && (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-gray-500">
                    No subscribers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
