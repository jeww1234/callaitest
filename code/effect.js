const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const fs = require("fs");

const api_key2 =
  "3d943276438037d03c0b4643140a045689cb83cbd5b27a42798bcd09c9f32673";
const encodedKey2 = encodeURIComponent(api_key2);
const totalPages = 49;
const allItems2 = [];

const fetchDurPage = async (page) => {
  const url = `https://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList?serviceKey=${encodedKey2}&type=json&numOfRows=10&pageNo=${page}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.body?.items || [];
};

const run = async () => {
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

    }));

    allItems2.push(...filtered);
    await new Promise((r) => setTimeout(r, 300));
  }

  fs.writeFileSync(
    "effect_data.json",
    JSON.stringify(allItems2, null, 2),
    "utf-8"
  );
  console.log(`✅ 저장 완료: ${allItems2.length}개 항목`);
};

run();
