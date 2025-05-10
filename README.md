# MyKisah

**MyKisah** adalah aplikasi web berbasis JavaScript yang memungkinkan pengguna untuk membagikan pengalaman atau laporan kejadian secara digital. Dibangun dengan struktur modular dan arsitektur front-end modern, aplikasi ini dirancang untuk mempermudah pengguna dalam membuat, melihat, dan mengelola kisah-kisah mereka secara online.

---

## 🚀 Fitur Utama

- 🔐 Autentikasi pengguna (Login & Register)
- 📝 Formulir untuk menulis dan membagikan kisah
- 🏠 Halaman utama yang menampilkan kisah terbaru
- 🔄 Routing dinamis berbasis hash tanpa reload halaman
- ⚙️ Konfigurasi build modular menggunakan Webpack
- 📦 Struktur proyek yang terorganisir dan scalable
- 📱 Desain responsif untuk desktop dan mobile

---

## 📁 Struktur Proyek

```plaintext
├── src/
│   ├── index.html              # Halaman utama aplikasi
│   ├── public/                 # Aset statis (ikon, gambar, dsb)
│   └── scripts/
│       ├── pages/              # Halaman: login, register, home, dll.
│       ├── routes/             # Sistem routing aplikasi
│       ├── data/               # Konfigurasi API atau data lokal
│       └── utils/              # Utility dan helper (auth, config, dll)
├── package.json                # Metadata & dependensi proyek
├── webpack.common.js          # Konfigurasi umum Webpack
├── webpack.dev.js             # Konfigurasi untuk development
├── webpack.prod.js            # Konfigurasi untuk production
└── README.md                  # Dokumentasi proyek
