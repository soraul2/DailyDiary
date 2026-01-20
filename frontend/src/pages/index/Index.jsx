// src/pages/index/Index.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h1>메인 페이지 (Index)</h1>
            <p>여기서 페이지 이동 테스트를 해보세요.</p>
            <hr />

            <h3>유저 메뉴</h3>
            <ul>
                <li><Link to="/login">로그인 하러 가기 (/login)</Link></li>
                <li><Link to="/join">회원가입 하러 가기 (/join)</Link></li>
            </ul>

            <h3>일기장 메뉴</h3>
            <ul>
                <li><Link to="/diaries">일기 목록 보기 (/diaries)</Link></li>
                <li><Link to="/diaries/save">일기 쓰기 (/diaries/save)</Link></li>
                {/* 테스트를 위해 임의의 ID 1번을 넣어서 보냅니다 */}
                <li><Link to="/diaries/1">1번 일기 상세 보기 (/diaries/1)</Link></li>
                <li><Link to="/diaries/update/1">1번 일기 수정하기 (/diaries/update/1)</Link></li>
            </ul>
        </div>
    );
};

export default Index;