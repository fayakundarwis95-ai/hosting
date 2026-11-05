# NEXORA TECH — SISTEM INFORMASI PENJUALAN ELEKTRONIK

**Aplikasi demo POS, inventaris, penjualan, dan pelaporan untuk Laptop, Smartphone, dan Tablet.**

Teknologi **100% HTML5 + CSS3 + Vanilla JavaScript (tanpa PHP, Laravel, React, Node, database server, atau framework CSS)**. Tampilan dibuka langsung dari `index.html`; data disimpan di **Firebase Realtime Database** (cloud, sinkron realtime antar perangkat). Browser modern dan koneksi internet diperlukan.

## 1. Cara menjalankan

### Cara paling mudah

1. Ekstrak folder proyek `nexora-tech-pos` dari ZIP.
2. Buka `index.html` memakai Chrome, Firefox, atau Edge.
3. Masukkan akun demo di bawah atau klik salah satu tombol **Login cepat**.
4. Semua operasi demo berjalan lokal di browser yang sama.

> Apabila browser membatasi penyimpanan saat halaman dijalankan melalui `file://`, gunakan **VS Code Live Server** (Open with Live Server) atau jalankan server statis misalnya `python -m http.server 5500` sebagai pilihan opsional. Tidak ada Python yang digunakan dalam kode aplikasi.

### Akun demo

| Hak akses | Email | Password |
|---|---|---|
| Super Admin | `admin@nexora.demo` | `Admin123!` |
| Manager | `manager@nexora.demo` | `Manager123!` |
| Kasir | `kasir@nexora.demo` | `Kasir123!` |
| Staf Gudang | `gudang@nexora.demo` | `Gudang123!` |

**PENTING:** Akun, password, role, dan data *hanya untuk demonstrasi*. Password disimpan tanpa enkripsi di browser dan pembatasan akses hanya di sisi klien. Jangan digunakan untuk data pribadi, transaksi nyata, atau produksi. Untuk keamanan sungguhan, implementasi harus menggunakan backend autentikasi, database server, otorisasi API, audit log tepercaya, dan validasi server.

## 1b. Setup Firebase Realtime Database

