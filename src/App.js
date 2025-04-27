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
            top: 10, 
            right: 10,
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
          <Route path="/basvuru/:ilanId" element={<BasvuruSayfasi />} />
          <Route path="/juri" element={<JuriUyesiPaneli />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;
