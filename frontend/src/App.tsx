import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { Toaster } from 'react-hot-toast';

import Footer from '@/components/Footer';
import Header from '@/components/Header';

import Contact from '@/pages/Contact';
import Dashboard from '@/pages/Dashboard';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Profile from '@/pages/Profile';
import QCMList from '@/pages/QCM';
import QCMDetail from '@/pages/QCMDetail';
import QCMResult from '@/pages/QCMResult';
import Register from '@/pages/Register';

const App = () => {
  return (
    <>
      <Toaster position="bottom-right" />
      <Router>
        <div id="wrapper">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/qcms" element={<QCMList />} />
              <Route path="/qcms/:id" element={<QCMDetail />} />
              <Route path="/qcms/:id/result" element={<QCMResult />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
        </div>

        <Footer />
      </Router>
    </>
  );
};

export default App;
