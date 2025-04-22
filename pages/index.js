import { useState, useEffect } from "react";

export default function Home() {
  // ── 옵션 상태 ─────────────────────────────
  const [regions, setRegions]         = useState([]);   // [{city,district}]
  const [propertyTypes, setTypes]     = useState([]);   // ["건물",..]

  // ── 선택 상태 ─────────────────────────────
  const [city,       setCity]        = useState("");
  const [district,   setDistrict]    = useState("");
  const [type,       setType]        = useState("");

  // ── 결과/에러 상태 ───────────────────────
  const [data,  setData]  = useState([]);
  const [error, setError] = useState("");

  // ─────────────────────────────────────────
  // ① 페이지 최초 로드 시 옵션 받아오기
  useEffect(() => {
    fetch("/api/options")
      .then(r => r.json())
      .then(opt => {
        setRegions(opt.regions);
        setTypes(opt.propertyTypes);
        // 기본값 세팅
        if (opt.regions.length) {
          setCity(opt.regions[0].city);
          setDistrict(opt.regions[0].district);
        }
        if (opt.propertyTypes.length) setType(opt.propertyTypes[0]);
      })
      .catch(err => setError("옵션 로드 실패: " + err.message));
  }, []);

  // ─────────────────────────────────────────
  // ② 검색
  const handleSearch = async () => {
    setError("");
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, district, propertyType: type })
      });
      if (!res.ok) throw new Error(res.statusText);
      setData(await res.json());
    } catch (err) {
      setError("오류: " + err.message);
    }
  };

  // ─────────────────────────────────────────
  // ③ 도시 선택이 바뀌면 해당 도시의 군/구만 필터링
  const districtsOfCity = regions
      .filter(r => r.city === city)
      .map(r => r.district);

  return (
    <main style={{ maxWidth:600, margin:"0 auto", padding:20, fontFamily:"sans-serif" }}>
      <h1>부동산 수익률 조회</h1>

      {/* ── 드롭다운 UI ─────────────────── */}
      <div style={{ marginBottom:20 }}>
        <select value={city} onChange={e => setCity(e.target.value)}>
          {Array.from(new Set(regions.map(r => r.city))).map(c =>
            <option key={c}>{c}</option>
          )}
        </select>

        <select
          value={district}
          onChange={e => setDistrict(e.target.value)}
          style={{ marginLeft:10 }}
        >
          {districtsOfCity.map(d => <option key={d}>{d}</option>)}
        </select>

        <select
          value={type}
          onChange={e => setType(e.target.value)}
          style={{ marginLeft:10 }}
        >
          {propertyTypes.map(t => <option key={t}>{t}</option>)}
        </select>

        <button onClick={handleSearch} style={{ marginLeft:10 }}>검색</button>
      </div>

      {error && <p style={{ color:"red" }}>{error}</p>}

      {/* 결과 카드 */}
      {data.map((item, idx) => (
        <div key={idx} style={{ border:"1px solid #ddd", borderRadius:4, padding:10, marginBottom:10 }}>
          <p><b>시:</b> {item.city}</p>
          <p><b>군/구:</b> {item.district}</p>
          <p><b>매물유형:</b> {item.type}</p>
          {item.title && <p><b>매물명:</b> {item.title}</p>}
          {/* 나머지 필드 … */}
        </div>
      ))}
    </main>
  );
}
