# Akademik Portal Projesi

Akademik Portal, adayların akademik kadrolara başvuru yapabildiği, yöneticilerin ilan yayınlayabildiği ve başvuruları görüntüleyebildiği bir web uygulamasıdır. React, Node.js, PostgreSQL ve AWS teknolojileriyle geliştirilmiştir.

## Özellikler

- Aday kayıt ve giriş sistemi
- İlan listeleme, oluşturma, düzenleme ve silme (Yönetici paneli)
- Gelişmiş başvuru formu (metin ve dosya alanları)
- Başvuruların AWS S3'e PDF olarak yüklenmesi
- Karanlık mod (dark mode) desteği
- Yöneticiler için başvuru listesi görüntüleme

## Kullanılan Teknolojiler

- Frontend: React.js, React Router, Toastify
- Backend: Node.js, Express.js
- Veritabanı: PostgreSQL
- Dosya Saklama: AWS S3
- PDF Oluşturma: pdfkit, stream-buffers

## Kurulum

### Backend

1. Backend dizinine gidin:
   ```bash
   cd akademik-portal-backend
   npm install

2. .env dosyası oluşturun ve aşağıdaki değişkenleri tanımlayın:
   - AWS_ACCESS_KEY_ID=your_aws_key
   - AWS_SECRET_ACCESS_KEY=your_aws_secret
   - AWS_REGION=eu-central-1
   - AWS_BUCKET_NAME=akademik-basvurular

3. Gerekli ek bağımlılıkları kurun

4. Backend sunucusunu başlatın:
   node index.js

5. Frontend dizinine gidip Frontend'i başlatın:
   ```bash
   cd akademik-portal-frontend
   npm install
   npm start

Uygulama http://localhost:3000 adresinde çalışacaktır.


Veritabanı Yapısı
-  PostgreSQL üzerinde aşağıdaki tablolar oluşturulmalıdır:

-  users (id, tc, name, email, password, role, created_at)

-  ilanlar (id, baslik, aciklama, kadro_turu, baslangic_tarihi, bitis_tarihi, created_at)

-  basvurular (id, user_id, ilan_id, durum, basvuru_tarihi)

-  Ek olarak UUID'ler için gen_random_uuid() fonksiyonu kullanılmaktadır. Eğer aktif değilse pgcrypto eklentisi etkinleştirilmelidir.

