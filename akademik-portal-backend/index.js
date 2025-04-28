const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const fileUpload = require('express-fileupload');
const AWS = require('aws-sdk');
<<<<<<< HEAD
require('dotenv').config();


=======
const kadroKriterleriRouter = require('./routes/kadroKriterleri');
>>>>>>> 94ed197d0c2f82d4539d333eb60d5090fedb784b

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use('/kadro-kriterleri', kadroKriterleriRouter);

// PostgreSQL bağlantısı
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'akademik_portal',
  password: 'Gizem.123',
  port: 5432,
});

// AWS bağlantı ayarları
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'eu-central-1' // Frankfurt örnek
});

const s3 = new AWS.S3();

// AWS'ye veri yükleme fonksiyonu
async function uploadToS3(basvuruData) {
  const params = {
    Bucket: 'akademik-basvurular', // Kendi S3 bucket adın
    Key: `basvurular/${Date.now()}.json`,
    Body: JSON.stringify(basvuruData),
    ContentType: 'application/json',
  };

  return s3.upload(params).promise();
}

// API: Test
app.get('/', (req, res) => {
  res.send('Backend çalışıyor');
});

// API: Kayıt (sadece adaylar)
app.post('/register', async (req, res) => {
  const { tc, name, email, password, role } = req.body;

  if (role !== 'aday') {
    return res.status(403).json({ error: 'Sadece adaylar kayıt olabilir.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO users (id, tc, name, email, password, role, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW()) RETURNING *',
      [tc, name, email, password, role]
    );
    res.status(201).json({ message: 'Kayıt başarılı 🎉', user: result.rows[0] });
  } catch (error) {
    console.error('POST /register hata:', error);
    res.status(500).json({ error: 'Kayıt başarısız 😢' });
  }
});

// API: Giriş
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
    console.error('POST /api/login hata:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// API: İlanlar
app.get('/api/ilanlar', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ilanlar ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('GET /api/ilanlar hata:', error);
    res.status(500).json({ error: 'İlanlar alınamadı' });
  }
});

// API: Yeni ilan ekle
app.post('/api/ilanlar', async (req, res) => {
  const { baslik, aciklama, kadro_turu, baslangic_tarihi, bitis_tarihi } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO ilanlar (id, baslik, aciklama, kadro_turu, baslangic_tarihi, bitis_tarihi, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW()) RETURNING *',
      [baslik, aciklama, kadro_turu, baslangic_tarihi, bitis_tarihi]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('POST /api/ilanlar hata:', error);
    res.status(500).json({ error: 'İlan eklenemedi' });
  }
});

// API: İlan güncelle
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
    console.error('PUT /api/ilanlar hata:', error);
    res.status(500).json({ error: 'İlan güncellenemedi' });
  }
});

// API: İlan sil
app.delete('/api/ilanlar/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM ilanlar WHERE id = $1', [id]);
    res.json({ message: 'İlan silindi' });
  } catch (error) {
    console.error('DELETE /api/ilanlar hata:', error);
    res.status(500).json({ error: 'İlan silinemedi' });
  }
});

// API: Aday başvurularını getir
app.get('/api/basvurular/:tc', async (req, res) => {
  const { tc } = req.params;

  try {
    const userResult = await pool.query('SELECT id FROM users WHERE tc = $1', [tc]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    const user_id = userResult.rows[0].id;

    const result = await pool.query(
      'SELECT ilan_id FROM basvurular WHERE user_id = $1',
      [user_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('GET /api/basvurular hata:', error);
    res.status(500).json({ error: 'Başvurular alınamadı' });
  }
});

// API: Aday başvuru yap
app.post('/api/basvur', async (req, res) => {
  const { tc, ilan_id } = req.body;
  console.log('BACKEND GİRDİ → tc:', tc, 'ilan_id:', ilan_id);

  try {
    const userResult = await pool.query('SELECT id FROM users WHERE tc = $1', [tc]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    const user_id = userResult.rows[0].id;

    const check = await pool.query(
      'SELECT * FROM basvurular WHERE user_id = $1 AND ilan_id = $2',
      [user_id, ilan_id]
    );

    if (check.rows.length > 0) {
      return res.status(409).json({ error: 'Zaten bu ilana başvurmuşsun' });
    }

    const result = await pool.query(
      'INSERT INTO basvurular (id, user_id, ilan_id, durum, basvuru_tarihi) VALUES (gen_random_uuid(), $1, $2, $3, NOW()) RETURNING *',
      [user_id, ilan_id, 'beklemede']
    );

    res.status(201).json({ message: 'Başvuru başarıyla eklendi', basvuru: result.rows[0] });
  } catch (error) {
    console.error('POST /api/basvur hata:', error); 
    res.status(500).json({ error: 'Başvuru eklenemedi' });
  }
});

// API: Başvuru formu ile birlikte dosya kaydetme
app.post('/api/basvuru', async (req, res) => {
  try {
    const basvuru = req.body;
    await uploadToS3(basvuru);
    res.status(201).json({ message: 'Başvuru AWS S3\'e kaydedildi.' });
  } catch (error) {
    console.error('Başvuru kaydetme hatası:', error);
    res.status(500).json({ error: 'Başvuru kaydedilemedi.' });
  }
});

<<<<<<< HEAD
// AWS bağlantı ayarları
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

// AWS'ye veri yükleme fonksiyonu
async function uploadToS3(basvuruData) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME, // Buraya kendi AWS S3 bucket adını yaz
    Key: `basvurular/${Date.now()}.json`,
    Body: JSON.stringify(basvuruData),
    ContentType: 'application/json',
  };

  return s3.upload(params).promise();
}

// Başvuruları kullanıcı adı ve ilan başlığı ile getir
app.get('/api/basvurular', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        basvurular.id AS basvuru_id,
        users.name AS aday_adi,
        ilanlar.baslik AS ilan_basligi,
        basvurular.durum,
        basvurular.basvuru_tarihi
      FROM basvurular
      JOIN users ON basvurular.user_id = users.id
      JOIN ilanlar ON basvurular.ilan_id = ilanlar.id
      ORDER BY basvurular.basvuru_tarihi DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('GET /api/basvurular hata:', error);
    res.status(500).json({ error: 'Başvurular alınamadı' });
  }
});
=======
// Sunucu başlat
app.listen(5000, () => {
  console.log('Sunucu 5000 portunda çalışıyor 💻');
});
>>>>>>> 94ed197d0c2f82d4539d333eb60d5090fedb784b
