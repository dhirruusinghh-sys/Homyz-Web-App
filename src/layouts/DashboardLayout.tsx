import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PieChart,
  Package,
  Box,
  Tag,
  Menu,
  Bell,
  Search,
  ChevronDown,
  Heart,
  Calendar,
  CreditCard,
  MessageSquare,
  Star,
  Settings,
  User,
  Shield,
  Home,
  MapPin,
  BookOpen,
  Mail,
  LogOut
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../app/store';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const adminLinks: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/dashboard/admin/users', icon: User },
  { name: 'Agents', href: '/dashboard/admin/agents', icon: Shield },
  { name: 'Properties', href: '/dashboard/admin/properties', icon: Home },
  { name: 'Categories', href: '/dashboard/admin/categories', icon: Box },
  { name: 'Amenities', href: '/dashboard/admin/amenities', icon: Tag },
  { name: 'Cities', href: '/dashboard/admin/cities', icon: MapPin },
  { name: 'Bookings', href: '/dashboard/admin/bookings', icon: Calendar },
  { name: 'Payments', href: '/dashboard/admin/payments', icon: CreditCard },
  { name: 'Reviews', href: '/dashboard/admin/reviews', icon: Star },
  { name: 'Messages', href: '/dashboard/admin/messages', icon: MessageSquare },
  { name: 'Blogs', href: '/dashboard/admin/blogs', icon: BookOpen },
  { name: 'Newsletter', href: '/dashboard/admin/newsletter', icon: Mail },
  { name: 'Reports', href: '/dashboard/admin/reports', icon: PieChart },
  { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
];

const customerLinks: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard/customer/dashboard', icon: LayoutDashboard },
  { name: 'Saved', href: '/dashboard/customer/saved', icon: Heart },
  { name: 'Bookings', href: '/dashboard/customer/bookings', icon: Calendar },
  { name: 'Payments', href: '/dashboard/customer/payments', icon: CreditCard },
  { name: 'Notifications', href: '/dashboard/customer/notifications', icon: Bell },
  { name: 'Reviews', href: '/dashboard/customer/reviews', icon: Star },
  { name: 'Messages', href: '/dashboard/customer/messages', icon: MessageSquare },
  { name: 'Profile', href: '/dashboard/customer/profile', icon: User },
  { name: 'Settings', href: '/dashboard/customer/settings', icon: Settings },
];

