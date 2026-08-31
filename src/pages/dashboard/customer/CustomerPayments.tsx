






























































































import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle2, Clock, FileText, Download } from 'lucide-react';
import { AppDispatch, RootState } from '../../../app/store';
import { getBookings } from '../../../features/bookings/bookingSlice';

export default function CustomerPayments() {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, isLoading } = useSelector((state: RootState) => state.booking);

  useEffect(() => {
    dispatch(getBookings({}));
  }, [dispatch]);

  const getStatusBadge = (status: string) => {
    if (status === 'completed' || status === 'approved') {
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
        <p className="text-gray-500 text-sm">View and download your recent transaction receipts (Based on your bookings)</p>
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : bookings?.map((booking: any) => (
                <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="text-sm font-mono text-gray-700 font-medium">TRX-{booking._id.substring(0, 6).toUpperCase()}</span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-semibold text-gray-900">{booking.property?.title || 'Unknown Property'}</p>
                    <p className="text-xs text-gray-500">Booking Advance</p>
                  </td>
                  <td className="py-4 px-6 text-sm font-bold text-gray-900">
                    ${(booking.property?.price * 0.1 || 5000).toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      className={`inline-flex items-center justify-center p-2 rounded-lg transition-colors ${booking.status === 'completed' || booking.status === 'approved'
                          ? 'text-primary hover:bg-blue-50'
                          : 'text-gray-300 cursor-not-allowed'
                        }`}
                      disabled={!(booking.status === 'completed' || booking.status === 'approved')}
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

        {/* Empty State Fallback */}
        {!isLoading && (!bookings || bookings.length === 0) && (
          <div className="py-16 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-gray-900 font-semibold mb-1">No Payments Yet</h3>
            <p className="text-sm text-gray-500">Your transaction history will appear here once you make a booking.</p>
          </div>
        )}
      </div>
    </div>
  );
}
