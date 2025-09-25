const api_key =
  "3d943276438037d03c0b4643140a045689cb83cbd5b27a42798bcd09c9f32673";
const url = `https://apis.data.go.kr/1471000/DURPrdlstInfoService03/getUsjntTabooInfoList03?serviceKey=${api_key}&type=json&numOfRows=10&pageNo=1`;

fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json(); // JSON으로 파싱
  })
  .then((data) => {
    // 여기서 필요한 정보 추출해서 사용하면 됨
    console.log(data);
    console.log("받은 품목 데이터:", data.body.items);
  })
  .catch((error) => {
    console.error("에러 발생:", error); // 에러 처리
  });
