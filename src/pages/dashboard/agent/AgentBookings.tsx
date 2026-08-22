import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../app/store';
import { getBookings, updateBookingStatus } from '../../../features/bookings/bookingSlice';
import { Calendar as CalendarIcon, Clock, Search, CheckCircle, XCircle, RefreshCw, CalendarDays } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AgentBookings() {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, isLoading } = useSelector((state: RootState) => state.bookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    dispatch(getBookings({}));
  }, [dispatch]);

  const handleStatusChange = async (id: string, status: string, remarks?: string) => {
    try {
      await dispatch(updateBookingStatus({ id, data: { status, remarks } })).unwrap();
      toast.success(`Booking ${status} successfully`);
    } catch (error: any) {
      toast.error(error || `Failed to update booking status`);
    }
  };

  const filteredBookings = bookings.filter((booking: any) => 
    booking.property?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  // Basic Calendar View Logic
  const today = new Date();
  const todayVisits = filteredBookings.filter((b: any) => 
    new Date(b.visitDate).toDateString() === today.toDateString() &&
    ['approved', 'rescheduled'].includes(b.status)
  );
  
  const upcomingVisits = filteredBookings.filter((b: any) => 
    new Date(b.visitDate) > today &&
    ['approved', 'rescheduled'].includes(b.status)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
          <p className="text-gray-500 text-sm">Manage property visit requests from customers</p>
        </div>
        <div className="flex gap-2">
          <button 
             onClick={() => setActiveTab('list')}
             className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-colors ${activeTab === 'list' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
          >
            List View
          </button>
          <button 
             onClick={() => setActiveTab('calendar')}
             className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-colors ${activeTab === 'calendar' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
          >
            Calendar View
          </button>
        </div>
      </div>

      {activeTab === 'list' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6 relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, Customer, Property..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
               <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900">No Bookings Found</h3>
              <p className="text-gray-500 mt-1">There are no property visit requests at this time.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold rounded-tl-xl">ID / Property</th>
                    <th className="p-4 font-semibold">Customer</th>
                    <th className="p-4 font-semibold">Date & Time</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right rounded-tr-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.map((booking: any) => (
                    <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 line-clamp-1">{booking.property?.title}</span>
                          <span className="text-xs font-mono text-gray-400">{booking.bookingId}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs">
                              {booking.customer?.name?.charAt(0) || 'U'}
                           </div>
                           <div className="flex flex-col">
                             <span className="font-semibold text-gray-900 text-sm">{booking.customer?.name}</span>
                             <span className="text-xs text-gray-500">{booking.customer?.email}</span>
                           </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-sm text-gray-700">
                            <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                            {new Date(booking.visitDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            {booking.timeSlot}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {booking.status === 'pending' && (
                            <>
                              <button onClick={() => handleStatusChange(booking._id, 'approved')} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Approve">
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button onClick={() => handleStatusChange(booking._id, 'rejected', 'Property unavailable.')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Reject">
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          {booking.status === 'approved' && (
                             <button onClick={() => handleStatusChange(booking._id, 'completed')} className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors" title="Mark Completed">
                               Complete
                             </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'calendar' && (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Visits */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
               <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                     <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                     <h3 className="font-bold text-gray-900">Today's Visits</h3>
                     <p className="text-sm text-gray-500">{today.toDateString()}</p>
                  </div>
               </div>
               
               <div className="space-y-4">
                  {todayVisits.length === 0 ? (
                     <p className="text-gray-500 text-sm text-center py-4">No visits scheduled for today.</p>
                  ) : (
                     todayVisits.map((visit: any) => (
                        <div key={visit._id} className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                           <div className="shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-white border border-gray-200 shadow-sm">
                              <span className="text-xs text-gray-500 font-semibold">{visit.timeSlot.split(' ')[0]}</span>
                              <span className="text-xs font-bold text-primary">{visit.timeSlot.split(' ')[1]}</span>
                           </div>
                           <div>
                              <h4 className="font-bold text-gray-900">{visit.property?.title}</h4>
                              <p className="text-sm text-gray-600">with {visit.customer?.name}</p>
                              <div className="flex items-center gap-2 mt-2">
                                 <button onClick={() => handleStatusChange(visit._id, 'completed')} className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200">
                                    Mark Completed
                                 </button>
                              </div>
                           </div>
                        </div>
                     ))
                  )}
               </div>
            </div>

            {/* Upcoming Visits */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
               <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                     <Clock className="w-5 h-5" />
                  </div>
                  <div>
                     <h3 className="font-bold text-gray-900">Upcoming Visits</h3>
                     <p className="text-sm text-gray-500">Next 7 days</p>
                  </div>
               </div>
               
               <div className="space-y-4">
                  {upcomingVisits.length === 0 ? (
                     <p className="text-gray-500 text-sm text-center py-4">No upcoming visits.</p>
                  ) : (
                     upcomingVisits.slice(0, 5).map((visit: any) => (
                        <div key={visit._id} className="flex gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                           <div>
                              <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{visit.property?.title}</h4>
                              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                 <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3"/> {new Date(visit.visitDate).toLocaleDateString()}</span>
                                 <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {visit.timeSlot}</span>
                              </div>
                           </div>
                        </div>
                     ))
                  )}
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
