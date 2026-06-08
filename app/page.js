'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';

const ROADMAP = [
  {
    level: 'A1', cls: 'a1', name: 'Pemula Absolut', time: '2–3 bulan (4–6 jam/minggu)',
    target: 'Memperkenalkan diri, bertanya hal sederhana, memahami kalimat dasar.',
    materi: ['Alfabet & pengucapan', 'Salam & perkenalan', 'Angka, warna, hari, bulan', 'Kata benda dasar + artikel (der/die/das)', 'Kalimat sederhana: Subjek + Verba', 'Pertanyaan dasar: Wie? Wo? Was?'],
    latihan: ['Duolingo / Babbel harian 15 menit', 'Flashcard 10 kata baru per hari', 'Praktik monolog perkenalan diri', 'Tonton Nicos Weg di YouTube (DW)'],
    sertifikat: ['Goethe-Zertifikat A1', 'telc Deutsch A1', 'ÖSD Zertifikat A1'],
  },
  {
    level: 'A2', cls: 'a2', name: 'Dasar', time: '3–4 bulan (4–6 jam/minggu)',
    target: 'Berkomunikasi tentang hal familiar: keluarga, belanja, pekerjaan sederhana.',
    materi: ['Kasus Nominativ, Akkusativ, Dativ', 'Kata kerja tidak beraturan umum', 'Preposisi dasar', 'Topik sehari-hari: makanan, transportasi, cuaca', 'Kalimat majemuk sederhana'],
    latihan: ['DW Langsam gesprochene Nachrichten', 'Tulis jurnal harian singkat dalam Bahasa Jerman', 'Cari tandem partner (iTalki/Tandem app)', 'Baca teks A2 sederhana'],
    sertifikat: ['Goethe-Zertifikat A2', 'telc Deutsch A2', 'TELC A2 Schule'],
  },
  {
    level: 'B1', cls: 'b1', name: 'Menengah', time: '6–8 bulan (6–8 jam/minggu)',
    target: 'Memahami topik umum, bekerja di lingkungan berbahasa Jerman. B1 = syarat minimum banyak lowongan.',
    materi: ['Konjunktiv II (permintaan sopan)', 'Passiv (kalimat pasif)', 'Subordinate clauses (dass, weil, obwohl)', 'Kosakata pekerjaan & profesional', 'Diskusi & argumen sederhana'],
    latihan: ['Tonton serial Jerman dengan subtitle', 'Baca artikel berita level B1', 'Interview simulasi dalam Bahasa Jerman', 'Bergabung grup belajar online'],
    sertifikat: ['Goethe-Zertifikat B1', 'telc Deutsch B1', 'ÖSD Zertifikat B1 — sering diminta untuk Ausbildung & visa'],
  },
  {
    level: 'B2', cls: 'b2', name: 'Menengah Atas', time: '8–12 bulan (6–10 jam/minggu)',
    target: 'Bekerja secara profesional, presentasi, diskusi kompleks. B2 = standar kerja banyak perusahaan Jerman.',
    materi: ['Nuansa gramatikal tingkat lanjut', 'Kosakata spesifik industri', 'Penulisan formal & email profesional', 'Debat & presentasi', 'Pemahaman teks akademik/teknis'],
    latihan: ['Baca koran Jerman (Die Zeit, Spiegel)', 'Podcast Bahasa Jerman (Slow German)', 'Simulasi presentasi kerja', 'Tulis cover letter & CV dalam Bahasa Jerman'],
    sertifikat: ['Goethe-Zertifikat B2 ⭐ (paling direkomendasikan)', 'telc Deutsch B2', 'DSH B2 (untuk universitas)'],
  },
  {
    level: 'C1', cls: 'c1', name: 'Mahir', time: '12–18 bulan (8–10 jam/minggu)',
    target: 'Fasih seperti penutur asli, cocok untuk posisi senior, manajemen, atau karier akademik.',
    materi: ['Gaya bahasa formal & informal tingkat tinggi', 'Penulisan akademik & laporan', 'Idiom & ekspresi natural', 'Negosiasi & komunikasi kompleks'],
    latihan: ['Tonton berita tanpa subtitle', 'Presentasi panjang dalam Bahasa Jerman', 'Bergabung komunitas berbahasa Jerman'],
    sertifikat: ['Goethe-Zertifikat C1', 'telc Deutsch C1 Hochschule', 'DSH C1'],
  },
];

