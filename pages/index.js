import { useState } from 'react';

export default function Home() {
  const [region, setRegion] = useState('울산 북구');
  const [type, setType] = useState('건물');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setError('');
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ region, propertyType: type })
      });
      if (!res.ok) throw new Error(res.statusText);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError('오류: ' + err.message);
    }
  };

  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: 20, fontFamily: 'sans-serif' }}>
      <h1>부동산 수익률 조회</h1>
      <div style={{ marginBottom: 20 }}>
        <select value={region} onChange={e => setRegion(e.target.value)}>
          <option>울산 북구</option>
          <option>서울 강남구</option>
          <option>부산 해운대구</option>
        </select>
        <select value={type} onChange={e => setType(e.target.value)} style={{ marginLeft: 10 }}>
          <option>건물</option>
          <option>상가</option>
          <option>사무실</option>
        </select>
        <button onClick={handleSearch} style={{ marginLeft: 10 }}>검색</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data.map((item, idx) => (
        <div key={idx} style={{ border: '1px solid #ddd', borderRadius: 4, padding: 10, marginBottom: 10 }}>
          <p><b>매물유형:</b> {item.type}</p>
          <p><b>평수:</b> {item.contractArea} / {item.actualArea}</p>
          <p><b>매매가:</b> {item.salePrice}만원, <b>월세:</b> {item.rent}만원</p>
          <p><b>수익률:</b> {item.yield}%</p>
          <p><b>평단가:</b> {item.pricePerPy}만원/평</p>
          <p><b>층수:</b> {item.floor}</p>
          <p><b>입주:</b> {item.availableDate}</p>
          <p><b>중개사:</b> {item.agent}</p>
          <p><a href={item.mapLink} target="_blank">지도 보기</a></p>
        </div>
      ))}
    </main>
  );
}