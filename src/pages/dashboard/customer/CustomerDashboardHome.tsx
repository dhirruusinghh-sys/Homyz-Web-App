import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../app/store';
import { Home, Heart, Calendar, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getBookings } from '../../../features/bookings/bookingSlice';
import { getNotifications } from '../../../features/notifications/notificationSlice';

export default function CustomerDashboardHome() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { bookings } = useSelector((state: RootState) => state.bookings);
  const { notifications } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    dispatch(getBookings({}));
    dispatch(getNotifications());
  }, [dispatch]);

  const unreadNotifications = notifications?.filter((n: any) => !n.read).length || 0;

  const stats = [
    { title: 'Saved Properties', value: user?.savedProperties?.length || 0, icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
    { title: 'My Bookings', value: bookings?.length || 0, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Notifications', value: unreadNotifications, icon: Bell, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Guest'}! 👋</h1>
          <p className="text-blue-100 max-w-lg text-lg">
            Find your dream home with Homyz. Manage your saved properties, bookings, and profile all in one place.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-full opacity-20 hidden md:block">
          <Home className="w-full h-full text-white" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <Icon className={`w-7 h-7 ${stat.color}`} strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link to="/properties" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
             <Home className="w-6 h-6 text-gray-600 mb-2" />
             <span className="text-sm font-medium text-gray-700">Browse Homes</span>
          </Link>
          <Link to="/dashboard/customer/saved" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
             <Heart className="w-6 h-6 text-gray-600 mb-2" />
             <span className="text-sm font-medium text-gray-700">Saved</span>
          </Link>
          <Link to="/dashboard/customer/bookings" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
             <Calendar className="w-6 h-6 text-gray-600 mb-2" />
             <span className="text-sm font-medium text-gray-700">Bookings</span>
          </Link>
          <Link to="/dashboard/customer/profile" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
             <div className="w-6 h-6 rounded-full bg-gray-300 mb-2 flex items-center justify-center text-[10px] font-bold text-white">
               {user?.name?.charAt(0) || 'U'}
             </div>
             <span className="text-sm font-medium text-gray-700">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
