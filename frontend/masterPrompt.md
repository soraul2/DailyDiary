[지시사항: React + AppleDesign (Global CSS)]

나는 React 프로젝트를 진행 중이며, AppleDesign.css가 main.jsx에 전역으로 등록되어 있습니다. 아래 **[CSS 클래스 규칙]**을 사용하여 페이지를 구현해 주세요. (CSS 파일 import 불필요)

1. 필수 CSS 클래스 사용:

레이아웃: <div className="apple-layout"> → <div className="apple-container">

헤더: <div className="apple-header"> (내부에 .apple-title, .apple-subtitle)

카드: <div className="apple-card"> (흰색 유리 박스)

입력: <div className="input-group"> (내부에 .input-label, .apple-input)

버튼: <button className="apple-button">

🍎 Project Design System (Apple Style)
이 문서는 프로젝트의 일관된 디자인(UI/UX)과 코드 패턴을 정의합니다. 새로운 기능을 개발할 때 이 가이드를 따릅니다.

1. Global CSS (AppleDesign.css)
   모든 페이지는 이 CSS 파일을 기본으로 사용합니다. 특히 리스트의 줄 높이(line-height) 설정이 중요합니다.

CSS

/* 1. 배경 및 레이아웃 */
body {
background-color: #F5F5F7; /* Apple Light Gray */
margin: 0;
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
color: #1D1D1F;
}

.apple-layout {
min-height: 100vh;
display: flex;
justify-content: center;
padding: 40px 20px;
}

.apple-container {
width: 100%;
max-width: 640px; /* 모바일/태블릿 친화적 폭 */
}

/* 2. 타이포그래피 */
.apple-header {
margin-bottom: 30px;
text-align: left;
}

.apple-title {
font-size: 32px;
font-weight: 700;
margin: 0 0 8px 0;
color: #1D1D1F;
}

.apple-subtitle {
font-size: 17px;
color: #86868B;
margin: 0;
font-weight: 400;
}

/* 3. 카드형 컨테이너 (흰색 박스) */
.apple-card {
background-color: #FFFFFF;
border-radius: 20px;
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
overflow: hidden; /* 자식 요소의 넘침 방지 */
padding: 30px; /* 기본 패딩 (리스트 페이지는 0으로 오버라이딩) */
}

/* 4. 입력 필드 */
.input-group {
margin-bottom: 20px;
}

.input-label {
display: block;
font-size: 13px;
color: #86868B;
margin-bottom: 8px;
font-weight: 500;
}

.apple-input {
width: 100%;
padding: 16px;
font-size: 17px;
border: 1px solid #D2D2D7;
border-radius: 12px;
background-color: #F5F5F7;
box-sizing: border-box; /* 패딩 포함 크기 계산 */
transition: all 0.2s;
}

.apple-input:focus {
outline: none;
border-color: #007AFF;
background-color: #FFFFFF;
}

/* 5. 버튼 스타일 */
.apple-button {
width: 100%;
padding: 16px;
font-size: 17px;
font-weight: 600;
color: #FFFFFF;
background-color: #007AFF; /* Apple Blue */
border: none;
border-radius: 14px;
cursor: pointer;
transition: opacity 0.2s;
display: flex;
justify-content: center;
align-items: center;
}

.apple-button:hover {
opacity: 0.9;
}

/* 6. 리스트 아이템 (일기 목록 등) */
.list-item {
padding: 20px 24px;
border-bottom: 1px solid rgba(0,0,0,0.05);
cursor: pointer;
display: flex;
align-items: center;
justify-content: space-between;
transition: background-color 0.2s;
}

.list-item:hover {
background-color: rgba(0,0,0,0.03);
}

.list-item:last-child {
border-bottom: none;
}

/* ★ 중요: 날짜 밀림 방지용 텍스트 스타일 ★ */
.list-title {
margin: 0;
font-size: 17px;
font-weight: 600;
color: #1D1D1F;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
line-height: 22px; /* 텍스트 높이 고정 */
}

.list-date {
font-size: 13px;
color: #86868B;
}
2. React 컴포넌트 기본 구조 (Template)
   새 페이지를 만들 때 이 기본 틀을 사용합니다.

JavaScript

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import './AppleDesign.css';

const NewPageName = () => {
const navigate = useNavigate();

    return (
        <div className="apple-layout">
            <div className="apple-container">
                
                {/* 0. 네비게이션 (뒤로가기) */}
                <div style={{ marginBottom: '10px' }}>
                     <button onClick={() => navigate(-1)} style={{/* 스타일 생략 (인라인 or 클래스) */}}>
                        ‹ 뒤로
                    </button>
                </div>

                {/* 1. 헤더 */}
                <div className="apple-header">
                    <h1 className="apple-title">페이지 제목</h1>
                    <p className="apple-subtitle">페이지에 대한 설명이 들어갑니다.</p>
                </div>

                {/* 2. 메인 컨텐츠 카드 */}
                <div className="apple-card">
                    {/* 내용 작성 */}
                </div>

            </div>
        </div>
    );
};

export default NewPageName;
3. 주요 기능 로직 패턴
   (1) 소셜 로그인 (OAuth2) 리다이렉트
   Axios가 아닌 window.location.href를 사용해야 합니다.

JavaScript

const handleSocialLogin = (provider) => {
// provider: 'google' | 'naver'
const BASE_URL = "http://localhost:8080";

    if (provider === 'google') {
        window.location.href = `${BASE_URL}/oauth2/authorization/google`;
    } else if (provider === 'naver') {
        window.location.href = `${BASE_URL}/oauth2/authorization/naver`;
    }
};
(2) 날짜 포맷팅 (YYYY. MM. DD.)
JavaScript

const formatDate = (dateString) => {
const date = new Date(dateString);
// 월(Month)은 0부터 시작하므로 +1 필수
return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
};
🤖 AI에게 요청할 때 사용법
다음에 디자인 작업이 필요할 때, 프롬프트 서두에 이렇게 말해주세요:

"지금 Project Design System 문서를 참고해서, [회원가입/일기쓰기/설정] 페이지를 만들어줘. CSS 클래스는 AppleDesign.css에 정의된 것을 사용하고, 레이아웃 구조를 맞춰줘."

이렇게 하면 제가 찰떡같이 알아듣고 완벽하게 일치하는 코드를 짜드리겠습니다! 고생 많으셨어요! 👍