# 📔 DailyDiary (하루 일기장)

OAuth2 소셜 로그인과 JWT 보안을 적용한 RESTful 기반의 하루 일기 기록 서비스입니다.
Spring Security와 OAuth2 Client를 활용하여 인증/인가 로직을 직접 구현하고, 프론트엔드(React)와의 연동을 고려하여 설계되었습니다.

## 🛠 Tech Stack

| 분류 | 기술 스택                               |
| :--- |:------------------------------------|
| **Language** | Java 21                             |
| **Framework** | Spring Boot 4.0.1                   |
| **Database** | MySQL                               |
| **Security** | Spring Security, OAuth2 Client, JWT |
| **Library** | Lombok, Spring Data JPA, Validation |
| **Build Tool** | Gradle                              |

## 🎯 Project Goal

- **OAuth2 & JWT**: 소셜 로그인 후 JWT를 쿠키에 발급하여 Stateless한 인증 시스템 구축
- **RESTful API**: 자원(Resource) 중심의 명확한 API URI 설계
- **Security**: Spring Security Filter Chain을 활용한 인가(Authorization) 처리

## 📝 API Specification

### 1. User (사용자 & 인증)
| Method | URI | 설명 | 비고 |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | 일반 로그인 (옵션) | JWT 발급 |
| `POST` | `/api/auth/join` | 회원가입 (추가 정보 입력) | |
| `GET` | `/api/users/me` | 내 정보 조회 | **Security 필수** |

> **Note**: 소셜 로그인은 `/oauth2/authorization/{provider}` 엔드포인트를 통해 수행됩니다.

### 2. Diary (일기)
| Method | URI                 | 설명 | 비고 |
| :--- |:--------------------| :--- | :--- |
| `POST` | `/api/save`         | 일기 작성 | |
| `GET` | `/api/diaries`      | 내 일기 목록 조회 | 페이징/필터 가능 |
| `GET` | `/api/diaries/{id}` | 일기 상세 조회 | `{id}`: 일기 고유 번호 |
| `PUT` | `/api/diaries/{id}` | 일기 수정 | |
| `DELETE` | `/api/diaries/{id}` | 일기 삭제 | |

## 💾 ERD (Database Schema)

*(추후 ERD 다이어그램 이미지를 여기에 넣거나, 간단한 텍스트로 표현)*

- **Users**: `id`, `email`, `nickname`, `provider`, `role`, `created_at`
- **Diaries**: `id`, `user_id(FK)`, `content`, `mood`, `created_at`, `updated_at`

## 🚀 How to Run

1. `application.yml`에 DB 및 OAuth2 설정 입력
2. 프로젝트 빌드 및 실행
   ```bash
   ./gradlew bootRun