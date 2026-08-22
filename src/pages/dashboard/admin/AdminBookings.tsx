import { Calendar, Search, Filter, CheckCircle, XCircle, Clock, MapPin, User, ArrowRight } from 'lucide-react';
import { useState } from 'react';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../app/store';
import { getAdminBookings } from '../../../features/admin/adminSlice';

export default function AdminBookings() {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, isLoading } = useSelector((state: RootState) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getAdminBookings());
  }, [dispatch]);

  const handleStatusChange = (id: string, newStatus: string) => {
    // API currently might not support this in Phase 3 controller
    alert(`Backend integration required for changing status to ${newStatus}`);
  };

  const filteredBookings = bookings?.filter(b => 
    b.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.bookingId?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>
          <p className="text-sm text-gray-500">Monitor and manage property visits and consultations globally</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
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
                <th className="py-4 px-6 font-semibold">Booking ID & Date</th>
                <th className="py-4 px-6 font-semibold">Property</th>
                <th className="py-4 px-6 font-semibold">Parties Involved</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-mono text-sm font-bold text-primary mb-1">{booking.bookingId}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(booking.visitDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      {booking.timeSlot}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-gray-900 text-sm">{booking.property?.title}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{booking.property?.city}, {booking.property?.state}</span>
                    </div>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] uppercase font-bold rounded">
                      {booking.type || 'Visit'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-gray-800">{booking.customer?.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-orange-500" />
                        <span className="text-gray-600">{booking.agent?.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                      booking.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                      booking.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {booking.status === 'confirmed' && <CheckCircle className="w-3.5 h-3.5" />}
                      {booking.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                      {booking.status === 'cancelled' && <XCircle className="w-3.5 h-3.5" />}
                      {booking.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(booking._id, 'confirmed')}
                        className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                        title="Confirm Booking"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <button
                        onClick={() => handleStatusChange(booking._id, 'cancelled')}
                        className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                        title="Cancel Booking"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button className="p-1.5 bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition-colors ml-2" title="View Details">
                      <ArrowRight className="w-4 h-4" />
                    </button>
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
