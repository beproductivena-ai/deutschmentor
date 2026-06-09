export async function POST(req) {
  try {
    const { messages, profile } = await req.json();

    let sys = "Kamu adalah mentor AI pribadi khusus untuk membantu orang Indonesia menjalani program Ausbildung di Jerman. Berperan sebagai: Guru Bahasa Jerman A1-B1, Konsultan Ausbildung, Career Coach, dan Konsultan Relokasi. Gunakan Bahasa Indonesia. Bersikap seperti kakak/mentor yang peduli. Ringkas tapi lengkap dengan emoji.";
    
    if (profile && profile.nama) {
      sys += " PROFIL PENGGUNA: Nama: " + profile.nama + ", Umur: " + profile.umur + ", Pendidikan: " + profile.pendidikan + ", Bahasa Jerman: " + profile.jerman + ", Minat Ausbildung: " + profile.minat + ". Sesuaikan semua saran dengan profil ini. Panggil dengan nama.";
    }

    const geminiMessages = messages.map(function(m) {
      return {
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      };
    });

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: sys }] },
          contents: geminiMessages.slice(-12),
          generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
        })
      }
    );

    const data = await response.json();
    
    if (data.error) {
      return new Response(JSON.stringify({ error: data.error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, tidak ada respons.";
    
    return new Response(text, {
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
