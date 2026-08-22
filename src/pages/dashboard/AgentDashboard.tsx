import { Link } from 'react-router-dom';

export default function AgentDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
        <Link to="/dashboard/agent/properties/add" className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30">
          Add New Property
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placeholder Stat Cards */}
        {['My Properties', 'Pending Visits', 'Total Views'].map((stat) => (
          <div key={stat} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">{stat}</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
          </div>
        ))}
      </div>
    </div>
  );
}
