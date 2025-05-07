# Cita Nusa Resto

Sebuah aplikasi web fullstack untuk restoran "Cita Nusa Resto" dengan sistem reservasi meja. Proyek ini dibuat sebagai showcase pribadi menggunakan NextJS dengan Pages Router dan berbagai tech stack modern.

## 📋 Daftar Isi

- [Demo](#demo)
- [Fitur](#fitur)
- [Tech Stack](#tech-stack)
- [Instalasi](#instalasi)
- [Penggunaan](#penggunaan)
- [Struktur Proyek](#struktur-proyek)
- [API Endpoints](#api-endpoints)

## 🚀 Demo

(https://cita-nusa-resto.vercel.app)

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

## 💻 Tech Stack

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

4. Jalankan migrasi database:

   ```bash
   npx prisma migrate dev
   ```

5. Isi database dengan data dummy:
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

### Menu

- `GET /api/menus` - Dapatkan semua menu
- `POST /api/menus` - Tambah menu baru
- `GET /api/menus/[id]` - Dapatkan detail menu berdasarkan ID
- `PATCH /api/menus/[id]` - Update menu
- `DELETE /api/menus/[id]` - Hapus menu
- `GET /api/menus/categories` - Dapatkan semua kategori menu

### Reservasi

- `POST /api/bookings` - Buat reservasi baru
- `GET /api/bookings` - Dapatkan semua reservasi pengguna
- `GET /api/bookings/[id]` - Dapatkan detail reservasi
- `PATCH /api/bookings/[id]` - Update reservasi
- `DELETE /api/bookings/[id]` - Batalkan reservasi

### Pesanan

- `POST /api/orders` - Buat pesanan baru
- `GET /api/orders` - Dapatkan semua pesanan pengguna
- `GET /api/orders/[id]` - Dapatkan detail pesanan
- `PATCH /api/orders/[id]` - Update pesanan

### Meja

- `GET /api/tables` - Dapatkan semua data meja
- `POST /api/tables` - Buat meja baru
- `GET /api/tables/[id]` - Dapatkan detail meja
- `PATCH /api/tables/[id]` - Update status meja
- `DELETE /api/tables/[id]` - Hapus meja
- `GET /api/tables/available` - Dapatkan meja yang tersedia

### Admin

- `GET /api/admin/dashboard-stats` - Dapatkan data untuk statistik dashboard
- `GET /api/admin/users` - Dapatkan daftar pengguna
- `PATCH /api/admin/users/[id]` - Update role pengguna

### PROFILE

- `GET /api/profile` - Dapatkan data profil pengguna

### KONTAK

- `POST /api/contact` - Kirim pesan kontak

Dibuat dengan ❤️ oleh ahmadahsin.dev, Claude, dan ChatGPT.
