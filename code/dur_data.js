const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const fs = require("fs");

const api_key =
  "3d943276438037d03c0b4643140a045689cb83cbd5b27a42798bcd09c9f32673";
const encodedKey = encodeURIComponent(api_key);
const totalPages = 2393;
const allItems = [];

const fetchDurPage = async (page) => {
  const url = `https://apis.data.go.kr/1471000/DURPrdlstInfoService03/getUsjntTabooInfoList03?serviceKey=${encodedKey}&type=json&numOfRows=100&pageNo=${page}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.body?.items || [];
};

const run = async () => {
  for (let page = 1; page <= totalPages; page++) {
    console.log(`📦 Fetching page ${page}/${totalPages}`);
    const items = await fetchDurPage(page);
    const filtered = items.map((item) => ({
      ITEM_NAME: item.ITEM_NAME,
      INGR_KOR_NAME: item.INGR_KOR_NAME,
      MIXTURE_ITEM_NAME: item.MIXTURE_ITEM_NAME,
      MIXTURE_INGR_KOR_NAME: item.MIXTURE_INGR_KOR_NAME,
      PROHBT_CONTENT: item.PROHBT_CONTENT,
      SEQ: item.ITME_SEQ,
    }));
    allItems.push(...filtered);
    await new Promise((r) => setTimeout(r, 300));
  }

  fs.writeFileSync("dur_data.json", JSON.stringify(allItems, null, 2), "utf-8");
  console.log(`✅ 저장 완료: ${allItems.length}개 항목`);
};

run();
