Berikut adalah dokumen **Product Requirement Document (PRD)** dan **Execution Plan** untuk membangun sistem validasi lisensi berbasis Next.js App Router, TiDB Serverless, dan Vercel.

---

# Product Requirement Document (PRD)

## 1. Overview & Objective

Membangun sistem *license manager* ringan untuk memvalidasi lisensi aplikasi melalui API, lengkap dengan dashboard admin terproteksi untuk mengelola CRUD (*Create, Read, Update, Delete*) status lisensi.

---

## 2. Core Features & Specifications

### A. Public API (`POST /api/validate`)

* **Request Body:** JSON `{ "license_id": "string" }`
* **Response Status 200 (Valid):**
```json
{
  "valid": true,
  "license_id": "ss",
  "message": "License is valid."
}

```


* **Response Status 400/404 (Invalid / Status OFF / Missing Payload):**
```json
{
  "valid": false,
  "license_id": "ss",
  "message": "License is invalid or inactive."
}

```



### B. Admin Dashboard & Auth

* **Authentication:** Login/Logout aman menggunakan HttpOnly Cookie + JWT (`jose`).
* **Protection:** Route `/admin/dashboard/*` dilindungi via Next.js Middleware.
* **License Management (CRUD):**
* **List:** Menampilkan seluruh lisensi beserta statusnya (`on`/`off`).
* **Create:** Generate `license_id` baru otomatis (random string 15 karakter) dengan auto status `on`.
* **Update:** Toggle status lisensi (`on` $\leftrightarrow$ `off`).
* **Delete:** Hapus data lisensi dari database.



---

## 3. Tech Stack Architecture

| Layer | Technology | Reason |
| --- | --- | --- |
| **Framework** | Next.js (App Router) | Fullstack, native Server Actions, gampang di-deploy ke Vercel |
| **Database** | TiDB Serverless | MySQL-compatible, gratis di cloud, support HTTPS driver |
| **DB Client** | `@tidbcloud/serverless` | Driver berbasis HTTP/Fetch (bebas isu connection pool/timeout di Edge/Serverless) |
| **Auth** | Stateful/Stateless JWT (`jose`) | Ringan, tanpa butuh library heavy, kompatibel dengan Edge Runtime |
| **Styling** | Tailwind CSS (Apple Design) | Mengikuti panduan styling pada file `apple-DESIGN.md` (single Action Blue, full-bleed tiles, SF typography) |

---

## 4. Database Schema (MySQL / TiDB)

```sql
CREATE TABLE licenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  license_id VARCHAR(255) NOT NULL UNIQUE,
  status ENUM('on', 'off') DEFAULT 'on',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

```

---

# Execution & Development Plan

```
[Phase 1: Setup] ──> [Phase 2: Database] ──> [Phase 3: Core API] ──> [Phase 4: Admin & Auth] ──> [Phase 5: Deploy]

```

### Phase 1: Environment & Project Setup

1. Inisialisasi project Next.js App Router + Tailwind CSS.
2. Install dependency utama: `@tidbcloud/serverless` dan `jose`.
3. Konfigurasi variabel lingkungan di `.env.local`:
* `DATABASE_URL` (dari TiDB Serverless Console)
* `ADMIN_USERNAME`
* `ADMIN_PASSWORD`
* `JWT_SECRET`



### Phase 2: Database Layer

1. Eksekusi skema tabel `licenses` di TiDB Cloud Console.
2. Buat konektor database singleton di `lib/db.ts` menggunakan HTTP-based driver `@tidbcloud/serverless`.

### Phase 3: Public API Development

1. Buat route handler `app/api/validate/route.ts`.
2. Implementasikan validasi payload input (`license_id`).
3. Tambahkan query check ke database: kembalikan `{ valid: true }` **hanya jika** data ditemukan DAN `status === 'on'`.

### Phase 4: Auth & Dashboard Management (CRUD)

1. **Auth Engine (`lib/auth.ts` & `middleware.ts`):**
* Buat helper pencetak token JWT dan pemasang HttpOnly cookie.
* Buat middleware untuk me-redirect user anonim dari `/admin/dashboard`.


2. **Login Page (`app/admin/login/page.tsx`):**
* Form login menggunakan Next.js Server Action.
* Terapkan styling minimalist sesuai panduan `apple-DESIGN.md`.


3. **Dashboard & Actions (`app/admin/dashboard/page.tsx`):**
* Server Actions untuk `addLicense` (dengan auto-generate 15 random char untuk `license_id`), `toggleStatus`, dan `deleteLicense`.
* Integrasi revalidation path (`revalidatePath`) agar data di UI te-refresh instan setelah mutasi.
* Styling dashboard menggunakan guideline dari `apple-DESIGN.md` (misal komponen `store-utility-card`).



### Phase 5: Deployment Vercel

1. Push repository ke GitHub.
2. Import project ke Vercel Dashboard.
3. Masukkan `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, dan `JWT_SECRET` ke *Environment Variables* Vercel.
4. Deploy dan jalankan *smoke test* pada API endpoint serta dashboard admin.

---

Jika alur perencanaan dan PRD di atas sudah sesuai dengan ketersediaan infrastrukturmu, beri tahu aku untuk lanjut langsung ke penulisan seluruh source code-nya!