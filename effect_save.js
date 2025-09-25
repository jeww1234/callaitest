const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const fs = require("fs");

const api_key3 =
  "3d943276438037d03c0b4643140a045689cb83cbd5b27a42798bcd09c9f32673";
const encodedKey3 = encodeURIComponent(api_key3);
const totalPages = 49;
const allItems3 = [];

const fetchDurPage = async (page) => {
  const url = `https://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList?serviceKey=${encodedKey3}&type=json&numOfRows=100&pageNo=${page}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.body?.items || [];
};

const run2 = async () => {
  for (let page = 1; page <= totalPages; page++) {
    console.log(`📦 Fetching page ${page}/${totalPages}`);
    const items = await fetchDurPage(page);
    const filtered = items.map((item) => ({
      ITEM_NAME: item.itemName,
      EFCY: item.efcyQesitm,
      USAGE: item.useMethodQesitm,
      CAUTION: item.atpnQesitm,
      STORAGE: item.depositMethodQesitm,
      SEQ: item.itemSeq,
      USEITEM: item.useMethodQesitm,
    }));

    allItems3.push(...filtered);
    await new Promise((r) => setTimeout(r, 300));
  }

  fs.writeFileSync(
    "effect_data.json",
    JSON.stringify(allItems3, null, 2),
    "utf-8"
  );
  console.log(`✅ 저장 완료: ${allItems3.length}개 항목`);
};

run2();
