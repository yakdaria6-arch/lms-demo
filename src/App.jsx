import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AdminProvider } from './context/AdminContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Modules from './pages/Modules';
import Lesson from './pages/Lesson';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Access from './pages/Access';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <AppProvider>
          <Routes>
            {/* Админка — без Navbar */}
            <Route path="/admin" element={<Admin />} />

            {/* Публичная часть */}
            <Route path="/*" element={
              <div className="min-h-screen bg-[#F8F7FF]">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/modules" element={<Modules />} />
                  <Route path="/lesson/:id" element={<Lesson />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/access" element={<Access />} />
                </Routes>
              </div>
            } />
          </Routes>
        </AppProvider>
      </AdminProvider>
    </BrowserRouter>
  );
}
