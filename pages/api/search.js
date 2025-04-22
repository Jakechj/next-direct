export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { region, propertyType } = req.body;
  const sample = {
    type: propertyType,
    contractArea: "40평",
    actualArea: "38평",
    salePrice: 65000,
    rent: 250,
    yield: Math.round((250 * 12) / 65000 * 10) / 10,
    pricePerPy: Math.round(65000 / 38 * 10) / 10,
    floor: "2층/5층",
    availableDate: "즉시",
    agent: "샘플부동산",
    mapLink: `https://map.naver.com/v5/search/${encodeURIComponent(region)}`
  };
  res.status(200).json([sample]);
}