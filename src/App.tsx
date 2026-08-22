import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

// ── UI
import LoadingScreen from './components/ui/LoadingScreen'
import Cursor from './components/ui/Cursor'
import ScrollProgress, { BackToTop } from './components/ui/ScrollProgress'

// ── Layout
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// ── Sections (lazy loaded for performance)
import Hero          from './components/sections/Hero'
import Marquee       from './components/sections/Marquee'
import Properties    from './components/sections/Properties'
import Value         from './components/sections/Value'
import Testimonials  from './components/sections/Testimonials'
import CTA           from './components/sections/CTA'
import Contact       from './components/sections/Contact'

// ── Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import VerifyEmail from './pages/auth/VerifyEmail'

// ── Dashboards
import DashboardLayout from './layouts/DashboardLayout'
import AdminDashboardHome from './pages/dashboard/admin/AdminDashboardHome'
import AdminUsers from './pages/dashboard/admin/AdminUsers'
import AdminAgents from './pages/dashboard/admin/AdminAgents'
import AdminProperties from './pages/dashboard/admin/AdminProperties'
import AdminCategories from './pages/dashboard/admin/AdminCategories'
import AdminAmenities from './pages/dashboard/admin/AdminAmenities'
import AdminCities from './pages/dashboard/admin/AdminCities'
import AdminBookings from './pages/dashboard/admin/AdminBookings'
import AdminMessages from './pages/dashboard/admin/AdminMessages'
import AdminBlogs from './pages/dashboard/admin/AdminBlogs'
import AdminNewsletters from './pages/dashboard/admin/AdminNewsletters'
import AdminPayments from './pages/dashboard/admin/AdminPayments'
import AdminReviews from './pages/dashboard/admin/AdminReviews'
import AdminReports from './pages/dashboard/admin/AdminReports'
import AgentDashboardHome from './pages/dashboard/agent/AgentDashboardHome'
import ManageListings from './pages/dashboard/agent/ManageListings'
import AddProperty from './pages/dashboard/agent/AddProperty'
import AgentBookings from './pages/dashboard/agent/AgentBookings'
import Analytics from './pages/dashboard/agent/Analytics'
import Messages from './pages/dashboard/agent/Messages'

import CustomerDashboardHome from './pages/dashboard/customer/CustomerDashboardHome'
import Profile from './pages/dashboard/customer/Profile'
import Settings from './pages/dashboard/customer/Settings'
import CustomerBookings from './pages/dashboard/customer/CustomerBookings'
import CustomerSaved from './pages/dashboard/customer/CustomerSaved'
import CustomerPayments from './pages/dashboard/customer/CustomerPayments'
import CustomerNotifications from './pages/dashboard/customer/CustomerNotifications'
import CustomerReviews from './pages/dashboard/customer/CustomerReviews'
import CustomerMessages from './pages/dashboard/customer/CustomerMessages'

// ── Pages
import PropertiesPage from './pages/PropertiesPage'
import PropertyDetails from './pages/PropertyDetails'

// ── Hooks
import { useLenis }  from './hooks/useLenis'
import { useSelector } from 'react-redux'
import type { RootState } from './app/store'
import { SocketProvider } from './context/SocketContext'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactElement, allowedRoles?: string[] }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const LandingPage = () => (
  <main>
    <Hero />
    <Marquee />
    <Properties />
    <Value />
    <CTA />
    <Testimonials />
    <Contact />
  </main>
)

