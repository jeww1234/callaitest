# 🔹브라우저 기반 AI 구현의 현실과 대안

🚫 브라우저 직접 호출 불가

- 대형 모델은 보안(CORS) 정책 때문에 브라우저에서 직접 fetch 호출이 막힘
- Hugging Face Hosted API가 있어도 브라우저에서 직접 호출 불가

# 🧩 서버 필요성

- 브라우저에서 AI 모델 호출하려면 중간에 서버가 필요
- 백엔드 지식이 없을 경우, 서버리스 함수(Netlify Functions, Vercel Functions 등) 를 우회용으로 사용

# 🔄 서버리스 함수의 역할

- 브라우저 ↔️ 서버리스 함수 ↔️ Hugging Face API
- 서버리스 함수는 중계 역할만 가능
- 모델 자체를 실행하는 것은 불가능

# ⚠️ 서버리스 환경의 한계

- 7B 이상 대형 모델은 메모리/VRAM 요구량이 높아 서버리스 함수에서 실행 불가
- Netlify Functions 등 무료 서버리스 환경은 메모리 제한 존재
- 결과적으로 대형 모델은 서버리스에서 실행 불가

# 🛠️ 해결책

- 배포된 웹에서는 AI 기능 없이 동작
  → 사용자 입력 UI, 버튼 등은 그대로 유지
- 발표/데모 시에는 로컬에서 모델 실행
  → GPU 환경에서 대형 모델 돌리고, 결과를 화면에 보여줌

```

```

# 🔹 HTML + CSS + JS만으로 로컬에서 AI 가능?

✅ 가능하지만 조건이 있어요
❌ 대형 모델은 불가능

- 7B 이상 모델은 VRAM 및 메모리 요구량이 커서 브라우저에서 실행 불가
- JS 브라우저 환경에서는 GPU 직접 접근이 제한적이라 대형 모델은 로드 자체가 어려움
  ✅ 소형 모델은 가능
- 예시: flan-t5-small, bloom-560m 등
- WebAssembly(WebGPU) 기반으로 브라우저에서 직접 실행 가능
- NPM 패키지를 브라우저용 번들로 변환하면 사용 가능
  → esbuild, vite 등 활용

# 🛠️ 구현 구조

[브라우저 HTML/JS UI]
↓
[브라우저에서 직접 로드된 소형 모델 (WebAssembly)]
↓
[메뉴 추천 결과 화면 출력]

- Node.js 서버나 Netlify 같은 서버리스 환경 불필요
- 단, 모델 크기가 작아야 브라우저에서 로드 가능

# 💡 요약

- HTML/CSS/JS만으로 브라우저에서 자연어 입력 → 메뉴 추천 가능
- 단, 대형 모델은 불가능 → 반드시 소형 모델 사용
- 로컬에서 테스트/발표용 데모로 충분히 구현 가능

```

```

# 🧠 브라우저 기반 자연어 모델 적용의 현실

1️⃣ 모델 용량 문제

- 자연어 분석 → 메뉴 추천 정도 성능을 내려면 수억~수십억 파라미터급 모델 필요
- 7B 이상 모델은 VRAM/메모리 요구량이 크고, 브라우저에서는 GPU 직접 접근이 제한됨
  → 브라우저에서 로드 자체가 불가

2️⃣ 브라우저 환경의 기술적 한계

- JS 기반 브라우저에서는 모델 가중치를 직접 메모리에 올리고 계산하기 어려움
- WebAssembly / WebGPU 기반으로는 소형 모델만 가능
- 예시: flan-t5-small, bloom-560m
- 이런 소형 모델은 다음 정도만 가능:
- 단순한 문장 변환
- 요약
- 간단한 추천

---

# ✅ DUR API 호출 + 사용자 입력 처리 (브라우저 JS)

```jsx
🔐 공공데이터 API 키
const api_key = "3d943276438037d03c0b4643140a045689cb83cbd5b27a42798bcd09c9f32673";

🌐 DUR 병용금기 API URL
const url = `https://apis.data.go.kr/1471000/DURPrdlstInfoService03/getUsjntTabooInfoList03?serviceKey=${api_key}&type=json&numOfRows=100&pageNo=1`;

🧩 DOM 요소 가져오기
const addbtn = document.getElementById("addbtn");
const useInput = document.getElementById("useInput");

🖱️ 버튼 클릭 시 입력값 출력
const additem = () => {
  const keyword = useInput.value.trim();
  console.log("사용자 입력:", keyword);
  // 여기에 검색 기능 연결 가능
};

addbtn.addEventListener("click", additem);


📦 DUR API 호출
fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json(); // JSON으로 파싱
  })
  .then(data => {
    console.log("전체 응답:", data);
    console.log("받은 품목 데이터:", data.body.items); // 100개 품목
    // 여기서 itemName 기준으로 검색하거나 필터링 가능
  })
  .catch(error => {
    console.error("에러 발생:", error);
  });
```

# ✅ then()이란?

then()은 비동기 작업이 성공적으로 완료되었을 때 실행할 코드를 지정하는 함수.

```jsx
fetch("url")
  .then((response) => response.json())
  .then((data) => {
    console.log("받은 데이터:", data);
  });
