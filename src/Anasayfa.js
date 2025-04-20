import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

function Anasayfa() {
  const [ilanlar, setIlanlar] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/ilanlar')
      .then((res) => res.json())
      .then((data) => setIlanlar(data))
      .catch((err) => {
        console.error('İlanlar alınamadı:', err);
        setIlanlar([]);
      });
  }, []);

  const formatTarih = (tarih) => {
    if (!tarih) return '';
    return new Date(tarih).toLocaleDateString('tr-TR');
  };

  return (
    <div className="container">
      <header className="header">
        <Link to="/giris" className="button">Giriş Yap</Link>
        <Link to="/kayit" className="button">Kayıt Ol</Link>
      </header>

      <main className="main">
        <h1 className="title">İlanlar</h1>
        <div className="ilan-listesi">
          {ilanlar.length === 0 ? (
            <p>Henüz hiç ilan yok.</p>
          ) : (
            <ul>
              {ilanlar.map((ilan) => (
                <li key={ilan.id}>
                  <strong>{ilan.baslik}</strong> - {ilan.kadro_turu}
                  <p>{ilan.aciklama}</p>
                  <p><em>{formatTarih(ilan.baslangic_tarihi)} → {formatTarih(ilan.bitis_tarihi)}</em></p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default Anasayfa;
