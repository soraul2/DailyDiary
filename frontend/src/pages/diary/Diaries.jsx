import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import '../../AppleDesign.css'; // Global CSS가 main.jsx에 없다면 주석 해제

const Diaries = () => {
    const navigate = useNavigate();

    // 1. 상태 관리
    const [diaries, setDiaries] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0); // API는 0부터 시작
    const [isLoading, setIsLoading] = useState(false);

    // 기분 코드 -> 이모지 변환 맵
    const moodEmoji = {
        'HAPPY': '😊',
        'EXCITED': '😆',
        'NEUTRAL': '😐',
        'SAD': '😭',
        'ANGRY': '😡'
    };

    // 2. 데이터 가져오기 (API 호출)
    const fetchDiaries = async (page) => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/diaries', {
                params: {
                    page: page, // 0-based index
                    size: 10,   // 페이지당 10개
                    sort: 'createdAt,desc' // 최신순 정렬
                },
                withCredentials: true
            });

            const data = response.data;
            setDiaries(data.content);      // 실제 일기 데이터 리스트
            setTotalPages(data.totalPages); // 전체 페이지 수
        } catch (error) {
            console.error("일기 목록 불러오기 실패:", error);
            alert("목록을 불러오는 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    // 페이지 변경 시마다 데이터 다시 로드
    useEffect(() => {
        fetchDiaries(currentPage);
    }, [currentPage]);

    // 날짜 포맷팅 함수 (예: 2024. 01. 21.)
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
    };

    // 페이지 변경 핸들러
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
            window.scrollTo(0, 0); // 페이지 이동 시 맨 위로 스크롤
        }
    };

    return (
        <div className="apple-layout">
            <div className="apple-container">

                {/* 0. [추가됨] 상단 네비게이션 (홈으로) */}
                <div style={{ marginBottom: '10px' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#007AFF', // Apple Blue
                            fontSize: '16px',
                            cursor: 'pointer',
                            padding: '0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: '500'
                        }}
                    >
                        ‹ 홈으로
                    </button>
                </div>

                {/* 1. 헤더 영역 */}
                <div className="apple-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
                    <div style={{ textAlign: 'left' }}>
                        <h1 className="apple-title">나의 일기</h1>
                        <p className="apple-subtitle">기록된 추억들을 모아보세요.</p>
                    </div>
                    {/* 글쓰기 버튼 (우측 상단 배치) */}
                    <button
                        className="apple-button"
                        onClick={() => navigate('/diaries/save')}
                        style={{ width: 'auto', padding: '10px 20px', fontSize: '15px', marginTop: '0' }}
                    >
                        + 새 일기
                    </button>
                </div>

                {/* 2. 일기 리스트 영역 */}
                <div className="apple-card" style={{ padding: '0' }}> {/* 리스트 스타일이라 패딩 제거 */}
                    {isLoading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#86868B' }}>
                            로딩 중...
                        </div>
                    ) : diaries.length === 0 ? (
                        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#86868B' }}>
                            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📭</div>
                            <p>아직 작성된 일기가 없어요.<br/>첫 번째 일기를 작성해보세요!</p>
                        </div>
                    ) : (
                        <div>
                            {diaries.map((diary, index) => (
                                <div
                                    key={diary.id}
                                    onClick={() => navigate(`/diaries/${diary.id}`)} // 상세 페이지 이동
                                    style={{
                                        padding: '20px 24px',
                                        borderBottom: index !== diaries.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none', // 마지막 항목은 선 없음
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                    className="hover:bg-black/5"
                                >
                                    {/* 왼쪽: 이모지 + 내용 */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', overflow: 'hidden' }}>
                                        {/* 기분 이모지 */}
                                        <div style={{
                                            fontSize: '32px',
                                            backgroundColor: '#F5F5F7',
                                            width: '56px',
                                            height: '56px',
                                            borderRadius: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            {moodEmoji[diary.mood] || '❓'}
                                        </div>

                                        {/* 텍스트 정보 */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}>
                                            <h3 style={{
                                                margin: 0,
                                                fontSize: '17px',
                                                fontWeight: '600',
                                                color: '#1D1D1F',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                lineHeight: '22px' // [수정됨] 높이 고정으로 날짜 밀림 방지
                                            }}>
                                                {diary.subject}
                                            </h3>
                                            <span style={{ fontSize: '13px', color: '#86868B' }}>
                                                {formatDate(diary.createdAt)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 오른쪽: 화살표 아이콘 */}
                                    <div style={{ color: '#C7C7CC', fontSize: '20px' }}>›</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 3. 페이지네이션 (하단) */}
                {totalPages > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '30px' }}>
                        {/* 이전 버튼 */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            style={{
                                background: 'none', border: 'none', cursor: currentPage === 0 ? 'default' : 'pointer',
                                color: currentPage === 0 ? '#C7C7CC' : '#007AFF', fontSize: '15px'
                            }}
                        >
                            이전
                        </button>

                        {/* 페이지 번호들 */}
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i)}
                                    style={{
                                        width: '32px', height: '32px', borderRadius: '50%', border: 'none',
                                        backgroundColor: currentPage === i ? '#007AFF' : 'transparent',
                                        color: currentPage === i ? '#fff' : '#1D1D1F',
                                        fontWeight: currentPage === i ? '600' : '400',
                                        cursor: 'pointer', fontSize: '14px'
                                    }}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        {/* 다음 버튼 */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                            style={{
                                background: 'none', border: 'none', cursor: currentPage === totalPages - 1 ? 'default' : 'pointer',
                                color: currentPage === totalPages - 1 ? '#C7C7CC' : '#007AFF', fontSize: '15px'
                            }}
                        >
                            다음
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Diaries;