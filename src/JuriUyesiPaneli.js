import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✨ burası yeni

function JuriUyesiPaneli() {
  const [basvurular, setBasvurular] = useState([]);
  const navigate = useNavigate(); // ✨ burası yeni

  useEffect(() => {
    fetch('http://localhost:5000/api/basvurular')
      .then((res) => res.json())
      .then((data) => setBasvurular(data))
      .catch((err) => console.error('Başvurular alınamadı:', err));
  }, []);

  const handleBasvuruClick = (basvuruId) => {
    navigate(`/juri/basvuru/${basvuruId}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Jüri Üyesi Paneli</h1>

      {basvurular.length === 0 ? (
        <p>Şu anda hiç başvuru yok.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {basvurular.map((basvuru) => (
            <div 
              key={basvuru.basvuru_id}
              onClick={() => handleBasvuruClick(basvuru.basvuru_id)} // ✨ tıklayınca
              style={{
                border: '1px solid #ccc',
                borderRadius: '10px',
                padding: '15px',
                backgroundColor: '#f8f8f8',
                cursor: 'pointer', // ✨ cursor pointer
                transition: '0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <h3>Aday: {basvuru.aday_adi}</h3>
              <p>Başvurduğu İlan: {basvuru.ilan_basligi}</p>
              <p>Durum: {basvuru.durum}</p>
              <p>Başvuru Tarihi: {new Date(basvuru.basvuru_tarihi).toLocaleDateString('tr-TR')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JuriUyesiPaneli;
