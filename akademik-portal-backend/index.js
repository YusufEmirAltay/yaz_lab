const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Veritabanı bağlantısı
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'akademik_portal',
  password: 'Gizem.123',
  port: 5432,
});

// Test endpoint
app.get('/', (req, res) => {
  res.send('Backend çalışıyor kraliçem 👑');
});

// Kayıt endpointi (sadece adaylar için)
app.post('/register', async (req, res) => {
  const { tc, name, email, password, role } = req.body;

  if (role !== 'aday') {
    return res.status(403).json({ error: 'Sadece adaylar kayıt olabilir.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO users (id, tc, name, email, password, role) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5) RETURNING *',
      [tc, name, email, password, role]
    );
    res.status(201).json({ message: 'Kayıt başarılı 🎉', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kayıt başarısız 😢' });
  }
});

// Giriş endpointi (TC + şifre ile)
app.post('/api/login', async (req, res) => {
  const { tc, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE tc = $1 AND password = $2',
      [tc, password]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({ message: 'Giriş başarılı', role: user.role });
    } else {
      res.status(401).json({ error: 'TC veya şifre yanlış' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Tüm ilanları getir
app.get('/api/ilanlar', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ilanlar ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('GET ilanlar hata:', error);
    res.status(500).json({ error: 'İlanlar alınamadı' });
  }
});

// Yeni ilan ekle
app.post('/api/ilanlar', async (req, res) => {
  const { baslik, aciklama, kadro_turu, baslangic_tarihi, bitis_tarihi } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO ilanlar (id, baslik, aciklama, kadro_turu, baslangic_tarihi, bitis_tarihi, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW()) RETURNING *',
      [baslik, aciklama, kadro_turu, baslangic_tarihi, bitis_tarihi]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('POST ilanlar hata:', error);
    res.status(500).json({ error: 'İlan eklenemedi' });
  }
});

// İlan güncelle
app.put('/api/ilanlar/:id', async (req, res) => {
  const { id } = req.params;
  const { baslik, aciklama, kadro_turu, baslangic_tarihi, bitis_tarihi } = req.body;

  try {
    await pool.query(
      'UPDATE ilanlar SET baslik = $1, aciklama = $2, kadro_turu = $3, baslangic_tarihi = $4, bitis_tarihi = $5 WHERE id = $6',
      [baslik, aciklama, kadro_turu, baslangic_tarihi, bitis_tarihi, id]
    );
    res.json({ message: 'İlan güncellendi' });
  } catch (error) {
    console.error('PUT ilanlar hata:', error);
    res.status(500).json({ error: 'İlan güncellenemedi' });
  }
});

// İlan sil
app.delete('/api/ilanlar/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM ilanlar WHERE id = $1', [id]);
    res.json({ message: 'İlan silindi' });
  } catch (error) {
    console.error('DELETE ilanlar hata:', error);
    res.status(500).json({ error: 'İlan silinemedi' });
  }
});

// Aday başvuruları getir
app.get('/api/basvurular/:tc', async (req, res) => {
  const { tc } = req.params;

  try {
    const result = await pool.query('SELECT ilan_id FROM basvurular WHERE tc = $1', [tc]);
    res.json(result.rows);
  } catch (err) {
    console.error('GET basvurular hata:', err);
    res.status(500).json({ error: 'Başvurular alınamadı' });
  }
});

// Aday başvuru yap
app.post('/api/basvur', async (req, res) => {
  const { tc, ilan_id } = req.body;

  try {
    await pool.query('INSERT INTO basvurular (tc, ilan_id, basvuru_tarihi) VALUES ($1, $2, NOW())', [tc, ilan_id]);
    res.status(201).json({ message: 'Başvuru başarılı' });
  } catch (err) {
    console.error('POST basvur hata:', err);
    res.status(500).json({ error: 'Başvuru başarısız' });
  }
});

// Sunucu
app.listen(5000, () => {
  console.log('Sunucu 5000 portunda çalışıyor 💻');
});
