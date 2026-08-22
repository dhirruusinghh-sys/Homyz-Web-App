import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../app/store';
import { getBookings, updateBookingStatus } from '../../../features/bookings/bookingSlice';
import { Calendar, Clock, MapPin, Search, XCircle, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

export default function CustomerBookings() {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, isLoading } = useSelector((state: RootState) => state.bookings);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getBookings({}));
  }, [dispatch]);

  const handleCancelBooking = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await dispatch(updateBookingStatus
          ({ id, data: { status: 'cancelled' } })).unwrap();
        toast.success('Booking cancelled successfully');
      } catch (error: any) {
        toast.error(error || 'Failed to cancel booking');
      }
    }
  };

  const filteredBookings = bookings.filter((booking: any) =>
    booking.property?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Pending</span>;
      case 'approved': return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Approved</span>;
      case 'rejected': return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Rejected</span>;
      case 'cancelled': return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">Cancelled</span>;
      case 'completed': return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">Completed</span>;
      case 'rescheduled': return <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">Rescheduled</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Visit Bookings</h2>
          <p className="text-gray-500 text-sm">Manage your property visit requests</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900">No Bookings Found</h3>
          <p className="text-gray-500 mt-1">You haven't booked any property visits yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredBookings.map((booking: any, index: number) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={booking._id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow"
            >
              <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0">
                <img
                  src={booking.property?.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=200'}
                  alt="Property"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="font-bold text-lg text-gray-900">{booking.property?.title || 'Unknown Property'}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-500 px-2 py-1 bg-gray-50 rounded-md border">ID: {booking.bookingId}</span>
                    {getStatusBadge(booking.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{booking.property?.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{new Date(booking.visitDate).toDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{booking.timeSlot}</span>
                  </div>
                </div>

                {booking.remarks && (
                  <div className="bg-orange-50 text-orange-800 text-sm p-3 rounded-lg border border-orange-100">
                    <span className="font-semibold">Agent Remarks:</span> {booking.remarks}
                  </div>
                )}
              </div>

              <div className="flex items-end shrink-0">
                {(booking.status === 'pending' || booking.status === 'rescheduled') && (
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="flex items-center justify-center gap-2 w-full md:w-auto px-5 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl font-medium transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel Visit
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
