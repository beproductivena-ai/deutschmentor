'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';

const STEPS_DATA = [
  {
    num:'1', cls:'sn0', title:'Persiapan Awal (di Indonesia)', time:'Bulan 1–3',
    materi:['Riset mendalam bidang Ausbildung yang diminati','Mulai belajar Bahasa Jerman dari A1','Siapkan dokumen: ijazah, transkrip, KTP, paspor','Legalisir dokumen ke Kemenkumham & Kemenlu','Terjemahkan dokumen ke Bahasa Jerman'],
    tips:['Bahasa Jerman adalah kunci utama — tanpa B1 sangat susah','Mulai cari info komunitas Indonesia di Jerman'],
    q:'Jelaskan langkah persiapan awal Ausbildung dari Indonesia secara detail'
  },
  {
    num:'2', cls:'sn1', title:'Belajar Bahasa Jerman Intensif', time:'Bulan 3–18',
    materi:['Target minimal B1 untuk bisa melamar','B2 sangat direkomendasikan','Kursus formal 4–6 jam per hari','Gunakan Deutsche Welle (dw.com) gratis','Ambil sertifikat Goethe atau telc'],
    tips:['Goethe B1/B2 paling diakui perusahaan Jerman','Cari tandem partner orang Jerman untuk latihan'],
    q:'Buatkan jadwal belajar Bahasa Jerman intensif dari nol sampai B1 yang realistis'
  },
  {
    num:'3', cls:'sn2', title:'Cari & Lamar Ausbildung', time:'Mulai Bulan 12',
    materi:['ausbildung.de — platform terbesar','arbeitsagentur.de — resmi pemerintah','make-it-in-germany.com — khusus tenaga asing','Siapkan: Anschreiben, Lebenslauf, foto profesional','Sertifikat bahasa + ijazah diterjemahkan'],
    tips:['Kirim lamaran sebanyak mungkin (50–100)','Follow up setelah 2 minggu jika tidak ada respons'],
    q:'Bantu saya membuat CV dan cover letter format Jerman untuk melamar Ausbildung'
  },
  {
    num:'4', cls:'sn3', title:'Proses Visa & Keberangkatan', time:'Setelah dapat kontrak',
    materi:['Visa Ausbildung khusus program pelatihan dual','Atau Visa Pencarian Ausbildung (6 bulan)','Syarat: kontrak, bukti finansial, sertifikat bahasa','Ajukan di Kedutaan Besar Jerman di Jakarta','Siapkan asuransi kesehatan & bukti tempat tinggal'],
    tips:['Proses visa bisa 6–12 minggu, ajukan jauh-jauh hari','Siapkan dana darurat minimal €1.000 saat tiba'],
    q:'Jelaskan proses pengajuan visa Ausbildung dari Indonesia secara lengkap'
  },
  {
    num:'5', cls:'sn4', title:'Ausbildung & Kehidupan di Jerman', time:'2–3 tahun',
    materi:['Kerja di perusahaan 3–4 hari per minggu','Sekolah (Berufsschule) 1–2 hari per minggu','Gaji €620–€1.200 per bulan tergantung bidang','Asuransi kesehatan ditanggung','Setelah lulus bisa langsung kerja & ajukan PR'],
    tips:['Aktif di komunitas Indonesia di Jerman','Manfaatkan waktu sekolah untuk perkuat bahasa'],
    q:'Ceritakan kehidupan sehari-hari selama Ausbildung di Jerman: jadwal, gaji, hak, dan prospek setelah lulus'
  },
];

