import { DollarSign, Search, Filter, Download, ArrowUpRight, ArrowDownRight, Clock, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const dummyPayments = [
  {
    id: 'TRX-998273',
    date: 'Aug 18, 2026',
    customer: 'David Kim',
    agent: 'Esther Howard',
    property: 'Modern Villa in Beverly Hills',
    type: 'Booking Deposit',
    amount: 5000,
    status: 'completed',
  },
  {
    id: 'TRX-998105',
    date: 'Aug 17, 2026',
    customer: 'Sarah Jenkins',
    agent: 'Robert Fox',
    property: 'Luxury Penthouse',
    type: 'Consultation Fee',
    amount: 150,
    status: 'completed',
  },
  {
    id: 'TRX-997992',
    date: 'Aug 15, 2026',
    customer: 'Michael Rodriguez',
    agent: 'Wade Warren',
    property: 'Minimalist Beachside Home',
    type: 'Security Deposit',
    amount: 10000,
    status: 'pending',
  },
  {
    id: 'TRX-997840',
    date: 'Aug 12, 2026',
    customer: 'Emily Chen',
    agent: 'Esther Howard',
    property: 'Cozy Family Suburban House',
    type: 'Booking Deposit',
    amount: 2500,
    status: 'failed',
  }
];

export default function AdminPayments() {
  const [payments] = useState(dummyPayments);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayments = payments.filter(p => 
    p.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.property.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments & Ledger</h1>
          <p className="text-sm text-gray-500">Track all platform transactions and revenues</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
           <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Clearances</p>
            <h3 className="text-2xl font-bold text-gray-900">$10,000</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <ArrowUpRight className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Monthly Growth</p>
            <h3 className="text-2xl font-bold text-gray-900">+14.2%</h3>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, customer, or property..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
          <button className="p-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors shadow-sm self-start sm:self-auto">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                <th className="py-4 px-6 font-semibold">Transaction ID & Date</th>
                <th className="py-4 px-6 font-semibold">Customer & Agent</th>
                <th className="py-4 px-6 font-semibold">Property & Type</th>
                <th className="py-4 px-6 font-semibold">Amount</th>
                <th className="py-4 px-6 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="text-sm font-mono text-gray-800 font-medium">{payment.id}</span>
                    <p className="text-xs text-gray-500 mt-1">{payment.date}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-semibold text-gray-900">{payment.customer}</p>
                    <p className="text-xs text-gray-500 mt-1">via {payment.agent}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-800 truncate max-w-[200px]" title={payment.property}>{payment.property}</p>
                    <p className="text-xs text-primary font-medium mt-1">{payment.type}</p>
                  </td>
                  <td className="py-4 px-6 text-sm font-bold text-gray-900">
                    ${payment.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                      payment.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                      payment.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {payment.status === 'completed' && <CheckCircle className="w-3.5 h-3.5" />}
                      {payment.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                      {payment.status === 'failed' && <ArrowDownRight className="w-3.5 h-3.5" />}
                      {payment.status.toUpperCase()}
                    </span>
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
