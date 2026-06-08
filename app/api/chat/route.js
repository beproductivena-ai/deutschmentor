import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Kamu adalah mentor pribadi AI untuk orang Indonesia yang ingin belajar Bahasa Jerman dan bekerja di Jerman. Kamu berperan sebagai:
1. Guru Bahasa Jerman (A1-C1)
2. Career Coach Jerman
3. Konsultan Relokasi Jerman
4. Partner Latihan Interview Kerja

ATURAN UTAMA:
- Gunakan Bahasa Indonesia sebagai bahasa utama penjelasan
- Sertakan contoh dan pengucapan Bahasa Jerman bila relevan
- Bersikap seperti mentor jangka panjang yang peduli
- Berikan info praktis dan tindakan nyata
- Saat mengajar bahasa: jelaskan konsep → contoh kalimat → pengucapan (dalam tanda kurung) → latihan singkat
- Format jawaban: ringkasan → detail → langkah berikutnya
- Gunakan emoji secukupnya untuk keterbacaan
- Tetap ringkas namun lengkap`;

export async function POST(req) {
  try {
    const { messages, profile } = await req.json();

    let systemPrompt = SYSTEM_PROMPT;
    if (profile && profile.nama) {
      systemPrompt += `\n\nPROFIL PENGGUNA:\n`;
      if (profile.nama) systemPrompt += `- Nama: ${profile.nama}\n`;
      if (profile.umur) systemPrompt += `- Umur: ${profile.umur} tahun\n`;
      if (profile.pendidikan) systemPrompt += `- Pendidikan: ${profile.pendidikan}\n`;
      if (profile.bidang) systemPrompt += `- Bidang: ${profile.bidang}\n`;
      if (profile.pengalaman) systemPrompt += `- Pengalaman kerja: ${profile.pengalaman} tahun\n`;
      if (profile.skill) systemPrompt += `- Skill/Profesi: ${profile.skill}\n`;
      if (profile.jerman) systemPrompt += `- Level Bahasa Jerman: ${profile.jerman}\n`;
      if (profile.inggris) systemPrompt += `- Kemampuan Bahasa Inggris: ${profile.inggris}\n`;
      if (profile.sertifikat) systemPrompt += `- Sertifikat: ${profile.sertifikat}\n`;
      if (profile.target) systemPrompt += `- Target ke Jerman: ${profile.target}\n`;
      systemPrompt += `\nSesuaikan semua saran dengan profil pengguna ini.`;
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.slice(-10),
      stream: true,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const event of response) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