const KARIER_TOPICS = [
  { icon: 'ti-trending-up', name: 'Profesi Dicari', desc: 'Top lowongan di Jerman', q: 'Jelaskan 10 profesi yang paling banyak dicari di Jerman saat ini beserta kisaran gaji, persyaratan bahasa, dan peluang untuk orang Indonesia' },
  { icon: 'ti-id-badge-2', name: 'EU Blue Card', desc: 'Visa kerja untuk sarjana', q: 'Jelaskan secara detail apa itu EU Blue Card Jerman: syarat, proses pengajuan, keuntungan, dan cara mendapatkannya dari Indonesia' },
  { icon: 'ti-ticket', name: 'Chancenkarte', desc: 'Kartu kesempatan baru', q: 'Jelaskan apa itu Chancenkarte (Opportunity Card) Jerman: syarat poin, cara mendaftar, dan apakah saya bisa memanfaatkannya dari Indonesia' },
  { icon: 'ti-school', name: 'Ausbildung', desc: 'Magang dual sistem', q: 'Jelaskan program Ausbildung di Jerman untuk orang Indonesia: apa itu, bidang apa yang tersedia, syarat, gaji selama Ausbildung, dan prospek setelahnya' },
  { icon: 'ti-certificate', name: 'Anerkennung', desc: 'Penyetaraan ijazah', q: 'Bagaimana proses Anerkennung (penyetaraan ijazah) Indonesia di Jerman? Jelaskan langkah-langkahnya, biaya, dan berapa lama prosesnya' },
  { icon: 'ti-home', name: 'Biaya Hidup', desc: 'Budget kota-kota Jerman', q: 'Berikan breakdown biaya hidup detail di kota-kota utama Jerman (Berlin, Munich, Hamburg, Frankfurt, Stuttgart) untuk seorang pekerja single dari Indonesia' },
  { icon: 'ti-shield-check', name: 'Asuransi & Pajak', desc: 'Sistem sosial Jerman', q: 'Jelaskan sistem pajak dan asuransi di Jerman: Krankenversicherung, Rentenversicherung, Lohnsteuer, dan yang perlu diketahui pekerja baru dari Indonesia' },
  { icon: 'ti-file-text', name: 'CV & Bewerbung', desc: 'Dokumen lamaran kerja', q: 'Jelaskan format CV (Lebenslauf) dan cover letter (Anschreiben) standar Jerman, beserta perbedaannya dengan CV Indonesia' },
  { icon: 'ti-microphone-2', name: 'Simulasi Interview', desc: 'Latihan wawancara kerja', q: 'Mulai simulasi mock interview kerja dalam Bahasa Indonesia. Tanya saya 5 pertanyaan interview umum di perusahaan Jerman lalu evaluasi jawaban saya' },
  { icon: 'ti-brand-linkedin', name: 'LinkedIn & Xing', desc: 'Profil profesional online', q: 'Bagaimana cara mengoptimalkan profil LinkedIn dan Xing untuk mencari kerja di Jerman? Tips spesifik untuk kandidat dari Indonesia' },
];

const QUICK_PROMPTS = [
  { label: '🇩🇪 Salam Dasar A1', q: 'Ajarkan saya salam dasar dalam Bahasa Jerman (A1) lengkap dengan pengucapan dan latihan' },
  { label: '📚 Roadmap Belajar', q: 'Buatkan roadmap lengkap belajar Bahasa Jerman saya dari A1 sampai B2' },
  { label: '💼 Profesi Dicari', q: 'Profesi apa yang paling dicari di Jerman saat ini?' },
  { label: '🪪 Visa Kerja', q: 'Jelaskan apa itu EU Blue Card dan Chancenkarte untuk orang Indonesia' },
  { label: '🏠 Biaya Hidup', q: 'Berapa biaya hidup di kota-kota besar Jerman seperti Berlin, Munich, Hamburg?' },
  { label: '✍️ Kosakata Kerja', q: 'Latih saya dengan kosakata Bahasa Jerman untuk situasi kerja sehari-hari' },
];