const BAHASA_TOPICS = [
  {icon:'ti-abc', name:'Salam & Perkenalan', desc:'Kata pertama A1', q:'Ajarkan saya salam dan perkenalan dasar Bahasa Jerman level A1 dengan pengucapan dan latihan. Saya pemula absolut.'},
  {icon:'ti-numbers', name:'Angka & Waktu', desc:'1-100, jam, tanggal', q:'Ajarkan saya angka 1-100 dan cara menyebut waktu dalam Bahasa Jerman untuk pemula A1'},
  {icon:'ti-building', name:'Kosakata Kerja', desc:'Vocab Ausbildung', q:'Ajarkan kosakata Bahasa Jerman yang paling penting untuk situasi kerja dan Ausbildung sehari-hari'},
  {icon:'ti-message', name:'Percakapan Dasar', desc:'Dialog sehari-hari', q:'Latih saya percakapan Bahasa Jerman sehari-hari yang sering dipakai saat Ausbildung di Jerman'},
  {icon:'ti-writing', name:'Grammar Dasar', desc:'Struktur kalimat', q:'Jelaskan grammar dasar Bahasa Jerman untuk pemula: struktur kalimat, artikel der/die/das, dengan contoh mudah'},
  {icon:'ti-pencil', name:'Menulis Email', desc:'Email formal Jerman', q:'Ajarkan cara menulis email formal dalam Bahasa Jerman untuk keperluan Ausbildung'},
  {icon:'ti-microphone', name:'Latihan Ucapan', desc:'Pelafalan Jerman', q:'Bantu saya berlatih pengucapan Bahasa Jerman yang susah untuk orang Indonesia: ü, ö, ä, ch, sch'},
  {icon:'ti-test-pipe', name:'Kuis Harian', desc:'Quiz & evaluasi', q:'Buat kuis 10 soal Bahasa Jerman level A1 untuk menguji kemampuan dasar saya lalu evaluasi jawaban saya'},
];

const INFO_TOPICS = [
  {icon:'ti-school', name:'Apa itu Ausbildung', desc:'Penjelasan lengkap', q:'Jelaskan secara lengkap apa itu program Ausbildung di Jerman: sistem dual, perbedaan dengan kuliah, keuntungan untuk orang Indonesia'},
  {icon:'ti-list', name:'Bidang Ausbildung', desc:'300+ bidang tersedia', q:'Jelaskan bidang Ausbildung yang paling banyak dicari dan terbuka untuk tenaga asing dari Indonesia'},
  {icon:'ti-coin', name:'Gaji & Biaya Hidup', desc:'Finansial selama Ausbildung', q:'Berikan info lengkap gaji Ausbildung per bidang dan biaya hidup di Jerman'},
  {icon:'ti-file-certificate', name:'Anerkennung', desc:'Penyetaraan ijazah', q:'Jelaskan proses Anerkennung (penyetaraan ijazah Indonesia) di Jerman: apakah perlu dan bagaimana prosesnya'},
  {icon:'ti-plane', name:'Visa & Imigrasi', desc:'Proses masuk Jerman', q:'Jelaskan semua jenis visa untuk Ausbildung di Jerman dari Indonesia beserta syarat dan prosesnya'},
  {icon:'ti-heart', name:'Asuransi & Hak', desc:'Perlindungan di sana', q:'Jelaskan sistem asuransi kesehatan, hak-hak, dan perlindungan hukum selama Ausbildung di Jerman'},
  {icon:'ti-home', name:'Tempat Tinggal', desc:'Cari kos & apartemen', q:'Bagaimana cara mencari tempat tinggal di Jerman untuk peserta Ausbildung baru dari Indonesia?'},
  {icon:'ti-users', name:'Komunitas Indo', desc:'Networking di Jerman', q:'Di mana bisa menemukan komunitas orang Indonesia di Jerman yang bisa membantu peserta Ausbildung baru?'},
  {icon:'ti-award', name:'Setelah Lulus', desc:'Karier & residensi', q:'Apa yang bisa dilakukan setelah lulus Ausbildung di Jerman? Prospek karier dan cara mendapat izin tinggal permanen'},
  {icon:'ti-alert-triangle', name:'Hindari Penipuan', desc:'Waspada agen palsu', q:'Bagaimana cara membedakan agen Ausbildung terpercaya vs penipuan? Tanda-tanda agen palsu yang harus diwaspadai'},
];

