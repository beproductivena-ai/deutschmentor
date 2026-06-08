# DeutschMentor AI 🇩🇪

Mentor AI pribadi untuk belajar Bahasa Jerman dan mendapatkan pekerjaan di Jerman.

## Fitur
- 🇩🇪 Belajar Bahasa Jerman A1–C1 dengan AI
- 💼 Analisis karier & lowongan kerja di Jerman
- 📄 Panduan dokumen (CV, Cover Letter format Jerman)
- ✈️ Info relokasi (visa, biaya hidup, asuransi)
- 🎯 Analisis profil personal

---

## Deploy ke Vercel (5 menit)

### 1. Dapatkan API Key Anthropic
- Buka [console.anthropic.com](https://console.anthropic.com)
- Daftar / login
- Klik **API Keys** → **Create Key**
- Copy key (bentuk: `sk-ant-...`)

### 2. Push ke GitHub
```bash
git init
git add .
git commit -m "DeutschMentor AI"
git remote add origin https://github.com/USERNAME/deutschmentor.git
git push -u origin main
```

### 3. Deploy ke Vercel
- Buka [vercel.com](https://vercel.com) → **New Project**
- Import repo GitHub kamu
- Di bagian **Environment Variables**, tambahkan:
  ```
  ANTHROPIC_API_KEY = sk-ant-xxxxxxxxxxxxx
  ```
- Klik **Deploy** ✅

### 4. Selesai!
Vercel akan otomatis build dan deploy. Kamu dapat URL seperti:
`https://deutschmentor-username.vercel.app`

---

## Jalankan Lokal

```bash
npm install

# Buat file .env.local
cp .env.local.example .env.local
# Edit .env.local, isi ANTHROPIC_API_KEY

npm run dev
# Buka http://localhost:3000
```

---

## Teknologi
- **Next.js 14** (App Router)
- **Anthropic SDK** (claude-sonnet-4)
- **Streaming responses** untuk pengalaman chat real-time
- API key **aman di server** — tidak pernah ke browser
