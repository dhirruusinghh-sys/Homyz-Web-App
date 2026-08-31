






























































































import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle2, Clock, FileText, Download, CreditCard, Loader2 } from 'lucide-react';
import type { AppDispatch, RootState } from '../../../app/store';
import { getBookings } from '../../../features/bookings/bookingSlice';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_mock');

export default function CustomerPayments() {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, isLoading } = useSelector((state: RootState) => state.bookings);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getBookings({}));
  }, [dispatch]);

  const getStatusBadge = (status: string) => {
    if (status === 'completed' || status === 'approved') {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Approved
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-semibold border border-yellow-200">
        <Clock className="w-3.5 h-3.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handlePayment = async (bookingId: string) => {
    try {
      setProcessingId(bookingId);
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/create-checkout-session`, { bookingId }, { withCredentials: true });
      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: data.id });
      }
    } catch (error) {
      console.error('Payment Error:', error);
      alert('Failed to initiate payment.');
    } finally {
      setProcessingId(null);
    }
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
                <th className="py-4 px-6 font-semibold text-sm text-gray-600">Booking Status</th>
                <th className="py-4 px-6 font-semibold text-sm text-gray-600">Payment Status</th>
                <th className="py-4 px-6 font-semibold text-sm text-gray-600 text-right">Action</th>
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
                  <td className="py-4 px-6">
                    {booking.paymentStatus === 'paid' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                        Unpaid
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    {booking.status === 'approved' && booking.paymentStatus !== 'paid' ? (
                      <button
                        onClick={() => handlePayment(booking._id)}
                        disabled={processingId === booking._id}
                        className="inline-flex items-center justify-center px-4 py-2 bg-primary hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                      >
                        {processingId === booking._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
                        Pay Token
                      </button>
                    ) : booking.paymentStatus === 'paid' ? (
                      <button className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-blue-50 transition-colors" title="Download Receipt">
                        <Download className="w-5 h-5" />
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">Not available</span>
                    )}
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
