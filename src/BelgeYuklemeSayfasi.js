
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function BelgeYuklemeSayfasi() {
  const navigate = useNavigate();
  const { basvuruId } = useParams();

  const [kategori, setKategori] = useState('Makale');
  const [altBaslik, setAltBaslik] = useState('');
  const [kisiSayisi, setKisiSayisi] = useState('');
  const [belge, setBelge] = useState(null);
  const [puan, setPuan] = useState(0);

  const [yazarlar, setYazarlar] = useState('');
  const [makaleAdi, setMakaleAdi] = useState('');
  const [dergiAdi, setDergiAdi] = useState('');
  const [ciltNo, setCiltNo] = useState('');
  const [sayfa, setSayfa] = useState('');
  const [yil, setYil] = useState('');

  const [bildiriAdi, setBildiriAdi] = useState('');
  const [konferansAdi, setKonferansAdi] = useState('');
  const [yapildigiYer, setYapildigiYer] = useState('');
  const [bildiriSayfa, setBildiriSayfa] = useState('');
  const [tarih, setTarih] = useState('');

  const altBasliklar = {
    Makale: [
      { label: 'Q1 Dergi', puan: 60 },
      { label: 'Q2 Dergi', puan: 55 },
      { label: 'Q3 Dergi', puan: 50 },
      { label: 'Q4 Dergi', puan: 45 },
      { label: 'Scopus', puan: 40 },
      { label: 'ULAKBIM', puan: 35 },
    ],
    Bildiri: [
      { label: 'Uluslararası Bildiri', puan: 30 },
      { label: 'Ulusal Bildiri', puan: 20 },
    ],
  };

  const kisiCarpan = {
    '1': 1,
    '2': 0.8,
    '3': 0.7,
    '4': 0.6,
    '5-9': 0.5,
    '10+': 0.4,
  };

  const handleAltBaslikChange = (e) => {
    const secilen = altBasliklar[kategori].find(item => item.label === e.target.value);
    setAltBaslik(secilen.label);
    hesaplaPuan(secilen.puan, kisiSayisi);
  };

  const handleKisiSayisiChange = (e) => {
    setKisiSayisi(e.target.value);
    if (altBaslik) {
      const secilen = altBasliklar[kategori].find(item => item.label === altBaslik);
      hesaplaPuan(secilen.puan, e.target.value);
    }
  };

  const hesaplaPuan = (bazPuan, kisi) => {
    const carpan = kisiCarpan[kisi] || 1;
    setPuan(bazPuan * carpan);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!belge) {
      alert('Lütfen bir belge yükleyiniz.');
      return;
    }

    let belgeData = {
      kategori,
      altBaslik,
      kisiSayisi,
      puan,
      belge,
      basvuruId,
    };

    if (kategori === 'Makale') {
      belgeData = { ...belgeData, yazarlar, makaleAdi, dergiAdi, ciltNo, sayfa, yil };
    } else if (kategori === 'Bildiri') {
      belgeData = { ...belgeData, yazarlar, bildiriAdi, konferansAdi, yapildigiYer, bildiriSayfa, tarih };
    }

    console.log(JSON.stringify(belgeData, null, 2));
    navigate('/basvuru-tamamlandi');
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-10">Belge Yükleme</h1>

      <form onSubmit={handleSubmit} className="grid gap-8 w-full max-w-2xl">

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <label className="block mb-2 font-bold text-lg">Faaliyet Türü</label>
          <select 
            value={kategori} 
            onChange={(e) => { setKategori(e.target.value); setAltBaslik(''); }}
            className="border rounded-lg p-3 w-full"
          >
            {Object.keys(altBasliklar).map((kategori) => (
              <option key={kategori} value={kategori}>{kategori}</option>
            ))}
          </select>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <label className="block mb-2 font-bold text-lg">Alt Başlık</label>
          <select 
            value={altBaslik} 
            onChange={handleAltBaslikChange}
            className="border rounded-lg p-3 w-full"
          >
            <option value="">Seçiniz</option>
            {altBasliklar[kategori].map((item) => (
              <option key={item.label} value={item.label}>{item.label}</option>
            ))}
          </select>
        </div>

        {kategori === 'Makale' && (
          <>
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <label className="block mb-2 font-bold text-lg">Yazar(lar)</label>
              <input type="text" value={yazarlar} onChange={(e) => setYazarlar(e.target.value)} className="border rounded-lg p-3 w-full" />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <label className="block mb-2 font-bold text-lg">Makale Adı</label>
              <input type="text" value={makaleAdi} onChange={(e) => setMakaleAdi(e.target.value)} className="border rounded-lg p-3 w-full" />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <label className="block mb-2 font-bold text-lg">Dergi Adı</label>
              <input type="text" value={dergiAdi} onChange={(e) => setDergiAdi(e.target.value)} className="border rounded-lg p-3 w-full" />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <label className="block mb-2 font-bold text-lg">Cilt No</label>
              <input type="text" value={ciltNo} onChange={(e) => setCiltNo(e.target.value)} className="border rounded-lg p-3 w-full" />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <label className="block mb-2 font-bold text-lg">Sayfa</label>
              <input type="text" value={sayfa} onChange={(e) => setSayfa(e.target.value)} className="border rounded-lg p-3 w-full" />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <label className="block mb-2 font-bold text-lg">Yıl</label>
              <input type="text" value={yil} onChange={(e) => setYil(e.target.value)} className="border rounded-lg p-3 w-full" />
            </div>
          </>
        )}

        {kategori === 'Bildiri' && (
          <>
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <label className="block mb-2 font-bold text-lg">Yazar(lar)</label>
              <input type="text" value={yazarlar} onChange={(e) => setYazarlar(e.target.value)} className="border rounded-lg p-3 w-full" />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <label className="block mb-2 font-bold text-lg">Bildiri Adı</label>
              <input type="text" value={bildiriAdi} onChange={(e) => setBildiriAdi(e.target.value)} className="border rounded-lg p-3 w-full" />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <label className="block mb-2 font-bold text-lg">Konferansın Adı</label>
              <input type="text" value={konferansAdi} onChange={(e) => setKonferansAdi(e.target.value)} className="border rounded-lg p-3 w-full" />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <label className="block mb-2 font-bold text-lg">Yapıldığı Yer</label>
              <input type="text" value={yapildigiYer} onChange={(e) => setYapildigiYer(e.target.value)} className="border rounded-lg p-3 w-full" />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <label className="block mb-2 font-bold text-lg">Sayfa Sayıları</label>
              <input type="text" value={bildiriSayfa} onChange={(e) => setBildiriSayfa(e.target.value)} className="border rounded-lg p-3 w-full" />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <label className="block mb-2 font-bold text-lg">Tarih</label>
              <input type="text" value={tarih} onChange={(e) => setTarih(e.target.value)} className="border rounded-lg p-3 w-full" />
            </div>
          </>
        )}

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <label className="block mb-2 font-bold text-lg">Çalışmayı Yapan Kişi Sayısı</label>
          <select 
            value={kisiSayisi} 
            onChange={handleKisiSayisiChange}
            className="border rounded-lg p-3 w-full"
          >
            <option value="">Seçiniz</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5-9">5-9</option>
            <option value="10+">10+</option>
          </select>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <label className="block mb-2 font-bold text-lg">Belge Yükle</label>
          <input 
            type="file" 
            onChange={(e) => setBelge(e.target.files[0])} 
            className="border rounded-lg p-3 w-full" 
          />
        </div>

        <button 
          type="submit"
          className="bg-blue-600 text-white text-xl font-bold px-6 py-3 rounded-2xl hover:bg-blue-700"
        >
          Kaydet ve Devam Et
        </button>

      </form>
    </div>
  );
}

export default BelgeYuklemeSayfasi;
