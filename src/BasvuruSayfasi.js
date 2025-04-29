import React, { useState } from 'react';
import { toast } from 'react-toastify';

function BasvuruSayfasi() {
  const [formData, setFormData] = useState({
    adSoyad: '',
    tarih: '',
    kurum: '',
    kadro: '',
    makaleler: [{ baslik: '', dosya: null }],
    bildiriler: [{ baslik: '', dosya: null }],
    kitaplar: [{ baslik: '', dosya: null }],
    sanatsalCalismalar: [{ baslik: '', dosya: null }],
    tasarimlar: [{ baslik: '', dosya: null }],
    projeler: [{ baslik: '', dosya: null }],
    atiflar: [{ baslik: '', dosya: null }],
    egitimFaaliyetleri: [{ baslik: '', dosya: null }],
    idariGorevler: [{ baslik: '', dosya: null }],
    oduller: [{ baslik: '', dosya: null }],
    digerFaaliyetler: [{ baslik: '', dosya: null }]
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleListChange = (section, index, e) => {
    const updatedList = [...formData[section]];
    if (e.target.name === 'dosya') {
      updatedList[index][e.target.name] = e.target.files[0];
    } else {
      updatedList[index][e.target.name] = e.target.value;
    }
    setFormData({ ...formData, [section]: updatedList });
  };

  const handleAddItem = (section) => {
    setFormData({
      ...formData,
      [section]: [...formData[section], { baslik: '', dosya: null }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tc = localStorage.getItem('tc');
    const ilanId = localStorage.getItem('ilanId');

    const data = new FormData();

    // Ana bilgiler
    data.append('adSoyad', formData.adSoyad);
    data.append('tarih', formData.tarih);
    data.append('kurum', formData.kurum);
    data.append('kadro', formData.kadro);

    // Listeler (Makaleler, Bildiriler, vb.)
    const sections = [
      'makaleler', 'bildiriler', 'kitaplar', 'sanatsalCalismalar',
      'tasarimlar', 'projeler', 'atiflar', 'egitimFaaliyetleri',
      'idariGorevler', 'oduller', 'digerFaaliyetler'
    ];

    sections.forEach((section) => {
      formData[section].forEach((item, index) => {
        data.append(`${section}[${index}][baslik]`, item.baslik);
        if (item.dosya) {
          data.append(`${section}[${index}][dosya]`, item.dosya);
        }
      });
    });

    try {
      console.log('AWS isteği başlıyor...');
      const awsResponse = await fetch('http://localhost:5000/api/basvuru', {
        method: 'POST',
        body: data,
      });

      if (!awsResponse.ok) {
        console.error('AWS isteği başarısız:', await awsResponse.text());
        throw new Error('AWS S3 kaydı başarısız.');
      } else {
        toast.success('Başvuru başarıyla kaydedildi!');
        setFormData({
          adSoyad: '',
          tarih: '',
          kurum: '',
          kadro: '',
          makaleler: [{ baslik: '', dosya: null }],
          bildiriler: [{ baslik: '', dosya: null }],
          kitaplar: [{ baslik: '', dosya: null }],
          sanatsalCalismalar: [{ baslik: '', dosya: null }],
          tasarimlar: [{ baslik: '', dosya: null }],
          projeler: [{ baslik: '', dosya: null }],
          atiflar: [{ baslik: '', dosya: null }],
          egitimFaaliyetleri: [{ baslik: '', dosya: null }],
          idariGorevler: [{ baslik: '', dosya: null }],
          oduller: [{ baslik: '', dosya: null }],
          digerFaaliyetler: [{ baslik: '', dosya: null }]
        });
      }
      console.log('AWS isteği başarılı!');

      console.log('Veritabanı isteği başlıyor...');
      const dbResponse = await fetch('http://localhost:5000/api/basvur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tc: tc, ilan_id: ilanId }),
      });

      if (!dbResponse.ok) {
        console.error('Veritabanı isteği başarısız:', await dbResponse.text());
        throw new Error('Veritabanı kaydı başarısız.');
      }
      console.log('Veritabanı isteği başarılı!');

      alert('Başvuru başarıyla kaydedildi!');
    } catch (error) {
      console.error('handleSubmit hatası:', error);
      alert('Başvuru sırasında hata oluştu.');
      toast.error('Sunucu hatası oluştu.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <h1>Başvuru Formu</h1>
      <form onSubmit={handleSubmit}>
        {/* Ana bilgiler */}
        <input type="text" name="adSoyad" value={formData.adSoyad} onChange={handleChange} placeholder="Ad Soyad" required />
        <input type="date" name="tarih" value={formData.tarih} onChange={handleChange} required />
        <input type="text" name="kurum" value={formData.kurum} onChange={handleChange} placeholder="Kurum" required />
        <input type="text" name="kadro" value={formData.kadro} onChange={handleChange} placeholder="Kadro" required />

        {/* Listeler */}
        {[
          { label: 'Makaleler', key: 'makaleler' },
          { label: 'Bildiriler', key: 'bildiriler' },
          { label: 'Kitaplar', key: 'kitaplar' },
          { label: 'Sanatsal Çalışmalar', key: 'sanatsalCalismalar' },
          { label: 'Tasarimlar', key: 'tasarimlar' },
          { label: 'Projeler', key: 'projeler' },
          { label: 'Atıflar', key: 'atiflar' },
          { label: 'Eğitim Faaliyetleri', key: 'egitimFaaliyetleri' },
          { label: 'İdari Görevler', key: 'idariGorevler' },
          { label: 'Ödüller', key: 'oduller' },
          { label: 'Diğer Faaliyetler', key: 'digerFaaliyetler' },
        ].map((section) => (
          <div key={section.key} style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>{section.label}</h3>
            {formData[section.key].map((item, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder={`${section.label} Başlığı`}
                  name="baslik"
                  value={item.baslik}
                  onChange={(e) => handleListChange(section.key, index, e)}
                  required
                />
                <input
                  type="file"
                  name="dosya"
                  onChange={(e) => handleListChange(section.key, index, e)}
                />
              </div>
            ))}
            <button type="button" onClick={() => handleAddItem(section.key)}>Yeni {section.label} Ekle</button>
          </div>
        ))}

        <button type="submit" style={{ marginTop: '30px', padding: '10px 20px' }}>Başvuruyu Kaydet</button>
      </form>
    </div>
  );
}

export default BasvuruSayfasi;
