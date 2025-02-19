import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { Toaster } from 'react-hot-toast';

import Footer from '@/components/Footer';
import Header from '@/components/Header';

import Contact from '@/pages/Contact';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Profile from '@/pages/Profile';
import QCM from '@/pages/QCM';
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
              <Route path="/qcm" element={<QCM />} />
            </Routes>
          </main>
        </div>

        <Footer />
      </Router>
    </>
  );
};

export default App;
