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
    <div className="container" style={{ paddingTop: '100px' }}>
      {/* HEADER */}
      <header 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '80px',
          backgroundColor: '#009E49', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
          zIndex: 999,
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {/* Sol kısım: Logo ve İsim */}
        <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
          <img 
            src="/kou.png" 
            alt="Kocaeli Üniversitesi" 
            style={{ height: '55px', marginRight: '10px', flexShrink: 0 }}
          />
          <span 
            style={{ 
              color: 'white', 
              fontSize: '20px', 
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            Akademik Portal
          </span>
        </div>

        {/* Sağ kısım: Butonlar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {!girisYapildiMi ? (
            <>
              <Link 
                to="/giris" 
                style={{
                  backgroundColor: 'white',
                  color: '#009E49',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.3s ease',
                  border: '2px solid white'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e8f5e9';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                }}
              >
                Giriş Yap
              </Link>
              <Link 
                to="/kayit" 
                style={{
                  backgroundColor: 'white',
                  color: '#009E49',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.3s ease',
                  border: '2px solid white'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e8f5e9';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                }}
              >
                Kayıt Ol
              </Link>
            </>
          ) : (
            <button 
              onClick={handleLogout}
              style={{
                backgroundColor: 'white',
                color: '#009E49',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '2px solid white',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#e8f5e9';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
              }}
            >
              Çıkış Yap
            </button>
          )}
        </div>
      </header>

      {/* Ana içerik */}
      <main className="main">
        <h1 className="title" style={{ textAlign: 'center', marginBottom: '20px' }}>İlanlar</h1>
        <div className="ilan-listesi">
          {ilanlar.length === 0 ? (
            <p style={{ textAlign: 'center' }}>Henüz hiç ilan yok.</p>
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
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onClick={() => handleIlanTikla(ilan.id)}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
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
