import React, { useState } from 'react';
//import axios from 'axios';

function BasvuruSayfasi() {
  const [formData, setFormData] = useState({
    adSoyad: '',
    tarih: '',
    kurum: '',
    kadro: '',
    makaleler: [{ yazar: '', makaleAdi: '', dergiAdi: '', puan: '' }],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMakaleChange = (index, e) => {
    const newMakaleler = [...formData.makaleler];
    newMakaleler[index][e.target.name] = e.target.value;
    setFormData({ ...formData, makaleler: newMakaleler });
  };

  const handleAddMakale = () => {
    setFormData({
      ...formData,
      makaleler: [...formData.makaleler, { yazar: '', makaleAdi: '', dergiAdi: '', puan: '' }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/basvuru', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Başvuru başarıyla kaydedildi!');
        setFormData({
          adSoyad: '',
          tarih: '',
          kurum: '',
          kadro: '',
          makaleler: [{ yazar: '', makaleAdi: '', dergiAdi: '', puan: '' }],
        });
      } else {
        alert('Başvuru kaydedilemedi.');
      }
    } catch (error) {
      console.error('Hata:', error);
      alert('Sunucu hatası oluştu.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h1>Başvuru Formu</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Ad Soyad:</label>
          <input type="text" name="adSoyad" value={formData.adSoyad} onChange={handleChange} required />
        </div>

        <div>
          <label>Tarih:</label>
          <input type="date" name="tarih" value={formData.tarih} onChange={handleChange} required />
        </div>

        <div>
          <label>Kurum:</label>
          <input type="text" name="kurum" value={formData.kurum} onChange={handleChange} required />
        </div>

        <div>
          <label>Kadro:</label>
          <input type="text" name="kadro" value={formData.kadro} onChange={handleChange} required />
        </div>

        <div>
          <h3>Makaleler</h3>
          {formData.makaleler.map((makale, index) => (
            <div key={index} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc' }}>
              <input
                type="text"
                placeholder="Yazar"
                name="yazar"
                value={makale.yazar}
                onChange={(e) => handleMakaleChange(index, e)}
                required
              />
              <input
                type="text"
                placeholder="Makale Adı"
                name="makaleAdi"
                value={makale.makaleAdi}
                onChange={(e) => handleMakaleChange(index, e)}
                required
              />
              <input
                type="text"
                placeholder="Dergi Adı"
                name="dergiAdi"
                value={makale.dergiAdi}
                onChange={(e) => handleMakaleChange(index, e)}
                required
              />
              <input
                type="text"
                placeholder="Puan"
                name="puan"
                value={makale.puan}
                onChange={(e) => handleMakaleChange(index, e)}
                required
              />
            </div>
          ))}
          <button type="button" onClick={handleAddMakale}>Yeni Makale Ekle</button>
        </div>

        <button type="submit" style={{ marginTop: '20px' }}>Kaydet</button>
      </form>
    </div>
  );
}

export default BasvuruSayfasi;