const QUICK = [
  {label:'Apa itu Ausbildung?', q:'Apa itu Ausbildung di Jerman dan kenapa bagus untuk orang Indonesia?'},
  {label:'Bidang terbaik', q:'Ausbildung bidang apa yang paling banyak menerima orang asing di Jerman?'},
  {label:'Mulai Bahasa Jerman', q:'Ajarkan saya kata pertama dalam Bahasa Jerman untuk pemula absolut'},
  {label:'Gaji & biaya hidup', q:'Berapa gaji selama Ausbildung di Jerman dan berapa biaya hidupnya?'},
  {label:'Dokumen lamaran', q:'Dokumen apa saja yang dibutuhkan untuk melamar Ausbildung dari Indonesia?'},
  {label:'Berapa lama?', q:'Berapa lama waktu yang realistis dari nol sampai saya bisa berangkat Ausbildung ke Jerman?'},
];

function formatMsg(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}

export default function Home() {
  const [tab, setTab] = useState('chat');
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: '**Hallo! Willkommen!** 👋\n\nSaya mentor AI pribadi untuk perjalanan Ausbildung kamu ke Jerman.\n\nKamu mulai dari nol — justru bagus, kita bangun semuanya dengan benar dari awal!\n\n🇩🇪 **Bahasa Jerman** dari A1 step by step\n📋 **Panduan Ausbildung** lengkap dan realistis\n📄 **Dokumen & lamaran** ke perusahaan Jerman\n🎤 **Simulasi interview** dalam 3 bahasa\n✈️ **Persiapan relokasi** ke Jerman\n\nIsi tab **Profil** agar saran lebih personal, atau langsung tanya apa saja!'
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({});
  const [profileSaved, setProfileSaved] = useState(false);
  const [openSteps, setOpenSteps] = useState({});
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function sendMessage(text) {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setLoading(true);
    const newMsgs = [...messages, { role: 'user', content: msg }];
    setMessages(newMsgs);
    const apiMsgs = newMsgs.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }));
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMsgs, profile: profileSaved ? profile : {} }),
      });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMessages(prev => { const u = [...prev]; u[u.length - 1] = { role: 'assistant', content: full }; return u; });
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Maaf, terjadi kesalahan koneksi. Coba lagi ya.' }]);
    }
    setLoading(false);
  }

  function saveProfile() {
    const p = {
      nama: document.getElementById('p-nama').value,
      umur: document.getElementById('p-umur').value,
      pendidikan: document.getElementById('p-pendidikan').value,
      bidang: document.getElementById('p-bidang').value,
      pengalaman: document.getElementById('p-pengalaman').value,
      jerman: document.getElementById('p-jerman').value,
      inggris: document.getElementById('p-inggris').value,
      target: document.getElementById('p-target').value,
      minat: document.getElementById('p-minat').value,
      cerita: document.getElementById('p-cerita').value,
    };
    setProfile(p);
    setProfileSaved(true);
    setTab('chat');
    const n = p.nama ? ` ${p.nama}` : '';
    sendMessage(`Halo${n}! Ini profil saya. Tolong analisis: (1) apakah saya realistis bisa Ausbildung di Jerman, (2) bidang Ausbildung paling cocok untuk saya, (3) langkah pertama minggu ini, dan (4) estimasi lama persiapan saya.`);
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.flag}><div /><div /><div /></div>
        <span className={styles.title}>Ausbildung<span>AI</span></span>
        <span className={styles.badge}>Mentor Pribadi</span>
      </header>

      <nav className={styles.nav}>
        {[
          {id:'chat', icon:'ti-message-circle', label:'Chat'},
          {id:'profil', icon:'ti-user', label:'Profil'},
          {id:'jalan', icon:'ti-route', label:'Jalur Ausbildung'},
          {id:'bahasa', icon:'ti-language', label:'Bahasa Jerman'},
          {id:'info', icon:'ti-info-circle', label:'Info Penting'},
        ].map(t => (
          <button key={t.id} className={`${styles.tab} ${tab===t.id ? styles.tabOn : ''}`} onClick={() => setTab(t.id)}>
            <i className={`ti ${t.icon}`} aria-hidden="true" /> {t.label}
          </button>
        ))}
      </nav>

      <main className={styles.main}>

        {tab === 'chat' && (
          <div>
            <div className={styles.hero}>
              <div className={styles.flagBig}><div /><div /><div /></div>
              <div>
                <h2>Hallo! Saya mentor Ausbildung kamu</h2>
                <p>Panduan lengkap dari nol: Bahasa Jerman, dokumen, hingga dapat Ausbildung di Jerman</p>
              </div>
            </div>
            <p className={styles.secLabel}>Mulai dari sini</p>
            <div className={styles.chips}>
              {QUICK.map((q,i) => (
                <button key={i} className={styles.chip} onClick={() => sendMessage(q.q)}>{q.label}</button>
              ))}
            </div>
            <div className={styles.msgs}>
              {messages.map((m, i) => (
                <div key={i} className={`${styles.msg} ${m.role==='user' ? styles.msgUser : ''}`}>
                  <div className={`${styles.av} ${m.role==='user' ? styles.avUser : styles.avAi}`}>
                    {m.role==='user' ? 'Saya' : 'A'}
                  </div>
                  <div className={`${styles.bubble} ${m.role==='user' ? styles.bubUser : styles.bubAi}`}
                    dangerouslySetInnerHTML={{ __html: formatMsg(m.content) || '<span>...</span>' }} />
                </div>
              ))}
              {loading && messages[messages.length-1]?.role==='user' && (
                <div className={styles.msg}>
                  <div className={`${styles.av} ${styles.avAi}`}>A</div>
                  <div className={`${styles.bubble} ${styles.bubAi}`}>
                    <span className={styles.dots}><span/><span/><span/></span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
            <div className={styles.inputRow}>
              <textarea className={styles.chatInput} value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();}}}
                placeholder="Tanya apa saja tentang Ausbildung atau Bahasa Jerman..." rows={1} />
              <button className={styles.sendBtn} onClick={() => sendMessage()} disabled={loading||!input.trim()}>
                <i className="ti ti-send" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {tab === 'profil' && (
          <div className={styles.card}>
            <h3>Profil Kamu</h3>
            <p className={styles.cardSub}>Isi ini agar saran mentor lebih personal dan akurat</p>
            {profileSaved && (
              <div className={styles.profileSaved}>
                <p>Profil tersimpan ✅</p>
                <div className={styles.pChips}>
                  {[profile.nama, profile.umur&&profile.umur+' thn', profile.pendidikan, profile.jerman&&'🇩🇪 '+profile.jerman, profile.minat&&'Minat: '+profile.minat].filter(Boolean).map((c,i) => (
                    <span key={i} className={styles.pChip}>{c}</span>
                  ))}
                </div>
              </div>
            )}
            <div className={styles.formGrid}>
              <div className={styles.fg}><label>Nama</label><input id="p-nama" placeholder="Nama kamu" defaultValue={profile.nama||''} /></div>
              <div className={styles.fg}><label>Umur</label><input id="p-umur" type="number" placeholder="22" defaultValue={profile.umur||''} /></div>
              <div className={styles.fg}><label>Pendidikan</label>
                <select id="p-pendidikan" defaultValue={profile.pendidikan||''}>
                  <option value="">Pilih...</option>
                  <option>SMA/SMK</option><option>Diploma (D3/D4)</option><option>Sarjana (S1)</option><option>Lainnya</option>
                </select>
              </div>
              <div className={styles.fg}><label>Jurusan/Bidang</label><input id="p-bidang" placeholder="Keperawatan, Mesin, dll" defaultValue={profile.bidang||''} /></div>
              <div className={styles.fg}><label>Pengalaman Kerja</label>
                <select id="p-pengalaman" defaultValue={profile.pengalaman||''}>
                  <option value="">Pilih...</option>
                  <option>Belum ada</option><option>Kurang dari 1 tahun</option><option>1-3 tahun</option><option>3+ tahun</option>
                </select>
              </div>
              <div className={styles.fg}><label>Bahasa Jerman</label>
                <select id="p-jerman" defaultValue={profile.jerman||''}>
                  <option value="">Pilih...</option>
                  <option>Nol (belum pernah)</option><option>A1</option><option>A2</option><option>B1</option><option>B1+</option>
                </select>
              </div>
              <div className={styles.fg}><label>Bahasa Inggris</label>
                <select id="p-inggris" defaultValue={profile.inggris||''}>
                  <option value="">Pilih...</option>
                  <option>Dasar</option><option>Menengah</option><option>Mahir</option>
                </select>
              </div>
              <div className={styles.fg}><label>Target Berangkat</label>
                <select id="p-target" defaultValue={profile.target||''}>
                  <option value="">Pilih...</option>
                  <option>1 tahun</option><option>2 tahun</option><option>3 tahun</option><option>Belum tahu</option>
                </select>
              </div>
              <div className={`${styles.fg} ${styles.fgFull}`}><label>Minat Bidang Ausbildung</label>
                <input id="p-minat" placeholder="Keperawatan, IT, Kuliner, Otomotif..." defaultValue={profile.minat||''} />
              </div>
              <div className={`${styles.fg} ${styles.fgFull}`}><label>Ceritakan kondisi kamu</label>
                <textarea id="p-cerita" placeholder="Situasi sekarang, hambatan, harapan..." defaultValue={profile.cerita||''} />
              </div>
            </div>
            <div className={styles.formActions}>
              <button className={styles.btnRed} onClick={saveProfile}><i className="ti ti-sparkles" aria-hidden="true" /> Simpan & Analisis</button>
              <button className={styles.btnOut} onClick={() => { setProfile({}); setProfileSaved(false); }}><i className="ti ti-trash" aria-hidden="true" /> Reset</button>
            </div>
          </div>
        )}

        {tab === 'jalan' && (
          <div>
            <p className={styles.secLabel} style={{marginBottom:12}}>5 tahap perjalanan Ausbildung kamu</p>
            <div className={styles.stepList}>
              {STEPS_DATA.map((s, i) => (
                <div key={i} className={styles.stepCard}>
                  <div className={styles.stepHead} onClick={() => setOpenSteps(p => ({...p,[i]:!p[i]}))}>
                    <div className={`${styles.stepNum} ${styles[s.cls]}`}>{s.num}</div>
                    <div className={styles.stepInfo}>
                      <div className={styles.stepTitle}>{s.title}</div>
                      <div className={styles.stepTime}><i className="ti ti-clock" style={{fontSize:11}} aria-hidden="true" /> {s.time}</div>
                    </div>
                    <i className={`ti ti-chevron-down ${styles.chev}`} style={{transform: openSteps[i]?'rotate(180deg)':'none'}} aria-hidden="true" />
                  </div>
                  {openSteps[i] && (
                    <div className={styles.stepBody}>
                      <h4>Yang harus dilakukan</h4>
                      <ul>{s.materi.map((m,j) => <li key={j}>{m}</li>)}</ul>
                      <h4>Tips penting</h4>
                      <ul>{s.tips.map((t,j) => <li key={j}>{t}</li>)}</ul>
                      <button className={styles.btnOut} style={{marginTop:10}} onClick={() => { setTab('chat'); sendMessage(s.q); }}>
                        <i className="ti ti-sparkles" aria-hidden="true" /> Tanya mentor ↗
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'bahasa' && (
          <div>
            <div className={styles.hero} style={{marginBottom:14}}>
              <span style={{fontSize:28}}>🇩🇪</span>
              <div><h2>Bahasa Jerman dari Nol</h2><p>Belajar step by step, fokus untuk kebutuhan Ausbildung</p></div>
            </div>
            <p className={styles.secLabel} style={{marginBottom:8}}>Pilih topik belajar hari ini</p>
            <div className={styles.tileGrid}>
              {BAHASA_TOPICS.map((t,i) => (
                <div key={i} className={styles.tile} onClick={() => { setTab('chat'); sendMessage(t.q); }}>
                  <i className={`ti ${t.icon}`} aria-hidden="true" />
                  <div className={styles.tileName}>{t.name}</div>
                  <div className={styles.tileDesc}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'info' && (
          <div>
            <p className={styles.secLabel} style={{marginBottom:10}}>Semua yang perlu kamu tahu tentang Ausbildung</p>
            <div className={styles.tileGrid}>
              {INFO_TOPICS.map((t,i) => (
                <div key={i} className={styles.tile} onClick={() => { setTab('chat'); sendMessage(t.q); }}>
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
