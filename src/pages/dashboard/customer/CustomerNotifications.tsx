import { Bell, Calendar, Home, Tag, Check, Trash2 } from 'lucide-react';
import { useState } from 'react';

const initialNotifications = [
  {
    id: '1',
    title: 'Booking Confirmed!',
    message: 'Your visit for "Modern Villa in Beverly Hills" has been confirmed for Aug 25th at 10:00 AM.',
    type: 'booking',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    title: 'Price Drop Alert',
    message: 'The price for "Luxury Penthouse" has dropped by $50,000. Check it out now!',
    type: 'price',
    time: 'Yesterday',
    read: false,
  },
  {
    id: '3',
    title: 'New Property Match',
    message: 'A new property matching your saved search criteria was just listed in Downtown Core.',
    type: 'match',
    time: '2 days ago',
    read: true,
  },
  {
    id: '4',
    title: 'Welcome to Homyz',
    message: 'Thank you for joining us! Complete your profile to get the best property recommendations.',
    type: 'system',
    time: '1 week ago',
    read: true,
  }
];

export default function CustomerNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'price': return <Tag className="w-5 h-5 text-green-500" />;
      case 'match': return <Home className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'booking': return 'bg-blue-50';
      case 'price': return 'bg-green-50';
      case 'match': return 'bg-purple-50';
      default: return 'bg-gray-100';
    }
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-500 text-sm">Stay updated on your properties and bookings</p>
        </div>
        <button 
          onClick={markAllRead}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          <Check className="w-4 h-4" />
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {notifications.length === 0 ? (
           <div className="p-12 text-center flex flex-col items-center">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
               <Bell className="w-8 h-8 text-gray-300" />
             </div>
             <h3 className="text-gray-900 font-semibold mb-1">No Notifications</h3>
             <p className="text-sm text-gray-500">You're all caught up!</p>
           </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-5 flex gap-4 transition-colors relative group ${notification.read ? 'bg-white hover:bg-gray-50/50' : 'bg-blue-50/30 hover:bg-blue-50/50'}`}
              >
                {!notification.read && (
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1 h-12 bg-primary rounded-r-full" />
                )}
                
                <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center ${getIconBg(notification.type)}`}>
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4 mb-1">
                    <h4 className={`text-base font-semibold truncate ${notification.read ? 'text-gray-800' : 'text-gray-900'}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                      {notification.time}
                    </span>
                  </div>
                  <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-600 font-medium'}`}>
                    {notification.message}
                  </p>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                  <button 
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
