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

function Layout({ children }) {
  return <Navbar>{children}</Navbar>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <AppProvider>
          <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/modules" element={<Layout><Modules /></Layout>} />
            <Route path="/lesson/:id" element={<Layout><Lesson /></Layout>} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/login" element={<Layout><Login /></Layout>} />
            <Route path="/register" element={<Layout><Register /></Layout>} />
            <Route path="/access" element={<Layout><Access /></Layout>} />
          </Routes>
        </AppProvider>
      </AdminProvider>
    </BrowserRouter>
  );
}
