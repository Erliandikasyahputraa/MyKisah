# 🖤 MyKisah  
*Platform Brutalist untuk Berbagi Kisah*

**MyKisah** adalah aplikasi web berbasis JavaScript yang memungkinkan pengguna untuk membagikan pengalaman atau laporan kejadian secara digital. Dibangun dengan arsitektur modular dan desain Neo-Brutalism yang tegas.

---

## 🚀 Fitur Utama

- 🔐 **Autentikasi Pengguna** — Login dan Register dengan validasi langsung
- 📝 **Formulir Brutalist** — Teks polos, upload gambar, lokasi manual
- 🖼️ **Preview Gambar** — Kotak tebal, tombol hapus di pojok
- 🔄 **Routing Dinamis** — Navigasi antar halaman tanpa reload (Hash-based)
- ⚙️ **Build Modular** — Webpack untuk development & production
- 📦 **Struktur Scalable** — Folder tertata untuk ekspansi fitur
- 📱 **Desain Responsif** — Mobile & desktop-ready
- 🎨 **Neo-Brutalism Style** — Shadow kasar, font monospace, tanpa border radius

---

## 📁 Struktur Proyek

```plaintext
├── src/
│   ├── index.html              # Halaman utama aplikasi
│   ├── public/                 # Aset statis (gambar, ikon, favicon)
│   └── scripts/
│       ├── pages/              # Halaman: login, register, home, new story
│       ├── routes/             # Sistem routing berbasis hash
│       ├── data/               # Konfigurasi API atau data lokal
│       ├── utils/              # Helper: auth, kamera, map, dsb
│       └── templates/          # Template HTML modular
├── package.json                # Metadata & dependensi proyek
├── webpack.common.js          # Konfigurasi Webpack umum
├── webpack.dev.js             # Webpack mode development
├── webpack.prod.js            # Webpack untuk production build
└── README.md                  # Dokumentasi proyek
```
---
🛠️ Instalasi & Penggunaan
1. Instalasi Proyek
bash
Copy
Edit
git clone[ https://github.com/username/mykisah.git](https://github.com/Erliandikasyahputraa/MyKisah.git)
cd mykisah
npm install

3. Mode Development
bash
Copy
Edit
npm run dev
Buka: http://localhost:8080

4. Build Produksi
bash
Copy
Edit
npm run build
Hasil build: ./dist/

---
🎨 Neo-Brutalism Design Rules
Properti	Aturan
Border	4px solid black
Shadow	6px 6px 0 #000
Font	Courier New, monospace
Radius	0px (sudut tajam)
Warna	#0b0c10, #1a1b26, merah darah, biru gelap
💡 Jangan gunakan UI halus, pastel, atau animasi lembut. MyKisah bukan tempat untuk itu.

---
🧭 Rencana Pengembangan (Roadmap)
 Sistem komentar (tanpa moderasi)

 Integrasi dengan database nyata (misalnya Firebase atau Supabase)

 Fitur bookmark cerita

 Mode offline (dengan localStorage)

---

👤 Kontak
Erliandika Syahputra
📧 syahputraerliandika@gmail.com