export default function App() {
  const [loaded, setLoaded] = useState(false)
  useLenis()

  return (
    <>
      {/* ── Custom cursor (desktop only) */}
      <Cursor />

      {/* ── Scroll progress bar */}
      <ScrollProgress />

      {/* ── Loading screen (AnimatePresence removes it with exit animation) */}
      <AnimatePresence>
        {!loaded && (
          <LoadingScreen key="loader" onDone={() => setLoaded(true)} />
        )}
      </AnimatePresence>

      {/* ── Main page (fades in after loader) */}
      <AnimatePresence>
        {loaded && (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: .6, ease: [.16, 1, .3, 1] }}
          >
            {/* Navigation */}
            <Router>
              <SocketProvider>
              {/* ── Routes */}
              <Routes>
                {/* Public Landing Page */}
                <Route path="/" element={<><Navbar /><LandingPage /><Footer /></>} />
                
                {/* Properties Search Page */}
                <Route path="/properties" element={<><Navbar /><PropertiesPage /><Footer /></>} />
                
                {/* Property Details Page */}
                <Route path="/properties/:id" element={<><Navbar /><PropertyDetails /><Footer /></>} />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/verify-email/:token" element={<VerifyEmail />} />

                {/* Dashboard Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                  {/* Redirect base dashboard to customer for now */}
                  <Route index element={<Navigate to="customer/dashboard" replace />} />
                  
                  {/* Admin Routes */}
                  <Route path="admin" element={<Navigate to="dashboard" replace />} />
                  <Route path="admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboardHome /></ProtectedRoute>} />
                  <Route path="admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
                  <Route path="admin/agents" element={<ProtectedRoute allowedRoles={['admin']}><AdminAgents /></ProtectedRoute>} />
                  <Route path="admin/properties" element={<ProtectedRoute allowedRoles={['admin']}><AdminProperties /></ProtectedRoute>} />
                  <Route path="admin/categories" element={<ProtectedRoute allowedRoles={['admin']}><AdminCategories /></ProtectedRoute>} />
                  <Route path="admin/amenities" element={<ProtectedRoute allowedRoles={['admin']}><AdminAmenities /></ProtectedRoute>} />
                  <Route path="admin/cities" element={<ProtectedRoute allowedRoles={['admin']}><AdminCities /></ProtectedRoute>} />
                  <Route path="admin/bookings" element={<ProtectedRoute allowedRoles={['admin']}><AdminBookings /></ProtectedRoute>} />
                  <Route path="admin/payments" element={<ProtectedRoute allowedRoles={['admin']}><AdminPayments /></ProtectedRoute>} />
                  <Route path="admin/reviews" element={<ProtectedRoute allowedRoles={['admin']}><AdminReviews /></ProtectedRoute>} />
                  <Route path="admin/messages" element={<ProtectedRoute allowedRoles={['admin']}><AdminMessages /></ProtectedRoute>} />
                  <Route path="admin/blogs" element={<ProtectedRoute allowedRoles={['admin']}><AdminBlogs /></ProtectedRoute>} />
                  <Route path="admin/newsletter" element={<ProtectedRoute allowedRoles={['admin']}><AdminNewsletters /></ProtectedRoute>} />
                  <Route path="admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminReports /></ProtectedRoute>} />
                  <Route path="admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><Settings /></ProtectedRoute>} />
                  
                  {/* Agent Routes */}
                  <Route path="agent" element={<Navigate to="dashboard" replace />} />
                  <Route path="agent/dashboard" element={<ProtectedRoute allowedRoles={['agent', 'admin']}><AgentDashboardHome /></ProtectedRoute>} />
                  <Route path="agent/properties" element={<ProtectedRoute allowedRoles={['agent', 'admin']}><ManageListings /></ProtectedRoute>} />
                  <Route path="agent/properties/add" element={<ProtectedRoute allowedRoles={['agent', 'admin']}><AddProperty /></ProtectedRoute>} />
                  <Route path="agent/properties/edit/:id" element={<ProtectedRoute allowedRoles={['agent', 'admin']}><AddProperty /></ProtectedRoute>} /> {/* Reusing AddProperty for edit later */}
                  <Route path="agent/requests" element={<ProtectedRoute allowedRoles={['agent', 'admin']}><AgentBookings /></ProtectedRoute>} />
                  <Route path="agent/messages" element={<ProtectedRoute allowedRoles={['agent', 'admin']}><Messages /></ProtectedRoute>} />
                  <Route path="agent/analytics" element={<ProtectedRoute allowedRoles={['agent', 'admin']}><Analytics /></ProtectedRoute>} />
                  <Route path="agent/profile" element={<ProtectedRoute allowedRoles={['agent', 'admin']}><Profile /></ProtectedRoute>} /> {/* Reusing Profile component */}
                  <Route path="agent/settings" element={<ProtectedRoute allowedRoles={['agent', 'admin']}><Settings /></ProtectedRoute>} /> {/* Reusing Settings component */}
                  
                  {/* Customer Routes */}
                  <Route path="customer" element={<Navigate to="dashboard" replace />} />
                  <Route path="customer/dashboard" element={<ProtectedRoute allowedRoles={['customer', 'admin', 'agent']}><CustomerDashboardHome /></ProtectedRoute>} />
                  <Route path="customer/profile" element={<ProtectedRoute allowedRoles={['customer', 'admin', 'agent']}><Profile /></ProtectedRoute>} />
                  <Route path="customer/settings" element={<ProtectedRoute allowedRoles={['customer', 'admin', 'agent']}><Settings /></ProtectedRoute>} />
                  <Route path="customer/bookings" element={<ProtectedRoute allowedRoles={['customer', 'admin', 'agent']}><CustomerBookings /></ProtectedRoute>} />
                  <Route path="customer/saved" element={<ProtectedRoute allowedRoles={['customer', 'admin', 'agent']}><CustomerSaved /></ProtectedRoute>} />
                  <Route path="customer/payments" element={<ProtectedRoute allowedRoles={['customer', 'admin', 'agent']}><CustomerPayments /></ProtectedRoute>} />
                  <Route path="customer/notifications" element={<ProtectedRoute allowedRoles={['customer', 'admin', 'agent']}><CustomerNotifications /></ProtectedRoute>} />
                  <Route path="customer/reviews" element={<ProtectedRoute allowedRoles={['customer', 'admin', 'agent']}><CustomerReviews /></ProtectedRoute>} />
                  <Route path="customer/messages" element={<ProtectedRoute allowedRoles={['customer', 'admin', 'agent']}><CustomerMessages /></ProtectedRoute>} />
                </Route>
              </Routes>
              </SocketProvider>
            </Router>
            
            {/* Back to top button */}
            <BackToTop />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
