import React, { useEffect, useState } from 'react';
import './index.css';
import Header from './components/Header';
import { useNavigate } from 'react-router-dom';

  

const AdaySayfa = () => {
  const navigate = useNavigate();
  const [ilanlar, setIlanlar] = useState([]);
  const [basvurulanIlanlar, setBasvurulanIlanlar] = useState([]);
  const [mesaj, setMesaj] = useState('');

  const tc = localStorage.getItem('tc');

  useEffect(() => {
    // Tüm ilanları çek
    fetch('http://localhost:5000/api/ilanlar')
      .then((res) => res.json())
      .then((data) => setIlanlar(data))
      .catch((err) => console.error('İlanlar alınamadı:', err));

    // Adayın daha önce başvurduğu ilanları çek
    fetch(`http://localhost:5000/api/basvurular/${tc}`)
      .then((res) => res.json())
      .then((data) => {
        const ilanIdler = data.map((b) => b.ilan_id);
        setBasvurulanIlanlar(ilanIdler);
      })
      .catch((err) => console.error('Başvurular alınamadı:', err));
  }, [tc]);

  const basvur = (ilanId) => {
    console.log('tc:', tc, 'ilan_id:', ilanId);
    if (basvurulanIlanlar.includes(ilanId)) {
      setMesaj('Bu ilana zaten başvurdun!');
      return;
    }

    fetch('http://localhost:5000/api/basvur', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tc, ilan_id: ilanId })
    })
      .then((res) => {
        if (res.ok) {
          setMesaj('Başvuru başarılı! 🎉');
          setBasvurulanIlanlar([...basvurulanIlanlar, ilanId]);
        } else {
          setMesaj('Başvuru başarısız 😢');
        }
      })
      .catch(() => setMesaj('Sunucu hatası'));
  };

  return (
    
    <div className="container">
      <Header />
      <h1>Aday Paneli</h1>
      {mesaj && <p>{mesaj}</p>}

      <ul>
        {ilanlar.map((ilan) => (
          <li key={ilan.id}>
            <strong>{ilan.baslik}</strong> - {ilan.kadro_turu}
            <p>{ilan.aciklama}</p>
            <p>
              <em>
                {new Date(ilan.baslangic_tarihi).toLocaleDateString('tr-TR')} →{' '}
                {new Date(ilan.bitis_tarihi).toLocaleDateString('tr-TR')}
              </em>
            </p>
            <button
            onClick={() => {
              localStorage.setItem('ilanId', ilan.id);
              navigate('/basvuru/${ilan.id}');
            }}
            disabled={basvurulanIlanlar.includes(ilan.id)}
          >
            {basvurulanIlanlar.includes(ilan.id) ? 'Zaten Başvurdun' : 'Başvur'}
          </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdaySayfa;
