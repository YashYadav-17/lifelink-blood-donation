import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastProvider } from './components/UI'
import { Navbar, Footer } from './components/Navigation'
import { Home, FindBlood, DonorDirectory, Hospitals, About, Emergency } from './pages/PublicPages'
import { RequestBlood, BecomeDonor, Login, Profile } from './pages/FormPages'
import { Dashboard, Inventory } from './pages/DashboardPages'
import RequestsPage from './pages/RequestsPage'
import ProtectedRoute from './components/ProtectedRoute'
import { AdminDonors, AdminHospitals, AdminEmergency } from './pages/AdminPages'
import NotFound from './pages/NotFound'
function Shell({ children }) { return <><Navbar /><main>{children}</main><Footer /></> }
function App() { return <ToastProvider><BrowserRouter><Routes>
  <Route path="/" element={<Shell><Home /></Shell>} /><Route path="/find-blood" element={<Shell><FindBlood /></Shell>} />
  <Route path="/donate" element={<Shell><BecomeDonor /></Shell>} /><Route path="/request-blood" element={<Shell><RequestBlood /></Shell>} />
  <Route path="/donors" element={<Shell><DonorDirectory /></Shell>} /><Route path="/hospitals" element={<Shell><Hospitals /></Shell>} />
  <Route path="/emergency" element={<Shell><Emergency /></Shell>} /><Route path="/about" element={<Shell><About /></Shell>} />
  <Route path="/login" element={<Shell><Login /></Shell>} /><Route path="/profile" element={<Shell><Profile /></Shell>} />
  <Route path="/requests" element={<ProtectedRoute><RequestsPage /></ProtectedRoute>} />
  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /><Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
  <Route path="/admin/donors" element={<ProtectedRoute><AdminDonors /></ProtectedRoute>} /><Route path="/admin/hospitals" element={<ProtectedRoute><AdminHospitals /></ProtectedRoute>} /><Route path="/emergency-admin" element={<ProtectedRoute><AdminEmergency /></ProtectedRoute>} />
  <Route path="*" element={<Shell><NotFound /></Shell>} />
</Routes></BrowserRouter></ToastProvider> }
export default App
