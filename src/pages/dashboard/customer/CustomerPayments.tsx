import { CheckCircle2, Clock, FileText, Download } from 'lucide-react';

const payments = [
  {
    id: 'TRX-982374',
    date: 'Aug 15, 2026',
    property: 'Modern Villa in Beverly Hills',
    type: 'Booking Advance',
    amount: '$5,000',
    status: 'completed',
  },
  {
    id: 'TRX-982105',
    date: 'Jul 28, 2026',
    property: 'Luxury Penthouse',
    type: 'Consultation Fee',
    amount: '$150',
    status: 'completed',
  },
  {
    id: 'TRX-981992',
    date: 'Jul 10, 2026',
    property: 'Minimalist Beachside Home',
    type: 'Security Deposit',
    amount: '$10,000',
    status: 'pending',
  }
];

export default function CustomerPayments() {
  const getStatusBadge = (status: string) => {
    if (status === 'completed') {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Completed
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-semibold border border-yellow-200">
        <Clock className="w-3.5 h-3.5" />
        Pending
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
        <p className="text-gray-500 text-sm">View and download your recent transaction receipts</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-4 px-6 font-semibold text-sm text-gray-600">Transaction ID</th>
                <th className="py-4 px-6 font-semibold text-sm text-gray-600">Date</th>
                <th className="py-4 px-6 font-semibold text-sm text-gray-600">Property & Type</th>
                <th className="py-4 px-6 font-semibold text-sm text-gray-600">Amount</th>
                <th className="py-4 px-6 font-semibold text-sm text-gray-600">Status</th>
                <th className="py-4 px-6 font-semibold text-sm text-gray-600 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="text-sm font-mono text-gray-700 font-medium">{payment.id}</span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {payment.date}
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-semibold text-gray-900">{payment.property}</p>
                    <p className="text-xs text-gray-500">{payment.type}</p>
                  </td>
                  <td className="py-4 px-6 text-sm font-bold text-gray-900">
                    {payment.amount}
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      className={`inline-flex items-center justify-center p-2 rounded-lg transition-colors ${
                        payment.status === 'completed' 
                          ? 'text-primary hover:bg-blue-50' 
                          : 'text-gray-300 cursor-not-allowed'
                      }`}
                      disabled={payment.status !== 'completed'}
                      title="Download Receipt"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State Fallback (Not shown currently because we have data) */}
        {payments.length === 0 && (
          <div className="py-16 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-gray-900 font-semibold mb-1">No Payments Yet</h3>
            <p className="text-sm text-gray-500">Your transaction history will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