const agentLinks: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard/agent/dashboard', icon: LayoutDashboard },
  { name: 'Properties', href: '/dashboard/agent/properties', icon: Box },
  { name: 'Add Property', href: '/dashboard/agent/properties/add', icon: Package },
  { name: 'Requests', href: '/dashboard/agent/requests', icon: Calendar },
  { name: 'Messages', href: '/dashboard/agent/messages', icon: MessageSquare },
  { name: 'Analytics', href: '/dashboard/agent/analytics', icon: PieChart },
  { name: 'Profile', href: '/dashboard/agent/profile', icon: User },
  { name: 'Settings', href: '/dashboard/agent/settings', icon: Settings },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isCustomer = location.pathname.startsWith('/dashboard/customer');
  const isAgent = location.pathname.startsWith('/dashboard/agent');
  const activeLinks = isCustomer ? customerLinks : (isAgent ? agentLinks : adminLinks);
  const panelName = isCustomer ? 'Customer' : (isAgent ? 'Agent' : 'Admin');

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-close notifications after 3 seconds
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (showNotifications) {
      timeoutId = setTimeout(() => {
        setShowNotifications(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [showNotifications]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="h-screen bg-[#F3F6FD] flex p-3 sm:p-5 lg:p-6 font-sans">
      {/* Outer wrapper to look like a floating app window */}
      <div className="flex-1 flex overflow-hidden rounded-[32px] bg-[#1A56DB] shadow-2xl relative border border-white/40">
        
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 lg:hidden rounded-[32px]"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          absolute inset-y-0 left-0 z-50 bg-[#1A56DB] transform transition-all duration-300 ease-in-out flex flex-col h-full
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:static lg:translate-x-0
          ${isCollapsed ? 'w-20' : 'w-60'}
        `}>
          <div className={`h-24 flex flex-col justify-center transition-all duration-300 ${isCollapsed ? 'px-0 items-center' : 'px-8 lg:items-start'}`}>
            <Link to="/" className="text-2xl font-bold text-white flex items-center tracking-wide">
              <span>{isCollapsed ? 'H' : 'Homyz.'}</span>
            </Link>
          </div>

          <div 
            data-lenis-prevent
            className={`flex-1 flex flex-col relative z-10 space-y-1.5 overflow-y-auto pt-2 pb-4 
            [&::-webkit-scrollbar]:w-1.5 
            [&::-webkit-scrollbar-track]:bg-transparent 
            [&::-webkit-scrollbar-thumb]:bg-white/20 
            [&::-webkit-scrollbar-thumb]:rounded-full 
            hover:[&::-webkit-scrollbar-thumb]:bg-white/40
            pr-2`}
          >
            {activeLinks.map((link) => {
              const Icon = link.icon;
              // Making specific links active depending on route matches
              const isActive = location.pathname === link.href || (!isCustomer && link.href === '/dashboard/admin' && location.pathname === '/dashboard/admin');
              
              return (
                <div key={link.name} className="relative group pr-2">
                  {/* The active link "cutout" effect using exact background masking instead of shadows to prevent overflow clipping */}
                  {isActive && (
                    <>
                      {/* Top curve */}
                      <div className="absolute -top-[20px] right-2 w-5 h-5 bg-white pointer-events-none z-0">
                         <div className="w-full h-full bg-[#1A56DB] rounded-br-[20px]" />
                      </div>
                      {/* Bottom curve */}
                      <div className="absolute -bottom-[20px] right-2 w-5 h-5 bg-white pointer-events-none z-0">
                         <div className="w-full h-full bg-[#1A56DB] rounded-tr-[20px]" />
                      </div>
                    </>
                  )}
                  
                  <Link
                    to={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3.5 py-3.5 transition-all duration-300 relative z-20 font-semibold text-[14px]
                      ${isActive 
                        ? 'bg-white text-[#1A56DB] rounded-l-full ml-4' 
                        : 'text-white/90 hover:text-white hover:bg-white/10 rounded-full mx-4'
                      }
                      ${isCollapsed ? 'px-0 justify-center' : 'px-6'}
                    `}
                    title={isCollapsed ? link.name : ''}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#1A56DB]' : 'text-white'}`} strokeWidth={isActive ? 2.5 : 2} />
                    
                    <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'} ${isActive ? '' : 'tracking-wide'}`}>
                      {link.name}
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>

          <div className={`flex gap-3 justify-center text-white/70 text-[12px] font-medium overflow-hidden transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0 p-0 m-0' : 'opacity-100 p-6 pb-8'}`}>
             <a href="#" className="hover:text-white transition-colors">Facebook</a>
             <a href="#" className="hover:text-white transition-colors">Twitter</a>
             <a href="#" className="hover:text-white transition-colors">Google</a>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-l-[32px] flex flex-col min-w-0 relative z-0 shadow-[-10px_0_30px_rgba(0,0,0,0.06)] transition-all duration-300 h-full">
          
          {/* Top Header inside main content */}
          <header className="h-24 bg-white rounded-tl-[32px] flex items-center justify-between px-6 lg:px-10 shrink-0">
            <div className="flex items-center gap-4">
              {/* Mobile toggle */}
              <button 
                className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Desktop toggle */}
              <button 
                className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg hidden lg:block transition-colors"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            <div className="hidden sm:block flex-1"></div>

            <div className="flex items-center gap-4 sm:gap-6 ml-auto">
              <div className="relative">
                <button 
                  className="text-gray-400 hover:text-[#1A56DB] transition-colors relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                   <Bell className="w-5 h-5" strokeWidth={2} />
                   <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                </button>

                {showNotifications && (
                  <div className="fixed sm:absolute top-24 sm:top-full left-4 right-4 sm:left-auto sm:right-0 mt-0 sm:mt-3 sm:w-80 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50 transform origin-top sm:origin-top-right transition-all animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold text-gray-900">Notifications</h3>
                      <span className="text-xs font-semibold text-[#1A56DB] cursor-pointer hover:underline">Mark all read</span>
                    </div>
                    <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto" data-lenis-prevent>
                      <div className="px-4 py-4 hover:bg-[#F3F6FD] border-b border-gray-50 cursor-pointer transition-colors group">
                        <p className="text-sm font-medium text-gray-800 group-hover:text-[#1A56DB] transition-colors">New property matches your search.</p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#1A56DB]"></span> Just now</p>
                      </div>
                      <div className="px-4 py-4 hover:bg-[#F3F6FD] border-b border-gray-50 cursor-pointer transition-colors group">
                        <p className="text-sm font-medium text-gray-800 group-hover:text-[#1A56DB] transition-colors">Your booking was confirmed! 🎉</p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> 2 hours ago</p>
                      </div>
                      <div className="px-4 py-4 hover:bg-[#F3F6FD] cursor-pointer transition-colors group">
                        <p className="text-sm font-medium text-gray-800 group-hover:text-[#1A56DB] transition-colors">Welcome to Homyz.</p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> 1 day ago</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative flex items-center">
                {showSearch ? (
                  <div className="flex items-center bg-gray-50 rounded-full px-3 py-1.5 border border-gray-200">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      className="bg-transparent border-none outline-none text-sm ml-2 w-24 sm:w-48 text-gray-700"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      onBlur={() => { if(!searchQuery) setShowSearch(false) }}
                    />
                  </div>
                ) : (
                  <button 
                    className="text-gray-400 hover:text-[#1A56DB] transition-colors flex items-center justify-center p-1"
                    onClick={() => setShowSearch(true)}
                  >
                     <Search className="w-5 h-5" strokeWidth={2} />
                  </button>
                )}
              </div>
              
              <div className="relative">
                <div 
                  className="flex items-center gap-2.5 cursor-pointer group pl-2 border-l border-gray-100"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" 
                    alt="User" 
                    className="w-9 h-9 rounded-full object-cover shadow-sm group-hover:ring-2 ring-[#1A56DB]/30 transition-all"
                  />
                  <div className="hidden sm:block">
                    <p className="text-sm font-bold text-gray-700 leading-tight">Admin User</p>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{panelName}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 hidden sm:block transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} strokeWidth={2} />
                </div>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-3">
                      <img 
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" 
                        alt="User" 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-900">Admin User</p>
                        <p className="text-xs text-gray-500">admin@homyz.com</p>
                      </div>
                    </div>
                    <div className="py-2">
                      <Link to={`/dashboard/${panelName.toLowerCase()}/profile`} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setShowProfileMenu(false)}>
                        <User className="w-4 h-4 text-gray-400" /> My Profile
                      </Link>
                      <Link to={`/dashboard/${panelName.toLowerCase()}/settings`} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setShowProfileMenu(false)}>
                        <Settings className="w-4 h-4 text-gray-400" /> Account Settings
                      </Link>
                    </div>
                    <div className="border-t border-gray-50 py-2">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 font-medium hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main data-lenis-prevent className="flex-1 px-4 sm:px-6 lg:px-10 pb-10 overflow-y-auto scroll-smooth">
            <Outlet />
          </main>
          
        </div>
      </div>
    </div>
  );
}
