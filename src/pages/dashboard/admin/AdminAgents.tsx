import { CheckCircle, XCircle, Search, Filter, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../app/store';
import { getAgents, updateAgentStatus } from '../../../features/admin/adminSlice';

export default function AdminAgents() {
  const dispatch = useDispatch<AppDispatch>();
  const { agents, isLoading } = useSelector((state: RootState) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getAgents());
  }, [dispatch]);

  const handleAgentStatus = (id: string, newStatus: string) => {
    if (window.confirm(`Are you sure you want to mark this agent as ${newStatus.toUpperCase()}?`)) {
      dispatch(updateAgentStatus({ id, agentStatus: newStatus }));
    }
  };

  const filteredAgents = agents?.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.email.toLowerCase().includes(searchTerm.toLowerCase())) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Agents</h1>
          <p className="text-sm text-gray-500">Approve or reject real estate agent applications</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
          <button className="p-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                <th className="py-4 px-6 font-semibold">Agent Details</th>
                <th className="py-4 px-6 font-semibold">Contact Info</th>
                <th className="py-4 px-6 font-semibold">Performance</th>
                <th className="py-4 px-6 font-semibold">Verification Status</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAgents.map((agent) => (
                <tr key={agent._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={agent.avatar} alt="" className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-200" />
                        {agent.agentStatus === 'approved' && (
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                            <ShieldCheck className="w-4 h-4 text-blue-500 fill-blue-100" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{agent.name}</p>
                        <p className="text-xs text-gray-500">Joined {new Date(agent.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-medium text-gray-900">{agent.email}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-700 font-medium">{agent.propertiesListed || 0} Listings</span>
                      <span className="text-xs text-gray-500">Rating: ⭐ {agent.rating || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      agent.agentStatus === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : 
                      agent.agentStatus === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {agent.agentStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      {agent.agentStatus !== 'approved' && (
                        <button
                          onClick={() => handleAgentStatus(agent._id, 'approved')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-sm font-semibold text-green-700 hover:bg-green-100 transition-colors"
                          title="Approve Agent"
                        >
                          <CheckCircle className="w-4 h-4" /> Approve
                        </button>
                      )}
                      {agent.agentStatus !== 'rejected' && (
                        <button
                          onClick={() => handleAgentStatus(agent._id, 'rejected')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors"
                          title="Reject Agent"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
