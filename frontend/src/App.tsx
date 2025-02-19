import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Contact from '@/pages/Contact';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" />
      <Router>
        <div id="wrapper">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<div>Page de connexion</div>} />
            </Routes>
          </main>
        </div>

        <Footer />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
