# PERANCANGAN SISTEM — NEXORA TECH RETAIL OS

Dokumen ini menjelaskan arsitektur prototipe (HTML + CSS + JS) dan **ERD konseptual**, bukan tabel SQL yang benar-benar terpasang. Seluruh data saat ini berada pada satu dokumen JSON di `localStorage`.

## 1. Arsitektur browser

```mermaid
flowchart TB
 U[Admin / Manager / Kasir / Gudang] --> UI[HTML + CSS / Komponen UI]
 UI --> JS[JavaScript Vanilla / Business Logic]
 JS --> LS[(localStorage JSON)]
 JS --> SS[(sessionStorage)]
 JS --> Print[Print browser / Save as PDF]
 JS --> CSV[Export CSV / JSON]
```

## 2. Use Case

```mermaid
flowchart LR
  A([Admin]) --> D[Dashboard]
  A --> P[CRUD Produk / Stok]
  A --> T[Transaksi POS]
  A --> U[Kelola Pengguna]
  A --> R[Laporan]
  A --> B[Backup / Restore]
  M([Manager]) --> P
  M --> T
  M --> R
  K([Kasir]) --> T
  K --> C[CRUD Pelanggan]
  G([Staf Gudang]) --> P
  G --> S[CRUD Supplier]
  G --> PO[Pembelian / Barang Masuk]
```

## 3. ERD konseptual

```mermaid
erDiagram
  USERS ||--o{ SALES : memproses
  CUSTOMERS ||--o{ SALES : melakukan
  SALES ||--|{ SALE_ITEMS : mencakup
  PRODUCTS ||--o{ SALE_ITEMS : dijual
  SUPPLIERS ||--o{ PRODUCTS : memasok
  SUPPLIERS ||--o{ PURCHASES : menerima_pesanan
  PRODUCTS ||--o{ PURCHASES : direstock
  USERS ||--o{ PURCHASES : mencatat

  USERS { string id PK string name string email string password string role boolean active }
  CUSTOMERS { string id PK string name string phone string email string address }
  SUPPLIERS { string id PK string name string phone string email string address }
  PRODUCTS { string id PK string sku UK string name string brand string category number cost number price integer stock integer minStock string supplierId FK boolean active }
  SALES { string id PK string number UK datetime date string customerId FK number subtotal number discount number tax number grandTotal string paymentMethod number paid number change string status string cashierId FK }
  SALE_ITEMS { string productId FK string sku string name string category integer qty number price number cost }
  PURCHASES { string id PK string number UK datetime date string supplierId FK string productId FK string productName integer qty number cost number total string actorId FK }
```

Catatan: `SALE_ITEMS` benar-benar disimpan sebagai array `items[]` di tiap `sales` object, bukan tabel terpisah. PK/FK di sini adalah relasi logis; tidak ada `FOREIGN KEY` SQL di browser.

## 4. Activity diagram penjualan

```mermaid
flowchart TD
  A([Login kasir]) --> B[Buka menu Kasir / POS]
  B --> C[Cari produk dan masukkan keranjang]
  C --> D{Stok mencukupi?}
  D -- Tidak --> C
  D -- Ya --> E[Pilih pelanggan, diskon, pembayaran]
  E --> F{Pembayaran cukup / sesuai metode?}
  F -- Tidak --> E
  F -- Ya --> G[Hitung subtotal, pajak, total]
  G --> H[Kurangi persediaan di data lokal]
  H --> I[Simpan penjualan dan item snapshot]
  I --> J[Tampilkan invoice dan cetak opsional]
  J --> K([Selesai])
```

## 5. Sequence diagram penjualan

```mermaid
sequenceDiagram
  actor Kasir
  participant UI as UI Browser
  participant Logic as app.js
  participant Store as localStorage
  Kasir->>UI: Pilih produk / isi pembayaran
  UI->>Logic: checkout()
  Logic->>Logic: Validasi stok, harga, nominal bayar
  alt Valid
    Logic->>Logic: Kurangi stok & buat invoice
    Logic->>Store: Simpan JSON data baru
    Logic-->>UI: Tampilkan invoice
  else Tidak valid
    Logic-->>UI: Tampilkan error
  end
```

## 6. Hak akses di UI (simulasi)

| Menu | Admin | Manager | Kasir | Gudang |
|---|:---:|:---:|:---:|:---:|
| Dashboard | ✓ | ✓ | ✓ | ✓ |
| Produk & Stok | ✓ | ✓ | — | ✓ |
| Kasir / POS | ✓ | ✓ | ✓ | — |
| Riwayat Penjualan | ✓ | ✓ | ✓ | — |
| Batalkan Penjualan | ✓ | ✓ | — | — |
| Pelanggan | ✓ | ✓ | ✓ | — |
| Supplier | ✓ | ✓ | — | ✓ |
| Pembelian & Restock | ✓ | ✓ | — | ✓ |
| Laporan | ✓ | ✓ | — | — |
| Kelola Pengguna | ✓ | — | — | — |
| Pengaturan Profil Toko | ✓ | ✓ | — | — |
| Backup/Restore/Reset | ✓ | — | — | — |
| Etalase Produk | ✓ | ✓ | ✓ | ✓ |

**PERINGATAN KEAMANAN:** Role di atas adalah pemeriksaan tampilan & aksi dalam JS; tidak bisa menjadi akses kontrol tepercaya tanpa server.

## 7. Aturan laporan kategori

Invoice bisa memuat beberapa kategori. Saat memilih satu kategori di laporan, nilai invoice diproyeksikan sebagai berikut:

- `subtotal_kategori = Σ(qty × harga_jual)` untuk item kategori tersebut.
- `rasio_kategori = subtotal_kategori / subtotal_semua_kategori`.
- `diskon_kategori = pembulatan(diskon_invoice × rasio_kategori)`.
- `pajak_kategori = pembulatan(pajak_invoice × rasio_kategori)`.
- `kontribusi_omzet_kategori = subtotal_kategori - diskon_kategori + pajak_kategori`.

Nilai proyeksi merupakan estimasi kontribusi per kategori; jumlah setelah pembulatan bisa berselisih beberapa rupiah dari nilai invoice utuh.
