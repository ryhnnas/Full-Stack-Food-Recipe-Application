# Aplikasi Resep Makanan

<img width="1311" height="1352" alt="respmknn" src="https://github.com/user-attachments/assets/03cfc300-aa74-4702-bde3-9d749420546a" />

Aplikasi Resep Makanan adalah platform web interaktif yang memungkinkan pengguna menjelajahi berbagai resep lezat, melihat detail bahan dan langkah-langkah, serta mencari resep berdasarkan nama atau bahan. Aplikasi ini juga dilengkapi dengan fitur kategori yang memudahkan pengguna menemukan resep sesuai jenis hidangan (sarapan, makan siang, makan malam, dll.).

Proyek ini dibangun sebagai bagian dari portofolio pribadi saya, menampilkan kemampuan dalam pengembangan Full-Stack menggunakan teknologi modern.

---

## Fitur Utama

* **Jelajahi Resep:** Tampilan beranda yang menarik secara visual dengan kartu-kartu resep unggulan.
* **Detail Resep:** Lihat informasi lengkap setiap resep, termasuk deskripsi, daftar bahan, dan langkah-langkah persiapan yang jelas.
* **Pencarian Cerdas:** Cari resep dengan mudah berdasarkan nama resep atau bahan yang diinginkan.
* **Filter Kategori:** Saring resep berdasarkan kategori seperti Sarapan, Makan Siang, Makan Malam, Camilan, Dessert, dan Minuman.
* **Visual Menarik:** Dilengkapi dengan gambar-gambar resep berkualitas tinggi untuk pengalaman pengguna yang lebih baik.
* **Desain Responsif:** Tampilan aplikasi yang optimal di berbagai perangkat (desktop, tablet, mobile).


## Teknologi yang Digunakan

Proyek ini dikembangkan dengan arsitektur Full-Stack yang terbagi menjadi tiga bagian utama:

### Frontend
* **React.js:** Library JavaScript untuk membangun antarmuka pengguna yang dinamis.
* **Vite:** Tooling frontend generasi selanjutnya yang menyediakan pengalaman pengembangan cepat.
* **JavaScript (ES6+):** Bahasa pemrograman utama.
* **SWC:** Transpiler super cepat yang digunakan oleh Vite untuk kinerja yang lebih baik.
* **Axios:** Klien HTTP berbasis Promise untuk berinteraksi dengan API backend.
* **React Router DOM:** Untuk manajemen routing di dalam aplikasi Single Page Application (SPA).
* **CSS Kustom:** Styling dengan palet warna yang hangat dan elegan: `#E4E0E1`, `#D6C0B3`, `#AB886D`, dan `#493628`.

### Backend
* **Node.js:** Runtime JavaScript untuk membangun server API.
* **Express.js:** Framework web minimalis dan fleksibel untuk Node.js.
* **MySQL2:** Driver MySQL untuk koneksi database yang efisien.
* **CORS:** Middleware untuk mengelola Cross-Origin Resource Sharing.
* **Dotenv:** Untuk mengelola variabel lingkungan (environment variables) secara aman.

### Database
* **MySQL:** Sistem manajemen database relasional.
* **XAMPP:** Lingkungan pengembangan PHP dan MySQL yang mudah digunakan (untuk lokal).

## Cara Menjalankan Proyek (Lokal)

Ikuti langkah-langkah berikut untuk menjalankan aplikasi ini di lingkungan lokal Anda.

### Prasyarat

Pastikan Anda telah menginstal yang berikut:
* [Node.js](https://nodejs.org/en/) (versi 18.x atau lebih tinggi direkomendasikan)
* [XAMPP](https://www.apachefriends.org/index.html) (atau server MySQL lainnya)

### 1. Setup Database

1.  **Mulai XAMPP:** Buka XAMPP Control Panel dan mulai modul **Apache** dan **MySQL**.
2.  **Akses phpMyAdmin:** Buka browser dan pergi ke `http://localhost/phpmyadmin`.
3.  **Buat Database:** Buat database baru dengan nama `recipe_app_db` (atau nama lain yang Anda inginkan, pastikan sesuai dengan konfigurasi `.env` backend Anda).
4.  **Buat Tabel & Isi Data Dummy:**
    * Klik database yang baru Anda buat.
    * Pergi ke tab **SQL**.
    * Jalankan query SQL berikut untuk membuat tabel `categories` dan `recipes`, serta mengisi data dummy:

    ```sql
    -- Tabel categories
    CREATE TABLE categories (
        id INT(11) PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT
    );

    INSERT INTO categories (name) VALUES
    ('Sarapan'),
    ('Makan Siang'),
    ('Makan Malam'),
    ('Camilan'),
    ('Dessert'),
    ('Minuman');

    -- Tabel recipes
    CREATE TABLE recipes (
        id INT(11) PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        ingredients TEXT NOT NULL, -- Disimpan sebagai JSON string
        instructions TEXT NOT NULL, -- Disimpan sebagai JSON string
        image_url VARCHAR(255),
        category_id INT(11),
        prep_time VARCHAR(50),
        cook_time VARCHAR(50),
        servings VARCHAR(50),
        difficulty VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );

    -- Contoh data dummy untuk recipes (gunakan data dummy yang sudah Anda masukkan)
    -- Pastikan path gambar di `image_url` sesuai dengan lokasi di `frontend/public/images/`
    -- Contoh:
    -- INSERT INTO recipes (title, description, ingredients, instructions, image_url, category_id, prep_time, cook_time, servings, difficulty) VALUES
    -- ('Nasi Goreng Spesial', 'Nasi goreng klasik...', '[{"item": "Nasi", "quantity": "2 piring"}]', '[{"step": 1, "text": "Masak nasi."}]', '/images/nasi-goreng.jpg', 3, '15 menit', '10 menit', '2 porsi', 'Mudah');
    -- ... (tambahkan semua INSERT INTO recipes Anda di sini)
    ```
    * **Penting:** Pastikan Anda menyertakan semua query `INSERT INTO recipes` yang telah Anda siapkan sebelumnya di sini, agar orang lain bisa langsung mengisi data dummy.

### 2. Setup Backend

1.  **Navigasi ke Folder Backend:**
    ```bash
    cd backend
    ```
2.  **Instal Dependensi:**
    ```bash
    npm install
    ```
3.  **Konfigurasi Variabel Lingkungan:**
    * Buat file bernama `.env` di dalam folder `backend`.
    * Salin konten berikut ke dalam file `.env` dan sesuaikan jika perlu:
        ```env
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=
        DB_NAME=recipe_app_db
        DB_PORT=3306
        PORT=5000
        ```
4.  **Jalankan Server Backend:**
    ```bash
    npm run dev
    ```
    Server akan berjalan di `http://localhost:5000`.

### 3. Setup Frontend

1.  **Buka Terminal Baru** (jangan tutup terminal backend).
2.  **Navigasi ke Folder Frontend:**
    ```bash
    cd frontend
    ```
3.  **Instal Dependensi:**
    ```bash
    npm install
    ```
4.  **Siapkan Gambar Dummy:**
    * Pastikan Anda telah menempatkan gambar-gambar resep (misal `nasi-goreng.jpg`, `pancake-pisang.jpg`, dll.) dan `hero-bg.jpg` ke dalam folder `frontend/public/images/`.
    * Jika Anda menggunakan placeholder, tidak perlu mengunduh gambar fisik.
5.  **Jalankan Aplikasi Frontend:**
    ```bash
    npm run dev
    ```
    Aplikasi akan terbuka di browser Anda, biasanya di `http://localhost:5173`.
