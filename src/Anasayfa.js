import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './index.css';

function Anasayfa() {
  const [ilanlar, setIlanlar] = useState([]);
  const [kriterler, setKriterler] = useState([]);
  const navigate = useNavigate();
  const [girisYapildiMi, setGirisYapildiMi] = useState(!!localStorage.getItem('tc'));

  useEffect(() => {
    fetch('http://localhost:5000/api/ilanlar')
      .then((res) => res.json())
      .then((data) => setIlanlar(data))
      .catch((err) => {
        console.error('İlanlar alınamadı:', err);
        setIlanlar([]);
      });

    fetch('http://localhost:5000/kadro-kriterleri')
      .then((res) => res.json())
      .then((data) => setKriterler(data))
      .catch((err) => {
        console.error('Kadro kriterleri alınamadı:', err);
        setKriterler([]);
      });
  }, []);

  const formatTarih = (tarih) => {
    if (!tarih) return '';
    return new Date(tarih).toLocaleDateString('tr-TR');
  };

  const handleIlanTikla = (ilanId) => {
    const tc = localStorage.getItem('tc');
    if (tc) {
      navigate(`/basvuru/${ilanId}`);
    } else {
      localStorage.setItem('bekleyenBasvuru', ilanId);
      navigate('/giris');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tc');
    setGirisYapildiMi(false);
    navigate('/');
  };

  return (
    <div className="container">
      <img 
        src="/kou.png" 
        alt="Kocaeli Üniversitesi" 
        style={{
          position: 'fixed',
          top: 10,
          left: 10,
          height: '100px',
          zIndex: 1000
        }}
      />

      <header className="header">
        {!girisYapildiMi ? (
          <>
            <Link to="/giris" className="button">Giriş Yap</Link>
            <Link to="/kayit" className="button">Kayıt Ol</Link>
          </>
        ) : (
          <button 
            onClick={handleLogout} 
            className="button"
            style={{
              display: 'inline-block',
              backgroundColor: '#4CAF50',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 20px',
              fontSize: '16px',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              textDecoration: 'none',
              marginLeft: '10px',
            }}
          >
            Çıkış Yap
          </button>
        )}
      </header>

      <main className="main">
        <h1 className="title">İlanlar</h1>
        <div className="ilan-listesi">
          {ilanlar.length === 0 ? (
            <p>Henüz hiç ilan yok.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {ilanlar.map((ilan) => (
                <div 
                  key={ilan.id}
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '20px',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onClick={() => handleIlanTikla(ilan.id)}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#2c3e50' }}>
                    {ilan.baslik}
                  </span> - {ilan.kadro_turu}
                  <p style={{ marginTop: '10px' }}>{ilan.aciklama}</p>
                  <p style={{ fontStyle: 'italic', color: '#555' }}>
                    {formatTarih(ilan.baslangic_tarihi)} → {formatTarih(ilan.bitis_tarihi)}
                  </p>

                  {/* Kadro Kriterleri */}
                  <div style={{ marginTop: '15px' }}>
                    <h4 style={{ marginBottom: '8px' }}>Kadro Kriterleri:</h4>
                    {kriterler.filter((kriter) => kriter.kadro_turu === ilan.kadro_turu).length === 0 ? (
                      <p style={{ fontStyle: 'italic', color: '#777' }}>Bu kadro için henüz kriter eklenmemiş.</p>
                    ) : (
                      <ul style={{ paddingLeft: '20px' }}>
                        {kriterler
                          .filter((kriter) => kriter.kadro_turu === ilan.kadro_turu)
                          .map((kriter) => (
                            <li key={kriter.id} style={{ marginBottom: '5px' }}>
                              <strong>{kriter.kriter_adi}:</strong> {kriter.aciklama}
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Anasayfa;
