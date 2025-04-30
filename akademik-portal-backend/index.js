// index.js - Güncellenmiş ve tamamlanmış sürüm

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const fileUpload = require('express-fileupload');
const AWS = require('aws-sdk');
const kadroKriterleriRouter = require('./routes/kadroKriterleri');
require('dotenv').config();
const PDFDocument = require('pdfkit');
const streamBuffers = require('stream-buffers');

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

// PDF oluşturup AWS'ye yükleyen fonksiyon
async function uploadPDFToS3FromJSON(jsonData) {
  const doc = new PDFDocument();
  const bufferStream = new streamBuffers.WritableStreamBuffer();

  doc.pipe(bufferStream);

  doc.fontSize(16).text('Akademik Başvuru Dökümü', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Ad Soyad: ${jsonData.adSoyad}`);
  doc.text(`Kurum: ${jsonData.kurum}`);
  doc.text(`Kadro: ${jsonData.kadro}`);
  doc.text(`Tarih: ${jsonData.tarih}`);
  doc.moveDown();

  const sections = jsonData.sections || {};
  for (const key in sections) {
    const entries = sections[key];
    if (!entries || entries.length === 0) continue;

    doc.fontSize(14).text(`📌 ${key.toUpperCase()}`, { underline: true });
    entries.forEach((item, i) => {
      doc.fontSize(12).text(`${i + 1}. ${item.baslik || 'Başlıksız'}${item.dosya ? ` (Dosya: ${item.dosya})` : ''}`);
    });
    doc.moveDown();
  }

  doc.end();
  const pdfBuffer = await new Promise((resolve, reject) => {
    bufferStream.on('finish', () => resolve(bufferStream.getContents()));
    bufferStream.on('error', reject);
  });
  

  const result = await s3.upload({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `basvurular/${Date.now()}_basvuru.pdf`,
    Body: pdfBuffer,
    ContentType: 'application/pdf',
  }).promise();

  console.log('📄 PDF başarıyla yüklendi:', result.Location);
  return result.Location;
}

// Test endpointi
app.get('/', (req, res) => {
  res.send('Backend çalışıyor');
});

// Aday kayıt
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

// Giriş
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

// Başvuru gönderme ve PDF olarak AWS'ye yükleme
app.post('/api/basvuru', async (req, res) => {
  try {
    const formData = req.body;

    const basvuru = {
      adSoyad: formData.adSoyad,
      tarih: formData.tarih,
      kurum: formData.kurum,
      kadro: formData.kadro,
      sections: {}
    };

    const sections = [
      'makaleler', 'bildiriler', 'kitaplar', 'sanatsalCalismalar',
      'tasarimlar', 'projeler', 'atiflar', 'egitimFaaliyetleri',
      'idariGorevler', 'oduller', 'digerFaaliyetler'
    ];

    sections.forEach(section => {
      basvuru.sections[section] = [];
      let index = 0;
      while (formData[`${section}[${index}][baslik]`]) {
        basvuru.sections[section].push({
          baslik: formData[`${section}[${index}][baslik]`],
          dosya: req.files?.[`${section}[${index}][dosya]`]?.name || null
        });
        index++;
      }
    });

    await uploadPDFToS3FromJSON(basvuru);
    res.status(201).json({ message: 'Başvuru AWS S3\'e PDF olarak kaydedildi.' });
  } catch (error) {
    console.error('Başvuru kaydetme hatası:', error);
    res.status(500).json({ error: 'Başvuru kaydedilemedi.' });
  }
});

// İlanlar listeleme
app.get('/api/ilanlar', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ilanlar ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('GET /api/ilanlar hata:', error);
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
    console.error('POST /api/ilanlar hata:', error);
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
    console.error('PUT /api/ilanlar hata:', error);
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
    console.error('DELETE /api/ilanlar hata:', error);
    res.status(500).json({ error: 'İlan silinemedi' });
  }
});

// Adayın başvurularını getir
app.get('/api/basvurular/:tc', async (req, res) => {
  const { tc } = req.params;

  try {
    const userResult = await pool.query('SELECT id FROM users WHERE tc = $1', [tc]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    const user_id = userResult.rows[0].id;

    const result = await pool.query('SELECT ilan_id FROM basvurular WHERE user_id = $1', [user_id]);

    res.json(result.rows);
  } catch (error) {
    console.error('GET /api/basvurular hata:', error);
    res.status(500).json({ error: 'Başvurular alınamadı' });
  }
});

// Başvuruları listele
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

// Başvuruya ait belgeleri getir
app.get('/api/belgeler/:basvuruId', async (req, res) => {
  const { basvuruId } = req.params;

  try {
    const result = await pool.query('SELECT * FROM belgeler WHERE basvuru_id = $1', [basvuruId]);
    res.json(result.rows);
  } catch (error) {
    console.error('GET /api/belgeler hata:', error);
    res.status(500).json({ error: 'Belgeler alınamadı' });
  }
});


app.post('/api/basvur', async (req, res) => {
  const { tc, ilan_id } = req.body;

  try {
    // Kullanıcının id'sini TC ile al
    const userResult = await pool.query('SELECT id FROM users WHERE tc = $1', [tc]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    const userId = userResult.rows[0].id;

    // Zaten başvurdu mu kontrol et
    const checkResult = await pool.query(
      'SELECT * FROM basvurular WHERE user_id = $1 AND ilan_id = $2',
      [userId, ilan_id]
    );
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: 'Zaten başvurdun' });
    }

    // Başvuru kaydını ekle
    await pool.query(
      'INSERT INTO basvurular (user_id, ilan_id, durum, basvuru_tarihi) VALUES ($1, $2, $3, NOW())',
      [userId, ilan_id, 'Başvuru Yapıldı']
    );

    res.status(201).json({ message: 'Başvuru başarılı' });
  } catch (err) {
    console.error('Başvuru hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Sunucu başlat
app.listen(5000, () => {
  console.log('Sunucu 5000 portunda çalışıyor 💻');
});