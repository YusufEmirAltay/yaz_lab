// AdminPanel.js
import React, { useState, useEffect } from 'react';

const formatTarih = (tarih) => {
  if (!tarih) return '';
  const date = new Date(tarih);
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}.${date.getFullYear()}`;
};

const AdminPanel = () => {
  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [kadroTuru, setKadroTuru] = useState('Dr. Öğr. Üyesi');
  const [baslangicTarihi, setBaslangicTarihi] = useState('');
  const [bitisTarihi, setBitisTarihi] = useState('');
  const [ilanlar, setIlanlar] = useState([]);
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);
  const [duzenlenenIlanId, setDuzenlenenIlanId] = useState(null);

  useEffect(() => {
    ilanlariGetir();
  }, []);

  const ilanlariGetir = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/ilanlar');
      const data = await res.json();
      setIlanlar(data);
    } catch (err) {
      console.error('Veri alınırken hata:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ilan = {
      baslik,
      aciklama,
      kadro_turu: kadroTuru,
      baslangic_tarihi: baslangicTarihi,
      bitis_tarihi: bitisTarihi
    };

    try {
      const url = duzenlemeModu
        ? `http://localhost:5000/api/ilanlar/${duzenlenenIlanId}`
        : 'http://localhost:5000/api/ilanlar';

      const method = duzenlemeModu ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ilan)
      });

      if (response.ok) {
        ilanlariGetir();
        setBaslik('');
        setAciklama('');
        setKadroTuru('Dr. Öğr. Üyesi');
        setBaslangicTarihi('');
        setBitisTarihi('');
        setDuzenlemeModu(false);
        setDuzenlenenIlanId(null);
      }
    } catch (error) {
      console.error('Hata:', error);
    }
  };

  const ilanDuzenle = (ilan) => {
    setBaslik(ilan.baslik);
    setAciklama(ilan.aciklama);
    setKadroTuru(ilan.kadro_turu);
    setBaslangicTarihi(ilan.baslangic_tarihi);
    setBitisTarihi(ilan.bitis_tarihi);
    setDuzenlemeModu(true);
    setDuzenlenenIlanId(ilan.id);
  };

  const ilanSil = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/ilanlar/${id}`, { method: 'DELETE' });
      ilanlariGetir();
    } catch (error) {
      console.error('Silme hatası:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>{duzenlemeModu ? 'İlanı Düzenle' : 'Yeni İlan Ekle'}</h2>
      <form onSubmit={handleSubmit}>
        <label>İlan Başlığı:</label>
        <input
          value={baslik}
          onChange={(e) => setBaslik(e.target.value)}
          placeholder="İlan Başlığı"
          required
        />

        <label>İlan Açıklaması:</label>
        <textarea
          value={aciklama}
          onChange={(e) => setAciklama(e.target.value)}
          placeholder="İlan Açıklaması"
          required
        />

        <label>Kadro Türü:</label>
        <select value={kadroTuru} onChange={(e) => setKadroTuru(e.target.value)}>
          <option value="Dr. Öğr. Üyesi">Dr. Öğr. Üyesi</option>
          <option value="Doçent">Doçent</option>
          <option value="Profesör">Profesör</option>
        </select>

        <label>Başlangıç Tarihi:</label>
        <input
          type="date"
          value={baslangicTarihi}
          onChange={(e) => setBaslangicTarihi(e.target.value)}
          required
        />

        <label>Bitiş Tarihi:</label>
        <input
          type="date"
          value={bitisTarihi}
          onChange={(e) => setBitisTarihi(e.target.value)}
          required
        />

        <button type="submit">{duzenlemeModu ? 'Güncelle' : 'Ekle'}</button>
      </form>

      <h2>Mevcut İlanlar</h2>
      <ul>
        {Array.isArray(ilanlar) && ilanlar.map((ilan) => (
          <li key={ilan.id}>
            <strong>{ilan.baslik}</strong> - {ilan.kadro_turu}
            <p>{ilan.aciklama}</p>
            <p><em>{formatTarih(ilan.baslangic_tarihi)} → {formatTarih(ilan.bitis_tarihi)}</em></p>
            <button onClick={() => ilanDuzenle(ilan)}>Düzenle</button>
            <button onClick={() => ilanSil(ilan.id)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
