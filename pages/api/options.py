# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from crawler import get_estate_data

app = Flask(__name__)
CORS(app)

# ────────────────────────────── NEW
@app.route("/api/options", methods=["GET"])
def options():
    """
    프런트 드롭다운을 채울 기본 옵션 리스트.
    필요하면 DB나 별도 크롤링 로직으로 교체 가능.
    """
    return jsonify({
        "regions": [
            {"city": "울산",  "district": "북구"},
            {"city": "서울",  "district": "강남구"},
            {"city": "부산",  "district": "해운대구"}
        ],
        "propertyTypes": ["건물", "상가", "사무실"]
    })

# ────────────────────────────── 기존 검색
@app.route("/api/search", methods=["POST"])
def search():
    data = request.get_json()
    results = get_estate_data(
        region      = f"{data.get('city','')} {data.get('district','')}",
        property_type = data.get('propertyType','')
    )
    return jsonify(results)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
