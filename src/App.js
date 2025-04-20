import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Anasayfa from './Anasayfa';
import GirisYap from './GirisYap';
import KayitOl from './KayitOl';
import AdminPanel from './AdminPanel'; 
import AdaySayfa from './AdaySayfa';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Anasayfa />} />
        <Route path="/giris" element={<GirisYap />} />
        <Route path="/kayit" element={<KayitOl />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/aday" element={<AdaySayfa />} />
      </Routes>
    </Router>
  );
}

export default App;
