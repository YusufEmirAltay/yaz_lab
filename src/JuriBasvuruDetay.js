
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function JuriBasvuruDetay() {
  const { id } = useParams(); // URL'den başvuru id'sini alıyoruz
  const [belgeler, setBelgeler] = useState([]);

  useEffect(() => {
    // Başvuruya ait belgeleri çekiyoruz
    fetch(`http://localhost:5000/api/belgeler/${id}`)
      .then((res) => res.json())
      .then((data) => setBelgeler(data))
      .catch((err) => console.error('Belgeler alınamadı:', err));
  }, [id]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Başvuru Detayı</h1>

      {belgeler.length === 0 ? (
        <p>Bu başvuru için henüz belge yüklenmemiş.</p>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <h3>Başvuru Belgeleri:</h3>
          <ul>
            {belgeler.map((belge) => (
              <li key={belge.id} style={{ marginBottom: '10px' }}>
                <a href={belge.belge_url} target="_blank" rel="noopener noreferrer">
                  {belge.belge_adi}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default JuriBasvuruDetay;
