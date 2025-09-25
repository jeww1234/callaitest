const api_key2 =
  "3d943276438037d03c0b4643140a045689cb83cbd5b27a42798bcd09c9f32673";
const url2 = `https://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList?serviceKey=${api_key2}&type=json&numOfRows=10`;


fetch(url2)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json(); // JSON으로 파싱
  })
  .then((data) => {
    // 여기서 필요한 정보 추출해서 사용하면 됨
    console.log(data);
    console.log("받은 효능 데이터:", data.body.items);
  })
  .catch((error) => {
    console.error("에러 발생:", error); // 에러 처리
  });
