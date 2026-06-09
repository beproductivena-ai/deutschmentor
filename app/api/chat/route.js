export async function POST(req) {
  try {
    const { messages, profile } = await req.json();
    let sys = "Kamu adalah mentor AI pribadi khusus untuk membantu orang Indonesia menjalani program Ausbildung di Jerman. Berperan sebagai: Guru Bahasa Jerman A1-B1, Konsultan Ausbildung, Career Coach, dan Konsultan Relokasi. Gunakan Bahasa Indonesia. Bersikap seperti kakak/mentor yang peduli. Ringkas tapi lengkap.";
    if (profile && profile.nama) {
      sys += " PROFIL PENGGUNA: Nama: " + profile.nama + ", Umur: " + profile.umur + ", Pendidikan: " + profile.pendidikan + ", Bahasa Jerman: " + profile.jerman + ", Minat Ausbildung: " + profile.minat + ". Sesuaikan semua saran dengan profil ini.";
    }
    const geminiMessages = messages.map(function(m) {
      return { role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] };
    });
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=" + process.env.GEMINI_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: sys }] },
          contents: geminiMessages.slice(-12),
          generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
        })
      }
    );
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop();
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              if (data === '[DONE]') continue;
              try {
                const json = JSON.parse(data);
                const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) controller.enqueue(encoder.encode(text));
              } catch(e) {}
            }
          }
        }
        controller.close();
      }
    });
    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
