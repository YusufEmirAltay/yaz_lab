import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Anasayfa from './Anasayfa';
import GirisYap from './GirisYap';
import KayitOl from './KayitOl';
import AdminPanel from './AdminPanel'; 
import AdaySayfa from './AdaySayfa';
import BelgeYuklemeSayfasi from './BelgeYuklemeSayfasi';
import BasvuruTamamlandi from './BasvuruTamamlandi';
import YoneticiPanel from './YoneticiPanel'; 
import BasvuruSayfasi from './BasvuruSayfasi';
import JuriUyesiPaneli from './JuriUyesiPaneli';
import JuriBasvuruDetay from './JuriBasvuruDetay';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <Router>
      <div>
        <button 
          onClick={() => setDarkMode(!darkMode)} 
          style={{ 
            position: 'fixed', 
            top: 5, 
            right: 195,
            padding: '8px 12px', 
            background: '#009E49', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            zIndex: 1000,
            fontSize: 10,
            maxWidth: 60,
            maxHeight: 30,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>

        <Routes>
          <Route path="/" element={<Anasayfa />} />
          <Route path="/giris" element={<GirisYap />} />
          <Route path="/kayit" element={<KayitOl />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/aday" element={<AdaySayfa />} />
          <Route path="/belge-yukle/:basvuruId" element={<BelgeYuklemeSayfasi />} />
          <Route path="/basvuru-tamamlandi" element={<BasvuruTamamlandi />} />
          <Route path="/yonetici" element={<YoneticiPanel />} />
          <Route path="/basvuru" element={<BasvuruSayfasi />} />
          <Route path="/basvuru/:ilanId" element={<BasvuruSayfasi />} />
          <Route path="/juri" element={<JuriUyesiPaneli />} />
          <Route path="/juri/basvuru/:id" element={<JuriBasvuruDetay />} />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
