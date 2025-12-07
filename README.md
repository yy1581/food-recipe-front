# API 문서

## 개요
이 문서는 프론트엔드와 백엔드 간의 API 통신 명세를 정의합니다.

**Base URL**: `http://localhost:8080` (개발 환경)

**인증 방식**: Cookie 기반 (user-id)

---

## 인증 API

### 1. 회원가입
회원가입을 처리합니다.

**Endpoint**: `POST /api/auth/signup`

**Request Body**:
```json
{
  "id": "string" // 사용자 ID (필수)
}
```

**Response**:
```json
{
  "success": true,
  "message": "회원가입이 완료되었습니다.",
  "data": {
    "userId": "string",
    "createdAt": "2025-11-28T00:00:00.000Z"
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "이미 존재하는 사용자입니다."
}
```

**Status Codes**:
- `200`: 성공
- `400`: 잘못된 요청
- `409`: 이미 존재하는 사용자

---

### 2. 로그인
로그인을 처리하고 인증 토큰을 발급합니다.

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "memberId": "string" // 사용자 ID (필수)
}
```

**Response**:
```json
{
  "success": true,
  "message": "로그인 성공",
  "data": {
    "userId": "string"
  }
}
```

**Set-Cookie**:
- `user-id`: 사용자 ID

**Error Response**:
```json
{
  "success": false,
  "message": "존재하지 않는 사용자입니다."
}
```

**Status Codes**:
- `200`: 성공
- `401`: 인증 실패
- `404`: 사용자를 찾을 수 없음

---

## 레시피 API

### 3. 레시피 생성 (채팅)
사용자의 질문을 받아 AI가 레시피를 생성합니다.

**Endpoint**: `POST /api/chats`

**Headers**:
```
Cookie: user-id={userId}
```

**Request Body**:
```json
{
  "query": "string", // 음식 이름 또는 질문 (필수)
  "allergies": ["string"], // 알레르기 목록 (선택)
  "isVegan": false // 비건 여부 (선택, 기본값: false)
}
```

**Response**:
```json
{
  "success": true,
  "message": "레시피가 생성되었습니다.",
  "data": {
    "query": "김치찌개",
    "recipe": "1. 김치를 적당한 크기로 썰어 준비합니다.\n\n2. 돼지고기를 한입 크기로 자릅니다.\n\n3. 팬에 기름을 두르고 김치를 볶습니다.\n\n4. 고기를 넣고 함께 볶아줍니다.\n\n5. 물을 붓고 끓어오르면 두부와 파를 넣습니다.\n\n6. 간을 맞춰 완성합니다.",
    "generatedAt": "2025-11-28T00:00:00.000Z"
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "레시피 생성 중 오류가 발생했습니다."
}
```

**Status Codes**:
- `200`: 성공
- `400`: 잘못된 요청
- `401`: 인증 필요
- `500`: 서버 오류

---

### 4. 레시피 히스토리 조회
사용자가 생성한 레시피 목록을 조회합니다.

**Endpoint**: `GET /api/chats/history`

**Headers**:
```
Cookie: user-id={userId}
```

**Query Parameters**: 없음

**Response**:
```json
{
  "success": true,
  "message": "레시피 히스토리를 성공적으로 조회했습니다.",
  "data": [
    {
      "id": 1,
      "query": "김치찌개",
      "description": "1. 김치를 적당한 크기로 썰어 준비합니다.\n\n2. 돼지고기를 한입 크기로 자릅니다.\n\n3. 팬에 기름을 두르고 김치를 볶습니다.\n\n4. 고기를 넣고 함께 볶아줍니다.\n\n5. 물을 붓고 끓어오르면 두부와 파를 넣습니다.\n\n6. 간을 맞춰 완성합니다.",
      "createdAt": "2025-11-28T00:00:00.000Z"
    },
    {
      "id": 2,
      "query": "된장찌개",
      "description": "1. 멸치와 다시마로 육수를 우려냅니다.\n\n2. 된장을 체에 걸러 육수에 풉니다.\n\n3. 두부, 감자, 양파를 썰어 넣습니다.\n\n4. 호박과 버섯을 추가합니다.\n\n5. 끓어오르면 파를 넣고 마무리합니다.",
      "createdAt": "2025-11-27T00:00:00.000Z"
    }
  ]
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "레시피 히스토리 조회 중 오류가 발생했습니다."
}
```

**Status Codes**:
- `200`: 성공
- `401`: 인증 필요
- `500`: 서버 오류

---

### 5. 메시지 삭제
특정 채팅 메시지(레시피)를 삭제합니다.

**Endpoint**: `DELETE /api/chats/{messageId}`

**Headers**:
```
Cookie: user-id={userId}
```

**Path Parameters**:
- `messageId` (string): 삭제할 메시지 ID

**Response**:
```json
{
  "success": true,
  "message": "메시지가 성공적으로 삭제되었습니다.",
  "data": {
    "messageId": "1"
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "메시지 삭제 중 오류가 발생했습니다."
}
```

**Status Codes**:
- `200`: 성공
- `400`: 잘못된 요청
- `401`: 인증 필요
- `404`: 메시지를 찾을 수 없음
- `500`: 서버 오류

---

### 6. 피드백 제출
레시피에 대한 좋아요 피드백을 제출합니다.

**Endpoint**: `POST /api/chats/feedback`

**Headers**:
```
Cookie: user-id={userId}
```

**Request Body**:
```json
{
  "messageId": "string", // 메시지 ID (필수)
  "feedback": "like" // "like" 또는 null (필수)
}
```

**Response**:
```json
{
  "success": true,
  "message": "피드백이 성공적으로 전송되었습니다.",
  "data": {
    "messageId": "1",
    "feedback": "like"
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "피드백 제출 중 오류가 발생했습니다."
}
```

**Status Codes**:
- `200`: 성공
- `400`: 잘못된 요청
- `401`: 인증 필요
- `500`: 서버 오류

---

## 데이터 타입

### Recipe
```typescript
interface Recipe {
  id: number;
  query: string;
  description: string; // 조리 단계 (번호 매김된 문자열)
  createdAt?: string; // ISO 8601 날짜 형식
}
```

### ApiResponse
```typescript
interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  status?: number;
}
```

---

## 에러 코드

| 코드 | 설명 |
|------|------|
| 400 | Bad Request - 잘못된 요청 |
| 401 | Unauthorized - 인증 필요 |
| 403 | Forbidden - 권한 없음 |
| 404 | Not Found - 리소스를 찾을 수 없음 |
| 409 | Conflict - 중복된 리소스 |
| 500 | Internal Server Error - 서버 오류 |

---

## 인증 흐름

1. **회원가입/로그인**:
   - 프론트엔드가 `/api/auth/login` 또는 `/api/auth/signup`로 요청
   - 백엔드가 `user-id` 쿠키 설정
   - 프론트엔드가 쿠키를 자동으로 저장

2. **인증된 요청**:
   - 모든 요청에 쿠키가 자동으로 포함됨 (`withCredentials: true`)
   - 백엔드가 `user-id` 쿠키를 검증
   - 유효하지 않으면 401 에러 반환

3. **로그아웃**:
   - 프론트엔드에서 쿠키 삭제
   - 백엔드 세션 무효화 (선택사항)

---

## CORS 설정

백엔드에서 다음 CORS 설정이 필요합니다:

```javascript
// Express 예시
app.use(cors({
  origin: 'http://localhost:3000', // 프론트엔드 URL
  credentials: true, // 쿠키 허용
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
```

---

## 환경 변수

프론트엔드 `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

백엔드:
```
PORT=8080
CORS_ORIGIN=http://localhost:3000
```

---

## 테스트 시나리오

### 1. 회원가입 및 로그인
```bash
# 회원가입
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"id": "testuser"}'

# 로그인
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"memberId": "testuser"}' \
  -c cookies.txt
```

### 2. 레시피 생성
```bash
curl -X POST http://localhost:8080/api/chats \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"query": "김치찌개", "allergies": ["갑각류"], "isVegan": false}'
```

### 3. 레시피 히스토리 조회
```bash
curl -X GET http://localhost:8080/api/chats/history \
  -b cookies.txt
```

### 4. 피드백 제출
```bash
curl -X POST http://localhost:8080/api/chats/feedback \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"messageId": "1", "feedback": "like"}'
```

### 5. 메시지 삭제
```bash
curl -X DELETE http://localhost:8080/api/chats/1 \
  -b cookies.txt
```

---

## 주의사항

1. **쿠키 기반 인증**: 모든 요청에 `withCredentials: true` 설정 필요
2. **CORS**: 백엔드에서 `credentials: true` 설정 필요
3. **타임아웃**: 요청 타임아웃은 10초로 설정됨
4. **에러 처리**: 모든 에러는 `ApiResponse` 형식으로 반환됨
5. **날짜 형식**: ISO 8601 형식 사용 (`YYYY-MM-DDTHH:mm:ss.sssZ`)
6. **알레르기 옵션**: 아래 목록 중 선택 가능

### 지원 알레르기 목록
프론트엔드에서 사용자가 선택할 수 있는 알레르기 옵션:

```typescript
[
  "알류",
  "우유",
  "메밀",
  "땅콩",
  "대두",
  "밀",
  "잣",
  "호두",
  "게",
  "새우",
  "오징어",
  "고등어",
  "조개류",
  "복숭아",
  "토마토",
  "닭고기",
  "돼지고기",
  "쇠고기",
  "아황산류"
]
```

**사용 예시**:
```json
{
  "query": "김치찌개",
  "allergies": ["돼지고기", "새우"],
  "isVegan": false
}
```

**참고**: 
- `allergies` 필드는 위 목록에 있는 문자열의 배열로 전송됩니다
- 선택하지 않은 경우 빈 배열 `[]`로 전송됩니다
- 프론트엔드는 로컬스토리지의 `userSettings`에서 설정을 읽어 자동으로 포함합니다

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|----------|
| 2025-12-07 | 1.1.0 | Recipe 타입 변경 (name → query, description: string[] → string), 알레르기/비건 정보 추가, 히스토리 API 엔드포인트 변경 (recipes → chats) |
| 2025-11-28 | 1.0.0 | 초기 문서 작성 |
