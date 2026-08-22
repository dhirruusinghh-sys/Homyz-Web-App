import { useState } from 'react';
import { Settings, ChevronDown, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

// Dummy data based on the image
const orders = [
  { id: '#2632', name: 'Brooklyn Zoe', address: '302 Snider Street, RUTLAND, VT, 05701', date: '31 Jul 2020', price: '$64.00', status: 'Pending', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '#2633', name: 'John McCormick', address: '1095 Wiseman Street, CALMAR, IA, 52132', date: '01 Aug 2020', price: '$35.00', status: 'Dispatch', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '#2634', name: 'Sandra Pugh', address: '1640 Thom Street, SALE CITY, GA, 38108', date: '02 Aug 2020', price: '$74.00', status: 'Completed', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '#2635', name: 'Vernie Hart', address: '3898 Oak Drive, DOVER, DE, 19901', date: '02 Aug 2020', price: '$82.00', status: 'Pending', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: '#2636', name: 'Mark Clark', address: '1915 Augusta Park, NASSAU, NY, 12062', date: '03 Aug 2020', price: '$39.00', status: 'Dispatch', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: '#2637', name: 'Rebekah Foster', address: '3445 Park Boulevard, BIOLA, CA, 93606', date: '03 Aug 2020', price: '$67.00', status: 'Pending', avatar: 'https://i.pravatar.cc/150?u=6' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('All orders');
  const [activeRow, setActiveRow] = useState<string | null>('#2633');

  const tabs = ['All orders', 'Dispatch', 'Pending', 'Completed'];

  return (
    <div className="flex flex-col h-full bg-white font-sans text-gray-800">
      
      {/* Header Section */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-black mb-1">Order</h1>
          <p className="text-gray-400 text-sm font-medium">28 orders found</p>
        </div>
      </div>

      {/* Tabs and Date Range */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-6">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                pb-2 text-[15px] font-semibold relative transition-colors
                ${activeTab === tab ? 'text-black' : 'text-gray-300 hover:text-gray-500'}
              `}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-[-9px] left-0 right-0 h-[2px] bg-black"></div>
              )}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-4 text-sm font-semibold text-gray-600">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md cursor-pointer hover:bg-gray-100">
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            <span>31 Jul 2020</span>
          </div>
          <span className="text-gray-400">To</span>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md cursor-pointer hover:bg-gray-100">
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            <span>03 Aug 2020</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-[1000px]">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_2fr_3fr_1.5fr_1fr_1fr_1fr] px-6 py-4 text-sm font-bold text-gray-900">
            <div className="flex items-center gap-1 cursor-pointer">Id <ChevronDown className="w-3 h-3 text-gray-400" /></div>
            <div className="flex items-center gap-1">Name</div>
            <div className="flex items-center gap-1">Address</div>
            <div className="flex items-center gap-1 cursor-pointer">Date <ChevronDown className="w-3 h-3 text-gray-400" /></div>
            <div className="flex items-center gap-1 cursor-pointer">Price <ChevronDown className="w-3 h-3 text-gray-400" /></div>
            <div className="flex items-center gap-1">Status</div>
            <div className="flex items-center gap-1 justify-center">Action</div>
          </div>

          {/* Table Rows */}
          <div className="space-y-2">
            {orders.map((order) => {
              const isActive = activeRow === order.id;
              
              let statusColor = "text-red-500";
              let dotColor = "bg-red-500";
              if (order.status === 'Dispatch') { statusColor = "text-green-500"; dotColor = "bg-green-500"; }
              if (order.status === 'Completed') { statusColor = "text-gray-400"; dotColor = "bg-gray-400"; }
              
              if (isActive) {
                statusColor = "text-white/80";
                dotColor = "bg-white";
              }

              return (
                <div 
                  key={order.id}
                  onClick={() => setActiveRow(order.id)}
                  className={`
                    grid grid-cols-[1fr_2fr_3fr_1.5fr_1fr_1fr_1fr] items-center px-6 py-4 rounded-xl text-sm font-semibold cursor-pointer transition-all
                    ${isActive 
                      ? 'bg-[#1A56DB] text-white shadow-lg shadow-blue-500/30 scale-[1.01]' 
                      : 'bg-[#F9FAFB] text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className={isActive ? 'text-white' : 'text-gray-500'}>{order.id}</div>
                  
                  <div className="flex items-center gap-3">
                    <img src={order.avatar} alt={order.name} className="w-8 h-8 rounded-full object-cover" />
                    <span className={isActive ? 'text-white font-bold' : 'text-gray-900'}>{order.name}</span>
                  </div>
                  
                  <div className={`truncate pr-4 ${isActive ? 'text-white/90' : 'text-gray-500 font-medium'}`}>
                    {order.address}
                  </div>
                  
                  <div className={isActive ? 'text-white/90' : 'text-gray-500 font-medium'}>{order.date}</div>
                  
                  <div className={isActive ? 'text-white' : 'text-gray-900'}>{order.price}</div>
                  
                  <div className={`flex items-center gap-2 ${statusColor}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
                    <span>{order.status}</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    <button className={`p-1.5 rounded-lg transition-colors ${isActive ? 'hover:bg-white/10' : 'text-gray-400 hover:bg-gray-200'}`}>
                      <Settings className="w-4 h-4" />
                    </button>
                    <button className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-[#0E42BD] hover:bg-[#0c39a3]' : 'text-gray-400 hover:bg-gray-200'}`}>
                      <ChevronDown className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-between text-sm font-semibold text-gray-500">
        <div>Showing 06-12 of 28</div>
        <div className="flex items-center gap-2">
          <button className="p-1 hover:text-black transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-black font-bold">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">3</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">4</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">5</button>
          <button className="p-1 hover:text-black transition-colors"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
      
    </div>
  );
}