function formatMsg(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}

export default function Home() {
  const [tab, setTab] = useState('chat');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '**Hallo! Guten Tag! 👋**\n\nSaya adalah mentor AI kamu untuk Bahasa Jerman dan karier di Jerman. Saya siap membantu kamu dalam:\n\n🇩🇪 **Belajar Bahasa Jerman** — dari A1 hingga C1, lengkap dengan latihan, koreksi, dan tips\n💼 **Karier di Jerman** — analisis profil, cari lowongan, persiapan interview\n📄 **Dokumen Kerja** — CV Jerman, Cover Letter, LinkedIn/Xing\n✈️ **Relokasi** — visa, biaya hidup, asuransi, tempat tinggal\n\nIsi **Profil Saya** agar saya bisa memberikan saran yang lebih personal, atau langsung tanya apa saja!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({});
  const [profileSaved, setProfileSaved] = useState(false);
  const [openLevels, setOpenLevels] = useState({});
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(text) {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setLoading(true);

    const newMessages = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);

    const aiMessages = newMessages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: aiMessages, profile: profileSaved ? profile : {} }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: fullText };
          return updated;
        });
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Maaf, terjadi kesalahan. Pastikan environment variable ANTHROPIC_API_KEY sudah diset dan coba lagi.' }]);
    }
    setLoading(false);
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function saveProfile() {
    setProfileSaved(true);
    setTab('chat');
    const name = profile.nama ? ` ${profile.nama}` : '';
    sendMessage(`Halo${name}! Saya sudah mengisi profil saya. Berikan analisis lengkap: (1) profesi di Jerman paling cocok untuk saya, (2) jalur tercepat mendapatkan kerja, (3) prioritas belajar Bahasa Jerman, dan (4) langkah pertama yang harus saya ambil minggu ini.`);
  }

  function toggleLevel(i) {
    setOpenLevels(prev => ({ ...prev, [i]: !prev[i] }));
  }

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.flag}>
          <div className={styles.flagBlack} />
          <div className={styles.flagRed} />
          <div className={styles.flagGold} />
        </div>
        <div className={styles.headerContent}>
          <span className={styles.headerTitle}>Deutsch<span>Mentor</span></span>
          <span className={styles.headerBadge}>AI-Powered</span>
        </div>
      </header>

      {/* Nav */}
      <nav className={styles.nav}>
        {[
          { id: 'chat', icon: 'ti-message-circle', label: 'Chat Mentor' },
          { id: 'profil', icon: 'ti-user', label: 'Profil Saya' },
          { id: 'roadmap', icon: 'ti-map', label: 'Roadmap' },
          { id: 'karier', icon: 'ti-briefcase', label: 'Karier & Relokasi' },
        ].map(t => (
          <button key={t.id} className={`${styles.navTab} ${tab === t.id ? styles.navTabActive : ''}`} onClick={() => setTab(t.id)}>
            <i className={`ti ${t.icon}`} aria-hidden="true" />
            {t.label}
          </button>
        ))}
      </nav>

      <main className={styles.main}>

        {/* CHAT */}
        {tab === 'chat' && (
          <div className={styles.chatPanel}>
            <div className={styles.welcomeBanner}>
              <div className={styles.miniFlag}>
                <div style={{ background: '#1a1a1a', flex: 1 }} />
                <div style={{ background: '#DD0000', flex: 1 }} />
                <div style={{ background: '#FFCE00', flex: 1 }} />
              </div>
              <div>
                <h2 className={styles.welcomeTitle}>Willkommen! Selamat Datang!</h2>
                <p className={styles.welcomeSub}>Mentor AI pribadi untuk Bahasa Jerman & karier di Jerman</p>
              </div>
            </div>

            <p className={styles.sectionLabel}>Mulai cepat</p>
            <div className={styles.quickPrompts}>
              {QUICK_PROMPTS.map((p, i) => (
                <button key={i} className={styles.quickBtn} onClick={() => { setTab('chat'); sendMessage(p.q); }}>{p.label}</button>
              ))}
            </div>

            <div className={styles.messagesWrap}>
              {messages.map((m, i) => (
                <div key={i} className={`${styles.msg} ${m.role === 'user' ? styles.msgUser : styles.msgAi}`}>
                  <div className={`${styles.avatar} ${m.role === 'user' ? styles.avatarUser : styles.avatarAi}`}>
                    {m.role === 'user' ? 'Saya' : 'D'}
                  </div>
                  <div className={`${styles.bubble} ${m.role === 'user' ? styles.bubbleUser : styles.bubbleAi}`}
                    dangerouslySetInnerHTML={{ __html: formatMsg(m.content) || '<span class="typing-dots-inline">●●●</span>' }} />
                </div>
              ))}
              {loading && messages[messages.length - 1]?.role === 'user' && (
                <div className={`${styles.msg} ${styles.msgAi}`}>
                  <div className={`${styles.avatar} ${styles.avatarAi}`}>D</div>
                  <div className={`${styles.bubble} ${styles.bubbleAi}`}>
                    <span className={styles.typingDots}><span /><span /><span /></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className={styles.inputRow}>
              <textarea
                ref={textareaRef}
                className={styles.chatInput}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Tanya apa saja tentang Bahasa Jerman atau karier di Jerman..."
                rows={1}
              />
              <button className="btn-primary" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
                <i className="ti ti-send" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* PROFIL */}
        {tab === 'profil' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Profil Kamu</h3>
            <p className={styles.cardSub}>Isi profil untuk analisis karier dan rencana belajar yang lebih personal</p>

            {profileSaved && (
              <div className={styles.profileSummary}>
                <h4>✅ Profil Tersimpan</h4>
                <div className={styles.chips}>
                  {[profile.nama, profile.umur && profile.umur + ' tahun', profile.pendidikan, profile.bidang, profile.jerman && '🇩🇪 ' + profile.jerman, profile.target && '🎯 ' + profile.target].filter(Boolean).map((c, i) => (
                    <span key={i} className={styles.chip}>{c}</span>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.formGrid}>
              {[
                { label: 'Nama', id: 'nama', type: 'text', placeholder: 'Nama kamu', half: true },
                { label: 'Umur', id: 'umur', type: 'number', placeholder: '25', half: true },
                { label: 'Bidang Studi/Keahlian', id: 'bidang', type: 'text', placeholder: 'Teknik Informatika, Desain, dll', half: true },
                { label: 'Tahun Pengalaman Kerja', id: 'pengalaman', type: 'number', placeholder: '3', half: true },
              ].map(f => (
                <div key={f.id} className={`${styles.formGroup} ${f.half ? '' : styles.formGroupFull}`}>
                  <label>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={profile[f.id] || ''} onChange={e => setProfile(p => ({ ...p, [f.id]: e.target.value }))} />
                </div>
              ))}

              {[
                { label: 'Pendidikan Terakhir', id: 'pendidikan', opts: ['SMA/SMK', 'Diploma (D3/D4)', 'Sarjana (S1)', 'Magister (S2)', 'Doktor (S3)'] },
                { label: 'Kemampuan Bahasa Jerman', id: 'jerman', opts: ['Belum sama sekali', 'A1 (Pemula)', 'A2', 'B1', 'B2', 'C1+'] },
                { label: 'Kemampuan Bahasa Inggris', id: 'inggris', opts: ['Dasar', 'Menengah', 'Mahir', 'Native/Bilingual'] },
                { label: 'Target Waktu ke Jerman', id: 'target', opts: ['1 tahun', '2 tahun', '3 tahun', 'Lebih dari 3 tahun', 'Belum tahu'] },
              ].map(f => (
                <div key={f.id} className={styles.formGroup}>
                  <label>{f.label}</label>
                  <select value={profile[f.id] || ''} onChange={e => setProfile(p => ({ ...p, [f.id]: e.target.value }))}>
                    <option value="">Pilih...</option>
                    {f.opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}

              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label>Skill & Profesi</label>
                <textarea placeholder="Contoh: UI/UX Designer dengan pengalaman Figma, React, 3 tahun di startup..." value={profile.skill || ''} onChange={e => setProfile(p => ({ ...p, skill: e.target.value }))} />
              </div>
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label>Sertifikat yang Dimiliki</label>
                <input type="text" placeholder="IELTS 7.0, Google UX Design, AWS, dll" value={profile.sertifikat || ''} onChange={e => setProfile(p => ({ ...p, sertifikat: e.target.value }))} />
              </div>
            </div>

            <div className={styles.formActions}>
              <button className="btn-primary" onClick={saveProfile}>
                <i className="ti ti-sparkles" aria-hidden="true" /> Simpan & Analisis
              </button>
              <button className="btn-outline" onClick={() => { setProfile({}); setProfileSaved(false); }}>
                <i className="ti ti-trash" aria-hidden="true" /> Reset
              </button>
            </div>
          </div>
        )}

        {/* ROADMAP */}
        {tab === 'roadmap' && (
          <div>
            <p className={styles.sectionLabel} style={{ marginBottom: 12 }}>Roadmap Bahasa Jerman — A1 hingga C1</p>
            <div className={styles.roadmapGrid}>
              {ROADMAP.map((d, i) => (
                <div key={i} className={`${styles.levelCard} ${openLevels[i] ? styles.levelCardOpen : ''}`}>
                  <div className={styles.levelHeader} onClick={() => toggleLevel(i)}>
                    <div className={`${styles.levelBadge} ${styles['badge_' + d.cls]}`}>{d.level}</div>
                    <div className={styles.levelInfo}>
                      <div className={styles.levelName}>{d.level} — {d.name}</div>
                      <div className={styles.levelTime}><i className="ti ti-clock" style={{ fontSize: 12 }} aria-hidden="true" /> {d.time}</div>
                    </div>
                    <i className={`ti ti-chevron-down ${styles.chevron}`} aria-hidden="true" />
                  </div>
                  {openLevels[i] && (
                    <div className={styles.levelBody}>
                      <h4>Target kemampuan</h4>
                      <p>{d.target}</p>
                      <h4>Materi utama</h4>
                      <ul>{d.materi.map((m, j) => <li key={j}>{m}</li>)}</ul>
                      <h4>Latihan yang disarankan</h4>
                      <ul>{d.latihan.map((l, j) => <li key={j}>{l}</li>)}</ul>
                      <h4>Sertifikat relevan</h4>
                      <div className={styles.certChips}>{d.sertifikat.map((s, j) => <span key={j} className={styles.certChip}>{s}</span>)}</div>
                      <button className="btn-outline" style={{ marginTop: 12 }} onClick={() => { setTab('chat'); sendMessage(`Buatkan rencana belajar detail 1 bulan untuk level ${d.level} Bahasa Jerman`); }}>
                        <i className="ti ti-sparkles" aria-hidden="true" /> Buat rencana belajar {d.level} ↗
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* KARIER */}
        {tab === 'karier' && (
          <div>
            <p className={styles.sectionLabel} style={{ marginBottom: 12 }}>Panduan karier & relokasi ke Jerman</p>
            <div className={styles.karierGrid}>
              {KARIER_TOPICS.map((t, i) => (
                <div key={i} className={styles.karierTile} onClick={() => { setTab('chat'); sendMessage(t.q); }}>
                  <i className={`ti ${t.icon}`} aria-hidden="true" />
                  <div className={styles.tileName}>{t.name}</div>
                  <div className={styles.tileDesc}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
