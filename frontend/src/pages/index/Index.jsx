import React from 'react';
import { Link } from 'react-router-dom';
// main.jsx에 전역으로 import 안 되어 있다면 아래 주석 해제
// import '../../AppleDesign.css';

const Index = () => {
    return (
        <div className="apple-layout">
            <div className="apple-container">

                {/* 1. 헤더 영역 */}
                <div className="apple-header">
                    <h1 className="apple-title">개발자 메뉴</h1>
                    <p className="apple-subtitle">
                        페이지 이동 테스트를 위한 인덱스입니다.<br/>
                        원하는 메뉴를 선택하세요.
                    </p>
                </div>

                {/* 2. 유저 관리 카드 */}
                <div className="apple-card" style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1D1D1F' }}>
                        👤 유저 관리
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <Link to="/login">
                            <button className="apple-button">
                                로그인
                            </button>
                        </Link>
                        <Link to="/join">
                            {/* 회원가입은 보조 버튼 느낌으로 (회색 배경) */}
                            <button className="apple-button" style={{ backgroundColor: '#E5E5EA', color: '#1D1D1F' }}>
                                회원가입
                            </button>
                        </Link>
                    </div>
                </div>

                {/* 3. 일기장 관리 카드 */}
                <div className="apple-card">
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1D1D1F' }}>
                        📖 일기장 기능
                    </h3>

                    {/* 주요 기능 버튼 */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                        <Link to="/diaries">
                            <button className="apple-button" style={{ backgroundColor: '#FF9500' }}>
                                목록 보기
                            </button>
                        </Link>
                        <Link to="/diaries/save">
                            <button className="apple-button" style={{ backgroundColor: '#34C759' }}>
                                일기 쓰기
                            </button>
                        </Link>
                    </div>

                    {/* 테스트용 링크 영역 (회색 박스) */}
                    <div style={{ padding: '16px', backgroundColor: '#F5F5F7', borderRadius: '16px' }}>
                        <p style={{ fontSize: '13px', color: '#86868B', marginBottom: '10px', fontWeight: '600' }}>
                            🛠 테스트용 바로가기 (ID: 1)
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Link to="/diaries/1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none', color: '#1D1D1F', fontSize: '15px' }}>
                                <span>📄 1번 일기 상세</span>
                                <span style={{ color: '#C7C7CC' }}>›</span>
                            </Link>
                            <div style={{ height: '1px', backgroundColor: '#E5E5EA' }}></div>
                            <Link to="/diaries/update/1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none', color: '#1D1D1F', fontSize: '15px' }}>
                                <span>✏️ 1번 일기 수정</span>
                                <span style={{ color: '#C7C7CC' }}>›</span>
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Index;