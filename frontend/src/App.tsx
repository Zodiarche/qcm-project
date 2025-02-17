import { BrowserRouter as Router, Routes, Route } from 'react-router';

// import Header from '@/components/Header';
// import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Contact from '@/pages/Contact';

const App = () => {
  return (
    <Router>
      <div id="wrapper">
        {/* <Header /> */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>

      {/* <Footer /> */}
    </Router>
  );
};

export default App;