```

# 🔍 작동 흐름

- fetch()는 Promise를 반환함 → 서버 응답을 기다림
- 첫 번째 then()은 응답 객체(Response)를 받음
- response.json()도 Promise를 반환함 → JSON으로 변환
- 두 번째 then()은 변환된 JSON 데이터를 받음

## then()은 "약속이 지켜졌을 때" 실행되는 콜백 함수

```
데이터 수가 많아서 매번 호출하면 트레픽 제한에 걸림
```

# ✅ 1. Node.js 프로젝트 초기화

       npm init -y

- package.json 자동 생성됨
- 프로젝트 설정 기본값으로 초기화됨

# ✅ 2. 필요한 모듈 설치

- node-fetch 설치 (API 호출용)
- npm install node-fetch
- Node.js에서 fetch()를 사용할 수 있게 해주는 라이브러리

# ✅ 3. 전체 코드 구조 (정리된 버전)

```jsx
// 📦 fetch와 파일 시스템 모듈 불러오기
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
//node-fetch: Node.js에서 fetch()를 사용할 수 있게 해주는 라이브러리
const fs = require("fs");
//fs: 파일 시스템 모듈. JSON 파일로 저장할 때 사용


// 🔐 API 키 설정 및 인코딩
const api_key = "3d943276438037d03c0b4643140a045689cb83cbd5b27a42798bcd09c9f32673";
const encodedKey = encodeURIComponent(api_key);

// 📄 전체 페이지 수 및 결과 저장 배열
const totalPages = 2393; //반복할 페이지 수
const allItems = []; // 저장 배열

// 🌐 DUR API 호출 함수
const fetchDurPage = async (page) => {
  const url = `https://apis.data.go.kr/1471000/DURPrdlstInfoService03/getUsjntTabooInfoList03?serviceKey=${encodedKey}&type=json&numOfRows=100&pageNo=${page}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.body?.items || [];
};

// 🚀 전체 페이지 반복 호출 및 저장
const run = async () => {
  for (let page = 1; page <= totalPages; page++) {
    console.log(`📦 Fetching page ${page}/${totalPages}`);
    const items = await fetchDurPage(page);
    allItems.push(...items);
    await new Promise((r) => setTimeout(r, 300)); // API 과부하 방지
  }

  // 💾 JSON 파일로 저장
  fs.writeFileSync("dur_data.json", JSON.stringify(allItems, null, 2), "utf-8");
  console.log(`✅ 저장 완료: ${allItems.length}개 항목`);
};

💾 fs.writeFileSync("dur_data.json", JSON.stringify(allItems, null, 2), "utf-8");
🔹 fs.writeFileSync(...)
  - Node.js의 **파일 시스템 모듈(fs)**에서 제공하는 함수
  - writeFileSync는 동기 방식으로 파일을 저장함
  - 첫 번째 인자: 저장할 파일 이름 (dur_data.json)
  - 두 번째 인자: 저장할 내용 (문자열 형태여야 함)
  - 세 번째 인자: 인코딩 방식 ("utf-8")

🔹 JSON.stringify(allItems, null, 2)
  - allItems: 지금까지 수집한 DUR 데이터 배열
  - JSON.stringify(...): 객체를 JSON 문자열로 변환
  - 브라우저나 Node.js에서 데이터를 파일로 저장하거나 서버로 보낼 때는
    객체 형태 그대로는 안 되고, 문자열로
  - null: replacer (필터링 안 함)
  - 2: 들여쓰기 2칸 → 사람이 보기 좋게 정렬된 JSON


run();
```

# ✅ 4. 실행 방법

node save.js

- dur_data.json 파일이 생성되고
- 병용금기 데이터가 모두 저장됨

```
*로컬에서 JSON 파일을 브라우저에서 쉽게 호출하자*
```

# ✅ json-server란?

JSON 파일을 API처럼 사용할 수 있게 만들어주는 가짜 백엔드 서버야.

- 실제 서버 없이도 GET, POST, PUT, DELETE 요청 가능
- 브라우저에서 fetch()로 호출 가능
- 조건 검색, 필터링, 정렬도 지원

# ✅ 설치 방법

npm install -g json-server

# ✅ 실행 방법

json-server --watch dur_data.json --port 3002

- --watch: 파일을 감시하면서 서버 실행
- dur_data.json: 사용할 JSON 파일
- --port: 원하는 포트 지정 (기본은 3000)

# ✅ 기본 API 경로
| HTTP 메서드 | 경로 | 설명 |
|-------------|--------|--------|
| GET | /dur_data | 전체 DUR 데이터 조회 |
| GET | /dur_data/1 | ID가 1인 항목 조회 |
| GET | /dur_data?itemName_like=타이레놀 | itemName에 "타이레놀" 포함된 항목 검색 |
| POST | /dur_data | 새 항목 추가 (테스트용) |
| PUT | /dur_data/1 | ID 1번 항목 수정 |
| DELETE | /dur_data/1 | ID 1번 항목 삭제 |

✅ HTTP 메서드란?
웹에서 데이터를 요청하거나 조작할 때 사용하는 명령어야.
예를 들어 GET, POST, PUT, DELETE 같은 게 있어.


# 🔍 주요 HTTP 메서드 설명
| HTTP 메서드 | 역할 | 예시 |
|-------------|----------|----------|
| GET | 서버에서 데이터를 가져오기| 약품 목록 조회, 검색 결과 보기  | 
| POST | 서버에 새로운 데이터 추가| 새 약품 등록, 사용자 의견 제출 | 
| PUT | 서버의 기존 데이터를 전체 수정| 약품 정보 전체 업데이트 | 
| PATCH | 서버의 기존 데이터를 부분 수정| 약품 설명만 수정 | 
| DELETE | 서버의 데이터를 삭제| 특정 약품 삭제 | 

# ✅ 브라우저에서 fetch로 사용 예시

```jsx
fetch("http://localhost:3002/dur_data?itemName_like=타이레놀")
  .then((res) => res.json())
  .then((data) => {
    console.log("검색 결과:", data);
  });

  *과제에서 사용한 패치 방법이랑 동일? ㅋ*
```

# 배포시
```
2개의 json 파일을
db.json 파일로 배포
구조
{
  "json1":[
    {},
    {}....
  ],
  "json2":[
    {},
    {}....
  ]
}
```
