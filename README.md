# Cita Nusa Resto

Sebuah aplikasi web fullstack untuk rumah makan "Cita Nusa Resto" dengan sistem pemesanan meja. Proyek ini dibuat sebagai showcase pribadi menggunakan NextJS dengan Pages Router dan berbagai teknologi modern.

## 📋 Daftar Isi

- [Demo](#demo)
- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Instalasi](#instalasi)
- [Penggunaan](#penggunaan)
- [Struktur Proyek](#struktur-proyek)
- [API Endpoints](#api-endpoints)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

## 🚀 Demo

[Link Demo akan ditambahkan setelah deployment]

## ✨ Fitur

- 🍽️ **Katalog Menu**: Tampilan menu makanan dan minuman yang menarik
- 📅 **Sistem Pemesanan**: Reservasi meja dengan pilihan tanggal, waktu, dan jumlah tamu
- 👤 **Manajemen Akun**: Registrasi, login, dan pengelolaan profil pengguna
- 📧 **Notifikasi Email**: Konfirmasi pemesanan melalui email
- 📱 **Responsif**: Tampilan yang optimal di berbagai perangkat
- 🔐 **Admin Dashboard**: 
  - Manajemen pengguna
  - Manajemen menu
  - Manajemen reservasi
  - Manajemen pesanan
  - Manajemen meja
  - Visualisasi data menggunakan Recharts untuk melihat insight harian reservasi dan pesanan

## 💻 Teknologi

### Frontend
- **Next.js** (Pages Router) - Framework React untuk rendering sisi server dan client
- **TailwindCSS** - Framework CSS untuk desain yang cepat dan responsif
- **React Hook Form & Zod** - Validasi dan pengelolaan formulir
- **TanStack Query** - Manajemen state dan fetching data
- **Zustand** - Manajemen state global
- **React DatePicker** - Komponen pemilihan tanggal
- **date-fns** - Utilitas manipulasi tanggal dan waktu
- **Framer Motion** - Library untuk animasi UI
- **Recharts** - Library untuk visualisasi data di dashboard admin

### Backend
- **Next.js API Routes** - Endpoint API REST
- **Prisma** - ORM untuk interaksi database
- **PostgreSQL** - Database relasional
- **JSON Web Token** - Otentikasi pengguna
- **Resend** - Layanan pengiriman email

## 🔧 Instalasi

### Prasyarat
- Node.js (versi 18.x atau lebih tinggi)
- NPM atau Yarn
- PostgreSQL

### Langkah-langkah
1. Clone repositori:
   ```bash
   git clone https://github.com/username/cita-nusa-resto.git
   cd cita-nusa-resto
   ```

2. Install dependensi:
   ```bash
   npm install
   # atau
   yarn install
   ```

3. Buat file .env dan konfigurasikan variabel lingkungan:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/citanusadb"
   JWT_SECRET="your-secret-key"
   RESEND_API_KEY="your-resend-api-key"
   EMAIL_FROM="noreply@citanusaresto.com"
   EMAIL_DEV="youremail@example.com"
   NODE_ENV="development"
   ```

5. Jalankan migrasi database:
   ```bash
   npx prisma migrate dev
   ```

6. Isi database dengan data dummy:
   ```bash
   npm run seed
   ```

## 🚀 Penggunaan

### Mode Development
```bash
npm run dev
# atau
yarn dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat aplikasi.

### Build untuk Production
```bash
npm run build
npm start
# atau
yarn build
yarn start
```

## 📁 Struktur Proyek

```
cita-nusa-resto/
├── .next/              # Build output dari Next.js
├── node_modules/       # Dependensi
├── prisma/             # Schema Prisma dan migrations
│   └── seed.ts         # Script pengisian data dummy
├── public/             # File statis
├── src/                # Source code
│   ├── components/     # Komponen React yang dapat digunakan kembali
│   ├── constants/      # Konstanta aplikasi
│   ├── emails/         # Template email
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilitas dan helper functions
│   ├── pages/          # Halaman dan API routes (Next.js Pages Router)
│   │   ├── api/        # Backend API endpoints
│   │   └── ...         # Frontend pages
│   ├── service/        # Service layer
│   │   └── emailService.tsx # Service untuk pengiriman email
│   ├── store/          # State management (Zustand)
│   ├── styles/         # File CSS global dan utilitas
│   ├── types/          # Type definitions TypeScript
│   └── utils/          # Fungsi utilitas
├── .env                # Environment variables
├── .gitignore
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json
└── vercel.json
```

## 📡 API Endpoints

### Autentikasi
- `POST /api/auth/register` - Registrasi pengguna baru
- `POST /api/auth/login` - Login pengguna
- `GET /api/auth/me` - Dapatkan info pengguna yang sedang login

### Menu
- `GET /api/menu` - Dapatkan semua menu
- `GET /api/menu/[id]` - Dapatkan detail menu berdasarkan ID

### Booking
- `POST /api/booking` - Buat reservasi baru
- `GET /api/booking` - Dapatkan semua reservasi pengguna
- `GET /api/booking/[id]` - Dapatkan detail reservasi
- `PUT /api/booking/[id]` - Update reservasi
- `DELETE /api/booking/[id]` - Batalkan reservasi

### Admin
- `GET /api/admin/users` - Dapatkan daftar pengguna
- `GET /api/admin/menu` - Dapatkan semua menu
- `POST /api/admin/menu` - Tambah menu baru
- `PUT /api/admin/menu/[id]` - Update menu
- `DELETE /api/admin/menu/[id]` - Hapus menu
- `GET /api/admin/reservations` - Dapatkan semua reservasi
- `GET /api/admin/orders` - Dapatkan semua pesanan
- `GET /api/admin/tables` - Dapatkan semua data meja
- `GET /api/admin/dashboard` - Dapatkan data untuk statistik dashboard



## 📝 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat `LICENSE` untuk informasi lebih lanjut.

---

Dibuat dengan ❤️ oleh [Nama Anda]
