import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';

function YoneticiPanel() {
  const [kadroTuru, setKadroTuru] = useState('');
  const [kriterAdi, setKriterAdi] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [kriterler, setKriterler] = useState([]); // Listelemek için kriterler state

  const getKriterler = async () => {
    try {
      const response = await axios.get('http://localhost:5000/kadro-kriterleri'); 
      setKriterler(response.data);
    } catch (error) {
      console.error('Kriterler çekilemedi:', error);
    }
  };

  const handleEkle = async () => {
    try {
      await axios.post('http://localhost:5000/kadro-kriterleri', {
        kadro_turu: kadroTuru,
        kriter_adi: kriterAdi,
        aciklama: aciklama,
      });
      alert('Kriter başarıyla eklendi!');
      setKadroTuru('');
      setKriterAdi('');
      setAciklama('');
      getKriterler(); 
    } catch (error) {
      console.error('Kriter ekleme hatası:', error);
      alert('Kriter eklenirken hata oluştu.');
    }
  };

  const handleSil = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/kadro-kriterleri/${id}`);
      alert('Kriter silindi!');
      getKriterler(); // Silindikten sonra listeyi güncelle
    } catch (error) {
      console.error('Kriter silme hatası:', error);
      alert('Kriter silinirken hata oluştu.');
    }
  };

  useEffect(() => {
    getKriterler(); // Sayfa açılınca kriterleri çek
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Header />
      <h1>Yönetici Paneli</h1>

      <div style={{ marginBottom: '10px' }}>
        <label>Kadro Türü: </label>
        <select value={kadroTuru} onChange={(e) => setKadroTuru(e.target.value)}>
          <option value="">Seçiniz</option>
          <option value="Dr. Öğr. Üyesi">Dr. Öğr. Üyesi</option>
          <option value="Doçent">Doçent</option>
          <option value="Profesör">Profesör</option>
        </select>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Kriter Adı: </label>
        <input
          type="text"
          value={kriterAdi}
          onChange={(e) => setKriterAdi(e.target.value)}
          placeholder="Örneğin: Yayın Sayısı"
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Açıklama: </label>
        <input
          type="text"
          value={aciklama}
          onChange={(e) => setAciklama(e.target.value)}
          placeholder="Örneğin: En az 5 uluslararası makale"
        />
      </div>

      <button onClick={handleEkle}>Kriter Ekle</button>

      {/* 📋 Kriter Listesi */}
      <div style={{ marginTop: '30px' }}>
        <h2>Mevcut Kriterler</h2>
        {kriterler.length === 0 ? (
          <p>Henüz kriter eklenmemiş.</p>
        ) : (
          <ul>
            {kriterler.map((kriter) => (
              <li key={kriter.id}>
                <strong>{kriter.kadro_turu}</strong> - {kriter.kriter_adi}: {kriter.aciklama}
                <button
                  onClick={() => handleSil(kriter.id)}
                  style={{
                    marginLeft: '10px',
                    backgroundColor: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Sil
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default YoneticiPanel;
