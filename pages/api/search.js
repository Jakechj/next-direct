// pages/api/search.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { region, propertyType } = req.body;

  try {
    // ① 여러분의 실제 백엔드 URL을 입력하세요
    const BACKEND_URL = "https://backend-direct.onrender.com";

    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ region, propertyType }),
    });

    // ② 백엔드 에러 상태 그대로 프록시 전달
    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).send(text);
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    console.error("API proxy error:", err);
    return res.status(500).json({ error: "서버 호출 중 오류가 발생했습니다." });
  }
}
