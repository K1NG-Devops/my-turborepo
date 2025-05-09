import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Admission from './pages/Admission';
import Programs from './pages/Programs';
import Contact from './pages/Contact';
import PopUploadForm from './components/PopUploadForm';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/home" element={<Home />} />
          {/* <Route path="/about" element={<About />} /> */}
          {/* <Route path="/admission" element={<Admission />} /> */}
          <Route path="/programs" element={<Programs />} />
          {/* <Route path="/contact" element={<Contact />} /> */}
          <Route path="/popupload" element={<PopUploadForm />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;