1. Buat proyek di [Firebase Console](https://console.firebase.google.com) → **Build → Realtime Database → Create database**.
2. **Project settings → Your apps → Web (`</>`)** → salin konfigurasi ke `assets/js/firebase-config.js` (pastikan `databaseURL` terisi).
3. Tab **Rules** → tempel isi `database.rules.json` → **Publish**.
4. Jalankan lewat server statis (`python -m http.server 5500` / Live Server) lalu buka `http://localhost:5500`. Saat pertama dibuka dan database kosong, data demo otomatis di-*seed* ke `/nexora_retail`.

**PERINGATAN:** `database.rules.json` bawaan terbuka (tanpa autentikasi) agar demo berjalan. Siapa pun yang tahu URL database dapat membaca/menulis, termasuk data pengguna. Jangan dipakai untuk data nyata. Langkah berikutnya: Firebase Authentication + aturan berbasis role.

## 2. Fitur

| Modul | Fungsi |
|---|---|
| Login | Login/logout dengan akun demo dan sesi lokal |
| Dashboard | Omzet bulanan, jumlah transaksi, jumlah SKU, stok menipis, grafik pendapatan, distribusi kategori, aktivitas |
| Produk & Stok | Create, Read, Update, Delete/nonaktif; pencarian, kategori, pagination, CSV, harga modal/jual, minimum stok |
| Kasir / POS | Keranjang belanja, jumlah unit, pilih pelanggan, diskon nominal, pajak, tunai/QRIS/debit/transfer, kembalian |
| Penjualan | Simpan transaksi dan item dengan snapshot harga, pengurangan stok, invoice, cetak/simpan sebagai PDF, pembatalan oleh Admin/Manager, pengembalian stok |
| Pelanggan | CRUD identitas dan kontak |
| Supplier | CRUD pemasok dan kontak |
| Pembelian & Restock | Barang masuk supplier, harga modal, otomatis menambah stok, riwayat pembelian |
| Laporan | Filter tanggal dan kategori, ringkasan omzet, estimasi laba kotor, grafik, export CSV, cetak PDF via browser |
| Pengguna | CRUD user demo, status aktif, role |
| Pengaturan | Profil toko, pajak, prefix invoice, pesan invoice, backup/restore JSON & reset demo untuk Admin |
| Etalase | Katalog gadget publik bisa diakses tanpa login (tanpa checkout publik) |

## 3. Aturan bisnis yang diterapkan

1. SKU produk unik dan nama produk wajib diisi.
2. Harga, jumlah stok, dan batas stok tidak boleh negatif; kuantitas stok berupa bilangan bulat.
3. Kasir tidak bisa menjual lebih banyak daripada persediaan di keranjang/produk.
4. Stok barang dikurangi setelah pembayaran berhasil.
5. Pembayaran tunai harus cukup; pembayaran non-tunai harus persis sesuai nominal total.
6. Total transaksi = subtotal − diskon + pajak, dengan pajak dihitung atas nominal setelah diskon.
7. Pembatalan transaksi tetap mencatat riwayat dan mengembalikan stok; tidak menghapus transaksi.
8. Harga dan modal yang digunakan di setiap penjualan disimpan dalam item transaksi (*snapshot*), supaya perubahan harga master tidak mengubah transaksi lama.
9. Produk yang sudah muncul pada riwayat transaksi dinonaktifkan, bukan dihapus permanen.
10. Data pelanggan, pemasok, atau akun dengan referensi transaksi terkait tidak dapat dihapus secara langsung.
11. Pembelian barang mencatat kuantitas dan harga modal serta menaikkan persediaan.
12. Filter kategori laporan menggunakan alokasi proporsional diskon dan pajak untuk invoice yang memuat beberapa kategori.

**Batasan penting:** Aturan bisnis ini berlaku untuk satu browser/perangkat yang menggunakan satu `localStorage`. Tidak ada transaksi database, penguncian stok antarperangkat, autentikasi/otorisasi server, pembatasan percobaan login, atau sinkronisasi pengguna. Tidak aman untuk operasional toko nyata. Retur barang, cicilan, cicilan kredit, garansi serial/IMEI, pengiriman, dan integrasi payment gateway belum diimplementasikan.

## 4. Struktur folder

```text
nexora-tech-pos/
├── index.html                  # Entry point satu halaman
├── assets/
│   ├── css/
│   │   └── style.css           # Layout dan komponen responsif
│   └── js/
│       ├── data.js             # Data awal 16 produk, user, supplier, transaksi demo
│       └── app.js              # Router ringan, view, state, CRUD, transaksi, laporan
├── docs/
│   ├── DESAIN_SISTEM.md        # Diagram alur, ERD konseptual, use case, role
│   ├── preview-login.png
│   ├── preview-dashboard.png
│   └── preview-mobile-clean.png
└── README.md
```

## 5. Penyimpanan & export

- Firebase RTDB `/nexora_retail/{settings, products, customers, suppliers, users, sales, purchases, activities}` (tiap koleksi berupa objek berkunci `id`). Perubahan stok dikirim sebagai `increment` atomik.
- `sessionStorage['nexora_retail_session_v1']`: ID akun yang login di tab/sesi browser.
- CSV melalui menu **Produk & Stok** / **Riwayat Penjualan** / **Laporan**. Berkas menggunakan UTF-8 BOM untuk Excel dan melakukan *basic spreadsheet formula sanitization*.
- Cetak invoice/laporan memakai dialog **Print** browser; pilih **Save as PDF** bila tersedia.
- **Backup JSON**, **Restore JSON**, dan **Reset Data Demo** khusus Admin. Format JSON adalah data demo, bukan backup yang terenkripsi.
- Data berada di cloud sehingga tidak hilang saat storage browser dibersihkan; backup JSON tetap berguna.

## 6. Data contoh

- **16 produk:** 6 laptop, 6 smartphone, 4 tablet.
- **5 pelanggan** dengan identitas simulasi.
- **3 supplier** simulasi.
- **4 akun staf** dengan role berbeda.
- **9 penjualan historis** simulasi untuk grafik dashboard.
- Semua nama, harga, persediaan, dan data transaksi merupakan ilustrasi yang dapat diubah.

## 7. Cara uji manual

1. Login sebagai Admin → periksa kartu dashboard.
2. Buka Produk & Stok → tambah produk baru dengan SKU unik, kemudian edit harga.
3. Buka Kasir → cari produk tadi → tambah ke keranjang, tentukan uang dibayar ≥ total → klik Proses Pembayaran.
4. Periksa invoice dan coba Print/Save as PDF.
5. Periksa stok produk berkurang dan penjualan masuk ke Riwayat Penjualan.
6. Batalkan penjualan melalui Admin/Manager → pastikan status Dibatalkan dan stok kembali.
7. Buka Pembelian Stok → restock produk → pastikan kuantitas bertambah.
8. Buka Laporan → ganti tanggal/kategori → ekspor CSV.
9. Logout lalu login Kasir → pastikan manajemen pengguna, produk, pembelian, laporan, pengaturan tidak muncul pada sidebar.
10. Buka Etalase tanpa login dan cari smartphone.
11. Untuk membuang perubahan uji, gunakan Pengaturan → Reset Seluruh Data (Admin).

## 8. Pengembangan lanjutan

Untuk versi produksi dan multi-perangkat, arahkan pengembangan ke backend API (misalnya Laravel/Express), DBMS (PostgreSQL/MySQL), autentikasi modern yang aman, migrasi data, pengujian terintegrasi, otorisasi server, penyimpanan stok transaksional, perlindungan konsistensi inventaris, log audit yang tidak dapat dimodifikasi pengguna, serta pengamanan data pelanggan.

## 9. Dokumentasi diagram

Lihat [`docs/DESAIN_SISTEM.md`](docs/DESAIN_SISTEM.md) untuk model data, diagram alur, use case, dan pembagian hak akses.

© 2026 Nexora Tech — prototype untuk belajar dan presentasi.
