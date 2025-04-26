
const express = require('express');
const router = express.Router();
const pool = require('../db'); 

// Kriter Ekle (POST /kadro-kriterleri)
router.post('/', async (req, res) => {
  const { kadro_turu, kriter_adi, aciklama } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO kadro_kriterleri (kadro_turu, kriter_adi, aciklama) VALUES ($1, $2, $3) RETURNING *',
      [kadro_turu, kriter_adi, aciklama]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Kriter eklerken hata:', error);
    res.status(500).json({ error: 'Kriter eklenemedi.' });
  }
});

// Kadroya Göre Kriterleri Listele (GET /kadro-kriterleri/:kadroTuru)
/*router.get('/:kadroTuru', async (req, res) => {
  const { kadroTuru } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM kadro_kriterleri WHERE kadro_turu = $1',
      [kadroTuru]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Kriterler getirilirken hata:', error);
    res.status(500).json({ error: 'Kriterler alınamadı.' });
  }
}); */

// Tüm kriterleri getir (kadro türüne bakmadan)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM kadro_kriterleri ORDER BY kadro_turu ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Kriterler çekilemedi:', error);
    res.status(500).json({ error: 'Kriterler alınamadı' });
  }
});


// Kriter Sil (DELETE /kadro-kriterleri/:id)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      await pool.query('DELETE FROM kadro_kriterleri WHERE id = $1', [id]);
      res.json({ message: 'Kriter başarıyla silindi' });
    } catch (error) {
      console.error('Kriter silme hatası:', error);
      res.status(500).json({ error: 'Kriter silinemedi' });
    }
  });
  

module.exports = router;
